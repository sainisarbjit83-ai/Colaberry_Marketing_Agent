# marketing.CAP.marketing_department_strategy_planning — Marketing department strategy and initiative planning

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

The department's own health turns into a small number of named strategic initiatives with tickets attached, so improvement work is proposed on evidence rather than appearing in a meeting.

**Built today:** partial. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Initiative.status has no write path, so nothing can close what this creates
- manager has not validated what counts as a marketing strategic priority

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Marketing department strategy and initiative planning
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.marketing_department_strategy_planning`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** partial · **Source:** inherited
## The business outcome
The department's own health turns into a small number of named strategic initiatives with tickets attached, so improvement work is proposed on evidence rather than appearing in a meeting.
Intended users: Marketing manager, Marketing AI employee, Executive.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Evaluate department health from available signals
- Identify strategic opportunities
- Run an LLM strategy analysis over them
- Create a strategic initiative
- Generate initiative tickets for the work
**Inputs**
- Marketing department health signals
- Strategic opportunity candidates
- An LLM strategy analysis
**Outputs**
- Strategic initiatives for the marketing department
- Tickets generated from those initiatives
**Exceptions that must be handled**
- No recurring resolver is registered: Initiative.status has no write path in this codebase, so tickets stay open until a genuine terminal-state signal exists and are never time-closed
- This is one instance of a shared architect used across departments, so its behaviour is not marketing-specific code
- It has reports_to and tools_granted via the ticket-creator identity seed but no system_prompt and no persona_version, which is why the slice calls it an employee-candidate rather than an employee
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- llm_text_generation
- initiative_ticket_create
- proposed_agent_action_write
**Application surfaces**
- /admin/orchestration
- /admin/ticket-board
- none specific to marketing; initiatives surface through the shared orchestration routes
**Source modules**
- backend/src/services/agents/strategy/strategyArchitectAgent.ts
**Dependencies**
- Department health signals
- Ticket system availability
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R6**.
Why that ceiling: Proposing initiatives is reversible, but each one creates tickets that consume other people's time, and no resolver can close them - an unattended proposer with no terminal state accumulates permanent open work. A supervised pilot with a human accepting each initiative is the honest ceiling.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Explains the department's health signals and what they imply, without creating anything.

Acceptance: Every signal cited resolves to real data; no initiative or ticket is created.
## Before you start
- Initiative.status has no write path, so nothing can close what this creates
- manager has not validated what counts as a marketing strategic priority
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agentRegistrySeed.ts:1912
- backend/src/services/agentRegistrySeed.ts:1921
- backend/src/services/agents/strategy/strategyArchitectAgent.ts
- backend/src/services/aiOpsScheduler.ts:319
- backend/src/services/agentBlueprint/ticketCreatorIdentitySeed.ts:221
- backend/src/scripts/lib/agentTicketStandardChecks.ts:309
- table: initiatives

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every signal cited resolves to real data; no initiative or ticket is created.

When every box above is ticked, stop and show the demo.
