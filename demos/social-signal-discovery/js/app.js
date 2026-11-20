/*
 * Presentation for the Social Signal Discovery demo. Builds the page with the Command Center's
 * h() helper (assets/ui.js), so all text is set as text, never as HTML. Calls only the pipeline.
 */
window.SSD = window.SSD || {};

(function () {
  const { h } = CC.ui;
  const EXAMPLES = ['AI training', 'governance', 'leadership', 'RAG chatbot', 'sourdough'];

  // The five statuses a component can have in this demo. No other wording is used.
  const STATUS = Object.freeze({
    implemented: 'Implemented in the demo',
    partial: 'Partly implemented',
    simulated: 'Simulated',
    outside: 'Implemented outside the page',
    proposed: 'Proposed / not implemented',
  });

  // All 13 architecture components, in the manager's order and with the manager's names.
  const COMPONENTS = [
    ['User Interface (UI)', STATUS.implemented, 'This page: a search box, result cards with evidence, the duplicates list and a run trace'],
    ['System Prompt', STATUS.proposed, 'None. Without an LLM there is no prompt; the rules live in code'],
    ['Context Manager', STATUS.partial, 'Validates the query and bounds the result set; nothing more is assembled'],
    ['LLM (Brain)', STATUS.simulated, 'No model is called. Fixed, demo-only word rules stand in for model judgment when classifying'],
    ['Agent Loop (Orchestrator)', STATUS.implemented, 'pipeline.js runs one fixed workflow: validate, deduplicate, retrieve, classify, guardrail checks, present'],
    ['Tools', STATUS.proposed, 'None. The demo reads only its own sample file and calls no tool'],
    ['Knowledge Base / RAG', STATUS.simulated, 'Deterministic retrieval and ranking over fictional sample records, not openclaw_signals'],
    ['Memory', STATUS.proposed, 'None. Nothing is remembered between searches'],
    ['Planning / Task Decomposition', STATUS.partial, 'The step list is fixed in code; no task is decomposed and no plan is generated'],
    ['Guardrails', STATUS.implemented, 'Rejects bad queries, checks every cited id exists and is a labeled sample, enforces the result limit; the code has no network calls'],
    ['Human-in-the-Loop (HITL)', STATUS.proposed, 'No approval workflow. Results are only labeled as preliminary, for human review'],
    ['Logging & Observability', STATUS.simulated, 'A trace of each run is shown on the page; nothing is stored or monitored'],
    ['Evaluation', STATUS.outside, 'Automated tests in tests/social-signal-demo/ check the logic and the rendered page'],
  ];

  /** The duplicate line, worded by kind so a repeated id is not shown as a comparison of two records. */
  function duplicateText(d) {
    if (d.kind === 'repeated_id') return `Record ID ${d.id} appears more than once in the sample data. The repeated entry was removed and the first one kept.`;
    return `${d.id} has the same URL as ${d.duplicateOf} once normalized (case, "www.", query string, fragment and trailing slash ignored). ${d.id} was removed and ${d.duplicateOf} kept.`;
  }

  /** How the record matched the search, in plain words. */
  function relevanceText(r) {
    const where = { topic: 'the full search phrase matches its topic', title: 'the full search phrase appears in its title', excerpt: 'the full search phrase appears in its excerpt' }[r.phraseMatch];
    return `Relevance: matched ${r.matchedTerms.length} of ${r.termCount} search term(s) (${r.matchedTerms.join(', ')})${where ? `; ${where}` : ''}.`;
  }

  function resultCard(r) {
    const c = r.classification;
    return h('article', { class: `ssd-result is-${c.code}`, 'data-record-id': r.id },
      h('div', { class: 'ssd-result-head' },
        h('code', { class: 'ssd-id' }, r.id),
        h('span', { class: 'ssd-platform' }, `${r.platform} (sample)`),
        h('span', { class: 'ssd-date' }, r.date)),
      h('h3', {}, r.title),
      h('p', {}, r.excerpt),
      h('p', { class: 'ssd-class' }, h('strong', {}, `Preliminary classification: ${c.label}. `), c.reason),
      h('p', { class: 'muted ssd-relevance' }, relevanceText(r)),
      h('p', { class: 'muted' }, `Placeholder URL: ${r.url}`),
      h('p', { class: 'ssd-sample-note' }, SSD.SAMPLE_NOTICE));
  }

  function renderOutcome(out, target) {
    target.replaceChildren();
    if (!out.ok) {
      target.append(h('p', { class: 'ssd-error', role: 'alert' }, out.error));
    } else if (!out.results.length) {
      target.append(h('p', { class: 'empty' }, `No sample records match "${out.query}". Nothing was searched outside this demo's sample file.`));
    } else {
      target.append(h('p', {}, `${out.results.length} unique sample record(s) for "${out.query}". Classifications are preliminary, not verified leads or buyers.`),
        ...out.results.map(resultCard));
    }
    if (out.duplicates && out.duplicates.length) {
      target.append(h('details', {}, h('summary', {}, `${out.duplicates.length} duplicate record(s) removed`),
        h('ul', {}, out.duplicates.map((d) => h('li', { 'data-duplicate-kind': d.kind }, duplicateText(d))))));
    }
    target.append(h('details', { class: 'ssd-trace' }, h('summary', {}, 'Run trace (this run only, not stored)'),
      h('ol', {}, out.trace.map((t) => h('li', {}, h('strong', {}, `${t.name}: `), t.detail)))));
  }

  function mount(root) {
    const input = h('input', { type: 'text', id: 'ssd-query', class: 'chat-input', 'aria-label': 'Topic or keyword', maxlength: String(SSD.retrieval.MAX_QUERY_LENGTH), placeholder: 'e.g. AI training' });
    const results = h('section', { id: 'ssd-results', 'aria-live': 'polite' });
    const form = h('form', { class: 'chat' }, input, h('button', { type: 'submit' }, 'Search sample records'));
    const go = (q) => { input.value = q; renderOutcome(SSD.pipeline.run(q), results); };
    form.addEventListener('submit', (e) => { e.preventDefault(); go(input.value); });

    root.replaceChildren(
      h('header', { class: 'header' }, h('p', { class: 'title' }, 'Social Signal Discovery: local demo'),
        h('div', { class: 'subtitle' }, 'A demonstration of the proposed agent architecture. Not the agent, not deployed, not connected to anything.')),
      h('main', {},
        h('div', { class: 'banner is-sample', role: 'note' }, 'SAMPLE DATA ONLY: every record here is fictional and was written for this demo. No live platform is searched, nothing is sent or posted, and no database is read or written.'),
        h('div', { class: 'chat-panel' }, form,
          h('p', { class: 'muted' }, 'Try: ', ...EXAMPLES.map((ex, i) => [i ? ', ' : '', h('a', { href: `?q=${encodeURIComponent(ex)}`, 'data-example': ex }, ex)]))),
        results,
        h('h2', { class: 'section-title' }, 'Architecture components in this demo'),
        h('p', { class: 'muted' }, `Status key: ${Object.values(STATUS).join(' · ')}. A simulated or proposed component is not implemented.`),
        h('table', { class: 'ssd-components' }, h('tr', {}, h('th', {}, '#'), h('th', {}, 'Component'), h('th', {}, 'Status in this demo'), h('th', {}, 'What the demo actually does')),
          COMPONENTS.map(([n, s, how], i) => h('tr', { 'data-component': n }, h('td', {}, String(i + 1)), h('td', {}, n), h('td', { 'data-status': s }, s), h('td', {}, how))))));

    root.querySelectorAll('[data-example]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); go(a.getAttribute('data-example')); }));
    const q = new URLSearchParams(location.search).get('q');
    if (q) go(q);
  }

  SSD.app = { mount, COMPONENTS, STATUS, duplicateText, relevanceText };
  if (typeof document !== 'undefined' && document.getElementById('ssd-app')) mount(document.getElementById('ssd-app'));
})();
