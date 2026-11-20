/*
 * The six local tools, each with an input and output schema and a permission. Every tool works
 * only on data passed to it or read from the local knowledge base; none can reach a network,
 * publish, message or write to any production system.
 *
 *   retrieve  - candidate records from the knowledge base           (read_sample_signals)
 *   normalize - canonical url, platform and fields for comparison   (local_compute)
 *   dedupe    - remove repeated ids, same URLs and re-shared titles (local_compute)
 *   rank      - order by relevance (coverage, rarity, phrase match) (local_compute)
 *   classify  - preliminary classification through the provider     (local_compute)
 *   report    - a summary that cites every record id                (write_local_report)
 */
'use strict';

const { words, normalizeUrl, titleFingerprint } = require('../text');

const RECORD = { type: 'object', required: ['id', 'platform', 'title', 'excerpt', 'url', 'post_date'] };
const RECORDS = { type: 'array', items: RECORD, maxItems: 500 };

const retrieve = {
  name: 'retrieve', permission: 'read_sample_signals', description: 'Find sample records sharing at least one term with the request.',
  input: { type: 'object', required: ['terms'], properties: { terms: { type: 'array', items: { type: 'string', maxLength: 40 }, maxItems: 8 }, platforms: { type: 'array', items: { type: 'string' } } } },
  output: { type: 'object', required: ['candidates'], properties: { candidates: { type: 'array' } } },
  run({ terms, platforms, dateFrom, dateTo }, { kb }) {
    return { candidates: kb.findCandidates({ terms, platforms: platforms || null, dateFrom, dateTo }).map((c) => ({ ...c.record, matchedTerms: c.matched })) };
  },
};

const normalize = {
  name: 'normalize', permission: 'local_compute', description: 'Add the normalized URL and title fingerprint used for comparison.',
  input: { type: 'object', required: ['records'], properties: { records: RECORDS } },
  output: { type: 'object', required: ['records'], properties: { records: RECORDS } },
  run({ records }) {
    return { records: records.map((r) => ({ ...r, title: String(r.title).trim(), excerpt: String(r.excerpt).trim(), normalizedUrl: normalizeUrl(r.url), fingerprint: titleFingerprint(r.platform, r.title) })) };
  },
};

const dedupe = {
  name: 'dedupe', permission: 'local_compute', description: 'Keep the first of each repeated id, normalized URL or re-shared title.',
  input: { type: 'object', required: ['records'], properties: { records: RECORDS } },
  output: { type: 'object', required: ['unique', 'duplicates'], properties: { unique: RECORDS, duplicates: { type: 'array' } } },
  run({ records }) {
    const ids = new Map(), urls = new Map(), prints = new Map();
    const unique = [], duplicates = [];
    for (const r of records) {
      const url = r.normalizedUrl || normalizeUrl(r.url);
      const print = r.fingerprint || titleFingerprint(r.platform, r.title);
      if (ids.has(r.id)) { duplicates.push({ id: r.id, duplicateOf: r.id, kind: 'repeated_id', reason: `Record ID ${r.id} was retrieved more than once; the repeat was removed.` }); continue; }
      if (url && urls.has(url)) { duplicates.push({ id: r.id, duplicateOf: urls.get(url), kind: 'same_url', reason: `${r.id} has the same normalized URL as ${urls.get(url)}.` }); continue; }
      if (prints.has(print)) { duplicates.push({ id: r.id, duplicateOf: prints.get(print), kind: 'same_title', reason: `${r.id} has the same platform and title as ${prints.get(print)} (a re-share).` }); continue; }
      ids.set(r.id, r.id); if (url) urls.set(url, r.id); prints.set(print, r.id);
      unique.push(r);
    }
    return { unique, duplicates };
  },
};

const FIELD_WEIGHT = Object.freeze({ title: 3, topic: 2, excerpt: 1 });
const PHRASE_BONUS = Object.freeze({ topic: 6, title: 4, excerpt: 2 });

