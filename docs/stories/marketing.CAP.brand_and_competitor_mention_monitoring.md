# marketing.CAP.brand_and_competitor_mention_monitoring — Brand and competitor mention monitoring

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

Colaberry knows when it is being talked about - and when a competitor is being chosen over it - rather than only knowing when someone asks a question it can answer.

**Built today:** absent. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- unbounded_network (mention scanning must stay on the explicit provider allow-list)
- responding to a negative mention is a human decision and is out of scope for this capability
- manager has not named the competitors or defined share of voice

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Brand and competitor mention monitoring
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.brand_and_competitor_mention_monitoring`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** absent · **Source:** proposed_new
## The business outcome
Colaberry knows when it is being talked about - and when a competitor is being chosen over it - rather than only knowing when someone asks a question it can answer.
Intended users: Marketing manager, Executive, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Extend the scan vocabulary with brand and competitor names, kept separate from intent keywords
- Classify each hit as a mention rather than an opportunity, with its sentiment and context
- Store mentions distinctly so they never inflate the intent pipeline
- Report share of voice over time rather than a single number
- Alert a human on a materially negative mention instead of replying to it
**Inputs**
- A brand and competitor name list
- The existing platform scan infrastructure
- A sentiment and context classification
**Outputs**
- Mention records distinguished from intent signals
- A trend view of share of voice over time
- An alert on a materially negative mention
**Exceptions that must be handled**
- A mention is not a lead, and merging the two would corrupt both the intent pipeline and the attribution behind it
- Replying to a negative mention is a reputational decision and must never be automated
- Share of voice computed from an incomplete scan is a sample, and must be reported as one
- No mention-monitoring code exists today; this is proposed, not partially built
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- platform_public_api_read_allowlisted
- llm_text_generation
- read_marketing_database
- sandbox_database_write
**Application surfaces**
- /admin/intelligence (Outreach tab)
- GET /api/admin/openclaw/signals
**Source modules**
- backend/src/services/agents/openclaw/openclawMarketSignalAgent.ts
**Dependencies**
- marketing.social_signal_discovery
- marketing.outreach_daily_human_action_queue
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R6**.
Why that ceiling: Monitoring mentions is a read. It is capped at a supervised pilot because a mention feed shapes how the brand is understood internally, and an incomplete scan presented as share of voice would mislead in a way nobody downstream can detect.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R0)**
Defines the mention vocabulary, the competitor set, the risks and the human decisions.

Acceptance: The brand and competitor lists are written down and the response policy names a human for every negative-mention case.
## Before you start
- unbounded_network (mention scanning must stay on the explicit provider allow-list)
- responding to a negative mention is a human decision and is out of scope for this capability
- manager has not named the competitors or defined share of voice
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/openclaw/openclawMarketSignalAgent.ts:19
- backend/src/services/agents/openclaw/openclawSignalScaler.ts:32
- backend/src/services/intel/sources/marketIntelligenceSource.ts:28
- table: openclaw_signals

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] The brand and competitor lists are written down and the response policy names a human for every negative-mention case.

When every box above is ticked, stop and show the demo.
