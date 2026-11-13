# marketing.CAP.content_repurposing_and_template_library — Content repurposing and reusable template library

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

One substantial asset - a case study, a class, a published outcome - becomes a month of multi-channel content from reusable templates, so output stops depending on someone starting from a blank page.

**Built today:** absent. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- No template authoring surface exists
- manager has not defined the channel patterns or the cadence a template should express

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Content repurposing and reusable template library
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.content_repurposing_and_template_library`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** absent · **Source:** proposed_new
## The business outcome
One substantial asset - a case study, a class, a published outcome - becomes a month of multi-channel content from reusable templates, so output stops depending on someone starting from a blank page.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Register the source asset and the claims it supports
- Apply a template per target channel to derive a draft
- Carry a provenance link from each derived item back to the source
- Run each derived draft through governance and platform-fitness validation as normal
- Place the set on the calendar for a human to approve item by item
**Inputs**
- A source asset with verified claims
- A template defining a channel pattern and a cadence
- The brand's governance rules
**Outputs**
- A set of linked content items derived from one source
- A reusable template library
- A provenance link from each derived item back to its source
**Exceptions that must be handled**
- A derived item must not assert anything the source does not support; provenance exists so that is checkable rather than trusted
- The template table exists but has no importer and no authoring surface, so templates are currently re-created by hand
- A set of twenty derived drafts still needs twenty approvals - repurposing changes authoring effort, not the approval gate
- implementation_state is absent: the table is not the capability
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- llm_text_generation
- read_marketing_database
- content_item_draft_write
- brand_governance_rules_read
**Application surfaces**
- /admin/marketing/composer
- /admin/marketing/calendar
- POST /api/admin/content
- POST /api/admin/content/:id/variants/generate
**Source modules**
- backend/src/services/content/composerVariants.ts
- backend/src/models/ContentTemplate.ts
**Dependencies**
- marketing.content_composition_and_variant_generation
- marketing.brand_governance_enforcement
- marketing.content_approval_workflow
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R7**.
Why that ceiling: Deriving drafts is reversible and every derived item still passes the existing approval gate, so a scoped automation class is reachable. Authoring the templates is brand work and stays with the manager.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R0)**
Defines which assets are repurposable, into which channels, and who approves the set.

Acceptance: Each template pattern names its channel, its cadence and its approver.
## Before you start
- No template authoring surface exists
- manager has not defined the channel patterns or the cadence a template should express
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/models/ContentTemplate.ts:54
- docs/marketing/LOOMLY_INVENTORY.md:3
- backend/src/services/content/composerVariants.ts:91
- backend/src/services/marketing/landingPageDraftService.ts:46
- table: content_templates
- table: content_items

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Each template pattern names its channel, its cadence and its approver.

When every box above is ticked, stop and show the demo.
