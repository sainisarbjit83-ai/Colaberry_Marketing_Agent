# marketing.CAP.intelligence_card_prepublication_review — Pre-publication review for generated intelligence cards

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

No machine-written card reaches a real audience without a person having been able to read it first - especially one that puts words in the mouth of a named real person.

**Built today:** absent. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Domain ownership of this content is unconfirmed between Marketing, Curriculum and Product
- adding review slows publication, which is a manager trade-off
- manager has not set editorial standards or named a reviewer

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Pre-publication review for generated intelligence cards
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.intelligence_card_prepublication_review`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** absent · **Source:** proposed_new
## The business outcome
No machine-written card reaches a real audience without a person having been able to read it first - especially one that puts words in the mouth of a named real person.
Intended users: Marketing manager, Executive, Marketing AI employee, Enrolled students (protected audience).
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Create a generated card in a reviewable state rather than published and active
- Queue it for a named reviewer with its source item attached
- Hold the highest-risk streams unconditionally, starting with any card that attributes words to a named real person
- Publish only on a recorded decision
- Keep the existing post-hoc routing and the 30-day prune as a second line, not the first
**Inputs**
- A generated card before it is published
- A reviewer and a review queue
- Per-stream risk classification
**Outputs**
- Cards held in a reviewable state rather than published on creation
- A review queue and a decision record
- A per-stream policy saying which streams may auto-publish and which may not
**Exceptions that must be handled**
- Today the only controls are completeness gates and cost gates before generation, and post-hoc routing plus a 30-day prune after students can already see the card - nothing sits between
- The pipelines' own comments record that a truncated generation once pinned a blank card in the live feed for the full 30-day cache life
- The Explorer content registry already has approval columns recorded as the audit half of an unbuilt flow, with no reader - that is the shape to finish, not a gate to claim
- Adding review will slow publication, which is the intended trade
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- intel_card_draft_write
- approval_request_open
- sandbox_database_write
**Application surfaces**
- /admin/orchestration (Feed Control tab)
- a review queue that does not exist yet
- POST /api/admin/feed-control/route-card
- POST /api/admin/feed-control/route-type
**Source modules**
- backend/src/services/intel/intelPipeline.ts
- backend/src/services/intel/aiNewsIngestionService.ts
**Dependencies**
- marketing.ai_news_ingestion_and_card_publication
- marketing.intelligence_card_generation
- marketing.content_approval_workflow
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R4**.
Why that ceiling: Building the hold-and-queue mechanism is implementation work. The review decision is editorial judgement about what the brand publishes to its own students, and attribution of words to real people is exactly the kind of claim no model should clear, so the decision stays human.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R2)**
Reports which streams publish unreviewed and what each one asserts.

Acceptance: The quote and market-brief streams are named explicitly as attribution and figure risks.
## Before you start
- Domain ownership of this content is unconfirmed between Marketing, Curriculum and Product
- adding review slows publication, which is a manager trade-off
- manager has not set editorial standards or named a reviewer
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/intel/intelPipeline.ts:177
- backend/src/services/intel/intelPipeline.ts:118
- backend/src/services/intel/aiNewsIngestionService.ts:164
- backend/src/services/intel/intelCardContent.ts:14
- backend/src/services/intel/sources/ai_quote_of_the_day.ts:24
- backend/src/services/intel/sources/marketIntelligenceSource.ts:41
- backend/src/models/ExplorerContentAsset.ts:56
- backend/src/routes/admin/feedControlRoutes.ts:60

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] The quote and market-brief streams are named explicitly as attribution and figure risks.

When every box above is ticked, stop and show the demo.
