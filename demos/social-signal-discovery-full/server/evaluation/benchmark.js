/*
 * The evaluation benchmark: fictional records with documented, illustrative expected labels.
 *
 * FICTIONAL AND ILLUSTRATIVE. The expected labels are the demo author's judgements, written to show
 * how quality would be measured. They are NOT Sohail Syed's approved buyer-signal criteria.
 * validateBenchmark() refuses a benchmark that does not carry that label.
 *
 * The benchmark records are separate from the 20 knowledge-base sample records (B- ids, not S-), so
 * the classifier is not scored on the same records its demo rules were written against.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { LABELS } = require('../components/llm/provider');
const { SCOPE } = require('../components/guardrails');
const { validDate } = require('../components/context');

const DEFAULT_FILE = path.join(__dirname, 'benchmark.json');
const DIFFICULTIES = Object.freeze(['clear', 'hard']);

class BenchmarkError extends Error {
  constructor(message) { super(message); this.name = 'BenchmarkError'; }
}

const nonEmpty = (s) => typeof s === 'string' && s.trim().length > 0;

/** Throws BenchmarkError unless the benchmark is well formed, labelled fictional, and covers every label. */
function validateBenchmark(b) {
  if (!b || typeof b !== 'object') throw new BenchmarkError('The benchmark must be a JSON object.');
  if (!nonEmpty(b._label) || !/FICTIONAL/.test(b._label) || !/ILLUSTRATIVE/.test(b._label) || !/NOT/.test(b._label)) {
    throw new BenchmarkError('The benchmark must be labelled FICTIONAL and ILLUSTRATIVE, and say it is NOT the approved criteria.');
  }
  if (!nonEmpty(b.id) || !nonEmpty(b.version)) throw new BenchmarkError('The benchmark needs an id and a version.');
  if (!Array.isArray(b.records) || !b.records.length) throw new BenchmarkError('The benchmark has no records.');
  const seen = new Set();
  for (const r of b.records) {
    const where = `Benchmark record ${r && r.id}`;
    if (!r || !/^B-\d{3}$/.test(r.id)) throw new BenchmarkError(`${where}: ids must look like B-001.`);
    if (seen.has(r.id)) throw new BenchmarkError(`${where}: duplicate id.`);
    seen.add(r.id);
    if ('author' in r) throw new BenchmarkError(`${where}: records must not name an author.`);
    for (const k of ['title', 'excerpt', 'topic', 'rationale']) if (!nonEmpty(r[k])) throw new BenchmarkError(`${where}: "${k}" is required.`);
    if (!LABELS[r.expected]) throw new BenchmarkError(`${where}: expected label "${r.expected}" is not one of ${Object.keys(LABELS).join(', ')}.`);
    if (!DIFFICULTIES.includes(r.difficulty)) throw new BenchmarkError(`${where}: difficulty must be clear or hard.`);
    if (!SCOPE.approved_platforms.includes(r.platform)) throw new BenchmarkError(`${where}: platform "${r.platform}" is not approved.`);
    if (!validDate(r.post_date)) throw new BenchmarkError(`${where}: post_date must be YYYY-MM-DD.`);
    if (r.url !== `https://example.com/benchmark/${r.id}`) throw new BenchmarkError(`${where}: url must be https://example.com/benchmark/${r.id}.`);
  }
  const empty = Object.keys(LABELS).filter((k) => !b.records.some((r) => r.expected === k));
  if (empty.length) throw new BenchmarkError(`Every label needs at least one record; missing: ${empty.join(', ')}.`);
  return b;
}

/** Load, validate and fingerprint a benchmark file. */
function loadBenchmark(file = DEFAULT_FILE) {
  let raw;
  try { raw = fs.readFileSync(file, 'utf8'); } catch (err) { throw new BenchmarkError(`Cannot read the benchmark at ${file}: ${err.code || err.message}.`); }
  let parsed;
  try { parsed = JSON.parse(raw); } catch (err) { throw new BenchmarkError(`The benchmark is not valid JSON: ${err.message}`); }
  validateBenchmark(parsed);
  const hash = crypto.createHash('sha256').update(raw).digest('hex').slice(0, 12);
  return Object.freeze({ ...parsed, records: Object.freeze(parsed.records.map((r) => Object.freeze({ ...r, is_sample: 1 }))), hash, file: path.basename(file) });
}

module.exports = { loadBenchmark, validateBenchmark, BenchmarkError, DEFAULT_FILE, DIFFICULTIES };
