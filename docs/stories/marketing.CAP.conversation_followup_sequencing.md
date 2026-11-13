# marketing.CAP.conversation_followup_sequencing — Stalled-conversation follow-up drafting

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

A high-intent conversation that went quiet gets one considered, stage-aware nudge instead of being forgotten or chased repeatedly.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Follow-up cadence and stall thresholds are code config, not manager policy
- manager has not validated how persistently a prospect may be followed up

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Stalled-conversation follow-up drafting
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.conversation_followup_sequencing`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** inherited
## The business outcome
A high-intent conversation that went quiet gets one considered, stage-aware nudge instead of being forgotten or chased repeatedly.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Build the conversation chain for a newly engaged thread and detect its conversion stage
- Generate a stage-appropriate follow-up draft into the response queue
- Separately, expire response-queue drafts that have gone stale
- Find conversations stalled beyond the threshold at a hot or warm tier
- Draft a subtle follow-up for each, capped per run
**Inputs**
- New high-intent engagement events
- Conversations stalled past the configured hours at stage >= 2
- Conversion-stage prompt set
- Per-run follow-up cap
**Outputs**
- openclaw_response_queue draft rows
- Expired stale drafts
- A recorded conversion stage per conversation
**Exceptions that must be handled**
- Both agents write drafts only; neither sends
- The per-run cap means a backlog is worked down over days rather than in one burst
- A draft that expires is not regenerated automatically
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- llm_text_generation
- read_marketing_database
- content_item_draft_write
**Application surfaces**
- /admin/intelligence (Outreach tab, Task Queue)
- GET /api/admin/openclaw/conversations/:id
- POST /api/admin/openclaw/response-queue/:id/approve
- POST /api/admin/openclaw/response-queue/:id/reject
- POST /api/admin/openclaw/response-queue/:id/mark-posted
**Source modules**
- backend/src/services/agents/openclaw/openclawResponseOrchestratorAgent.ts
- backend/src/services/agents/openclaw/openclawFollowUpAgent.ts
**Dependencies**
- marketing.engagement_monitoring_and_intent_scoring
- LLM provider availability
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R7**.
Why that ceiling: Drafting a follow-up is reversible and the queue is human-approved before anything is posted. The ceiling stays below full ownership because the cadence rules decide how often a real person is contacted, and no manager has set them.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Reports which conversations are stalled and at what stage, from stored state.

Acceptance: Stage and stall age reproduce from openclaw_conversations; no draft is written.
## Before you start
- Follow-up cadence and stall thresholds are code config, not manager policy
- manager has not validated how persistently a prospect may be followed up
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/openclaw/openclawResponseOrchestratorAgent.ts:16
- backend/src/services/agents/openclaw/openclawFollowUpAgent.ts:17
- backend/src/services/agents/openclaw/openclawPlatformStrategy.ts:218
- backend/src/services/agents/openclaw/openclawPlatformStrategy.ts:411
- backend/src/services/agentRegistrySeed.ts:1570
- table: openclaw_response_queue

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Stage and stall age reproduce from openclaw_conversations; no draft is written.

When every box above is ticked, stop and show the demo.
