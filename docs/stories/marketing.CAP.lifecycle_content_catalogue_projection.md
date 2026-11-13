# marketing.CAP.lifecycle_content_catalogue_projection — Lifecycle content catalogue projection

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

The lifecycle decision engine can offer a learner a real, published piece of content by pointer - never a copy of it - so there is exactly one place the content lives and no second version to drift.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- An unbuilt approval flow means the registry's approval columns are NULL and must not be read as approved
- domain ownership is unconfirmed between Marketing and Curriculum
- manager has not validated which content should be offerable

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Lifecycle content catalogue projection
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.lifecycle_content_catalogue_projection`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** inherited
## The business outcome
The lifecycle decision engine can offer a learner a real, published piece of content by pointer - never a copy of it - so there is exactly one place the content lives and no second version to drift.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Read published and active cards that are today-eligible
- Project each into the registry as a pointer: title, summary, URL and tags, with no body
- Upsert against the partial unique index so two runs yield identical rows
- Retire registry rows whose source content is gone
- Run 30 minutes before the scoring job and an hour before the governor, so the catalogue is never a day stale at decision time
**Inputs**
- Published, active, today-eligible timeline cards joined to their type definitions
- The existing asset registry for retirement comparison
**Outputs**
- explorer_content_assets rows carrying title, summary, URL and tags only
- Retired rows for content no longer in the source
**Exceptions that must be handled**
- Projects only: decides nothing, enqueues nothing and cannot send; the no-send guard sweeps this directory so importing a mailer fails the build
- There is deliberately no body column - the registry holds pointers because the campaign engine renders at send time
- approval_status, approved_by and approved_at exist on the model with no reader, recorded as the audit half of an unbuilt approval flow rather than pretended into a gate - the sync never writes them, so synced rows are NULL
- Dark unless both Explorer Growth OS flags are on
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- sandbox_database_write
**Application surfaces**
- /admin/explorer-growth (Content tab)
- GET /api/admin/explorer-growth/content
**Source modules**
- backend/src/services/explorerGrowth/content/runContentSync.ts
- backend/src/services/explorerGrowth/content/syncTimelineCards.ts
**Dependencies**
- marketing.free_tier_next_best_action_decisioning
- Published curriculum content
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R9**.
Why that ceiling: A pointer projection with a proven-idempotent upsert, no body duplication, no decision and a build-enforced inability to send. This is the clearest candidate in the inherited set for genuine operational ownership.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Answers which content is currently offerable and what was retired.

Acceptance: Every asset resolves to a published source card; approval columns are reported as unset, never as approved.
## Before you start
- An unbuilt approval flow means the registry's approval columns are NULL and must not be read as approved
- domain ownership is unconfirmed between Marketing and Curriculum
- manager has not validated which content should be offerable
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/explorerGrowth/content/runContentSync.ts:45
- backend/src/services/explorerGrowth/content/runContentSync.ts:11
- backend/src/services/explorerGrowth/content/syncTimelineCards.ts:9
- backend/src/services/explorerGrowth/content/syncTimelineCards.ts:220
- backend/src/models/ExplorerContentAsset.ts:56
- backend/src/services/schedulerService.ts:1828
- backend/src/services/agentRegistrySeed.ts:24
- table: explorer_content_assets
- table: timeline_cards

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every asset resolves to a published source card; approval columns are reported as unset, never as approved.

When every box above is ticked, stop and show the demo.
