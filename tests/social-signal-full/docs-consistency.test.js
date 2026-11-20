// Phase 5 drift guard: the README's component table and the demo guide must state the same 13
// components and statuses as the UI (server/components-status.js), and the docs must keep the
// fictional / not-approved / not-authorized statements.
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { req, SERVER } = require('./helpers');

const { COMPONENTS, STATUS } = req('components-status');
const DEMO = path.dirname(SERVER);
const readme = fs.readFileSync(path.join(DEMO, 'README.md'), 'utf8');
const guide = fs.readFileSync(path.join(DEMO, 'DEMO_GUIDE.md'), 'utf8');

test('docs: the README component table matches the UI statuses exactly', () => {
  const rows = [...readme.matchAll(/^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/gm)]
    .map((m) => ({ n: Number(m[1]), name: m[2].trim(), status: m[3].replace(/\*/g, '').trim() }));
  assert.equal(rows.length, 13);
  assert.deepEqual(rows.map((r) => r.name), COMPONENTS.map((c) => c.name));
  assert.deepEqual(rows.map((r) => r.status), COMPONENTS.map((c) => c.status));
  assert.ok(rows.every((r) => Object.values(STATUS).includes(r.status)));
});

test('docs: the demo guide names the non-implemented statuses correctly', () => {
  const partly = COMPONENTS.filter((c) => c.status === STATUS.partial).map((c) => c.name.split(' ')[0]);
  const simulated = COMPONENTS.filter((c) => c.status === STATUS.simulated).map((c) => c.name);
  assert.deepEqual(simulated, ['LLM (Brain)']);
  assert.match(guide, /the LLM is \*\*Simulated\*\*/);
  for (const p of partly) assert.ok(new RegExp(`${p}[^.]*\\*\\*Partly implemented\\*\\*`).test(guide.replace(/\n/g, ' ')), `guide marks ${p} as partly implemented`);
  assert.match(guide, new RegExp(`other ${COMPONENTS.filter((c) => c.status === STATUS.done).length === 9 ? 'nine' : 'X'} are implemented`));
});

test('docs: fictional, not-approved and not-authorized statements are present', () => {
  for (const doc of [readme, guide]) {
    assert.match(doc, /fictional/i);
    assert.match(doc, /not Sohail Syed's approved buyer-signal criteria|not approved by\s+Sohail/i);
    assert.match(doc, /openclaw_signals/);
  }
  assert.match(guide, /## Not authorized[\s\S]*production deployment[\s\S]*live platform\s+scanning[\s\S]*real LLM calls[\s\S]*external action[\s\S]*permissions or autonomy/);
  assert.match(readme, /node demos\/social-signal-discovery-full\/server\/server\.js/);
  assert.match(readme, /http:\/\/127\.0\.0\.1:4310/);
});
