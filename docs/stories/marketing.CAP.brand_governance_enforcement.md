# marketing.CAP.brand_governance_enforcement — Brand governance rule enforcement

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Every piece of brand content is checked against the brand's own published rules on voice, approved offers and required claims - read from data, so a rule change takes effect without a deploy.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Publishing a governance rule version is a human decision
- manager has not validated the rule set for any brand in this domain

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Brand governance rule enforcement
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.brand_governance_enforcement`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** existing_application
## The business outcome
Every piece of brand content is checked against the brand's own published rules on voice, approved offers and required claims - read from data, so a rule change takes effect without a deploy.
Intended users: Marketing manager, Marketing AI employee, Compliance owner.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Read the current, highest-version rule row for the brand
- Apply the pure checker, which knows nothing about what any rule says
- Return violations together with the rulesVersion the check ran against
- Resolve brand-offer eligibility, where a deny row outranks a later allow
- Let the caller refuse to publish ungoverned content rather than reading no violations as approval
**Inputs**
- The highest-version governance rule row for the brand
- The content under review
- The brand-offer eligibility mapping
**Outputs**
- A governance result with violations and a rulesVersion
- An allow or deny verdict per brand-offer pair
**Exceptions that must be handled**
- A brand with no governance rows gets empty rules and rulesVersion 0 - the correct reading is ungoverned, not compliant, and silently passing everything for an unconfigured brand is the failure this is designed against
- Brand-offer resolution fails closed: the absence of a row denies, and an explicit deny outranks an allow
- The checker can only judge content that passes through the composer carrying a brand_id
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- brand_governance_rules_read
- brand_offer_policy_read
**Application surfaces**
- /admin/marketing/brands (Governance tab)
- /admin/marketing/composer (Preview step)
- GET /api/admin/brands/:brandId
- POST /api/admin/content/:id/validate
**Source modules**
- backend/src/services/content/brandGovernanceService.ts
- backend/src/services/content/brandGovernance.ts
- backend/src/services/content/brandGovernanceSeed.ts
**Dependencies**
- marketing.brand_registry_and_readiness
- marketing.banned_copy_compliance_scanning
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R5**.
Why that ceiling: Running the check can be automated. Authoring or publishing a brand's rules is a statement about what Colaberry will claim in public and stays a human act, so the agent's ceiling is shadow mode against rules a human published.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R2)**
Answers what the brand's current rules require and which version is in force.

Acceptance: Answer names the rulesVersion; a brand with no rows is reported ungoverned, never compliant.
## Before you start
- Publishing a governance rule version is a human decision
- manager has not validated the rule set for any brand in this domain
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/content/brandGovernanceService.ts:5
- backend/src/services/content/brandGovernanceService.ts:13
- backend/src/services/content/brandGovernanceService.ts:56
- backend/src/services/content/brandGovernanceService.ts:107
- backend/src/services/content/brandGovernance.ts
- backend/src/models/BrandGovernanceRule.ts:48
- backend/src/models/BrandOfferPolicy.ts:6
- backend/src/models/BrandOfferPolicy.ts:12
- table: brand_governance_rules
- table: brand_offer_policies

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Answer names the rulesVersion; a brand with no rows is reported ungoverned, never compliant.

When every box above is ticked, stop and show the demo.
