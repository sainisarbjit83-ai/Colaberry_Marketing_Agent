# marketing.CAP.publishing_calendar_operations_ownership — Day-to-day publishing calendar ownership and tool retirement

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

The person who actually runs the social calendars is the one who decides what goes out and when, and the move off the incumbent scheduler happens category by category with nothing lost.

**Built today:** unknown. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- No export has been produced, so discovery has not started
- the calendar-to-brand mapping is an unmade decision recorded as Ali's
- manager has not confirmed this is his responsibility in the AI-employee framing

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Day-to-day publishing calendar ownership and tool retirement
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.publishing_calendar_operations_ownership`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** unknown · **Source:** manager_defined
## The business outcome
The person who actually runs the social calendars is the one who decides what goes out and when, and the move off the incumbent scheduler happens category by category with nothing lost.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Export each category from the incumbent tool: calendars, connected accounts, users and approval flows, labels, content and media, templates, scheduled queue, post history, analytics, notes
- Record what was found per category rather than leaving the column empty
- Decide which calendars map to which brand
- Run the importer dry, triage its exceptions, then execute
- Re-schedule each imported future post by hand through the composer
**Inputs**
- The manager's own publishing plan
- The incumbent tool's exports, per category
- A calendar-to-brand mapping decision
**Outputs**
- A filled-in Stage A inventory
- A decided calendar-to-brand mapping
- A publishing plan expressed in the platform calendar rather than the incumbent tool
**Exceptions that must be handled**
- As recorded, nothing has been exported yet: an empty Found column means not-yet-looked, explicitly not none
- Brand and account ownership decisions are recorded as Ali's, not the marketing manager's, so this capability spans two humans
- Import execution and exception triage are recorded as Aleem's with a runbook
- The build has no login to the incumbent tool, so the export cannot be produced by an agent
- implementation_state is unknown because what exists in the incumbent tool has not been measured
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- csv_export_file_read
**Application surfaces**
- /admin/marketing/calendar
- /admin/marketing/content
- GET /api/admin/marketing/calendar
**Source modules**
- backend/src/scripts/importLoomlyExport.ts
- docs/marketing/LOOMLY_INVENTORY.md
**Dependencies**
- marketing.content_history_import_from_loomly
- marketing.marketing_calendar_planning
- Access to the incumbent tool
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R2**.
Why that ceiling: This is the manager's own job: deciding what the brand says and when. An agent can help inventory, map and explain; the plan and the mapping are human decisions, so the ceiling is answering from approved knowledge.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R2)**
Explains what lives in the incumbent tool, where each category lands, and what is not imported.

Acceptance: Every category states its destination or that it is deliberately not imported; nothing is reported as none that has not been looked at.
## Before you start
- No export has been produced, so discovery has not started
- the calendar-to-brand mapping is an unmade decision recorded as Ali's
- manager has not confirmed this is his responsibility in the AI-employee framing
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- docs/marketing/LOOMLY_INVENTORY.md:14
- docs/marketing/LOOMLY_INVENTORY.md:16
- docs/marketing/LOOMLY_INVENTORY.md:3
- docs/marketing/LOOMLY_INVENTORY.md:9
- docs/architecture/ai-workforce-management/AI_EMPLOYEE_ROSTER.md:30
- docs/architecture/ai-workforce-management/HUMAN_OWNERSHIP_MAP.md:12

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every category states its destination or that it is deliberately not imported; nothing is reported as none that has not been looked at.

When every box above is ticked, stop and show the demo.
