// Phase 4 end-to-end API tests against the real server process (started with the documented
// command, a temp database and a free port). Covers the full workflow, rejected inputs, blocked
// actions, localhost-only protections and persistence across a server restart.
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { startServer, call, REPO } = require('./e2e-helpers');

let srv;
test.before(async () => { srv = await startServer(); });
test.after(async () => { if (srv) { await srv.stop(); fs.rmSync(srv.dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } });

const get = (p) => call(srv.base, 'GET', p);
const post = (p, body) => call(srv.base, 'POST', p, body === undefined ? {} : body);

test('e2e api: the full workflow, from first run to evaluation and logs', async () => {
  // Overview: labelled as a local demo, simulated provider, 13 components.
  const o = (await get('/api/overview')).json;
  assert.match(o.demo, /Fictional sample records only/);
  assert.equal(o.provider.isRealLlm, false);
  assert.equal(o.systemPrompt.interpretedByProvider, false);
  assert.equal(o.components.length, 13);

  // Run 1: create and execute.
  const r1 = await post('/api/runs', { question: 'Which teams want AI training?', keywords: ['ai', 'training'] });
  assert.equal(r1.status, 201);
  assert.equal(r1.json.status, 'completed');
  assert.equal(r1.json.runId, 'RUN-0001');
  const id = (sid) => r1.json.results.find((r) => r.signalId === sid).resultId;

  // Inspect the stored run.
  const stored = (await get('/api/runs/RUN-0001')).json;
  assert.equal(stored.tasks.length, 11);
  assert.ok(stored.results.every((r) => r.reviewStatus === 'pending' && r.evidence && r.reasoning.length));
  assert.equal(stored.systemPrompt.version, o.systemPrompt.version);

  // Review: approve, reject, correct.
  const ap = await post(`/api/reviews/${id('S-005')}`, { decision: 'approve', note: 'Directors training request.', reviewer: 'E2E' });
  const rj = await post(`/api/reviews/${id('S-002')}`, { decision: 'reject', note: 'Governance question.', reviewer: 'E2E' });
  const co = await post(`/api/reviews/${id('S-001')}`, { decision: 'correct', correctedLabel: 'general', note: 'Interest, not purchase.', reviewer: 'E2E' });
  assert.deepEqual([ap.status, rj.status, co.status], [200, 200, 200]);
  assert.deepEqual([ap.json.status, rj.json.status, co.json.status], ['approved', 'rejected', 'corrected']);
  assert.ok([ap, rj, co].every((x) => Array.isArray(x.json.externalActions) && x.json.externalActions.length === 0));

  // Run 2 recalls run 1 and its review decisions, separately from the new classification.
  const r2 = (await post('/api/runs', { question: 'Follow-up: leadership training demand', keywords: ['training', 'leadership', 'ai'] })).json;
  assert.deepEqual(r2.recalled.priorRuns.map((p) => p.runId), ['RUN-0001']);
  const s1 = r2.results.find((r) => r.signalId === 'S-001');
  assert.equal(s1.priorReview.decision, 'correct');
  assert.equal(s1.code, 'buying');

  // Evaluation.
  const ev = await post('/api/evaluations');
  assert.equal(ev.status, 201);
  assert.equal(ev.json.software.passed, ev.json.software.total);
  assert.equal(ev.json.quality.status, 'completed');
  assert.equal((await get(`/api/evaluations/${ev.json.evalRunId}`)).json.report.resultsHash, ev.json.resultsHash);
  assert.equal((await get('/api/evaluations')).json.evaluations.length, 1);

  // Logs.
  const logs = (await get('/api/runs/RUN-0002/logs')).json.logs;
  assert.ok(logs.some((l) => l.event === 'task:classify' && l.outcome === 'success'));
  assert.ok(logs.some((l) => l.component === 'system_prompt'));
  assert.equal((await get('/api/runs')).json.runs.length, 2);

  // Memory: inspect, clear, audit history retained.
  assert.ok((await get('/api/memory')).json.records.some((m) => m.kind === 'feedback' && m.signalId === 'S-001'));
  const cleared = (await post('/api/memory/clear', {})).json;
  assert.ok(cleared.cleared > 0);
  assert.equal(cleared.reviewAuditRetained, 3);
  assert.equal((await get('/api/memory')).json.records.length, 0);
  assert.equal((await get('/api/reviews')).json.reviews.length, 3);
});

test('e2e api: rejected inputs get clear 4xx answers or a rejected run', async () => {
  const ex = (await post('/api/runs', { question: 'ai', platforms: ['LinkedIn comments'] })).json;
  assert.equal(ex.status, 'rejected');
  assert.equal(ex.error.rule, 'platform_scope');
  assert.equal((await post('/api/runs', { question: '' })).json.status, 'rejected');
  assert.equal((await post('/api/runs', { question: 'Where are we on this?' })).json.status, 'failed');
  const unknown = await post('/api/runs', { question: 'ai', publish: true });
  assert.equal(unknown.status, 400);
  assert.match(unknown.json.error.message, /Unknown field\(s\): publish/);
  assert.equal((await call(srv.base, 'POST', '/api/runs', '{bad json', { 'Content-Type': 'application/json' })).status, 400);
  assert.equal((await call(srv.base, 'POST', '/api/runs', 'question=ai', { 'Content-Type': 'text/plain' })).status, 415);
  assert.equal((await call(srv.base, 'POST', '/api/runs', JSON.stringify({ question: 'x'.repeat(40000) }), { 'Content-Type': 'application/json' })).status, 413);
  assert.equal((await post('/api/runs', [1, 2])).status, 400);

  const run = (await post('/api/runs', { question: 'ai training' })).json;
  const rid = run.results[0].resultId;
  const noLabel = await post(`/api/reviews/${rid}`, { decision: 'correct', note: 'n', reviewer: 'r' });
  assert.equal(noLabel.status, 400);
  assert.equal(noLabel.json.error.rule, 'label_required');
  assert.equal((await post(`/api/reviews/${rid}`, { decision: 'approve', reviewer: 'r' })).json.error.rule, 'note_required');
  // The browser percent-encodes the ":" in result ids; the server must accept both forms.
  assert.equal((await post(`/api/reviews/${encodeURIComponent(rid)}`, { decision: 'approve', note: 'ok', reviewer: 'r' })).status, 200);
  assert.equal((await post(`/api/reviews/${rid}`, { decision: 'approve', note: 'ok', reviewer: 'r' })).json.alreadyRecorded, true);
  assert.equal((await post('/api/reviews/%E0%A4%A', { decision: 'approve', note: 'ok', reviewer: 'r' })).status, 400);
  assert.equal((await post(`/api/reviews/${rid}`, { decision: 'reject', note: 'changed my mind', reviewer: 'r' })).status, 409);
  assert.equal((await post('/api/reviews/RUN-9999:S-001', { decision: 'approve', note: 'n', reviewer: 'r' })).status, 404);
  assert.equal((await get('/api/runs/RUN-9999')).status, 404);
  assert.equal((await get('/api/evaluations/EVAL-9999')).status, 404);
  assert.equal((await post('/api/memory/clear', { kind: 'secrets' })).status, 400);
  assert.equal((await call(srv.base, 'DELETE', '/api/runs')).status, 405);
  assert.equal((await get('/api/nothing-here')).status, 404);
});

test('e2e api: blocked actions are refused and logged', async () => {
  for (const action of ['publish_post', 'post_comment', 'send_message', 'contact_lead', 'external_fetch', 'live_platform_search', 'write_openclaw_signals']) {
    const r = (await post('/api/guardrails/check', { action })).json;
    assert.equal(r.allowed, false, action);
    assert.equal(r.rule, 'blocked_action');
  }
  assert.equal((await post('/api/guardrails/check', { action: 'read_sample_signals' })).json.allowed, true);
  assert.equal((await post('/api/guardrails/check', { action: 'rm_rf' })).json.rule, 'unknown_action');
  const g = (await get('/api/guardrails')).json;
  assert.equal(g.networkBlocked, true, 'the server process has its network block active');
  const net = (await post('/api/guardrails/network-test')).json;
  assert.equal(net.blocked, true);
  assert.deepEqual(net.attempts.map((a) => [a.what, a.blocked]), [['fetch', true], ['http.request', true], ['net.connect', true], ['dns.lookup', true]]);
  assert.match(net.target, /127\.0\.0\.1:1 \(loopback, closed port\)/);
  assert.ok(!/example\.com/.test(JSON.stringify(net)), 'the probe names no external destination');
});

/** fetch() ignores a custom Host header, so the DNS-rebinding check uses http.request directly. */
function getWithHost(base, p, host) {
  const { port } = new URL(base);
  return new Promise((resolve, reject) => {
    const req = require('http').request({ host: '127.0.0.1', port, path: p, headers: { Host: host }, timeout: 10000 }, (res) => { res.resume(); res.on('end', () => resolve(res.statusCode)); });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    req.end();
  });
}

test('e2e api: localhost only, safe static serving and security headers', async () => {
  assert.equal(await getWithHost(srv.base, '/api/overview', 'attacker.example'), 403);
  assert.equal(await getWithHost(srv.base, '/api/overview', 'localhost'), 200);
  const page = await get('/');
  assert.equal(page.status, 200);
  assert.match(page.headers.get('content-security-policy'), /default-src 'self'/);
  assert.equal(page.headers.get('x-content-type-options'), 'nosniff');
  assert.equal((await get('/%2e%2e/server/db.js')).status, 404);
  assert.equal((await get('/js/../../server/db.js')).status, 404);
  assert.equal((await call(srv.base, 'POST', '/index.html', {})).status, 405);
});

test('e2e api: the UI loads nothing from outside the local server', () => {
  const dir = path.join(REPO, 'demos', 'social-signal-discovery-full', 'public');
  const files = [];
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : files.push(path.join(d, e.name))));
  walk(dir);
  for (const f of files) {
    const text = fs.readFileSync(f, 'utf8');
    assert.ok(!/(src|href)\s*=\s*["']https?:/i.test(text), `${path.basename(f)} loads a remote resource`);
    assert.ok(!/fetch\(\s*["'`]https?:/i.test(text), `${path.basename(f)} fetches a remote URL`);
    assert.ok(!/innerHTML/.test(text), `${path.basename(f)} uses innerHTML`);
  }
});

test('e2e api: data persists across a server restart on the same database file', async () => {
  const first = await startServer();
  try {
    await call(first.base, 'POST', '/api/runs', { question: 'ai training', keywords: ['ai', 'training'] });
  } finally { await first.stop(); }
  const second = await startServer({ dbFile: first.file });
  try {
    const runs = (await call(second.base, 'GET', '/api/runs')).json.runs;
    assert.equal(runs.length, 1);
    const r2 = (await call(second.base, 'POST', '/api/runs', { question: 'again', keywords: ['training'] })).json;
    assert.deepEqual(r2.recalled.priorRuns.map((p) => p.runId), ['RUN-0001'], 'memory survives a restart');
  } finally {
    await second.stop();
    fs.rmSync(first.dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
});
