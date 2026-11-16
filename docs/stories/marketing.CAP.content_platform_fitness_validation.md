# marketing.CAP.content_platform_fitness_validation — Per-network content fitness validation

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

A post is told, before anyone approves it, exactly which network would reject it and why - with the limit and the actual value - so failures happen in the composer rather than at the network.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Registry staleness is reported but not alarmed, so an old limit can persist unnoticed
- manager has not validated whether a stale-registry warning should block

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Per-network content fitness validation
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.content_platform_fitness_validation`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** existing_application
## The business outcome
A post is told, before anyone approves it, exactly which network would reject it and why - with the limit and the actual value - so failures happen in the composer rather than at the network.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Read the capability registry rather than holding any limit locally
- Check each variant's text, hashtags, content type, media, links and poll against its provider
- Report a hard provider limit as a block, because the network would reject it
- Report a stale registry entry as a warn, because the check ran against limits we no longer fully trust
- Name the provider, the field, the limit and the actual value in every problem
**Inputs**
- Each variant's text, hashtags, media, links and poll
- The provider capability registry and its staleness marker
**Outputs**
- A per-variant problem list naming provider, field, limit and actual value
- A block or warn severity per problem
**Exceptions that must be handled**
- The composer deliberately holds no limits of its own, because two limits for one platform is how content passes validation and dies at the network
- A stale capability entry warns rather than blocks, so an operator is told the answer may be out of date
- A provider with no registry entry produces a registry-field problem rather than a silent pass
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- provider_capability_registry_read
**Application surfaces**
- /admin/marketing/composer (Preview and Publishing steps)
- POST /api/admin/content/:id/validate
- GET /api/admin/content/providers
**Source modules**
- backend/src/services/content/composerValidation.ts
- backend/src/services/publishing/providerCapabilities.ts
**Dependencies**
- marketing.content_composition_and_variant_generation
- Provider capability registry freshness
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R9**.
Why that ceiling: A deterministic check against a single registry, with no write and no outbound action, whose failure mode is a false block rather than a publish. Operational ownership is appropriate once registry freshness is itself monitored.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Explains why a variant would be rejected by a given network.

Acceptance: The explanation names the limit and the actual value; re-running validation reproduces it exactly.
## Before you start
- Registry staleness is reported but not alarmed, so an old limit can persist unnoticed
- manager has not validated whether a stale-registry warning should block
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/content/composerValidation.ts:5
- backend/src/services/content/composerValidation.ts:19
- backend/src/services/content/pollSpec.ts
- backend/src/services/publishing/providerCapabilities.ts:305
- backend/src/routes/admin/contentComposerRoutes.ts:324
- backend/src/routes/admin/contentComposerRoutes.ts:224

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] The explanation names the limit and the actual value; re-running validation reproduces it exactly.

When every box above is ticked, stop and show the demo.
