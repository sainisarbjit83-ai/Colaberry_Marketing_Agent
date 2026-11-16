# marketing.CAP.outreach_reply_publication — Approved reply publication to public platforms

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

An approved reply actually appears, verifiably, on the platform it was written for - with the posted URL and a screenshot recorded - so outreach effort converts into visible presence and an audit trail.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- live_email is not required here, but public posting is the same class of irrevocable outbound and is treated the same way
- marketing.outreach_human_approval_gap_closure
- no manager-visible Skool surface exists to supervise the Skool half
- manager has not authorised any platform for unattended posting

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Approved reply publication to public platforms
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.outreach_reply_publication`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** inherited
## The business outcome
An approved reply actually appears, verifiably, on the platform it was written for - with the posted URL and a screenshot recorded - so outreach effort converts into visible presence and an audit trail.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Claim a post_response task whose response row is at 'approved'
- Check the rate limiter and circuit breaker for the target platform
- Attempt the platform API path first
- Fall back to the headless-browser path for platforms with no API, then to the manual queue
- Record the resulting URL, screenshot and outcome
**Inputs**
- A post_response task created only by a human approval
- Platform API credentials or a browser profile with injected cookies
- Rate-limit and circuit-breaker clearance
**Outputs**
- A live public comment or post
- The posted URL stored on the response row
- A screenshot artefact for browser-posted content
- Task success/failure recorded for the circuit breaker
**Exceptions that must be handled**
- OpenClaw: POST /api/admin/openclaw/responses/:id/approve is the only thing that creates the task, and it requires a human (openclawRoutes.ts:336)
- KNOWN DEFECT: the Skool worker consumes post_status 'approved' set by its own quality gate, so Skool publishes with no human in the loop
- KNOWN DEFECT: openclawContentResponseAgent self-approves on non-HUMAN_EXECUTION platforms, so some OpenClaw posts also reach this worker ungated
- A permanent platform rejection dead-letters; a transient one retries under a cap
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- headless_browser_sandbox
- sandbox_social_post_dry_run
- screenshot_capture
- read_marketing_database
- sandbox_database_write
**Application surfaces**
- /admin/intelligence (Outreach tab, Task Queue)
- /admin/content-queue
- POST /api/admin/openclaw/responses/:id/approve
- POST /api/admin/openclaw/responses/:id/post-via-browser
- POST /api/admin/openclaw/responses/:id/mark-posted
- POST /api/admin/content-queue/:id/posted
**Source modules**
- backend/src/services/agents/openclaw/openclawBrowserWorkerAgent.ts
- backend/src/services/agents/skool/skoolBrowserWorkerAgent.ts
- backend/src/services/agents/openclaw/openclawBrowserPostingService.ts
- backend/src/services/agents/openclaw/openclawPlatformPostingService.ts
**Dependencies**
- marketing.outreach_quality_gate
- marketing.outreach_rate_and_circuit_control
- Platform credentials in the credential vault
- Headless browser availability
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R5**.
Why that ceiling: Publishing under the Colaberry name on a third-party platform is irreversible in practice and visible to strangers. The platform's own HITL rule already makes a public social post always require a human yes (agentAutonomy.ts:123). The ceiling is therefore shadow mode; R6 and above would each need a separate, explicit manager authorisation per platform.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R3)**
Posts to a sandbox or test community on an explicit, user-initiated request.

Acceptance: Every post traces to a named human action; no scheduled run publishes anything.
## Before you start
- live_email is not required here, but public posting is the same class of irrevocable outbound and is treated the same way
- marketing.outreach_human_approval_gap_closure
- no manager-visible Skool surface exists to supervise the Skool half
- manager has not authorised any platform for unattended posting
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/openclaw/openclawBrowserWorkerAgent.ts:18
- backend/src/services/agents/skool/skoolBrowserWorkerAgent.ts:36
- backend/src/services/agents/skool/skoolBrowserWorkerAgent.ts:71
- backend/src/services/agents/openclaw/openclawBrowserPostingService.ts:54
- backend/src/services/agents/openclaw/openclawPlatformPostingService.ts:25
- backend/src/routes/admin/openclawRoutes.ts:336
- backend/src/routes/admin/openclawRoutes.ts:615
- backend/src/services/agentAutonomy.ts:123
- table: openclaw_tasks
- table: openclaw_responses

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every post traces to a named human action; no scheduled run publishes anything.

When every box above is ticked, stop and show the demo.
