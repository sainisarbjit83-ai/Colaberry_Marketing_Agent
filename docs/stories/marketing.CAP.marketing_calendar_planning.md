# marketing.CAP.marketing_calendar_planning — Marketing calendar and scheduled-content planning

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Everybody can see what is going out, on which brand and network, in one month view in Central time - so the plan is a shared artefact rather than something in one person's head or a third-party tool.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- No per-user or per-manager timezone field exists anywhere in the platform, so a non-Central operator cannot be scheduled for safely
- manager has not validated the publishing cadence the calendar should express

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Marketing calendar and scheduled-content planning
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.marketing_calendar_planning`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** existing_application
## The business outcome
Everybody can see what is going out, on which brand and network, in one month view in Central time - so the plan is a shared artefact rather than something in one person's head or a third-party tool.
Intended users: Marketing manager, Marketing AI employee, Executive.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Take the brand from the shell rather than asking again
- Fetch scheduled and published items for the requested month
- Convert every timestamp into Central time once, in one place
- Lay out the month grid and place each item on its day
- Link each item to the composer so the plan is editable from the view
**Inputs**
- Scheduled and published content for the selected brand
- A month window
- Central-time conversion rules
**Outputs**
- A month grid of planned and published items per day
- A per-item state badge an operator can act from
**Exceptions that must be handled**
- Every time in this surface is Central; there is no per-user timezone anywhere in the platform today
- A handoff item appears on the calendar at its intended time even though a person must publish it
- An item with no schedule appears as unscheduled rather than today
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
**Application surfaces**
- /admin/marketing/calendar
- GET /api/admin/marketing/calendar
**Source modules**
- frontend/src/pages/admin/marketing/AdminMarketingCalendarPage.tsx
- frontend/src/pages/admin/marketing/monthGrid.ts
- frontend/src/pages/admin/marketing/calendarTime.ts
**Dependencies**
- marketing.content_composition_and_variant_generation
- marketing.brand_social_publishing
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R7**.
Why that ceiling: The calendar is a read surface over content and job state. An agent can own keeping it accurate and explaining it; choosing what goes on it is planning work that stays with the manager, and scheduling is timezone-unsafe for anyone outside Central.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Answers what is going out this week, on which brand and network.

Acceptance: Every item cited exists with that schedule; all times stated in Central and labelled as such.
## Before you start
- No per-user or per-manager timezone field exists anywhere in the platform, so a non-Central operator cannot be scheduled for safely
- manager has not validated the publishing cadence the calendar should express
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- frontend/src/pages/admin/marketing/AdminMarketingCalendarPage.tsx
- frontend/src/pages/admin/marketing/MonthView.tsx
- frontend/src/pages/admin/marketing/calendarTime.ts
- frontend/src/pages/admin/marketing/centralTime.ts
- frontend/src/pages/admin/marketing/monthGrid.ts
- frontend/src/routes/adminRoutes.tsx:247
- backend/src/routes/admin/marketingRoutes.ts:139
- table: content_items
- table: publishing_jobs

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every item cited exists with that schedule; all times stated in Central and labelled as such.

When every box above is ticked, stop and show the demo.
