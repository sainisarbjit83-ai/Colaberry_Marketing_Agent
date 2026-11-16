# marketing.CAP.outreach_quality_gate — Deterministic pre-publication quality gate

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

No reply reaches a public platform without passing a repeatable, explainable check on length, banned language, link policy, duplication and sign-off, so brand risk is caught by a rule rather than by whoever happens to be reading.

**Built today:** partial. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- marketing.outreach_human_approval_gap_closure must close the Skool auto-approve path
- manager has not validated the banned-phrase list or the pass threshold

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Deterministic pre-publication quality gate
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.outreach_quality_gate`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** partial · **Source:** inherited
## The business outcome
No reply reaches a public platform without passing a repeatable, explainable check on length, banned language, link policy, duplication and sign-off, so brand risk is caught by a rule rather than by whoever happens to be reading.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Select drafts awaiting a verdict on the relevant platform set
- Run the deterministic checks with no LLM involved: length, banned words, URL allow-list, duplication, sign-off presence
- Record the score and, on failure, the specific reasons
- Route a passing OpenClaw draft to pending_review so a human decides
- Regenerate or reject a failing draft rather than publishing a weaker version
**Inputs**
- Draft replies at draft / pending_review / ready_for_manual_post
- Per-platform banned-word and allowed-URL lists
- A numeric pass threshold
**Outputs**
- A pass/fail score with named rejection reasons
- OpenClaw: passing drafts routed to 'pending_review' for a human
- Skool: passing drafts routed straight to 'approved'
**Exceptions that must be handled**
- The gate is explicitly NOT a human reviewer and is coded not to auto-approve OpenClaw content (openclawQualityGateAgent.ts:258)
- KNOWN DEFECT: the Skool gate does auto-approve at score >= 70 and the Skool browser worker posts straight off 'approved', so Skool has no human gate at all - contradicting skoolPlatformStrategy.ts:12 and openclawPlatformStrategy.ts:70, which both declare Skool HUMAN_EXECUTION
- A new banned phrase added after a draft passed does not re-gate that draft
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- brand_governance_rules_read
- sandbox_database_write
**Application surfaces**
- /admin/intelligence (Outreach tab, Task Queue)
- GET /api/admin/openclaw/responses
- POST /api/admin/openclaw/responses/:id/reject
**Source modules**
- backend/src/services/agents/openclaw/openclawQualityGateAgent.ts
- backend/src/services/agents/skool/skoolQualityGateAgent.ts
**Dependencies**
- marketing.outreach_reply_drafting
- marketing.brand_governance_enforcement
- Banned-phrase lists per platform
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R7**.
Why that ceiling: A deterministic gate with no LLM and no outbound action is exactly the kind of check that should eventually run unattended. It is held below full ownership while one of its two implementations (Skool) still converts its own score into a publish authorisation, which is a different and much larger claim than scoring.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Explains a stored verdict and the exact rule that failed.

Acceptance: The named rule reproduces the stored score when re-run; no new verdict is written.
## Before you start
- marketing.outreach_human_approval_gap_closure must close the Skool auto-approve path
- manager has not validated the banned-phrase list or the pass threshold
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/openclaw/openclawQualityGateAgent.ts:202
- backend/src/services/agents/openclaw/openclawQualityGateAgent.ts:258
- backend/src/services/agents/openclaw/openclawQualityGateAgent.ts:261
- backend/src/services/agents/skool/skoolQualityGateAgent.ts:22
- backend/src/services/agents/skool/skoolQualityGateAgent.ts:273
- backend/src/services/agents/skool/skoolPlatformStrategy.ts:440
- backend/src/services/aiOpsScheduler.ts:250

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] The named rule reproduces the stored score when re-run; no new verdict is written.

When every box above is ticked, stop and show the demo.
