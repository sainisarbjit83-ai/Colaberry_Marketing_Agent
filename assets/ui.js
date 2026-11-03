/*
 * Shared rendering helpers for every tab. All text is set with createTextNode, never as HTML,
 * so nothing in the data files can inject markup.
 */
window.CC = window.CC || {};

(function () {
  const PLATFORM_RULES_SOURCE = 'platform rules (autonomyLadder.ts, promotionCriteria.ts), not your data files';

  /** Build an element. Children are strings (always text) or nodes. */
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === null || v === undefined || v === false) continue;
      el.setAttribute(k, v === true ? '' : String(v));
    }
    for (const c of children.flat()) {
      if (c === null || c === undefined || c === false) continue;
      el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return el;
  }

  /** A value from the data, or a labelled "not set" when the file has nothing there. */
  function orNotSet(v, what = 'not set in your plan') {
    return v === null || v === undefined || v === '' ? h('span', { class: 'empty' }, what) : String(v);
  }

  /**
   * A card that drills down one level. In sample mode it is tagged SAMPLE and cites the sample
   * file, except for platform-rule text, which is the same in both modes.
   */
  function card(data, href, title, body, source) {
    let sourceText = null;
    if (source) {
      sourceText = data.mode === 'sample' && source !== PLATFORM_RULES_SOURCE
        ? 'Source: assets/sample.js (made-up sample data)'
        : `Source: ${source}`;
    }
    return h('a', { class: 'card', href },
      data.mode === 'sample' ? h('span', { class: 'sample-tag' }, 'SAMPLE') : null,
      h('h3', {}, title), body,
      sourceText ? h('span', { class: 'source' }, sourceText) : null,
      h('span', { class: 'more' }, 'Open details →'));
  }

  function detailRow(label, value) {
    return h('tr', {}, h('th', {}, label), h('td', {}, value));
  }

  function back(href, label) {
    return h('a', { class: 'back', href }, `← Back to ${label}`);
  }

  /** "Source:" line under a detail page, honest about sample mode. */
  function sourceLine(data, source) {
    return h('p', { class: 'muted' }, data.mode === 'sample' && source !== PLATFORM_RULES_SOURCE
      ? 'Source: assets/sample.js (made-up sample data)'
      : `Source: ${source}`);
  }

  function arr(v) { return Array.isArray(v) ? v : []; }

  /** The detail-route segment for an id, and back. Ids may contain dots and colons. */
  const enc = (id) => encodeURIComponent(String(id));
  const dec = (s) => { try { return decodeURIComponent(s); } catch { return s; } };

  /** Join plan stories to progress stories on id (STORY-000.md, "Where the data comes from"). */
  function progressFor(data, storyId) {
    return arr(data.progress && data.progress.stories).find((s) => s.id === storyId) || null;
  }

  /** A story's platform verification state, or a labelled "not reported". */
  function stateOf(data, storyId) {
    const p = progressFor(data, storyId);
    return p && p.verification && p.verification.state ? p.verification.state : null;
  }

  /**
   * The ten rungs in the owner's own words, copied verbatim from AUTONOMY_MEANINGS in the
   * platform's autonomyLadder.ts. These are platform rules, not domain data, so they are the
   * one list on the page that does not come from a data file.
   */
  const RUNGS = Object.freeze([
    ['R0', 'Define the workflow, requirements, risks and human decisions.'],
    ['R1', 'Prepare isolated development, fixtures and baseline tests.'],
    ['R2', 'Answer questions using approved knowledge and records.'],
    ['R3', 'Perform approved, user-initiated sandbox tool operations.'],
    ['R4', 'Execute and verify stateful, multi-step sandbox tasks.'],
    ['R5', 'Evaluate in shadow mode against approved reference outcomes.'],
    ['R6', 'Conduct a separately approved, supervised production pilot.'],
    ['R7', 'Automate only explicitly authorized action classes within limits.'],
    ['R8', 'Coordinate necessary, authorized handoffs with other agents.'],
    ['R9', 'Demonstrate reliable operation, monitoring, recovery and ownership.'],
  ]);

  /** An ISO timestamp from a data file, shown in Central time; null stays a labelled gap. */
  function central(iso, what = 'not recorded') {
    const d = iso ? new Date(iso) : null;
    if (!d || Number.isNaN(d.getTime())) return orNotSet(null, what);
    return d.toLocaleString('en-US', {
      timeZone: 'America/Chicago', day: 'numeric', month: 'long', year: 'numeric',
      hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
    });
  }

  CC.ui = { PLATFORM_RULES_SOURCE, RUNGS, h, orNotSet, card, detailRow, back, sourceLine, arr, enc, dec, progressFor, stateOf, central };
})();
