/*
 * Local SQLite database for the demo (node:sqlite, built into Node 22.5+). Fictional data only.
 *
 * The default file is tmp/ssd-full/demo.sqlite at the repository root; the repository's .gitignore
 * already excludes tmp/. Setup is idempotent: tables are created only if missing and seed rows
 * are inserted only if absent, so opening the database twice changes nothing.
 *
 * This module never connects to any other database.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const { SAMPLE_SIGNALS } = require('./data/sample-signals');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const DEFAULT_PATH = path.join(REPO_ROOT, 'tmp', 'ssd-full', 'demo.sqlite');

const SCHEMA = `
CREATE TABLE IF NOT EXISTS sample_signals (
  id TEXT PRIMARY KEY, platform TEXT NOT NULL, title TEXT NOT NULL, excerpt TEXT NOT NULL,
  url TEXT NOT NULL, post_date TEXT NOT NULL, topic TEXT NOT NULL,
  is_sample INTEGER NOT NULL CHECK (is_sample = 1)
);
CREATE TABLE IF NOT EXISTS research_runs (
  id TEXT PRIMARY KEY, question TEXT NOT NULL, context_json TEXT NOT NULL, status TEXT NOT NULL,
  provider TEXT NOT NULL, started_at TEXT, finished_at TEXT, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS research_tasks (
  id TEXT PRIMARY KEY, run_id TEXT NOT NULL REFERENCES research_runs(id), seq INTEGER NOT NULL,
  name TEXT NOT NULL, status TEXT NOT NULL, detail TEXT, error TEXT, UNIQUE (run_id, seq)
);
CREATE TABLE IF NOT EXISTS run_results (
  id TEXT PRIMARY KEY, run_id TEXT NOT NULL REFERENCES research_runs(id),
  signal_id TEXT NOT NULL REFERENCES sample_signals(id), rank INTEGER NOT NULL, score REAL NOT NULL,
  code TEXT NOT NULL CHECK (code IN ('buying', 'general', 'none')), label TEXT NOT NULL,
  evidence_json TEXT NOT NULL, reasoning_json TEXT NOT NULL,
  review_status TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected', 'corrected')),
  UNIQUE (run_id, signal_id)
);
CREATE TABLE IF NOT EXISTS memory_records (
  id TEXT PRIMARY KEY, kind TEXT NOT NULL CHECK (kind IN ('run_summary', 'processed_ids', 'feedback')),
  run_id TEXT, signal_id TEXT, content_json TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS review_decisions (
  id TEXT PRIMARY KEY, result_id TEXT NOT NULL REFERENCES run_results(id),
  decision TEXT NOT NULL CHECK (decision IN ('approve', 'reject', 'correct')),
  corrected_label TEXT, note TEXT, reviewer TEXT NOT NULL, decided_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS execution_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT, run_id TEXT, ts TEXT NOT NULL, component TEXT NOT NULL,
  event TEXT NOT NULL, outcome TEXT NOT NULL CHECK (outcome IN ('success', 'failure', 'blocked', 'info')),
  duration_ms REAL, error_class TEXT, detail_json TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS evaluation_runs (
  id TEXT PRIMARY KEY, benchmark_id TEXT NOT NULL, benchmark_version TEXT NOT NULL, benchmark_hash TEXT NOT NULL,
  provider TEXT NOT NULL, config_hash TEXT NOT NULL, results_hash TEXT NOT NULL,
  quality_status TEXT NOT NULL CHECK (quality_status IN ('completed', 'not_run')),
  software_passed INTEGER NOT NULL, software_total INTEGER NOT NULL, report_json TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS evaluation_predictions (
  eval_run_id TEXT NOT NULL REFERENCES evaluation_runs(id), record_id TEXT NOT NULL, expected TEXT NOT NULL,
  predicted TEXT, correct INTEGER NOT NULL CHECK (correct IN (0, 1)), difficulty TEXT NOT NULL, error TEXT,
  PRIMARY KEY (eval_run_id, record_id)
);
CREATE TABLE IF NOT EXISTS evaluation_results (
  id TEXT PRIMARY KEY, eval_run_id TEXT NOT NULL REFERENCES evaluation_runs(id), metric TEXT NOT NULL, scope TEXT NOT NULL,
  value REAL, numerator INTEGER, denominator INTEGER, created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_logs_run ON execution_logs(run_id);
CREATE INDEX IF NOT EXISTS idx_results_run ON run_results(run_id);
`;

const TABLES = ['sample_signals', 'research_runs', 'research_tasks', 'run_results', 'memory_records', 'review_decisions', 'execution_logs', 'evaluation_runs', 'evaluation_predictions', 'evaluation_results'];

/** Insert the fictional sample records that are not already present. Returns how many were added. */
function seed(db) {
  const insert = db.prepare(`INSERT OR IGNORE INTO sample_signals (id, platform, title, excerpt, url, post_date, topic, is_sample)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)`);
  let added = 0;
  for (const s of SAMPLE_SIGNALS) added += insert.run(s.id, s.platform, s.title, s.excerpt, s.url, s.post_date, s.topic).changes;
  return added;
}

/**
 * Open (and if needed create) the demo database. Pass ':memory:' for an in-memory database, or a
 * path. Only paths ending in .sqlite are accepted, so the demo cannot be pointed at another file type.
 */
function open(file = DEFAULT_PATH) {
  if (file !== ':memory:') {
    if (!/\.sqlite$/i.test(file)) throw new Error(`Refusing to open "${file}": the demo database must be a .sqlite file.`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
  }
  const db = new DatabaseSync(file);
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(SCHEMA);
  const seeded = seed(db);
  return { db, file, seeded };
}

module.exports = { open, seed, TABLES, DEFAULT_PATH, REPO_ROOT };
