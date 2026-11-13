# marketing.CAP.campaign_funnel_performance_analysis — Campaign funnel performance analysis

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Each active campaign is graded healthy, degraded or empty against its own real numbers, per tenant, every six hours - so a broken funnel is found by a check rather than by someone noticing.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- manager has not validated the degraded threshold or what to do when a funnel reads degraded

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Campaign funnel performance analysis
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.campaign_funnel_performance_analysis`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** existing_application
## The business outcome
Each active campaign is graded healthy, degraded or empty against its own real numbers, per tenant, every six hours - so a broken funnel is found by a check rather than by someone noticing.
Intended users: Marketing manager, Marketing AI employee, Executive.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Scan active campaigns, optionally filtered to one tenant
- Aggregate lead and delivery counts in three bounded queries regardless of campaign count
- Compute a division-safe failure rate
- Classify the funnel: an empty audience outranks a delivery problem, because there is no funnel to grade
- Partition the output by tenant and derive campaigns_processed from the report array rather than a counter
**Inputs**
- Active campaigns, optionally narrowed by tenant
- Enrolled lead counts
- Scheduled-email sent, pending and failed counts
**Outputs**
- One report per campaign carrying leads, sent, pending, failed, a bounded failure rate and a healthy/degraded/empty verdict
- One action per tenant, so no report mixes two tenants
**Exceptions that must be handled**
- Read-only by contract: no campaign is paused, no email rescheduled, no row touched; the test suite asserts the absence of every write method
- A malformed campaign row is reported in errors and skipped, and is never counted as processed
- Every query carries an explicit deadline so a degraded database cannot hold a cron slot open
- Unhandled: a stale read inside someone else's open transaction, and partial GROUP BY results from a server-cancelled query - both surface as wrong-but-plausible counts no in-process check can detect
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- agent_activity_log_write
**Application surfaces**
- /admin/marketing/performance
- /admin/campaigns/:id
- GET /api/admin/dashboard/campaign-performance
- GET /api/admin/campaigns/:id/analytics
**Source modules**
- backend/src/services/agents/departments/marketing/campaignPerformanceAgent.ts
**Dependencies**
- marketing.campaign_and_channel_metric_reporting
- Campaign and scheduled-email tables
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R9**.
Why that ceiling: Read-only by contract with tenant partitioning, bounded queries and a test suite that asserts the absence of writes. Two runs over unchanged data leave the database byte-identical, so there is no side effect to make idempotent and operational ownership is the natural destination.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Answers how each campaign's funnel is performing and why a verdict was reached.

Acceptance: Verdict reproduces from the stored report; the failure rate and its denominator are both stated.
## Before you start
- manager has not validated the degraded threshold or what to do when a funnel reads degraded
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/departments/marketing/campaignPerformanceAgent.ts:66
- backend/src/services/agents/departments/marketing/campaignPerformanceAgent.ts:104
- backend/src/services/agents/departments/marketing/campaignPerformanceAgent.ts:247
- backend/src/services/agents/departments/marketing/campaignPerformanceAgent.ts:1
- backend/src/services/agents/departments/marketing/__tests__/campaignPerformanceAgentWiring.test.ts:155
- backend/src/services/aiOpsScheduler.ts:189
- backend/src/services/agentRegistrySeed.ts:1935
- backend/src/services/agentRegistrySeed.ts:3338
- backend/src/services/__tests__/agentGroupMapIntegrity.test.ts:158
- table: campaigns
- table: campaign_leads
- table: scheduled_emails

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Verdict reproduces from the stored report; the failure rate and its denominator are both stated.

When every box above is ticked, stop and show the demo.
