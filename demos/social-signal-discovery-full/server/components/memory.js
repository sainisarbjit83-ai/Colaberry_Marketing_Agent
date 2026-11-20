/*
 * Memory (component 5): what the agent remembers between runs, in the local memory_records table.
 *
 *   run_summary   - one per run: question, keywords, platforms, counts, result ids
 *   processed_ids - one per run: the sample record ids the run classified
 *   feedback      - one per human review decision, keyed by sample record id
 *
 * A later run recalls earlier runs that share a keyword, the records processed before, and any
 * review decision on a record it sees again. Saves are idempotent (fixed ids, INSERT OR REPLACE).
 * clear() empties memory; the review_decisions table itself is the audit trail and is kept.
 */
'use strict';

const { checkAction } = require('./guardrails');

const KINDS = Object.freeze(['run_summary', 'processed_ids', 'feedback']);

function createMemory(db, clock = () => new Date()) {
  const put = db.prepare('INSERT OR REPLACE INTO memory_records (id, kind, run_id, signal_id, content_json, created_at) VALUES (?, ?, ?, ?, ?, ?)');
  const rows = (kind) => db.prepare('SELECT * FROM memory_records WHERE kind = ? ORDER BY created_at, id').all(kind).map((r) => ({ ...r, content: JSON.parse(r.content_json) }));

  function saveRun({ runId, request, counts, resultIds }) {
    checkAction('write_local_memory');
    const at = clock().toISOString();
    put.run(`MEM:${runId}:summary`, 'run_summary', runId, null, JSON.stringify({ question: request.question, keywords: [...request.keywords], platforms: [...request.platforms], counts, resultIds }), at);
    put.run(`MEM:${runId}:processed`, 'processed_ids', runId, null, JSON.stringify({ ids: resultIds }), at);
    return { saved: [`MEM:${runId}:summary`, `MEM:${runId}:processed`] };
  }

  function saveFeedback(fb) {
    checkAction('write_local_memory');
    const id = `MEM:FB:${fb.reviewId}`;
    put.run(id, 'feedback', fb.runId, fb.signalId, JSON.stringify(fb), fb.decidedAt);
    return { saved: [id] };
  }

  /** Earlier runs sharing a keyword (most shared first), and every id processed before. */
  function recall({ keywords, excludeRunId = null }) {
    const wanted = new Set(keywords);
    const priorRuns = rows('run_summary')
      .filter((r) => r.run_id !== excludeRunId)
      .map((r) => ({ runId: r.run_id, question: r.content.question, keywords: r.content.keywords, sharedKeywords: r.content.keywords.filter((k) => wanted.has(k)), counts: r.content.counts, createdAt: r.created_at }))
      .filter((r) => r.sharedKeywords.length)
      .sort((a, b) => b.sharedKeywords.length - a.sharedKeywords.length || a.runId.localeCompare(b.runId));
    const processedIds = [...new Set(rows('processed_ids').filter((r) => r.run_id !== excludeRunId).flatMap((r) => r.content.ids))].sort();
    return { priorRuns, processedIds };
  }

  /** The latest review decision remembered for each of the given sample ids. */
  function feedbackFor(signalIds) {
    const want = new Set(signalIds);
    const out = {};
    for (const r of rows('feedback')) if (want.has(r.signal_id)) out[r.signal_id] = r.content; // ordered by time, so the latest wins
    return out;
  }

  function inspect({ kind } = {}) {
    if (kind !== undefined && !KINDS.includes(kind)) throw new RangeError(`Unknown memory kind "${kind}".`);
    return (kind ? [kind] : KINDS).flatMap(rows).map(({ id, kind: k, run_id, signal_id, content, created_at }) => ({ id, kind: k, runId: run_id, signalId: signal_id, content, createdAt: created_at }));
  }

  /** Delete remembered records (all, or one kind). Returns how many were removed. */
  function clear({ kind } = {}) {
    checkAction('write_local_memory');
    if (kind !== undefined && !KINDS.includes(kind)) throw new RangeError(`Unknown memory kind "${kind}".`);
    const res = kind ? db.prepare('DELETE FROM memory_records WHERE kind = ?').run(kind) : db.prepare('DELETE FROM memory_records').run();
    return { cleared: Number(res.changes) };
  }

  return { saveRun, saveFeedback, recall, feedbackFor, inspect, clear };
}

module.exports = { createMemory, KINDS };
