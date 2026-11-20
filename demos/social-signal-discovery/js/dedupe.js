/*
 * Duplicate detection. A record is a duplicate when its id, or its normalized URL, has already
 * been seen. The first occurrence wins, so the result is deterministic for a given input order.
 * Pure: no I/O, no network.
 */
window.SSD = window.SSD || {};

(function () {
  /**
   * The comparable form of a URL: lowercase scheme and host, no "www.", no query string, no
   * fragment, no trailing slash. A value that is not a URL is compared as trimmed lowercase text.
   */
  function normalizeUrl(url) {
    const raw = String(url == null ? '' : url).trim();
    if (!raw) return '';
    const m = raw.match(/^([a-z][a-z0-9+.-]*):\/\/([^/?#]+)([^?#]*)/i);
    if (!m) return raw.toLowerCase();
    const host = m[2].toLowerCase().replace(/^www\./, '');
    const path = m[3].replace(/\/+$/, '');
    return `${m[1].toLowerCase()}://${host}${path}`;
  }

  /**
   * Split records into unique ones and duplicates. Each duplicate says why, with a `kind`:
   *   'repeated_id': the same record id appears again in the data (duplicateOf is that same id,
   *                  because the id itself is what repeats, not a second record);
   *   'same_url':    a different record id whose URL normalizes to an earlier record's URL.
   */
  function unique(records) {
    const byId = new Map();
    const byUrl = new Map();
    const kept = [];
    const duplicates = [];
    for (const r of Array.isArray(records) ? records : []) {
      const url = normalizeUrl(r.url);
      if (byId.has(r.id)) {
        duplicates.push({ id: r.id, duplicateOf: byId.get(r.id), kind: 'repeated_id', reason: 'same record id' });
        continue;
      }
      if (url && byUrl.has(url)) {
        duplicates.push({ id: r.id, duplicateOf: byUrl.get(url), kind: 'same_url', reason: 'same normalized URL' });
        continue;
      }
      byId.set(r.id, r.id);
      if (url) byUrl.set(url, r.id);
      kept.push(r);
    }
    return { unique: kept, duplicates };
  }

  SSD.dedupe = { normalizeUrl, unique };
})();
