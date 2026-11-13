# marketing.CAP.publishing_failure_and_handoff_recovery — Publishing failure and handoff reconciliation

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

A post that did not go out is visible, explicable and recoverable - retried, cancelled or marked hand-published - so the calendar never quietly disagrees with reality.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- A retry can produce a live post, so it inherits the same human decision as publishing
- manager has not validated who may retry or cancel

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Publishing failure and handoff reconciliation
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.publishing_failure_and_handoff_recovery`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** existing_application
## The business outcome
A post that did not go out is visible, explicable and recoverable - retried, cancelled or marked hand-published - so the calendar never quietly disagrees with reality.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- List jobs with their state, provider and last error
- Expose the delivery-event timeline for a single job
- Allow a retry for a transient failure and a cancel for a job that should not go
- Let an operator mark a handoff package as actually published and record the permalink
- Keep the content item's status reconciled to what the jobs actually did
**Inputs**
- Publishing job state and its delivery-event history
- A dead-letter reason where one exists
- A human confirmation that a handoff package was published
**Outputs**
- A retried or cancelled job
- A publication marked handoff-complete with its real permalink
- A per-job event timeline an operator can read
**Exceptions that must be handled**
- A permanently failed job is dead-lettered with its reason rather than retried into the same wall
- A handoff package nobody confirms stays unconfirmed - the system does not assume it was published
- Cancelling a job does not retract a post already made
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- publishing_job_state_write
- sandbox_database_write
**Application surfaces**
- /admin/marketing/publishing
- GET /api/admin/publishing/jobs/:id/events
- POST /api/admin/publishing/jobs/:id/retry
- POST /api/admin/publishing/jobs/:id/cancel
- POST /api/admin/publishing/publications/:id/handoff-complete
**Source modules**
- backend/src/services/publishing/publishingQueueQuery.ts
- backend/src/services/publishing/publishingReceiptService.ts
**Dependencies**
- marketing.brand_social_publishing
- marketing.handoff_package_manual_publication
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R4**.
Why that ceiling: Retrying a job can cause a real publication, and marking a handoff complete asserts something happened in the world. The agent may diagnose and explain; the actions that change external reality or assert it stay human.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R2)**
Explains why a specific post did not go out and what the recovery options are.

Acceptance: Explanation cites the delivery events and the dead-letter reason; no job state changes.
## Before you start
- A retry can produce a live post, so it inherits the same human decision as publishing
- manager has not validated who may retry or cancel
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/routes/admin/publishingRoutes.ts:69
- backend/src/routes/admin/publishingRoutes.ts:81
- backend/src/routes/admin/publishingRoutes.ts:92
- backend/src/routes/admin/publishingRoutes.ts:120
- backend/src/services/publishing/publishingQueueQuery.ts
- backend/src/services/publishing/publishingReceiptService.ts
- frontend/src/pages/admin/marketing/AdminPublishingQueuePage.tsx
- frontend/src/routes/adminRoutes.tsx:254
- table: publishing_jobs
- table: platform_delivery_events

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Explanation cites the delivery events and the dead-letter reason; no job state changes.

When every box above is ticked, stop and show the demo.
