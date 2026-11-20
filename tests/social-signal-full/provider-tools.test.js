// Phase 1 software tests: provider interface, simulated provider, disabled real adapter, tool
// registry and the six tools. Software tests only, not a classification-quality evaluation.
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { req, freshDb } = require('./helpers');

const { SAMPLE_SIGNALS } = req('data/sample-signals');
const P = req('components/llm/provider');
const { ProviderDisabledError } = req('components/llm/disabled-real');
const { createLogger } = req('components/logger');
const g = req('components/guardrails');
const { createKnowledgeBase } = req('components/knowledge-base');
const { createRegistry, SchemaError } = req('components/tools/registry');
const { TOOLS } = req('components/tools');

const BUYING = ['S-001', 'S-002', 'S-005', 'S-011', 'S-013', 'S-014', 'S-020'];
const GENERAL = ['S-003', 'S-004', 'S-007', 'S-008', 'S-012', 'S-015', 'S-016'];
const NONE = ['S-006', 'S-010', 'S-017', 'S-018'];
const byId = Object.fromEntries(SAMPLE_SIGNALS.map((s) => [s.id, s]));

// ---------- Provider ----------
test('provider: simulated is the default and says it is not a real LLM', () => {
  const p = P.createProvider();
  const d = p.describe();
  assert.equal(P.DEFAULT_CONFIG.provider, 'simulated');
  assert.equal(d.kind, 'simulated');
  assert.equal(d.isRealLlm, false);
  assert.match(d.note, /does not interpret the system prompt like a real LLM/);
});

test('provider: every simulated output passes the interface check and its evidence check', () => {
  const p = P.createProvider();
  for (const r of SAMPLE_SIGNALS) {
    const c = P.validateOutput(p.classify(r));
    assert.equal(g.checkEvidence(c, r), true, r.id);
  }
});

test('provider: simulated classification is deterministic', () => {
  const p = P.createProvider();
  for (const r of SAMPLE_SIGNALS) assert.deepEqual(p.classify(r), p.classify(r));
});

test('provider: the demo-only rules place the 20 sample records in the designed categories', () => {
  const p = P.createProvider();
  const code = (id) => p.classify(byId[id]).code;
  for (const id of BUYING) assert.equal(code(id), 'buying', id);
  for (const id of GENERAL) assert.equal(code(id), 'general', id);
  for (const id of NONE) assert.equal(code(id), 'none', id);
});

test('provider: the real adapter is disabled and refuses even when enabling is requested', () => {
  for (const real of [{}, { enabled: true }]) {
    const p = P.createProvider({ provider: 'real', real });
    assert.equal(p.describe().enabled, false);
    assert.throws(() => p.classify(byId['S-001']), ProviderDisabledError);
  }
  assert.throws(() => P.createProvider({ provider: 'gpt' }), /Unknown provider/);
});

test('provider: validateOutput rejects malformed classifications', () => {
  const good = P.createProvider().classify(byId['S-001']);
  assert.throws(() => P.validateOutput(null), P.ProviderOutputError);
  assert.throws(() => P.validateOutput({ ...good, code: 'hot_lead' }), P.ProviderOutputError);
  assert.throws(() => P.validateOutput({ ...good, label: 'Verified buyer' }), P.ProviderOutputError);
  assert.throws(() => P.validateOutput({ ...good, rule_strength: 'certain' }), P.ProviderOutputError);
  assert.throws(() => P.validateOutput({ ...good, evidence: [{ field: 'author', text: 'x', start: 0, end: 1 }] }), P.ProviderOutputError);
  assert.throws(() => P.validateOutput({ ...good, reasoning: [] }), P.ProviderOutputError);
});

// ---------- Registry ----------
function setup() {
  const db = freshDb();
  const logger = createLogger(db);
  const registry = createRegistry({ logger, tools: TOOLS });
  const deps = { kb: createKnowledgeBase(db), provider: P.createProvider(), validateOutput: P.validateOutput, checkEvidence: g.checkEvidence };
  return { logger, registry, deps };
}

test('registry: lists the six tools, each with schemas and an allowed permission', () => {
  const { registry } = setup();
  const list = registry.list();
  assert.deepEqual(list.map((t) => t.name), ['retrieve', 'normalize', 'dedupe', 'rank', 'classify', 'report']);
  for (const t of list) {
    assert.ok(t.input && t.output, t.name);
    assert.ok(g.ALLOWED_ACTIONS.has(t.permission), t.name);
  }
});

test('registry: refuses unknown tools and tools with a blocked permission, and logs them', () => {
  const { logger } = setup();
  const rogue = { name: 'post', permission: 'publish_post', description: '', input: { type: 'object' }, output: { type: 'object' }, run: () => ({}) };
  const registry = createRegistry({ logger, tools: [...TOOLS, rogue] });
  assert.throws(() => registry.invoke('send_dm', {}, {}, 'R'), (e) => e.rule === 'unknown_tool');
  assert.throws(() => registry.invoke('post', {}, {}, 'R'), (e) => e.rule === 'blocked_action');
  assert.deepEqual(logger.read('R').map((r) => [r.event, r.outcome]), [['tool:send_dm', 'blocked'], ['tool:post', 'blocked']]);
});

