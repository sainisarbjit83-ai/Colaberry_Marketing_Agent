// Phase 2 software tests, per component: system prompt, context manager, planner, memory and
// human review. Software tests only; classification quality is the separate Phase 3 evaluation.
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { req, freshDb } = require('./helpers');

const SP = req('components/system-prompt');
const { createContext, ContextError } = req('components/context');
const PL = req('components/planner');
const { createMemory } = req('components/memory');
const { ReviewError } = req('components/review');
const { createAgent } = req('agent');
const g = req('components/guardrails');
const P = req('components/llm/provider');

const FIXED = () => new Date('2026-11-20T15:00:00Z');
const TOOL_NAMES = ['retrieve', 'normalize', 'dedupe', 'rank', 'classify', 'report'];
const goodPrompt = () => JSON.parse(fs.readFileSync(SP.DEFAULT_FILE, 'utf8'));

// ---------- System prompt ----------
test('system prompt: loads from its own config file with version, hash and instructions', () => {
  const p = SP.loadSystemPrompt();
  assert.equal(p.file, 'system-prompt.json');
  assert.match(p.version, /^\d+\.\d+\.\d+/);
  assert.match(p.hash, /^[0-9a-f]{12}$/);
  assert.ok(p.instructions.length >= 1);
  assert.throws(() => { p.instructions.push('x'); }, TypeError, 'loaded prompt is frozen');
});

test('system prompt: trace view discloses that the simulated provider does not interpret it', () => {
  const p = SP.loadSystemPrompt();
  for (const cfg of [P.DEFAULT_CONFIG, { provider: 'real', real: { enabled: true } }]) {
    const v = SP.traceView(p, P.createProvider(cfg).describe());
    assert.equal(v.interpretedByProvider, false);
    assert.match(v.disclosure, /simulated provider does not read or interpret/);
    assert.deepEqual(v.instructions, [...p.instructions]);
    assert.equal(v.version, p.version);
  }
});

test('system prompt: validation rejects malformed configurations', () => {
  const bad = (mut) => { const p = goodPrompt(); mut(p); return () => SP.validateSystemPrompt(p); };
  assert.throws(bad((p) => delete p.version), SP.SystemPromptError);
  assert.throws(bad((p) => { p.version = 'v1'; }), /not of the form/);
  assert.throws(bad((p) => { p.instructions = []; }), /Instructions/);
  assert.throws(bad((p) => { p.labels.buying = 'Hot lead'; }), /labels must match/);
  assert.throws(bad((p) => { p.disclosure = 'All good.'; }), /disclosure/);
  assert.equal(SP.validateSystemPrompt(goodPrompt()).id, 'social-signal-discovery-demo');
});

