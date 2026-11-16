# marketing.CAP.outreach_learning_loop — Outreach performance learning loop

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

What actually earned replies last month changes what gets written and where it gets looked for next month, so outreach improves from evidence instead of opinion.

**Built today:** partial. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- No enforced approval marker on a learning before it steers scanning
- manager has not validated a minimum sample size or confidence floor

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Outreach performance learning loop
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.outreach_learning_loop`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** partial · **Source:** inherited
## The business outcome
What actually earned replies last month changes what gets written and where it gets looked for next month, so outreach improves from evidence instead of opinion.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Aggregate engagement outcomes by tone, posting time and topic across posted responses
- Write a learning row with its evidence, confidence and sample size
- Expose the learnings as keyword-priority and platform-frequency multipliers
- Let the discovery capability read those multipliers on its next tick
- Truncate the metric key safely rather than failing the write
**Inputs**
- Posted responses with their engagement outcomes
- Tone, timing and topic attributes per response
**Outputs**
- openclaw_learning rows carrying evidence, confidence and sample size
- Keyword and platform scan-priority multipliers
**Exceptions that must be handled**
- The model's `applied` flag is documented elsewhere in this repo as never set and never read for gating, so 'this learning changed behaviour' is not currently provable from the row itself (see DOMAIN_REUSE_MAP.md on OpenclawLearning)
- A learning drawn from a tiny sample still writes a row; the sample size is carried so a reader can discount it
- Platforms with manual-entry-only engagement under-contribute to the learning set
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- sandbox_database_write
- metric_registry_read
**Application surfaces**
- /admin/intelligence (Outreach tab, Dashboard)
- GET /api/admin/openclaw/learnings
**Source modules**
- backend/src/services/agents/openclaw/openclawLearningOptimizationAgent.ts
- backend/src/services/agents/openclaw/openclawSignalScaler.ts
**Dependencies**
- marketing.engagement_monitoring_and_intent_scoring
- marketing.social_signal_discovery
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R7**.
Why that ceiling: Deriving a learning is read-only aggregation. It is held at a scoped automation class because the loop silently steers where the scanner looks, and until an applied/approved marker is actually read, nobody can audit which learning changed behaviour.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Explains which tone and timing performed best, with the sample behind each claim.

Acceptance: Every claim reports its sample size; a thin sample is labelled as such, never rounded into a recommendation.
## Before you start
- No enforced approval marker on a learning before it steers scanning
- manager has not validated a minimum sample size or confidence floor
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/openclaw/openclawLearningOptimizationAgent.ts:19
- backend/src/services/agents/openclaw/openclawLearningOptimizationAgent.ts:31
- backend/src/services/agents/openclaw/openclawSignalScaler.ts:72
- backend/src/services/aiOpsScheduler.ts:252
- table: openclaw_learning
- table: openclaw_responses

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every claim reports its sample size; a thin sample is labelled as such, never rounded into a recommendation.

When every box above is ticked, stop and show the demo.
