// Rendered-page tests for the Command Center. Loads each page in headless Edge (--dump-dom).
// Real repo files are only read; modified data lives in copies under the system temp folder.
const { spawnSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const EDGE = process.env.EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const HERE = __dirname;
const TMP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'cc-render-'));
// CC_REPO points the suite at another copy of the site, e.g. an export of a commit.
const REPO = process.env.CC_REPO || path.resolve(__dirname, '..', '..');
const TABS = ['overview', 'outcomes', 'users', 'guardrails', 'systems', 'project', 'agents', 'knowledge', 'data-model'];
let pass = 0, fail = 0;
const failures = [];

function dom(url) {
  const r = spawnSync(EDGE, ['--headless=new', '--disable-gpu', `--user-data-dir=${TMP}/edge-profile`, '--virtual-time-budget=4000', '--dump-dom', url], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 60000 });
  return r.stdout || '';
}
/**
 * The DOM once `ready` (a page expression) is true, read over the DevTools protocol.
 *
 * Needed for a page with a request that never returns: virtual time waits for every pending
 * request and never dumps, and a plain --dump-dom fires at the load event, which can come before
 * the other files arrive. This drives Edge directly and polls until the page reaches the state
 * being tested. Uses Node's built-in WebSocket (Node 22+); no dependency.
 */
async function domWhen(url, ready, timeoutMs = 20000) {
  const port = 9333;
  const edge = spawn(EDGE, ['--headless=new', '--disable-gpu', `--user-data-dir=${TMP}/edge-cdp`, `--remote-debugging-port=${port}`, 'about:blank'], { stdio: 'ignore' });
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  try {
    let target = null;
    for (let i = 0; i < 50 && !target; i++) {
      await wait(200);
      try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page'); } catch { /* not listening yet */ }
    }
    if (!target) return '';
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    let id = 0;
    const pending = new Map();
    ws.onmessage = (m) => { const msg = JSON.parse(m.data); if (pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); } };
    const send = (method, params) => new Promise((res) => { pending.set(++id, res); ws.send(JSON.stringify({ id, method, params })); });
    const evaluate = async (expression) => ((await send('Runtime.evaluate', { expression, returnByValue: true })) || {}).result || {};
    await send('Page.navigate', { url });
    const until = Date.now() + timeoutMs;
    while (Date.now() < until && !(await evaluate(ready)).value) await wait(200);
    const html = (await evaluate('document.documentElement.outerHTML')).value || '';
    ws.close();
    return html;
  } finally {
    edge.kill();
  }
}
const text = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
function check(cond, label) { if (cond) pass++; else { fail++; failures.push(label); } }
const cardHrefs = (html) => [...html.matchAll(/<a class="card" href="([^"]+)"/g)].map((m) => m[1]);

