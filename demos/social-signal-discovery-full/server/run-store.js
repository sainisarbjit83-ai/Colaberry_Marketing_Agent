/*
 * Read-only views of stored runs and review decisions, for the UI's history, trace and audit
 * screens. Everything is reconstructed from the local SQLite tables; nothing is written here.
 */
'use strict';

function createRunStore(db) {
  function list() {
    return db.prepare(`SELECT r.id, r.question, r.status, r.provider, r.created_at, r.finished_at,
        (SELECT COUNT(*) FROM run_results x WHERE x.run_id = r.id) AS results,
        (SELECT COUNT(*) FROM run_results x WHERE x.run_id = r.id AND x.review_status = 'pending') AS pending
      FROM research_runs r ORDER BY r.id DESC`).all()
      .map((r) => ({ runId: r.id, question: r.question, status: r.status, provider: r.provider, createdAt: r.created_at, finishedAt: r.finished_at, results: Number(r.results), pending: Number(r.pending) }));
  }

  function get(runId) {
    const run = db.prepare('SELECT * FROM research_runs WHERE id = ?').get(runId);
    if (!run) return null;
    const tasks = db.prepare('SELECT seq, name, status, detail, error FROM research_tasks WHERE run_id = ? ORDER BY seq').all(runId).map((t) => ({ ...t }));
    const results = db.prepare(`SELECT rr.id, rr.signal_id, rr.rank, rr.score, rr.code, rr.label, rr.evidence_json, rr.reasoning_json, rr.review_status,
        s.title, s.platform, s.url, s.post_date, rd.decision, rd.corrected_label, rd.note, rd.reviewer, rd.decided_at
      FROM run_results rr JOIN sample_signals s ON s.id = rr.signal_id LEFT JOIN review_decisions rd ON rd.result_id = rr.id
      WHERE rr.run_id = ? ORDER BY rr.rank`).all(runId).map((r) => ({
      resultId: r.id, signalId: r.signal_id, rank: r.rank, score: r.score, code: r.code, label: r.label, title: r.title, platform: r.platform,
      source: { id: r.signal_id, platform: r.platform, url: r.url, post_date: r.post_date, sample: true },
      evidence: JSON.parse(r.evidence_json), reasoning: JSON.parse(r.reasoning_json), reviewStatus: r.review_status,
      decision: r.decision ? { decision: r.decision, correctedLabel: r.corrected_label, note: r.note, reviewer: r.reviewer, decidedAt: r.decided_at } : null,
    }));
    const prompt = db.prepare("SELECT detail_json FROM execution_logs WHERE run_id = ? AND component = 'system_prompt' ORDER BY id LIMIT 1").get(runId);
    const decisions = db.prepare("SELECT detail_json FROM execution_logs WHERE run_id = ? AND event = 'decision' ORDER BY id").all(runId).map((d) => JSON.parse(d.detail_json).text);
    return {
      runId, question: run.question, status: run.status, provider: run.provider, createdAt: run.created_at, finishedAt: run.finished_at,
      request: JSON.parse(run.context_json || '{}'), systemPrompt: prompt ? JSON.parse(prompt.detail_json) : null, decisions, tasks, results,
    };
  }

  /** Every review decision ever recorded: the audit history, which clearing memory does not touch. */
  function reviews() {
    return db.prepare(`SELECT rd.id, rd.result_id, rd.decision, rd.corrected_label, rd.note, rd.reviewer, rd.decided_at, rr.run_id, rr.signal_id, rr.label
      FROM review_decisions rd JOIN run_results rr ON rr.id = rd.result_id ORDER BY rd.decided_at DESC, rd.id`).all()
      .map((r) => ({ reviewId: r.id, resultId: r.result_id, runId: r.run_id, signalId: r.signal_id, decision: r.decision, originalLabel: r.label, correctedLabel: r.corrected_label, note: r.note, reviewer: r.reviewer, decidedAt: r.decided_at }));
  }

  return { list, get, reviews };
}

module.exports = { createRunStore };
