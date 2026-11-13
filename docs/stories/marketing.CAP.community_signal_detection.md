# marketing.CAP.community_signal_detection — Skool community question detection

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Colaberry sees every genuine question asked in the AI Automation Agency Hub community within half an hour, so the brand shows up where practitioners already gather rather than paying for attention.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Skool has no admin UI, so a manager cannot currently see or stop this except through the agent enable flag
- unbounded_network (browser navigation must stay inside the configured community)
- manager has not validated category scope or daily caps

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Skool community question detection
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.community_signal_detection`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** inherited
## The business outcome
Colaberry sees every genuine question asked in the AI Automation Agency Hub community within half an hour, so the brand shows up where practitioners already gather rather than paying for attention.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Check the SKOOL_ENABLED gate and the daily cap before any navigation
- Drive a headless browser through each configured category of the community
- Extract post author, title, body and timestamp
- Score each post with the deterministic category scorer and drop anything under the engage threshold
- Insert surviving posts as skool_signals and enqueue a reply-generation task
**Inputs**
- Per-category scrape configuration and daily caps
- SKOOL_ENABLED flag
- Skool session credentials
**Outputs**
- skool_signals rows with a deterministic engagement score
- skool_tasks rows of kind generate_reply
**Exceptions that must be handled**
- Login fails or the layout changes: the run records a failure and no partial signal set is treated as complete
- A post already stored is skipped, so re-running the scrape is safe
- Daily cap reached: scanning stops rather than queueing work that cannot be acted on
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- headless_browser_sandbox
- read_marketing_database
- sandbox_database_write
- credential_vault_read_scoped
**Application surfaces**
- none - there is no Skool admin screen anywhere in frontend/src
- none - Skool has no route file; it is scheduler-driven only
**Source modules**
- backend/src/services/agents/skool/skoolSignalDetectionAgent.ts
- backend/src/services/agents/skool/skoolPlatformStrategy.ts
**Dependencies**
- Skool account session
- Headless browser availability
- skoolSupervisorAgent for stuck-task recovery
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R6**.
Why that ceiling: A credentialed headless browser acting inside a third-party community is a terms-of-service surface, not just a read. It is capped at a separately approved supervised pilot because the account being driven is a real Colaberry identity and a scraping block would be visible to the community, not only to us.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Reports which community categories were scanned and what was found, from stored rows only.

Acceptance: Every claim resolves to a skool_signals row; no browser is launched.
## Before you start
- Skool has no admin UI, so a manager cannot currently see or stop this except through the agent enable flag
- unbounded_network (browser navigation must stay inside the configured community)
- manager has not validated category scope or daily caps
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/skool/skoolSignalDetectionAgent.ts:327
- backend/src/services/agents/skool/skoolPlatformStrategy.ts:24
- backend/src/services/aiOpsScheduler.ts:259
- table: skool_signals
- table: skool_tasks
- .loop-architect/runs/20261007-school-agent-factory/legacy-slices/marketing.json (source: production_only)

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every claim resolves to a skool_signals row; no browser is launched.

When every box above is ticked, stop and show the demo.
