// Phase 5: the controlled network-block probe. It must report every entry point as refused while
// the block is active, refuse to run when the block is off, and never name an external target.
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { req } = require('./helpers');

const g = req('components/guardrails');
const { probeNetworkBlock, ProbeNotRunError, TARGET } = req('components/network-probe');

test('network probe: every entry point is refused while the block is active', () => {
  const unexpected = [];
  const uninstall = g.installNetworkBlock();
  let out;
  try { out = probeNetworkBlock((what, err) => unexpected.push([what, err.message])); } finally { uninstall(); }
  assert.equal(out.blocked, true);
  assert.deepEqual(out.attempts.map((a) => [a.what, a.blocked, a.rule]), [
    ['fetch', true, 'network_blocked'], ['http.request', true, 'network_blocked'], ['net.connect', true, 'network_blocked'], ['dns.lookup', true, 'network_blocked'],
  ]);
  assert.deepEqual(unexpected, []);
});

test('network probe: refuses to run when the block is not active', () => {
  assert.equal(g.isNetworkBlocked(), false);
  assert.throws(() => probeNetworkBlock(), ProbeNotRunError);
});

test('network probe: targets only loopback and localhost, never an external destination', () => {
  assert.equal(TARGET.host, '127.0.0.1');
  assert.equal(TARGET.dnsName, 'localhost');
  assert.match(TARGET.url, /^http:\/\/127\.0\.0\.1:1\//);
  const src = require('fs').readFileSync(require('path').join(__dirname, '..', '..', 'demos', 'social-signal-discovery-full', 'server', 'components', 'network-probe.js'), 'utf8');
  assert.ok(!/example\.com|https:\/\//.test(src.replace(/\/\*[\s\S]*?\*\//g, '')), 'no external URL in the probe code');
});
