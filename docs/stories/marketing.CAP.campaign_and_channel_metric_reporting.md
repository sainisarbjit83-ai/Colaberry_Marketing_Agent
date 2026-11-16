# marketing.CAP.campaign_and_channel_metric_reporting — Campaign and channel metric reporting under a trust registry

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Marketing numbers come from one registered definition each, with a trust status attached - so two screens cannot quietly disagree and an uncomputable figure says so instead of showing a zero.

**Built today:** partial. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- marketing.revenue_and_cost_metric_truthing is an open escalation and blocks any monetary claim
- manager has not validated which metrics define marketing success

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Campaign and channel metric reporting under a trust registry
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.campaign_and_channel_metric_reporting`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** partial · **Source:** existing_application
## The business outcome
Marketing numbers come from one registered definition each, with a trust status attached - so two screens cannot quietly disagree and an uncomputable figure says so instead of showing a zero.
Intended users: Marketing manager, Marketing AI employee, Executive.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Resolve each requested metric against the registry before computing anything
- Refuse to compute a metric the registry marks unavailable or invalid, and return that verdict instead
- Aggregate per campaign across visitors, leads, engagement and enrolments
- Roll the same figures up by growth-journey classification
- Aggregate ROI by channel and carry the trust status through to the screen
**Inputs**
- Campaign, lead, visitor, engagement and enrolment rows
- Growth-journey classifications
- The registered definition and trust status of each metric
**Outputs**
- Per-campaign visitor, lead, engagement and enrolment figures
- The same figures rolled up by growth journey
- Channel ROI aggregation
- An explicit unavailable-metric result where a figure cannot be computed
**Exceptions that must be handled**
- The service previously turned missing fields into 0, 500s into 'no data' and NULL columns into 'Direct'; those were removed and uncomputable metrics now surface as unavailable
- Unavailable and invalid are explicitly not zero, and must be excluded from health scores, AI narrative and executive summary rather than contributing a zero
- Money figures on this surface are not trustworthy until marketing.revenue_and_cost_metric_truthing lands
- A metric may only appear on a dashboard if it is registered, so a new figure needs a definition before a screen
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- metric_registry_read
- email_engagement_metrics_read
**Application surfaces**
- /admin/marketing/performance
- /admin/marketing
- GET /api/admin/marketing/campaigns
- GET /api/admin/marketing/campaigns/by-journey
- GET /api/admin/marketing/channel-roi
- GET /api/admin/marketing/funnel/graph
- GET /api/admin/marketing/funnel/graph/node-leads
**Source modules**
- backend/src/services/marketingAnalyticsService.ts
- backend/src/services/adminOs/metricRegistry.ts
- backend/src/services/reporting/marketingFunnelGraphService.ts
**Dependencies**
- marketing.revenue_and_cost_metric_truthing
- marketing.multi_touch_attribution
- The adminOs metric registry
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R7**.
Why that ceiling: Reporting is read-only and already gated on a registry that forbids unregistered figures. It is held below full ownership because several money metrics on the same surfaces are still computed from a hardcoded price constant, so the capability cannot yet claim every number it renders is measured.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Answers a marketing performance question and names each metric's definition and trust status.

Acceptance: Every figure cites its registry key; any unavailable metric is reported as such with its reason.
## Before you start
- marketing.revenue_and_cost_metric_truthing is an open escalation and blocks any monetary claim
- manager has not validated which metrics define marketing success
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/marketingAnalyticsService.ts:119
- backend/src/services/marketingAnalyticsService.ts:308
- backend/src/services/marketingAnalyticsService.ts:7
- backend/src/services/adminOs/metricRegistry.ts:6
- backend/src/services/adminOs/metricRegistry.ts:22
- backend/src/services/adminOs/metrics/marketingMetrics.ts
- backend/src/services/campaignLinkService.ts:209
- backend/src/routes/admin/marketingRoutes.ts:12
- backend/src/routes/admin/marketingRoutes.ts:18
- backend/src/routes/admin/marketingFunnelRoutes.ts:12
- frontend/src/pages/admin/marketing/AdminMarketingPerformancePage.tsx
- frontend/src/routes/adminRoutes.tsx:236
- table: campaign_engagement
- table: interaction_outcomes

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every figure cites its registry key; any unavailable metric is reported as such with its reason.

When every box above is ticked, stop and show the demo.
