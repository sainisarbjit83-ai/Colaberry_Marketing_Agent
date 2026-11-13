# marketing.CAP.content_idea_proposal_queue — Grounded content-idea proposal queue

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

A marketing content idea arrives already grounded in the strongest current signal, queued for a human to accept or discard - never posted, never sent.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- manager has not validated what makes a content idea worth proposing

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Grounded content-idea proposal queue
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.content_idea_proposal_queue`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** inherited
## The business outcome
A marketing content idea arrives already grounded in the strongest current signal, queued for a human to accept or discard - never posted, never sent.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Resolve the top-ranked signal
- Check whether an identical pending proposal already exists, before any model call
- Make one small LLM call to draft a single content idea
- Write it to proposed_agent_actions for human review
- Stop - this capability has no posting or sending path at all
**Inputs**
- The top-ranked current school signal
- An existing-proposal check
**Outputs**
- One proposed_agent_actions row carrying a single content idea
**Exceptions that must be handled**
- Permission tier is suggest_only with proposed_agent_actions as the single allowed table and propose_content_idea as the single allowed operation
- The duplicate guard runs before the model call, so a second click spends no second call and triggers no second approval notice
- It is the only outward-facing workforce director and is deliberately held at suggest_only so a human reviews every idea
- On-demand only: there is no cron, so nothing happens unless a person asks
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- llm_text_generation
- proposed_agent_action_write
**Application surfaces**
- /admin/workforce
- /admin/approval-requests
- GET /api/admin/approval-requests
- POST /api/admin/approval-requests/:id/approve
- POST /api/admin/approval-requests/:id/reject
**Source modules**
- backend/src/services/workforce/directorActions.ts
**Dependencies**
- marketing.social_signal_discovery
- LLM provider availability
- proposed_agent_actions review surface
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R7**.
Why that ceiling: A proposal with an enforced single-table write and no send path is about as contained as an agent action gets. A scoped automation class is reachable; the proposal remains a proposal, and acceptance stays human.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Answers what the strongest current signal is and what has already been proposed.

Acceptance: Claims cite the signal and the pending proposals; no new proposal is written.
## Before you start
- manager has not validated what makes a content idea worth proposing
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/workforce/directorActions.ts:158
- backend/src/services/workforce/directorActions.ts:168
- backend/src/services/workforce/orgRegistry.ts:82
- backend/src/services/agentPermissionService.ts:96
- backend/src/services/agentRegistrySeed.ts:2337
- backend/src/services/governance/agentDepartmentClassifier.ts:94
- table: proposed_agent_actions
- .loop-architect/runs/20261007-school-agent-factory/legacy-slices/marketing.json (proposed_kind: tool)

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Claims cite the signal and the pending proposals; no new proposal is written.

When every box above is ticked, stop and show the demo.
