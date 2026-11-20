/*
 * Evaluation: software correctness and classification quality in two separate panels, never one
 * combined score. The benchmark's "fictional, illustrative, not approved by Sohail" label is shown
 * on the quality panel itself.
 */
(function () {
  'use strict';
  const { h, api } = window.SSD;
  const ui = window.SSD.ui;

  function softwarePanel(s) {
    return ui.card('1 · Software correctness', s.ran ? `${s.passed} of ${s.total} checks passed` : 'not run',
      h('p', { class: 'small' }, s.note),
      ui.table(['Check', 'Result', 'What it verifies', 'Observed'], s.checks.map((c) => h('tr', { 'data-check': c.id, 'data-check-passed': String(c.passed) },
        h('td', { class: 'mono' }, c.id), h('td', {}, ui.badge(c.passed ? 'PASS' : 'FAIL', c.passed ? 'ok' : 'bad')), h('td', {}, c.description), h('td', { class: 'small' }, c.detail)))));
  }

  function matrix(conf) {
    return h('table', { class: 'matrix', id: 'confusion-matrix' },
      h('thead', {}, h('tr', {}, h('th', {}, 'Expected ↓ / Predicted →'), conf.columns.map((c) => h('th', {}, c)))),
      h('tbody', {}, conf.rows.map((e) => h('tr', {}, h('th', {}, e), conf.columns.map((c) => {
        const n = conf.matrix[e][c];
        return h('td', { class: n === 0 ? 'zero' : e === c ? 'diag' : 'off', 'data-cell': `${e}:${c}` }, n);
      })))));
  }

  function qualityPanel(q, label) {
    const head = [ui.notice('warn', 'Fictional, illustrative benchmark', h('p', {}, label))];
    if (q.status !== 'completed') return ui.card('2 · Classification quality', 'not measured', head, ui.notice('bad', 'Quality was not measured', h('p', {}, q.reason)));
    const tile = (r, name, sub) => h('div', { class: 'tile' }, h('div', { class: 'tile-value' }, ui.pct(r)), h('div', { class: 'tile-label' }, name), h('div', { class: 'tile-sub' }, sub));
    const cell = (r) => h('td', { class: 'num', title: r.reason || '' }, r.value === null ? 'undefined' : `${ui.pct(r)} (${ui.frac(r)})`);
    return ui.card('2 · Classification quality', `${q.correct} of ${q.total} benchmark records classified as expected`, head,
      h('p', { class: 'small' }, q.note),
      h('div', { class: 'tiles' }, tile(q.accuracy, 'Accuracy', ui.frac(q.accuracy)), tile(q.macro.precision, 'Macro precision', `over ${q.macro.precision.labelsIncluded}/${q.macro.precision.labelsTotal} labels`),
        tile(q.macro.recall, 'Macro recall', `over ${q.macro.recall.labelsIncluded}/${q.macro.recall.labelsTotal} labels`), tile(q.macro.f1, 'Macro F1', `over ${q.macro.f1.labelsIncluded}/${q.macro.f1.labelsTotal} labels`)),
      h('div', { class: 'grid-2' },
        h('div', {}, h('h4', {}, 'Per label'), ui.table(['Label', { text: 'Support', num: true }, 'TP / FP / FN', { text: 'Precision', num: true }, { text: 'Recall', num: true }, { text: 'F1', num: true }],
          Object.entries(q.perLabel).map(([l, r]) => h('tr', { 'data-label': l }, h('td', {}, l), h('td', { class: 'num' }, r.support), h('td', {}, `${r.tp} / ${r.fp} / ${r.fn}`), cell(r.precision), cell(r.recall), cell(r.f1))))),
        h('div', {}, h('h4', {}, 'Confusion matrix'), matrix(q.confusion),
          h('h4', {}, 'Clear vs hard records'),
          ui.table(['Difficulty', { text: 'Correct', num: true }], ['clear', 'hard'].map((d) => h('tr', { 'data-difficulty': d }, h('td', {}, d), h('td', { class: 'num' }, `${q.byDifficulty[d].correct} / ${q.byDifficulty[d].total}`)))))),
      h('h4', {}, `Mistakes (${q.mistakes.length})`),
      q.mistakes.length ? ui.table(['Record', 'Expected', 'Predicted', 'Difficulty', 'Why the expected label'], q.mistakes.map((m) => h('tr', { 'data-mistake': m.id }, h('td', {}, m.id), h('td', {}, m.expected), h('td', {}, m.predicted || 'error'), h('td', {}, m.difficulty), h('td', { class: 'small' }, m.rationale)))) : ui.empty('No mistakes on this benchmark.'),
      h('p', { class: 'small' }, 'Undefined means the denominator was zero (for example, a label that was never predicted has no precision). It is not the same as 0%.'));
  }

  function report(r, all) {
    const twin = all.find((e) => e.evalRunId !== r.evalRunId && e.configHash === r.config.configHash);
    return h('div', { id: 'evaluation-report', 'data-eval-id': r.evalRunId },
      ui.card(`${r.evalRunId}`, ui.central(r.createdAt),
        h('p', { class: 'small' }, `Benchmark ${r.config.benchmark.id}@${r.config.benchmark.version} (${r.config.benchmark.records} records) · provider ${r.config.provider.name} · prompt v${r.config.systemPrompt.version} · configuration #${r.config.configHash} · results #${r.resultsHash}`),
        twin ? h('p', { class: 'small', 'data-determinism': twin.resultsHash === r.resultsHash ? 'match' : 'differ' }, twin.resultsHash === r.resultsHash ? `Deterministic: same configuration and same results fingerprint as ${twin.evalRunId}.` : `Same configuration as ${twin.evalRunId} but a different results fingerprint.`) : null),
      softwarePanel(r.software), qualityPanel(r.quality, r.config.benchmark.label));
  }

  function render(el, selectId) {
    ui.mount(el, 'Loading evaluations…', async () => {
      const { evaluations } = await api('GET', '/api/evaluations');
      const pane = h('div', {});
      const runBtn = h('button', { id: 'run-eval', onclick: async () => {
        runBtn.disabled = true;
        pane.replaceChildren(ui.loading('Running 11 software checks and classifying 24 benchmark records…'));
        try { const r = await api('POST', '/api/evaluations'); render(el, r.evalRunId); } catch (err) { pane.replaceChildren(ui.errorBox(err)); runBtn.disabled = false; }
      } }, 'Run evaluation');
      const chosen = selectId || (evaluations.length ? evaluations[evaluations.length - 1].evalRunId : null);
      if (chosen) ui.mount(pane, `Loading ${chosen}…`, async () => report((await api('GET', `/api/evaluations/${chosen}`)).report, evaluations));
      else pane.replaceChildren(ui.empty('No evaluation yet. Press "Run evaluation".'));
      return [ui.pageHead('Evaluation', 'Two different questions, answered separately: does the software behave as designed, and how often do classifications match an illustrative benchmark?'),
        h('div', { class: 'actions' }, runBtn, evaluations.length ? h('span', { class: 'small' }, 'Earlier evaluations: ') : null,
          evaluations.map((e) => h('button', { class: e.evalRunId === chosen ? 'chip' : 'link', onclick: () => render(el, e.evalRunId) }, `${e.evalRunId} (${e.accuracy ? `acc ${e.accuracy.numerator}/${e.accuracy.denominator}, ` : ''}software ${e.software})`))),
        h('div', { class: 'sep' }), pane];
    });
  }

  window.SSD.views.evaluation = { title: 'Evaluation', render: (el) => render(el) };
})();
