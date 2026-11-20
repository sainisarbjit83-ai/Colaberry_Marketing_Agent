/*
 * The demo's agent loop: one fixed workflow, run in the same order every time.
 *
 *   validate -> deduplicate -> retrieve -> classify -> guardrail checks -> results
 *
 * Read-only by structure: this file and the modules it calls contain no network code, never write
 * anywhere, and only read the sample records they are given. Each run returns a trace of its steps
 * (the demo's logging), shown on the page and not stored anywhere.
 */
window.SSD = window.SSD || {};

(function () {
  /**
   * Guardrails checked before results are shown. Every cited id must exist in the input records,
   * every record must be marked sample, and the result must stay within the limit.
   */
  function checkGuardrails(results, records, limit) {
    const ids = new Set(records.map((r) => r.id));
    const checks = [
      { name: 'Every result cites a record id that exists in the dataset', pass: results.every((r) => ids.has(r.id)) },
      { name: 'Every result is a labeled sample record, not live data', pass: results.every((r) => r.sample === true) },
      { name: `Result count within the limit of ${limit}`, pass: results.length <= limit },
    ];
    return { pass: checks.every((c) => c.pass), checks };
  }

  /**
   * Run one query. Returns { ok, query, results, duplicates, guardrails, trace } on success, or
   * { ok: false, error, trace } for input the workflow rejects. Never throws for bad input.
   */
  function run(query, records = SSD.SAMPLE_RECORDS, limit = SSD.retrieval.DEFAULT_LIMIT) {
    const trace = [];
    const step = (name, detail) => trace.push({ step: trace.length + 1, name, detail });
    let q;
    try {
      q = SSD.retrieval.validateQuery(query);
      step('Validate query', `Accepted "${q}"`);
    } catch (e) {
      step('Validate query', `Rejected: ${e.message}`);
      return { ok: false, error: e.message, trace };
    }

    const { unique, duplicates } = SSD.dedupe.unique(records);
    step('Deduplicate', `${records.length} records in, ${unique.length} unique, ${duplicates.length} duplicate(s) removed`);

    const hits = SSD.retrieval.search(unique, q, limit);
    step('Retrieve', `${hits.length} matching record(s) for terms: ${SSD.retrieval.tokenize(q).join(', ')}`);

    const results = hits.map((h) => ({ ...h.record, score: h.score, matchedTerms: h.matched, termCount: h.termCount, phraseMatch: h.phrase, classification: SSD.classify.classify(h.record) }));
    const counts = results.reduce((o, r) => ((o[r.classification.code] = (o[r.classification.code] || 0) + 1), o), {});
    step('Classify', `buying signal: ${counts.buying || 0}, general AI interest: ${counts.general || 0}, not relevant: ${counts.none || 0}`);

    const guardrails = checkGuardrails(results, records, limit);
    step('Guardrail checks', guardrails.pass ? 'All passed' : `Failed: ${guardrails.checks.filter((c) => !c.pass).map((c) => c.name).join('; ')}`);
    if (!guardrails.pass) return { ok: false, error: 'A guardrail check failed, so no results are shown.', guardrails, trace };

    step('Present results', 'Results shown as preliminary classifications for human review. Nothing is sent, posted or stored.');
    return { ok: true, query: q, results, duplicates, guardrails, trace };
  }

  SSD.pipeline = { run, checkGuardrails };
})();
