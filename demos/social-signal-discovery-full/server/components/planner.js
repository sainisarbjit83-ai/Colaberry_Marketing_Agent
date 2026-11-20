/*
 * Planning / Task Decomposition (component 3): turns a validated request into a visible, ordered
 * list of subtasks, and tracks each one through planned -> running -> completed | failed, or
 * planned -> skipped. Every state change is saved to the research_tasks table.
 *
 * A critical task's failure stops the run; a non-critical one (memory) is recorded and the run
 * continues. Planning itself fails, with a reason, when the request has nothing to search for or a
 * step needs a tool that is not registered.
 */
'use strict';

class PlanningError extends Error {
  constructor(code, message) { super(message); this.name = 'PlanningError'; this.code = code; }
}

const STATES = Object.freeze(['planned', 'running', 'completed', 'failed', 'skipped']);
const NEXT = Object.freeze({ planned: ['running', 'skipped'], running: ['completed', 'failed'], completed: [], failed: [], skipped: [] });

// needsRecords: skipped (not failed) when an earlier step found nothing to work on.
const STEPS = Object.freeze([
  { name: 'recall_memory', component: 'memory', critical: false, purpose: 'Look up earlier runs and review decisions related to these keywords.' },
  { name: 'retrieve', component: 'knowledge_base', tool: 'retrieve', critical: true, purpose: 'Find sample records that share a keyword with the request.' },
  { name: 'normalize', component: 'tools', tool: 'normalize', critical: true, needsRecords: true, purpose: 'Normalize URLs and titles so duplicates can be compared.' },
  { name: 'dedupe', component: 'tools', tool: 'dedupe', critical: true, needsRecords: true, purpose: 'Remove repeated records, same URLs and re-shared titles.' },
  { name: 'rank', component: 'tools', tool: 'rank', critical: true, needsRecords: true, purpose: 'Order records by relevance and keep the top results.' },
  { name: 'classify', component: 'llm', tool: 'classify', critical: true, needsRecords: true, purpose: 'Preliminary classification of each record, with evidence.' },
  { name: 'apply_memory', component: 'memory', critical: false, needsRecords: true, purpose: 'Attach earlier review decisions to records seen before.' },
  { name: 'persist_results', component: 'database', critical: true, needsRecords: true, purpose: 'Save the classified results locally.' },
  { name: 'create_reviews', component: 'human_review', critical: true, needsRecords: true, purpose: 'Queue every result for human review.' },
  { name: 'report', component: 'tools', tool: 'report', critical: true, purpose: 'Write a summary that cites every record.' },
  { name: 'save_memory', component: 'memory', critical: false, purpose: 'Remember this run and the records it processed.' },
]);

/** The plan for a context. Throws PlanningError when the request cannot be planned. */
function plan(context, { toolNames }) {
  const r = context.request;
  if (!r.keywords.length) throw new PlanningError('no_keywords', 'The question has no searchable keywords once common words are removed. Add keywords or rephrase the question.');
  const missing = STEPS.filter((s) => s.tool && !toolNames.includes(s.tool)).map((s) => s.tool);
  if (missing.length) throw new PlanningError('missing_tool', `The plan needs tool(s) that are not registered: ${missing.join(', ')}.`);
  return STEPS.map((s, i) => ({ seq: i + 1, name: s.name, component: s.component, tool: s.tool || null, critical: s.critical, needsRecords: Boolean(s.needsRecords), purpose: s.purpose, status: 'planned', detail: null, error: null }));
}

/** Move a task to a new state. Throws on an impossible transition, e.g. completed -> running. */
function transition(task, to, { detail = null, error = null } = {}) {
  if (!STATES.includes(to)) throw new RangeError(`Unknown task state "${to}".`);
  if (!NEXT[task.status].includes(to)) throw new Error(`Task ${task.name} cannot go from ${task.status} to ${to}.`);
  task.status = to;
  if (detail !== null) task.detail = detail;
  if (error !== null) task.error = error;
  return task;
}

/** Save and update tasks in research_tasks. */
function createTaskStore(db) {
  const insert = db.prepare('INSERT INTO research_tasks (id, run_id, seq, name, status, detail, error) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const update = db.prepare('UPDATE research_tasks SET status = ?, detail = ?, error = ? WHERE id = ?');
  const id = (runId, t) => `${runId}:T${String(t.seq).padStart(2, '0')}`;
  return {
    save(runId, tasks) { for (const t of tasks) insert.run(id(runId, t), runId, t.seq, t.name, t.status, t.detail, t.error); },
    update(runId, t) { update.run(t.status, t.detail, t.error, id(runId, t)); },
    read(runId) { return db.prepare('SELECT * FROM research_tasks WHERE run_id = ? ORDER BY seq').all(runId).map((r) => ({ ...r })); },
  };
}

module.exports = { plan, transition, createTaskStore, PlanningError, STATES, STEPS };
