// Rendered-page tests for the Social Signal Discovery demo, in headless Edge (--dump-dom).
// Serves the repository on 127.0.0.1 only, with the Command Center's local server.
const { spawnSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const EDGE = process.env.EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const REPO = process.env.CC_REPO || path.resolve(__dirname, '..', '..');
const TMP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'ssd-render-'));
const PORT = 8800;
// The explicit index.html: the shared serve.js maps only the site root "/" to index.html.
const BASE = `http://127.0.0.1:${PORT}/demos/social-signal-discovery/index.html`;
let pass = 0, fail = 0;
const failures = [];

const dom = (url) => spawnSync(EDGE, ['--headless=new', '--disable-gpu', `--user-data-dir=${TMP}/edge-profile`, '--virtual-time-budget=4000', '--dump-dom', url], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 60000 }).stdout || '';
const text = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ');
function check(cond, label) { if (cond) pass++; else { fail++; failures.push(label); } }

async function main() {
  const server = spawn('node', [path.join(REPO, 'tests/command-center/serve.js'), REPO, String(PORT)], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 1000));
  try {
    // The page loads only local files.
    const html = fs.readFileSync(path.join(REPO, 'demos/social-signal-discovery/index.html'), 'utf8');
    check(!/(src|href)="https?:/i.test(html), 'index.html loads no remote scripts or styles');

    // A search with results.
    const a = dom(`${BASE}?q=${encodeURIComponent('AI training')}`);
    const at = text(a);
    check(/SAMPLE DATA ONLY/.test(at), 'results page: sample-data banner shown');
    const cards = [...a.matchAll(/data-record-id="(SAMPLE-\d{3})"/g)].map((m) => m[1]);
    check(cards.length > 0, 'results page: result cards rendered');
    check(new Set(cards).size === cards.length && !cards.includes('SAMPLE-009'), 'results page: no duplicate records shown');
    check(cards[0] === 'SAMPLE-001' && cards[1] === 'SAMPLE-005', 'results page: deterministic order (SAMPLE-001, then SAMPLE-005)');
    check((at.match(/Relevance: matched \d of 2 search term\(s\)/g) || []).length === cards.length, 'results page: every card explains its relevance');
    check(/Relevance: matched 2 of 2 search term\(s\) \(ai, training\); the full search phrase matches its topic/.test(at), 'results page: full-topic match explained');
    check((at.match(/Preliminary classification:/g) || []).length === cards.length, 'results page: every card has a preliminary classification');
    check((at.match(/Sample record: fictional, written for this demo/g) || []).length === cards.length, 'results page: every card labeled as a fictional sample');
    check(/not verified leads or buyers/.test(at), 'results page: states classifications are not verified leads or buyers');
    check(/Potential enterprise AI buying signal/.test(at), 'results page: buying-signal classification shown with its reason');
    check(/2 duplicate record\(s\) removed/.test(at), 'results page: duplicates counted');
    check(/Record ID SAMPLE-002 appears more than once in the sample data\. The repeated entry was removed and the first one kept\./.test(at), 'duplicates: a repeated id is explained as a repeated id');
    check(!/SAMPLE-002 duplicates SAMPLE-002/.test(at), 'duplicates: no misleading "SAMPLE-002 duplicates SAMPLE-002" line');
    check(/SAMPLE-009 has the same URL as SAMPLE-001 once normalized/.test(at) && /data-duplicate-kind="same_url"/.test(a), 'duplicates: the normalized-URL duplicate is still detected and explained');
    check(/Run trace/.test(at) && /Guardrail checks: All passed/.test(at), 'results page: run trace with guardrail result');

    // Improvement 3: the 13 components, each exactly once, with the manager's names and one of the five statuses.
    const NAMES = ['User Interface (UI)', 'System Prompt', 'Context Manager', 'LLM (Brain)', 'Agent Loop (Orchestrator)', 'Tools', 'Knowledge Base / RAG', 'Memory', 'Planning / Task Decomposition', 'Guardrails', 'Human-in-the-Loop (HITL)', 'Logging & Observability', 'Evaluation'];
    const STATUSES = ['Implemented in the demo', 'Partly implemented', 'Simulated', 'Implemented outside the page', 'Proposed / not implemented'];
    const rows = [...a.matchAll(/<tr data-component="([^"]+)">([\s\S]*?)<\/tr>/g)].map((m) => ({ name: m[1].replace(/&amp;/g, '&'), status: (m[2].match(/data-status="([^"]+)"/) || [])[1] }));
    check(rows.length === 13 && NAMES.every((n, i) => rows[i] && rows[i].name === n), 'components: all 13 manager names, in order, each once');
    check(new Set(rows.map((r) => r.name)).size === 13, 'components: no component listed twice');
    check(rows.every((r) => STATUSES.includes(r.status)), 'components: every status is one of the five allowed labels');
    const st = Object.fromEntries(rows.map((r) => [r.name, r.status]));
    check(st['LLM (Brain)'] === 'Simulated' && st['Knowledge Base / RAG'] === 'Simulated' && st['Logging & Observability'] === 'Simulated', 'components: simulated components are not called implemented');
    check(['System Prompt', 'Tools', 'Memory', 'Human-in-the-Loop (HITL)'].every((n) => st[n] === 'Proposed / not implemented'), 'components: proposed components are marked not implemented');
    check(st['Evaluation'] === 'Implemented outside the page' && st['Planning / Task Decomposition'] === 'Partly implemented', 'components: evaluation outside the page, planning partly implemented');
    check(!/undefined|NaN|\[object /.test(at), 'results page: no undefined, NaN or [object]');

    // No match.
    const n = text(dom(`${BASE}?q=${encodeURIComponent('quantum knitting')}`));
    check(/No sample records match "quantum knitting"/.test(n), 'no-match page: says so in words');

    // Rejected input.
    const r = text(dom(`${BASE}?q=${encodeURIComponent('the and of')}`));
    check(/no searchable words/.test(r), 'rejected input: clear error shown');

    // Plain page: search box, no results yet.
    const p = dom(BASE);
    check(/id="ssd-query"/.test(p) && !/data-record-id=/.test(p), 'plain page: search box shown, no results until a search');
  } finally {
    server.kill();
    fs.rmSync(TMP, { recursive: true, force: true });
  }
  console.log(`social-signal demo rendered checks: ${pass} passed, ${fail} failed`);
  if (failures.length) console.log('FAILED:\n  ' + failures.join('\n  '));
  process.exitCode = fail ? 1 : 0;
}
main();
