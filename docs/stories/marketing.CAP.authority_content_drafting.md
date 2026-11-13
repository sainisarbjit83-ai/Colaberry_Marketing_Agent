# marketing.CAP.authority_content_drafting — Authority and thought-leadership content drafting

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Signals the market is already generating become publishable Colaberry points of view - short LinkedIn posts and long-form articles - so the brand has a reason to speak that is grounded in something real.

**Built today:** partial. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Publishing externally remains a human decision until Sohail Syed says otherwise
- manager has not validated the brand point of view this content asserts

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Authority and thought-leadership content drafting
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.authority_content_drafting`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** partial · **Source:** inherited
## The business outcome
Signals the market is already generating become publishable Colaberry points of view - short LinkedIn posts and long-form articles - so the brand has a reason to speak that is grounded in something real.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Group recent signals by topic to find what the market is actually discussing
- Select the tones that have performed best
- Generate a short post or a long-form article depending on the target platform's content tier
- Store it as a draft in openclaw_authority_content
- Wait for a human to approve and then publish through the explicit publish endpoint
**Inputs**
- Recent signals grouped by topic
- Best-performing tones from the learning loop
- A per-run post cap and a signal window
**Outputs**
- Draft LinkedIn short posts (150-250 words)
- Draft Dev.to and Hashnode long-form articles (600-1200 words)
- openclaw_authority_content rows awaiting approval
**Exceptions that must be handled**
- Registered as a cron but never wired to a scheduler, so it runs only when a human triggers it - which is why the legacy classification is 'tool', not 'behaviour'
- Medium was permanently deactivated 2026-05-05 and its publish path returns HTTP 410
- Publishing is a separate human-triggered endpoint, not part of generation
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- llm_text_generation
- read_marketing_database
- content_item_draft_write
- brand_governance_rules_read
**Application surfaces**
- /admin/intelligence (Outreach tab)
- POST /api/admin/openclaw/authority-content/generate
- POST /api/admin/openclaw/authority-content/generate-articles
- POST /api/admin/openclaw/authority-content/:id/approve
- POST /api/admin/openclaw/authority-content/:id/publish
**Source modules**
- backend/src/services/agents/openclaw/openclawAuthorityContentAgent.ts
**Dependencies**
- marketing.social_signal_discovery
- marketing.outreach_learning_loop
- LLM provider availability
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R5**.
Why that ceiling: Authority content is a Colaberry point of view published under the brand. Generation can be automated; the decision to say it in public cannot be, until a manager explicitly authorises a class of content. Shadow mode is the honest ceiling.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R2)**
Summarises what the market is discussing and what has been drafted already.

Acceptance: Claims cite openclaw_signals and openclaw_authority_content rows; no generation occurs.
## Before you start
- Publishing externally remains a human decision until Sohail Syed says otherwise
- manager has not validated the brand point of view this content asserts
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/openclaw/openclawAuthorityContentAgent.ts:25
- backend/src/services/agentRegistrySeed.ts:1527
- backend/src/routes/admin/openclawRoutes.ts:1629
- backend/src/routes/admin/openclawRoutes.ts:1712
- backend/src/routes/admin/openclawRoutes.ts:1671
- backend/src/routes/admin/openclawRoutes.ts:1746
- table: openclaw_authority_content
- .loop-architect/runs/20261007-school-agent-factory/legacy-slices/marketing.json (proposed_kind: tool)

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Claims cite openclaw_signals and openclaw_authority_content rows; no generation occurs.

When every box above is ticked, stop and show the demo.
