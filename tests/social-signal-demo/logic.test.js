// Logic tests for the Social Signal Discovery demo (demos/social-signal-discovery/js), in Node.
// The modules are plain browser scripts; they only touch the DOM in app.js, which is not loaded here.
const fs = require('fs');
const path = require('path');
const REPO = process.env.CC_REPO || path.resolve(__dirname, '..', '..');
const JS = path.join(REPO, 'demos/social-signal-discovery/js');
const MODULES = ['sample-data.js', 'dedupe.js', 'retrieval.js', 'classify.js', 'pipeline.js'];
global.window = global;
for (const f of MODULES) eval(fs.readFileSync(path.join(JS, f), 'utf8'));

let pass = 0, fail = 0;
function t(label, cond) { cond ? pass++ : fail++; console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}`); }
const ids = (out) => out.results.map((r) => r.id);

// Sample data is labeled and fictional.
t('every sample record is marked sample and uses an example.com placeholder URL',
  SSD.SAMPLE_RECORDS.every((r) => r.sample === true && /example\.com\/sample\//i.test(r.url)));
t('no sample record names an author', SSD.SAMPLE_RECORDS.every((r) => !('author' in r)));

// Duplicate detection.
t('normalizeUrl ignores case, www, query string, fragment and trailing slash',
  SSD.dedupe.normalizeUrl('HTTPS://WWW.Example.com/sample/SAMPLE-001/?utm_source=share#top') === 'https://example.com/sample/SAMPLE-001');
const d = SSD.dedupe.unique(SSD.SAMPLE_RECORDS);
t('two duplicates found in the sample (12 in, 10 unique)', SSD.SAMPLE_RECORDS.length === 12 && d.unique.length === 10 && d.duplicates.length === 2);
t('SAMPLE-009 is a duplicate of SAMPLE-001 by normalized URL',
  d.duplicates.some((x) => x.id === 'SAMPLE-009' && x.duplicateOf === 'SAMPLE-001' && x.reason === 'same normalized URL'));
t('the repeated SAMPLE-002 is a duplicate by record id',
  d.duplicates.some((x) => x.id === 'SAMPLE-002' && x.reason === 'same record id'));
t('duplicate kinds: SAMPLE-002 is "repeated_id", SAMPLE-009 is "same_url"',
  d.duplicates.find((x) => x.id === 'SAMPLE-002').kind === 'repeated_id' && d.duplicates.find((x) => x.id === 'SAMPLE-009').kind === 'same_url');
t('unique records have unique ids', new Set(d.unique.map((r) => r.id)).size === d.unique.length);
t('empty or missing input gives no records and no duplicates', SSD.dedupe.unique([]).unique.length === 0 && SSD.dedupe.unique(null).unique.length === 0);

// Classification: all three categories, each with a reason.
const cls = (id) => SSD.classify.classify(d.unique.find((r) => r.id === id));
t('SAMPLE-001 is a potential enterprise AI buying signal', cls('SAMPLE-001').code === 'buying');
t('SAMPLE-005 and SAMPLE-011 are potential buying signals', cls('SAMPLE-005').code === 'buying' && cls('SAMPLE-011').code === 'buying');
t('SAMPLE-003 (personal hobby project) is general AI interest', cls('SAMPLE-003').code === 'general');
t('SAMPLE-006 (sourdough) is not relevant', cls('SAMPLE-006').code === 'none');
t('every classification has a label from the three allowed and a non-empty reason',
  d.unique.every((r) => { const c = SSD.classify.classify(r); return Object.values(SSD.classify.LABELS).includes(c.label) && c.reason.length > 10; }));

// Retrieval and the pipeline: happy path.
const ai = SSD.pipeline.run('AI training');
t('"AI training" succeeds with results', ai.ok && ai.results.length > 0);
t('"AI training" finds the training-related buying signals SAMPLE-001 and SAMPLE-005', ai.ok && ids(ai).includes('SAMPLE-001') && ids(ai).includes('SAMPLE-005'));
t('results are ordered by terms matched, then score', ai.ok && ai.results.every((r, i, a) => i === 0
  || a[i - 1].matchedTerms.length > r.matchedTerms.length
  || (a[i - 1].matchedTerms.length === r.matchedTerms.length && a[i - 1].score >= r.score)));
t('"AI training": SAMPLE-001 first (its topic is exactly "ai-training"), then SAMPLE-005',
  ai.ok && ai.results[0].id === 'SAMPLE-001' && ai.results[0].phraseMatch === 'topic' && ai.results[1].id === 'SAMPLE-005');

// Improvement 2: relevance. Records matching more terms rank first; a generic word does not dominate.
const lead = SSD.pipeline.run('AI leadership');
const rank = (o, id) => ids(o).indexOf(id);
t('"AI leadership": SAMPLE-005 first, with the full phrase matching its topic', lead.ok && lead.results[0].id === 'SAMPLE-005' && lead.results[0].phraseMatch === 'topic');
t('"AI leadership": SAMPLE-002 (matches both terms) ranks second', lead.ok && lead.results[1].id === 'SAMPLE-002' && lead.results[1].matchedTerms.length === 2);
t('"AI leadership": every record matching both terms ranks above every record matching only "ai"',
  lead.ok && lead.results.filter((r) => r.matchedTerms.length === 2).every((two) => lead.results.filter((r) => r.matchedTerms.length === 1).every((one) => rank(lead, two.id) < rank(lead, one.id))));
t('"AI leadership": the generic AI product launch (SAMPLE-008) is kept but ranks below SAMPLE-002',
  lead.ok && rank(lead, 'SAMPLE-008') > rank(lead, 'SAMPLE-002') && rank(lead, 'SAMPLE-008') !== -1);
t('"AI leadership": no record matching a term is dropped (5 records match "ai" or "leadership")', lead.ok && lead.results.length === 5);
t('equal scores break ties by newest date: SAMPLE-008 (Nov 3) before SAMPLE-001 (Nov 2)',
  lead.ok && lead.results.find((r) => r.id === 'SAMPLE-008').score === lead.results.find((r) => r.id === 'SAMPLE-001').score && rank(lead, 'SAMPLE-008') < rank(lead, 'SAMPLE-001'));
// A rare word outweighs a common one: in this set "ai" appears in every record, "leadership" in one.
const mk = (id, title) => ({ id, platform: 'Reddit', date: '2026-11-01', topic: 'x', title, excerpt: 'notes', url: `https://example.com/sample/${id}`, sample: true });
const rare = SSD.retrieval.search([mk('T-1', 'ai ai'), mk('T-2', 'ai leadership'), mk('T-3', 'ai tools'), mk('T-4', 'ai news')], 'leadership ai');
t('a record matching both terms outranks records matching only the common word "ai"', rare[0].record.id === 'T-2' && rare[0].matched.length === 2);
const single = SSD.retrieval.search([mk('T-1', 'ai budget'), mk('T-2', 'leadership budget'), mk('T-3', 'ai plans'), mk('T-4', 'ai notes')], 'ai leadership');
t('a rare word counts for more than a common one: with one term each, the "leadership" record outranks the "ai" records', single[0].record.id === 'T-2');
t('ranking is deterministic: the same query twice gives identical results', JSON.stringify(SSD.pipeline.run('AI leadership')) === JSON.stringify(SSD.pipeline.run('AI leadership')));
t('classification is independent of rank: each result matches classify() on its own record',
  lead.ok && lead.results.every((r) => r.classification.code === SSD.classify.classify(SSD.SAMPLE_RECORDS.find((s) => s.id === r.id && s.url === r.url)).code));
