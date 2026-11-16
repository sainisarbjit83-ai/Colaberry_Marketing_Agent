# marketing.CAP.brand_attribution_of_campaigns — Brand attribution integrity for campaigns

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Every campaign resolves to a real brand at creation, so the brand dimension in every downstream report means something instead of collapsing into an Unattributed bucket.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Historic campaigns with a null brand cannot be back-assigned without a human decision
- manager has not validated brand ownership of existing campaigns

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Brand attribution integrity for campaigns
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.brand_attribution_of_campaigns`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** existing_application
## The business outcome
Every campaign resolves to a real brand at creation, so the brand dimension in every downstream report means something instead of collapsing into an Unattributed bucket.
Intended users: Marketing manager, Marketing AI employee, Executive.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Offer only the brands the operator is allowed to assign
- Resolve the requested brand to a real brand row
- Reject an unknown brand rather than storing a null
- Persist the resolved brand on the campaign
- Carry the brand through to the reporting dimension
**Inputs**
- A campaign creation request
- The set of brands the operator may assign to
**Outputs**
- A resolved brand_id on the campaign
- An invalid-brand rejection where the brand does not exist
- A brand dimension usable in reporting
**Exceptions that must be handled**
- A campaign created before this resolver existed may still carry a null brand, which reports as unresolved rather than being guessed
- The resolver rejects rather than defaulting, so an operator must choose
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- metric_registry_read
**Application surfaces**
- /admin/campaigns
- /admin/marketing/campaigns/:id
- GET /api/admin/campaigns/assignable-brands
- POST /api/admin/campaigns
**Source modules**
- backend/src/services/campaignBrandAssignment.ts
- backend/src/services/reporting/campaignBrandAttribution.ts
**Dependencies**
- marketing.brand_registry_and_readiness
- marketing.campaign_and_channel_metric_reporting
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R7**.
Why that ceiling: Resolution is a validation step with a clear refusal path. It can be owned for reporting integrity; assigning a brand to a campaign is an ownership decision a human makes, so the agent's role stops at resolving and reporting.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Reports which campaigns have no resolved brand.

Acceptance: Unresolved campaigns are listed individually; none is guessed into a brand.
## Before you start
- Historic campaigns with a null brand cannot be back-assigned without a human decision
- manager has not validated brand ownership of existing campaigns
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/campaignBrandAssignment.ts:57
- backend/src/services/campaignBrandAssignment.ts:116
- backend/src/services/campaignBrandAssignment.ts:27
- backend/src/services/reporting/campaignBrandAttribution.ts
- backend/src/routes/admin/campaignRoutes.ts:86
- table: campaigns
- table: brands

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Unresolved campaigns are listed individually; none is guessed into a brand.

When every box above is ticked, stop and show the demo.
