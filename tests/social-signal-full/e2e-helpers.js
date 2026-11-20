// End-to-end helpers: start the real demo server as a child process (documented command, with a
// temp database and a free port), and drive headless Edge through the DevTools protocol using
// Node's built-in WebSocket. No new dependencies. Everything stays on 127.0.0.1.
'use strict';

const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const REPO = path.resolve(__dirname, '..', '..');
const SERVER = path.join(REPO, 'demos', 'social-signal-discovery-full', 'server', 'server.js');
const EDGE = process.env.EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Start the server on a free port with its own temp SQLite file. Resolves when it is listening. */
function startServer({ dbFile } = {}) {
  const dir = dbFile ? null : fs.mkdtempSync(path.join(os.tmpdir(), 'ssd-e2e-'));
  const file = dbFile || path.join(dir, 'e2e.sqlite');
  const proc = spawn(process.execPath, ['--disable-warning=ExperimentalWarning', SERVER, '--port', '0', '--db', file], { stdio: ['ignore', 'pipe', 'pipe'] });
  let out = '';
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { proc.kill(); reject(new Error(`Server did not start:\n${out}`)); }, 15000);
    const onData = (d) => {
      out += d;
      const m = out.match(/listening on http:\/\/127\.0\.0\.1:(\d+)/);
      if (m) {
        clearTimeout(timer);
        const base = `http://127.0.0.1:${m[1]}`;
        const stop = () => new Promise((r) => { if (proc.exitCode !== null) return r(); proc.once('exit', r); proc.kill(); });
        resolve({ base, proc, file, dir, stop, output: () => out });
      }
    };
    proc.stdout.on('data', onData);
    proc.stderr.on('data', (d) => { out += d; });
    proc.on('exit', (code) => { if (!/listening/.test(out)) { clearTimeout(timer); reject(new Error(`Server exited (${code}):\n${out}`)); } });
  });
}

/** JSON request helper against the local server. */
async function call(base, method, p, body, headers = {}) {
  const res = await fetch(base + p, {
    method, headers: body === undefined ? headers : { 'Content-Type': 'application/json', ...headers },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
    signal: AbortSignal.timeout(20000),
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch (e) { json = null; }
  return { status: res.status, json, text, headers: res.headers };
}

const edgeAvailable = () => fs.existsSync(EDGE);

/** Launch headless Edge with background networking disabled and connect to its first page. */
async function launchBrowser() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'ssd-edge-'));
  const proc = spawn(EDGE, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-background-networking',
    '--disable-component-update', '--disable-sync', '--disable-extensions', '--disable-features=Translate,OptimizationHints,msEdgeSidebarV2',
    '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--window-size=1440,1000', 'about:blank'], { stdio: 'ignore' });
  const portFile = path.join(profile, 'DevToolsActivePort');
  let port = null;
  for (let i = 0; i < 100 && !port; i++) { await sleep(150); if (fs.existsSync(portFile)) port = Number(fs.readFileSync(portFile, 'utf8').split('\n')[0]) || null; }
  if (!port) throw new Error('Edge did not open a DevTools port.');
  let target = null;
  for (let i = 0; i < 50 && !target; i++) {
    const list = await (await fetch(`http://127.0.0.1:${port}/json/list`, { signal: AbortSignal.timeout(5000) })).json();
    target = list.find((t) => t.type === 'page');
    if (!target) await sleep(100);
  }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error('DevTools socket failed.')); });
  let id = 0;
  const pending = new Map();
  const events = [];
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) { const { res, rej } = pending.get(msg.id); pending.delete(msg.id); msg.error ? rej(new Error(msg.error.message)) : res(msg.result); } else if (msg.method) events.push(msg);
  };
  const send = (method, params = {}) => new Promise((res, rej) => { const n = ++id; pending.set(n, { res, rej }); ws.send(JSON.stringify({ id: n, method, params })); });
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable'); await send('Log.enable');

  async function evaluate(expression) {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(`Page script failed: ${r.exceptionDetails.exception ? r.exceptionDetails.exception.description : r.exceptionDetails.text}`);
    return r.result.value;
  }
  async function waitFor(expression, label, timeout = 15000) {
    const end = Date.now() + timeout;
    let last;
    while (Date.now() < end) {
      try { last = await evaluate(expression); if (last) return last; } catch (e) { last = e.message; }
      await sleep(100);
    }
    throw new Error(`Timed out waiting for ${label} (last value: ${JSON.stringify(last)})`);
  }
  async function navigate(url) { await send('Page.navigate', { url }); }
  async function close() {
    try { ws.close(); } catch (e) { /* socket already closed */ }
    spawnSync('taskkill', ['/PID', String(proc.pid), '/T', '/F'], { stdio: 'ignore' });
    await sleep(300);
    fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
  return { send, evaluate, waitFor, navigate, close, events };
}

module.exports = { REPO, SERVER, startServer, call, launchBrowser, edgeAvailable, sleep };
