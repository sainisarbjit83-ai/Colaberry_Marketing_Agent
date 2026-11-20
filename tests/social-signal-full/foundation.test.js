// Phase 1 software tests: database, sample data, logger, guardrails, knowledge base.
// These test that the code works. They do NOT measure classification quality (that is the
// separate evaluation, Phase 3).
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { req, freshDb } = require('./helpers');

const dbMod = req('db');
const { SAMPLE_SIGNALS } = req('data/sample-signals');
const { createLogger } = req('components/logger');
const g = req('components/guardrails');
const { createKnowledgeBase } = req('components/knowledge-base');
const { normalizeUrl, titleFingerprint } = req('components/text');

// ---------- Database ----------
test('db: creates all ten tables and seeds 20 fictional records', () => {
  const db = freshDb();
  const names = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map((r) => r.name);
  for (const t of dbMod.TABLES) assert.ok(names.includes(t), `missing table ${t}`);
  assert.equal(dbMod.TABLES.length, 10); // Phase 3 added evaluation_runs and evaluation_predictions
  assert.equal(db.prepare('SELECT COUNT(*) n FROM sample_signals').get().n, 20);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM sample_signals WHERE is_sample = 1').get().n, 20);
});

test('db: opening twice is idempotent (no duplicate seed rows)', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ssd-full-'));
  const file = path.join(dir, 'idem.sqlite');
  try {
    const a = dbMod.open(file); assert.equal(a.seeded, 20); a.db.close();
    const b = dbMod.open(file); assert.equal(b.seeded, 0);
    assert.equal(b.db.prepare('SELECT COUNT(*) n FROM sample_signals').get().n, 20);
    b.db.close();
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('db: refuses a path that is not a .sqlite file', () => {
  assert.throws(() => dbMod.open(path.join(os.tmpdir(), 'x.db')), /must be a \.sqlite file/);
  assert.throws(() => dbMod.open('postgres://prod/db'), /must be a \.sqlite file/);
});

test('db: the schema rejects a non-sample row and invalid enum values', () => {
  const db = freshDb();
  assert.throws(() => db.prepare("INSERT INTO sample_signals VALUES ('X','Reddit','t','e','u','2026-01-01','x',0)").run());
  assert.throws(() => db.prepare("INSERT INTO memory_records VALUES ('m','bogus',NULL,NULL,'{}','now')").run());
  assert.throws(() => db.prepare("INSERT INTO execution_logs (ts,component,event,outcome,detail_json) VALUES ('now','c','e','maybe','{}')").run());
});

test('db: the default database lives under the gitignored tmp/ folder', () => {
  const rel = path.relative(dbMod.REPO_ROOT, dbMod.DEFAULT_PATH).split(path.sep).join('/');
  assert.equal(rel, 'tmp/ssd-full/demo.sqlite');
});

// ---------- Sample data ----------
test('sample data: fictional, no authors, example.com URLs only, unique ids', () => {
  assert.equal(SAMPLE_SIGNALS.length, 20);
  assert.equal(new Set(SAMPLE_SIGNALS.map((s) => s.id)).size, 20);
  for (const s of SAMPLE_SIGNALS) {
    assert.equal(s.is_sample, 1);
    assert.ok(!('author' in s), `${s.id} has an author field`);
    assert.match(normalizeUrl(s.url), /^https:\/\/example\.com\/sample\//);
  }
});

test('sample data: contains the deliberate URL and title duplicates', () => {
  const by = Object.fromEntries(SAMPLE_SIGNALS.map((s) => [s.id, s]));
  assert.equal(normalizeUrl(by['S-009'].url), normalizeUrl(by['S-001'].url));
  assert.equal(titleFingerprint(by['S-019'].platform, by['S-019'].title), titleFingerprint(by['S-005'].platform, by['S-005'].title));
  assert.notEqual(normalizeUrl(by['S-019'].url), normalizeUrl(by['S-005'].url));
});

// ---------- Logger ----------
test('logger: stores structured entries and reads them back by run', () => {
  const log = createLogger(freshDb(), () => new Date('2026-11-20T12:00:00Z'));
  log.log({ runId: 'R1', component: 'planner', event: 'plan', detail: { steps: 3 } });
  log.log({ runId: 'R2', component: 'tools', event: 'x' });
  const rows = log.read('R1');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].outcome, 'info');
  assert.deepEqual(rows[0].detail, { steps: 3 });
  assert.equal(log.read().length, 2);
});

test('logger: rejects malformed entries', () => {
  const log = createLogger(freshDb());
  assert.throws(() => log.log({ event: 'e' }), TypeError);
  assert.throws(() => log.log({ component: 'c', event: 'e', outcome: 'maybe' }), RangeError);
});

test('logger: timed() records success, failure and blocked outcomes', () => {
  const log = createLogger(freshDb());
  assert.equal(log.timed({ runId: 'R', component: 'c', event: 'ok' }, () => 7), 7);
  assert.throws(() => log.timed({ runId: 'R', component: 'c', event: 'bad' }, () => { throw new RangeError('boom'); }), RangeError);
  assert.throws(() => log.timed({ runId: 'R', component: 'c', event: 'nope' }, () => g.checkAction('send_message')), g.GuardrailViolation);
  const rows = log.read('R');
  assert.deepEqual(rows.map((r) => r.outcome), ['success', 'failure', 'blocked']);
  assert.equal(rows[1].error_class, 'RangeError');
  assert.equal(rows[2].error_class, 'GuardrailViolation');
  assert.ok(rows.every((r) => typeof r.duration_ms === 'number'));
});

// ---------- Guardrails ----------
test('guardrails: allows local actions and refuses outreach, publishing and production writes', () => {
  for (const a of g.ALLOWED_ACTIONS) assert.equal(g.checkAction(a), true);
  for (const a of Object.keys(g.BLOCKED_ACTIONS)) {
    assert.throws(() => g.checkAction(a), (e) => e.name === 'GuardrailViolation' && e.rule === 'blocked_action');
  }
  assert.throws(() => g.checkAction('delete_everything'), (e) => e.rule === 'unknown_action');
});

test('guardrails: platform scope accepts the approved eight and names excluded ones', () => {
  assert.equal(g.SCOPE.approved_platforms.length, 8);
  assert.deepEqual(g.checkPlatforms(['Reddit', 'Bluesky']), ['Reddit', 'Bluesky']);
  assert.throws(() => g.checkPlatforms(['Reddit', 'LinkedIn comments']), /LinkedIn comments is explicitly excluded/);
  assert.throws(() => g.checkPlatforms(['MySpace']), (e) => e.rule === 'platform_scope');
});

test('guardrails: evidence must be the exact text at the cited position', () => {
  const rec = { id: 'T', title: 'Our company needs AI training', excerpt: 'x' };
  assert.equal(g.checkEvidence({ code: 'buying', evidence: [{ field: 'title', text: 'AI', start: 18, end: 20 }] }, rec), true);
  assert.equal(g.checkEvidence({ code: 'none', evidence: [] }, rec), true);
  assert.throws(() => g.checkEvidence({ code: 'buying', evidence: [] }, rec), (e) => e.rule === 'missing_evidence');
  assert.throws(() => g.checkEvidence({ code: 'buying', evidence: [{ field: 'title', text: 'budget', start: 0, end: 6 }] }, rec), (e) => e.rule === 'invalid_evidence');
});

test('guardrails: the network block refuses fetch, http, https, net, tls and dns, then uninstalls', () => {
  const http = require('http'), https = require('https'), net = require('net'), tls = require('tls'), dns = require('dns');
  const originalFetch = globalThis.fetch;
  const seen = [];
  const uninstall = g.installNetworkBlock((e) => seen.push(e.what));
  try {
    assert.equal(g.isNetworkBlocked(), true);
    assert.equal(g.installNetworkBlock(), uninstall, 'second install is a no-op');
    const blocked = (fn) => assert.throws(fn, (e) => e.name === 'GuardrailViolation' && e.rule === 'network_blocked');
    // Loopback targets on a closed port: even if the block failed, nothing could leave the machine.
    blocked(() => globalThis.fetch('http://127.0.0.1:1/'));
    blocked(() => http.get('http://127.0.0.1:1/'));
    blocked(() => https.request('https://127.0.0.1:1/'));
    blocked(() => net.connect(1, '127.0.0.1'));
    blocked(() => new net.Socket().connect(1, '127.0.0.1'));
    blocked(() => tls.connect(1, '127.0.0.1'));
    blocked(() => dns.lookup('localhost', () => {}));
    assert.deepEqual(seen, ['fetch', 'http.get', 'https.request', 'net.connect', 'socket.connect', 'tls.connect', 'dns.lookup']);
  } finally {
    uninstall();
  }
  assert.equal(g.isNetworkBlocked(), false);
  assert.equal(globalThis.fetch, originalFetch);
});

// ---------- Knowledge base ----------
test('knowledge base: finds candidates by term, platform and date, ordered by id', () => {
  const kb = createKnowledgeBase(freshDb());
  const all = kb.findCandidates({ terms: ['training'] });
  assert.ok(all.length > 0);
  assert.deepEqual(all.map((c) => c.record.id), [...all.map((c) => c.record.id)].sort());
  assert.ok(all.every((c) => c.matched.includes('training')));
  const reddit = kb.findCandidates({ terms: ['training'], platforms: ['Reddit'] });
  assert.ok(reddit.every((c) => c.record.platform === 'Reddit'));
  const dated = kb.findCandidates({ terms: ['training'], dateFrom: '2099-01-01' });
  assert.equal(dated.length, 0);
  assert.deepEqual(kb.findCandidates({ terms: [] }), []);
});

test('knowledge base: getById and sourceRef trace a result back to the stored record', () => {
  const kb = createKnowledgeBase(freshDb());
  const r = kb.getById('S-001');
  assert.equal(r.id, 'S-001');
  assert.equal(kb.getById('S-999'), null);
  assert.deepEqual(kb.sourceRef(r), { id: 'S-001', platform: r.platform, url: r.url, post_date: r.post_date, sample: true });
});
