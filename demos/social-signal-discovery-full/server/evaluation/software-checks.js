/*
 * Software / workflow correctness checks: does the demo behave as designed?
 *
 * These are NOT a measure of classification quality. They pass when the workflow does what it is
 * built to do (evidence is valid, duplicates are removed, out-of-scope requests are refused, ...)
 * whether or not a classification is right. Each check builds its own throwaway in-memory database,
 * so running them never adds runs, reviews or memory to the database being evaluated.
 */
'use strict';

const { open } = require('../db');
const { TOOLS } = require('../components/tools');
const { checkEvidence } = require('../components/guardrails');

const FIXED = () => new Date('2026-11-20T15:00:00Z');
const BROAD = { question: 'Who is looking for AI training programs for their team?' };

const CHECKS = [
  ['pipeline_completes', 'A normal research run completes every planned subtask.', (mk) => {
    const t = mk().run(BROAD);
    const bad = t.plan.filter((x) => x.status !== 'completed').map((x) => x.name);
    return [t.status === 'completed' && !bad.length, `status ${t.status}; ${t.plan.length - bad.length}/${t.plan.length} subtasks completed`];
  }],
  ['evidence_valid', 'Every result cites evidence found at the stated position in its record.', (mk) => {
    const db = open(':memory:').db;
    const t = mk({ db }).run(BROAD);
    const get = db.prepare('SELECT * FROM sample_signals WHERE id = ?');
    const bad = t.results.filter((r) => { try { return !checkEvidence({ code: r.code, evidence: r.evidence }, get.get(r.signalId)); } catch { return true; } });
    return [t.results.length > 0 && !bad.length, `${t.results.length - bad.length}/${t.results.length} results have valid evidence`];
  }],
  ['citations_complete', 'The report cites every result, and every citation is a stored sample record.', (mk) => {
    const db = open(':memory:').db;
    const t = mk({ db }).run(BROAD);
    const known = new Set(db.prepare('SELECT id FROM sample_signals').all().map((r) => r.id));
    const same = JSON.stringify(t.report.citations) === JSON.stringify(t.results.map((r) => r.signalId));
    return [same && t.report.citations.every((c) => known.has(c)), `${t.report.citations.length} citations`];
  }],
  ['duplicates_removed', 'Same-URL and re-shared-title duplicates are removed with the reason.', (mk) => {
    const d = mk().run(BROAD).duplicates;
    const ok = d.some((x) => x.id === 'S-009' && x.kind === 'same_url') && d.some((x) => x.id === 'S-019' && x.kind === 'same_title');
    return [ok, d.map((x) => `${x.id}:${x.kind}`).join(', ') || 'none removed'];
  }],
  ['excluded_platform_rejected', 'A request naming an excluded platform is rejected before planning.', (mk) => {
    const t = mk().run({ question: 'ai training', platforms: ['LinkedIn comments'] });
    return [t.status === 'rejected' && t.error.rule === 'platform_scope', `status ${t.status}`];
  }],
  ['planning_failure_handled', 'A request with nothing to search fails planning with a reason.', (mk) => {
    const t = mk().run({ question: 'Where are we on this?' });
    return [t.status === 'failed' && t.error.code === 'no_keywords', `status ${t.status}; ${t.error && t.error.code}`];
  }],
  ['real_provider_refuses', 'The real LLM adapter stays disabled and the run stops safely.', (mk) => {
    const t = mk({ providerConfig: { provider: 'real', real: { enabled: true } } }).run({ question: 'ai training' });
    return [t.status === 'failed' && t.error.class === 'ProviderDisabledError', `status ${t.status}; ${t.error && t.error.class}`];
  }],
  ['network_blocked', 'A tool that tries to reach the network is blocked and the run stops.', (mk) => {
    const tools = TOOLS.map((x) => (x.name !== 'normalize' ? x : { ...x, run: () => { globalThis.fetch('http://127.0.0.1:1/'); return { records: [] }; } })); // loopback, closed port: never external
    const t = mk({ tools }).run({ question: 'ai training' });
    return [t.status === 'blocked' && t.error.rule === 'network_blocked', `status ${t.status}; ${t.error && t.error.rule}`];
  }],
  ['review_no_external_action', 'Approving a result records a decision and takes no external action.', (mk) => {
    const agent = mk();
    const t = agent.run({ question: 'ai training' });
    const d = agent.review.decide(t.results[0].resultId, { decision: 'approve', note: 'Software check.', reviewer: 'Evaluation' });
    return [d.status === 'approved' && d.externalActions.length === 0, `status ${d.status}; ${d.externalActions.length} external actions`];
  }],
  ['memory_recall', 'A second run recalls the first run that shared a keyword.', (mk) => {
    const agent = mk();
    agent.run({ question: 'q1', keywords: ['ai', 'training'] });
    const t = agent.run({ question: 'q2', keywords: ['training'] });
    return [t.recalled.priorRuns.length === 1 && t.recalled.priorRuns[0].runId === 'RUN-0001', `${t.recalled.priorRuns.length} prior run(s) recalled`];
  }],
  ['deterministic_run', 'The same request on a fresh database gives an identical trace.', (mk) => {
    const same = JSON.stringify(mk().run(BROAD)) === JSON.stringify(mk().run(BROAD));
    return [same, same ? 'traces identical' : 'traces differ'];
  }],
];

/** Run every check with a fresh agent per check. A thrown error fails that check, never the suite. */
function runSoftwareChecks(createAgent) {
  const mk = (opts = {}) => createAgent({ db: open(':memory:').db, clock: FIXED, ...opts });
  return CHECKS.map(([id, description, fn]) => {
    try {
      const [passed, detail] = fn(mk);
      return { id, description, passed: Boolean(passed), detail };
    } catch (err) {
      return { id, description, passed: false, detail: `${err.name}: ${err.message}` };
    }
  });
}

module.exports = { runSoftwareChecks, CHECK_IDS: CHECKS.map(([id]) => id) };
