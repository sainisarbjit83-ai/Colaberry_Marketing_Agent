# marketing.CAP.platform_app_review_and_representation — Network app review and public representation

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Colaberry can publish directly to the networks that matter, because someone with authority made the representations each network's review requires.

**Built today:** partial. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Submission is a human decision by explicit instruction and must never be automated
- Meta's data-deletion URL requirement is unmet and blocks that submission
- manager has not confirmed submission ownership between himself and the executive owner

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Network app review and public representation
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.platform_app_review_and_representation`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** partial · **Source:** manager_defined
## The business outcome
Colaberry can publish directly to the networks that matter, because someone with authority made the representations each network's review requires.
Intended users: Marketing manager, Executive, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Prepare the submission package against the network's current published requirements
- Re-check every requirement in the network's own dashboard before submitting, because platform requirements change
- Clear any blocking prerequisite the review names
- Submit under the authority of someone who can make representations for Colaberry
- On approval, add the provider to the live-connector switch and restart
**Inputs**
- A prepared submission package per network
- A registered developer app
- Any blocking prerequisite the review requires
**Outputs**
- A submitted app review
- An approved product that unlocks direct publishing for a provider
**Exceptions that must be handled**
- A recorded blocker: Meta requires a data-deletion instructions URL or callback, and none exists anywhere in the codebase - submitting as-is would fail review
- Personal-profile publishing for the marketing team can ship without the company-page application, so the two are not one decision
- Submission is a hard stop for an automated loop by explicit instruction, not by capability limit
- Going live after approval is a configuration change plus a restart, deliberately not a code change and a deploy
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- repository_source_read
- read_marketing_database
**Application surfaces**
- /admin/marketing/brands (Connect Networks)
- GET /api/admin/marketing/connectors
**Source modules**
- docs/marketing/APP_REVIEW_META.md
- docs/marketing/APP_REVIEW_LINKEDIN.md
- backend/src/services/publishing/providerCapabilities.ts
**Dependencies**
- marketing.channel_account_connection_and_credential_custody
- marketing.brand_social_publishing
- A data-deletion URL for Meta
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R2**.
Why that ceiling: Submission makes legal and factual representations on the company's behalf and is already an explicit hard stop for automation. Preparing and fact-checking the package is genuinely useful agent work; submitting is not, at any level.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R1)**
Verifies every claim in a prepared package against the codebase.

Acceptance: Each claim is marked verified or unverified with its file reference; an unmet requirement is reported as a blocker.
## Before you start
- Submission is a human decision by explicit instruction and must never be automated
- Meta's data-deletion URL requirement is unmet and blocks that submission
- manager has not confirmed submission ownership between himself and the executive owner
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- docs/marketing/APP_REVIEW_META.md:3
- docs/marketing/APP_REVIEW_META.md:10
- docs/marketing/APP_REVIEW_META.md:18
- docs/marketing/APP_REVIEW_LINKEDIN.md:45
- docs/marketing/LINKEDIN_GO_LIVE.md:7
- backend/src/services/publishing/providerCapabilities.ts:310

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Each claim is marked verified or unverified with its file reference; an unmet requirement is reported as a blocker.

When every box above is ticked, stop and show the demo.
