# marketing.CAP.campaign_approval_and_golive — Campaign approval and go-live control

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

A campaign that will contact real people passes through a recorded approval before it goes live, with a named approver and a timestamp - so sending is authorised rather than assumed.

**Built today:** partial. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- live_email (going live starts real sends)
- the activate route bypasses the approval ladder entirely and must be closed before any automation is defensible
- no campaign-level approval UI exists for a manager to use
- manager has not validated who may approve a marketing campaign

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Campaign approval and go-live control
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.campaign_approval_and_golive`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** partial · **Source:** existing_application
## The business outcome
A campaign that will contact real people passes through a recorded approval before it goes live, with a named approver and a timestamp - so sending is authorised rather than assumed.
Intended users: Marketing manager, Marketing AI employee, Executive.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Submit a draft campaign for approval, which refuses anything not in draft
- Approve, which refuses anything not pending, and records who approved and when
- Mint the campaign's tracked link automatically on approval where a channel and destination exist
- Move to live as a separate, explicit act
- Emit an executive event at each transition
**Inputs**
- A campaign in draft
- An approver identity
- A channel and destination path for link minting
**Outputs**
- approval_status moved through pending_approval, approved and live
- approved_by and approved_at recorded
- A tracked link minted on approval
- An executive event emitted
**Exceptions that must be handled**
- KNOWN DEFECT: approval_status and status are separate columns and activateCampaign checks only status, so POST /api/admin/campaigns/:id/activate can start sends with no approval record at all (campaignService.ts:258)
- There is no campaign-level approve or reject UI anywhere in the frontend - the API is complete, the screen is not; the only approval screens are variant-level and the generic approval-requests page
- The platform's HITL rule set already makes anything in a campaign's first 24 hours require a human yes
- Two campaign populations coexist - marketing campaigns and internal automation - distinguished only by filtering on approval_status
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- approval_request_open
- tracked_link_mint
**Application surfaces**
- /admin/campaigns
- /admin/marketing/campaigns/:id
- /admin/approval-requests
- POST /api/admin/campaigns/:id/submit-approval
- POST /api/admin/campaigns/:id/approve
- POST /api/admin/campaigns/:id/reject
- POST /api/admin/campaigns/:id/go-live
- POST /api/admin/campaigns/:id/pause-approval
**Source modules**
- backend/src/services/campaignApprovalService.ts
- backend/src/services/campaignService.ts
**Dependencies**
- marketing.campaign_and_channel_metric_reporting
- marketing.outreach_consent_and_channel_suppression
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R3**.
Why that ceiling: Approving a campaign authorises outbound contact with real people. An agent must never hold that decision, and the approval ladder currently has a bypass, so the agent's ceiling is preparing and submitting on an explicit human request.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R2)**
Answers which campaigns are awaiting approval, which are live, and which went live without an approval record.

Acceptance: The bypass population is reported explicitly by comparing status against approval_status.
## Before you start
- live_email (going live starts real sends)
- the activate route bypasses the approval ladder entirely and must be closed before any automation is defensible
- no campaign-level approval UI exists for a manager to use
- manager has not validated who may approve a marketing campaign
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/campaignApprovalService.ts:1
- backend/src/services/campaignApprovalService.ts:11
- backend/src/services/campaignApprovalService.ts:35
- backend/src/services/campaignApprovalService.ts:75
- backend/src/services/campaignApprovalService.ts:103
- backend/src/services/campaignService.ts:258
- backend/src/routes/admin/campaignRoutes.ts:312
- backend/src/routes/admin/campaignRoutes.ts:321
- backend/src/routes/admin/campaignRoutes.ts:341
- backend/src/services/agentAutonomy.ts:96
- frontend/src/pages/admin/marketing/AdminMarketingPerformancePage.tsx
- table: campaigns

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] The bypass population is reported explicitly by comparing status against approval_status.

When every box above is ticked, stop and show the demo.