const rank = {
  name: 'rank', permission: 'local_compute', description: 'Order records by terms matched, then rarity-weighted score, phrase bonus, date and id.',
  input: { type: 'object', required: ['records', 'terms'], properties: { records: RECORDS, terms: { type: 'array', items: { type: 'string' } } } },
  output: { type: 'object', required: ['ranked'], properties: { ranked: { type: 'array' } } },
  run({ records, terms }) {
    const t = [...new Set(terms.map((x) => String(x).toLowerCase()))];
    const fields = records.map((r) => ({ title: words(r.title), topic: words(String(r.topic || '').replace(/-/g, ' ')), excerpt: words(r.excerpt) }));
    const has = (f, w) => f.title.includes(w) || f.topic.includes(w) || f.excerpt.includes(w);
    const rarity = Object.fromEntries(t.map((w) => { const df = fields.filter((f) => has(f, w)).length; return [w, df ? Math.log(1 + records.length / df) : 0]; }));
    const phrase = t.join(' ');
    const ranked = records.map((r, i) => {
      const f = fields[i];
      const matched = t.filter((w) => has(f, w));
      let score = matched.reduce((s, w) => s + ['title', 'topic', 'excerpt'].reduce((a, k) => a + (f[k].includes(w) ? FIELD_WEIGHT[k] : 0), 0) * rarity[w], 0);
      let phraseMatch = null;
      if (t.length > 1) phraseMatch = f.topic.join(' ') === phrase ? 'topic' : ` ${f.title.join(' ')} `.includes(` ${phrase} `) ? 'title' : ` ${f.excerpt.join(' ')} `.includes(` ${phrase} `) ? 'excerpt' : null;
      if (phraseMatch) score += PHRASE_BONUS[phraseMatch];
      return { ...r, matchedTerms: matched, termCount: t.length, phraseMatch, score: Math.round(score * 100) / 100 };
    }).filter((r) => r.matchedTerms.length);
    ranked.sort((a, b) => b.matchedTerms.length - a.matchedTerms.length || b.score - a.score || String(b.post_date).localeCompare(String(a.post_date)) || a.id.localeCompare(b.id));
    return { ranked: ranked.map((r, i) => ({ ...r, rank: i + 1 })) };
  },
};

const classify = {
  name: 'classify', permission: 'local_compute', description: 'Preliminary classification of each record through the active provider, with evidence.',
  input: { type: 'object', required: ['records'], properties: { records: RECORDS } },
  output: { type: 'object', required: ['classified'], properties: { classified: { type: 'array' } } },
  run({ records }, { provider, validateOutput, checkEvidence }) {
    return { classified: records.map((r) => {
      const c = validateOutput(provider.classify(r));
      checkEvidence(c, r);
      return { ...r, classification: c };
    }) };
  },
};

const report = {
  name: 'report', permission: 'write_local_report', description: 'Summarize classified records; every line cites its record id.',
  input: { type: 'object', required: ['records'], properties: { records: RECORDS } },
  output: { type: 'object', required: ['summary', 'lines', 'citations'], properties: { summary: { type: 'string' }, lines: { type: 'array' }, citations: { type: 'array' } } },
  run({ records }) {
    const count = (code) => records.filter((r) => r.classification && r.classification.code === code).length;
    const byPlatform = records.reduce((o, r) => ((o[r.platform] = (o[r.platform] || 0) + 1), o), {});
    return {
      summary: `${records.length} sample record(s): ${count('buying')} potential buying signal(s), ${count('general')} general AI interest, ${count('none')} not relevant. Preliminary, demo-only classifications on fictional data.`,
      lines: Object.entries(byPlatform).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([p, n]) => `${p}: ${n} (${records.filter((r) => r.platform === p).map((r) => r.id).join(', ')})`),
      citations: records.map((r) => r.id),
    };
  },
};

module.exports = { TOOLS: [retrieve, normalize, dedupe, rank, classify, report], FIELD_WEIGHT, PHRASE_BONUS };
