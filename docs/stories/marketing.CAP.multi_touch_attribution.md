# marketing.CAP.multi_touch_attribution — Multi-touch campaign attribution with honest coverage

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Credit for a lead is split across the touches that actually earned it, under a named model, with the identity coverage stated - so attribution describes the leads it can see rather than implying it saw them all.

**Built today:** partial. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Visitor-to-lead identity linking is partial, which caps how much of any campaign can be attributed
- manager has not chosen the attribution model marketing should report on

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Multi-touch campaign attribution with honest coverage
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.multi_touch_attribution`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** partial · **Source:** existing_application
## The business outcome
Credit for a lead is split across the touches that actually earned it, under a named model, with the identity coverage stated - so attribution describes the leads it can see rather than implying it saw them all.
Intended users: Marketing manager, Marketing AI employee, Executive.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Gather touchpoints for each of the campaign's leads from linked visitor sessions
- Run the chosen model over the touchpoints in the pure model layer
- Aggregate credits and verify the sum
- Report the share of leads that could be attributed at all
- Describe the result as covering the attributed minority where coverage is low
**Inputs**
- A campaign's leads
- Visitor sessions linked to those leads
- A chosen attribution model
**Outputs**
- Per-touch credit under the chosen model
- An aggregate whose sum is checkable
- An explicit identity-coverage figure
**Exceptions that must be handled**
- A lead can only be attributed if a visitor row links to it, and that link was only wired on 2026-09-04, so a campaign whose leads predate it has low coverage
- Coverage is reported rather than assumed - the registry marks the visitor-to-lead link as partial
- Every judgement about which touch gets credit lives in the pure model layer and is tested without a database
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- metric_registry_read
**Application surfaces**
- /admin/marketing/performance
- /admin/campaigns/:id
- GET /api/admin/campaigns/:id/attribution
- GET /api/admin/attribution/lead/:leadId
**Source modules**
- backend/src/services/marketing/campaignAttributionService.ts
- backend/src/services/marketing/attributionModels.ts
**Dependencies**
- marketing.campaign_and_channel_metric_reporting
- marketing.tracked_link_and_utm_governance
- Visitor-to-lead identity linking
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R7**.
Why that ceiling: Attribution is read-only and its coverage limit is already reported rather than hidden. Full ownership waits on identity coverage being good enough that the answer describes the campaign rather than a subset of it.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Answers which touches earned a given lead, under which model, with what coverage.

Acceptance: Coverage is always stated; an uncovered lead is reported as uncovered, never as direct.
## Before you start
- Visitor-to-lead identity linking is partial, which caps how much of any campaign can be attributed
- manager has not chosen the attribution model marketing should report on
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/marketing/campaignAttributionService.ts:14
- backend/src/services/marketing/campaignAttributionService.ts:20
- backend/src/services/marketing/campaignAttributionService.ts:27
- backend/src/services/marketing/attributionModels.ts:20
- backend/src/routes/admin/campaignIntelligenceRoutes.ts:100
- backend/src/routes/admin/campaignRoutes.ts:164
- table: campaign_leads
- table: visitors
- table: visitor_sessions

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Coverage is always stated; an uncovered lead is reported as uncovered, never as direct.

When every box above is ticked, stop and show the demo.
