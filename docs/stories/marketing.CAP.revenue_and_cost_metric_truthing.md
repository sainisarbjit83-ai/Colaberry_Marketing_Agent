# marketing.CAP.revenue_and_cost_metric_truthing — Revenue and cost-per-lead truthing

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Marketing stops reporting money it cannot evidence: revenue means collected, app-originated payment, and a cost metric that divides a column nothing writes is removed rather than rendered.

**Built today:** partial. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- The governing escalation is open and undecided
- three of the five affected services are owned outside this domain
- manager cannot settle a company-wide revenue definition alone

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Revenue and cost-per-lead truthing
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.revenue_and_cost_metric_truthing`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** partial · **Source:** proposed_new
## The business outcome
Marketing stops reporting money it cannot evidence: revenue means collected, app-originated payment, and a cost metric that divides a column nothing writes is removed rather than rendered.
Intended users: Marketing manager, Executive, Marketing AI employee, Finance owner.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Enumerate every service that redeclares a price constant or divides an unwritten spend column
- Replace each with a figure derived from collected, app-originated payments, or withdraw it
- Register every surviving money metric with its definition and source
- Make a withdrawn metric render as unavailable with a reason rather than disappearing silently
- Prove the fix by asserting no surface can render a money figure that is not registered
**Inputs**
- Every surface that renders a marketing money figure
- The actual collected-payment source of record
- The standing rule that revenue means app-originated checkout only
**Outputs**
- Money metrics computed from collected payments or removed entirely
- A cost metric that is either fed by a real spend column or withdrawn
- A registry entry per surviving money metric
**Exceptions that must be handled**
- The price constant was independently redeclared in five services; two were fixed in the branch that found it and three were deliberately left because they are owned outside marketing
- Three independent faults at once: the price is wrong, an enrolment is not a payment, and the figure contradicts the standing revenue rule
- A campaign with ten enrolments and no collected revenue reported a five-figure total in a success-coloured card labelled Total Revenue
- Cost per lead and cost per enrolment divide a spend column whose only write in the entire codebase is a literal zero
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- metric_registry_read
- repository_source_read
**Application surfaces**
- /admin/marketing/performance
- /admin/revenue-dashboard
- /admin/campaigns/:id
- GET /api/admin/marketing/channel-roi
- GET /api/admin/campaigns/:id/roi
**Source modules**
- backend/src/services/marketingAnalyticsService.ts
- backend/src/services/campaignLinkService.ts
- backend/src/services/adminOs/metricRegistry.ts
**Dependencies**
- marketing.metric_trust_escalation_decisions
- marketing.campaign_and_channel_metric_reporting
- Finance's source of record for collected payments
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R4**.
Why that ceiling: Tracing and proposing is good agent work. What revenue means is a business definition spanning Finance and Executive, and changing it changes what every dashboard asserts, so the definition stays a human decision.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R2)**
Explains which money figures are fabricated, where, and what each one contradicts.

Acceptance: Every finding names the file and the constant or column; nothing is reported as fixed that is not.
## Before you start
- The governing escalation is open and undecided
- three of the five affected services are owned outside this domain
- manager cannot settle a company-wide revenue definition alone
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- docs/marketing/ESCALATION-002-fabricated-metrics.md:21
- docs/marketing/ESCALATION-002-fabricated-metrics.md:26
- docs/marketing/ESCALATION-002-fabricated-metrics.md:40
- backend/src/services/marketingAnalyticsService.ts:7
- backend/src/services/campaignLinkService.ts:209
- backend/src/services/adminOs/metricRegistry.ts:22

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every finding names the file and the constant or column; nothing is reported as fixed that is not.

When every box above is ticked, stop and show the demo.
