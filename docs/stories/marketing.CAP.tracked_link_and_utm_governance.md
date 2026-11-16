# marketing.CAP.tracked_link_and_utm_governance — Tracked link, UTM taxonomy and traffic registration

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Every marketing link is minted under one taxonomy and registered to a campaign, and traffic arriving outside that scheme is flagged - so attribution has something to work with and untagged spend becomes visible.

**Built today:** partial. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Link health checking and QR support are not implemented in the tracked-link module
- manager has not validated the UTM taxonomy or what to do about flagged traffic

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Tracked link, UTM taxonomy and traffic registration
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.tracked_link_and_utm_governance`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** partial · **Source:** inherited
## The business outcome
Every marketing link is minted under one taxonomy and registered to a campaign, and traffic arriving outside that scheme is flagged - so attribution has something to work with and untagged spend becomes visible.
Intended users: Marketing manager, Marketing AI employee, Executive.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Validate the destination against the linkable-hostname rules, which is the security-critical half and is pure
- Apply UTM parameters from the shared taxonomy rather than per-caller invention
- Allocate a short code, handling collisions
- Show the composed link for an operator to approve before it is committed
- Every two hours, flag inbound traffic that arrived without a registered campaign tag
**Inputs**
- A destination URL and a campaign
- The UTM source, medium and campaign vocabulary
- Inbound traffic with and without recognised tags
**Outputs**
- A validated destination and a short code
- A composed preview an operator approves before committing
- A flagged list of unregistered traffic
- A bot-versus-human verdict per click
**Exceptions that must be handled**
- Link health checking and QR generation are explicitly NOT implemented in the tracked-link module, and it says so rather than leaving it to be discovered - there is no persisting create path either, only preview and allocation
- Click classification separates bot from human, so a crawler cannot inflate a channel
- Unregistered traffic is flagged, not blocked - the enforcement is visibility
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- tracked_link_mint
- metric_registry_read
**Application surfaces**
- /admin/marketing/performance
- /admin/campaigns/:id
- /admin/marketing (unregistered traffic)
- GET /api/admin/marketing/unregistered-traffic
- GET /api/admin/campaigns/:id/tracking-link
- POST /api/admin/campaigns/:id/generate-link
- GET /api/admin/qr-codes
- GET /api/admin/qr-codes/:slug
**Source modules**
- backend/src/services/campaignLinkService.ts
- backend/src/services/marketing/trackedLinkService.ts
- backend/src/services/marketing/trackedLinkDestination.ts
- backend/src/services/marketing/marketingTaxonomyService.ts
**Dependencies**
- marketing.multi_touch_attribution
- marketing.outreach_conversion_attribution
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R7**.
Why that ceiling: Minting a link and flagging untagged traffic are low-blast-radius and reversible. Full ownership waits on the two gaps the module names itself - no link health check and no persisting create path - because a capability cannot own what it does not yet do.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Answers which campaigns have registered links and where untagged traffic is coming from.

Acceptance: Every flagged source cites its traffic rows; no link is created.
## Before you start
- Link health checking and QR support are not implemented in the tracked-link module
- manager has not validated the UTM taxonomy or what to do about flagged traffic
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/campaignLinkService.ts:258
- backend/src/services/campaignLinkService.ts:90
- backend/src/services/campaignLinkService.ts:120
- backend/src/services/marketing/trackedLinkService.ts:9
- backend/src/services/marketing/trackedLinkDestination.ts:32
- backend/src/services/marketing/marketingTaxonomyService.ts:30
- backend/src/services/marketing/clickClassification.ts:25
- backend/src/services/aiOpsScheduler.ts:493
- backend/src/services/agentRegistrySeed.ts:2441
- backend/src/routes/admin/marketingRoutes.ts:27
- backend/src/routes/admin/qrAnalyticsRoutes.ts:27
- backend/src/routes/trackedLinkRedirectRoutes.ts
- table: tracked_links

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every flagged source cites its traffic rows; no link is created.

When every box above is ticked, stop and show the demo.
