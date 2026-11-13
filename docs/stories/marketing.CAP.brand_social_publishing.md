# marketing.CAP.brand_social_publishing — Brand social publishing queue

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

An approved post goes out at the minute it was scheduled for - or, where no network app is live, becomes a precise package a person publishes - so scheduling is real rather than aspirational.

**Built today:** partial. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Publishing brand content externally remains a human decision until Sohail Syed says otherwise
- the agent row is seeded disabled and turning it on is a documented production action
- manager has not authorised any provider for unattended direct publishing

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Brand social publishing queue
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.brand_social_publishing`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** partial · **Source:** inherited
## The business outcome
An approved post goes out at the minute it was scheduled for - or, where no network app is live, becomes a precise package a person publishes - so scheduling is real rather than aspirational.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Check the global kill switch before claiming any job, and again before any external action
- Claim due jobs off the queue
- Resolve each provider's adapter: dry-run in development, direct where LIVE_CONNECTORS names it, handoff otherwise
- Record a receipt and a delivery-event trail per attempt
- Classify a failure as permanent (dead-letter, no retry) or transient (capped exponential backoff with jitter), then reconcile the item's status
**Inputs**
- Due publishing_jobs rows
- The resolved adapter per provider
- The global kill-switch state
- LIVE_CONNECTORS from the environment
**Outputs**
- A direct network publication where a provider is live, otherwise a handoff package
- An external_publications receipt row
- A platform_delivery_events trail
- The content item reconciled to published, partially_published or publish_failed
**Exceptions that must be handled**
- Seeded disabled on purpose, because findOrCreate honours enabled only at first creation - it ships off and is turned on by one documented production update after the queue has been watched on dev
- LIVE_CONNECTORS unset means OFF with no default-on; direct posting is implemented for linkedin_member, linkedin_organization, meta_facebook_page and meta_instagram but switched on only for linkedin_member
- A provider marked direct with no live adapter raises a loud permanent error and dead-letters rather than publishing nothing silently
- The global kill switch halts the queue before any claim
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- sandbox_social_post_dry_run
- publishing_handoff_package_mint
- credential_vault_read_scoped
- kill_switch_state_read
**Application surfaces**
- /admin/marketing/publishing
- /admin/marketing (Overview, 'Posted by hand' line)
- GET /api/admin/publishing/jobs
- POST /api/admin/publishing/run
- GET /api/admin/publishing/publications
**Source modules**
- backend/src/services/publishing/publishingWorker.ts
- backend/src/services/publishing/adapterRegistry.ts
- backend/src/services/publishing/linkedInAdapter.ts
- backend/src/services/publishing/metaAdapter.ts
- backend/src/services/publishing/handoffAdapter.ts
**Dependencies**
- marketing.content_approval_workflow
- marketing.channel_account_connection_and_credential_custody
- marketing.publishing_failure_and_handoff_recovery
- Network app review status
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R5**.
Why that ceiling: This is the only path in the domain that can put brand content on a live network under a real person's profile. The platform's own HITL rule makes a public social post always require a human yes. Shadow mode is the ceiling; each provider's move to direct publishing needs its own manager authorisation, not a general one.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R2)**
Answers what is queued, what is late, and what will be handed off rather than posted.

Acceptance: Every provider still in handoff is named as such; no job is claimed during the answer.
## Before you start
- Publishing brand content externally remains a human decision until Sohail Syed says otherwise
- the agent row is seeded disabled and turning it on is a documented production action
- manager has not authorised any provider for unattended direct publishing
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/publishing/publishingWorker.ts:274
- backend/src/services/publishing/adapterRegistry.ts:10
- backend/src/services/publishing/adapterRegistry.ts:24
- backend/src/services/publishing/providerCapabilities.ts:305
- backend/src/services/publishing/providerCapabilities.ts:310
- backend/src/services/publishing/handoffAdapter.ts
- backend/src/services/publishing/publishingReceiptService.ts
- backend/src/services/aiOpsScheduler.ts:517
- backend/src/services/agentRegistrySeed.ts:3079
- backend/src/services/launchSafety.ts:1
- table: publishing_jobs
- table: external_publications
- table: platform_delivery_events

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every provider still in handoff is named as such; no job is claimed during the answer.

When every box above is ticked, stop and show the demo.
