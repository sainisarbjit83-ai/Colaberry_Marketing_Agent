// Phase 3 software tests for the evaluation component: metric arithmetic and edge cases,
// benchmark validation, persistence, determinism, and the software/quality separation.
// These test that evaluation is computed correctly; they do not assert that quality is "good".
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { req, freshDb } = require('./helpers');

const M = req('evaluation/metrics');
const B = req('evaluation/benchmark');
const { CHECK_IDS } = req('evaluation/software-checks');
const { formatReport, central } = req('evaluation/format');
const { createAgent } = req('agent');
const g = req('components/guardrails');

const FIXED = () => new Date('2026-11-20T15:00:00Z');
const LABELS = ['buying', 'general', 'none'];
const pairs = (spec) => spec.map(([expected, predicted]) => ({ expected, predicted }));
const strip = (r) => { const { evalRunId, createdAt, ...rest } = r; return rest; };

// ---------- Metrics ----------
test('metrics: a hand-computed example matches every definition', () => {
  // expected: b b b g g n ; predicted: b b g g b n
  const r = M.evaluatePairs(pairs([['buying', 'buying'], ['buying', 'buying'], ['buying', 'general'], ['general', 'general'], ['general', 'buying'], ['none', 'none']]), LABELS);
  assert.deepEqual(r.accuracy, { value: 0.6667, numerator: 4, denominator: 6 });
  const b = r.perLabel.buying;
  assert.deepEqual([b.tp, b.fp, b.fn, b.support], [2, 1, 1, 3]);
  assert.equal(b.precision.value, 0.6667); // 2/3
  assert.equal(b.recall.value, 0.6667); // 2/3
  assert.deepEqual(b.f1, { value: 0.6667, numerator: 4, denominator: 6 }); // 2*2 / (4+1+1)
  assert.equal(r.perLabel.general.precision.value, 0.5);
  assert.equal(r.perLabel.none.f1.value, 1);
  assert.equal(r.macro.precision.value, Math.round(((2 / 3 + 0.5 + 1) / 3) * 10000) / 10000);
  assert.deepEqual(r.confusion.matrix.buying, { buying: 2, general: 1, none: 0 });
  assert.deepEqual(r.confusion.columns, LABELS);
});

test('metrics: perfect and all-wrong predictions', () => {
  const perfect = M.evaluatePairs(pairs([['buying', 'buying'], ['general', 'general'], ['none', 'none']]), LABELS);
  assert.equal(perfect.accuracy.value, 1);
  assert.ok(LABELS.every((l) => perfect.perLabel[l].f1.value === 1));
  const wrong = M.evaluatePairs(pairs([['buying', 'none'], ['general', 'buying'], ['none', 'general']]), LABELS);
  assert.equal(wrong.accuracy.value, 0);
  assert.ok(LABELS.every((l) => wrong.perLabel[l].precision.value === 0 && wrong.perLabel[l].recall.value === 0 && wrong.perLabel[l].f1.value === 0));
});

test('metrics: zero denominators are null with a reason, never a silent 0', () => {
  // "none" is expected once and never predicted; "general" is never expected nor predicted.
  const r = M.evaluatePairs(pairs([['buying', 'buying'], ['none', 'buying']]), LABELS);
  assert.equal(r.perLabel.none.precision.value, null);
  assert.match(r.perLabel.none.precision.reason, /No record was predicted as "none"/);
  assert.equal(r.perLabel.none.recall.value, 0);
  assert.equal(r.perLabel.none.f1.value, 0, 'F1 is 0 (not undefined) when the label occurs but is never found');
  for (const m of ['precision', 'recall', 'f1']) assert.equal(r.perLabel.general[m].value, null, m);
  assert.deepEqual(r.macro.precision, { value: 0.5, labelsIncluded: 1, labelsTotal: 3 }); // buying 1/2 only
  assert.equal(M.evaluatePairs([], LABELS).accuracy.value, null);
  assert.equal(M.evaluatePairs([], LABELS).macro.f1.value, null);
});

test('metrics: a failed prediction is wrong, a false negative, and shown in an error column', () => {
  const r = M.evaluatePairs(pairs([['buying', null], ['buying', 'buying']]), LABELS);
  assert.equal(r.failed, 1);
  assert.equal(r.accuracy.value, 0.5);
  assert.deepEqual([r.perLabel.buying.tp, r.perLabel.buying.fp, r.perLabel.buying.fn], [1, 0, 1]);
  assert.deepEqual(r.confusion.columns, [...LABELS, 'error']);
  assert.equal(r.confusion.matrix.buying.error, 1);
});

