#!/usr/bin/env node
/*
 * The local demo server: static UI files plus the JSON API, on 127.0.0.1 only.
 *
 *   node demos/social-signal-discovery-full/server/server.js                 http://127.0.0.1:4310
 *   node demos/social-signal-discovery-full/server/server.js --port 5000
 *   node demos/social-signal-discovery-full/server/server.js --memory        throwaway in-memory database
 *   node demos/social-signal-discovery-full/server/server.js --db <file.sqlite>
 *
 * Default database: tmp/ssd-full/demo.sqlite (gitignored). Once listening, the server installs the
 * demonstration network block for the whole process, so nothing in it can make an outbound request.
 * Requests whose Host header is not localhost are refused (protects against DNS rebinding).
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { open } = require('./db');
const { createAgent } = require('./agent');
const { createApi } = require('./api');
const guardrails = require('./components/guardrails');

const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const MAX_BODY = 32 * 1024;
const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Cache-Control': 'no-store',
};

function parseArgs(argv) {
  const get = (flag) => { const i = argv.indexOf(flag); return i === -1 ? undefined : argv[i + 1]; };
  const port = Number(get('--port') ?? process.env.SSD_PORT ?? 4310);
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error(`Invalid port "${get('--port')}".`);
  return { port, db: argv.includes('--memory') ? ':memory:' : get('--db') };
}

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { ...SECURITY_HEADERS, 'Content-Type': type });
  res.end(type.startsWith('application/json') ? JSON.stringify(body) : body);
}

const HARD_LIMIT = 1024 * 1024; // beyond this the connection is cut instead of drained

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > HARD_LIMIT) { req.destroy(); return; }
      if (size <= MAX_BODY) chunks.push(c); // over the limit: keep draining so a 413 can be sent
    });
    req.on('end', () => {
      if (size > MAX_BODY) return reject(Object.assign(new Error(`The request body is larger than ${MAX_BODY / 1024} KB.`), { status: 413 }));
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve(undefined);
      try { resolve(JSON.parse(raw)); } catch { reject(Object.assign(new Error('The request body is not valid JSON.'), { status: 400 })); }
    });
    req.on('error', reject);
  });
}

function serveStatic(pathname, res) {
  const rel = pathname === '/' ? 'index.html' : decodeURIComponent(pathname.slice(1));
  const file = path.resolve(PUBLIC_DIR, rel);
  if (!file.startsWith(PUBLIC_DIR + path.sep) || !TYPES[path.extname(file)] || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
  }
  return send(res, 200, fs.readFileSync(file), TYPES[path.extname(file)]);
}

function createServer({ agent, db, log = () => {} }) {
  const api = createApi({ agent, db });
  const server = http.createServer(async (req, res) => {
    const started = Date.now();
    try {
      const host = String(req.headers.host || '').replace(/:\d+$/, '');
      if (!['127.0.0.1', 'localhost'].includes(host)) return send(res, 403, { error: { class: 'RequestError', message: 'This demo only answers requests addressed to localhost.' } });
      const { pathname } = new URL(req.url, 'http://127.0.0.1');
      if (!pathname.startsWith('/api/')) {
        if (req.method !== 'GET') return send(res, 405, 'Method not allowed', 'text/plain; charset=utf-8');
        return serveStatic(pathname, res);
      }
      if (req.method === 'POST' && !String(req.headers['content-type'] || '').startsWith('application/json')) {
        return send(res, 415, { error: { class: 'RequestError', message: 'Send JSON with Content-Type: application/json.' } });
      }
      let apiPath;
      try { apiPath = decodeURIComponent(pathname); } catch { return send(res, 400, { error: { class: 'RequestError', message: 'The request path is not validly encoded.' } }); }
      const body = req.method === 'POST' ? await readBody(req) : undefined;
      const out = api.handle(req.method, apiPath, body);
      send(res, out.status, out.body);
      log(`${req.method} ${pathname} ${out.status} ${Date.now() - started}ms`);
    } catch (err) {
      const status = err.status || 500;
      send(res, status, { error: { class: 'RequestError', message: status === 500 ? 'Unexpected server error.' : err.message } });
      log(`${req.method} ${req.url} ${status} ${err.message}`);
    }
  });
  server.requestTimeout = 30000;
  server.headersTimeout = 10000;
  return server;
}

function start(argv = process.argv.slice(2)) {
  const opts = parseArgs(argv);
  const { db, file } = open(opts.db);
  const agent = createAgent({ db });
  const server = createServer({ agent, db, log: (line) => console.log(line) });
  server.listen(opts.port, '127.0.0.1', () => {
    guardrails.installNetworkBlock((e) => agent.log({ component: 'guardrails', event: 'network_blocked', outcome: 'blocked', detail: e }));
    console.log(`Social Signal Discovery demo listening on http://127.0.0.1:${server.address().port}`);
    console.log(`Database: ${file}. Fictional data only. Outbound network blocked. Press Ctrl+C to stop.`);
  });
  const stop = () => server.close(() => { db.close(); process.exit(0); });
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
  return server;
}

if (require.main === module) start();

module.exports = { createServer, start, parseArgs };