t('results contain no duplicate records (no SAMPLE-009)', ai.ok && !ids(ai).includes('SAMPLE-009') && new Set(ids(ai)).size === ai.results.length);
t('every result carries its sample id, platform, title, excerpt, classification and reason',
  ai.ok && ai.results.every((r) => /^SAMPLE-\d{3}$/.test(r.id) && r.platform && r.title && r.excerpt && r.classification.label && r.classification.reason));
t('guardrails pass and every cited id exists in the sample dataset',
  ai.ok && ai.guardrails.pass && ai.results.every((r) => SSD.SAMPLE_RECORDS.some((s) => s.id === r.id)));
t('the run trace lists the six fixed steps in order',
  ai.ok && ai.trace.map((s) => s.name).join('|') === 'Validate query|Deduplicate|Retrieve|Classify|Guardrail checks|Present results');

// Idempotency: the same query twice gives the same results in the same order.
t('running the same query twice returns identical results', JSON.stringify(SSD.pipeline.run('governance')) === JSON.stringify(SSD.pipeline.run('governance')));

// Boundaries and failure paths.
t('a query matching nothing succeeds with zero results', (() => { const o = SSD.pipeline.run('quantum knitting'); return o.ok && o.results.length === 0; })());
t('an empty query is rejected with a clear message', (() => { const o = SSD.pipeline.run('   '); return !o.ok && /Enter a topic or keyword/.test(o.error); })());
t('a non-text query is rejected', (() => { const o = SSD.pipeline.run(42); return !o.ok && /must be text/.test(o.error); })());
t('a query of stop words only is rejected', (() => { const o = SSD.pipeline.run('the and of'); return !o.ok && /no searchable words/.test(o.error); })());
t('a query over 200 characters is rejected', (() => { const o = SSD.pipeline.run('a'.repeat(201)); return !o.ok && /under 200/.test(o.error); })());
t('a 200-character query is accepted', SSD.pipeline.run('ai '.repeat(66) + 'ai').ok);
t('the result limit is respected', (() => { const o = SSD.pipeline.run('ai', SSD.SAMPLE_RECORDS, 2); return o.ok && o.results.length <= 2; })());
t('a guardrail failure blocks results (a record not marked sample)', (() => {
  const o = SSD.pipeline.run('ai training', [{ id: 'X-1', platform: 'Reddit', title: 'AI training', excerpt: 'AI training', url: 'https://example.com/x', date: '2026-11-01' }]);
  return !o.ok && /guardrail check failed/.test(o.error);
})());

// Static check: no demo module contains network or storage code.
const NET = /\bfetch\s*\(|XMLHttpRequest|WebSocket|axios|navigator\.sendBeacon|EventSource|localStorage|sessionStorage|indexedDB|import\s*\(/;
const all = [...MODULES, 'app.js'].map((f) => [f, fs.readFileSync(path.join(JS, f), 'utf8')]);
t('no demo module contains network or browser-storage code', all.every(([, src]) => !NET.test(src)));

console.log(`\nsocial-signal demo logic checks: ${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
