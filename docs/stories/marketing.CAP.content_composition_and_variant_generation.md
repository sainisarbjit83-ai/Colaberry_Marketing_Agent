# marketing.CAP.content_composition_and_variant_generation — Multi-network content composition

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

One idea becomes a per-network post - text, media, links, polls - drafted in a single guided flow, so publishing to five places does not mean rewriting five times.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- manager has not validated brand voice, tone or the default network set

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Multi-network content composition
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.content_composition_and_variant_generation`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** existing_application
## The business outcome
One idea becomes a per-network post - text, media, links, polls - drafted in a single guided flow, so publishing to five places does not mean rewriting five times.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Set up the item: brand, campaign, type, target networks
- Draft or generate the base message
- Generate a per-provider variant and allow per-provider edit or revert
- Attach media and, where supported, a poll
- Record every edit through the workflow service so the revision counter moves
**Inputs**
- A brand, a campaign and a content type
- A base message or a generation brief
- Selected target providers
- Media assets and a poll spec where applicable
**Outputs**
- A content_items row with a revision counter
- One content_variants row per provider
- An audited edit trail
**Exceptions that must be handled**
- An imported history item is read-only in the composer and any edit or transition returns a conflict
- An edit after approval moves the revision and therefore invalidates the approval rather than silently publishing unreviewed copy
- Variant generation is per provider, so a provider added later needs its own variant
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- llm_text_generation
- read_marketing_database
- content_item_draft_write
- media_asset_attach
- brand_governance_rules_read
**Application surfaces**
- /admin/marketing/composer
- /admin/marketing/composer/:id
- POST /api/admin/content
- GET /api/admin/content
- GET /api/admin/content/:id
- PATCH /api/admin/content/:id
- POST /api/admin/content/draft-message
- POST /api/admin/content/:id/variants/generate
- PATCH /api/admin/content/:id/variants/:provider
- POST /api/admin/content/:id/variants/:provider/revert
- POST /api/admin/content/:id/links
- GET /api/admin/content/:id/media
**Source modules**
- backend/src/services/content/composerService.ts
- backend/src/services/content/composerVariants.ts
- backend/src/services/content/composerEdits.ts
- backend/src/services/content/contentWorkflowService.ts
**Dependencies**
- marketing.brand_registry_and_readiness
- marketing.content_platform_fitness_validation
- LLM provider availability
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R7**.
Why that ceiling: Composing is fully reversible: an item stays a draft until a separate approval and a separate publish act on it. A scoped automation class is therefore reachable for drafting, and the two gates downstream are what keep it safe.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R1)**
Builds items and variants in isolation against fixtures with a baseline suite.

Acceptance: Every provider in the target set gets a variant; revision increments on every recorded edit.
## Before you start
- manager has not validated brand voice, tone or the default network set
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- frontend/src/pages/admin/marketing/composer/AdminContentComposerPage.tsx
- frontend/src/pages/admin/marketing/composer/ComposerSetup.tsx
- frontend/src/pages/admin/marketing/composer/ComposerVariants.tsx
- frontend/src/routes/adminRoutes.tsx:250
- backend/src/services/content/composerService.ts:65
- backend/src/services/content/composerVariants.ts:91
- backend/src/services/content/composerDraftService.ts
- backend/src/services/content/contentWorkflowService.ts:87
- backend/src/routes/admin/contentComposerRoutes.ts:184
- backend/src/routes/admin/contentComposerRoutes.ts:288
- table: content_items
- table: content_variants
- table: content_item_media

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every provider in the target set gets a variant; revision increments on every recorded edit.

When every box above is ticked, stop and show the demo.
