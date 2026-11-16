# marketing.CAP.browser_session_reliability — Headless browser session health and self-healing

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

The browser identities the outreach pipeline depends on stay usable, so a captcha or a crashed session is detected and healed instead of silently stopping all posting.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Credential expiry cannot be self-healed and escalates to a human reconnection
- manager has not validated the auto-restart policy

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Headless browser session health and self-healing
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.browser_session_reliability`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** inherited
## The business outcome
The browser identities the outreach pipeline depends on stay usable, so a captcha or a crashed session is detected and healed instead of silently stopping all posting.
Intended users: Marketing manager, Marketing AI employee, Platform reliability owner.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Read session health scores and recent error counts
- Pause tasks on any platform whose session is captcha-blocked
- Restart sessions below the health threshold when auto-restart is enabled
- Raise a ticket for a session that keeps failing after restart
- Leave the session's health history intact for the learning loop
**Inputs**
- openclaw_sessions health scores and error counts
- A health threshold and a consecutive-error ceiling
- An auto-restart flag
**Outputs**
- Restarted or quarantined sessions
- Paused tasks for a captcha-blocked platform
- Tickets for persistent failures
**Exceptions that must be handled**
- A captcha block pauses work rather than retrying, because retrying trains the block
- Auto-restart is configurable and can be switched off
- A session whose credentials have expired cannot be healed here and needs a human reconnection
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- headless_browser_sandbox
- sandbox_database_write
- agent_activity_log_write
**Application surfaces**
- /admin/intelligence (Outreach tab, Settings)
- GET /api/admin/openclaw/sessions
- GET /api/admin/openclaw/platform-status
**Source modules**
- backend/src/services/agents/openclaw/openclawInfraMonitorAgent.ts
**Dependencies**
- Headless browser availability
- marketing.channel_account_connection_and_credential_custody
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R9**.
Why that ceiling: Session healing is internal infrastructure recovery with no content and no outbound message. It is the clearest candidate in the domain for genuine operational ownership, provided credential replacement stays a human action.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Reports which sessions are unhealthy and why.

Acceptance: Health verdicts reproduce from openclaw_sessions; no restart is attempted.
## Before you start
- Credential expiry cannot be self-healed and escalates to a human reconnection
- manager has not validated the auto-restart policy
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/openclaw/openclawInfraMonitorAgent.ts:9
- backend/src/services/agents/openclaw/openclawInfraMonitorAgent.ts:21
- backend/src/services/agentRegistrySeed.ts:1489
- backend/src/services/aiOpsScheduler.ts:253
- table: openclaw_sessions

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Health verdicts reproduce from openclaw_sessions; no restart is attempted.

When every box above is ticked, stop and show the demo.
