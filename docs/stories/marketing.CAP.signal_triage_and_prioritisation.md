# marketing.CAP.signal_triage_and_prioritisation — Outreach signal triage

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Only conversations worth joining reach the drafting stage, so human review time is spent on genuine opportunities and the brand does not reply to noise.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Thresholds are not manager-configurable; a policy change needs a code change
- manager has not validated the risk appetite the thresholds encode

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Outreach signal triage
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.signal_triage_and_prioritisation`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** inherited
## The business outcome
Only conversations worth joining reach the drafting stage, so human review time is spent on genuine opportunities and the brand does not reply to noise.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Select signals still at 'discovered'
- Score relevance, engagement potential and reputational risk
- Resolve the platform's content strategy and execution type
- Classify the automation risk as SAFE_AUTOMATION, ASSISTED_AUTOMATION or HUMAN_REQUIRED
- Queue a response-generation task only for signals above threshold, leaving the rest dormant with their scores
**Inputs**
- openclaw_signals rows at status 'discovered'
- Relevance, engagement and risk thresholds
- Platform strategy and execution type for the source platform
**Outputs**
- Scored signals with a triage verdict
- openclaw_tasks rows of kind generate_response for signals that clear threshold
- A recorded automation-risk class per signal
**Exceptions that must be handled**
- A platform with no strategy entry defaults to HUMAN_EXECUTION, the safest value
- A signal scoring high on risk is held regardless of relevance
- Thresholds are code constants today, not manager-set policy
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- sandbox_database_write
- risk_classification_read
**Application surfaces**
- /admin/intelligence (Outreach tab, Task Queue)
- GET /api/admin/openclaw/dashboard
- POST /api/admin/openclaw/run-pipeline
**Source modules**
- backend/src/services/agents/openclaw/openclawConversationDetectionAgent.ts
- backend/src/services/agents/openclaw/openclawRiskClassifier.ts
**Dependencies**
- marketing.social_signal_discovery
- openclawPlatformStrategy taxonomy
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R7**.
Why that ceiling: Triage produces an internal verdict and a queued task; nothing is published by this step. Full ownership is withheld until the thresholds are manager-set policy rather than code constants, because a threshold change silently changes how much brand exposure the pipeline generates.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Explains why a given signal was or was not queued, from its stored scores.

Acceptance: Explanation reproduces the stored verdict exactly; no re-scoring occurs during the answer.
## Before you start
- Thresholds are not manager-configurable; a policy change needs a code change
- manager has not validated the risk appetite the thresholds encode
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/openclaw/openclawConversationDetectionAgent.ts:11
- backend/src/services/agents/openclaw/openclawRiskClassifier.ts:46
- backend/src/services/aiOpsScheduler.ts:245
- backend/src/services/agentRegistrySeed.ts:1413
- table: openclaw_signals
- table: openclaw_tasks

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Explanation reproduces the stored verdict exactly; no re-scoring occurs during the answer.

When every box above is ticked, stop and show the demo.
