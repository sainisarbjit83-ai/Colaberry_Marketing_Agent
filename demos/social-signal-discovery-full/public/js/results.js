/*
 * A research result card: the record with its evidence highlighted, the preliminary classification
 * and its reasoning, any earlier review decision recalled from memory (shown separately), and the
 * human review controls.
 */
(function () {
  'use strict';
  const { h, api } = window.SSD;
  const ui = window.SSD.ui;
  const LABELS = { buying: 'Potential enterprise AI buying signal', general: 'General AI interest', none: 'Not relevant' };

  /** The text with the evidence spans for this field wrapped in <mark>. */
  function highlight(text, spans) {
    const sorted = spans.slice().sort((a, b) => a.start - b.start);
    const out = [];
    let at = 0;
    for (const s of sorted) {
      if (s.start < at) continue;
      out.push(text.slice(at, s.start), h('mark', { title: `Evidence at characters ${s.start}–${s.end}` }, text.slice(s.start, s.end)));
      at = s.end;
    }
    out.push(text.slice(at));
    return out;
  }

  function recordBlock(r) {
    const rec = (window.SSD.state.kb || {})[r.signalId];
    const ev = r.evidence || [];
    const title = rec ? rec.title : r.title;
    return h('div', {},
      h('h4', {}, 'Record'),
      h('div', { class: 'quote' }, h('strong', {}, highlight(title, ev.filter((e) => e.field === 'title')))),
      rec ? h('div', { class: 'quote' }, highlight(rec.excerpt, ev.filter((e) => e.field === 'excerpt'))) : null,
      h('p', { class: 'small' }, `Source: ${r.source.url.replace(/^https?:\/\//, '')} (fictional sample record, not a real page) · ${r.platform} · ${r.source.post_date}`),
      h('h4', {}, `Evidence (${ev.length})`),
      ev.length ? h('div', { class: 'pill-list' }, ev.map((e) => h('span', { class: 'chip', title: `${e.field}[${e.start}:${e.end}]` }, `"${e.text}" · ${e.field}`))) : h('p', { class: 'small' }, 'No supporting phrase: the record was judged not relevant.'));
  }

  function priorReviewBlock(p) {
    if (!p) return null;
    const what = p.decision === 'correct' ? `Corrected to "${p.correctedLabel}"` : p.decision === 'approve' ? 'Approved' : 'Rejected';
    return h('div', { class: 'memory-box', 'data-prior-review': p.decision },
      h('div', { class: 'tag' }, 'Earlier review · recalled from memory'),
      h('div', {}, h('strong', {}, `${what}`), ` by ${p.reviewer} in ${p.runId} (${ui.central(p.decidedAt)}).`),
      h('div', {}, `Note: "${p.note}"`),
      h('div', { class: 'small' }, 'Shown for context only. The new classification on this card was made independently and has not been changed.'));
  }

  function decisionSummary(d) {
    const st = d.status || ({ approve: 'approved', reject: 'rejected', correct: 'corrected' })[d.decision];
    return h('div', { class: 'review-done', 'data-review-status': st },
      ui.reviewStatus(st), ' ',
      d.decision === 'correct' ? `Label corrected to "${d.correctedLabel}". ` : '',
      `By ${d.reviewer}${d.decidedAt ? `, ${ui.central(d.decidedAt)}` : ''}. Note: "${d.note}"`,
      h('div', { class: 'small' }, 'Recorded locally. No external action was taken: nothing was published, posted, sent or contacted.'));
  }

  function reviewForm(result, onDone) {
    const msg = h('div', {});
    const reviewer = h('input', { type: 'text', maxlength: 80, value: ui.store.get('ssd-reviewer') || '', placeholder: 'Your name', 'data-field': 'reviewer' });
    const decision = h('select', { 'data-field': 'decision' }, h('option', { value: 'approve' }, 'Approve'), h('option', { value: 'reject' }, 'Reject'), h('option', { value: 'correct' }, 'Correct the label'));
    const label = h('select', { 'data-field': 'correctedLabel' }, Object.entries(LABELS).filter(([code]) => code !== result.code).map(([code, text]) => h('option', { value: code }, text)));
    const labelField = h('div', { class: 'field hidden' }, h('label', {}, 'Corrected label (required for a correction)'), label);
    const note = h('textarea', { maxlength: 500, rows: 2, placeholder: 'Why? Required for every decision.', 'data-field': 'note' });
    decision.addEventListener('change', () => labelField.classList.toggle('hidden', decision.value !== 'correct'));
    const submit = h('button', { type: 'submit' }, 'Record decision');
    const form = h('form', { 'data-review-form': result.resultId, onsubmit: async (ev) => {
      ev.preventDefault();
      submit.disabled = true;
      msg.replaceChildren(ui.loading('Recording the decision…'));
      ui.store.set('ssd-reviewer', reviewer.value.trim());
      const body = { decision: decision.value, note: note.value, reviewer: reviewer.value };
      if (decision.value === 'correct') body.correctedLabel = label.value;
      try {
        const d = await api('POST', `/api/reviews/${encodeURIComponent(result.resultId)}`, body);
        onDone(d);
      } catch (err) {
        msg.replaceChildren(ui.notice('bad', 'The decision was not recorded', h('p', {}, err.message)));
        submit.disabled = false;
      }
    } },
    h('div', { class: 'field' }, h('label', {}, 'Reviewer'), reviewer),
    h('div', { class: 'field' }, h('label', {}, 'Decision'), decision),
    labelField,
    h('div', { class: 'field' }, h('label', {}, 'Reviewer note'), note),
    h('div', { class: 'actions' }, submit), msg);
    return form;
  }

  function reviewBlock(result) {
    const box = h('div', { 'data-review-box': result.resultId });
    const showDone = (d) => {
      // Keep the in-page trace in step, so returning to this view shows the decision, not the form.
      result.decision = d;
      result.reviewStatus = d.status;
      box.replaceChildren(h('h4', {}, 'Human review'), decisionSummary(d));
    };
    if (result.decision) showDone({ ...result.decision, status: result.reviewStatus });
    else if (result.reviewStatus && result.reviewStatus !== 'pending') box.replaceChildren(h('h4', {}, 'Human review'), ui.reviewStatus(result.reviewStatus));
    else box.replaceChildren(h('h4', {}, 'Human review'), h('p', { class: 'small' }, 'Waiting for a person. Approving records a decision only; it triggers no external action.'), reviewForm(result, showDone));
    return box;
  }

  function resultCard(r) {
    return h('article', { class: 'result', 'data-result-id': r.resultId, 'data-signal-id': r.signalId },
      h('div', { class: 'result-head' },
        h('div', {}, h('div', { class: 'result-title' }, `#${r.rank} · ${r.signalId} · ${r.title}`), h('div', { class: 'result-meta' }, `${r.platform} · relevance score ${r.score}${r.seenBefore ? ' · seen in an earlier run' : ''}`)),
        h('div', {}, ui.badge(r.label, ui.CODE_KIND[r.code]))),
      h('div', { class: 'result-body' },
        h('div', { class: 'result-col' }, recordBlock(r)),
        h('div', { class: 'result-col' },
          h('h4', {}, 'New preliminary classification'),
          h('p', {}, h('strong', { 'data-classification': r.code }, r.label), ` · rule strength: ${r.ruleStrength || 'n/a'}`),
          h('p', { class: 'small' }, 'From the simulated provider (fixed word rules). Preliminary: not a verified lead or buyer.'),
          h('h4', {}, 'Why'), h('ol', { class: 'steps' }, (r.reasoning || []).map((s) => h('li', {}, s))),
          priorReviewBlock(r.priorReview),
          h('div', { class: 'sep' }),
          reviewBlock(r))));
  }

  window.SSD.results = { resultCard, highlight, LABELS };
})();
