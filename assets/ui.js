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

  CC.ui = { PLATFORM_RULES_SOURCE, h, orNotSet, card, detailRow, back, sourceLine, arr, enc, dec, progressFor, stateOf };
})();