test('registry: validates input and output against the schemas', () => {
  const { registry, deps, logger } = setup();
  assert.throws(() => registry.invoke('retrieve', {}, deps, 'R'), SchemaError);
  assert.throws(() => registry.invoke('retrieve', { terms: 'ai' }, deps, 'R'), SchemaError);
  assert.throws(() => registry.invoke('retrieve', { terms: Array(9).fill('ai') }, deps, 'R'), /more than 8/);
  assert.throws(() => registry.invoke('normalize', { records: [{ id: 'x' }] }, deps, 'R'), /required/);
  const broken = { ...TOOLS[1], name: 'broken', run: () => ({ nope: 1 }) };
  const reg2 = createRegistry({ logger, tools: [broken] });
  assert.throws(() => reg2.invoke('broken', { records: [] }, deps, 'R'), /output\.records is required/);
  assert.ok(logger.read('R').every((r) => r.outcome === 'failure' && r.error_class === 'SchemaError'));
});

// ---------- The six tools ----------
test('tools: retrieve -> normalize -> dedupe -> rank -> classify -> report, end to end', () => {
  const { registry, deps, logger } = setup();
  const terms = ['ai', 'training'];
  const { candidates } = registry.invoke('retrieve', { terms }, deps, 'R');
  assert.ok(candidates.length > 0);
  const { records } = registry.invoke('normalize', { records: candidates }, deps, 'R');
  assert.ok(records.every((r) => r.normalizedUrl && r.fingerprint));
  const { unique, duplicates } = registry.invoke('dedupe', { records }, deps, 'R');
  const { ranked } = registry.invoke('rank', { records: unique, terms }, deps, 'R');
  assert.deepEqual(ranked.map((r) => r.rank), ranked.map((_, i) => i + 1));
  const { classified } = registry.invoke('classify', { records: ranked }, deps, 'R');
  const rep = registry.invoke('report', { records: classified }, deps, 'R');
  assert.deepEqual(rep.citations, classified.map((r) => r.id));
  assert.match(rep.summary, /demo-only classifications on fictional data/);
  assert.equal(unique.length + duplicates.length, records.length);
  assert.ok(logger.read('R').every((r) => r.outcome === 'success'));
  assert.equal(logger.read('R').length, 6);
});

test('tools: dedupe removes repeated ids, same URLs and re-shared titles, with the reason', () => {
  const { registry, deps } = setup();
  const pick = ['S-001', 'S-005', 'S-001', 'S-009', 'S-019'].map((id) => byId[id]);
  const { unique, duplicates } = registry.invoke('dedupe', { records: pick }, deps);
  assert.deepEqual(unique.map((r) => r.id), ['S-001', 'S-005']);
  assert.deepEqual(duplicates.map((d) => [d.id, d.duplicateOf, d.kind]), [
    ['S-001', 'S-001', 'repeated_id'], ['S-009', 'S-001', 'same_url'], ['S-019', 'S-005', 'same_title'],
  ]);
});

test('tools: rank prefers more matched terms, then score, then newer date, then id', () => {
  const { registry, deps } = setup();
  const recs = [
    { id: 'A', platform: 'Reddit', title: 'llm notes', excerpt: '', topic: '', url: 'u1', post_date: '2026-01-01' },
    { id: 'B', platform: 'Reddit', title: 'llm budget', excerpt: '', topic: '', url: 'u2', post_date: '2026-01-01' },
    { id: 'C', platform: 'Reddit', title: 'llm notes', excerpt: '', topic: '', url: 'u3', post_date: '2026-02-01' },
    { id: 'D', platform: 'Reddit', title: 'cooking', excerpt: '', topic: '', url: 'u4', post_date: '2026-03-01' },
  ];
  const { ranked } = registry.invoke('rank', { records: recs, terms: ['llm', 'budget'] }, deps);
  assert.deepEqual(ranked.map((r) => r.id), ['B', 'C', 'A']);
  assert.equal(ranked[0].phraseMatch, 'title');
});

test('tools: classify rejects a provider whose evidence is not in the record', () => {
  const { registry, deps } = setup();
  const liar = { classify: () => ({ code: 'buying', label: P.LABELS.buying, rule_strength: 'strong', evidence: [{ field: 'title', text: 'budget approved', start: 0, end: 15 }], reasoning: ['made up'] }) };
  assert.throws(() => registry.invoke('classify', { records: [byId['S-006']] }, { ...deps, provider: liar }), (e) => e.rule === 'invalid_evidence');
});

test('tools: classify with the disabled real provider fails safely and is logged', () => {
  const { registry, deps, logger } = setup();
  const real = P.createProvider({ provider: 'real', real: { enabled: true } });
  assert.throws(() => registry.invoke('classify', { records: [byId['S-001']] }, { ...deps, provider: real }, 'R'), ProviderDisabledError);
  assert.equal(logger.read('R')[0].error_class, 'ProviderDisabledError');
});

test('tools: every tool is idempotent (same input, same output)', () => {
  const { registry, deps } = setup();
  const run = () => {
    const { candidates } = registry.invoke('retrieve', { terms: ['ai', 'team'] }, deps);
    const { records } = registry.invoke('normalize', { records: candidates }, deps);
    const { unique } = registry.invoke('dedupe', { records }, deps);
    const { ranked } = registry.invoke('rank', { records: unique, terms: ['ai', 'team'] }, deps);
    const { classified } = registry.invoke('classify', { records: ranked }, deps);
    return registry.invoke('report', { records: classified }, deps);
  };
  assert.deepEqual(run(), run());
});
