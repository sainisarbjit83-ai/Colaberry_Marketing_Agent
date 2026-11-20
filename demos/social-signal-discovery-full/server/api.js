/*
 * The local JSON API. Every route validates its input at the boundary and maps known error
 * classes to clear HTTP responses; internal details (stack traces) are never sent to the browser.
 *
 *   GET  /api/overview                 demo label, provider, prompt, scope, tools, 13 components
 *   GET  /api/knowledge-base           the fictional sample records
 *   GET  /api/runs | POST /api/runs    list runs | create and execute a run
 *   GET  /api/runs/:id[/logs]          one stored run | its execution log
 *   GET  /api/reviews                  the review audit history
 *   POST /api/reviews/:resultId        approve, reject or correct a result
 *   GET  /api/memory | POST /api/memory/clear
 *   GET  /api/evaluations | POST /api/evaluations | GET /api/evaluations/:id
 *   GET  /api/guardrails | POST /api/guardrails/check | POST /api/guardrails/network-test
 */
'use strict';

const guardrails = require('./components/guardrails');
const { COMPONENTS, STATUS } = require('./components-status');
const { createRunStore } = require('./run-store');
const { probeNetworkBlock } = require('./components/network-probe');

class HttpError extends Error {
  constructor(status, message, extra = {}) { super(message); this.name = 'HttpError'; this.status = status; this.extra = extra; }
}

const RUN_KEYS = ['question', 'keywords', 'platforms', 'dateFrom', 'dateTo', 'maxResults'];
const REVIEW_KEYS = ['decision', 'correctedLabel', 'note', 'reviewer'];
const DEMO = 'Local demonstration. Fictional sample records only. No live platform is searched and nothing is published, posted or sent.';

function onlyKeys(body, allowed) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new HttpError(400, 'The request body must be a JSON object.');
  const extra = Object.keys(body).filter((k) => !allowed.includes(k));
  if (extra.length) throw new HttpError(400, `Unknown field(s): ${extra.join(', ')}.`);
  return body;
}

function optionalString(v, name, max) {
  if (v === undefined || v === null) return undefined;
  if (typeof v !== 'string' || v.length > max) throw new HttpError(400, `${name} must be text of at most ${max} characters.`);
  return v;
}

/** Turn any thrown error into { status, body }. Unknown errors become a plain 500. */
function toResponse(err) {
  if (err instanceof HttpError) return { status: err.status, body: { error: { class: 'RequestError', message: err.message, ...err.extra } } };
  const known = {
    GuardrailViolation: 403, ReviewError: err.code === 'not_found' ? 404 : err.code === 'already_decided' ? 409 : 400,
    ContextError: 400, SchemaError: 400, RangeError: 400, BenchmarkError: 500, SystemPromptError: 500,
  };
  if (known[err.name]) return { status: known[err.name], body: { error: { class: err.name, message: err.message, rule: err.rule || err.code || null } } };
  return { status: 500, body: { error: { class: 'InternalError', message: 'The local server hit an unexpected error. See the server console.' } } };
}

