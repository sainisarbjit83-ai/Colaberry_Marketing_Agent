/*
 * Knowledge Base / RAG (component 7): local retrieval over the fictional sample_signals table.
 *
 * "Retrieval" here means finding stored records that share words with the request. There are no
 * embeddings and no external documents. Every record returned carries its id and source fields,
 * so each result can be traced back to the exact stored record. Never touches openclaw_signals.
 */
'use strict';

const { tokenize } = require('./text');

function createKnowledgeBase(db) {
  const all = () => db.prepare('SELECT * FROM sample_signals ORDER BY id').all().map((r) => ({ ...r }));

  /** One record by id, or null. */
  function getById(id) {
    const row = db.prepare('SELECT * FROM sample_signals WHERE id = ?').get(id);
    return row ? { ...row } : null;
  }

  /** The words of a record that retrieval matches on, by field. */
  function fieldWords(record) {
    return {
      title: new Set(tokenize(record.title)),
      topic: new Set(tokenize(String(record.topic || '').replace(/-/g, ' '))),
      excerpt: new Set(tokenize(record.excerpt)),
    };
  }

  /**
   * Records sharing at least one term, optionally limited to platforms and a date range.
   * Each candidate lists the terms it matched. Order: record id (ranking is a separate tool).
   */
  function findCandidates({ terms, platforms = null, dateFrom = null, dateTo = null }) {
    const wanted = [...new Set((terms || []).map((t) => String(t).toLowerCase()))];
    if (!wanted.length) return [];
    return all()
      .filter((r) => !platforms || platforms.includes(r.platform))
      .filter((r) => (!dateFrom || r.post_date >= dateFrom) && (!dateTo || r.post_date <= dateTo))
      .map((record) => {
        const f = fieldWords(record);
        const matched = wanted.filter((t) => f.title.has(t) || f.topic.has(t) || f.excerpt.has(t));
        return { record, matched };
      })
      .filter((c) => c.matched.length);
  }

  /** The source reference for a record: what a result cites as its evidence origin. */
  function sourceRef(record) {
    return { id: record.id, platform: record.platform, url: record.url, post_date: record.post_date, sample: record.is_sample === 1 };
  }

  return { all, getById, findCandidates, fieldWords, sourceRef };
}

module.exports = { createKnowledgeBase };