// The six STORY-000 panels: their data-state attributes in order, and one panel's own text.
const panelStates = (html) => [...html.matchAll(/<section class="panel [^"]*" data-state="([a-z]+)"/g)].map((m) => m[1]);
function panelText(html, n) {
  const start = html.indexOf(`id="panel-${n}"`);
  if (start < 0) return '';
  const end = html.indexOf('</section>', start);
  return text(html.slice(start, end < 0 ? undefined : end));
}

// One capability's row in panel 3's ceiling table: its cells' text, and each rung cell's classes.
function capRow(html, id) {
  const m = html.match(new RegExp(`<tr data-capability="${id.replace(/\./g, '\\.')}">([\\s\\S]*?)</tr>`));
  if (!m) return null;
  const cells = [...m[1].matchAll(/<td>([\s\S]*?)<\/td>/g)].map((c) => text(c[1]).trim());
  const rungs = Object.fromEntries([...m[1].matchAll(/<span class="rung ([^"]*)" data-rung="(R\d)"/g)].map((r) => [r[2], r[1]]));
  return { cells, rungs };
}

// The owner's wording for the ten rungs, copied independently from AUTONOMY_MEANINGS in the
// platform's autonomyLadder.ts, so the page is checked against the source rather than itself.
const OWNER_RUNGS = [
  'Define the workflow, requirements, risks and human decisions.',
  'Prepare isolated development, fixtures and baseline tests.',
  'Answer questions using approved knowledge and records.',
  'Perform approved, user-initiated sandbox tool operations.',
  'Execute and verify stateful, multi-step sandbox tasks.',
  'Evaluate in shadow mode against approved reference outcomes.',
  'Conduct a separately approved, supervised production pilot.',
  'Automate only explicitly authorized action classes within limits.',
  'Coordinate necessary, authorized handoffs with other agents.',
  'Demonstrate reliable operation, monitoring, recovery and ownership.',
];

function copySite(dest, mutate) {
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(path.join(dest, '.colaberry'), { recursive: true });
  fs.cpSync(path.join(REPO, 'assets'), path.join(dest, 'assets'), { recursive: true });
  fs.copyFileSync(path.join(REPO, 'index.html'), path.join(dest, 'index.html'));
  for (const f of ['plan.json', 'progress.json', 'manifest.json', 'agent-domain.json']) fs.copyFileSync(path.join(REPO, '.colaberry', f), path.join(dest, '.colaberry', f));
  mutate(dest);
}
const rw = (file, fn) => { const j = JSON.parse(fs.readFileSync(file, 'utf8')); fn(j); fs.writeFileSync(file, JSON.stringify(j)); };

const servers = [];
function serve(dir, port, hold) { servers.push(spawn('node', [path.join(HERE, 'serve.js'), dir, String(port), ...(hold ? [hold] : [])], { stdio: 'ignore' })); }

async function main() {
  const V = path.join(TMP, 'variants');
  const firstStory = JSON.parse(fs.readFileSync(path.join(REPO, '.colaberry/plan.json'), 'utf8')).stories[0].id;
  const variants = {
    A: [8781, (d) => rw(path.join(d, '.colaberry/plan.json'), (p) => { p.project.name = 'RENAMED-IN-COPY'; p.releases = p.releases.filter((r) => r.key !== 'r1'); p.stories = p.stories.filter((s) => s.id !== firstStory); })],
    B: [8782, (d) => rw(path.join(d, '.colaberry/manifest.json'), (m) => { m.generated_at = new Date(Date.now() - 10 * 86400000).toISOString(); })],
    C: [8783, (d) => fs.rmSync(path.join(d, '.colaberry/manifest.json'))],
    D: [8784, (d) => fs.rmSync(path.join(d, '.colaberry/plan.json'))],
    E: [8785, (d) => fs.rmSync(path.join(d, '.colaberry/progress.json'))],
    // Snapshot variants for the six panels.
    F: [8786, (d) => fs.rmSync(path.join(d, '.colaberry/agent-domain.json'))],
    G: [8787, (d) => fs.writeFileSync(path.join(d, '.colaberry/agent-domain.json'), '{ not json')],
    H: [8788, (d) => fs.writeFileSync(path.join(d, '.colaberry/agent-domain.json'), '')],
    I: [8789, (d) => rw(path.join(d, '.colaberry/agent-domain.json'), (s) => {
      // An edited COPY: no agent, one capability capped by no_tool_grants, and three requests using
      // the platform's real values (kind change|tool, status submitted|approved|declined) plus one
      // whose kind and status the platform does not define.
      s.agent = { exists: false };
      s.governance.requests = [
        { id: 'copy-1', kind: 'tool', title: 'COPY-TOOL-REQUEST read_marketing_database', status: 'submitted', requested_at: '2026-11-02T15:00:00Z', approved_at: null, declined_reason: null },
        { id: 'copy-4', kind: 'tool', title: 'COPY-APPROVED-TOOL screenshot_capture', status: 'approved', requested_at: '2026-11-01T15:00:00Z', approved_at: '2026-11-01T18:00:00Z', declined_reason: null },
        { id: 'copy-2', kind: 'change', title: 'COPY-CHANGE-REQUEST rename', status: 'declined', requested_at: '2026-11-02T15:00:00Z', approved_at: '2026-11-02T16:30:00Z', declined_reason: 'COPY-REASON' },
        { id: 'copy-3', kind: 'tool_grant', title: 'COPY-ODD-REQUEST', status: 'on_hold', requested_at: null, approved_at: null, declined_reason: null },
      ];
      s.authority[0] = { capability_id: s.authority[0].capability_id, effective_autonomy: 'autonomy:R2', reasons: ['no_tool_grants'] };
      s.authority_rule.approved_above_r2 = 1;
      s.authority_rule.binds_nothing = false;
    })],
    J: [8790, () => {}, '/.colaberry/agent-domain.json'],
    // Per-capability gaps in the five autonomy fields, on an edited COPY.
    K: [8791, (d) => rw(path.join(d, '.colaberry/agent-domain.json'), (s) => {
      const [, c1, c2, c3, c4] = s.authority;
      delete c1.max_permitted_autonomy; delete c1.max_permitted_autonomy_note; delete c1.ceiling_reason;
      c2.approved_autonomy = null; c2.approved_autonomy_note = 'starting_autonomy is "R2b", which is not one of the ten rungs';
      c3.ceiling_reason = '';
      c4.max_permitted_autonomy = null; c4.max_permitted_autonomy_note = null;
    })],
    // A snapshot from before AF12.3: none of the five fields, anywhere.
    L: [8792, (d) => rw(path.join(d, '.colaberry/agent-domain.json'), (s) => {
      for (const c of s.authority) for (const f of ['approved_autonomy', 'approved_autonomy_note', 'max_permitted_autonomy', 'max_permitted_autonomy_note', 'ceiling_reason']) delete c[f];
    })],
  };
  serve(REPO, 8765);
  for (const [k, [port, mut, hold]] of Object.entries(variants)) { copySite(path.join(V, k), mut); serve(path.join(V, k), port, hold); }
  await new Promise((r) => setTimeout(r, 1200));

  for (const mode of ['real', 'sample']) {
    const base = `http://127.0.0.1:8765/?mode=${mode}`;
    for (const tab of TABS) {
      const html = dom(`${base}#/${tab}`);
      const t = text(html);
      check(/Data as of/.test(t), `${mode} #/${tab}: Data-as-of stamp`);
      check(/Real Sample/.test(t), `${mode} #/${tab}: mode switch`);
      check(!/Not built yet/.test(t), `${mode} #/${tab}: built (no "Not built yet")`);
      check(!/Build paused/.test(t), `${mode} #/${tab}: pause banner removed`);
      check(!/\[object /.test(t) && !/undefined|NaN/.test(t), `${mode} #/${tab}: no [object]/undefined/NaN`);
      check(mode === 'sample' ? /SAMPLE DATA/.test(t) : !/SAMPLE/.test(t), `${mode} #/${tab}: sample labelling correct`);
      const hrefs = cardHrefs(html);
      check(hrefs.length > 0, `${mode} #/${tab}: has at least one card`);
      for (const href of hrefs) {
        const d = text(dom(`${base}${href}`));
        check(/← Back to/.test(d), `${mode} ${href}: drill-down opens`);
        check(!/not in your plan data|No such|That (story|agent|item) is not/.test(d), `${mode} ${href}: drill-down has real content`);
        check(!/\[object /.test(d) && !/undefined|NaN/.test(d), `${mode} ${href}: no [object]/undefined/NaN`);
        if (mode === 'sample') check(/SAMPLE DATA/.test(d), `sample ${href}: labelled sample`);
      }
    }
  }
  // A real story detail opened from the task table (not a card).
  const sd = text(dom(`http://127.0.0.1:8765/?mode=real#/project/${encodeURIComponent('story:' + firstStory)}`));
  check(sd.includes(firstStory) && /Acceptance criteria/.test(sd) && /Platform status/.test(sd), 'real story detail opens from task table');

  // The six STORY-000 panels on the real snapshot.
  const ov = dom('http://127.0.0.1:8765/?mode=real#/overview');
  const snap = JSON.parse(fs.readFileSync(path.join(REPO, '.colaberry/agent-domain.json'), 'utf8'));
  check(panelStates(ov).length === 6, 'real: six panels render');
  for (let n = 1; n <= 6; n++) check(/Endpoint read: GET \/api\/admin\//.test(panelText(ov, n)), `real: panel ${n} names the endpoint it read`);
  for (const ep of Object.values(snap.sources)) check(text(ov).includes(ep), `real: snapshot source ${ep} named on the page`);
  const p1 = panelText(ov, 1);
  check(p1.includes(snap.agent.agent_id) && /Enabled No: this agent is disabled/.test(p1) && /Tools granted 0\./.test(p1), 'real panel 1: agent record from the snapshot');
  check(/not a rung on the autonomy:R0 to R9 ladder/.test(p1) && /Set by Not recorded/.test(p1), 'real panel 1: agent scale labelled, set-by not invented');
  const p2 = panelText(ov, 2);
  const humanCount = snap.authority.filter((c) => c.reasons.includes('human_decision_required_at_every_level')).length;
  check(p2.includes(`${snap.authority.length} capabilities in the snapshot. ${humanCount} of them`), 'real panel 2: counts match the snapshot');
  check((ov.match(/<code>marketing\.[^<]+<\/code>/g) || []).length >= snap.authority.length, 'real panel 2: one row per capability');
  const p3 = panelText(ov, 3);
  check(OWNER_RUNGS.every((w) => p3.includes(w)), 'real panel 3: all ten rungs in the owner’s wording');
  check(/autonomy:R8 Coordinate[^.]*\. \d+ Unreachable by fact/.test(p3), 'real panel 3: R8 marked unreachable by fact');
  check(/In force, and currently constrains 0 capabilities/.test(p3) && /no_tool_grants/.test(p3), 'real panel 3: no_tool_grants named with its count, zero said in words');
  // Panel 3's ceilings, checked against the snapshot itself.
  const caps = snap.authority;
  check((ov.match(/<tr data-capability="marketing\./g) || []).length === caps.length, 'real panel 3: one ceiling row per capability');
  const idOf = (pred) => (caps.find(pred) || {}).capability_id;
  const examples = [
    idOf((c) => c.reasons.includes('human_decision_required_at_every_level')),
    idOf((c) => c.reasons.length === 0 && c.max_permitted_autonomy === 'autonomy:R9'),
    idOf((c) => c.max_permitted_autonomy === 'autonomy:R4'),
  ];
  for (const id of examples) {
    const c = caps.find((x) => x.capability_id === id);
    const row = capRow(ov, id);
    check(row && row.cells[1] === c.approved_autonomy && row.cells[2] === c.max_permitted_autonomy && row.cells[3] === c.effective_autonomy && row.cells[5] === c.ceiling_reason,
      `real panel 3: ${id} shows approved, ceiling, effective and ceiling reason from the snapshot`);
    check(row && row.cells[6] === (c.reasons.length ? c.reasons.join(', ') : 'none recorded') && row.cells[5] !== row.cells[6],
      `real panel 3: ${id} keeps reasons and ceiling reason in separate columns`);
  }
  check(caps.every((c) => { const r = capRow(ov, c.capability_id); return r && /is-fact/.test(r.rungs.R8) && !/is-open/.test(r.rungs.R8); }), 'real panel 3: R8 is unreachable by fact in every capability’s strip');
  const r9 = caps.filter((c) => c.max_permitted_autonomy === 'autonomy:R9');
  check(r9.length > 0 && r9.every((c) => { const r = capRow(ov, c.capability_id); return /cannot rise above autonomy:R7 today/.test(r.cells[4]) && /is-fact/.test(r.rungs.R8) && /is-ceiling/.test(r.rungs.R9); }), 'real panel 3: an R9 ceiling does not make R8 reachable');
  check((text(ov).match(/cannot rise above autonomy:R7 today/g) || []).length === caps.filter((c) => /R[89]$/.test(c.max_permitted_autonomy)).length, 'real panel 3: only R8/R9 ceilings carry the R7 limit');
  const r4 = capRow(ov, examples[2]);
  check(/Stops at autonomy:R4: autonomy:R5 to R9 are above its ceiling/.test(r4.cells[4]) && /is-above/.test(r4.rungs.R5) && /is-open/.test(r4.rungs.R3) && /is-effective/.test(r4.rungs.R0), 'real panel 3: rungs above a ceiling are marked unreachable for that capability');
  const r9count = r9.length;
  check(new RegExp(`autonomy:R9 Demonstrate[^.]*\\. \\d+ ${r9count} \\(autonomy:R8 below it is still unreachable by fact\\)`).test(p3), 'real panel 3: rung table counts R9 ceilings without implying R8 is reachable');
  check(!/Not a rung|null/.test(p3), 'real panel 3: null notes beside valid rungs are not shown as gaps');
  check(/Each of the \d+ capabilities has its ceiling marked against the ladder/.test(p3) && !/Ceilings \(max_permitted_autonomy\) are not in the public snapshot/.test(p3), 'real panel 3: ceilings present, no claim that they are missing');
  check(/approved autonomy, ceiling and ceiling reason are on panel 3/.test(p2) && !/max_permitted_autonomy \(each ceiling\)/.test(panelText(ov, 6)), 'real panels 2 and 6: no longer claim ceilings are missing');
  check(panelStates(ov)[3] === 'missing' && /Not in the public snapshot: release_behaviour/.test(panelText(ov, 4)), 'real panel 4: per-rung behaviour labelled missing');
  const p5 = panelText(ov, 5);
  check(panelStates(ov)[4] === 'empty' && /A filed request grants nothing/.test(p5) && /Nothing returned: no change requests and no tool requests/.test(p5), 'real panel 5: empty queue said in words, with the disclosure');
  check(/agent\.autonomy_level_set_by/.test(panelText(ov, 6)) && /unreachable by fact/.test(panelText(ov, 6)), 'real panel 6: declared gaps listed');
  check(!/class="panel /.test(dom('http://127.0.0.1:8765/?mode=sample#/overview')), 'sample: the six panels are not drawn with made-up data');

  // Snapshot variants: each state is named in words and has its own data-state.
  const fO = dom('http://127.0.0.1:8786/?mode=real#/overview');
  check(panelStates(fO).join() === 'missing,missing,missing,missing,missing,missing' && /Not loaded: \.colaberry\/agent-domain\.json could not be loaded \(HTTP 404\)/.test(text(fO)), 'F: missing snapshot stated on every panel');
  check(!/constrains 0/.test(text(fO)) && /expected: the snapshot that names it did not load/.test(text(fO)), 'F: no figure from a missing snapshot; endpoint marked as expected');
  const gO = dom('http://127.0.0.1:8787/?mode=real#/overview');
  check(panelStates(gO).join() === 'invalid,invalid,invalid,invalid,invalid,invalid' && /is not valid JSON/.test(text(gO)), 'G: invalid snapshot stated on every panel');
  const hO = dom('http://127.0.0.1:8788/?mode=real#/overview');
  check(panelStates(hO).join() === 'empty,empty,empty,empty,empty,empty' && /Nothing returned: \.colaberry\/agent-domain\.json is empty/.test(text(hO)), 'H: empty snapshot stated on every panel');
  const iO = dom('http://127.0.0.1:8789/?mode=real#/overview');
  check(panelStates(iO)[0] === 'empty' && /No agent yet/.test(panelText(iO, 1)), 'I: no agent said in words, distinct state');
  check(/currently constrains 1 capability: each is held at autonomy:R2 because no tool is granted/.test(panelText(iO, 3)), 'I: a real no_tool_grants count is shown');
  const i5 = panelText(iO, 5);
  check(/Tool requests \(asked for, not granted\) Request Status Filed Decided COPY-TOOL-REQUEST read_marketing_database Submitted: nobody has decided yet\. Grants nothing\./.test(i5) && /0 granted/.test(i5), 'I: a submitted tool request shown as asked for, not granted');
  // The platform writes approved_at on a decline too (the decision time), so it shows as Decided.
  check(/Change requests Request Status Filed Decided COPY-CHANGE-REQUEST rename Declined: COPY-REASON November 2, 2026 at 9:00 AM CST November 2, 2026 at 10:30 AM CST/.test(i5), 'I: a declined change request listed under change requests, with its decision time');
  check(/Requests of an unknown type Their kind is not one the platform defines \(change or tool\): "tool_grant"\.[^]*COPY-ODD-REQUEST Unknown status "on_hold"/.test(i5), 'I: an unknown kind and status shown as unknown, not guessed');
  check(!/Tool requests[^]*COPY-ODD-REQUEST[^]*Change requests/.test(i5), 'I: a kind merely containing "tool" is not counted as a tool request');
  check(/COPY-APPROVED-TOOL screenshot_capture Approved by a named human/.test(i5) && /0 granted/.test(i5), 'I: an approved tool request is shown as approved, and the grant count still comes from the agent record');
  check(/Pending \(status submitted\): 1 · Approved: 1 · Declined: 1 · Unknown status: 1/.test(i5), 'I: summary counts submitted as pending, approved and declined separately, unknown status apart');
  const p5real = panelText(ov, 5);
  check(/none is awaiting a decision/.test(p5real), 'real panel 5: empty governance state preserved');
  check(/Pending \(status submitted\): 0 · Approved: 0 · Declined: 0/.test(p5real) && !/Unknown status/.test(p5real), 'real panel 5: empty request list counts 0 / 0 / 0 and no unknown');
  // K: per-capability gaps are explained, never blank.
  const kO = dom('http://127.0.0.1:8791/?mode=real#/overview');
  const [, k1, k2, k3, k4] = snap.authority.map((c) => capRow(kO, c.capability_id));
  check(k1 && k1.cells[2] === 'No ceiling in the snapshot for this capability' && k1.cells[5] === 'No ceiling rationale in the snapshot for this capability.' && /No ceiling recorded, so this capability cannot be marked/.test(k1.cells[4]) && /is-unknown/.test(k1.rungs.R5) && /is-fact/.test(k1.rungs.R8), 'K: a missing ceiling and rationale are explained, R8 still unreachable by fact');
  check(k2 && k2.cells[1] === 'Not a rung: starting_autonomy is "R2b", which is not one of the ten rungs', 'K: a non-rung approved value shows the platform’s note');
  check(k3 && k3.cells[5] === 'No ceiling rationale recorded (empty).', 'K: an empty ceiling rationale is stated, not blank');
  check(k4 && k4.cells[2] === 'No ceiling recorded (null, with no note)', 'K: a null ceiling with no note is stated, not blank');
  check(/2 capabilities have no valid ceiling recorded/.test(panelText(kO, 3)), 'K: panel 3 counts the capabilities with no valid ceiling (the deleted and the null one)');

  // L: a snapshot without the five fields keeps the earlier, honest wording.
  const lO = dom('http://127.0.0.1:8792/?mode=real#/overview');
  const l3 = panelText(lO, 3);
  check(/Ceilings \(max_permitted_autonomy\) are not in the public snapshot/.test(l3) && /Not in the public snapshot/.test(l3) && !/data-capability=/.test(lO), 'L: no ceilings in the snapshot is said in words, with no ceiling table');
  check(/max_permitted_autonomy \(each ceiling\)/.test(panelText(lO, 6)), 'L: panel 6 lists ceilings as missing when they are');

  // Read once the plan cards are drawn: the other files have arrived, the held snapshot never does.
  const jO = await domWhen('http://127.0.0.1:8790/?mode=real#/overview', "document.body.innerText.includes('How far along')");
  check(panelStates(jO).join() === 'loading,loading,loading,loading,loading,loading' && /Loading: waiting for \.colaberry\/agent-domain\.json/.test(text(jO)), 'J: a held snapshot shows every panel as loading');
  check(/is still loading/.test(text(jO)) && !/did not load/.test(text(jO)), 'J: a loading snapshot is not described as failed');
  check(/How far along/.test(text(jO)) && !/Nothing returned|Not loaded/.test(text(jO)), 'J: loading is distinct from empty and missing, and other files still render');

  // Default mode: the plain address opens Real.
  check(!/SAMPLE/.test(text(dom('http://127.0.0.1:8765/#/overview'))), 'plain address opens in Real mode');

  // A: edited plan copy, read at runtime on several tabs.
  const aO = text(dom('http://127.0.0.1:8781/?mode=real#/overview'));
  check(aO.includes('RENAMED-IN-COPY') && !aO.includes('Legacy migration plan'), 'A: rename shown and removed release gone (Overview)');
  const aP = text(dom('http://127.0.0.1:8781/?mode=real#/project'));
  // "Legacy migration plan" is also the title of a story that stays in copy A, so look for the
  // release card's own text ("r1: …") rather than the bare name.
  check(!aP.includes(firstStory) && !aP.includes('r1: Legacy migration plan'), 'A: removed story and release gone (Project management)');
  const aK = text(dom(`http://127.0.0.1:8781/?mode=real#/knowledge/stories`));
  check(!aK.includes(firstStory), 'A: removed story gone (Knowledge base)');

  // B: stale manifest warns on every tab. C: missing manifest stated on every tab.
  for (const tab of TABS) {
    check(/Over a week old: sync from the portal to refresh/.test(text(dom(`http://127.0.0.1:8782/?mode=real#/${tab}`))), `B stale warning on #/${tab}`);
    check(/Data as of: unknown/.test(text(dom(`http://127.0.0.1:8783/?mode=real#/${tab}`))), `C missing manifest stated on #/${tab}`);
  }
  // D and E: a missing plan or progress file is named, and no figures are shown from it.
  const dO = text(dom('http://127.0.0.1:8784/?mode=real#/overview'));
  check(/plan\.json could not be loaded/.test(dO) && /project name unavailable/.test(dO), 'D: missing plan.json named, no project name invented');
  const eO = text(dom('http://127.0.0.1:8785/?mode=real#/overview'));
  check(/progress\.json could not be loaded/.test(eO) && /No totals in the progress file/.test(eO) && !/stories verified/.test(eO), 'E: missing progress.json named, no totals shown');

  servers.forEach((s) => s.kill());
  console.log(`rendered-page checks: ${pass} passed, ${fail} failed`);
  if (failures.length) console.log('FAILED:\n  ' + failures.join('\n  '));
  fs.rmSync(TMP, { recursive: true, force: true });
  process.exitCode = fail ? 1 : 0;
}
main();
