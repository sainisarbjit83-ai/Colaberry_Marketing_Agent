/* System prompt & provider: the stored, versioned instructions and what actually classifies. */
(function () {
  'use strict';
  const { h, api } = window.SSD;
  const ui = window.SSD.ui;

  async function build() {
    const o = window.SSD.state.overview = await api('GET', '/api/overview');
    const p = o.systemPrompt, prov = o.provider;
    return [
      ui.pageHead('System prompt & provider', 'The agent\'s instructions are stored separately from code, validated when the server starts, and recorded with every run.'),
      ui.notice('warn', 'The simulated provider does not interpret this prompt', h('p', { id: 'prompt-disclosure' }, p.disclosure)),
      h('div', { class: 'grid-3' },
        ui.card(`${p.id}`, `version ${p.version} · #${p.hash} · ${p.file}`,
          h('p', {}, ui.badge('DRAFT', 'warn'), ' ', h('span', { class: 'small' }, p.status)),
          h('h4', {}, 'Role'), h('p', {}, p.role),
          h('h4', {}, `Instructions (${p.instructions.length})`), h('ol', { class: 'steps', id: 'prompt-instructions' }, p.instructions.map((i) => h('li', {}, i))),
          h('h4', {}, 'Allowed labels'), h('ul', { class: 'steps' }, Object.entries(p.labels).map(([k, v]) => h('li', {}, `${k}: ${v}`)))),
        h('div', {},
          ui.card('Active provider', null,
            h('p', {}, h('strong', {}, prov.name), ' ', ui.badge(prov.isRealLlm ? 'real LLM' : 'simulated', prov.isRealLlm ? 'bad' : 'info')),
            h('p', { class: 'small' }, prov.note),
            h('p', { class: 'small' }, 'Same input, same output: classifications are deterministic and every one cites the exact words it matched.')),
          ui.card('Real LLM adapter', null,
            h('p', {}, ui.badge('Disabled', 'muted')),
            h('p', { class: 'small' }, 'Present so the provider interface is ready, but it refuses every call, has no API client and needs no key. Enabling a real model is an escalation decision, not a configuration change.')))),
    ];
  }

  window.SSD.views.prompt = { title: 'System prompt', render: (el) => ui.mount(el, 'Loading the system prompt…', build) };
})();
