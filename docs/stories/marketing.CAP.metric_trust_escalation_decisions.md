# marketing.CAP.metric_trust_escalation_decisions — Marketing metric trust escalation and resolution

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

A number the platform cannot stand behind is escalated to a decision rather than quietly rendered, so marketing reporting stays something an executive can act on.

**Built today:** partial. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- The escalation is open and undecided
- the decision spans Marketing, Finance and Executive surfaces, so it is not the marketing manager's alone
- manager has not confirmed his share of the decision

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Marketing metric trust escalation and resolution
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.metric_trust_escalation_decisions`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** partial · **Source:** manager_defined
## The business outcome
A number the platform cannot stand behind is escalated to a decision rather than quietly rendered, so marketing reporting stays something an executive can act on.
Intended users: Marketing manager, Executive, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Register the metric and discover that its computation cannot be justified
- Trace every surface that renders it
- Fix only the files the current work owns, and stop rather than spreading
- Write the escalation with findings, affected files and the rule being contradicted
- Hold the decision with the accountable human rather than choosing unilaterally
**Inputs**
- A metric whose computation cannot be justified
- The scope of the surfaces it affects
- The standing business rule it contradicts
**Outputs**
- An escalation record with findings, scope and a recommendation
- A decision that either fixes the metric or removes it from every surface
**Exceptions that must be handled**
- The escalation is recorded as open and needing a decision, and as explicitly not blocking the marketing build
- Two of five affected services were fixed in the branch that found the problem; three were deliberately left because they are owned elsewhere
- implementation_state is partial because the escalation exists and part of the remediation shipped, but the decision has not been made
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- metric_registry_read
- repository_source_read
**Application surfaces**
- /admin/marketing/performance
- /admin/revenue-dashboard
- GET /api/admin/marketing/campaigns
- GET /api/admin/marketing/channel-roi
**Source modules**
- docs/marketing/ESCALATION-002-fabricated-metrics.md
- backend/src/services/adminOs/metricRegistry.ts
**Dependencies**
- marketing.revenue_and_cost_metric_truthing
- marketing.campaign_and_channel_metric_reporting
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R3**.
Why that ceiling: Finding and documenting an untrustworthy metric is exactly what an agent should do unprompted. Deciding what the business's revenue definition is, and therefore which dashboards are wrong, is a governance decision for the accountable humans.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R2)**
Explains which marketing numbers cannot be trusted and why.

Acceptance: Each finding names the file, the constant or column at fault, and the rule it contradicts.
## Before you start
- The escalation is open and undecided
- the decision spans Marketing, Finance and Executive surfaces, so it is not the marketing manager's alone
- manager has not confirmed his share of the decision
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- docs/marketing/ESCALATION-002-fabricated-metrics.md:1
- docs/marketing/ESCALATION-002-fabricated-metrics.md:11
- docs/marketing/ESCALATION-002-fabricated-metrics.md:21
- docs/marketing/ESCALATION-002-fabricated-metrics.md:40
- backend/src/services/adminOs/metricRegistry.ts:22
- frontend/src/pages/admin/marketing/marketingTrust.ts:3

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Each finding names the file, the constant or column at fault, and the rule it contradicts.

When every box above is ticked, stop and show the demo.
