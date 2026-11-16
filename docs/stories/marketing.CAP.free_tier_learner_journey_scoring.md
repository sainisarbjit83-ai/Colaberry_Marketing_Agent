# marketing.CAP.free_tier_learner_journey_scoring — Free-tier learner journey scoring

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Every free-tier learner carries a current, dated set of engagement, intent and fit scores plus a journey state, so lifecycle marketing can act on where someone actually is rather than when they signed up.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Entire subsystem is dark by default behind two flags
- domain ownership is unconfirmed: these are enrolled free-tier learners, so this may belong to Learner Success rather than Marketing - the slice matched on the name 'Explorer'
- manager has not validated what the scores should mean or what they should trigger

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Free-tier learner journey scoring
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.free_tier_learner_journey_scoring`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** inherited
## The business outcome
Every free-tier learner carries a current, dated set of engagement, intent and fit scores plus a journey state, so lifecycle marketing can act on where someone actually is rather than when they signed up.
Intended users: Marketing manager, Marketing AI employee, Executive.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Repair the identity bridges between learners and their signals first
- Recompute engagement, intent and fit scores wholesale rather than incrementally
- Recompute affinities and contactability
- Classify the journey state
- Write the profile and one dated snapshot per learner
**Inputs**
- Behavioural signals ingested from the learner portal
- Enrolment and tier state
- Contactability and consent state
**Outputs**
- A recomputed explorer_journey_profiles row per learner
- One explorer_score_snapshots row per learner per day
- A journey-state classification
**Exceptions that must be handled**
- Scores and classifies only: it decides nothing and sends nothing, and the governor is a separate agent
- Dark unless both EXPLORER_GROWTH_OS_ENABLED and EXPLORER_JOURNEY_INTELLIGENCE_ENABLED are on
- Recompute is idempotent: two runs with the same as-of time produce identical scores
- A free-tier learner past week zero has an empty content candidate set by construction, which limits what any downstream decision can offer them
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- sandbox_database_write
- metric_registry_read
**Application surfaces**
- /admin/explorer-growth (Journey tab)
- GET /api/admin/explorer-growth/learners
- GET /api/admin/explorer-growth/learners/:id/scores
- GET /api/admin/explorer-growth/distribution
- POST /api/portal/explorer-signals
**Source modules**
- backend/src/services/explorerGrowth/explorerProfileService.ts
- backend/src/services/explorerGrowth/explorerScoringService.ts
**Dependencies**
- Learner portal behavioural signal ingest
- marketing.lifecycle_content_catalogue_projection
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R7**.
Why that ceiling: Scoring writes internal rows about enrolled learners and sends nothing; the no-send guard is enforced at build time for this directory, not just documented. Full ownership waits on the scores actually driving something, which is a separate unbuilt epic.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Answers where a free-tier learner is in their journey and what the score is made of.

Acceptance: Every component resolves to a stored snapshot; no recompute occurs during the answer.
## Before you start
- Entire subsystem is dark by default behind two flags
- domain ownership is unconfirmed: these are enrolled free-tier learners, so this may belong to Learner Success rather than Marketing - the slice matched on the name 'Explorer'
- manager has not validated what the scores should mean or what they should trigger
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/explorerGrowth/explorerProfileService.ts:342
- backend/src/services/explorerGrowth/explorerScoringService.ts
- backend/src/services/explorerGrowth/explorerAffinityService.ts
- backend/src/services/explorerGrowth/explorerContactabilityService.ts
- backend/src/services/explorerGrowth/explorerIdentityBridge.ts
- backend/src/services/schedulerService.ts:1849
- backend/src/services/agentRegistrySeed.ts:46
- backend/src/config/explorerGrowthFlags.ts:19
- table: explorer_journey_profiles
- table: explorer_score_snapshots

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every component resolves to a stored snapshot; no recompute occurs during the answer.

When every box above is ticked, stop and show the demo.
