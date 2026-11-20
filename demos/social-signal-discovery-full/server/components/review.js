/*
 * Human-in-the-Loop (component 11): every classified result starts as a pending review
 * (run_results.review_status = 'pending'). A reviewer approves, rejects or corrects it.
 *
 *   - A correction must name the corrected label, and it must differ from the original.
 *   - Every decision needs a reviewer and a note.
 *   - The decision, the result's new status and the memory feedback are written in one transaction.
 *   - Approval only records a decision. It triggers no external action: nothing is published,
 *     posted, sent or contacted, and the returned externalActions list is always empty.
 *   - Repeating the identical decision is a no-op; a different decision on a decided result is refused.
 */
'use strict';

const { checkAction } = require('./guardrails');
const { LABELS } = require('./llm/provider');

class ReviewError extends Error {
  constructor(code, message) { super(message); this.name = 'ReviewError'; this.code = code; }
}

const DECISIONS = Object.freeze({ approve: 'approved', reject: 'rejected', correct: 'corrected' });
const text = (v) => (typeof v === 'string' ? v.trim() : '');

/** A label given as a code ("general") or as its text ("General AI interest"), as label text. */
function resolveLabel(v) {
  const s = text(v);
  if (LABELS[s]) return LABELS[s];
  return Object.values(LABELS).includes(s) ? s : null;
}

function createReview(db, { memory, logger, clock = () => new Date() }) {
  const getResult = (id) => db.prepare('SELECT * FROM run_results WHERE id = ?').get(id);
  const getDecision = (resultId) => db.prepare('SELECT * FROM review_decisions WHERE result_id = ?').get(resultId);

  /** Results of a run still waiting for a decision. */
  function pendingFor(runId) {
    return db.prepare("SELECT id, signal_id, rank, label FROM run_results WHERE run_id = ? AND review_status = 'pending' ORDER BY rank").all(runId).map((r) => ({ resultId: r.id, signalId: r.signal_id, rank: r.rank, label: r.label }));
  }

  function validate(result, { decision, correctedLabel, note, reviewer }) {
    if (!result) throw new ReviewError('not_found', 'No such result to review.');
    if (!DECISIONS[decision]) throw new ReviewError('bad_decision', 'Decision must be approve, reject or correct.');
    if (!text(reviewer) || text(reviewer).length > 80) throw new ReviewError('reviewer_required', 'A reviewer name (up to 80 characters) is required.');
    if (!text(note) || text(note).length > 500) throw new ReviewError('note_required', 'A reviewer note (up to 500 characters) is required.');
    if (decision !== 'correct') {
      if (correctedLabel !== undefined && correctedLabel !== null) throw new ReviewError('unexpected_label', 'Only a correction takes a corrected label.');
      return null;
    }
    const label = resolveLabel(correctedLabel);
    if (!label) throw new ReviewError('label_required', `A correction needs a corrected label: one of ${Object.values(LABELS).join(', ')}.`);
    if (label === result.label) throw new ReviewError('label_unchanged', 'The corrected label is the same as the original; approve it instead.');
    return label;
  }

  /** Record a decision. Returns it, with externalActions always []. */
  function decide(resultId, input = {}) {
    checkAction('write_local_review');
    const result = getResult(resultId);
    const label = validate(result, input);
    const existing = getDecision(resultId);
    if (existing) {
      const same = existing.decision === input.decision && (existing.corrected_label || null) === label && existing.note === text(input.note) && existing.reviewer === text(input.reviewer);
      if (!same) throw new ReviewError('already_decided', `Result ${resultId} was already ${DECISIONS[existing.decision]} by ${existing.reviewer}.`);
      return { ...shape(existing, result), alreadyRecorded: true };
    }
    const row = { id: `REV:${resultId}`, result_id: resultId, decision: input.decision, corrected_label: label, note: text(input.note), reviewer: text(input.reviewer), decided_at: clock().toISOString() };
    db.exec('BEGIN');
    try {
      db.prepare('INSERT INTO review_decisions (id, result_id, decision, corrected_label, note, reviewer, decided_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(row.id, row.result_id, row.decision, row.corrected_label, row.note, row.reviewer, row.decided_at);
      db.prepare('UPDATE run_results SET review_status = ? WHERE id = ?').run(DECISIONS[row.decision], resultId);
      memory.saveFeedback(feedback(row, result));
      db.exec('COMMIT');
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }
    logger.log({ runId: result.run_id, component: 'human_review', event: `review:${row.decision}`, outcome: 'success', detail: { resultId, signalId: result.signal_id, reviewer: row.reviewer, externalActions: 0 } });
    return { ...shape(row, result), alreadyRecorded: false };
  }

  function feedback(row, result) {
    return { reviewId: row.id, resultId: result.id, runId: result.run_id, signalId: result.signal_id, decision: row.decision, originalLabel: result.label, correctedLabel: row.corrected_label, note: row.note, reviewer: row.reviewer, decidedAt: row.decided_at };
  }

  function shape(row, result) {
    return { ...feedback(row, result), status: DECISIONS[row.decision], externalActions: [] };
  }

  /** The result and its decision, if any. */
  function get(resultId) {
    const result = getResult(resultId);
    if (!result) return null;
    const d = getDecision(resultId);
    return { resultId, signalId: result.signal_id, label: result.label, status: result.review_status, decision: d ? shape(d, result) : null };
  }

  return { pendingFor, decide, get };
}

module.exports = { createReview, ReviewError, DECISIONS, resolveLabel };
