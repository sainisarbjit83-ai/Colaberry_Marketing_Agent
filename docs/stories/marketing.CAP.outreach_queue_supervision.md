# marketing.CAP.outreach_queue_supervision — Outreach work-queue supervision and recovery

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

The outreach pipeline keeps moving without a person watching it: stuck work is released, failures are retried within limits, and a blocked platform stops being hammered.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- manager has not validated concurrency ceilings or stuck-task thresholds

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Outreach work-queue supervision and recovery
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.outreach_queue_supervision`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** inherited
## The business outcome
The outreach pipeline keeps moving without a person watching it: stuck work is released, failures are retried within limits, and a blocked platform stops being hammered.
Intended users: Marketing manager, Marketing AI employee, Platform reliability owner.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Cancel or retry tasks that have been 'running' past the stuck threshold
- Consult the circuit breaker and rate limiter before assigning anything new
- Assign pending tasks up to the per-platform concurrency ceiling
- Expire signals and failed rows that are past their useful life
- Leave a per-run record of what was released, retried and cleaned
**Inputs**
- Task rows in running / pending / failed states
- Max-concurrency and stuck-task thresholds
- Circuit-breaker and rate-limiter state
**Outputs**
- Cancelled or retried stuck tasks
- Newly assigned tasks up to the concurrency ceiling
- Expired signals and cleaned-up queue rows
**Exceptions that must be handled**
- A platform with an open circuit receives no new assignments until the breaker half-opens
- Retries are capped; an exhausted task dead-letters rather than cycling
- The Skool supervisor loads its models through a guarded require, so a missing model degrades rather than crashing the tick
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- openclaw_task_queue_write
- circuit_breaker_state_read
- agent_activity_log_write
**Application surfaces**
- /admin/intelligence (Outreach tab, Dashboard)
- GET /api/admin/openclaw/tasks
- GET /api/admin/openclaw/circuit-status
- GET /api/admin/openclaw/rate-limits
**Source modules**
- backend/src/services/agents/openclaw/openclawSupervisorAgent.ts
- backend/src/services/agents/skool/skoolSupervisorAgent.ts
**Dependencies**
- marketing.outreach_rate_and_circuit_control
- Task tables
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R9**.
Why that ceiling: This is internal queue mechanics with no outbound side effect, an existing circuit breaker and an existing rate limiter - the one capability in this domain whose whole purpose is reliable operation, monitoring and recovery, so R9 is the right destination rather than a stretch.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Reports queue depth, stuck counts and breaker state from stored rows.

Acceptance: Figures reconcile to openclaw_tasks and skool_tasks; nothing is mutated.
## Before you start
- manager has not validated concurrency ceilings or stuck-task thresholds
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/openclaw/openclawSupervisorAgent.ts:12
- backend/src/services/agents/openclaw/openclawSupervisorAgent.ts:24
- backend/src/services/agents/skool/skoolSupervisorAgent.ts:25
- backend/src/services/agents/openclaw/openclawCircuitBreaker.ts:142
- backend/src/services/aiOpsScheduler.ts:243
- backend/src/services/aiOpsScheduler.ts:258
- table: openclaw_tasks
- table: skool_tasks

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Figures reconcile to openclaw_tasks and skool_tasks; nothing is mutated.

When every box above is ticked, stop and show the demo.
