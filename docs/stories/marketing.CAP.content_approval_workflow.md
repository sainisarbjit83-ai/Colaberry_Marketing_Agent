# marketing.CAP.content_approval_workflow — Content approval with revision-pinned decisions

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Nothing publishes without a named person approving the exact version they read, and an edit after approval invalidates it - so an audit can always answer who approved what.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- An agent must never hold the decide permission on its own content
- manager has not named the required approver per brand or content class

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Content approval with revision-pinned decisions
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.content_approval_workflow`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** existing_application
## The business outcome
Nothing publishes without a named person approving the exact version they read, and an edit after approval invalidates it - so an audit can always answer who approved what.
Intended users: Marketing manager, Marketing AI employee, Content reviewer.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- The author sends the item for approval, which opens a request pinned to the current revision
- The reviewer decides through a separate endpoint, because a different person makes that call
- Refuse any decision whose pinned revision no longer matches the item
- Route the three decisions to three different states: approved, changes_requested, or back to draft on rejection
- Append an immutable event recording who decided, when, and on which revision
**Inputs**
- A content item at a revision
- An open pending approval request
- A reviewer identity and an optional note
**Outputs**
- An approved / changes_requested / rejected decision pinned to the revision reviewed
- An append-only approval event
- The item moved to its decision-specific next state
**Exceptions that must be handled**
- A decision on a stale revision is refused outright - approving would attach a verdict to copy nobody reviewed
- An edit normally withdraws the open request first; the revision check is the backstop for when it did not
- This model is deliberately not the repo's shadow-mode ApprovalRequest, whose own header states nothing reads its status to gate a real action
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- approval_request_open
- content_item_draft_write
**Application surfaces**
- /admin/marketing/composer (Confirmation step)
- /admin/marketing/content
- POST /api/admin/content/:id/action
- POST /api/admin/content/:id/approval
- GET /api/admin/content/:id/confirmation
- POST /api/admin/content/:id/transition
**Source modules**
- backend/src/services/content/contentApprovalService.ts
- backend/src/services/content/composerActionService.ts
- backend/src/services/content/contentWorkflowService.ts
**Dependencies**
- marketing.content_composition_and_variant_generation
- marketing.brand_governance_enforcement
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R4**.
Why that ceiling: The approval decision is the human gate the rest of the domain depends on; an agent that could approve its own content would dissolve every other control. The agent may prepare and request; deciding stays human at every level, so the ceiling is stateful sandbox work on the request side only.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R2)**
Answers what is awaiting approval, for how long, and at which revision.

Acceptance: Queue contents reconcile to content_approval_requests; no decision is written.
## Before you start
- An agent must never hold the decide permission on its own content
- manager has not named the required approver per brand or content class
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/content/contentApprovalService.ts:31
- backend/src/services/content/contentApprovalService.ts:8
- backend/src/services/content/contentWorkflowService.ts:61
- backend/src/services/content/contentWorkflow.ts
- backend/src/models/ContentApprovalRequest.ts:4
- backend/src/models/ContentApprovalRequest.ts:89
- backend/src/routes/admin/contentComposerRoutes.ts:389
- backend/src/routes/admin/contentComposerRoutes.ts:411
- table: content_approval_requests
- table: content_approval_events

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Queue contents reconcile to content_approval_requests; no decision is written.

When every box above is ticked, stop and show the demo.
