/*
 * Preliminary signal classification, by fixed rules. Stands in for the judgment the proposed
 * agent would apply; it is NOT an LLM and NOT the approved buyer criteria.
 *
 * DEMO-ONLY RULES. The real buyer-signal criteria are PENDING Sohail Syed's confirmation (the L1
 * story's blocker). These illustrative word lists exist only to show how a classification and its
 * reason would be presented. A classification is never a verified lead or a confirmed buyer.
 */
window.SSD = window.SSD || {};

(function () {
  const RULES = Object.freeze({
    ai: ['ai', 'generative ai', 'llm', 'large language models', 'rag', 'machine learning', 'model', 'transformers', 'claude', 'chatbot', 'embeddings', 'fine-tuning'],
    organization: ['our company', 'our team', 'team', 'department', 'departments', 'department heads', 'leadership', 'directors', 'staff', 'enterprise', 'insurer', 'company'],
    intent: ['looking for', 'recommendations', 'vendor', 'partner', 'budget', 'evaluating', 'evaluation', 'program', 'programs', 'upskilling', 'onboard', 'training'],
  });

  const LABELS = Object.freeze({
    buying: 'Potential enterprise AI buying signal',
    general: 'General AI interest',
    none: 'Not relevant',
  });

  const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const has = (text, phrase) => new RegExp(`\\b${escape(phrase)}\\b`, 'i').test(text);
  const found = (text, list) => list.filter((p) => has(text, p));

  /** Classify one record. Returns { code, label, reason, matched }. */
  function classify(record) {
    const text = `${record.title || ''} ${record.excerpt || ''}`;
    const matched = { ai: found(text, RULES.ai), organization: found(text, RULES.organization), intent: found(text, RULES.intent) };
    const list = (k) => matched[k].map((w) => `"${w}"`).join(', ');
    if (matched.ai.length && matched.organization.length && matched.intent.length) {
      return { code: 'buying', label: LABELS.buying, matched,
        reason: `Mentions AI (${list('ai')}), an organization (${list('organization')}) and an intent to acquire help or training (${list('intent')}).` };
    }
    if (matched.ai.length) {
      const missing = [!matched.organization.length && 'no organization', !matched.intent.length && 'no buying intent'].filter(Boolean).join(' and ');
      return { code: 'general', label: LABELS.general, matched,
        reason: `Mentions AI (${list('ai')}) but shows ${missing}.` };
    }
    return { code: 'none', label: LABELS.none, matched, reason: 'No AI terms found.' };
  }

  SSD.classify = { classify, RULES, LABELS };
})();
