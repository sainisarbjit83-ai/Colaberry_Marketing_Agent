# marketing.CAP.outreach_reply_drafting — Platform-native reply drafting

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Every queued conversation gets a reply that reads like a practitioner answering a question, obeys the platform's own rules about links and promotion, and is ready for a human to approve rather than rewrite.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- marketing.outreach_human_approval_gap_closure must land before this can be trusted to draft-only
- manager has not validated brand voice or the sign-off policy

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Platform-native reply drafting
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.outreach_reply_drafting`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** inherited
## The business outcome
Every queued conversation gets a reply that reads like a practitioner answering a question, obeys the platform's own rules about links and promotion, and is ready for a human to approve rather than rewrite.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Load the signal and resolve the platform's strategy and execution type
- Build the prompt from the strategy instructions plus the conversation stage
- Generate the reply with the LLM
- Apply enforceSignOff, which strips a duplicate byline on AUTHORITY_BROADCAST platforms and appends the standard sign-off elsewhere
- Persist as a draft and, for HUMAN_EXECUTION platforms, mark it ready_for_manual_post with no posting task
**Inputs**
- A queued generate_response task and its source signal
- The platform's content-strategy prompt instructions (PASSIVE_SIGNAL / HYBRID_ENGAGEMENT / AUTHORITY_BROADCAST)
- Conversation stage, where one exists
- Banned-phrase and allowed-URL lists for the platform
**Outputs**
- A draft reply row at post_status 'draft' or 'ready_for_manual_post'
- An enforced sign-off state per the platform's byline rule
- A captured Lead where the author is identifiable
**Exceptions that must be handled**
- HUMAN_EXECUTION platforms (quora, hackernews, linkedin_comments, skool) never receive a posting task from this step
- KNOWN DEFECT: for non-HUMAN_EXECUTION platforms the agent runs its own inline quality check and self-approves, creating the posting task itself (openclawContentResponseAgent.ts:134-150) - this bypasses the human gate the quality-gate agent exists to feed
- An LLM failure leaves the task queued rather than writing a partial draft
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- llm_text_generation
- read_marketing_database
- content_item_draft_write
- brand_governance_rules_read
**Application surfaces**
- /admin/intelligence (Outreach tab, Task Queue)
- /admin/content-queue
- POST /api/admin/openclaw/generate-responses
- GET /api/admin/openclaw/responses
- POST /api/admin/openclaw/linkedin/generate
**Source modules**
- backend/src/services/agents/openclaw/openclawContentResponseAgent.ts
- backend/src/services/agents/skool/skoolContentResponseAgent.ts
- backend/src/services/agents/openclaw/openclawPlatformStrategy.ts
**Dependencies**
- marketing.signal_triage_and_prioritisation
- LLM provider availability
- marketing.outreach_quality_gate
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R7**.
Why that ceiling: Drafting itself is reversible and internal, so a scoped automation class is defensible. It stops short of full ownership because the same module currently also mints a posting task on one code path, and until that is split the capability cannot claim it only drafts.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R1)**
Generates drafts against recorded signal fixtures in isolation with a baseline reply-quality suite.

Acceptance: Every fixture produces a draft; the sign-off rule is asserted per platform strategy, both branches covered.
## Before you start
- marketing.outreach_human_approval_gap_closure must land before this can be trusted to draft-only
- manager has not validated brand voice or the sign-off policy
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/openclaw/openclawContentResponseAgent.ts:21
- backend/src/services/agents/openclaw/openclawContentResponseAgent.ts:107
- backend/src/services/agents/skool/skoolContentResponseAgent.ts:31
- backend/src/services/agents/openclaw/openclawPlatformStrategy.ts:557
- backend/src/services/agents/openclaw/openclawPlatformStrategy.ts:105
- backend/src/services/agents/openclaw/openclawAiHelper.ts:7
- table: openclaw_responses
- table: skool_responses

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every fixture produces a draft; the sign-off rule is asserted per platform strategy, both branches covered.

When every box above is ticked, stop and show the demo.
