# marketing.CAP.social_signal_discovery.L3-TOOL-REQUEST — Public-platform buying-signal discovery · 3 · request the tool

**Ask for the tool, and let a human decide whether the agent may have it.**

File a tool request for this capability, and let it be decided. This is a real governance gate with a real human on the other side of it, not paperwork.

**How to file it.** Open the Change Requests page in the admin and file one against `marketing`, the domain you own. It posts to `POST /api/admin/agent-domain-change-requests-mine`. Sohail Syed or an admin decides it at `POST /api/admin/agent-domain-change-requests/:id/decide`. You cannot decide your own.

**The tools this capability was recorded as needing**
- platform_public_api_read_allowlisted
- read_marketing_database
- sandbox_database_write
- agent_activity_log_write

**What the request has to say**, and all of it comes from work you have already done:
- The exact thing the tool would do, in one sentence.
- Why it is needed, citing your step 1 run log -- what was slow, repetitive or error-prone.
- What you proved in step 2: that the product can already produce this outcome by hand, or exactly which gap stops it.
- The scope: what the tool may touch and what it must never touch.
- Who approves a run, and what happens when the tool is wrong.

Say explicitly which parts of the work the tool takes and which stay with a person.

**A declined request is a completed story.** The decision is the outcome, not the approval. Record what was decided and why, and if it was declined, what would have to change.

The four steps of this capability run in order. A later step opened before its predecessor is complete is the thing this ladder exists to prevent -- say so and go back rather than working ahead.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Public-platform buying-signal discovery
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.social_signal_discovery`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** inherited
## The business outcome
A continuously refreshed, de-duplicated pool of public posts and threads where an enterprise AI-leadership buyer is visibly asking the question Colaberry answers, so outreach starts from a real conversation instead of a cold list.
Intended users: Marketing manager, Marketing AI employee, Admissions (downstream lead consumer).
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Read the optimized scan config (keyword priority x platform priority) from accumulated learnings
- Issue read-only queries against each enabled platform's public API
- Normalise author, URL, body excerpt and platform into a signal row
- De-duplicate against existing signals before insert
- Leave every new row at 'discovered' for the triage capability to score
**Inputs**
- Target keyword set with learned weights
- Per-platform scan-frequency multipliers
- Public platform search/listing APIs (reddit, hackernews, devto, hashnode, discourse, twitter, bluesky, youtube, producthunt, facebook_groups, linkedin_comments)
**Outputs**
- openclaw_signals rows at status 'discovered'
- Per-platform scan telemetry
- Keyword-priority deltas fed back from openclaw_learning
**Exceptions that must be handled**
- A platform API returns 429 or 5xx: that platform is skipped for the tick, not retried unbounded
- A signal with no resolvable author identity is still stored but cannot be lead-captured
- Keyword weights are learned, so a cold start scans at flat weights
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- platform_public_api_read_allowlisted
- read_marketing_database
- sandbox_database_write
- agent_activity_log_write
**Application surfaces**
- /admin/intelligence (Outreach tab)
- /admin/marketing/performance (Outreach tab)
- GET /api/admin/openclaw/signals
- GET /api/admin/openclaw/signals/:id
- POST /api/admin/openclaw/scan
- POST /api/admin/openclaw/signals/submit
**Source modules**
- backend/src/services/agents/openclaw/openclawMarketSignalAgent.ts
- backend/src/services/agents/openclaw/openclawSignalScaler.ts
**Dependencies**
- Public platform API availability
- openclawRateLimiter for per-platform ceilings
- openclawCircuitBreaker for repeated-failure suppression
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R7**.
Why that ceiling: Discovery only reads public data and writes an internal signal table; no content leaves the system, so a scoped automation class is reachable. R8/R9 withheld because the scan hands work to a publication chain that is itself human-gated, and ownership of keyword policy has never been reviewed by the manager.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Answers 'where are buyers talking about this' from already-stored signals without scanning.

Acceptance: Every answer cites a stored openclaw_signals row id; zero outbound network calls in the trace.
## Before you start
- unbounded_network (platform scanning must stay on an explicit provider allow-list, never arbitrary fetch)
- manager has not validated the keyword or platform set
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/openclaw/openclawMarketSignalAgent.ts:19
- backend/src/services/agents/openclaw/openclawSignalScaler.ts:32
- backend/src/services/agents/openclaw/openclawSignalScaler.ts:126
- backend/src/services/aiOpsScheduler.ts:244
- backend/src/services/agentRegistrySeed.ts:1397
- table: openclaw_signals
- table: openclaw_learning

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] A change request for a tool exists against this domain, filed by the builder, naming the tool, its scope, what it must never touch, and who approves a run.
- [ ] The request cites the step 1 run log and the step 2 result as its evidence.
- [ ] A named human other than the builder has recorded a decision on it. A decline counts; an undecided request does not.

When every box above is ticked, stop and show the demo.
