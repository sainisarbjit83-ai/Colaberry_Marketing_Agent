/*
 * Guardrails (component 10).
 *
 * DEMONSTRATION GUARDRAIL, NOT A PRODUCTION SECURITY BOUNDARY. The network block patches Node's
 * own network functions inside this process. It stops this demo's code from reaching any network,
 * and records every attempt, but code that bypassed Node's modules could get around it.
 *
 * What it enforces:
 *   - No outbound network: http/https requests, fetch, raw and TLS sockets, and DNS are refused.
 *   - Only allowed actions: anything that publishes, messages, reaches out or fetches is refused.
 *   - Only the approved platforms (configuration only; nothing is searched).
 *   - Every classification must cite evidence that really appears in the record it classifies.
 */
'use strict';

const http = require('http');
const https = require('https');
const net = require('net');
const tls = require('tls');
const dns = require('dns');
const SCOPE = require('../config/scope.json');

class GuardrailViolation extends Error {
  constructor(rule, message) { super(message); this.name = 'GuardrailViolation'; this.rule = rule; }
}

const ALLOWED_ACTIONS = new Set(['read_sample_signals', 'local_compute', 'write_local_report', 'write_local_log', 'write_local_memory', 'write_local_review']);
const BLOCKED_ACTIONS = Object.freeze({
  publish_post: 'Publishing is a human decision and is never done by this agent.',
  post_comment: 'Commenting on public platforms is outreach and is never done by this agent.',
  send_message: 'Messaging anyone is outreach and is never done by this agent.',
  contact_lead: 'Contacting people is outreach and is never done by this agent.',
  external_fetch: 'The demo is local-only; no external request is allowed.',
  live_platform_search: 'No live platform is searched; the demo reads fictional sample records only.',
  write_openclaw_signals: 'The demo never reads or writes the production openclaw_signals table.',
});

/** Throws GuardrailViolation unless the action is on the allow-list. Returns true when allowed. */
function checkAction(action) {
  if (ALLOWED_ACTIONS.has(action)) return true;
  if (BLOCKED_ACTIONS[action]) throw new GuardrailViolation('blocked_action', `Action "${action}" was refused: ${BLOCKED_ACTIONS[action]}`);
  throw new GuardrailViolation('unknown_action', `Action "${action}" was refused: it is not on the allow-list.`);
}

/** Returns the platforms if all are approved; throws, naming the refused ones, otherwise. */
function checkPlatforms(platforms) {
  const list = Array.isArray(platforms) ? platforms : [];
  const refused = list.filter((p) => !SCOPE.approved_platforms.includes(p));
  if (refused.length) {
    const excluded = refused.filter((p) => SCOPE.excluded_platforms.includes(p));
    throw new GuardrailViolation('platform_scope', `Platform(s) refused: ${refused.join(', ')}.${excluded.length ? ` ${excluded.join(', ')} ${excluded.length === 1 ? 'is' : 'are'} explicitly excluded.` : ''} Approved: ${SCOPE.approved_platforms.join(', ')}.`);
  }
  return list;
}

/**
 * A classification must cite at least one evidence span, and each span must be the exact text at
 * that position in the named field of the record. Throws GuardrailViolation otherwise.
 */
function checkEvidence(classification, record) {
  const ev = classification && classification.evidence;
  if (!Array.isArray(ev) || !ev.length) {
    if (classification && classification.code === 'none') return true; // "not relevant" needs no supporting phrase
    throw new GuardrailViolation('missing_evidence', `Classification of ${record.id} has no evidence.`);
  }
  for (const e of ev) {
    const source = String(record[e.field] == null ? '' : record[e.field]);
    if (source.slice(e.start, e.end).toLowerCase() !== String(e.text).toLowerCase()) {
      throw new GuardrailViolation('invalid_evidence', `Evidence "${e.text}" is not found at ${e.field}[${e.start}:${e.end}] of ${record.id}.`);
    }
  }
  return true;
}

// ---- Network block (in-process, demonstration only) ----
let installed = null;

/** Patch Node's network entry points to refuse and report every outbound attempt. Idempotent. */
function installNetworkBlock(onBlocked = () => {}) {
  if (installed) return installed.uninstall;
  const saved = [];
  const refuse = (what) => function blocked() {
    const err = new GuardrailViolation('network_blocked', `Outbound network access refused (${what}). This demo is local-only.`);
    onBlocked({ what, message: err.message });
    throw err;
  };
  const patch = (obj, key, what) => { saved.push([obj, key, obj[key]]); obj[key] = refuse(what); };
  patch(http, 'request', 'http.request'); patch(http, 'get', 'http.get');
  patch(https, 'request', 'https.request'); patch(https, 'get', 'https.get');
  patch(net, 'connect', 'net.connect'); patch(net, 'createConnection', 'net.createConnection');
  patch(net.Socket.prototype, 'connect', 'socket.connect');
  patch(tls, 'connect', 'tls.connect');
  patch(dns, 'lookup', 'dns.lookup'); patch(dns, 'resolve', 'dns.resolve');
  if (typeof globalThis.fetch === 'function') patch(globalThis, 'fetch', 'fetch');
  installed = { uninstall() { for (const [o, k, v] of saved.reverse()) o[k] = v; installed = null; } };
  return installed.uninstall;
}

const isNetworkBlocked = () => Boolean(installed);

module.exports = { GuardrailViolation, ALLOWED_ACTIONS, BLOCKED_ACTIONS, SCOPE, checkAction, checkPlatforms, checkEvidence, installNetworkBlock, isNetworkBlocked };
