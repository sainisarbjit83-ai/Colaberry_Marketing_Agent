# marketing.CAP.brand_registry_and_readiness — Brand registry and publish readiness

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Every piece of marketing work is attached to a named brand that is demonstrably ready to publish - accounts connected, governance rules in place - so nothing is produced for a brand that cannot ship it.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- manager has not validated which brands the marketing AI employee may act for

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Brand registry and publish readiness
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.brand_registry_and_readiness`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** existing_application
## The business outcome
Every piece of marketing work is attached to a named brand that is demonstrably ready to publish - accounts connected, governance rules in place - so nothing is produced for a brand that cannot ship it.
Intended users: Marketing manager, Marketing AI employee, Executive.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- List the brands a marketing operator may act for
- Show, per brand, which networks are connected and whether each connection is healthy
- Show whether governance rules have been published for the brand
- Let an operator select the working brand once, in the shell, rather than on every page
- Carry that selection into the composer, calendar, content queue and publishing queue
**Inputs**
- Brand name, slug, domain and theme
- Connected channel accounts per brand
- Published governance rules per brand
**Outputs**
- A readiness verdict per brand
- The brand scope every marketing page inherits from the shell
**Exceptions that must be handled**
- /admin/brands is kept as a query-preserving redirect, not deleted, because the LinkedIn OAuth callback returns the browser to it
- A brand with no governance rows reads as rulesVersion 0, which must be treated as ungoverned rather than compliant
- Brand selection is per operator session, not per agent
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- brand_governance_rules_read
**Application surfaces**
- /admin/marketing/brands
- /admin/brands (redirect)
- GET /api/admin/brands
- GET /api/admin/brands/:brandId
- PATCH /api/admin/brands/:brandId
**Source modules**
- frontend/src/pages/admin/marketing/MarketingShell.tsx
- frontend/src/pages/admin/marketing/MarketingBrandContext.tsx
- backend/src/routes/admin/brandRoutes.ts
**Dependencies**
- marketing.channel_account_connection_and_credential_custody
- marketing.brand_governance_enforcement
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R7**.
Why that ceiling: Reading and reporting brand readiness is safe. Changing what a brand is, or which domain it owns, is a business-identity decision, so write access stays human and the ceiling stops short of unattended ownership.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Answers which brands are ready to publish and what each is missing.

Acceptance: Every gap named maps to a real missing account or an absent governance row; a brand with no rules is reported ungoverned, never compliant.
## Before you start
- manager has not validated which brands the marketing AI employee may act for
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- frontend/src/pages/admin/marketing/AdminBrandsPage.tsx
- frontend/src/pages/admin/marketing/BrandReadinessPanel.tsx
- frontend/src/pages/admin/marketing/BrandSetupTabs.tsx
- frontend/src/routes/adminRoutes.tsx:241
- frontend/src/routes/adminRoutes.tsx:261
- backend/src/routes/admin/brandRoutes.ts:104
- backend/src/routes/admin/brandRoutes.ts:144
- table: brands
- table: brand_domains

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every gap named maps to a real missing account or an absent governance row; a brand with no rules is reported ungoverned, never compliant.

When every box above is ticked, stop and show the demo.
