// Tests the Knowledge base question logic (CC.chat.ask) against the REAL data files, in Node.
// The page's scripts only touch the DOM inside functions this test does not call.
const fs = require('fs');
const REPO = process.env.CC_REPO || require('path').resolve(__dirname, '..', '..');
global.window = global;
for (const f of ['data.js', 'ui.js', 'ladder.js', 'chat.js']) eval(fs.readFileSync(`${REPO}/assets/${f}`, 'utf8'));
const read = (f) => JSON.parse(fs.readFileSync(`${REPO}/.colaberry/${f}`, 'utf8'));
const data = { mode: 'real', plan: read('plan.json'), progress: read('progress.json'), manifest: read('manifest.json'), agentDomain: read('agent-domain.json'), errors: [] };
// The same data without the snapshot, to check the answers that depend on it degrade honestly.
const noSnapshot = Object.assign({}, data, { agentDomain: null });

let pass = 0, fail = 0;
function t(q, expectText, expectCite, d = data) {
  const a = CC.chat.ask(d, q);
  const ok = a && expectText.test(a.text) && (expectCite === null ? a.cite === null : expectCite.test(a.cite || ''));
  ok ? pass++ : fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  "${q}"\n      → ${a && a.text}\n      ${a && a.cite ? 'From: ' + a.cite : '(no citation)'}`);
}
t('How fresh is the data?', /as of November 4, 2026 at 10:45 AM CST/, /Every tab · \.colaberry\/manifest\.json → generated_at/);
t('How many stories are verified?', /6 of 71 stories verified; 18 of 88 criteria passed; 66 points/, /Overview tab · \.colaberry\/progress\.json → totals/);
t('What are the releases?', /3 releases: r0 Discovery and validation \(5\); r1 Legacy migration plan \(1\); r2 r2 \(64\)/, /Project management tab/);
t('What outcomes are we measuring?', /no measures/, /Outcomes tab/);
t('Who are the users?', /do not name a role/, /Users and use case tab/);
t('Are there guardrails?', /no guardrail/, /Guardrails tab/);
t('Which systems does it connect to?', /names no external system/, /Systems tab/);
t('Which stories mention signal?', /stories match.*social_signal_discovery/, /Project management tab · \.colaberry\/plan\.json → stories/);
t('What is the autonomy of the agent?', /exists and is disabled, with agent-level autonomy "observe" \(not a ladder rung\) and 0 tools granted\. Each capability’s ceiling is on the Overview, panel 3/, /Overview tab · \.colaberry\/agent-domain\.json → agent/);
t('What does no_tool_grants constrain?', /constrains 0 of 64 capabilities\. None is approved above autonomy:R2, so it binds nothing/, /Overview tab · \.colaberry\/agent-domain\.json → authority\[\]\.reasons, authority_rule/);
t('What is the autonomy of the agent?', /no scoped agent roster, and the public snapshot is not loaded/, /AI agents tab/, noSnapshot);
t('What is the effective authority?', /public snapshot is not loaded/, /Overview tab · \.colaberry\/agent-domain\.json/, noSnapshot);
t('What is the weather in Dallas?', /can’t answer that from the data on this page/, null);
console.log(`\nquestion-box checks: ${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
