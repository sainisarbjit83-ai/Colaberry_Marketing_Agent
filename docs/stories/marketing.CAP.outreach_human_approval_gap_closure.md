# marketing.CAP.outreach_human_approval_gap_closure — Closing the outreach human-approval bypasses

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Every public post made under the Colaberry name has a recorded human approval behind it, closing the two paths that currently publish without one.

**Built today:** absent. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Closing this reduces Skool posting volume until a human reviews, which is a manager trade-off
- a Skool review surface must be built, not just a state changed
- manager has not validated who reviews Skool content

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Closing the outreach human-approval bypasses
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.outreach_human_approval_gap_closure`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** absent · **Source:** proposed_new
## The business outcome
Every public post made under the Colaberry name has a recorded human approval behind it, closing the two paths that currently publish without one.
Intended users: Marketing manager, Executive, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Remove the inline self-approval from the content-response agent so it drafts only
- Stop the Skool quality gate converting its score into a publish authorisation
- Route Skool content to a human review state, and build the surface to review it on
- Make the approval endpoint the only writer of a posting task
- Add a test that fails if any other module can create one
**Inputs**
- The two bypassing code paths
- The existing approval endpoint as the single authorised gate
- The platform's own HITL rule
**Outputs**
- A single enforced path from draft to publication, through one human approval
- A Skool review surface, because none exists
- A test that fails if any module other than the approval endpoint can create a posting task
**Exceptions that must be handled**
- The quality-gate agent already carries a comment stating it must not auto-approve and auto-queue public posts - the Skool implementation does exactly that
- Both platform strategy modules declare Skool HUMAN_EXECUTION, so today's behaviour contradicts two declarations and the platform's HITL rule simultaneously
- There is no Skool admin screen anywhere in the frontend, so closing this gap requires building the review surface, not only a state change
- Closing it will stop Skool posting until a human reviews, which is a deliberate reduction in volume
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- repository_source_read
- sandbox_database_write
**Application surfaces**
- /admin/intelligence (Outreach tab)
- a Skool review screen that does not exist yet
- POST /api/admin/openclaw/responses/:id/approve
**Source modules**
- backend/src/services/agents/openclaw/openclawContentResponseAgent.ts
- backend/src/services/agents/skool/skoolQualityGateAgent.ts
- backend/src/services/agents/skool/skoolBrowserWorkerAgent.ts
**Dependencies**
- marketing.outreach_quality_gate
- marketing.outreach_reply_publication
- marketing.community_direct_message_response
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R4**.
Why that ceiling: The gap itself is a defect an agent can diagnose and fix in a sandbox with a protective test. The approval it restores is the human decision the whole domain rests on, so the agent never acquires that decision at any level.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R1)**
Reproduces both bypasses in isolation with failing tests.

Acceptance: Each test fails before the fix and passes after; removing the fix makes the named test die.
## Before you start
- Closing this reduces Skool posting volume until a human reviews, which is a manager trade-off
- a Skool review surface must be built, not just a state changed
- manager has not validated who reviews Skool content
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/openclaw/openclawContentResponseAgent.ts:134
- backend/src/services/agents/openclaw/openclawContentResponseAgent.ts:142
- backend/src/services/agents/skool/skoolQualityGateAgent.ts:273
- backend/src/services/agents/skool/skoolBrowserWorkerAgent.ts:71
- backend/src/services/agents/openclaw/openclawQualityGateAgent.ts:258
- backend/src/services/agents/skool/skoolPlatformStrategy.ts:12
- backend/src/services/agents/openclaw/openclawPlatformStrategy.ts:70
- backend/src/services/agentAutonomy.ts:123
- backend/src/routes/admin/openclawRoutes.ts:336

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Each test fails before the fix and passes after; removing the fix makes the named test die.

When every box above is ticked, stop and show the demo.
