/*
 * Memory & review history. Memory (what later runs recall) and the review audit history (every
 * decision ever recorded) are shown as two separate panels, because clearing memory deletes the
 * first and keeps the second.
 */
(function () {
  'use strict';
  const { h, api } = window.SSD;
  const ui = window.SSD.ui;

  function memoryPanel(records, rerender) {
    const by = (k) => records.filter((r) => r.kind === k);
    const summaries = by('run_summary'), processed = by('processed_ids'), feedback = by('feedback');
    const kind = h('select', { 'aria-label': 'What to clear' }, h('option', { value: '' }, 'All memory'), h('option', { value: 'run_summary' }, 'Run summaries only'), h('option', { value: 'processed_ids' }, 'Processed ids only'), h('option', { value: 'feedback' }, 'Review feedback only'));
    const msg = h('div', {});
    const clear = h('button', { class: 'danger', id: 'clear-memory', onclick: async () => {
      const what = kind.value ? kind.options[kind.selectedIndex].text.toLowerCase() : 'all memory';
      if (!window.confirm(`Clear ${what}?\n\nLater runs will no longer recall it. The review audit history is NOT deleted.`)) return;
      clear.disabled = true;
      try {
        const out = await api('POST', '/api/memory/clear', kind.value ? { kind: kind.value } : {});
        rerender(ui.notice('ok', `Deleted ${out.cleared} memory record(s).`, h('p', {}, `${out.reviewAuditRetained} review decision(s) remain in the audit history. ${out.note}`)));
      } catch (err) {
        msg.replaceChildren(ui.notice('bad', 'Memory was not cleared', h('p', {}, err.message)));
        clear.disabled = false;
      }
    } }, 'Clear');
    return ui.card('Memory', `${records.length} record(s) that later runs can recall`,
      h('p', { class: 'small' }, 'Stored locally in memory_records. A new run recalls earlier runs that share a keyword, the record ids processed before, and the latest review decision for any record it sees again.'),
      h('h4', {}, `Run summaries (${summaries.length})`),
      summaries.length ? ui.table(['Run', 'Question', 'Keywords', 'Counts (buying / general / none)'], summaries.map((m) => h('tr', { 'data-memory-run': m.runId }, h('td', {}, m.runId), h('td', {}, m.content.question), h('td', {}, m.content.keywords.join(', ')), h('td', {}, `${m.content.counts.buying} / ${m.content.counts.general} / ${m.content.counts.none}`)))) : ui.empty('No run summaries remembered.'),
      h('h4', {}, `Processed record ids (${processed.length} run(s))`),
      processed.length ? h('p', { class: 'small' }, processed.map((m) => `${m.runId}: ${m.content.ids.join(', ') || 'none'}`).join(' · ')) : ui.empty('No processed ids remembered.'),
      h('h4', {}, `Review feedback in memory (${feedback.length})`),
      feedback.length ? ui.table(['Record', 'Decision', 'Corrected label', 'Note', 'From run'], feedback.map((m) => h('tr', { 'data-memory-feedback': m.signalId }, h('td', {}, m.signalId), h('td', {}, m.content.decision), h('td', {}, m.content.correctedLabel || ''), h('td', {}, m.content.note), h('td', {}, m.content.runId)))) : ui.empty('No review feedback remembered.'),
      h('div', { class: 'sep' }),
      h('div', { class: 'actions' }, kind, clear, h('span', { class: 'small' }, 'Clearing deletes memory only. It does not delete review decisions.')), msg);
  }

  function auditPanel(reviews) {
    return ui.card('Review audit history', `${reviews.length} decision(s) · kept when memory is cleared`,
      h('p', { class: 'small' }, 'Every human decision ever recorded, from the review_decisions table. This is the permanent record; memory only holds a copy that runs can recall.'),
      reviews.length ? h('table', { id: 'audit-table' }, h('thead', {}, h('tr', {}, ['Time (Central)', 'Run', 'Record', 'Decision', 'Original → corrected', 'Reviewer', 'Note'].map((x) => h('th', {}, x)))),
        h('tbody', {}, reviews.map((r) => h('tr', { 'data-audit': r.resultId }, h('td', { class: 'small' }, ui.central(r.decidedAt)), h('td', {}, r.runId), h('td', {}, r.signalId), h('td', {}, ui.reviewStatus(({ approve: 'approved', reject: 'rejected', correct: 'corrected' })[r.decision])),
          h('td', {}, r.correctedLabel ? `${r.originalLabel} → ${r.correctedLabel}` : r.originalLabel), h('td', {}, r.reviewer), h('td', {}, r.note))))) : ui.empty('No review decisions yet. Review a result on the Research page.'));
  }

  function render(el, banner) {
    ui.mount(el, 'Loading memory and review history…', async () => {
      const [mem, { reviews }] = await Promise.all([api('GET', '/api/memory'), api('GET', '/api/reviews')]);
      return [ui.pageHead('Memory & review history', 'What the agent remembers between runs, and the separate, permanent record of human decisions.'),
        banner || null, h('div', { class: 'grid-2' }, memoryPanel(mem.records, (b) => render(el, b)), auditPanel(reviews))];
    });
  }

  window.SSD.views.memory = { title: 'Memory', render: (el) => render(el) };
})();
