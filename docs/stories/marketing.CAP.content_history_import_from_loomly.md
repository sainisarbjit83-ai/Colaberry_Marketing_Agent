# marketing.CAP.content_history_import_from_loomly — Content history import from the incumbent scheduler

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Years of calendars, posts and permalinks move off the third-party scheduler into the platform without a flag day and without a fabricated history, so retiring the tool does not mean losing the record.

**Built today:** partial. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- No export exists yet: the inventory's Found column is empty, which means not-yet-looked rather than none
- the calendar-to-brand mapping is an unmade ownership decision
- manager must supply the export; the build has no login to the incumbent tool

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Content history import from the incumbent scheduler
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.content_history_import_from_loomly`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** partial · **Source:** existing_application
## The business outcome
Years of calendars, posts and permalinks move off the third-party scheduler into the platform without a flag day and without a fabricated history, so retiring the tool does not mean losing the record.
Intended users: Marketing manager, Marketing AI employee, Executive.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Dry run first, printing every header the mapper did not recognise and every unknown calendar
- Map columns by header alias rather than position
- Import history as read-only items, and future schedules as drafts flagged needs-verification rather than queued
- Record published history with permalink or network id, marking weak keys where neither exists
- Apply with an explicit execute flag, after which a re-run imports nothing
**Inputs**
- A calendar export CSV from the incumbent tool
- A calendar-to-brand mapping
- Header aliases for unrecognised columns
**Outputs**
- Imported content items and variants
- External publication rows for published history
- An exception report naming every row that did not import cleanly
**Exceptions that must be handled**
- Analytics are deliberately NOT imported - nothing on this platform will display a number it did not measure, so the export file is kept for reference instead
- Imported schedules are never auto-queued; each is re-scheduled by a person through the composer
- Media bytes are not imported because there is no object storage in this repo; only URLs are kept
- An unmapped calendar name causes every row from it to be skipped as unknown_calendar rather than guessed into a brand
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- csv_export_file_read
- content_item_draft_write
- sandbox_database_write
**Application surfaces**
- /admin/marketing/content (imported items appear read-only)
- none - the importer is a script, not an endpoint
**Source modules**
- backend/src/services/marketing/loomlyImport.ts
- backend/src/services/marketing/loomlyImportService.ts
- backend/src/scripts/importLoomlyExport.ts
**Dependencies**
- marketing.publishing_calendar_operations_ownership
- marketing.brand_registry_and_readiness
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R4**.
Why that ceiling: A dry run is safe and repeatable. The execute step writes customer content history at scale and depends on a calendar-to-brand mapping that is a business decision, so it stays a human action; the ceiling is stateful sandbox work.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R2)**
Explains what would land where, per export category, from the mapping document.

Acceptance: Every category names its destination table or states explicitly that it is not imported.
## Before you start
- No export exists yet: the inventory's Found column is empty, which means not-yet-looked rather than none
- the calendar-to-brand mapping is an unmade ownership decision
- manager must supply the export; the build has no login to the incumbent tool
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/marketing/loomlyImport.ts:38
- backend/src/services/marketing/loomlyImportService.ts:33
- backend/src/scripts/importLoomlyExport.ts
- docs/marketing/LOOMLY_INVENTORY.md:1
- docs/marketing/LOOMLY_INVENTORY.md:14
- docs/marketing/LOOMLY_IMPORT_MAPPING.md
- table: content_items
- table: content_variants
- table: external_publications
- table: content_templates

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every category names its destination table or states explicitly that it is not imported.

When every box above is ticked, stop and show the demo.
