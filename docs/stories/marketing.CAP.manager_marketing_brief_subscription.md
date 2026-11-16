# marketing.CAP.manager_marketing_brief_subscription — Manager marketing brief subscription

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

The accountable human receives the state of marketing on a cadence he chose, in his own timezone, covering only what the platform can actually measure.

**Built today:** partial. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- live_email (delivery is a real send)
- no per-manager timezone field exists, which is a hard prerequisite
- a dormant Slack channel must not be offered
- manager has not chosen a scope or a cadence

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Manager marketing brief subscription
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.manager_marketing_brief_subscription`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** partial · **Source:** proposed_new
## The business outcome
The accountable human receives the state of marketing on a cadence he chose, in his own timezone, covering only what the platform can actually measure.
Intended users: Marketing manager, Executive.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Let the manager choose the sections he wants
- Let him choose a cadence and a delivery time in his own timezone
- Constrain the channel list to channels that are actually wired
- Render a preview before the first delivery
- Persist each run with the content snapshot that was sent
**Inputs**
- A content scope chosen by the manager
- A cadence and a timezone
- A channel constrained to those actually wired
**Outputs**
- A stored subscription
- A run record with the exact content that was sent, for audit and replay
- A preview the manager can read before subscribing
**Exceptions that must be handled**
- No per-user or per-manager timezone field exists anywhere in the platform; every cron timezone in the repository is the same literal value, so a manager-chosen delivery time is not timezone-safe until that is added
- A dormant Slack path exists and must not appear as a selectable channel until it is wired
- Email is the only real channel, and sending is a denied capability for an agent
- The subscription routes exist; the timezone prerequisite and the marketing content scope do not
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- metric_registry_read
**Application surfaces**
- /admin/agents/:id (Reports)
- GET /api/admin/agents/:id/report-subscriptions
- POST /api/admin/agents/:id/report-subscriptions
- GET /api/admin/agents/:id/report-preview
- GET /api/admin/agents/:id/report-runs
**Source modules**
- backend/src/routes/admin/agentReportSubscriptionRoutes.ts
**Dependencies**
- marketing.recurring_marketing_performance_reporting
- marketing.marketing_agent_management_and_oversight
- A per-manager timezone field
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R4**.
Why that ceiling: Rendering and previewing is safe and useful. Delivery is a real send and the schedule is not timezone-safe, so both the subscription decision and the send stay human until the prerequisite exists.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R2)**
Answers what a brief would contain and what it cannot measure.

Acceptance: Unmeasurable sections are named; no delivery is attempted.
## Before you start
- live_email (delivery is a real send)
- no per-manager timezone field exists, which is a hard prerequisite
- a dormant Slack channel must not be offered
- manager has not chosen a scope or a cadence
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- docs/architecture/ai-workforce-management/REPORTING_MAP.md
- docs/architecture/ai-workforce-management/DOMAIN_REUSE_MAP.md
- backend/src/routes/admin/agentReportSubscriptionRoutes.ts:17
- backend/src/routes/admin/agentReportSubscriptionRoutes.ts:24
- backend/src/routes/admin/agentReportSubscriptionRoutes.ts:25

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Unmeasurable sections are named; no delivery is attempted.

When every box above is ticked, stop and show the demo.
