/* Guardrails: what is allowed and blocked, and live demonstrations of refusals. */
(function () {
  'use strict';
  const { h, api } = window.SSD;
  const ui = window.SSD.ui;

  async function build() {
    const g = await api('GET', '/api/guardrails');
    const log = h('div', { id: 'guardrail-results' }, ui.empty('Results of the demonstrations appear here.'));
    const show = (node) => { if (log.firstChild && log.firstChild.classList.contains('state')) log.replaceChildren(); log.prepend(node); };
    const tryAction = async (action) => {
      try {
        const r = await api('POST', '/api/guardrails/check', { action });
        show(ui.notice(r.allowed ? 'ok' : 'bad', r.allowed ? `Allowed: ${action}` : `Blocked: ${action}`, h('p', { 'data-guardrail-result': r.allowed ? 'allowed' : 'blocked' }, r.message)));
      } catch (err) { show(ui.notice('bad', 'The check could not run', h('p', {}, err.message))); }
    };
    const tryNetwork = async () => {
      try {
        const r = await api('POST', '/api/guardrails/network-test');
        show(ui.notice('bad', `Blocked: all ${r.attempts.length} network calls were refused`,
          h('p', { 'data-guardrail-result': 'network-blocked' }, `The server called ${r.attempts.map((a) => a.what).join(', ')}. Each was refused by the guardrail before any connection or lookup started.`),
          h('ul', { class: 'steps' }, r.attempts.map((a) => h('li', { 'data-probe': a.what }, `${a.what}: ${a.blocked ? 'refused' : 'NOT refused'}`))),
          h('p', { class: 'small' }, `Controlled test: the target was ${r.target}, so even a failed block could not reach anything outside this computer.`)));
      } catch (err) { show(ui.notice('bad', 'Network test not run', h('p', {}, err.message))); }
    };
    const tryPlatform = async () => {
      try {
        const t = await api('POST', '/api/runs', { question: 'Who is looking for AI training?', platforms: ['X'] });
        show(ui.notice('bad', `${t.runId}: research on "X" was rejected`, h('p', { 'data-guardrail-result': 'platform-rejected' }, ui.explain(t.error)), h('p', { class: 'small' }, 'The rejected request is still recorded as a run, with its reason, in the execution log.')));
      } catch (err) { show(ui.notice('bad', 'The request could not be sent', h('p', {}, err.message))); }
    };
    return [
      ui.pageHead('Guardrails', 'What the agent may and may not do, enforced in code on every tool call and run.'),
      ui.notice('warn', g.label, h('p', {}, `The network block patches Node's own network functions inside the server process. It is ${g.networkBlocked ? 'active now' : 'NOT active'}. Code that bypassed Node's modules could get around it, which is why it is not a production security boundary.`)),
      h('div', { class: 'grid-2' },
        ui.card('Allowed local actions', `${g.allowed.length}`, h('div', { class: 'pill-list' }, g.allowed.map((a) => h('button', { class: 'chip', onclick: () => tryAction(a) }, a))), h('p', { class: 'small' }, 'Click one to check it against the allow-list.')),
        ui.card('Blocked actions', `${g.blocked.length}`, ui.table(['Action', 'Why it is blocked', ''], g.blocked.map((b) => h('tr', { 'data-blocked-action': b.action }, h('td', { class: 'mono' }, b.action), h('td', {}, b.reason), h('td', {}, h('button', { class: 'secondary', onclick: () => tryAction(b.action) }, 'Try it'))))))),
      ui.card('More demonstrations', null, h('div', { class: 'actions' },
        h('button', { class: 'secondary', id: 'network-test', onclick: tryNetwork }, 'Prove outbound network calls are blocked'),
        h('button', { class: 'secondary', id: 'platform-test', onclick: tryPlatform }, 'Try research on an excluded platform (X)')),
        h('p', { class: 'small' }, `Approved platforms (configuration only): ${g.scope.approved_platforms.join(', ')}. Excluded: ${g.scope.excluded_platforms.join(', ')}.`)),
      ui.card('Results', 'newest first; each attempt is also written to the execution log', log),
    ];
  }

  window.SSD.views.guardrails = { title: 'Guardrails', render: (el) => ui.mount(el, 'Loading guardrails…', build) };
})();
