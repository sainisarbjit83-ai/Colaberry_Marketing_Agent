# marketing.CAP.outreach_conversion_attribution — Social-outreach conversion attribution

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

When a social conversation turns into a real opportunity, the chain from first signal to that outcome is recorded - so the question 'does outreach work' has an answer with rows behind it.

**Built today:** partial. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- marketing.revenue_and_cost_metric_truthing must land before any monetary claim is reportable
- the public /i/:tag redirect is unauthenticated and spoofable
- manager has not validated what counts as a conversion

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Social-outreach conversion attribution
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.outreach_conversion_attribution`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** partial · **Source:** existing_application
## The business outcome
When a social conversation turns into a real opportunity, the chain from first signal to that outcome is recorded - so the question 'does outreach work' has an answer with rows behind it.
Intended users: Marketing manager, Marketing AI employee, Executive.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Find conversations that reached the last stage
- Confirm from the response queue that a call or link was genuinely offered
- Advance the conversation and create a revenue-opportunity row carrying the chain
- Separately, sweep for orphaned engagement events and attach them to their conversation
- Flag conversations stalled beyond 48 hours and re-score their lead
**Inputs**
- Conversations at the final conversion stage
- Whether a call or link was actually offered
- Short-link click events from /i/:tag
**Outputs**
- RevenueOpportunity rows with the attribution chain
- Repaired links for orphaned engagement events
- Stalled-conversation flags
**Exceptions that must be handled**
- A revenue opportunity here is a pipeline marker, not collected money - the standing rule that revenue means app-originated checkout only still applies
- The /i/:tag redirect is mounted unauthenticated by design, so click attribution is open to spoofing
- A conversation whose offer cannot be confirmed does not advance, which under-reports rather than over-reports
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- sandbox_database_write
- tracked_link_mint
**Application surfaces**
- /admin/intelligence (Outreach tab, Revenue)
- GET /api/admin/openclaw/revenue
- GET /api/admin/openclaw/conversations
- PUT /api/admin/openclaw/conversations/:id/stage
- GET /i/:tag
**Source modules**
- backend/src/services/agents/openclaw/openclawConversionDetectionAgent.ts
- backend/src/services/agents/openclaw/openclawConversationSyncAgent.ts
**Dependencies**
- marketing.engagement_monitoring_and_intent_scoring
- marketing.tracked_link_and_utm_governance
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R6**.
Why that ceiling: Attribution writes rows that executives read as performance. Because the click side is spoofable and the opportunity figure is a pipeline marker rather than cash, this is capped at a supervised production pilot until the money definition is settled by marketing.revenue_and_cost_metric_truthing.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Explains a single conversation's chain from signal to outcome.

Acceptance: Every hop in the chain resolves to a stored row; no stage is advanced.
## Before you start
- marketing.revenue_and_cost_metric_truthing must land before any monetary claim is reportable
- the public /i/:tag redirect is unauthenticated and spoofable
- manager has not validated what counts as a conversion
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/openclaw/openclawConversionDetectionAgent.ts:19
- backend/src/services/agents/openclaw/openclawConversationSyncAgent.ts:17
- backend/src/routes/openclawShortLinkRoutes.ts:26
- backend/src/routes/admin/openclawRoutes.ts:2076
- table: revenue_opportunities
- table: openclaw_conversations

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every hop in the chain resolves to a stored row; no stage is advanced.

When every box above is ticked, stop and show the demo.
