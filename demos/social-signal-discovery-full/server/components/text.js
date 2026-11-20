/*
 * Shared text helpers: word splitting, URL normalization and title fingerprints. Pure functions,
 * used by the knowledge base and the tools so every component compares text the same way.
 */
'use strict';

const STOP = new Set(['the', 'and', 'for', 'are', 'about', 'with', 'what', 'where', 'how', 'who', 'talking', 'buyers', 'is', 'of', 'to', 'in', 'on', 'a', 'an', 'our', 'we', 'my', 'any', 'this', 'that']);

/** Lowercase words of two or more characters, stop words removed, in order. */
function words(text) {
  const all = String(text == null ? '' : text).toLowerCase().match(/[a-z0-9]+/g) || [];
  return all.filter((w) => w.length > 1 && !STOP.has(w));
}

/** The distinct searchable words of a text. */
function tokenize(text) {
  return [...new Set(words(text))];
}

/**
 * The comparable form of a URL: lowercase scheme and host, no "www.", no query string, no
 * fragment, no trailing slash. A value that is not a URL is compared as trimmed lowercase text.
 */
function normalizeUrl(url) {
  const raw = String(url == null ? '' : url).trim();
  if (!raw) return '';
  const m = raw.match(/^([a-z][a-z0-9+.-]*):\/\/([^/?#]+)([^?#]*)/i);
  if (!m) return raw.toLowerCase();
  return `${m[1].toLowerCase()}://${m[2].toLowerCase().replace(/^www\./, '')}${m[3].replace(/\/+$/, '')}`;
}

/** A platform plus title fingerprint, for spotting the same post re-shared under a new URL. */
function titleFingerprint(platform, title) {
  return `${String(platform || '').toLowerCase()}|${words(title).join(' ')}`;
}

module.exports = { STOP, words, tokenize, normalizeUrl, titleFingerprint };
