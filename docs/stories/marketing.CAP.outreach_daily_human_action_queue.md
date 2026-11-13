# marketing.CAP.outreach_daily_human_action_queue — Daily human outreach action queue

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

The person doing outreach opens one ordered list of what to do today, with the reason attached, instead of deciding from a dashboard of counters.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Priority weights are not manager-configurable
- manager has not validated how the day should be ordered

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Daily human outreach action queue
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.outreach_daily_human_action_queue`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** existing_application
## The business outcome
The person doing outreach opens one ordered list of what to do today, with the reason attached, instead of deciding from a dashboard of counters.
Intended users: Marketing manager, Marketing AI employee, Executive.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Compute urgency per open thread
- Compute an action priority from urgency and stage
- Detect hesitation and readiness signals in the conversation
- Classify each item into an action type
- Return one ordered queue, computed fresh, writing nothing
**Inputs**
- Open conversations with their stage and intent
- Pending drafts, suggestions and approvals
- Urgency and hesitation signals
**Outputs**
- An ordered daily action queue with a priority and a stated reason per item
**Exceptions that must be handled**
- The service is pure computation and persists nothing, so the queue cannot go stale in storage
- Items whose underlying thread is resolved disappear from the next computation rather than needing to be cleared
- Priority weights are code constants
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
**Application surfaces**
- /admin/intelligence (Outreach tab)
- GET /api/admin/openclaw/actions/today
**Source modules**
- backend/src/services/agents/openclaw/openclawActionEngineService.ts
**Dependencies**
- marketing.engagement_monitoring_and_intent_scoring
- marketing.conversation_followup_sequencing
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R7**.
Why that ceiling: A read-only, write-nothing computation whose output is advice to a human. It can safely reach a scoped automation class; it never needs more, because the human is the actor.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Answers what to do first today and why.

Acceptance: Every item names the thread and the signal behind its priority; nothing is persisted.
## Before you start
- Priority weights are not manager-configurable
- manager has not validated how the day should be ordered
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/openclaw/openclawActionEngineService.ts:339
- backend/src/services/agents/openclaw/openclawActionEngineService.ts:64
- backend/src/services/agents/openclaw/openclawActionEngineService.ts:159
- backend/src/services/agents/openclaw/openclawActionEngineService.ts:252
- backend/src/routes/admin/openclawRoutes.ts:2159

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every item names the thread and the signal behind its priority; nothing is persisted.

When every box above is ticked, stop and show the demo.