test('system prompt: a missing or invalid file is refused with a clear error', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ssd-sp-'));
  try {
    assert.throws(() => SP.loadSystemPrompt(path.join(dir, 'nope.json')), /Cannot read the system prompt/);
    fs.writeFileSync(path.join(dir, 'bad.json'), '{ not json');
    assert.throws(() => SP.loadSystemPrompt(path.join(dir, 'bad.json')), /not valid JSON/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

// ---------- Context manager ----------
test('context: defaults to all approved platforms and derives keywords from the question', () => {
  const c = createContext({ question: '  Who is looking for AI training?  ' });
  assert.equal(c.request.question, 'Who is looking for AI training?');
  assert.deepEqual(c.request.keywords, ['looking', 'ai', 'training']);
  assert.equal(c.request.keywordSource, 'derived from the question');
  assert.deepEqual([...c.request.platforms], g.SCOPE.approved_platforms);
  assert.equal(c.request.maxResults, 20);
  assert.ok(Object.isFrozen(c.request));
});

test('context: normalizes provided keywords and accepts filters', () => {
  const c = createContext({ question: 'q', keywords: [' AI ', 'ai', 'Budget'], platforms: ['Reddit'], dateFrom: '2026-11-01', dateTo: '2026-11-30', maxResults: 5 });
  assert.deepEqual(c.request.keywords, ['ai', 'budget']);
  assert.deepEqual(c.request.platforms, ['Reddit']);
  assert.equal(c.request.dateFrom, '2026-11-01');
});

test('context: rejects excluded and unknown platforms', () => {
  assert.throws(() => createContext({ question: 'q', platforms: ['Reddit', 'X'] }), (e) => e.name === 'GuardrailViolation' && e.rule === 'platform_scope' && /X is explicitly excluded/.test(e.message));
  assert.throws(() => createContext({ question: 'q', platforms: ['Facebook Groups'] }), /explicitly excluded/);
  assert.throws(() => createContext({ question: 'q', platforms: ['Friendster'] }), (e) => e.rule === 'platform_scope');
  assert.throws(() => createContext({ question: 'q', platforms: [] }), ContextError);
});

test('context: rejects invalid questions, keywords, dates and limits', () => {
  const bad = (input, re) => assert.throws(() => createContext(input), re);
  bad(null, /must be an object/);
  bad({ question: '   ' }, /question is required/);
  bad({ question: 'x'.repeat(301) }, /longer than 300/);
  bad({ question: 'q', keywords: 'ai' }, /must be a list/);
  bad({ question: 'q', keywords: [] }, /at least one keyword/);
  bad({ question: 'q', keywords: Array.from({ length: 9 }, (_, i) => `k${i}`) }, /At most 8/);
  bad({ question: 'q', keywords: ['x'.repeat(41)] }, /longer than 40/);
  bad({ question: 'q', dateFrom: '2026-02-30' }, /real date/);
  bad({ question: 'q', dateFrom: '2026-12-01', dateTo: '2026-11-01' }, /after dateTo/);
  bad({ question: 'q', maxResults: 0 }, /maxResults/);
});

test('context: preserves step outputs across workflow steps', () => {
  const c = createContext({ question: 'ai training' });
  c.put('retrieve', ['S-001'], '1 found');
  c.put('rank', ['S-001'], '1 ranked');
  assert.deepEqual(c.get('retrieve'), ['S-001']);
  assert.equal(c.has('classify'), false);
  assert.deepEqual(c.snapshot().steps, [{ step: 'retrieve', summary: '1 found' }, { step: 'rank', summary: '1 ranked' }]);
});

// ---------- Planner ----------
test('planner: decomposes a request into eleven visible, planned subtasks', () => {
  const tasks = PL.plan(createContext({ question: 'ai training' }), { toolNames: TOOL_NAMES });
  assert.equal(tasks.length, 11);
  assert.ok(tasks.every((t) => t.status === 'planned' && t.purpose));
  assert.deepEqual(tasks.filter((t) => !t.critical).map((t) => t.name), ['recall_memory', 'apply_memory', 'save_memory']);
  assert.deepEqual(tasks.map((t) => t.seq), tasks.map((_, i) => i + 1));
});

test('planner: fails with a reason when there is nothing to search or a tool is missing', () => {
  assert.throws(() => PL.plan(createContext({ question: 'Where are we on this?' }), { toolNames: TOOL_NAMES }), (e) => e.name === 'PlanningError' && e.code === 'no_keywords');
  assert.throws(() => PL.plan(createContext({ question: 'ai' }), { toolNames: ['retrieve'] }), (e) => e.code === 'missing_tool' && /normalize/.test(e.message));
});

test('planner: tracks planned, running, completed, failed and skipped, and refuses impossible moves', () => {
  const [a, b, c] = PL.plan(createContext({ question: 'ai' }), { toolNames: TOOL_NAMES });
  PL.transition(a, 'running'); PL.transition(a, 'completed', { detail: 'ok' });
  PL.transition(b, 'running'); PL.transition(b, 'failed', { error: 'boom' });
  PL.transition(c, 'skipped', { detail: 'stopped' });
  assert.deepEqual([a.status, b.status, c.status], ['completed', 'failed', 'skipped']);
  assert.throws(() => PL.transition(a, 'running'), /cannot go from completed/);
  assert.throws(() => PL.transition(c, 'bogus'), RangeError);
  assert.deepEqual(PL.STATES, ['planned', 'running', 'completed', 'failed', 'skipped']);
});

test('planner: the task store saves and updates task state in SQLite', () => {
  const db = freshDb();
  db.prepare("INSERT INTO research_runs VALUES ('R1','q','{}','running','simulated-rules',NULL,NULL,'now')").run();
  const store = PL.createTaskStore(db);
  const tasks = PL.plan(createContext({ question: 'ai' }), { toolNames: TOOL_NAMES });
  store.save('R1', tasks);
  PL.transition(tasks[0], 'running'); PL.transition(tasks[0], 'completed', { detail: 'done' }); store.update('R1', tasks[0]);
  const rows = store.read('R1');
  assert.equal(rows.length, 11);
  assert.deepEqual([rows[0].status, rows[0].detail, rows[1].status], ['completed', 'done', 'planned']);
});

// ---------- Memory ----------
test('memory: saves a run and recalls it for a later run sharing a keyword', () => {
  const m = createMemory(freshDb(), FIXED);
  m.saveRun({ runId: 'RUN-0001', request: { question: 'q1', keywords: ['ai', 'training'], platforms: ['Reddit'] }, counts: { buying: 1, general: 0, none: 0 }, resultIds: ['S-001', 'S-005'] });
  m.saveRun({ runId: 'RUN-0002', request: { question: 'q2', keywords: ['cooking'], platforms: ['Reddit'] }, counts: { buying: 0, general: 0, none: 1 }, resultIds: ['S-006'] });
  const r = m.recall({ keywords: ['training', 'budget'], excludeRunId: 'RUN-0003' });
  assert.deepEqual(r.priorRuns.map((x) => [x.runId, x.sharedKeywords]), [['RUN-0001', ['training']]]);
  assert.deepEqual(r.processedIds, ['S-001', 'S-005', 'S-006']);
  assert.deepEqual(m.recall({ keywords: ['ai'], excludeRunId: 'RUN-0001' }).priorRuns, []);
});

test('memory: saving is idempotent; feedback returns the latest decision per record', () => {
  const m = createMemory(freshDb(), FIXED);
  const run = { runId: 'RUN-0001', request: { question: 'q', keywords: ['ai'], platforms: [] }, counts: {}, resultIds: ['S-001'] };
  m.saveRun(run); m.saveRun(run);
  assert.equal(m.inspect().length, 2);
  m.saveFeedback({ reviewId: 'REV:a', runId: 'RUN-0001', signalId: 'S-001', decision: 'approve', decidedAt: '2026-11-20T10:00:00Z' });
  m.saveFeedback({ reviewId: 'REV:b', runId: 'RUN-0002', signalId: 'S-001', decision: 'reject', decidedAt: '2026-11-20T11:00:00Z' });
  assert.equal(m.feedbackFor(['S-001', 'S-002'])['S-001'].decision, 'reject');
  assert.equal(m.feedbackFor(['S-002'])['S-002'], undefined);
});

test('memory: inspect and clear, all or by kind', () => {
  const m = createMemory(freshDb(), FIXED);
  m.saveRun({ runId: 'R', request: { question: 'q', keywords: ['ai'], platforms: [] }, counts: {}, resultIds: [] });
  m.saveFeedback({ reviewId: 'REV:x', runId: 'R', signalId: 'S-001', decision: 'approve', decidedAt: 't' });
  assert.deepEqual(m.inspect().map((x) => x.kind), ['run_summary', 'processed_ids', 'feedback']);
  assert.equal(m.inspect({ kind: 'feedback' }).length, 1);
  assert.throws(() => m.inspect({ kind: 'secrets' }), RangeError);
  assert.deepEqual(m.clear({ kind: 'feedback' }), { cleared: 1 });
  assert.deepEqual(m.clear(), { cleared: 2 });
  assert.equal(m.inspect().length, 0);
});

// ---------- Human review ----------
function reviewed() {
  const db = freshDb();
  const agent = createAgent({ db, clock: FIXED });
  const trace = agent.run({ question: 'ai training', keywords: ['ai', 'training'] });
  const id = (sid) => trace.results.find((r) => r.signalId === sid).resultId;
  return { db, agent, trace, id };
}

test('review: every classified result starts pending', () => {
  const { agent, trace } = reviewed();
  assert.ok(trace.results.length > 0);
  assert.equal(agent.review.pendingFor(trace.runId).length, trace.results.length);
  assert.deepEqual(trace.pendingReviews.map((p) => p.resultId), trace.results.map((r) => r.resultId));
});

test('review: approve, reject and correct are persisted and fed to memory', () => {
  const { db, agent, id } = reviewed();
  const a = agent.review.decide(id('S-005'), { decision: 'approve', note: 'Clear training request.', reviewer: 'Demo Reviewer' });
  const r = agent.review.decide(id('S-002'), { decision: 'reject', note: 'Governance question, not a purchase.', reviewer: 'Demo Reviewer' });
  const c = agent.review.decide(id('S-001'), { decision: 'correct', correctedLabel: 'general', note: 'Small team; interest only.', reviewer: 'Demo Reviewer' });
  assert.deepEqual([a.status, r.status, c.status], ['approved', 'rejected', 'corrected']);
  assert.equal(c.correctedLabel, 'General AI interest');
  assert.equal(c.originalLabel, 'Potential enterprise AI buying signal');
  const rows = db.prepare('SELECT result_id, decision, corrected_label, note FROM review_decisions ORDER BY result_id').all();
  assert.equal(rows.length, 3);
  assert.equal(db.prepare("SELECT review_status s FROM run_results WHERE id = ?").get(id('S-001')).s, 'corrected');
  assert.deepEqual(Object.keys(agent.memory.feedbackFor(['S-001', 'S-002', 'S-005'])).sort(), ['S-001', 'S-002', 'S-005']);
  assert.equal(agent.review.get(id('S-001')).decision.note, 'Small team; interest only.');
});

test('review: a correction needs a different label; every decision needs a note and a reviewer', () => {
  const { agent, id } = reviewed();
  const rid = id('S-001');
  const bad = (input, code) => assert.throws(() => agent.review.decide(rid, input), (e) => e instanceof ReviewError && e.code === code);
  bad({ decision: 'correct', note: 'n', reviewer: 'r' }, 'label_required');
  bad({ decision: 'correct', correctedLabel: 'Hot lead', note: 'n', reviewer: 'r' }, 'label_required');
  bad({ decision: 'correct', correctedLabel: 'buying', note: 'n', reviewer: 'r' }, 'label_unchanged');
  bad({ decision: 'approve', note: '', reviewer: 'r' }, 'note_required');
  bad({ decision: 'approve', note: 'n' }, 'reviewer_required');
  bad({ decision: 'approve', correctedLabel: 'none', note: 'n', reviewer: 'r' }, 'unexpected_label');
  bad({ decision: 'publish', note: 'n', reviewer: 'r' }, 'bad_decision');
  assert.throws(() => agent.review.decide('RUN-9999:S-001', { decision: 'approve', note: 'n', reviewer: 'r' }), (e) => e.code === 'not_found');
  assert.equal(agent.review.get(rid).status, 'pending', 'nothing was recorded by the refused attempts');
});

test('review: repeating the same decision is a no-op; changing a decision is refused', () => {
  const { db, agent, id } = reviewed();
  const input = { decision: 'approve', note: 'ok', reviewer: 'Demo Reviewer' };
  assert.equal(agent.review.decide(id('S-005'), input).alreadyRecorded, false);
  assert.equal(agent.review.decide(id('S-005'), input).alreadyRecorded, true);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM review_decisions').get().n, 1);
  assert.throws(() => agent.review.decide(id('S-005'), { ...input, decision: 'reject' }), (e) => e.code === 'already_decided');
});

test('review: approval triggers no external action and writes only local review state', () => {
  const { db, agent, id } = reviewed();
  const count = (t) => db.prepare(`SELECT COUNT(*) n FROM ${t}`).get().n;
  const untouched = ['sample_signals', 'research_runs', 'research_tasks', 'run_results', 'evaluation_results'];
  const before = Object.fromEntries(untouched.map((t) => [t, count(t)]));
  const attempts = [];
  const uninstall = g.installNetworkBlock((e) => attempts.push(e));
  let out;
  try { out = agent.review.decide(id('S-005'), { decision: 'approve', note: 'Approve for the demo.', reviewer: 'Demo Reviewer' }); } finally { uninstall(); }
  assert.deepEqual(out.externalActions, []);
  assert.deepEqual(attempts, []);
  assert.deepEqual(Object.fromEntries(untouched.map((t) => [t, count(t)])), before);
  assert.equal(count('review_decisions'), 1);
});
