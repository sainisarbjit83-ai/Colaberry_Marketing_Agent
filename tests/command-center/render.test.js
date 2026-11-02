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
  const r = spawnSync(EDGE, ['--headless=new', '--disable-gpu', `--user-data-dir=${TMP}/edge-profile`, '--virtual-time-budget=4000', '--dump-dom', url], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return r.stdout || '';
}
const text = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
function check(cond, label) { if (cond) pass++; else { fail++; failures.push(label); } }
const cardHrefs = (html) => [...html.matchAll(/<a class="card" href="([^"]+)"/g)].map((m) => m[1]);

function copySite(dest, mutate) {
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(path.join(dest, '.colaberry'), { recursive: true });
  fs.cpSync(path.join(REPO, 'assets'), path.join(dest, 'assets'), { recursive: true });
  fs.copyFileSync(path.join(REPO, 'index.html'), path.join(dest, 'index.html'));
  for (const f of ['plan.json', 'progress.json', 'manifest.json']) fs.copyFileSync(path.join(REPO, '.colaberry', f), path.join(dest, '.colaberry', f));
  mutate(dest);
}
const rw = (file, fn) => { const j = JSON.parse(fs.readFileSync(file, 'utf8')); fn(j); fs.writeFileSync(file, JSON.stringify(j)); };

const servers = [];
function serve(dir, port) { servers.push(spawn('node', [path.join(HERE, 'serve.js'), dir, String(port)], { stdio: 'ignore' })); }

async function main() {
  const V = path.join(TMP, 'variants');
  const firstStory = JSON.parse(fs.readFileSync(path.join(REPO, '.colaberry/plan.json'), 'utf8')).stories[0].id;
  const variants = {
    A: [8781, (d) => rw(path.join(d, '.colaberry/plan.json'), (p) => { p.project.name = 'RENAMED-IN-COPY'; p.releases = p.releases.filter((r) => r.key !== 'r1'); p.stories = p.stories.filter((s) => s.id !== firstStory); })],
    B: [8782, (d) => rw(path.join(d, '.colaberry/manifest.json'), (m) => { m.generated_at = new Date(Date.now() - 10 * 86400000).toISOString(); })],
    C: [8783, (d) => fs.rmSync(path.join(d, '.colaberry/manifest.json'))],
    D: [8784, (d) => fs.rmSync(path.join(d, '.colaberry/plan.json'))],
    E: [8785, (d) => fs.rmSync(path.join(d, '.colaberry/progress.json'))],
  };
  serve(REPO, 8765);
  for (const [k, [port, mut]] of Object.entries(variants)) { copySite(path.join(V, k), mut); serve(path.join(V, k), port); }
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
