# marketing.CAP.outreach_coverage_and_blind_spot_reporting — Outreach coverage and blind-spot reporting

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Marketing knows what it cannot see - which platforms have no verifier, which engagements only a human can enter, which leads cannot be attributed - so reach figures are read as samples rather than as totals.

**Built today:** absent. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- manager has not validated what coverage threshold makes a figure reportable

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Outreach coverage and blind-spot reporting
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.outreach_coverage_and_blind_spot_reporting`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** absent · **Source:** proposed_new
## The business outcome
Marketing knows what it cannot see - which platforms have no verifier, which engagements only a human can enter, which leads cannot be attributed - so reach figures are read as samples rather than as totals.
Intended users: Marketing manager, Executive, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Collect each module's own declared limit rather than re-deriving it
- Assemble them into one coverage statement for the period
- Label every reach and engagement figure with the share of the estate it actually covers
- List the blind spots by name, with the reason each exists
- Refuse to publish a total where only a sample is measurable
**Inputs**
- Per-platform verifier availability
- Per-platform engagement-read capability
- Identity-coverage figures for attribution
- Registry trust status per metric
**Outputs**
- A single coverage statement per reporting period
- A named blind-spot list
- Every reach and engagement figure labelled with the share of the estate it describes
**Exceptions that must be handled**
- Only two platforms have a comment verifier, so visibility elsewhere is unknown rather than confirmed
- Three of the highest-value platforms can only have engagements entered by a human, so their engagement figures are a floor
- Attribution coverage is limited by an identity link only wired on 2026-09-04
- Link health checking and QR support are declared absent in the tracked-link module itself
- This capability exists to stop a sample being read as a total; it adds no new measurement of its own
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- metric_registry_read
**Application surfaces**
- /admin/marketing
- /admin/marketing/performance
- GET /api/admin/marketing/overview
- GET /api/admin/marketing/needs-attention
**Source modules**
- backend/src/services/adminOs/metricRegistry.ts
- backend/src/services/marketing/needsAttentionService.ts
**Dependencies**
- marketing.outreach_post_verification
- marketing.engagement_monitoring_and_intent_scoring
- marketing.multi_touch_attribution
- marketing.campaign_and_channel_metric_reporting
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R9**.
Why that ceiling: A read-only assembly of limits the modules already declare, whose failure mode is understating confidence. It is the one proposed capability whose whole purpose is to make the rest of the domain honest, so operational ownership is appropriate.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R0)**
Defines what coverage means per surface and which figures may never be reported as totals.

Acceptance: Each surface has a written coverage definition and a named owner for its blind spot.
## Before you start
- manager has not validated what coverage threshold makes a figure reportable
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/openclaw/openclawCommentVerificationService.ts:103
- backend/src/services/agents/openclaw/openclawEngagementFetcher.ts:286
- backend/src/services/marketing/campaignAttributionService.ts:20
- backend/src/services/marketing/trackedLinkService.ts:16
- backend/src/services/adminOs/metricRegistry.ts:22
- frontend/src/pages/admin/marketing/marketingTrust.ts:3

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Each surface has a written coverage definition and a named owner for its blind spot.

When every box above is ticked, stop and show the demo.
