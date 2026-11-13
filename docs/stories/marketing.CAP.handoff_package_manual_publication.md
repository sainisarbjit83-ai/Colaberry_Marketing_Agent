# marketing.CAP.handoff_package_manual_publication — Handoff package publication by a person

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Until a network's app is approved and switched on, the platform still does all the work and a person does the last click - so publishing is never blocked on an app review.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Publishing externally remains a human decision
- manager has not validated who owns the handoff queue day to day

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Handoff package publication by a person
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.handoff_package_manual_publication`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** manager_defined
## The business outcome
Until a network's app is approved and switched on, the platform still does all the work and a person does the last click - so publishing is never blocked on an app review.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Read the handoff package for the due post
- Publish it by hand on the network
- Return and mark the publication handoff-complete with its permalink
- Leave the receipt so the calendar and the reporting agree with reality
- Watch the Overview's handoff line to know which networks still need this
**Inputs**
- A minted handoff package carrying the exact post content per network
- The operator's own network session
**Outputs**
- A published post made by a person
- A handoff-complete record carrying the real permalink
**Exceptions that must be handled**
- A package nobody confirms stays unconfirmed; the platform does not assume a handoff was published
- Even where an adapter exists, a provider not named in the live-connector switch still hands off, so the handoff count is a configuration fact rather than a capability gap
- The permalink is what makes the published post reconcilable later
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- publishing_handoff_package_mint
**Application surfaces**
- /admin/marketing/publishing
- /admin/marketing
- GET /api/admin/publishing/publications
- POST /api/admin/publishing/publications/:id/handoff-complete
**Source modules**
- backend/src/services/publishing/handoffAdapter.ts
- backend/src/services/publishing/publishingReceiptService.ts
**Dependencies**
- marketing.brand_social_publishing
- marketing.publishing_failure_and_handoff_recovery
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R4**.
Why that ceiling: Minting the package is fully automatable and is the point of the design. Publishing it and asserting that it was published are both human acts, so the agent's ceiling is producing and tracking packages in a sandbox-provable way.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R2)**
Answers which networks still hand off and what is waiting for a person.

Acceptance: The handoff list matches the live-connector configuration; no package is marked complete.
## Before you start
- Publishing externally remains a human decision
- manager has not validated who owns the handoff queue day to day
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- docs/marketing/CONNECT_NETWORKS.md:9
- docs/marketing/CONNECT_NETWORKS.md:12
- backend/src/services/publishing/handoffAdapter.ts
- backend/src/services/publishing/adapterRegistry.ts:17
- backend/src/services/marketing/overviewSummary.ts:199
- backend/src/routes/admin/publishingRoutes.ts:120
- table: external_publications

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] The handoff list matches the live-connector configuration; no package is marked complete.

When every box above is ticked, stop and show the demo.
