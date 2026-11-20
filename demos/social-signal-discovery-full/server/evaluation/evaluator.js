/*
 * Evaluation (component 13): two separate measurements, reported side by side, never combined.
 *
 *   software - does the workflow behave as designed? (software-checks.js, pass/fail)
 *   quality  - how often does the classifier agree with the FICTIONAL, ILLUSTRATIVE benchmark?
 *
 * Quality measures the classification step only: each benchmark record goes straight to the
 * provider (with the same output and evidence checks the agent uses). Retrieval and ranking are
 * covered by the software checks, not by the quality scores.
 *
 * Every evaluation is stored in SQLite (evaluation_runs, evaluation_predictions, evaluation_results)
 * and can be read back. The same benchmark and configuration always give the same resultsHash.
 */
'use strict';

const crypto = require('crypto');
const { LABELS, validateOutput } = require('../components/llm/provider');
const { checkEvidence, checkAction } = require('../components/guardrails');
const { RULES } = require('../components/llm/simulated');
const { loadBenchmark } = require('./benchmark');
const { evaluatePairs } = require('./metrics');

const hash = (v) => crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex').slice(0, 12);
const LABEL_CODES = Object.keys(LABELS);

const SOFTWARE_NOTE = 'Software correctness: does the workflow behave as designed? A pass says nothing about whether classifications are right.';
const QUALITY_NOTE = 'Classification quality against a FICTIONAL, ILLUSTRATIVE benchmark whose labels are not the approved buyer-signal criteria. Measures the classification step only.';

function classifyAll(provider, records) {
  return records.map((r) => {
    try {
      const c = validateOutput(provider.classify(r));
      checkEvidence(c, r);
      return { id: r.id, expected: r.expected, predicted: c.code, difficulty: r.difficulty, error: null };
    } catch (err) {
      return { id: r.id, expected: r.expected, predicted: null, difficulty: r.difficulty, error: `${err.name}: ${err.message}` };
    }
  });
}

function measureQuality(provider, benchmark) {
  const info = provider.describe();
  if (!info.enabled) return { status: 'not_run', reason: `The ${info.name} provider is disabled, so no classification quality was measured.`, note: QUALITY_NOTE, predictions: [] };
  const predictions = classifyAll(provider, benchmark.records);
  const byDifficulty = Object.fromEntries(['clear', 'hard'].map((d) => {
    const p = predictions.filter((x) => x.difficulty === d);
    return [d, { correct: p.filter((x) => x.predicted === x.expected).length, total: p.length }];
  }));
  const rationale = Object.fromEntries(benchmark.records.map((r) => [r.id, r.rationale]));
  return {
    status: 'completed', note: QUALITY_NOTE, ...evaluatePairs(predictions, LABEL_CODES), byDifficulty, predictions,
    mistakes: predictions.filter((p) => p.predicted !== p.expected).map((p) => ({ ...p, rationale: rationale[p.id] })),
  };
}

/** The rows written to evaluation_results: one per metric, keyed by scope. */
function metricRows(report) {
  const rows = [];
  const add = (scope, metric, r) => rows.push({ scope, metric, value: r.value, numerator: r.numerator ?? null, denominator: r.denominator ?? null });
  const s = report.software;
  add('software', 'checks_passed', { value: s.total ? s.passed / s.total : null, numerator: s.passed, denominator: s.total });
  for (const c of s.checks) add('software', c.id, { value: c.passed ? 1 : 0 });
  const q = report.quality;
  if (q.status === 'completed') {
    add('quality', 'accuracy', q.accuracy);
    for (const m of ['precision', 'recall', 'f1']) add('quality', `macro_${m}`, q.macro[m]);
    for (const l of LABEL_CODES) for (const m of ['precision', 'recall', 'f1']) add(`quality:${l}`, m, q.perLabel[l][m]);
  }
  return rows;
}

