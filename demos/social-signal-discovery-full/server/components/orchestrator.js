/*
 * Agent Loop / Orchestrator (component 9): runs one research request end to end.
 *
 *   1. Record the run and the system prompt version it uses.
 *   2. Validate the request (context manager). Invalid or out-of-scope -> run "rejected".
 *   3. Plan the subtasks (planner). Unplannable -> run "failed".
 *   4. Execute the tasks in order. Each task is marked running, then completed or failed.
 *        - a guardrail block anywhere      -> stop, run "blocked", remaining tasks skipped
 *        - a critical task fails           -> stop, run "failed", remaining tasks skipped
 *        - a non-critical task fails       -> continue, run "completed_with_warnings"
 *        - nothing found to work on        -> record-dependent tasks skipped, run completes
 *   5. Return a trace: system prompt, provider, context, plan, decisions, results, report.
 *
 * The network block is installed for the duration of the run (unless one is already installed).
 * Every decision and every task is logged.
 */
'use strict';

const guardrails = require('./guardrails');
const { createContext } = require('./context');
const { plan, transition, createTaskStore } = require('./planner');
const { validateOutput } = require('./llm/provider');
const { traceView } = require('./system-prompt');
const { createHandlers } = require('./task-handlers');

function createOrchestrator({ db, logger, registry, kb, memory, review, systemPrompt, provider, clock = () => new Date() }) {
  const tasks = createTaskStore(db);
  const now = () => clock().toISOString();
  const nextRunId = () => `RUN-${String(Number(db.prepare('SELECT COUNT(*) n FROM research_runs').get().n) + 1).padStart(4, '0')}`;

  function run(input) {
    const runId = nextRunId();
    const uninstall = guardrails.isNetworkBlocked() ? null
      : guardrails.installNetworkBlock((e) => logger.log({ runId, component: 'guardrails', event: 'network_blocked', outcome: 'blocked', detail: e }));
    try { return execute(runId, input); } finally { if (uninstall) uninstall(); }
  }

  function execute(runId, input) {
    const info = provider.describe();
    const prompt = traceView(systemPrompt, info);
    const decisions = [];
    const decide = (text, detail = {}) => { decisions.push(text); logger.log({ runId, component: 'orchestrator', event: 'decision', detail: { text, ...detail } }); };
    const question = input && typeof input.question === 'string' ? input.question.slice(0, 300) : '';
    db.prepare('INSERT INTO research_runs (id, question, context_json, status, provider, started_at, finished_at, created_at) VALUES (?, ?, ?, ?, ?, ?, NULL, ?)')
      .run(runId, question, '{}', 'running', info.name, now(), now());
    logger.log({ runId, component: 'system_prompt', event: 'loaded', detail: { id: prompt.id, version: prompt.version, hash: prompt.hash, interpretedByProvider: prompt.interpretedByProvider } });

    const base = { runId, systemPrompt: prompt, provider: info, decisions };
    const finish = (status, extra) => {
      db.prepare('UPDATE research_runs SET status = ?, context_json = ?, finished_at = ? WHERE id = ?')
        .run(status, JSON.stringify(extra.context ? extra.context.request : {}), now(), runId);
      logger.log({ runId, component: 'orchestrator', event: 'run_finished', outcome: status.startsWith('completed') ? 'success' : status === 'blocked' || status === 'rejected' ? 'blocked' : 'failure', detail: { status } });
      return { ...base, status, ...extra, context: extra.context ? extra.context.snapshot() : null };
    };

    let context;
    try { context = createContext(input); } catch (err) {
      logger.log({ runId, component: 'context', event: 'request_rejected', outcome: err.name === 'GuardrailViolation' ? 'blocked' : 'failure', errorClass: err.name, detail: { message: err.message } });
      decide('Request rejected before planning.', { reason: err.message });
      return finish('rejected', { error: { class: err.name, rule: err.rule || null, message: err.message }, plan: [], results: [], report: null });
    }
    decide(`Request accepted: ${context.request.keywords.length} keyword(s) (${context.request.keywordSource}), ${context.request.platforms.length} platform(s).`);

    let planned;
    try { planned = plan(context, { toolNames: registry.list().map((t) => t.name) }); } catch (err) {
      logger.log({ runId, component: 'planner', event: 'planning_failed', outcome: 'failure', errorClass: err.name, detail: { code: err.code, message: err.message } });
      decide('Planning failed; nothing was executed.', { reason: err.message });
      return finish('failed', { context, error: { class: err.name, code: err.code, message: err.message }, plan: [], results: [], report: null });
    }
    tasks.save(runId, planned);
    logger.log({ runId, component: 'planner', event: 'plan_created', outcome: 'success', detail: { tasks: planned.map((t) => t.name) } });
    decide(`Plan accepted: ${planned.length} subtasks.`);

    const handlers = createHandlers({ runId, context, registry, kb, memory, review, provider, validateOutput, checkEvidence: guardrails.checkEvidence, db, decide });
    let stop = null, warnings = 0, error = null;
    for (const task of planned) {
      if (stop) { transition(task, 'skipped', { detail: `Skipped: run stopped (${stop}).` }); tasks.update(runId, task); continue; }
      if (task.needsRecords && !handlers.hasRecords()) { transition(task, 'skipped', { detail: 'Skipped: no records to work on.' }); tasks.update(runId, task); continue; }
      transition(task, 'running'); tasks.update(runId, task);
      try {
        const detail = logger.timed({ runId, component: task.component, event: `task:${task.name}`, detail: { seq: task.seq } }, () => handlers[task.name]());
        transition(task, 'completed', { detail });
      } catch (err) {
        transition(task, 'failed', { error: `${err.name}: ${err.message}` });
        if (err.name === 'GuardrailViolation') { stop = 'blocked'; error = { class: err.name, rule: err.rule, task: task.name, message: err.message }; decide(`Stopped: a guardrail blocked "${task.name}".`, { rule: err.rule }); }
        else if (task.critical) { stop = 'failed'; error = { class: err.name, task: task.name, message: err.message }; decide(`Stopped: critical task "${task.name}" failed.`, { errorClass: err.name }); }
        else { warnings += 1; decide(`Continued: non-critical task "${task.name}" failed.`, { errorClass: err.name }); }
      }
      tasks.update(runId, task);
    }

    const status = stop || (warnings ? 'completed_with_warnings' : 'completed');
    return finish(status, { context, error, plan: planned.map(({ needsRecords, ...t }) => t), ...handlers.output() });
  }

  return { run };
}

module.exports = { createOrchestrator };
