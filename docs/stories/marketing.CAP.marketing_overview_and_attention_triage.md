# marketing.CAP.marketing_overview_and_attention_triage — Marketing overview and needs-attention triage

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

The first screen a marketing operator opens answers two questions honestly - can we still publish, and did something not go out - and refuses to show a number it cannot stand behind.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- manager has not validated what belongs in the needs-attention queue or in what order

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Marketing overview and needs-attention triage
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.marketing_overview_and_attention_triage`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** existing_application
## The business outcome
The first screen a marketing operator opens answers two questions honestly - can we still publish, and did something not go out - and refuses to show a number it cannot stand behind.
Intended users: Marketing manager, Marketing AI employee, Executive.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Compute account health per connected account and take the worst
- Detect late jobs by comparing intended against actual, with the clock injected rather than read
- Count pending approvals, failed jobs and link problems through the metric registry
- Exclude any count the registry says cannot be trusted, rather than rendering it as zero
- Derive the page's trust badge from loading, error and unavailable-metric state
**Inputs**
- Channel account health and expiry
- Late and failed publishing jobs
- Open approval requests and tracked-link problems
- The metric registry's trust verdict per metric
**Outputs**
- An account-health verdict, worst-first
- A needs-attention queue with counts and reasons
- A trust badge derived from what the page actually knows
**Exceptions that must be handled**
- Untrusted means excluded, never zero - a metric the registry cannot compute is reported as unavailable so it cannot drag an average down and look like a result
- The trust badge was previously a hardcoded 'live' with a mount-time timestamp, which overstated confidence in the dangerous direction; it now derives from real state
- Health judgements are pure and take `now` as a parameter, so a clock skew cannot silently change a verdict
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- metric_registry_read
**Application surfaces**
- /admin/marketing
- GET /api/admin/marketing/overview
- GET /api/admin/marketing/needs-attention
**Source modules**
- backend/src/services/marketing/overviewHealth.ts
- backend/src/services/marketing/overviewSummary.ts
- backend/src/services/marketing/needsAttentionService.ts
- backend/src/services/marketing/needsAttentionQueue.ts
**Dependencies**
- marketing.channel_account_connection_and_credential_custody
- marketing.brand_social_publishing
- The adminOs metric registry
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R9**.
Why that ceiling: A read-only surface whose governing discipline is already 'never render a number you cannot stand behind', with the trust judgement separated from the I/O and tested against an injected oracle. Operational ownership of accuracy is the right destination.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Answers whether we can still publish and whether anything failed to go out.

Acceptance: Any metric the registry cannot compute is named as unavailable, never reported as zero.
## Before you start
- manager has not validated what belongs in the needs-attention queue or in what order
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/marketing/overviewHealth.ts:1
- backend/src/services/marketing/overviewSummary.ts:22
- backend/src/services/marketing/needsAttentionService.ts:14
- backend/src/services/marketing/needsAttentionQueue.ts:26
- backend/src/routes/admin/marketingRoutes.ts:57
- backend/src/routes/admin/marketingRoutes.ts:97
- frontend/src/pages/admin/marketing/AdminMarketingOverviewPage.tsx
- frontend/src/pages/admin/marketing/NeedsAttentionQueue.tsx
- frontend/src/pages/admin/marketing/marketingTrust.ts:3
- frontend/src/routes/adminRoutes.tsx:235

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Any metric the registry cannot compute is named as unavailable, never reported as zero.

When every box above is ticked, stop and show the demo.
