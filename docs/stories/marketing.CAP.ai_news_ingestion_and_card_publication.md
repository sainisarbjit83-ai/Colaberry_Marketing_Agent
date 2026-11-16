# marketing.CAP.ai_news_ingestion_and_card_publication — AI news ingestion and daily card publication

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

A daily, deduplicated AI-news card appears in the product without anyone sourcing it, so the platform demonstrably tracks the field it teaches.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- marketing.intelligence_card_prepublication_review does not exist, so there is no gate between generation and the live feed
- domain ownership is unconfirmed: this content is student-facing portal content, and the slice assigned it to marketing on a name match, not a product decision
- manager has not validated editorial standards for published cards

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# AI news ingestion and daily card publication
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.ai_news_ingestion_and_card_publication`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** inherited
## The business outcome
A daily, deduplicated AI-news card appears in the product without anyone sourcing it, so the platform demonstrably tracks the field it teaches.
Intended users: Marketing manager, Marketing AI employee, Enrolled students (audience).
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Fetch the configured RSS feeds with an explicit timeout
- Deduplicate and upsert into the news library
- Materialize up to the per-run cap of cards through the LLM, behind the cost gate
- Publish each card directly as an active, published timeline card
- Prune generated cards older than 30 days, recycling their library items
**Inputs**
- Free AI-lab RSS feeds (HuggingFace, NVIDIA, OpenAI, DeepMind, Anthropic)
- AI_NEWS_INGEST_ENABLED cost gate
- AI_NEWS_MAX_PER_RUN cap
**Outputs**
- Deduplicated ai_news_items library rows
- Up to the per-run cap of published timeline cards
- Cards older than 30 days pruned
**Exceptions that must be handled**
- There is no human review step: a card is created with visibility published and status active, so a bad generation is live in the feed and the 30-day prune is the only removal path
- A boot catch-up recovers a run missed by a redeploy, so a deploy through the cron window does not lose a day
- The admin refresh endpoint carries a force flag that bypasses the cost gate
- This pipeline is separate from the nine generic generators and is not in the intel registry
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- rss_feed_read
- llm_text_generation
- read_marketing_database
- intel_card_draft_write
**Application surfaces**
- /portal/today (where the card is read)
- /admin/orchestration (Feed Control tab)
- POST /api/admin/intel/ai-news/refresh
- GET /api/portal/runtime/today
**Source modules**
- backend/src/services/intel/aiNewsIngestionService.ts
- backend/src/services/intel/rssParser.ts
- backend/src/services/intel/aiNewsBootDecision.ts
**Dependencies**
- RSS source availability
- LLM provider availability
- marketing.intelligence_card_prepublication_review
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R5**.
Why that ceiling: The pipeline publishes machine-written content to a real audience with no human in the loop today. Generation and ingestion can be automated; publication to an audience is a human decision until a pre-publication review exists, so shadow mode is the ceiling.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R2)**
Answers what was published, from which source, and when.

Acceptance: Every card cites its library item and source feed; no generation occurs.
## Before you start
- marketing.intelligence_card_prepublication_review does not exist, so there is no gate between generation and the live feed
- domain ownership is unconfirmed: this content is student-facing portal content, and the slice assigned it to marketing on a name match, not a product decision
- manager has not validated editorial standards for published cards
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/intel/aiNewsIngestionService.ts:203
- backend/src/services/intel/aiNewsIngestionService.ts:164
- backend/src/services/intel/aiNewsIngestionService.ts:46
- backend/src/services/intel/aiNewsBootDecision.ts:18
- backend/src/services/intel/rssParser.ts:46
- backend/src/services/schedulerService.ts:2082
- backend/src/services/agentRegistrySeed.ts:236
- backend/src/routes/admin/intelRoutes.ts:14
- table: ai_news_items
- table: timeline_cards

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every card cites its library item and source feed; no generation occurs.

When every box above is ticked, stop and show the demo.
