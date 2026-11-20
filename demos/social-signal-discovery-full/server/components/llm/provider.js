/*
 * LLM (Brain) (component 4): the provider-independent interface.
 *
 * Every provider exposes the same shape, so a real model could replace the simulated one later
 * without changing the rest of the agent:
 *   describe() -> { name, kind: 'simulated' | 'real', isRealLlm, enabled, note }
 *   classify(record, context) -> {
 *     code: 'buying' | 'general' | 'none', label, rule_strength: 'strong' | 'moderate' | 'weak',
 *     evidence: [{ field, text, start, end }], reasoning: [string, ...]
 *   }
 * validateOutput() checks that shape, so a provider returning anything else is rejected.
 */
'use strict';

const LABELS = Object.freeze({
  buying: 'Potential enterprise AI buying signal',
  general: 'General AI interest',
  none: 'Not relevant',
});
const STRENGTHS = new Set(['strong', 'moderate', 'weak']);

class ProviderOutputError extends Error {
  constructor(message) { super(message); this.name = 'ProviderOutputError'; }
}

/** Throws ProviderOutputError unless the classification has the interface's shape. Returns it. */
function validateOutput(out) {
  if (!out || typeof out !== 'object') throw new ProviderOutputError('Provider returned no classification.');
  if (!LABELS[out.code]) throw new ProviderOutputError(`Unknown classification code "${out.code}".`);
  if (out.label !== LABELS[out.code]) throw new ProviderOutputError(`Label "${out.label}" does not match code "${out.code}".`);
  if (!STRENGTHS.has(out.rule_strength)) throw new ProviderOutputError(`Unknown rule strength "${out.rule_strength}".`);
  if (!Array.isArray(out.evidence) || !out.evidence.every((e) => e && ['title', 'excerpt'].includes(e.field) && typeof e.text === 'string' && Number.isInteger(e.start) && Number.isInteger(e.end) && e.end > e.start)) {
    throw new ProviderOutputError('Evidence must be a list of { field, text, start, end } spans in the title or excerpt.');
  }
  if (!Array.isArray(out.reasoning) || !out.reasoning.length || !out.reasoning.every((s) => typeof s === 'string' && s)) {
    throw new ProviderOutputError('Reasoning must be a non-empty list of steps.');
  }
  return out;
}

/** The default provider configuration: simulated, with the real adapter present but disabled. */
const DEFAULT_CONFIG = Object.freeze({ provider: 'simulated', real: Object.freeze({ enabled: false }) });

/** Build the provider named in the configuration. Unknown names are refused. */
function createProvider(config = DEFAULT_CONFIG) {
  if (config.provider === 'simulated') return require('./simulated').createSimulatedProvider();
  if (config.provider === 'real') return require('./disabled-real').createDisabledRealProvider(config.real || {});
  throw new Error(`Unknown provider "${config.provider}".`);
}

module.exports = { LABELS, STRENGTHS, ProviderOutputError, validateOutput, createProvider, DEFAULT_CONFIG };
