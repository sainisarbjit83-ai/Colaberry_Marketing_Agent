# marketing.CAP.marketing_surface_problem_reporting — In-surface problem reporting for marketing operators

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

When the marketing tooling does something wrong, the operator reports it from the screen they were on with the context already attached, instead of describing it from memory later.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- live_email (the report delivery path sends real mail and must stay a human-initiated action)
- manager has not validated where reports should be routed

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# In-surface problem reporting for marketing operators
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.marketing_surface_problem_reporting`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** existing_application
## The business outcome
When the marketing tooling does something wrong, the operator reports it from the screen they were on with the context already attached, instead of describing it from memory later.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Capture the current page, brand scope and selected entity without asking the operator to retype it
- Take the operator's description
- Assemble a structured report
- Deliver it to the engineering owner
- Confirm receipt to the operator so they know it went
**Inputs**
- The operator's description
- The page, brand and selected item context captured automatically
**Outputs**
- A structured problem report delivered to the engineering owner
**Exceptions that must be handled**
- Report delivery uses the platform's mail path, which is a live outbound channel and therefore not an agent action
- A report with no description still carries its context, which is better than nothing
- The control exists specifically because the marketing surface was handed to operators who are not engineers
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
**Application surfaces**
- every page under /admin/marketing
- POST /api/admin/marketing/bug-report
**Source modules**
- frontend/src/pages/admin/marketing/bugReport/ReportAProblem.tsx
- backend/src/services/marketing/bugReportEmail.ts
**Dependencies**
- Platform mail transport
- marketing.marketing_overview_and_attention_triage
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R2**.
Why that ceiling: The useful agent role here is reading reports and spotting patterns across them. Submitting one sends live mail, which is a denied capability for an agent, so the ceiling is answering from stored reports.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Summarises what operators have reported and what recurs.

Acceptance: Every pattern claim cites the reports behind it; no mail is sent in the trace.
## Before you start
- live_email (the report delivery path sends real mail and must stay a human-initiated action)
- manager has not validated where reports should be routed
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- frontend/src/pages/admin/marketing/bugReport/ReportAProblem.tsx
- frontend/src/pages/admin/marketing/bugReport/reportContext.ts
- backend/src/routes/admin/marketingBugReportRoutes.ts:133
- backend/src/services/marketing/bugReportEmail.ts:27
- docs/sessions/CC-20260909-m4kt.md:3972

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every pattern claim cites the reports behind it; no mail is sent in the trace.

When every box above is ticked, stop and show the demo.
