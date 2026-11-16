# marketing.CAP.linkedin_comment_watch_and_reply_drafting — Tracked LinkedIn post comment watch

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Comments on the LinkedIn posts that matter get a drafted, on-brand reply ready for a person to paste, so the highest-value platform stays responsive without automating a channel that forbids it.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Scrape blocks are not distinguishable from genuinely quiet posts
- manager has not validated which posts should be tracked

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Tracked LinkedIn post comment watch
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.linkedin_comment_watch_and_reply_drafting`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** inherited
## The business outcome
Comments on the LinkedIn posts that matter get a drafted, on-brand reply ready for a person to paste, so the highest-value platform stays responsive without automating a channel that forbids it.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Read the human-curated list of tracked LinkedIn posts
- Scrape each post for commenters not seen before
- Generate a reply for each new commenter
- Store it as ready_for_manual_post with no posting task
- Surface it in the content queue for a person to post by hand
**Inputs**
- A tracked-post list maintained by a human
- LinkedIn session cookies and an optional residential proxy
- Existing commenter history
**Outputs**
- Draft replies at post_status 'ready_for_manual_post'
- A manual-posting queue a person works through
**Exceptions that must be handled**
- linkedin_comments is declared HUMAN_EXECUTION, so no automated posting path exists for it by design
- A scrape blocked by LinkedIn yields no comments, which is indistinguishable from a post with no new comments
- The tracked-post list is manual, so an untracked post gets no coverage
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- llm_text_generation
- read_marketing_database
- content_item_draft_write
- credential_vault_read_scoped
**Application surfaces**
- /admin/intelligence (Outreach tab, LinkedIn Tools)
- /admin/content-queue
- GET /api/admin/openclaw/linkedin/tracked-posts
- POST /api/admin/openclaw/linkedin/track-post
- DELETE /api/admin/openclaw/linkedin/tracked-posts/:id
- POST /api/admin/openclaw/linkedin/reply-to-comments
- GET /api/admin/content-queue
**Source modules**
- backend/src/services/agents/openclaw/openclawLinkedInCommentMonitorAgent.ts
- backend/src/services/agents/openclaw/openclawLinkedInScraper.ts
**Dependencies**
- LinkedIn session credentials
- marketing.browser_session_reliability
- marketing.outreach_reply_drafting
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R7**.
Why that ceiling: The capability deliberately ends at a draft a human pastes, which is the whole reason it is safe. It can reach a scoped automation class for watching and drafting; it must never acquire a posting action, because LinkedIn comments are declared human-execution.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Reports new commenters on tracked posts from stored rows.

Acceptance: Every commenter cited exists in openclaw_responses; no scrape runs.
## Before you start
- Scrape blocks are not distinguishable from genuinely quiet posts
- manager has not validated which posts should be tracked
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/openclaw/openclawLinkedInCommentMonitorAgent.ts:13
- backend/src/services/agents/openclaw/openclawLinkedInCommentMonitorAgent.ts:180
- backend/src/services/agents/openclaw/openclawLinkedInScraper.ts:312
- backend/src/services/agents/openclaw/openclawPlatformStrategy.ts:70
- backend/src/services/aiOpsScheduler.ts:255
- backend/src/routes/admin/openclawRoutes.ts:1470
- table: openclaw_responses (post_status 'ready_for_manual_post')

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every commenter cited exists in openclaw_responses; no scrape runs.

When every box above is ticked, stop and show the demo.
