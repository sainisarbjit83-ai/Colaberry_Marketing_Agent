/*
 * Research: the request form (question, keywords, scope, dates, limit) and the full output of a
 * run: status, system prompt used, recalled memory, plan with task states, decisions, duplicates,
 * result cards with review controls, and the cited report.
 */
(function () {
  'use strict';
  const { h, api } = window.SSD;
  const ui = window.SSD.ui;
  const EXAMPLES = ['Who is looking for AI training programs for their team?', 'Which departments are evaluating LLM vendors?', 'Follow-up: leadership training demand'];

  async function loadKb() {
    if (window.SSD.state.kb) return;
    const { records } = await api('GET', '/api/knowledge-base');
    window.SSD.state.kb = Object.fromEntries(records.map((r) => [r.id, r]));
  }

  function form(overview, output) {
    const q = h('textarea', { id: 'q', maxlength: 300, rows: 2, required: true, placeholder: 'What do you want to find out?' });
    const kw = h('input', { id: 'kw', type: 'text', placeholder: 'Optional, comma separated (e.g. ai, training)' });
    const platformBoxes = overview.scope.approved_platforms.map((p) => h('input', { type: 'checkbox', value: p, checked: true, 'data-platform': p }));
    const from = h('input', { id: 'from', type: 'date' });
    const to = h('input', { id: 'to', type: 'date' });
    const max = h('input', { id: 'max', type: 'number', min: 1, max: overview.scope.limits.max_results, value: overview.scope.limits.max_results });
    const run = h('button', { type: 'submit', id: 'run-btn' }, 'Run research');
    const submit = async (extra = {}) => {
      const body = { question: q.value };
      const words = kw.value.split(',').map((s) => s.trim()).filter(Boolean);
      if (words.length) body.keywords = words;
      const chosen = platformBoxes.filter((b) => b.checked).map((b) => b.value);
      if (chosen.length !== platformBoxes.length) body.platforms = chosen;
      if (from.value) body.dateFrom = from.value;
      if (to.value) body.dateTo = to.value;
      if (max.value && Number(max.value) !== overview.scope.limits.max_results) body.maxResults = Number(max.value);
      Object.assign(body, extra);
      run.disabled = true;
      output.replaceChildren(ui.loading('Running the agent: validating, planning and executing 11 subtasks…'));
      try {
        const trace = await api('POST', '/api/runs', body);
        window.SSD.state.lastTrace = trace;
        output.replaceChildren(...renderTrace(trace));
      } catch (err) {
        output.replaceChildren(ui.notice('bad', 'The run could not be started', h('p', {}, err.message)));
      } finally {
        run.disabled = false;
      }
    };
    return ui.card('Research request', 'local sample records only',
      h('form', { id: 'research-form', onsubmit: (e) => { e.preventDefault(); submit(); } },
        h('div', { class: 'field' }, h('label', { for: 'q' }, 'Research question'), q,
          h('div', { class: 'chips' }, EXAMPLES.map((x) => h('button', { type: 'button', class: 'chip', onclick: () => { q.value = x; } }, x)))),
        h('div', { class: 'field' }, h('label', { for: 'kw' }, 'Keywords'), kw, h('div', { class: 'hint' }, `Leave blank to derive them from the question. Up to ${overview.scope.limits.max_keywords}.`)),
        h('div', { class: 'field' }, h('label', {}, 'Platforms (scope configuration; nothing is searched live)'),
          h('div', { class: 'checks' }, platformBoxes.map((b) => h('label', {}, b, b.value))),
          h('div', { class: 'excluded' }, `Excluded and refused: ${overview.scope.excluded_platforms.join(', ')}.`)),
        h('div', { class: 'row' },
          h('div', { class: 'field' }, h('label', { for: 'from' }, 'Posted from'), from),
          h('div', { class: 'field' }, h('label', { for: 'to' }, 'Posted to'), to),
          h('div', { class: 'field' }, h('label', { for: 'max' }, 'Maximum results'), max)),
        h('div', { class: 'actions' }, run,
          h('button', { type: 'button', class: 'secondary', id: 'out-of-scope-btn', title: 'Sends the same request with "LinkedIn comments" added, to show the rejection', onclick: () => { if (!q.value.trim()) q.value = EXAMPLES[0]; submit({ platforms: [...overview.scope.approved_platforms.slice(0, 2), 'LinkedIn comments'] }); } }, 'Try an out-of-scope platform'))));
  }

  function renderTrace(t) {
    const [label, kind, meaning] = ui.RUN_STATUS[t.status] || [t.status, 'muted', ''];
    const out = [];
    out.push(h('div', { id: 'run-output', 'data-run-id': t.runId, 'data-run-status': t.status },
      ui.notice(kind === 'ok' ? 'ok' : kind === 'warn' ? 'warn' : 'bad', `${t.runId}: ${label}`, h('p', {}, meaning), t.error ? h('p', { 'data-error': t.error.rule || t.error.code || t.error.class }, ui.explain(t.error)) : null,
        h('p', { class: 'small' }, `System prompt ${t.systemPrompt.id} v${t.systemPrompt.version} (#${t.systemPrompt.hash}) was loaded for this run. `, t.systemPrompt.disclosure || ''),
        h('div', { class: 'actions' }, h('a', { href: `#trace?run=${t.runId}` }, 'Open the execution log for this run →')))));
    if (t.context) {
      const r = t.context.request;
      out.push(ui.card('Request as validated', null, h('p', { class: 'small' }, `Keywords (${r.keywordSource}): ${r.keywords.join(', ')} · Platforms: ${r.platforms.join(', ')} · Dates: ${r.dateFrom || 'any'} to ${r.dateTo || 'any'} · Max results: ${r.maxResults}`)));
    }
    if (t.recalled) {
      out.push(ui.card('Recalled from memory', 'before this run started',
        t.recalled.priorRuns.length
          ? ui.table(['Earlier run', 'Question', 'Shared keywords'], t.recalled.priorRuns.map((p) => h('tr', { 'data-prior-run': p.runId }, h('td', {}, p.runId), h('td', {}, p.question), h('td', {}, p.sharedKeywords.join(', ')))))
          : ui.empty('No earlier run shares these keywords. Run a related question afterwards to see memory recall.'),
        h('p', { class: 'small' }, `${t.recalled.processedIds.length} sample record id(s) had been processed by earlier runs.`)));
    }
    if (t.plan && t.plan.length) {
      out.push(ui.card('Agent plan', `${t.plan.filter((x) => x.status === 'completed').length} of ${t.plan.length} subtasks completed`,
        ui.table(['#', 'Subtask', 'Component', 'Critical', 'Status', 'Outcome'], t.plan.map((x) => h('tr', { 'data-task': x.name, 'data-task-status': x.status },
          h('td', {}, x.seq), h('td', {}, h('strong', {}, x.name), h('div', { class: 'small' }, x.purpose)), h('td', {}, x.component), h('td', {}, x.critical ? 'yes' : 'no'),
          h('td', {}, ui.badge(x.status, ui.TASK_STATUS[x.status])), h('td', { class: 'small' }, x.error || x.detail || '')))),
        t.decisions.length ? [h('h4', {}, 'Orchestrator decisions'), h('ol', { class: 'steps' }, t.decisions.map((d) => h('li', {}, d)))] : null));
    }
    if (t.duplicates && t.duplicates.length) out.push(ui.card('Duplicates removed', `${t.duplicates.length}`, h('ul', { class: 'steps' }, t.duplicates.map((d) => h('li', { 'data-duplicate-kind': d.kind }, d.reason)))));
    if (t.results && t.results.length) {
      out.push(h('div', { class: 'card-head' }, h('h2', {}, `Results (${t.results.length})`), h('span', { class: 'card-sub' }, `${t.pendingReviews.length} waiting for human review`)));
      out.push(...t.results.map(window.SSD.results.resultCard));
    } else if (t.status === 'completed') {
      out.push(ui.empty('No sample record matched this request. Try broader keywords such as "ai" or "training".'));
    }
    if (t.report) out.push(ui.card('Report', 'every line cites its record ids', h('p', {}, t.report.summary), h('ul', { class: 'steps' }, t.report.lines.map((l) => h('li', {}, l)))));
    return out;
  }

  async function build() {
    await loadKb();
    const overview = window.SSD.state.overview || (window.SSD.state.overview = await api('GET', '/api/overview'));
    const output = h('div', { id: 'research-output' });
    if (window.SSD.state.lastTrace) output.replaceChildren(...renderTrace(window.SSD.state.lastTrace));
    else output.replaceChildren(ui.empty('No run yet in this session. Pick an example question and press "Run research".'));
    return [ui.pageHead('Research', 'Ask a question. The agent validates it, plans eleven subtasks, retrieves and classifies fictional sample records, and queues every result for human review.'), form(overview, output), output];
  }

  window.SSD.views.research = { title: 'Research', render: (el) => ui.mount(el, 'Loading the research workspace…', build), renderTrace };
})();
