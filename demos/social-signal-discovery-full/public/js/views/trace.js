/* Execution trace & logs: every stored run, its subtasks, orchestrator decisions and log rows. */
(function () {
  'use strict';
  const { h, api } = window.SSD;
  const ui = window.SSD.ui;
  const OUTCOME = { success: 'ok', failure: 'bad', blocked: 'bad', info: 'muted' };

  function logTable(logs) {
    const filter = h('select', { 'aria-label': 'Filter by outcome' }, ['all', 'success', 'failure', 'blocked', 'info'].map((o) => h('option', { value: o }, o === 'all' ? 'All outcomes' : o)));
    const body = h('tbody', {});
    const draw = () => body.replaceChildren(...logs.filter((l) => filter.value === 'all' || l.outcome === filter.value).map((l) => h('tr', { 'data-log-event': l.event, 'data-log-outcome': l.outcome },
      h('td', { class: 'small' }, ui.central(l.ts)), h('td', {}, l.component), h('td', {}, l.event), h('td', {}, ui.badge(l.outcome, OUTCOME[l.outcome])),
      h('td', { class: 'num' }, l.duration_ms === null ? '' : `${Number(l.duration_ms).toFixed(1)} ms`), h('td', {}, l.error_class || ''),
      h('td', { class: 'detail' }, JSON.stringify(l.detail)))));
    filter.addEventListener('change', draw);
    draw();
    return [h('div', { class: 'actions' }, h('label', {}, 'Show'), filter, h('span', { class: 'small' }, `${logs.length} log rows`)),
      h('table', { id: 'log-table' }, h('thead', {}, h('tr', {}, ['Time (Central)', 'Component', 'Event', 'Outcome', { text: 'Duration', num: true }, 'Error class', 'Detail'].map((x) => h('th', typeof x === 'object' ? { class: 'num' } : {}, typeof x === 'object' ? x.text : x)))), body)];
  }

  async function detail(runId) {
    const [run, { logs }] = await Promise.all([api('GET', `/api/runs/${runId}`), api('GET', `/api/runs/${runId}/logs`)]);
    return [
      ui.card(`${run.runId}: ${run.question || '(no question)'}`, ui.central(run.createdAt),
        h('p', {}, ui.runStatus(run.status), ' ', h('span', { class: 'small' }, (ui.RUN_STATUS[run.status] || [])[2] || '')),
        run.systemPrompt ? h('p', { class: 'small' }, `System prompt v${run.systemPrompt.version} (#${run.systemPrompt.hash}); interpreted by provider: ${run.systemPrompt.interpretedByProvider ? 'yes' : 'no'}. Provider: ${run.provider}.`) : null,
        run.decisions.length ? [h('h4', {}, 'Orchestrator decisions'), h('ol', { class: 'steps' }, run.decisions.map((d) => h('li', {}, d)))] : null),
      ui.card('Subtasks', null, run.tasks.length
        ? ui.table(['#', 'Subtask', 'Status', 'Outcome'], run.tasks.map((t) => h('tr', { 'data-task': t.name }, h('td', {}, t.seq), h('td', {}, t.name), h('td', {}, ui.badge(t.status, ui.TASK_STATUS[t.status])), h('td', { class: 'small' }, t.error || t.detail || ''))))
        : ui.empty('No subtasks: the run stopped before planning (see the decisions above).')),
      ui.card('Results and review status', `${run.results.length}`, run.results.length
        ? ui.table(['#', 'Record', 'Classification', 'Review'], run.results.map((r) => h('tr', {}, h('td', {}, r.rank), h('td', {}, `${r.signalId} · ${r.title}`), h('td', {}, r.label), h('td', {}, ui.reviewStatus(r.reviewStatus)))))
        : ui.empty('This run produced no results.')),
      ui.card('Execution log', 'structured rows from the local execution_logs table', logTable(logs)),
    ];
  }

  async function build() {
    const { runs } = await api('GET', '/api/runs');
    const head = ui.pageHead('Execution trace & logs', 'Every run is stored with its subtasks and a structured log of each task, tool call, orchestrator decision and guardrail event.');
    if (!runs.length) return [head, ui.empty('No runs yet. Start one from the Research page.')];
    const wanted = new URLSearchParams(location.hash.split('?')[1] || '').get('run');
    const selected = runs.some((r) => r.runId === wanted) ? wanted : runs[0].runId;
    const pane = h('div', {});
    const links = runs.map((r) => h('a', { href: `#trace?run=${r.runId}`, class: r.runId === selected ? 'active' : '', 'data-run-link': r.runId },
      h('div', {}, h('strong', {}, r.runId), ' ', ui.runStatus(r.status)), h('div', { class: 'small' }, r.question || '(no question)'),
      h('div', { class: 'small' }, `${r.results} result(s), ${r.pending} pending review`)));
    ui.mount(pane, `Loading ${selected}…`, () => detail(selected));
    return [head, h('div', { class: 'split' }, ui.card('Runs', `${runs.length}`, h('div', { class: 'list-select' }, links)), pane)];
  }

  window.SSD.views.trace = { title: 'Execution trace', render: (el) => ui.mount(el, 'Loading runs…', build) };
})();
