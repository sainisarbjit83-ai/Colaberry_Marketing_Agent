/*
 * A controlled proof that the demonstration network block is active.
 *
 * It calls four of Node's network entry points (fetch, http.request, net.connect, dns.lookup) and
 * expects each to be refused with GuardrailViolation before anything happens. The target is the
 * loopback address 127.0.0.1, port 1 (nothing listens there), and the DNS name is "localhost", so
 * even if the block ever failed, no attempt could leave the machine. It runs only while the block
 * is installed, and it does not change or weaken the guardrail.
 */
'use strict';

const http = require('http');
const net = require('net');
const dns = require('dns');
const { isNetworkBlocked } = require('./guardrails');

const TARGET = Object.freeze({ host: '127.0.0.1', port: 1, url: 'http://127.0.0.1:1/', dnsName: 'localhost' });

class ProbeNotRunError extends Error {
  constructor(message) { super(message); this.name = 'ProbeNotRunError'; }
}

/**
 * Run the probe. onUnexpected(what, error) is called only if a call was NOT refused and later
 * failed on its own (a local connection error); such an attempt is already reported as not blocked.
 */
function probeNetworkBlock(onUnexpected = () => {}) {
  if (!isNetworkBlocked()) throw new ProbeNotRunError('The network block is not active, so the probe was not run.');
  const report = (what, err) => onUnexpected(what, err);

  function attempt(what, fn) {
    let handle;
    try {
      handle = fn();
    } catch (err) {
      if (err.name === 'GuardrailViolation') return { what, blocked: true, rule: err.rule, message: err.message };
      return { what, blocked: false, message: `Not refused by the guardrail: ${err.name}: ${err.message}` };
    }
    // Reached only if the block failed: stop the loopback attempt at once and report it.
    if (handle && typeof handle.then === 'function') handle.then(() => report(what, new Error('unexpected response')), (e) => report(what, e));
    if (handle && typeof handle.on === 'function') handle.on('error', (e) => report(what, e));
    if (handle && typeof handle.destroy === 'function') handle.destroy();
    return { what, blocked: false, message: 'The call was not refused by the guardrail.' };
  }

  const attempts = [
    attempt('fetch', () => globalThis.fetch(TARGET.url)),
    attempt('http.request', () => http.request({ host: TARGET.host, port: TARGET.port, timeout: 1000 })),
    attempt('net.connect', () => net.connect(TARGET.port, TARGET.host)),
    attempt('dns.lookup', () => dns.lookup(TARGET.dnsName, (e) => { if (e) report('dns.lookup', e); })),
  ];
  return { blocked: attempts.every((a) => a.blocked), target: `${TARGET.host}:${TARGET.port} (loopback, closed port) and DNS name "${TARGET.dnsName}"; no external destination`, attempts };
}

module.exports = { probeNetworkBlock, ProbeNotRunError, TARGET };
