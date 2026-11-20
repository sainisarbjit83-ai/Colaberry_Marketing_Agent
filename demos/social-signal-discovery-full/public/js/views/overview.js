/* Overview: what the demo is, how to walk through it, and the 13 components with honest statuses. */
(function () {
  'use strict';
  const { h, api } = window.SSD;
  const ui = window.SSD.ui;
  const STATUS_KIND = { 'Implemented in the demo': 'ok', 'Partly implemented': 'warn', Simulated: 'info', 'Proposed / not implemented': 'muted' };

  async function build() {
    const o = await api('GET', '/api/overview');
    window.SSD.state.overview = o;
    const tile = (value, label, sub) => h('div', { class: 'tile' }, h('div', { class: 'tile-value' }, value), h('div', { class: 'tile-label' }, label), sub ? h('div', { class: 'tile-sub' }, sub) : null);
    return [
      ui.pageHead('Social Signal Discovery: hybrid demo', o.demo),
      h('div', { class: 'tiles' },
        tile(o.counts.samples, 'Fictional sample records', 'in the local knowledge base'),
        tile(o.counts.runs, 'Research runs', 'stored in local SQLite'),
        tile(o.counts.reviews, 'Human review decisions', 'kept as audit history'),
        tile(o.counts.evaluations, 'Evaluations', 'software checks + quality')),
      ui.card('Suggested walkthrough', 'about five minutes',
        h('ol', { class: 'steps' },
          h('li', {}, 'Research: run the example question and look at the plan, the evidence and the reasoning.'),
          h('li', {}, 'Approve one result, reject one, and correct one (a correction needs a label and a note).'),
          h('li', {}, 'Run a second, related question: earlier review decisions appear separately, recalled from memory.'),
          h('li', {}, 'Execution trace: open the run log to see every task, tool call and decision.'),
          h('li', {}, 'Evaluation: run it and compare software correctness with classification quality.'),
          h('li', {}, 'Guardrails: try a blocked action and the network-block test, and see both refused.'))),
      ui.card('The 13 architecture components', 'status in this demo, stated plainly',
        h('p', { class: 'small' }, `Status key: ${o.statuses.join(' · ')}. "Simulated" and "Partly implemented" mean exactly that.`),
        ui.table(['#', 'Component', 'Status', 'What the demo does', 'Limits'], o.components.map((c, i) => h('tr', { 'data-component': c.name },
          h('td', {}, String(i + 1)), h('td', {}, h('strong', {}, c.name)), h('td', { 'data-status': c.status }, ui.badge(c.status, STATUS_KIND[c.status])), h('td', {}, c.does), h('td', { class: 'small' }, c.limits))))),
      ui.card('Active configuration', null,
        h('p', {}, h('strong', {}, 'Provider: '), `${o.provider.name}. ${o.provider.note} The real-LLM adapter is present but disabled.`),
        h('p', {}, h('strong', {}, 'System prompt: '), `${o.systemPrompt.id} v${o.systemPrompt.version} (#${o.systemPrompt.hash}). Interpreted by the provider: ${o.systemPrompt.interpretedByProvider ? 'yes' : 'no'}.`),
        h('p', {}, h('strong', {}, 'Approved platforms (configuration only, never searched): '), o.scope.approved_platforms.join(', ')),
        h('p', {}, h('strong', {}, 'Excluded platforms: '), o.scope.excluded_platforms.join(', '))),
    ];
  }

  window.SSD.views.overview = { title: 'Overview', render: (el) => ui.mount(el, 'Loading the demo overview…', build) };
})();