function createApi({ agent, db }) {
  const runs = createRunStore(db);

  const routes = [
    ['GET', /^\/api\/overview$/, () => ({
      demo: DEMO, provider: agent.provider(), systemPrompt: agent.systemPrompt(), tools: agent.tools().map(({ name, description, permission }) => ({ name, description, permission })),
      scope: guardrails.SCOPE, components: COMPONENTS, statuses: Object.values(STATUS),
      counts: { samples: agent.knowledgeBase().length, runs: runs.list().length, evaluations: agent.evaluation.list().length, reviews: runs.reviews().length },
    })],
    ['GET', /^\/api\/knowledge-base$/, () => ({ records: agent.knowledgeBase() })],
    ['GET', /^\/api\/runs$/, () => ({ runs: runs.list() })],
    ['POST', /^\/api\/runs$/, (m, body) => {
      const input = onlyKeys(body, RUN_KEYS);
      return { status: 201, body: agent.run(input) };
    }],
    ['GET', /^\/api\/runs\/(RUN-\d{4})$/, ([, id]) => runs.get(id) || notFound(`Run ${id}`)],
    ['GET', /^\/api\/runs\/(RUN-\d{4})\/logs$/, ([, id]) => (runs.get(id) ? { logs: agent.logs(id) } : notFound(`Run ${id}`))],
    ['GET', /^\/api\/reviews$/, () => ({ reviews: runs.reviews() })],
    ['POST', /^\/api\/reviews\/(RUN-\d{4}:S-\d{3})$/, ([, resultId], body) => {
      const b = onlyKeys(body, REVIEW_KEYS);
      if (typeof b.decision !== 'string') throw new HttpError(400, 'decision is required: approve, reject or correct.');
      return agent.review.decide(resultId, { decision: b.decision, correctedLabel: optionalString(b.correctedLabel, 'correctedLabel', 60), note: optionalString(b.note, 'note', 500), reviewer: optionalString(b.reviewer, 'reviewer', 80) });
    }],
    ['GET', /^\/api\/memory$/, () => ({ records: agent.memory.inspect(), reviewAuditCount: runs.reviews().length })],
    ['POST', /^\/api\/memory\/clear$/, (m, body) => {
      const b = onlyKeys(body || {}, ['kind']);
      const out = agent.memory.clear(b.kind === undefined ? {} : { kind: b.kind });
      agent.log({ component: 'memory', event: 'memory_cleared', detail: { kind: b.kind || 'all', cleared: out.cleared } });
      return { ...out, reviewAuditRetained: runs.reviews().length, note: 'Memory records were deleted. The review decisions themselves are kept as the audit history.' };
    }],
    ['GET', /^\/api\/evaluations$/, () => ({ evaluations: agent.evaluation.list() })],
    ['POST', /^\/api\/evaluations$/, () => ({ status: 201, body: agent.evaluation.run() })],
    ['GET', /^\/api\/evaluations\/(EVAL-\d{4})$/, ([, id]) => agent.evaluation.get(id) || notFound(`Evaluation ${id}`)],
    ['GET', /^\/api\/guardrails$/, () => ({
      label: 'Demonstration guardrail, not a production security boundary.', networkBlocked: guardrails.isNetworkBlocked(),
      allowed: [...guardrails.ALLOWED_ACTIONS], blocked: Object.entries(guardrails.BLOCKED_ACTIONS).map(([action, reason]) => ({ action, reason })), scope: guardrails.SCOPE,
    })],
    ['POST', /^\/api\/guardrails\/check$/, (m, body) => {
      const b = onlyKeys(body, ['action']);
      const action = optionalString(b.action, 'action', 40);
      if (!action) throw new HttpError(400, 'action is required.');
      try {
        guardrails.checkAction(action);
        agent.log({ component: 'guardrails', event: 'demo_check', outcome: 'success', detail: { action } });
        return { action, allowed: true, message: `"${action}" is on the allow-list of local actions.` };
      } catch (err) {
        if (err.name !== 'GuardrailViolation') throw err;
        agent.log({ component: 'guardrails', event: 'demo_check', outcome: 'blocked', errorClass: err.name, detail: { action, rule: err.rule } });
        return { action, allowed: false, rule: err.rule, message: err.message };
      }
    }],
    ['POST', /^\/api\/guardrails\/network-test$/, () => {
      // Controlled probe: loopback target only, and only while the block is active.
      if (!guardrails.isNetworkBlocked()) throw new HttpError(503, 'The network block is not active, so the probe was not run.');
      const result = probeNetworkBlock((what, err) => agent.log({ component: 'guardrails', event: 'network_probe_unexpected', outcome: 'failure', errorClass: err.name, detail: { what, message: err.message } }));
      agent.log({ component: 'guardrails', event: 'network_probe', outcome: result.blocked ? 'blocked' : 'failure', detail: { attempts: result.attempts.map((a) => `${a.what}:${a.blocked ? 'blocked' : 'NOT BLOCKED'}`) } });
      if (!result.blocked) throw new HttpError(500, 'At least one network call was not refused. Stop the server and investigate.', { attempts: result.attempts });
      return result;
    }],
  ];

  function notFound(what) { throw new HttpError(404, `${what} was not found.`); }

  /** Handle one API request. Returns { status, body }. */
  function handle(method, pathname, body) {
    try {
      const route = routes.find(([m, re]) => m === method && re.test(pathname));
      if (!route) {
        const exists = routes.some(([, re]) => re.test(pathname));
        throw new HttpError(exists ? 405 : 404, exists ? `${method} is not allowed here.` : `No API route ${pathname}.`);
      }
      const out = route[2](pathname.match(route[1]), body);
      return out && out.status && out.body ? out : { status: 200, body: out };
    } catch (err) {
      return toResponse(err);
    }
  }

  return { handle };
}

module.exports = { createApi, toResponse, HttpError, DEMO };
