# marketing.CAP.outreach_lead_capture_and_scoring — Social-signal lead capture and tiering

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

A person who shows up in a public conversation becomes a scored, de-duplicated lead record the rest of the business can act on, instead of a name in a social thread nobody follows up.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- live_email (nothing in this capability may trigger a send; the placeholder address makes that a live hazard)
- manager has not validated the scoring weights or the hot/warm/cold thresholds

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Social-signal lead capture and tiering
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.outreach_lead_capture_and_scoring`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** existing_application
## The business outcome
A person who shows up in a public conversation becomes a scored, de-duplicated lead record the rest of the business can act on, instead of a name in a social thread nobody follows up.
Intended users: Marketing manager, Marketing AI employee, Admissions, Sales.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Resolve the author of a signal
- Mint a placeholder address of the form openclaw-{platform}-{hash}@pending.local, because social platforms expose no email
- De-duplicate on platform plus author hash before insert
- Compute the weighted score from seniority, platform and conversation signals
- Write the lead and its opportunity score with PII redacted from logs
**Inputs**
- A social signal with an identifiable author
- Seniority and platform weights
- Conversation signals from the thread
**Outputs**
- A Lead row, de-duplicated on platform plus author hash
- A weighted score and a hot/warm/cold tier
- An OpportunityScore row
**Exceptions that must be handled**
- The placeholder address is not a contactable address; treating it as one would send mail into a void
- A lead captured from social has no verified consent, so it must not enter an email campaign on the strength of this capture alone
- An author with no resolvable identity produces a signal but no lead
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- sandbox_database_write
- lead_record_write
**Application surfaces**
- /admin/leads
- /admin/leads/:id
- /admin/intelligence (Outreach tab, Hot Leads)
- GET /api/admin/openclaw/hot-leads
- GET /api/admin/openclaw/pipeline
**Source modules**
- backend/src/services/agents/openclaw/openclawLeadCaptureService.ts
- backend/src/services/agents/openclaw/openclawLeadScoringService.ts
**Dependencies**
- marketing.social_signal_discovery
- marketing.outreach_consent_and_channel_suppression
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R7**.
Why that ceiling: Capture and scoring write internal records only. The ceiling stops below full ownership because these records feed a channel that can send real mail, and the placeholder-address design makes a downstream mistake cheap to make and expensive to discover.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Answers who is in the social pipeline and at what tier, from stored rows.

Acceptance: Every lead cited exists in leads with an opportunity score; nothing is written.
## Before you start
- live_email (nothing in this capability may trigger a send; the placeholder address makes that a live hazard)
- manager has not validated the scoring weights or the hot/warm/cold thresholds
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/openclaw/openclawLeadCaptureService.ts:28
- backend/src/services/agents/openclaw/openclawLeadCaptureService.ts:20
- backend/src/services/agents/openclaw/openclawLeadScoringService.ts:41
- backend/src/services/agents/openclaw/openclawLeadScoringService.ts:112
- backend/src/services/agents/openclaw/openclawContentResponseAgent.ts:76
- table: leads
- table: opportunity_scores

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every lead cited exists in leads with an opportunity score; nothing is written.

When every box above is ticked, stop and show the demo.
