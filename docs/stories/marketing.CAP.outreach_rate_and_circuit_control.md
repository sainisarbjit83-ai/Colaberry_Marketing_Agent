# marketing.CAP.outreach_rate_and_circuit_control — Outreach rate limiting and circuit breaking

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Colaberry never looks like a spammer on a platform, and a platform that starts rejecting us is backed away from automatically rather than hammered until the account is blocked.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Limits are per strategy and cannot currently be set per brand
- manager has not validated the posting volume the limits permit

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Outreach rate limiting and circuit breaking
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.outreach_rate_and_circuit_control`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** existing_application
## The business outcome
Colaberry never looks like a spammer on a platform, and a platform that starts rejecting us is backed away from automatically rather than hammered until the account is blocked.
Intended users: Marketing manager, Marketing AI employee, Platform reliability owner.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Count posts already made on the platform in the current hour and day
- Compare against the strategy's own rate limits
- Independently compute the platform's circuit state from the last hour of task outcomes
- Deny assignment while the circuit is open, allowing a trial call when it half-opens
- Expose both states for a human to read on the dashboard
**Inputs**
- Per-strategy hourly and daily posting limits
- Recent task success and failure counts per platform
- Posted-at timestamps on responses
**Outputs**
- An allow/deny verdict before any post is attempted
- A CLOSED / OPEN / HALF_OPEN circuit state per platform
- Alerts when a circuit opens
**Exceptions that must be handled**
- The circuit breaker derives state from existing task rows rather than a new table, so there is no separate state to drift
- Limits are per strategy, not per brand, so two brands on one platform share a ceiling
- A manual post made outside the system is invisible to the counter
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- circuit_breaker_state_read
- agent_activity_log_write
**Application surfaces**
- /admin/intelligence (Outreach tab, Dashboard and Settings)
- GET /api/admin/openclaw/circuit-status
- GET /api/admin/openclaw/rate-limits
- GET /api/admin/openclaw/config
- POST /api/admin/openclaw/config
**Source modules**
- backend/src/services/agents/openclaw/openclawRateLimiter.ts
- backend/src/services/agents/openclaw/openclawCircuitBreaker.ts
- backend/src/services/agents/openclaw/openclawRiskClassifier.ts
**Dependencies**
- marketing.outreach_queue_supervision
- Task and response tables
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R9**.
Why that ceiling: This is a pure safety control computed from existing rows, with no content and no outbound action of its own. Operational ownership is the point of it, so R9 is the destination rather than a concession.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Reports how much posting headroom remains per platform.

Acceptance: Counts reconcile to openclaw_responses.posted_at; no verdict is cached.
## Before you start
- Limits are per strategy and cannot currently be set per brand
- manager has not validated the posting volume the limits permit
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/openclaw/openclawRateLimiter.ts:30
- backend/src/services/agents/openclaw/openclawRateLimiter.ts:74
- backend/src/services/agents/openclaw/openclawCircuitBreaker.ts:51
- backend/src/services/agents/openclaw/openclawCircuitBreaker.ts:142
- backend/src/services/agents/openclaw/openclawPlatformStrategy.ts:453
- backend/src/services/agents/openclaw/openclawRiskClassifier.ts:46
- backend/src/routes/admin/openclawRoutes.ts:2133
- backend/src/routes/admin/openclawRoutes.ts:2146

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Counts reconcile to openclaw_responses.posted_at; no verdict is cached.

When every box above is ticked, stop and show the demo.
