# marketing.CAP.intelligence_card_generation — Multi-source intelligence card generation

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Nine distinct intelligence streams - research, architecture, builds, tools, quotes, techniques, MCP servers, video and market briefs - each produce their own card through one shared, cost-gated engine, so breadth does not mean nine bespoke pipelines.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- marketing.intelligence_card_prepublication_review does not exist; the only controls are completeness gates, cost gates, volume caps and post-hoc routing, all of which are either before generation or after students can see it
- domain ownership is unconfirmed: this is student-facing curriculum-adjacent content assigned to marketing by a name match
- manager has not validated editorial standards, and nobody has validated attributing LLM-expanded words to real people

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Multi-source intelligence card generation
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.intelligence_card_generation`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** inherited
## The business outcome
Nine distinct intelligence streams - research, architecture, builds, tools, quotes, techniques, MCP servers, video and market briefs - each produce their own card through one shared, cost-gated engine, so breadth does not mean nine bespoke pipelines.
Intended users: Marketing manager, Marketing AI employee, Enrolled students (audience).
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Register each source against the shared registry, which is dependency-free and pure
- Collect: live fetch, curated list, or a fetch that degrades to a curated fallback
- Ingest and upsert into the shared library, unique on pipeline plus guid
- Score, then materialize through the LLM behind two completeness gates with one doubled-headroom retry
- Publish one card per item, and for video resolve the real duration rather than stamping a default
**Inputs**
- Per-source collectors: live feeds, curated lists or a hybrid with a curated fallback
- A per-source enable flag, default off
- A per-source per-run cap with a code floor of one
- The per-slug generation prompt
**Outputs**
- intel_items library rows unique on pipeline plus guid
- One published timeline card per materialized item
- A true measured duration on video cards
**Exceptions that must be handled**
- No human reviews a card before students see it: the row is created published and active, which the code itself flags as the reason a fragment would be a broken card in the live feed for 30 days
- HIGHEST-RISK SURFACE: ai_quote_of_the_day LLM-expands quotes attributed to named real people, and the source list itself records that misquoting a real person is a risk it cannot absorb
- market_intelligence asserts specific valuations and funding figures from curated briefs, LLM-expanded and unreviewed
- Every source ships dark: an unset enable flag means off, and a typo in a cap falls back to a floor of one rather than zero
- The video source degrades to nothing without a YouTube API key, and a non-English item is filtered deterministically rather than by an LLM
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- rss_feed_read
- youtube_data_api_read
- llm_text_generation
- read_marketing_database
- intel_card_draft_write
**Application surfaces**
- /portal/today (where cards are read)
- /admin/orchestration (Feed Control tab)
- /admin/feed-control-governance
- GET /api/portal/runtime/today
- GET /api/admin/feed-control/board
- POST /api/admin/feed-control/route-type
- POST /api/admin/feed-control/route-card
**Source modules**
- backend/src/services/intel/intelPipeline.ts
- backend/src/services/intel/intelRegistry.ts
- backend/src/services/intel/intelCardContent.ts
- backend/src/services/intel/sources
**Dependencies**
- marketing.intelligence_card_prepublication_review
- LLM provider availability
- Per-source feed and API availability
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R5**.
Why that ceiling: Nine streams of machine-written content reach a real audience with no editorial gate, and one of them puts words in the mouths of named real people. Collection and generation can be automated; publication cannot be, so shadow mode is the ceiling and the quote stream should arguably never leave it.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R2)**
Answers what each stream published and from which source item.

Acceptance: Every card resolves to an intel_items row; unreviewable attribution claims are named as such.
## Before you start
- marketing.intelligence_card_prepublication_review does not exist; the only controls are completeness gates, cost gates, volume caps and post-hoc routing, all of which are either before generation or after students can see it
- domain ownership is unconfirmed: this is student-facing curriculum-adjacent content assigned to marketing by a name match
- manager has not validated editorial standards, and nobody has validated attributing LLM-expanded words to real people
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/intel/intelPipeline.ts:214
- backend/src/services/intel/intelPipeline.ts:177
- backend/src/services/intel/intelPipeline.ts:118
- backend/src/services/intel/intelRegistry.ts:59
- backend/src/services/intel/intelRegistry.ts:90
- backend/src/services/intel/intelCardContent.ts:101
- backend/src/services/intel/languageGuard.ts:34
- backend/src/services/intel/videoDurationLookup.ts:109
- backend/src/services/intel/sources/ai_quote_of_the_day.ts:24
- backend/src/services/intel/sources/marketIntelligenceSource.ts:41
- backend/src/services/schedulerService.ts:2104
- backend/src/services/agentRegistrySeed.ts:249
- table: intel_items
- table: timeline_cards
- table: curriculum_type_definitions

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every card resolves to an intel_items row; unreviewable attribution claims are named as such.

When every box above is ticked, stop and show the demo.
