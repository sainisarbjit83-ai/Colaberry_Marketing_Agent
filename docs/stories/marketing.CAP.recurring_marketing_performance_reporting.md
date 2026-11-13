# marketing.CAP.recurring_marketing_performance_reporting — Recurring marketing performance reporting (DA responsibility in transition)

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

The recurring marketing report a data analyst assembles by hand - campaign ROI, open and reply rates, cost per lead, funnel velocity - is produced on a cadence from registered metrics, with every untrustworthy figure named rather than filled in.

**Built today:** absent. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- live_email (report delivery sends real mail)
- no per-manager timezone field exists, so scheduled delivery is timezone-unsafe
- marketing.revenue_and_cost_metric_truthing must land before any money figure may appear
- manager has not defined the report's scope, cadence or recipients

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Recurring marketing performance reporting (DA responsibility in transition)
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.recurring_marketing_performance_reporting`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** absent · **Source:** proposed_new
## The business outcome
The recurring marketing report a data analyst assembles by hand - campaign ROI, open and reply rates, cost per lead, funnel velocity - is produced on a cadence from registered metrics, with every untrustworthy figure named rather than filled in.
Intended users: Marketing manager, Executive, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Resolve the report's metric scope against the registry
- Compute each metric for the period and carry its trust status
- Exclude every untrusted metric from aggregates and name it in an unavailable list
- Render the report and persist it with the metrics it was built from
- Deliver on the subscription's cadence to its recipient
**Inputs**
- Registered marketing metrics and their trust status
- A reporting period
- A recipient, a cadence and a timezone
**Outputs**
- A recurring marketing report with narrative and metrics
- A KPI snapshot for trend history
- An explicit list of figures that could not be computed
**Exceptions that must be handled**
- The declared MarketingReportingAgent has a cron in registry data only, no scheduler entry anywhere, and zero importers of its source file - so the responsibility has never actually been automated
- No existing object combines what to report on, who receives it, how often, in what timezone and over which channel; every dimension exists in isolation
- No per-user or per-manager timezone field exists anywhere, so a manager-chosen delivery time is not timezone-safe today
- Email is the only wired channel; a dormant Slack path exists and must not appear as selectable until it is real
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- metric_registry_read
- kpi_snapshot_write
- email_engagement_metrics_read
**Application surfaces**
- /admin/reports
- /admin/marketing/performance
- POST /api/admin/agents/:id/report-subscriptions
- GET /api/admin/agents/:id/report-runs
- GET /api/admin/agents/:id/report-preview
**Source modules**
- backend/src/services/reporting/reportingOrchestrationService.ts
**Dependencies**
- marketing.campaign_and_channel_metric_reporting
- marketing.revenue_and_cost_metric_truthing
- marketing.manager_marketing_brief_subscription
- A per-manager timezone field
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R4**.
Why that ceiling: Composing the report is safe and is the clearest DA task to hand over. Delivering it sends real mail, which is a denied capability, so delivery stays a human-initiated or separately-authorised send and the agent's ceiling is producing and previewing.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R2)**
Answers the questions the recurring report would answer, on demand, from registered metrics.

Acceptance: Every figure cites its registry key and trust status; uncomputable figures are named, never zeroed.
## Before you start
- live_email (report delivery sends real mail)
- no per-manager timezone field exists, so scheduled delivery is timezone-unsafe
- marketing.revenue_and_cost_metric_truthing must land before any money figure may appear
- manager has not defined the report's scope, cadence or recipients
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agentRegistrySeed.ts:1676
- backend/src/services/agentRegistryAuditClassification.ts:40
- backend/src/services/__tests__/fixtures/cronRegistryBaseline.ts:65
- backend/src/services/agents/reporting/departmentReporterAgent.ts
- backend/src/services/reporting/reportingOrchestrationService.ts:27
- docs/architecture/ai-workforce-management/REPORTING_MAP.md
- table: department_reports
- table: kpi_snapshots

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every figure cites its registry key and trust status; uncomputable figures are named, never zeroed.

When every box above is ticked, stop and show the demo.
