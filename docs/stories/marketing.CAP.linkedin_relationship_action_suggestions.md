# marketing.CAP.linkedin_relationship_action_suggestions — LinkedIn relationship action suggestions

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

A person working LinkedIn by hand is told exactly which comment to leave, which connection to request and which follow-up to send today, so relationship building is deliberate rather than whatever the feed surfaces.

**Built today:** partial. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Currently unwired: no scheduler entry, no importer, so the capability does not run at all
- live_email (a LinkedIn direct message is the same class of individual outbound)
- manager has not validated connection-request or direct-message policy

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# LinkedIn relationship action suggestions
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.linkedin_relationship_action_suggestions`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** partial · **Source:** inherited
## The business outcome
A person working LinkedIn by hand is told exactly which comment to leave, which connection to request and which follow-up to send today, so relationship building is deliberate rather than whatever the feed surfaces.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Select LinkedIn signals and high-intent engagers
- Suggest a comment for each relevant signal
- Suggest a connection request for each high-intent engager
- Suggest a direct-message follow-up where a conversation is already open
- Leave every suggestion pending for a human to execute or skip
**Inputs**
- Signals and engagement events on LinkedIn
- Per-run caps for comments, connections and direct messages
**Outputs**
- openclaw_linkedin_actions rows at status 'pending' for a human to execute
**Exceptions that must be handled**
- The module declares its actions are never auto-executed, and the capped counts exist to keep a day's suggestions humanly workable
- KNOWN STATE: the agent has no scheduler entry and no importer, so openclaw_linkedin_actions has no writer in production today - the read routes and the admin tab are fed by nothing
- Reinstating this must come with the human gate, not just a cron entry
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- llm_text_generation
- sandbox_database_write
**Application surfaces**
- /admin/intelligence (Outreach tab, LinkedIn Tools)
- GET /api/admin/openclaw/linkedin-actions
- POST /api/admin/openclaw/linkedin-actions/:id/complete
- POST /api/admin/openclaw/linkedin-actions/:id/skip
**Source modules**
- backend/src/services/agents/openclaw/openclawLinkedInFlowAgent.ts
**Dependencies**
- marketing.social_signal_discovery
- marketing.engagement_monitoring_and_intent_scoring
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R4**.
Why that ceiling: The suggestions include connection requests and direct messages to named individuals. Suggesting is safe; executing is a one-to-one approach under a real person's identity and stays a human action. The ceiling is stateful sandbox work until the gate is rebuilt.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R1)**
Rebuilt in isolation against recorded signal and engagement fixtures.

Acceptance: Every suggestion type is produced for its fixture; caps are asserted per type.
## Before you start
- Currently unwired: no scheduler entry, no importer, so the capability does not run at all
- live_email (a LinkedIn direct message is the same class of individual outbound)
- manager has not validated connection-request or direct-message policy
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/openclaw/openclawLinkedInFlowAgent.ts:15
- backend/src/services/agents/openclaw/openclawLinkedInFlowAgent.ts:65
- backend/src/services/agents/openclaw/openclawLinkedInFlowAgent.ts:193
- backend/src/services/agentRegistrySeed.ts:1585
- backend/src/routes/admin/openclawRoutes.ts:1915
- backend/src/routes/admin/openclawRoutes.ts:1934
- table: openclaw_linkedin_actions

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every suggestion type is produced for its fixture; caps are asserted per type.

When every box above is ticked, stop and show the demo.
