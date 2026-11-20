/* Knowledge base: the fictional sample records the agent retrieves from, with simple filters. */
(function () {
  'use strict';
  const { h, api } = window.SSD;
  const ui = window.SSD.ui;

  async function build() {
    const { records } = await api('GET', '/api/knowledge-base');
    window.SSD.state.kb = Object.fromEntries(records.map((r) => [r.id, r]));
    const platform = h('select', { 'aria-label': 'Platform' }, h('option', { value: '' }, 'All platforms'), [...new Set(records.map((r) => r.platform))].sort().map((p) => h('option', { value: p }, p)));
    const search = h('input', { type: 'text', placeholder: 'Filter by word in title, topic or excerpt', 'aria-label': 'Filter' });
    const count = h('span', { class: 'small' });
    const body = h('tbody', {});
    const draw = () => {
      const q = search.value.trim().toLowerCase();
      const rows = records.filter((r) => (!platform.value || r.platform === platform.value) && (!q || `${r.title} ${r.topic} ${r.excerpt}`.toLowerCase().includes(q)));
      count.textContent = `${rows.length} of ${records.length} records`;
      body.replaceChildren(...(rows.length ? rows.map((r) => h('tr', { 'data-kb-id': r.id }, h('td', {}, h('strong', {}, r.id)), h('td', {}, r.platform), h('td', {}, r.post_date), h('td', {}, r.topic),
        h('td', {}, h('div', {}, h('strong', {}, r.title)), h('div', { class: 'small' }, r.excerpt)), h('td', { class: 'small' }, r.url.replace(/^https?:\/\//i, ''))))
        : [h('tr', {}, h('td', { colspan: 6 }, ui.empty('No record matches this filter.')))]));
    };
    platform.addEventListener('change', draw);
    search.addEventListener('input', draw);
    draw();
    return [
      ui.pageHead('Knowledge base', 'The 20 fictional sample records in local SQLite. Retrieval is keyword matching (no embeddings). Some records are deliberate duplicates so the dedupe tool has something to remove.'),
      ui.notice('warn', 'Fictional sample data', h('p', {}, 'Every record was written for this demo. The URLs point at example.com and are shown as text only; no record names an author.')),
      ui.card('Records', null, h('div', { class: 'actions' }, platform, search, count), h('div', { class: 'sep' }),
        h('table', { id: 'kb-table' }, h('thead', {}, h('tr', {}, ['ID', 'Platform', 'Posted', 'Topic', 'Title and excerpt', 'Source (fictional)'].map((x) => h('th', {}, x)))), body)),
    ];
  }

  window.SSD.views.knowledge = { title: 'Knowledge base', render: (el) => ui.mount(el, 'Loading sample records…', build) };
})();
