# marketing.CAP.marketing_agent_management_and_oversight — Manager oversight of the marketing AI employee

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

The accountable human can actually manage the marketing AI employee - set restrictions, agree goals, hold a one-to-one, approve what it learns, and receive reports - rather than only reading about it.

**Built today:** partial. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- No marketing AI employee exists: agent_id is null for this domain
- reports_to must point at this manager before he can reach the surface at all
- no per-manager timezone field exists, so a scheduled report cannot be timezone-safe
- manager has not validated any of his own oversight procedures

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Manager oversight of the marketing AI employee
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.marketing_agent_management_and_oversight`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** partial · **Source:** manager_defined
## The business outcome
The accountable human can actually manage the marketing AI employee - set restrictions, agree goals, hold a one-to-one, approve what it learns, and receive reports - rather than only reading about it.
Intended users: Marketing manager, Executive.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Resolve the calling admin to an org-member record by email
- Walk the agent's reports-to chain to confirm this human is actually upstream of it
- Let the manager author restriction-only directives, injected into runtime context and never written into the base prompt
- Let him set goals, hold one-to-ones and decide memory proposals from his inbox
- Let him subscribe to a report about the employee
**Inputs**
- The manager's admin login matched to his org-member record by email
- A reports-to chain from the agent up to him
- His own restrictions, goals and decisions
**Outputs**
- Versioned, restriction-only directives injected at runtime
- Agreed goals with real progress or an explicit unmeasured state
- One-to-one records and outcomes
- Approved or rejected memory proposals
- A report subscription
**Exceptions that must be handled**
- This manager has an admin login, which is why his domain is one of the six measured as reachable - but the authorization middleware went live on 2026-08-27 and a live check confirmed he receives a 403 for an agent not in his reporting chain, so the marketing AI employee must have reports_to pointing at him before he can manage it
- No marketing AI employee exists yet: the domain's agent_id is null in the verified registry, so there is nothing to manage today
- Manager instructions may only restrict, never expand authority
- A goal with no real metric behind it must render as unmeasured rather than a fabricated number
- A report subscription cannot be timezone-safe until a per-manager timezone field exists, which it does not
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- manager_directive_read
**Application surfaces**
- /admin/agents/:id (Agent Detail and Talk)
- GET /api/admin/agents/:id/directives
- POST /api/admin/agents/:id/directives
- GET /api/admin/agents/:id/goals
- POST /api/admin/agents/:id/one-on-ones
- GET /api/admin/agents/:id/inbox
- POST /api/admin/agents/:id/inbox/:proposalId/approve
- PUT /api/admin/agents/:id/charter
- POST /api/admin/agents/:id/report-subscriptions
**Source modules**
- backend/src/middlewares/agentManagerAuthMiddleware.ts
- backend/src/services/orgChartHierarchyService.ts
**Dependencies**
- A marketing AI employee existing at all
- reports_to pointing at this manager
- marketing.manager_marketing_brief_subscription
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R2**.
Why that ceiling: Management is the human's side of the relationship by definition. The agent may read and obey its own directives and explain its own state; authoring a restriction, setting a goal or approving a memory is the manager's act at every level.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R2)**
Explains its own charter, current directives, goals and open proposals.

Acceptance: Every statement resolves to a stored record; a goal with no backing metric reports unmeasured, never a number.
## Before you start
- No marketing AI employee exists: agent_id is null for this domain
- reports_to must point at this manager before he can reach the surface at all
- no per-manager timezone field exists, so a scheduled report cannot be timezone-safe
- manager has not validated any of his own oversight procedures
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/middlewares/agentManagerAuthMiddleware.ts:50
- backend/src/routes/admin/managerDirectiveRoutes.ts:12
- backend/src/routes/admin/agentGoalRoutes.ts:11
- backend/src/routes/admin/agentOneOnOneRoutes.ts:11
- backend/src/routes/admin/agentMemoryProposalRoutes.ts:17
- backend/src/routes/admin/agentReportSubscriptionRoutes.ts:17
- backend/src/routes/admin/agentRoleCharterRoutes.ts:13
- backend/src/routes/admin/managerInboxRoutes.ts:17
- docs/architecture/ai-workforce-management/MANAGER_AUTHORIZATION_MAP.md
- docs/architecture/ai-workforce-management/DOMAIN_REUSE_MAP.md
- docs/sessions/CC-20260818-x4nk.md:33
- docs/sessions/CC-20260818-x4nk.md:35
- .loop-architect/runs/20261007-school-agent-factory/verified-domain-registry.json

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every statement resolves to a stored record; a goal with no backing metric reports unmeasured, never a number.

When every box above is ticked, stop and show the demo.
