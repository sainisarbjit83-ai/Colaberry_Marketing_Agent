/*
 * The REAL-LLM adapter: present so the interface is ready, and DISABLED.
 *
 * It refuses every call, whatever its configuration says. It contains no network code and no API
 * client, and needs no API key. Turning it into a working adapter would need, at minimum: Sohail's
 * decision on how a model call fits the "zero outbound network calls" acceptance, an approved
 * provider and model (an AI model change is an escalation item in CLAUDE.md), and new code. Even
 * then, the demo's guardrails block outbound network access in this process.
 */
'use strict';

class ProviderDisabledError extends Error {
  constructor(message) { super(message); this.name = 'ProviderDisabledError'; }
}

const REFUSAL = 'The real LLM provider is disabled. No external model is called in this demo; use the simulated provider.';

function createDisabledRealProvider(config = {}) {
  const requested = Boolean(config.enabled);
  function describe() {
    return { name: 'real-llm-adapter', kind: 'real', isRealLlm: true, enabled: false,
      note: requested ? 'Enabling was requested in configuration, but this adapter refuses every call: no real provider is approved or implemented.' : REFUSAL };
  }
  function classify() { throw new ProviderDisabledError(REFUSAL); }
  return { describe, classify };
}

module.exports = { createDisabledRealProvider, ProviderDisabledError, REFUSAL };
