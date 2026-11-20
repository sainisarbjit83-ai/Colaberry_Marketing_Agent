/*
 * Context Manager (component 2): validates a research request once, then holds it and the output
 * of every workflow step for the rest of the run, so each step reads what earlier steps produced.
 *
 * The request (question, keywords, platforms, dates, result limit) is frozen after validation.
 * Excluded or unknown platforms are refused by the guardrail's platform check.
 */
'use strict';

const { words } = require('./text');
const { checkPlatforms, SCOPE } = require('./guardrails');

class ContextError extends Error {
  constructor(message) { super(message); this.name = 'ContextError'; }
}

const L = SCOPE.limits;

function validDate(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

function readKeywords(raw, question) {
  if (raw === undefined) return { keywords: [...new Set(words(question))].slice(0, L.max_keywords), source: 'derived from the question' };
  if (!Array.isArray(raw)) throw new ContextError('Keywords must be a list.');
  const keywords = [...new Set(raw.map((k) => (typeof k === 'string' ? k.trim().toLowerCase() : '')).filter(Boolean))];
  if (!keywords.length) throw new ContextError('Give at least one keyword, or leave keywords out to derive them from the question.');
  if (keywords.length > L.max_keywords) throw new ContextError(`At most ${L.max_keywords} keywords are allowed.`);
  const long = keywords.find((k) => k.length > L.max_keyword_length);
  if (long) throw new ContextError(`Keyword "${long.slice(0, 20)}..." is longer than ${L.max_keyword_length} characters.`);
  return { keywords, source: 'provided' };
}

/** Validate a request and return a context. Throws ContextError, or GuardrailViolation for platforms. */
function createContext(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new ContextError('The request must be an object.');
  const question = typeof input.question === 'string' ? input.question.trim() : '';
  if (!question) throw new ContextError('A research question is required.');
  if (question.length > L.max_question_length) throw new ContextError(`The question is longer than ${L.max_question_length} characters.`);

  const { keywords, source } = readKeywords(input.keywords, question);

  let platforms = [...SCOPE.approved_platforms];
  if (input.platforms !== undefined) {
    if (!Array.isArray(input.platforms) || !input.platforms.length) throw new ContextError('Platforms must be a non-empty list, or left out to use all approved platforms.');
    platforms = [...new Set(checkPlatforms(input.platforms))];
  }

  const dateFrom = input.dateFrom || null, dateTo = input.dateTo || null;
  for (const [name, v] of [['dateFrom', dateFrom], ['dateTo', dateTo]]) if (v !== null && !validDate(v)) throw new ContextError(`${name} must be a real date written YYYY-MM-DD.`);
  if (dateFrom && dateTo && dateFrom > dateTo) throw new ContextError('dateFrom is after dateTo.');

  const maxResults = input.maxResults === undefined ? L.max_results : input.maxResults;
  if (!Number.isInteger(maxResults) || maxResults < 1 || maxResults > L.max_results) throw new ContextError(`maxResults must be a whole number from 1 to ${L.max_results}.`);

  const request = Object.freeze({ question, keywords: Object.freeze(keywords), keywordSource: source, platforms: Object.freeze(platforms), dateFrom, dateTo, maxResults });
  const data = new Map();
  const summaries = [];

  return {
    request,
    /** Store a step's output for later steps, with a one-line summary for the trace. */
    put(step, value, summary) { data.set(step, value); summaries.push({ step, summary }); },
    get(step) { return data.get(step); },
    has(step) { return data.has(step); },
    snapshot() { return { request, steps: summaries.map((s) => ({ ...s })) }; },
  };
}

module.exports = { createContext, ContextError, validDate };
