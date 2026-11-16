# marketing.CAP.outreach_consent_and_channel_suppression — Per-channel consent and suppression honouring

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Someone who declined one channel is not silenced on every channel, and someone who opted out is never contacted again on the channel they closed - so consent is honoured precisely rather than crudely.

**Built today:** partial. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- live_email (nothing here may trigger or authorise a send)
- this module is shared with Sales and Admissions, so scope ownership is not marketing's alone
- manager has not validated marketing's share of this control

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Per-channel consent and suppression honouring
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.outreach_consent_and_channel_suppression`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** partial · **Source:** existing_application
## The business outcome
Someone who declined one channel is not silenced on every channel, and someone who opted out is never contacted again on the channel they closed - so consent is honoured precisely rather than crudely.
Intended users: Marketing manager, Marketing AI employee, Compliance owner.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Record an opt-out with the channel it was made on
- Evaluate sendability per channel rather than on the mere existence of an opt-out row
- Apply the rule that phone and SMS require consent while email operates on an opt-out default
- Leave pre-existing rows under their original global semantics
- Never retroactively un-suppress anyone
**Inputs**
- Opt-out events with their channel
- Lead and campaign-lead state
- The consent rule per channel
**Outputs**
- A per-channel sendable verdict
- A suppression record that names the channel it applies to
**Exceptions that must be handled**
- The original defect suppressed globally whatever channel the opt-out named, so one SMS stop permanently ended that person's email too
- The fix is forward-only by design: reading historic rows per-channel would silently make previously-suppressed people email-eligible again, re-opening a door someone closed, at scale
- This is a shared control; Sales and Admissions depend on the same module, so a change here is cross-domain
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- suppression_list_read
**Application surfaces**
- /admin/leads/:id
- GET /unsubscribe
- POST /unsubscribe
**Source modules**
- backend/src/services/channelSuppression.ts
**Dependencies**
- marketing.campaign_approval_and_golive
- marketing.outreach_lead_capture_and_scoring
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R2**.
Why that ceiling: Consent is the one thing in this domain that must never be inferred, relaxed or automated. The agent may read the suppression state and refuse to act on it; recording or changing a consent state stays human, and the ceiling is answering from approved knowledge.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R2)**
Answers whether a person is contactable on a given channel and why.

Acceptance: The verdict cites the opt-out row and its channel; no suppression state is written.
## Before you start
- live_email (nothing here may trigger or authorise a send)
- this module is shared with Sales and Admissions, so scope ownership is not marketing's alone
- manager has not validated marketing's share of this control
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/channelSuppression.ts:1
- backend/src/services/channelSuppression.ts:12
- backend/src/services/channelSuppression.ts:16
- backend/src/routes/unsubscribeRoutes.ts
- table: unsubscribe_events
- table: campaign_leads
- table: leads

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] The verdict cites the opt-out row and its channel; no suppression state is written.

When every box above is ticked, stop and show the demo.
