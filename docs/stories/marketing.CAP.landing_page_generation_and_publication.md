# marketing.CAP.landing_page_generation_and_publication — Landing page generation and publication

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

A campaign gets a real, branded landing page from a content brief in minutes, previewable before it is public, so paid and organic traffic has somewhere credible to land.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- push_to_protected_main (a generated page must never be committed straight to a protected branch)
- production_deploy (publishing a page must not carry a deploy)
- every generated claim must be read against the author's brief before publish
- manager has not validated the generator's copy latitude

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Landing page generation and publication
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.landing_page_generation_and_publication`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** existing_application
## The business outcome
A campaign gets a real, branded landing page from a content brief in minutes, previewable before it is public, so paid and organic traffic has somewhere credible to land.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Take the brief and draft the page's sections in the author's order
- Render against the brand theme
- Expose a preview before anything is public
- Publish on an explicit action, and allow unpublish
- Commit the generated page to the repository where that is the delivery mechanism
**Inputs**
- A content brief with sections and bullets
- A brand theme and domain
- A slug
**Outputs**
- A draft landing page
- A preview a human can read before publishing
- A published public page
- A repo commit where the page is committed as source
**Exceptions that must be handled**
- RECORDED DEFECT from the first real run on a manager's brief: the generator invented one-line detail copy on all eight bullets that the author did not write, and dropped the author's eighth bullet - so generated copy must be read against the brief, not trusted
- Publishing puts a page on a public domain and is irreversible in the sense that it can be indexed before it is unpublished
- A slug collision must be resolved before publish, not after
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- llm_text_generation
- read_marketing_database
- content_item_draft_write
- landing_page_preview_render
- repo_branch_commit_sandbox
**Application surfaces**
- /admin/marketing/landing-pages
- /admin/marketing/composer (inline builder)
- POST /api/admin/landing-pages
- GET /api/admin/landing-pages
- POST /api/admin/landing-pages/:id/revise
- PATCH /api/admin/landing-pages/:id
- GET /api/admin/landing-pages/:id/preview
- POST /api/admin/landing-pages/:id/publish
- POST /api/admin/landing-pages/:id/unpublish
**Source modules**
- backend/src/services/marketing/landingPageDraftService.ts
- backend/src/services/marketing/landingPageRenderer.ts
- backend/src/services/marketing/landingPageRepoService.ts
**Dependencies**
- marketing.brand_registry_and_readiness
- marketing.banned_copy_compliance_scanning
- LLM provider availability
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R5**.
Why that ceiling: Drafting and previewing can be automated. Putting a page on a public Colaberry domain is a published claim about the business, and the generator has a recorded history of inventing copy nobody wrote, so publication stays a human decision and the ceiling is shadow mode.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R1)**
Generates pages in isolation from fixture briefs with a baseline render suite.

Acceptance: Every section in the brief appears; a count of generated sentences not present in the brief is reported, not hidden.
## Before you start
- push_to_protected_main (a generated page must never be committed straight to a protected branch)
- production_deploy (publishing a page must not carry a deploy)
- every generated claim must be read against the author's brief before publish
- manager has not validated the generator's copy latitude
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/marketing/landingPageDraftService.ts:46
- backend/src/services/marketing/landingPageRenderer.ts:56
- backend/src/services/marketing/landingPageRepoService.ts:49
- backend/src/services/marketing/landingPageSelection.ts:30
- backend/src/services/marketing/landingPageTheme.ts:28
- backend/src/routes/admin/landingPageRoutes.ts:139
- backend/src/routes/admin/landingPageRoutes.ts:256
- backend/src/routes/admin/landingPageRoutes.ts:299
- backend/src/routes/admin/landingPageRoutes.ts:391
- backend/src/routes/publicLandingPageRoutes.ts
- frontend/src/pages/admin/marketing/AdminLandingPagesPage.tsx
- frontend/src/pages/admin/marketing/composer/InlineLandingPageBuilder.tsx
- frontend/src/routes/adminRoutes.tsx:259
- table: landing_pages
- docs/sessions/CC-20260909-m4kt.md:3713

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every section in the brief appears; a count of generated sentences not present in the brief is reported, not hidden.

When every box above is ticked, stop and show the demo.
