/*
 * The work behind each planned subtask, for one run. Each handler reads what earlier steps put in
 * the context, does one thing through the right component (registry tools, memory, review, local
 * database), stores its output in the context and returns a one-line summary for the plan.
 */
'use strict';

function createHandlers({ runId, context, registry, kb, memory, review, provider, validateOutput, checkEvidence, db, decide }) {
  const r = context.request;
  const deps = { kb, provider, validateOutput, checkEvidence };
  const tool = (name, input) => registry.invoke(name, input, deps, runId);
  const records = () => context.get('records') || [];
  const set = (step, value, summary, list) => { context.put(step, value, summary); if (list) context.put('records', list, `${list.length} record(s) carried forward`); return summary; };

  const handlers = {
    recall_memory() {
      const rec = memory.recall({ keywords: r.keywords, excludeRunId: runId });
      return set('recall', rec, `${rec.priorRuns.length} related earlier run(s); ${rec.processedIds.length} sample id(s) processed before.`);
    },
    retrieve() {
      const input = { terms: [...r.keywords], platforms: [...r.platforms] };
      if (r.dateFrom) input.dateFrom = r.dateFrom;
      if (r.dateTo) input.dateTo = r.dateTo;
      const { candidates } = tool('retrieve', input);
      if (!candidates.length) decide('No sample record matched; record-dependent steps will be skipped.');
      return set('retrieve', candidates.map((c) => c.id), `${candidates.length} candidate record(s) found.`, candidates);
    },
    normalize() {
      const out = tool('normalize', { records: records() }).records;
      return set('normalize', out.length, `${out.length} record(s) normalized.`, out);
    },
    dedupe() {
      const { unique, duplicates } = tool('dedupe', { records: records() });
      return set('duplicates', duplicates, `${duplicates.length} duplicate(s) removed; ${unique.length} unique.`, unique);
    },
    rank() {
      const { ranked } = tool('rank', { records: records(), terms: [...r.keywords] });
      const kept = ranked.slice(0, r.maxResults);
      if (kept.length < ranked.length) decide(`Kept the top ${kept.length} of ${ranked.length} ranked records (maxResults).`);
      return set('rank', kept.map((x) => x.id), `${ranked.length} ranked; top ${kept.length} kept.`, kept);
    },
    classify() {
      const { classified } = tool('classify', { records: records() });
      const n = (c) => classified.filter((x) => x.classification.code === c).length;
      return set('classify', classified.length, `${n('buying')} potential buying, ${n('general')} general, ${n('none')} not relevant (${provider.describe().name}).`, classified);
    },
    apply_memory() {
      const recalled = context.get('recall') || { processedIds: [] };
      const seen = new Set(recalled.processedIds);
      const fb = memory.feedbackFor(records().map((x) => x.id));
      const out = records().map((x) => ({ ...x, seenBefore: seen.has(x.id), priorReview: fb[x.id] || null }));
      const withFb = out.filter((x) => x.priorReview).length;
      if (withFb) decide(`${withFb} record(s) have an earlier human review decision; shown alongside the new classification, which is not changed.`);
      return set('apply_memory', withFb, `${out.filter((x) => x.seenBefore).length} seen before; ${withFb} with an earlier review decision.`, out);
    },
    persist_results() {
      const insert = db.prepare(`INSERT OR IGNORE INTO run_results (id, run_id, signal_id, rank, score, code, label, evidence_json, reasoning_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      db.exec('BEGIN');
      try {
        for (const x of records()) insert.run(`${runId}:${x.id}`, runId, x.id, x.rank, x.score, x.classification.code, x.classification.label, JSON.stringify(x.classification.evidence), JSON.stringify(x.classification.reasoning));
        db.exec('COMMIT');
      } catch (err) { db.exec('ROLLBACK'); throw err; }
      return set('persist_results', records().length, `${records().length} result(s) saved locally.`);
    },
    create_reviews() {
      const pending = review.pendingFor(runId);
      return set('reviews', pending, `${pending.length} result(s) waiting for human review.`);
    },
    report() {
      const rep = tool('report', { records: records().filter((x) => x.classification) });
      return set('report', rep, rep.summary);
    },
    save_memory() {
      const results = records().filter((x) => x.classification);
      const counts = { buying: 0, general: 0, none: 0 };
      for (const x of results) counts[x.classification.code] += 1;
      memory.saveRun({ runId, request: r, counts, resultIds: results.map((x) => x.id) });
      return set('save_memory', true, `Run summary and ${results.length} processed id(s) remembered.`);
    },
  };

  return {
    ...handlers,
    hasRecords: () => records().length > 0,
    /** The parts of the trace built from this run's step outputs. */
    output() {
      const classified = records().filter((x) => x.classification);
      return {
        recalled: context.get('recall') || null,
        duplicates: context.get('duplicates') || [],
        results: classified.map((x) => ({
          resultId: `${runId}:${x.id}`, signalId: x.id, rank: x.rank, score: x.score, title: x.title, platform: x.platform,
          code: x.classification.code, label: x.classification.label, ruleStrength: x.classification.rule_strength,
          evidence: x.classification.evidence, reasoning: x.classification.reasoning, source: kb.sourceRef(x),
          seenBefore: Boolean(x.seenBefore), priorReview: x.priorReview || null,
        })),
        pendingReviews: context.get('reviews') || [],
        report: context.get('report') || null,
      };
    },
  };
}

module.exports = { createHandlers };
