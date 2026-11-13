# marketing.CAP.social_signal_discovery.L1-BY-HAND — Public-platform buying-signal discovery · 1 · do it by hand

**Understand the work by doing it yourself, before anything automates it.**

Do this capability yourself, by hand, once, end to end. Not a simulation and not a description -- the real task, with the real inputs, producing the real outcome.

**The outcome you are producing**
A continuously refreshed, de-duplicated pool of public posts and threads where an enterprise AI-leadership buyer is visibly asking the question Colaberry answers, so outreach starts from a real conversation instead of a cold list.

**The workflow as it was recorded during research.** Treat this as a claim to be tested, not as instructions. Where it is wrong or incomplete, that difference is the single most valuable thing this story produces.
- Read the optimized scan config (keyword priority x platform priority) from accumulated learnings
- Issue read-only queries against each enabled platform's public API
- Normalise author, URL, body excerpt and platform into a signal row
- De-duplicate against existing signals before insert
- Leave every new row at 'discovered' for the triage capability to score

**What goes in**
- Target keyword set with learned weights
- Per-platform scan-frequency multipliers
- Public platform search/listing APIs (reddit, hackernews, devto, hashnode, discourse, twitter, bluesky, youtube, producthunt, facebook_groups, linkedin_comments)

**What comes out**
- openclaw_signals rows at status 'discovered'
- Per-platform scan telemetry
- Keyword-priority deltas fed back from openclaw_learning

**Exceptions the research expects you to hit**
- A platform API returns 429 or 5xx: that platform is skipped for the tick, not retried unbounded
- A signal with no resolvable author identity is still stored but cannot be lead-captured
- Keyword weights are learned, so a cold start scans at flat weights

**Write a run log.** It is the deliverable of this story and every later step cites it. Record the date, how long it actually took, each step you really performed, every judgment call you made and what you based it on, and at least one thing that was harder, slower or more ambiguous than the workflow above implies.

While you work, keep asking which parts are mechanical and which need judgment. That split is what the tool request in step 3 will be argued from.

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

- [ ] The capability was performed end to end by hand, producing its real outcome on real inputs.
- [ ] A run log exists recording the date, the elapsed time, each step actually performed, every judgment call made, and at least one way the recorded workflow differed from what the work was really like.

When every box above is ticked, stop and show the demo.
