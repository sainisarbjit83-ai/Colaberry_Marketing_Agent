/*
 * Logging & Observability (component 12): one structured row per event in the local
 * execution_logs table. Nothing is written anywhere else, and nothing leaves the machine.
 *
 * Each entry carries the shape CLAUDE.md asks for: timestamp, component, event, outcome,
 * duration, error class and a detail object, keyed by run id (the correlation id for a run).
 */
'use strict';

const OUTCOMES = new Set(['success', 'failure', 'blocked', 'info']);

function createLogger(db, clock = () => new Date()) {
  const insert = db.prepare(`INSERT INTO execution_logs (run_id, ts, component, event, outcome, duration_ms, error_class, detail_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

  /** Record one event. Returns the stored entry. Rejects malformed entries rather than storing them. */
  function log({ runId = null, component, event, outcome = 'info', durationMs = null, errorClass = null, detail = {} }) {
    if (!component || !event) throw new TypeError('A log entry needs a component and an event.');
    if (!OUTCOMES.has(outcome)) throw new RangeError(`Unknown log outcome "${outcome}".`);
    const entry = { runId, ts: clock().toISOString(), component, event, outcome, durationMs, errorClass, detail };
    insert.run(runId, entry.ts, component, event, outcome, durationMs, errorClass, JSON.stringify(detail));
    return entry;
  }

  /** Time a function, log its outcome and duration, and return its result (or rethrow its error). */
  function timed(meta, fn) {
    const start = process.hrtime.bigint();
    const ms = () => Number(process.hrtime.bigint() - start) / 1e6;
    try {
      const result = fn();
      log({ ...meta, outcome: 'success', durationMs: ms() });
      return result;
    } catch (err) {
      log({ ...meta, outcome: err.name === 'GuardrailViolation' ? 'blocked' : 'failure', durationMs: ms(), errorClass: err.name || 'Error', detail: { ...(meta.detail || {}), message: err.message } });
      throw err;
    }
  }

  /** Entries for a run (or all entries when runId is omitted), oldest first. */
  function read(runId) {
    const rows = runId === undefined
      ? db.prepare('SELECT * FROM execution_logs ORDER BY id').all()
      : db.prepare('SELECT * FROM execution_logs WHERE run_id IS ? ORDER BY id').all(runId);
    return rows.map((r) => ({ ...r, detail: JSON.parse(r.detail_json) }));
  }

  return { log, timed, read };
}

module.exports = { createLogger, OUTCOMES };