// ---------- Benchmark ----------
test('benchmark: loads, is labelled fictional and illustrative, and covers every label', () => {
  const b = B.loadBenchmark();
  assert.match(b._label, /FICTIONAL, ILLUSTRATIVE/);
  assert.match(b._label, /NOT Sohail Syed's approved buyer-signal criteria/);
  assert.equal(b.records.length, 24);
  for (const l of LABELS) assert.equal(b.records.filter((r) => r.expected === l).length, 8, l);
  assert.ok(b.records.every((r) => r.rationale && r.id.startsWith('B-')));
  assert.equal(B.loadBenchmark().hash, b.hash, 'the fingerprint is stable');
});

test('benchmark: validation refuses malformed or mislabelled benchmarks', () => {
  const good = () => JSON.parse(fs.readFileSync(B.DEFAULT_FILE, 'utf8'));
  const bad = (mut, re) => { const b = good(); mut(b); assert.throws(() => B.validateBenchmark(b), re); };
  bad((b) => { b._label = 'Our buyer benchmark'; }, /FICTIONAL and ILLUSTRATIVE/);
  bad((b) => { b.records[1].id = b.records[0].id; }, /duplicate id/);
  bad((b) => { b.records[0].expected = 'hot_lead'; }, /not one of/);
  bad((b) => { b.records[0].rationale = ''; }, /"rationale" is required/);
  bad((b) => { b.records[0].author = 'someone'; }, /must not name an author/);
  bad((b) => { b.records[0].platform = 'LinkedIn comments'; }, /not approved/);
  bad((b) => { b.records[0].url = 'https://www.reddit.com/r/x'; }, /url must be/);
  bad((b) => { b.records[0].difficulty = 'easy'; }, /difficulty/);
  bad((b) => { b.records = b.records.filter((r) => r.expected !== 'none'); }, /missing: none/);
  bad((b) => { b.records = []; }, /no records/);
  assert.doesNotThrow(() => B.validateBenchmark(good()));
});

test('benchmark: a missing or invalid file is refused', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ssd-bm-'));
  try {
    assert.throws(() => B.loadBenchmark(path.join(dir, 'nope.json')), /Cannot read the benchmark/);
    fs.writeFileSync(path.join(dir, 'bad.json'), '[');
    assert.throws(() => B.loadBenchmark(path.join(dir, 'bad.json')), /not valid JSON/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

// ---------- Evaluator ----------
test('evaluator: software correctness and classification quality are separate sections', () => {
  const r = createAgent({ db: freshDb(), clock: FIXED }).evaluation.run();
  assert.deepEqual(r.software.checks.map((c) => c.id), CHECK_IDS);
  assert.equal(r.software.passed, r.software.total, JSON.stringify(r.software.checks.filter((c) => !c.passed)));
  assert.match(r.software.note, /says nothing about whether classifications are right/);
  assert.match(r.quality.note, /FICTIONAL, ILLUSTRATIVE/);
  assert.equal(r.quality.status, 'completed');
  assert.equal(r.config.benchmark.records, 24);
  assert.equal(r.config.provider.isRealLlm, false);
  assert.ok(!('accuracy' in r.software), 'no quality metric inside the software section');
});

test('evaluator: quality numbers are internally consistent with the predictions', () => {
  const q = createAgent({ db: freshDb(), clock: FIXED }).evaluation.run({ includeSoftware: false }).quality;
  assert.equal(q.total, 24);
  assert.equal(q.correct, q.predictions.filter((p) => p.predicted === p.expected).length);
  assert.equal(q.accuracy.numerator, q.correct);
  const cells = q.confusion.rows.reduce((s, e) => s + q.confusion.columns.reduce((a, c) => a + q.confusion.matrix[e][c], 0), 0);
  assert.equal(cells, 24);
  for (const l of LABELS) assert.equal(q.perLabel[l].support, 8);
  assert.equal(q.mistakes.length, 24 - q.correct);
  assert.ok(q.mistakes.every((m) => m.rationale));
  assert.equal(q.byDifficulty.clear.total + q.byDifficulty.hard.total, 24);
});

test('evaluator: regression pin for the current demo rules on the current benchmark', () => {
  // Not a quality target. It pins today's numbers so any change to the rules or the benchmark is noticed.
  const q = createAgent({ db: freshDb(), clock: FIXED }).evaluation.run({ includeSoftware: false }).quality;
  assert.deepEqual(q.accuracy, { value: 0.75, numerator: 18, denominator: 24 });
  assert.deepEqual(q.mistakes.map((m) => m.id), ['B-006', 'B-007', 'B-013', 'B-019', 'B-021', 'B-024']);
});

test('evaluator: runs, predictions and metrics are stored in SQLite and read back', () => {
  const db = freshDb();
  const agent = createAgent({ db, clock: FIXED });
  const r = agent.evaluation.run();
  assert.equal(r.evalRunId, 'EVAL-0001');
  const run = db.prepare('SELECT * FROM evaluation_runs WHERE id = ?').get('EVAL-0001');
  assert.equal(run.quality_status, 'completed');
  assert.equal(run.results_hash, r.resultsHash);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM evaluation_predictions WHERE eval_run_id = ?').get('EVAL-0001').n, 24);
  const got = agent.evaluation.get('EVAL-0001');
  assert.deepEqual(got.report, r);
  const acc = got.metrics.find((m) => m.scope === 'quality' && m.metric === 'accuracy');
  assert.deepEqual({ ...acc }, { scope: 'quality', metric: 'accuracy', value: r.quality.accuracy.value, numerator: 18, denominator: 24 });
  assert.equal(got.metrics.filter((m) => m.scope === 'software').length, CHECK_IDS.length + 1);
  assert.equal(got.metrics.filter((m) => m.scope.startsWith('quality:')).length, 9);
  assert.equal(agent.evaluation.get('EVAL-9999'), null);
  assert.equal(agent.evaluation.list()[0].software, `${r.software.passed}/${r.software.total}`);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM research_runs').get().n, 0, 'software checks ran in their own databases');
});

test('evaluator: repeating an evaluation with the same benchmark and configuration is deterministic', () => {
  const agent = createAgent({ db: freshDb(), clock: FIXED });
  const a = agent.evaluation.run();
  const b = agent.evaluation.run();
  assert.notEqual(a.evalRunId, b.evalRunId);
  assert.equal(a.resultsHash, b.resultsHash);
  assert.equal(a.config.configHash, b.config.configHash);
  assert.deepEqual(strip(a), strip(b));
  assert.equal(createAgent({ db: freshDb(), clock: FIXED }).evaluation.run().resultsHash, a.resultsHash, 'same on a fresh database');
  assert.deepEqual(agent.evaluation.list().map((x) => x.resultsHash), [a.resultsHash, b.resultsHash]);
});

test('evaluator: a different benchmark gives a different configuration and results fingerprint', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ssd-bm-'));
  try {
    const b = JSON.parse(fs.readFileSync(B.DEFAULT_FILE, 'utf8'));
    b.version = '1.0.1-test';
    b.records.find((r) => r.id === 'B-021').expected = 'general';
    const file = path.join(dir, 'benchmark.json');
    fs.writeFileSync(file, JSON.stringify(b, null, 2));
    const base = createAgent({ db: freshDb(), clock: FIXED }).evaluation.run({ includeSoftware: false });
    const alt = createAgent({ db: freshDb(), clock: FIXED, benchmarkFile: file }).evaluation.run({ includeSoftware: false });
    assert.notEqual(alt.config.configHash, base.config.configHash);
    assert.notEqual(alt.resultsHash, base.resultsHash);
    assert.equal(alt.quality.correct, base.quality.correct + 1);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('evaluator: with the disabled real provider, quality is not run and nothing claims a score', () => {
  const db = freshDb();
  const r = createAgent({ db, clock: FIXED, providerConfig: { provider: 'real', real: { enabled: true } } }).evaluation.run({ includeSoftware: false });
  assert.equal(r.quality.status, 'not_run');
  assert.match(r.quality.reason, /disabled/);
  assert.ok(!('accuracy' in r.quality));
  assert.equal(db.prepare("SELECT COUNT(*) n FROM evaluation_results WHERE scope LIKE 'quality%'").get().n, 0);
  assert.equal(db.prepare('SELECT quality_status s FROM evaluation_runs').get().s, 'not_run');
  assert.match(formatReport(r), /CLASSIFICATION QUALITY: not_run/);
});

test('evaluator: measuring quality makes no network attempt', () => {
  const attempts = [];
  const uninstall = g.installNetworkBlock((e) => attempts.push(e));
  try { createAgent({ db: freshDb(), clock: FIXED }).evaluation.run({ includeSoftware: false }); } finally { uninstall(); }
  assert.deepEqual(attempts, []);
});

test('format: prints both sections separately and shows times in Central', () => {
  const text = formatReport(createAgent({ db: freshDb(), clock: FIXED }).evaluation.run());
  assert.ok(text.indexOf('SOFTWARE CORRECTNESS') < text.indexOf('CLASSIFICATION QUALITY'));
  assert.match(text, /Confusion matrix/);
  assert.match(text, /9:00 AM CST on 2026-11-20/);
  assert.equal(central('2026-07-01T01:30:00Z'), '8:30 PM CDT on 2026-06-30');
});
