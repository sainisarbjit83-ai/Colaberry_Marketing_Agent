/*
 * The 13 architecture components, with the manager's names and an honest status for this demo.
 * One source of truth: the UI's architecture overview reads this through /api/overview.
 *
 * Status wording (no other is used):
 *   Implemented in the demo · Partly implemented · Simulated · Proposed / not implemented
 */
'use strict';

const STATUS = Object.freeze({
  done: 'Implemented in the demo',
  partial: 'Partly implemented',
  simulated: 'Simulated',
  proposed: 'Proposed / not implemented',
});

const COMPONENTS = Object.freeze([
  ['User Interface (UI)', STATUS.done, 'Local browser interface served on 127.0.0.1 only.', 'Not hosted anywhere; one user, no sign-in.'],
  ['System Prompt', STATUS.done, 'Versioned instructions in config/system-prompt.json, validated at start-up and shown in every trace.', 'The simulated provider does not interpret it like a real LLM.'],
  ['Context Manager', STATUS.done, 'Validates the question, keywords, platforms, dates and limits, and carries step outputs through the run.', 'Excluded platforms are refused.'],
  ['LLM (Brain)', STATUS.simulated, 'Deterministic word rules behind a provider interface. A real-LLM adapter exists but is disabled and refuses every call.', 'Demo-only rules; the real buyer criteria are pending Sohail Syed.'],
  ['Agent Loop (Orchestrator)', STATUS.done, 'Runs the planned subtasks in order and stops on a guardrail block or a critical failure.', 'Synchronous, one run at a time.'],
  ['Tools', STATUS.done, 'Six local tools (retrieve, normalize, dedupe, rank, classify, report) with schemas and permission checks.', 'No tool can reach a network or publish.'],
  ['Knowledge Base / RAG', STATUS.partial, 'Keyword retrieval over 20 fictional records in local SQLite, each traceable to its source record.', 'No embeddings or vector search.'],
  ['Memory', STATUS.done, 'Run summaries, processed ids and review feedback in local SQLite, recalled by later runs.', 'Clearing memory keeps the review audit history.'],
  ['Planning / Task Decomposition', STATUS.partial, 'Each request becomes eleven visible subtasks with tracked states.', 'The plan is a fixed template, not generated per request.'],
  ['Guardrails', STATUS.partial, 'Action allow-list, platform scope, evidence checks and an in-process network block.', 'A demonstration guardrail, not a production security boundary.'],
  ['Human-in-the-Loop (HITL)', STATUS.done, 'Every result waits for a person to approve, reject or correct it, with a note.', 'Approval takes no external action.'],
  ['Logging & Observability', STATUS.done, 'Structured log rows for every task, tool call, decision and guardrail event.', 'Local only; no metrics dashboards or alerting.'],
  ['Evaluation', STATUS.done, 'Software checks and classification metrics against a benchmark, stored and repeatable.', 'The benchmark is fictional and illustrative, not approved by Sohail.'],
].map(([name, status, does, limits]) => Object.freeze({ name, status, does, limits })));

module.exports = { COMPONENTS, STATUS };
