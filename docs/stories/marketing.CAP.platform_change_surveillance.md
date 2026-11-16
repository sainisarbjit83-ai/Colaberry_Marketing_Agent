# marketing.CAP.platform_change_surveillance — Outreach platform and tooling change watch

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

A platform API change or a new anti-bot measure is noticed before it silently breaks outreach, so the pipeline degrades on purpose rather than by surprise.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- No staleness detection: a dead source is indistinguishable from a quiet one
- findings have no routing to a human today

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Outreach platform and tooling change watch
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.platform_change_surveillance`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** inherited
## The business outcome
A platform API change or a new anti-bot measure is noticed before it silently breaks outreach, so the pipeline degrades on purpose rather than by surprise.
Intended users: Marketing manager, Marketing AI employee, Platform reliability owner.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Poll the known release and change-note sources once a day
- Extract anything that affects browser automation or a platform API we depend on
- Record the finding as a tech_update learning
- Leave the decision about what to do with it to a human
- Do not change any pipeline configuration on the strength of a finding
**Inputs**
- Playwright release notes
- Anti-bot and platform API change sources
**Outputs**
- openclaw_learning rows of type 'tech_update'
**Exceptions that must be handled**
- A source that stops publishing produces silence, which reads the same as no change - there is no staleness alarm today
- Findings are recorded but nothing routes them to a person
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- platform_public_api_read_allowlisted
- sandbox_database_write
**Application surfaces**
- /admin/intelligence (Outreach tab, Dashboard)
- GET /api/admin/openclaw/learnings
**Source modules**
- backend/src/services/agents/openclaw/openclawTechResearchAgent.ts
**Dependencies**
- Public release-note sources
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R7**.
Why that ceiling: Reading public release notes and writing an internal note has no blast radius. It is capped below full ownership because a watcher with no staleness alarm cannot honestly claim it is still watching.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Answers what changed recently in the platforms we automate, from stored findings.

Acceptance: Each answer cites a tech_update row and its date; no fetch is performed.
## Before you start
- No staleness detection: a dead source is indistinguishable from a quiet one
- findings have no routing to a human today
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/openclaw/openclawTechResearchAgent.ts:10
- backend/src/services/agents/openclaw/openclawTechResearchAgent.ts:22
- backend/src/services/agentRegistrySeed.ts:1504
- backend/src/services/aiOpsScheduler.ts:254
- table: openclaw_learning (learning_type 'tech_update')

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Each answer cites a tech_update row and its date; no fetch is performed.

When every box above is ticked, stop and show the demo.
