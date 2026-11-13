# marketing.CAP.agent_write_authorization_enforcement — Enforcing agent write authorization on marketing agents

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

The permission tiers the platform already declares for marketing agents actually gate their writes, instead of describing a policy nothing checks.

**Built today:** absent. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Enforcement will break currently-working writes and must be staged
- deciding each agent's tier is an authority decision, not an implementation one
- manager has not validated any marketing agent's write scope

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Enforcing agent write authorization on marketing agents
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.agent_write_authorization_enforcement`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** absent · **Source:** proposed_new
## The business outcome
The permission tiers the platform already declares for marketing agents actually gate their writes, instead of describing a policy nothing checks.
Intended users: Marketing manager, Executive, Marketing AI employee, Security owner.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Enumerate every write a marketing-domain agent performs
- Route each through the tier check rather than straight to the model layer
- Classify any agent with no declared tier, rather than relying on the suggest-only default silently
- Record an audit row for every attempt, including refusals
- Add a test that fails if any marketing agent can write outside its declared allowlist
**Inputs**
- The declared tier per marketing agent
- Every write path those agents actually take
- The default suggest-only tier for unclassified agents
**Outputs**
- Marketing agent writes routed through the tier check
- An audit row per write attempt, allowed or refused
- A test that fails if a marketing agent can write outside its allowlist
**Exceptions that must be handled**
- The service's own tier table lists no OpenClaw or Skool agent at all, so every one of them falls to the unclassified default - which is declared suggest-only while they in fact write signals, responses, tasks, sessions and learnings directly
- The only enforcement point outside the service is the workforce runtime, which is why the one marketing agent genuinely held at suggest-only is the workforce director
- Enforcing this will refuse writes that currently succeed, so it must be staged rather than switched on
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- repository_source_read
- agent_activity_log_write
- sandbox_database_write
**Application surfaces**
- /admin/trust-center
- /admin/agents/:id
- GET /api/admin/agents/:id/effective-access
**Source modules**
- backend/src/services/agentPermissionService.ts
- backend/src/services/agentAuthorizationService.ts
**Dependencies**
- marketing.outreach_queue_supervision
- marketing.outreach_reply_drafting
- marketing.social_signal_discovery
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R4**.
Why that ceiling: Discovering and proving the gap is agent work. Deciding what each agent is permitted to write is an authority decision, and switching enforcement on will refuse writes that currently work, so both stay human.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R1)**
Enumerates every marketing-agent write and its declared tier, in isolation.

Acceptance: The enumeration is complete against a source sweep; an agent with no declared tier is named, not defaulted silently.
## Before you start
- Enforcement will break currently-working writes and must be staged
- deciding each agent's tier is an authority decision, not an implementation one
- manager has not validated any marketing agent's write scope
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agentPermissionService.ts:36
- backend/src/services/agentPermissionService.ts:96
- backend/src/services/agentPermissionService.ts:99
- backend/src/services/agentPermissionService.ts:120
- backend/src/services/workforce/workforceAgentRuntime.ts
- backend/src/services/agentAutonomy.ts:18

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] The enumeration is complete against a source sweep; an agent with no declared tier is named, not defaulted silently.

When every box above is ticked, stop and show the demo.
