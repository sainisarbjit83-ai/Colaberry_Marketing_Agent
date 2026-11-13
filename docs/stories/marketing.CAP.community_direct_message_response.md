# marketing.CAP.community_direct_message_response — Community notification and direct-message response

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

A community member who asks Colaberry something directly gets a real answer the same day, without a staff member living in the Skool inbox.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- live_email (a direct message to an individual is the same class of outbound as mail and must not be automated here)
- no human-approval gate exists on this path at all
- no admin screen exists for a manager to review or stop it
- manager has not validated reply policy for direct messages

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Community notification and direct-message response
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.community_direct_message_response`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** inherited
## The business outcome
A community member who asks Colaberry something directly gets a real answer the same day, without a staff member living in the Skool inbox.
Intended users: Marketing manager, Marketing AI employee, Community members (recipients).
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Scan the notification feed and DM inbox for unread items
- Classify whether the item is a genuine question using the indicator list
- Generate a reply
- Navigate to the member's profile, open chat, and send
- Record the engagement
**Inputs**
- Skool notification feed and DM inbox
- A question-indicator list used to avoid AI-to-AI reply loops
- Skool session credentials
**Outputs**
- A sent direct message
- A recorded engagement row
- A replied count per run
**Exceptions that must be handled**
- The indicator list exists specifically to stop the agent answering another bot and looping
- KNOWN DEFECT: this agent sends a direct message to a real person with no human approval step anywhere in the path, and the module carries a file-level @ts-nocheck
- A profile that cannot be opened is skipped, leaving the notification unread
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- headless_browser_sandbox
- llm_text_generation
- read_marketing_database
- sandbox_database_write
- credential_vault_read_scoped
**Application surfaces**
- none - no Skool screen exists
- none - scheduler-driven only
**Source modules**
- backend/src/services/agents/skool/skoolNotificationResponseAgent.ts
**Dependencies**
- Skool account session
- Headless browser availability
- marketing.community_signal_detection
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R4**.
Why that ceiling: This is a one-to-one message to a named human under the Colaberry identity, sent today with no approval gate and no manager-visible surface. Until a gate and a surface exist, the honest ceiling is stateful sandbox work; any production send stays a human decision.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R2)**
Summarises the unanswered community inbox from stored engagement rows.

Acceptance: Counts reconcile to skool_engagements; no navigation and no send in the trace.
## Before you start
- live_email (a direct message to an individual is the same class of outbound as mail and must not be automated here)
- no human-approval gate exists on this path at all
- no admin screen exists for a manager to review or stop it
- manager has not validated reply policy for direct messages
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/skool/skoolNotificationResponseAgent.ts:116
- backend/src/services/agents/skool/skoolNotificationResponseAgent.ts:411
- backend/src/services/agents/skool/skoolNotificationResponseAgent.ts:14
- backend/src/services/aiOpsScheduler.ts:263
- table: skool_engagements

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Counts reconcile to skool_engagements; no navigation and no send in the trace.

When every box above is ticked, stop and show the demo.
