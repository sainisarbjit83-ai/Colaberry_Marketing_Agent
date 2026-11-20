/*
 * The SIMULATED provider: the default, and fully local. IT IS NOT A LANGUAGE MODEL.
 *
 * It classifies a record with fixed, deterministic word rules and reports the exact phrases it
 * matched as evidence, with their positions. It does not read or interpret a system prompt the
 * way a real LLM would. The same record always gets the same classification.
 *
 * DEMO-ONLY RULES. The real buyer-signal criteria are PENDING Sohail Syed's confirmation. These
 * word lists only show how a classification and its evidence would be presented; a classification
 * is never a verified lead or a confirmed buyer.
 */
'use strict';

const { LABELS } = require('./provider');

const RULES = Object.freeze({
  ai: ['generative ai', 'ai', 'llm', 'large language models', 'rag', 'machine learning', 'model', 'transformers', 'claude', 'chatbot', 'embeddings', 'fine-tuning', 'ai agents'],
  organization: ['our company', 'department heads', 'engineering org', 'hospital network', 'school district', 'district', 'department', 'departments', 'leadership', 'directors', 'managers', 'staff', 'teachers', 'enterprise', 'insurer', 'company', 'team'],
  intent: ['looking for', 'recommendations', 'vendor', 'vendors', 'partner', 'budget', 'evaluating', 'evaluation', 'program', 'programs', 'upskilling', 'onboard', 'training'],
});

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Every non-overlapping occurrence of the group's phrases, longest phrases first. */
function spans(record, phrases) {
  const out = [];
  for (const field of ['title', 'excerpt']) {
    const text = String(record[field] || '');
    const taken = [];
    for (const phrase of [...phrases].sort((a, b) => b.length - a.length)) {
      const re = new RegExp(`\\b${escape(phrase)}\\b`, 'gi');
      let m;
      while ((m = re.exec(text))) {
        const start = m.index, end = m.index + m[0].length;
        if (taken.some(([s, e]) => start < e && end > s)) continue;
        taken.push([start, end]);
        out.push({ field, text: m[0], start, end, phrase });
      }
    }
  }
  return out.sort((a, b) => (a.field === b.field ? a.start - b.start : a.field === 'title' ? -1 : 1));
}

function createSimulatedProvider() {
  function describe() {
    return { name: 'simulated-rules', kind: 'simulated', isRealLlm: false, enabled: true,
      note: 'Simulated provider: fixed local word rules, not a language model. It does not interpret the system prompt like a real LLM.' };
  }

  function classify(record) {
    const found = { ai: spans(record, RULES.ai), organization: spans(record, RULES.organization), intent: spans(record, RULES.intent) };
    const names = (k) => [...new Set(found[k].map((s) => s.phrase))];
    const quote = (k) => names(k).map((p) => `"${p}"`).join(', ');
    const evidence = (keys) => keys.flatMap((k) => found[k]).map(({ field, text, start, end }) => ({ field, text, start, end }));
    const steps = [`AI terms: ${quote('ai') || 'none'}.`, `Organization terms: ${quote('organization') || 'none'}.`, `Intent terms: ${quote('intent') || 'none'}.`];

    if (found.ai.length && found.organization.length && found.intent.length) {
      const strong = names('organization').length + names('intent').length >= 4;
      return { code: 'buying', label: LABELS.buying, rule_strength: strong ? 'strong' : 'moderate', evidence: evidence(['ai', 'organization', 'intent']),
        reasoning: [...steps, 'All three groups matched, so the record is a potential enterprise AI buying signal (preliminary, demo-only rules).'] };
    }
    if (found.ai.length) {
      const missing = [!found.organization.length && 'no organization', !found.intent.length && 'no buying intent'].filter(Boolean).join(' and ');
      return { code: 'general', label: LABELS.general, rule_strength: 'moderate', evidence: evidence(['ai']),
        reasoning: [...steps, `AI matched but there is ${missing}, so the record shows general AI interest.`] };
    }
    return { code: 'none', label: LABELS.none, rule_strength: 'weak', evidence: [],
      reasoning: [...steps, 'No AI terms matched, so the record is not relevant.'] };
  }

  return { describe, classify };
}

module.exports = { createSimulatedProvider, RULES };
