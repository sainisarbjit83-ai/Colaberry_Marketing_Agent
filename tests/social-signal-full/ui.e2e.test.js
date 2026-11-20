// Phase 4 end-to-end browser test: drives the real UI in headless Edge (DevTools protocol, no new
// dependencies) against the real server. One continuous walkthrough, the way a manager would see it.
// Also records every network request the page makes and asserts all of them stayed on 127.0.0.1.
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const { startServer, launchBrowser, edgeAvailable } = require('./e2e-helpers');

const js = (s) => JSON.stringify(s);
const count = (sel) => `document.querySelectorAll(${js(sel)}).length`;
const text = (sel) => `(document.querySelector(${js(sel)}) || {}).textContent || ''`;

test('e2e ui: complete walkthrough in a real browser', { skip: !edgeAvailable() && 'Microsoft Edge not found (set EDGE_PATH)', timeout: 180000 }, async () => {
  // SSD_E2E_BASE points the walkthrough at an already-running server started with the documented
  // command (it must have a fresh database, because the steps expect RUN-0001 and EVAL-0001).
  const external = process.env.SSD_E2E_BASE;
  const srv = external ? { base: external.replace(/\/$/, ''), stop: async () => {}, dir: null } : await startServer();
  const b = await launchBrowser();
  const steps = [];
  const step = async (name, fn) => {
    try { await fn(); } catch (err) {
      const seen = await b.evaluate("(document.querySelector('#view') || document.body).innerText.slice(0, 800)").catch(() => '(page unreadable)');
      throw new Error(`Step "${name}" failed: ${err.message}\n--- visible page text ---\n${seen}`);
    }
    steps.push(name);
  };
  try {
    const go = async (hash, readySel) => { await b.navigate(`${srv.base}/${hash}`); await b.waitFor(`${count(readySel)} > 0`, `${hash}: ${readySel}`); };
    const set = (sel, value) => b.evaluate(`(() => { const el = document.querySelector(${js(sel)}); el.value = ${js(value)}; el.dispatchEvent(new Event('change', { bubbles: true })); return true; })()`);
    const click = (sel) => b.evaluate(`(() => { const el = document.querySelector(${js(sel)}); if (!el) throw new Error('missing ' + ${js(sel)}); el.click(); return true; })()`);
    const bodyClean = async (where) => { const t = await b.evaluate('document.body.innerText'); assert.ok(!/\bundefined\b|NaN|\[object /.test(t), `${where}: stray undefined/NaN/[object]`); };

    await step('overview shows labels and the 13 components', async () => {
      await go('#overview', '[data-component]');
      assert.equal(await b.evaluate(count('[data-component]')), 13);
      assert.match(await b.evaluate(text('#demo-banner')), /LOCAL DEMO · FICTIONAL RECORDS ONLY/);
      await b.waitFor(`${text('#provider-banner')}.includes('not a language model')`, 'provider banner');
      assert.match(await b.evaluate(text('#server-status')), /Local server connected/);
      assert.equal(await b.evaluate(`document.querySelector('[data-component="LLM (Brain)"] [data-status]').dataset.status`), 'Simulated');
      await bodyClean('overview');
    });

    await step('run 1 executes with plan, evidence and reasoning', async () => {
      await go('#research', '#research-form');
      await set('#q', 'Which teams want AI training?');
      await set('#kw', 'ai, training');
      await click('#run-btn');
      await b.waitFor(`document.querySelector('#run-output')?.dataset.runStatus === 'completed'`, 'run 1 completed');
      assert.equal(await b.evaluate(`document.querySelector('#run-output').dataset.runId`), 'RUN-0001');
      assert.equal(await b.evaluate(count('[data-task-status="completed"]')), 11);
      assert.ok(await b.evaluate(count('article.result')) > 0);
      assert.ok(await b.evaluate(count('article.result mark')) > 0, 'evidence is highlighted in the record text');
      assert.match(await b.evaluate(text('#run-output')), /does not read or interpret/);
      await bodyClean('research');
    });

    const review = async (signal, decision, note, label) => {
      const box = `article[data-signal-id="${signal}"]`;
      await set(`${box} [data-field="reviewer"]`, 'Demo Reviewer');
      await set(`${box} [data-field="decision"]`, decision);
      if (label) await set(`${box} [data-field="correctedLabel"]`, label);
      await set(`${box} [data-field="note"]`, note);
      await click(`${box} form button[type="submit"]`);
    };

    await step('a correction without a note is refused with a readable message', async () => {
      await review('S-001', 'correct', '', 'general');
      await b.waitFor(`${text('article[data-signal-id="S-001"] [data-review-box]')}.includes('reviewer note')`, 'note required message');
    });

    await step('approve, reject and correct are recorded with no external action', async () => {
      await review('S-005', 'approve', 'Directors training request.');
      await review('S-002', 'reject', 'Governance question, not a purchase.');
      await review('S-001', 'correct', 'Interest only, not a purchase.', 'general');
      for (const [s, st] of [['S-005', 'approved'], ['S-002', 'rejected'], ['S-001', 'corrected']]) {
        try {
          await b.waitFor(`${count(`article[data-signal-id="${s}"] [data-review-status="${st}"]`)} === 1`, `${s} ${st}`);
        } catch (err) {
          throw new Error(`${err.message}; review box says: ${await b.evaluate(text(`article[data-signal-id="${s}"] [data-review-box]`))}`);
        }
      }
      assert.match(await b.evaluate(text('article[data-signal-id="S-005"] [data-review-box]')), /No external action was taken/);
    });

    await step('run 2 recalls run 1 and shows the earlier review separately', async () => {
      await set('#q', 'Follow-up: leadership training demand');
      await set('#kw', 'training, leadership, ai');
      await click('#run-btn');
      await b.waitFor(`document.querySelector('#run-output')?.dataset.runId === 'RUN-0002'`, 'run 2');
      assert.equal(await b.evaluate(count('[data-prior-run="RUN-0001"]')), 1);
      const card = 'article[data-signal-id="S-001"]';
      assert.equal(await b.evaluate(count(`${card} [data-prior-review="correct"]`)), 1);
      assert.equal(await b.evaluate(`document.querySelector('${card} [data-classification]').dataset.classification`), 'buying', 'the new classification is not overwritten');
      assert.match(await b.evaluate(text(`${card} [data-prior-review]`)), /recalled from memory[\s\S]*has not been changed/i);
    });

    await step('an out-of-scope platform is rejected in plain language', async () => {
      await click('#out-of-scope-btn');
      await b.waitFor(`document.querySelector('#run-output')?.dataset.runStatus === 'rejected'`, 'rejected run');
      assert.match(await b.evaluate(text('#run-output')), /outside the approved scope[\s\S]*LinkedIn comments is explicitly excluded/);
    });

    await step('the execution log for run 2 is inspectable', async () => {
      await go('#trace?run=RUN-0002', '#log-table tbody tr');
      assert.ok(await b.evaluate(count('[data-log-event="task:classify"]')) > 0);
      assert.ok(await b.evaluate(count('[data-run-link]')) >= 3);
      await bodyClean('trace');
    });

    await step('evaluation separates software checks from quality, and repeats deterministically', async () => {
      await go('#evaluation', '#run-eval');
      await click('#run-eval');
      await b.waitFor(count('#evaluation-report'), 'evaluation report', 30000);
      assert.equal(await b.evaluate(count('[data-check-passed="true"]')), 11);
      assert.equal(await b.evaluate(text('[data-cell="buying:buying"]')), '6');
      assert.equal(await b.evaluate(count('[data-difficulty]')), 2);
      assert.match(await b.evaluate(text('#evaluation-report')), /NOT Sohail Syed's approved buyer-signal criteria/);
      await click('#run-eval');
      await b.waitFor(`document.querySelector('#evaluation-report')?.dataset.evalId === 'EVAL-0002'`, 'second evaluation', 30000);
      assert.equal(await b.evaluate(`document.querySelector('[data-determinism]').dataset.determinism`), 'match');
      await bodyClean('evaluation');
    });

    await step('clearing memory keeps the review audit history', async () => {
      await go('#memory', '#audit-table');
      assert.equal(await b.evaluate(count('[data-memory-feedback]')), 3);
      assert.equal(await b.evaluate(count('[data-audit]')), 3);
      await b.evaluate('window.confirm = () => true; true');
      await click('#clear-memory');
      await b.waitFor(`document.body.innerText.includes('review decision(s) remain in the audit history')`, 'cleared notice');
      assert.equal(await b.evaluate(count('[data-memory-feedback]')), 0);
      assert.equal(await b.evaluate(count('[data-audit]')), 3);
    });

    await step('guardrail demonstrations are refused and explained', async () => {
      await go('#guardrails', '[data-blocked-action]');
      await click('[data-blocked-action="send_message"] button');
      await b.waitFor(count('[data-guardrail-result="blocked"]'), 'blocked action');
      await click('#network-test');
      await b.waitFor(count('[data-guardrail-result="network-blocked"]'), 'network blocked');
      assert.equal(await b.evaluate(count('[data-probe]')), 4);
      assert.ok(!(await b.evaluate(text('#guardrail-results'))).includes('NOT refused'));
      await click('#platform-test');
      await b.waitFor(count('[data-guardrail-result="platform-rejected"]'), 'platform rejected');
      await bodyClean('guardrails');
    });

    await step('knowledge base and system prompt pages', async () => {
      await go('#knowledge', '[data-kb-id]');
      assert.equal(await b.evaluate(count('[data-kb-id]')), 20);
      await go('#prompt', '#prompt-instructions li');
      assert.match(await b.evaluate(text('#prompt-disclosure')), /does not read or interpret/);
      await bodyClean('prompt');
    });

    await step('no page errors, and every request stayed on the local server', async () => {
      const exceptions = b.events.filter((e) => e.method === 'Runtime.exceptionThrown');
      assert.deepEqual(exceptions.map((e) => JSON.stringify(e.params).slice(0, 300)), [], 'no uncaught script errors');
      const logged = b.events.filter((e) => e.method === 'Log.entryAdded' && e.params.entry.level === 'error').map((e) => e.params.entry);
      // The only error the browser may log is the deliberate 400 from the "correction without a note" step.
      const unexpected = logged.filter((x) => !(x.source === 'network' && /status of 400/.test(x.text) && /\/api\/reviews\/RUN-0001%3AS-001$/.test(x.url)));
      assert.deepEqual(unexpected.map((x) => `${x.source}: ${x.text} ${x.url || ''}`), [], 'no unexpected console errors (CSP, 404, script)');
      assert.equal(logged.length - unexpected.length, 1, 'the deliberate rejection was logged exactly once');
      const urls = b.events.filter((e) => e.method === 'Network.requestWillBeSent').map((e) => e.params.request.url);
      assert.ok(urls.length > 20);
      const outside = urls.filter((u) => !u.startsWith(srv.base) && !/^(about:|data:|devtools:|chrome-extension:)/.test(u));
      assert.deepEqual(outside, []);
    });
  } finally {
    await b.close();
    await srv.stop();
    if (srv.dir) fs.rmSync(srv.dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    console.log(`ui walkthrough steps passed: ${steps.length}\n  - ${steps.join('\n  - ')}`);
  }
});
