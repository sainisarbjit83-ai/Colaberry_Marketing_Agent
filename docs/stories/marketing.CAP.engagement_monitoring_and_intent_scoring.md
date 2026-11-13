# marketing.CAP.engagement_monitoring_and_intent_scoring — Posted-content engagement monitoring

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

When someone replies to Colaberry content, the reply is noticed, scored for buying intent, and attached to the right conversation - so a warm thread is never lost to an unread notification.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- LinkedIn, Reddit and Quora coverage depends on a human typing engagements in
- manager has not validated what counts as buying intent

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Posted-content engagement monitoring
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.engagement_monitoring_and_intent_scoring`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** inherited
## The business outcome
When someone replies to Colaberry content, the reply is noticed, scored for buying intent, and attached to the right conversation - so a warm thread is never lost to an unread notification.
Intended users: Marketing manager, Marketing AI employee, Admissions.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Collect posted URLs that are still within the monitoring window
- Fetch comments and replies through each platform's public read endpoint
- Score each new reply for buying intent
- Write an engagement event and update the conversation it belongs to
- Leave LinkedIn, Reddit and Quora to manual entry, which the fetcher documents as unreadable
**Inputs**
- URLs of posted responses and published authority content
- Per-platform public comment/reply endpoints
- Manually entered engagements for platforms with no readable API
**Outputs**
- openclaw_engagement_events rows with an LLM intent score
- Updated conversation state and stage
**Exceptions that must be handled**
- LinkedIn, Reddit and Quora engagements must be typed in by a human through the admin endpoint
- An engagement with no resolvable parent response is linked later by the conversation-sync sweep
- Intent scoring is an LLM judgement and carries no confidence floor today
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- platform_public_api_read_allowlisted
- llm_text_generation
- read_marketing_database
- sandbox_database_write
**Application surfaces**
- /admin/intelligence (Outreach tab)
- /admin/marketing/performance (Outreach tab)
- GET /api/admin/openclaw/engagements
- POST /api/admin/openclaw/engagements
- PUT /api/admin/openclaw/engagements/:id
- GET /api/admin/openclaw/conversations
**Source modules**
- backend/src/services/agents/openclaw/openclawEngagementMonitorAgent.ts
- backend/src/services/agents/openclaw/openclawEngagementFetcher.ts
- backend/src/services/agents/openclaw/openclawConversationTrackingService.ts
**Dependencies**
- marketing.outreach_reply_publication
- LLM provider availability
- Public platform read endpoints
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R7**.
Why that ceiling: Monitoring reads public replies and writes internal rows; nothing is sent. Ownership stops short of R8/R9 because three of the highest-value platforms are manual-entry only, so the agent cannot claim complete coverage of its own domain.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Answers which threads are live and who replied, from stored events.

Acceptance: Every answer cites an openclaw_engagement_events row; no fetch occurs.
## Before you start
- LinkedIn, Reddit and Quora coverage depends on a human typing engagements in
- manager has not validated what counts as buying intent
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/openclaw/openclawEngagementMonitorAgent.ts:17
- backend/src/services/agents/openclaw/openclawEngagementFetcher.ts:286
- backend/src/services/agents/openclaw/openclawConversationTrackingService.ts:40
- backend/src/services/aiOpsScheduler.ts:246
- table: openclaw_engagement_events
- table: openclaw_conversations

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every answer cites an openclaw_engagement_events row; no fetch occurs.

When every box above is ticked, stop and show the demo.
