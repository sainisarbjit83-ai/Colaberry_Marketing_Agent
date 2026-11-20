/*
 * Shared front-end helpers: DOM building, the local API client, plain-language wording for
 * statuses and errors, Central-time formatting, and the loading / empty / error states.
 * Talks only to the same origin (the local server); the page's CSP blocks anything else.
 */
(function () {
  'use strict';
  const SSD = (window.SSD = window.SSD || {});
  SSD.views = SSD.views || {};
  SSD.state = { overview: null, kb: null, lastTrace: null };

  /** h('div', { class: 'x', onclick: fn, 'data-id': 1 }, 'text', child, [more]) */
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === null || v === undefined || v === false) continue;
      if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else if (k === 'class') el.className = v;
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, String(v));
    }
    const add = (c) => {
      if (c === null || c === undefined || c === false) return;
      if (Array.isArray(c)) c.forEach(add);
      else el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
    };
    children.forEach(add);
    return el;
  }

  const TIMEOUT_MS = 30000;
  /** Call the local API. Throws an Error with a readable message on any failure. */
  async function api(method, path, body) {
    // The server accepts only JSON on POST, so a POST without a payload still sends "{}".
    if (method === 'POST' && body === undefined) body = {};
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(path, {
        method, signal: ctrl.signal,
        headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      let data = null;
      try { data = await res.json(); } catch (parseErr) { data = null; }
      if (!res.ok) {
        const e = new Error((data && data.error && data.error.message) || `The server answered ${res.status}.`);
        Object.assign(e, { status: res.status, cls: data && data.error && data.error.class, rule: data && data.error && data.error.rule });
        throw e;
      }
      return data;
    } catch (err) {
      if (err.name === 'AbortError') throw new Error('The local server did not answer within 30 seconds.');
      if (err instanceof TypeError) throw new Error('Cannot reach the local demo server. Check that it is still running.');
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  function central(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true, timeZoneName: 'short' }).formatToParts(d).map((x) => [x.type, x.value]));
    return `${p.hour}:${p.minute}:${p.second} ${p.dayPeriod} ${p.timeZoneName} on ${p.year}-${p.month}-${p.day}`;
  }

  const RUN_STATUS = {
    completed: ['Completed', 'ok', 'Every planned subtask ran.'],
    completed_with_warnings: ['Completed with warnings', 'warn', 'A non-critical step (memory) failed; the research itself finished.'],
    failed: ['Failed', 'bad', 'A critical step failed, so the run stopped and the remaining steps were skipped.'],
    blocked: ['Blocked by a guardrail', 'bad', 'A guardrail refused an action, so the run stopped safely.'],
    rejected: ['Request rejected', 'bad', 'The request was refused before any planning or searching.'],
    running: ['Running', 'info', 'The run is in progress.'],
  };
  const TASK_STATUS = { planned: 'muted', running: 'info', completed: 'ok', failed: 'bad', skipped: 'muted' };
  const REVIEW_STATUS = { pending: ['Waiting for review', 'warn'], approved: ['Approved', 'ok'], rejected: ['Rejected', 'bad'], corrected: ['Corrected', 'info'] };
  const CODE_KIND = { buying: 'info', general: 'muted', none: 'muted' };
  const RULE_TEXT = {
    platform_scope: 'A platform outside the approved scope was requested.',
    blocked_action: 'The action is on the blocked list (publishing, messaging, outreach or production writes).',
    unknown_action: 'The action is not on the allow-list of local actions.',
    network_blocked: 'Something tried to reach the network; the demo is local-only.',
    unknown_tool: 'A tool that does not exist was requested.',
    invalid_evidence: 'A classification cited evidence that is not in the record.',
    missing_evidence: 'A classification gave no evidence.',
    no_keywords: 'The question had nothing searchable once common words were removed.',
  };

  /** One plain-language sentence for an error object { class, rule|code, message, task }. */
  function explain(error) {
    if (!error) return '';
    const why = RULE_TEXT[error.rule] || RULE_TEXT[error.code] || '';
    const where = error.task ? ` (step "${error.task}")` : '';
    const what = error.class === 'ProviderDisabledError' ? 'The real LLM provider is disabled, so classification could not run.' : why;
    return [what, `${error.message || ''}${where}`].filter(Boolean).join(' ');
  }

  const badge = (text, kind) => h('span', { class: `badge ${kind || ''}` }, text);
  const loading = (text) => h('div', { class: 'state loading', role: 'status' }, text || 'Loading…');
  const empty = (text) => h('div', { class: 'state' }, text);
  const notice = (kind, title, ...body) => h('div', { class: `notice ${kind || ''}`, role: kind === 'bad' ? 'alert' : null }, title ? h('div', { class: 'notice-title' }, title) : null, ...body);
  const errorBox = (err, retry) => notice('bad', 'Something went wrong', h('p', {}, err && err.message ? err.message : String(err)), retry ? h('button', { class: 'secondary', onclick: retry }, 'Try again') : null);
  const card = (title, sub, ...children) => h('section', { class: 'card' }, (title || sub) ? h('div', { class: 'card-head' }, title ? h('h2', {}, title) : null, sub ? h('span', { class: 'card-sub' }, sub) : null) : null, ...children);
  const pageHead = (title, text) => h('div', { class: 'page-head' }, h('h1', {}, title), text ? h('p', {}, text) : null);
  const table = (heads, rows, attrs) => h('table', attrs || {}, h('thead', {}, h('tr', {}, heads.map((x) => h('th', typeof x === 'object' && x.num ? { class: 'num' } : {}, typeof x === 'object' ? x.text : x)))), h('tbody', {}, rows));
  const runStatus = (s) => { const [t, k] = RUN_STATUS[s] || [s, 'muted']; return badge(t, k); };
  const reviewStatus = (s) => { const [t, k] = REVIEW_STATUS[s] || [s, 'muted']; return badge(t, k); };
  const pct = (r) => (!r || r.value === null || r.value === undefined ? 'undefined' : `${(r.value * 100).toFixed(1)}%`);
  const frac = (r) => (r && r.denominator !== undefined && r.denominator !== null ? `${r.numerator}/${r.denominator}` : '');

  /** Clear a container and render an async view into it, with loading and error states. */
  async function mount(container, loadingText, build) {
    container.replaceChildren(loading(loadingText));
    try {
      const node = await build();
      container.replaceChildren(...[].concat(node));
    } catch (err) {
      container.replaceChildren(errorBox(err, () => mount(container, loadingText, build)));
    }
  }

  const store = {
    get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage unavailable: the value is simply not remembered */ } },
  };

  SSD.h = h;
  SSD.api = api;
  SSD.ui = { badge, loading, empty, notice, errorBox, card, pageHead, table, runStatus, reviewStatus, pct, frac, mount, central, explain, store, RUN_STATUS, TASK_STATUS, CODE_KIND };
})();
