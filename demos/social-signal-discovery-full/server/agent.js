/*
 * Wires the components into one local agent. Fictional data and the local SQLite file only.
 *
 *   const agent = createAgent({ db });
 *   const trace = agent.run({ question: 'Who is looking for AI training?' });
 *   agent.review.decide(trace.results[0].resultId, { decision: 'approve', note: '...', reviewer: '...' });
 */
'use strict';

const { createLogger } = require('./components/logger');
const { createKnowledgeBase } = require('./components/knowledge-base');
const { createRegistry } = require('./components/tools/registry');
const { TOOLS } = require('./components/tools');
const { createMemory } = require('./components/memory');
const { createReview } = require('./components/review');
const { loadSystemPrompt, traceView } = require('./components/system-prompt');
const { createProvider, DEFAULT_CONFIG } = require('./components/llm/provider');
const { createOrchestrator } = require('./components/orchestrator');
const { createEvaluator } = require('./evaluation/evaluator');
const { runSoftwareChecks } = require('./evaluation/software-checks');

function createAgent({ db, clock = () => new Date(), providerConfig = DEFAULT_CONFIG, systemPromptFile, tools = TOOLS, benchmarkFile } = {}) {
  if (!db) throw new TypeError('createAgent needs a database from db.open().');
  const logger = createLogger(db, clock);
  const kb = createKnowledgeBase(db);
  const registry = createRegistry({ logger, tools });
  const memory = createMemory(db, clock);
  const review = createReview(db, { memory, logger, clock });
  const systemPrompt = loadSystemPrompt(systemPromptFile);
  const provider = createProvider(providerConfig);
  const orchestrator = createOrchestrator({ db, logger, registry, kb, memory, review, systemPrompt, provider, clock });
  // Software checks build their own throwaway agents on in-memory databases (default provider).
  const evaluator = createEvaluator({ db, provider, systemPrompt, logger, clock, benchmarkFile, runChecks: () => runSoftwareChecks(createAgent) });
  return {
    run: orchestrator.run,
    evaluation: { run: evaluator.evaluate, list: evaluator.list, get: evaluator.get },
    review,
    memory,
    systemPrompt: () => traceView(systemPrompt, provider.describe()),
    provider: () => provider.describe(),
    tools: () => registry.list(),
    logs: (runId) => logger.read(runId),
    log: (entry) => logger.log(entry),
    knowledgeBase: () => kb.all(),
  };
}

module.exports = { createAgent };
