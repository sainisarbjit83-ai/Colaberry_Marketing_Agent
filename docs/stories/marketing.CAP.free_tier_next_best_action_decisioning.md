# marketing.CAP.free_tier_next_best_action_decisioning — Free-tier next-best-action decisioning in shadow

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

For each free-tier learner, one action per day is chosen and recorded with every rejected alternative and its reason - so lifecycle decisions are auditable before any of them is ever executed.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- live_email (and SMS and auto-dial) - the execution flags exist and are all default off; turning any on is a separate manager decision
- every decision row is executed false by construction and must stay so until execution is separately approved
- domain ownership is unconfirmed between Marketing and Learner Success
- manager has not validated the priority tiers or the daily contact cap

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Free-tier next-best-action decisioning in shadow
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.free_tier_next_best_action_decisioning`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** inherited
## The business outcome
For each free-tier learner, one action per day is chosen and recorded with every rejected alternative and its reason - so lifecycle decisions are auditable before any of them is ever executed.
Intended users: Marketing manager, Marketing AI employee, Executive.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Read the scores written 30 minutes earlier by the recompute job
- Generate candidate actions across the priority tiers
- Re-resolve contactability live rather than trusting the stored copy
- Choose one action per learner per day
- Write the decision with every suppressed candidate and its reason, all marked not executed
**Inputs**
- Scores written by the journey-scoring capability
- Live contactability, re-resolved rather than trusted from the profile copy
- Priority tiers and candidate generators
**Outputs**
- One explorer_journey_decisions row per learner per day
- The chosen action plus every suppressed candidate with its suppression reason
- Every row marked not executed
**Exceptions that must be handled**
- Shadow only by construction: every row is executed false, nothing is enqueued and nothing is sent; execution is a separate unbuilt epic
- A contact-history failure fails closed, suppressing rather than contacting
- A whitelist guard fails the build if this module ever imports a mailer, so the no-send property is enforced rather than asserted
- The outbound eligibility logic that exists is a pure predicate with a shared daily cap and a 45-day cooldown - it is not a sender
- Dark unless both EXPLORER_GROWTH_OS_ENABLED and EXPLORER_JOURNEY_GOVERNOR_ENABLED are on
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- sandbox_database_write
- suppression_list_read
**Application surfaces**
- /admin/explorer-growth (Decisions and Shadow tabs)
- GET /api/admin/explorer-growth/decisions
- GET /api/admin/explorer-growth/decisions/:id
- GET /api/admin/explorer-growth/shadow
- GET /api/admin/explorer-growth/eligibility/:enrollmentId
**Source modules**
- backend/src/services/explorerGrowth/governor/runGovernor.ts
- backend/src/services/explorerGrowth/governor/decideForLearner.ts
- backend/src/services/explorerGrowth/explorerDecisionsService.ts
**Dependencies**
- marketing.free_tier_learner_journey_scoring
- marketing.lifecycle_content_catalogue_projection
- marketing.outreach_consent_and_channel_suppression
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R5**.
Why that ceiling: The decisions are about contacting real learners. The capability is already in shadow mode with executed false and a build-enforced no-send guard, which is exactly what autonomy:R5 describes. Moving to execution is a separate authorisation per channel, not a promotion of this capability.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R2)**
Explains what was decided for a learner and which candidates were suppressed and why.

Acceptance: Every suppressed candidate names its reason; the chosen action reproduces from the stored row.
## Before you start
- live_email (and SMS and auto-dial) - the execution flags exist and are all default off; turning any on is a separate manager decision
- every decision row is executed false by construction and must stay so until execution is separately approved
- domain ownership is unconfirmed between Marketing and Learner Success
- manager has not validated the priority tiers or the daily contact cap
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/explorerGrowth/governor/runGovernor.ts:16
- backend/src/services/explorerGrowth/governor/decideForLearner.ts:30
- backend/src/services/explorerGrowth/governor/types.ts:103
- backend/src/services/explorerGrowth/explorerAliOutreachService.ts:28
- backend/src/services/schedulerService.ts:1804
- backend/src/services/agentRegistrySeed.ts:35
- backend/src/config/explorerGrowthFlags.ts:43
- table: explorer_journey_decisions

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every suppressed candidate names its reason; the chosen action reproduces from the stored row.

When every box above is ticked, stop and show the demo.