function createEvaluator({ db, provider, systemPrompt, logger, clock = () => new Date(), runChecks, benchmarkFile }) {
  const nextId = () => `EVAL-${String(Number(db.prepare('SELECT COUNT(*) n FROM evaluation_runs').get().n) + 1).padStart(4, '0')}`;

  function evaluate({ includeSoftware = true } = {}) {
    checkAction('local_compute');
    const benchmark = loadBenchmark(benchmarkFile);
    const info = provider.describe();
    const config = {
      benchmark: { id: benchmark.id, version: benchmark.version, hash: benchmark.hash, records: benchmark.records.length, label: benchmark._label },
      provider: { name: info.name, kind: info.kind, isRealLlm: info.isRealLlm, enabled: info.enabled },
      rulesHash: info.kind === 'simulated' ? hash(RULES) : null,
      systemPrompt: { version: systemPrompt.version, hash: systemPrompt.hash },
    };
    config.configHash = hash(config);
    const checks = includeSoftware ? runChecks() : [];
    const software = { note: SOFTWARE_NOTE, ran: includeSoftware, passed: checks.filter((c) => c.passed).length, total: checks.length, checks };
    const quality = measureQuality(provider, benchmark);
    const resultsHash = hash({ software: checks.map((c) => [c.id, c.passed, c.detail]), quality });
    const report = { evalRunId: nextId(), createdAt: clock().toISOString(), config, software, quality, resultsHash };
    persist(report);
    logger.log({ component: 'evaluation', event: 'evaluation_completed', outcome: 'success', detail: { evalRunId: report.evalRunId, quality: quality.status, accuracy: quality.accuracy ? quality.accuracy.value : null, software: `${software.passed}/${software.total}`, resultsHash } });
    return report;
  }

  function persist(r) {
    db.exec('BEGIN');
    try {
      db.prepare(`INSERT INTO evaluation_runs (id, benchmark_id, benchmark_version, benchmark_hash, provider, config_hash, results_hash, quality_status, software_passed, software_total, report_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(r.evalRunId, r.config.benchmark.id, r.config.benchmark.version, r.config.benchmark.hash, r.config.provider.name,
        r.config.configHash, r.resultsHash, r.quality.status, r.software.passed, r.software.total, JSON.stringify(r), r.createdAt);
      const pred = db.prepare('INSERT INTO evaluation_predictions (eval_run_id, record_id, expected, predicted, correct, difficulty, error) VALUES (?, ?, ?, ?, ?, ?, ?)');
      for (const p of r.quality.predictions) pred.run(r.evalRunId, p.id, p.expected, p.predicted, p.predicted === p.expected ? 1 : 0, p.difficulty, p.error);
      const res = db.prepare('INSERT INTO evaluation_results (id, eval_run_id, metric, scope, value, numerator, denominator, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
      for (const m of metricRows(r)) res.run(`${r.evalRunId}:${m.scope}:${m.metric}`, r.evalRunId, m.metric, m.scope, m.value, m.numerator, m.denominator, r.createdAt);
      db.exec('COMMIT');
    } catch (err) { db.exec('ROLLBACK'); throw err; }
  }

  /** Summaries of every stored evaluation, oldest first. */
  function list() {
    return db.prepare('SELECT id, benchmark_id, benchmark_version, provider, config_hash, results_hash, quality_status, software_passed, software_total, created_at FROM evaluation_runs ORDER BY id').all()
      .map((r) => {
        const acc = db.prepare("SELECT value, numerator, denominator FROM evaluation_results WHERE eval_run_id = ? AND scope = 'quality' AND metric = 'accuracy'").get(r.id);
        return { evalRunId: r.id, benchmark: `${r.benchmark_id}@${r.benchmark_version}`, provider: r.provider, configHash: r.config_hash, resultsHash: r.results_hash, quality: r.quality_status, accuracy: acc ? { ...acc } : null, software: `${r.software_passed}/${r.software_total}`, createdAt: r.created_at };
      });
  }

  /** One stored evaluation: its full report, the stored metric rows and the stored predictions. */
  function get(id) {
    const run = db.prepare('SELECT report_json FROM evaluation_runs WHERE id = ?').get(id);
    if (!run) return null;
    return {
      report: JSON.parse(run.report_json),
      metrics: db.prepare('SELECT scope, metric, value, numerator, denominator FROM evaluation_results WHERE eval_run_id = ? ORDER BY scope, metric').all(id).map((m) => ({ ...m })),
      predictions: db.prepare('SELECT record_id, expected, predicted, correct, difficulty, error FROM evaluation_predictions WHERE eval_run_id = ? ORDER BY record_id').all(id).map((p) => ({ ...p })),
    };
  }

  return { evaluate, list, get };
}

module.exports = { createEvaluator, metricRows, SOFTWARE_NOTE, QUALITY_NOTE };
