// Tests the Knowledge base question logic (CC.chat.ask) against the REAL data files, in Node.
// The page's scripts only touch the DOM inside functions this test does not call.
const fs = require('fs');
const REPO = process.env.CC_REPO || require('path').resolve(__dirname, '..', '..');
global.window = global;
for (const f of ['data.js', 'ui.js', 'chat.js']) eval(fs.readFileSync(`${REPO}/assets/${f}`, 'utf8'));
const read = (f) => JSON.parse(fs.readFileSync(`${REPO}/.colaberry/${f}`, 'utf8'));
const data = { mode: 'real', plan: read('plan.json'), progress: read('progress.json'), manifest: read('manifest.json'), errors: [] };

let pass = 0, fail = 0;
function t(q, expectText, expectCite) {
  const a = CC.chat.ask(data, q);
  const ok = a && expectText.test(a.text) && (expectCite === null ? a.cite === null : expectCite.test(a.cite || ''));
  ok ? pass++ : fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  "${q}"\n      → ${a && a.text}\n      ${a && a.cite ? 'From: ' + a.cite : '(no citation)'}`);
}
t('How fresh is the data?', /as of October 28, 2026/, /Every tab · \.colaberry\/manifest\.json → generated_at/);
t('How many stories are verified?', /0 of 71 stories verified/, /Overview tab · \.colaberry\/progress\.json → totals/);
t('What are the releases?', /3 releases: r0 Discovery and validation \(5\); r1 Legacy migration plan \(1\); r2 r2 \(64\)/, /Project management tab/);
t('What outcomes are we measuring?', /no measures/, /Outcomes tab/);
t('Who are the users?', /do not name a role/, /Users and use case tab/);
t('Are there guardrails?', /no guardrail/, /Guardrails tab/);
t('Which systems does it connect to?', /names no external system/, /Systems tab/);
t('Which stories mention signal?', /stories match.*social_signal_discovery/, /Project management tab · \.colaberry\/plan\.json → stories/);
t('What is the autonomy of the agent?', /no scoped agent roster.*not in your data files/, /AI agents tab/);
t('What is the weather in Dallas?', /can’t answer that from the data on this page/, null);
console.log(`\nquestion-box checks: ${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
