/*
 * System Prompt (component 1): the agent's instructions, stored as separate configuration
 * (config/system-prompt.json), loaded and validated at start-up, and shown in every run's trace.
 *
 * DISCLOSURE: the simulated provider does not interpret these instructions like a real LLM. The
 * prompt is carried so the trace shows what a real model would be given; the simulated provider's
 * behaviour comes from its fixed word rules. traceView() states this on every run.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { LABELS } = require('./llm/provider');

const DEFAULT_FILE = path.join(__dirname, '..', 'config', 'system-prompt.json');

class SystemPromptError extends Error {
  constructor(message) { super(message); this.name = 'SystemPromptError'; }
}

const nonEmpty = (s) => typeof s === 'string' && s.trim().length > 0;

/** Throws SystemPromptError unless the configuration has every required, well-formed field. */
function validateSystemPrompt(p) {
  if (!p || typeof p !== 'object' || Array.isArray(p)) throw new SystemPromptError('The system prompt must be a JSON object.');
  for (const k of ['id', 'version', 'status', 'role', 'disclosure']) if (!nonEmpty(p[k])) throw new SystemPromptError(`The system prompt needs a non-empty "${k}".`);
  if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.]+)?$/.test(p.version)) throw new SystemPromptError(`Version "${p.version}" is not of the form 1.2.3 or 1.2.3-tag.`);
  if (!Array.isArray(p.instructions) || !p.instructions.length || p.instructions.length > 20 || !p.instructions.every((s) => nonEmpty(s) && s.length <= 400)) {
    throw new SystemPromptError('Instructions must be a list of 1 to 20 non-empty lines of at most 400 characters.');
  }
  const labels = p.labels || {};
  if (Object.keys(labels).sort().join() !== Object.keys(LABELS).sort().join() || Object.keys(LABELS).some((k) => labels[k] !== LABELS[k])) {
    throw new SystemPromptError('The prompt labels must match the provider labels exactly.');
  }
  if (!/simulated/i.test(p.disclosure) || !/not/i.test(p.disclosure)) throw new SystemPromptError('The disclosure must say the simulated provider does not interpret the instructions.');
  return p;
}

/** Load, validate and fingerprint the system prompt. The hash shows which exact text a run used. */
function loadSystemPrompt(file = DEFAULT_FILE) {
  let raw;
  try { raw = fs.readFileSync(file, 'utf8'); } catch (err) { throw new SystemPromptError(`Cannot read the system prompt at ${file}: ${err.code || err.message}.`); }
  let parsed;
  try { parsed = JSON.parse(raw); } catch (err) { throw new SystemPromptError(`The system prompt is not valid JSON: ${err.message}`); }
  validateSystemPrompt(parsed);
  const hash = crypto.createHash('sha256').update(raw).digest('hex').slice(0, 12);
  return Object.freeze({ ...parsed, instructions: Object.freeze([...parsed.instructions]), hash, file: path.basename(file) });
}

/** What every trace shows: version, instructions and whether the active provider can read them. */
function traceView(prompt, providerInfo) {
  const interpreted = Boolean(providerInfo && providerInfo.isRealLlm && providerInfo.enabled);
  return {
    id: prompt.id, version: prompt.version, hash: prompt.hash, file: prompt.file, status: prompt.status,
    role: prompt.role, instructions: [...prompt.instructions], labels: { ...prompt.labels },
    interpretedByProvider: interpreted,
    disclosure: interpreted ? null : prompt.disclosure,
  };
}

module.exports = { loadSystemPrompt, validateSystemPrompt, traceView, SystemPromptError, DEFAULT_FILE };
