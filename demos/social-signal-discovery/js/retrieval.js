/*
 * Retrieval: find records matching a topic or keyword. Deterministic: the same query over the same
 * records always returns the same results in the same order. Pure: no I/O, no network.
 *
 * Ranking (relevance only; classification is a separate step):
 *   1. Coverage first: a record matching more of the distinct search terms ranks higher.
 *   2. Then score: each matched word counts by field (title 3, topic 2, excerpt 1), multiplied by
 *      how rare the word is across the records searched, so a common word such as "ai" counts
 *      for less than a specific one such as "leadership".
 *   3. Plus a bonus when the full multi-word query matches the record's topic exactly, or appears
 *      as a phrase in its title or excerpt.
 *   4. Ties: newest date first, then record id.
 * Every record matching at least one term is kept; fewer matches only means a lower rank.
 */
window.SSD = window.SSD || {};

(function () {
  const MAX_QUERY_LENGTH = 200;
  const DEFAULT_LIMIT = 20;
  const STOP = new Set(['the', 'and', 'for', 'are', 'about', 'with', 'what', 'where', 'how', 'who', 'talking', 'buyers', 'is', 'of', 'to', 'in', 'on', 'a', 'an']);

  const FIELD_WEIGHT = Object.freeze({ title: 3, topic: 2, excerpt: 1 });
  const PHRASE_BONUS = Object.freeze({ topic: 6, title: 4, excerpt: 2 });

  /** Lowercase words of two or more characters, stop words removed, in order. */
  function words(text) {
    const all = String(text == null ? '' : text).toLowerCase().match(/[a-z0-9]+/g) || [];
    return all.filter((w) => w.length > 1 && !STOP.has(w));
  }

  /** The distinct searchable words of a text. */
  function tokenize(text) {
    return [...new Set(words(text))];
  }

  /** Throws a clear error for input the pipeline must reject. */
  function validateQuery(query) {
    if (typeof query !== 'string') throw new TypeError('The query must be text.');
    const q = query.trim();
    if (!q) throw new RangeError('Enter a topic or keyword to search.');
    if (q.length > MAX_QUERY_LENGTH) throw new RangeError(`Keep the query under ${MAX_QUERY_LENGTH} characters.`);
    if (!tokenize(q).length) throw new RangeError('The query has no searchable words. Try a topic such as "AI training".');
    return q;
  }

  /** Each field as ordered words (for phrases) and as a set (for single words). */
  function fields(record) {
    const out = {};
    for (const [name, raw] of [['title', record.title], ['topic', String(record.topic || '').replace(/-/g, ' ')], ['excerpt', record.excerpt]]) {
      const list = words(raw);
      out[name] = { set: new Set(list), text: ` ${list.join(' ')} ` };
    }
    return out;
  }

  /** How rare each term is across the records: log(1 + records / records containing the term). */
  function rarity(terms, fieldList) {
    const n = fieldList.length || 1;
    const weights = {};
    for (const t of terms) {
      const df = fieldList.filter((f) => f.title.set.has(t) || f.topic.set.has(t) || f.excerpt.set.has(t)).length;
      weights[t] = df ? Math.log(1 + n / df) : 0;
    }
    return weights;
  }

  /** Where the full multi-word query appears: 'topic' (exact match), 'title', 'excerpt', or null. */
  function phraseMatch(terms, f) {
    if (terms.length < 2) return null;
    const phrase = terms.join(' ');
    if (f.topic.text.trim() === phrase) return 'topic';
    if (f.title.text.includes(` ${phrase} `)) return 'title';
    if (f.excerpt.text.includes(` ${phrase} `)) return 'excerpt';
    return null;
  }

  /**
   * Records sharing at least one query word. Each hit carries its score, the words it matched,
   * how many of the query's terms that is, and where the full phrase matched (if anywhere).
   */
  function search(records, query, limit = DEFAULT_LIMIT) {
    const terms = tokenize(validateQuery(query));
    const list = Array.isArray(records) ? records : [];
    const fieldList = list.map(fields);
    const weight = rarity(terms, fieldList);
    const hits = [];
    list.forEach((record, i) => {
      const f = fieldList[i];
      let score = 0;
      const matched = [];
      for (const t of terms) {
        const s = ['title', 'topic', 'excerpt'].reduce((sum, k) => sum + (f[k].set.has(t) ? FIELD_WEIGHT[k] : 0), 0);
        if (s) { score += s * weight[t]; matched.push(t); }
      }
      if (!matched.length) return;
      const phrase = phraseMatch(terms, f);
      if (phrase) score += PHRASE_BONUS[phrase];
      hits.push({ record, score: Math.round(score * 100) / 100, matched, termCount: terms.length, phrase });
    });
    hits.sort((a, b) => b.matched.length - a.matched.length
      || b.score - a.score
      || String(b.record.date).localeCompare(String(a.record.date))
      || a.record.id.localeCompare(b.record.id));
    return hits.slice(0, Math.max(0, limit));
  }

  SSD.retrieval = { tokenize, validateQuery, search, MAX_QUERY_LENGTH, DEFAULT_LIMIT, FIELD_WEIGHT, PHRASE_BONUS };
})();
