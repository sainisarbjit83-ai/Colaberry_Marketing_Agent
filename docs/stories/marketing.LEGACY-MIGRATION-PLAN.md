# marketing.LEGACY-MIGRATION-PLAN — Legacy migration plan

Disposition of this domain's 40 inherited legacy agent record(s).

- **migrated_to_capability**: 38
- **retired**: 1
- **superseded**: 1

### Superseded (1) -- functionality carried forward
- `MarketingReportingAgent` -> marketing.recurring_marketing_performance_reporting: The row is dead but the responsibility is not. Measured: a cron of '0 5 * * *' exists in registry data only (agentRegistrySeed.ts:1676, config department 'Marketing'), there is no entry for it anywhere in aiOpsScheduler.ts, and its source_file has zero external importers; the audit classifies it REPORTING_UNWIRED and the cron baseline fixture records it as confirmed_dead referenced only by the seed. So the campaign-ROI, open-and-reply-rate, cost-per-lead and funnel-velocity reporting it declared has never actually run. That is a data-analyst responsibility the domain still needs, which is why it is superseded by a proposed capability with a real delivery mechanism rather than retired into nothing. The superseding capability also inherits the two blockers the old row never faced: no object combines report scope, recipient, cadence, timezone and channel, and no per-manager timezone field exists anywhere in the platform.

### Retired (1) -- and why each is safe to lose
- `Content_Marketing_Agent`: Genuinely dead, not merely unwired: the declared source_file backend/src/services/agents/contentMarketingAgent.ts does not exist on disk and has no git history, and the audit classifies it NO_SOURCE_FILE / confirmed_dead (agentRegistryAuditClassification.ts:23, seeded at agentRegistrySeed.ts:1194). There is no verified functionality to migrate. Its declared scope - content ideas, outreach copy drafting, campaign optimisation from engagement data - is nonetheless already alive elsewhere and is not lost: ideas in marketing.content_idea_proposal_queue, copy in marketing.outreach_reply_drafting and marketing.content_composition_and_variant_generation, optimisation in marketing.campaign_funnel_performance_analysis. Retiring the row is therefore a records correction, not a capability reduction. Related precedent in the same folder: two fabricating marketing agents, audienceSegmentationAgent.ts and contentGenerationAgent.ts, were deleted after a DO_NOT_BUILD audit and are held dead by a ratchet test (departments/marketing/__tests__/deletedMarketingAgents.test.ts:1-40), which also records that a self-declared SERVES_CAPABILITY marker on an unimported module is a false claim of execution.

**A `retire` marking is not self-justifying.** Across three domains in this programme, 28 of 39 rows marked `retire` turned out to hold live, reachable code. Each retirement above states why, and each needs the manager's confirmation.

### Not covered by this plan
The 21 legacy records whose `proposed_owner_domain` is `unresolved` belong to no domain and are therefore not in any project's plan. Five of them are live production rows. They need an owner decision, and naming that here is the point.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Legacy migration plan
**Domain:** Marketing Intelligence & Brand · **Release:** Legacy migration plan · **Story:** `marketing.LEGACY-MIGRATION-PLAN`
**Accountable human:** Sohail Syed · **Deliverable:** `docs/migration/legacy-migration-plan.md`

## What this is

This is Claude Code work, and the product is a written document. There is no feature to ship
and no agent to switch on. The document is the thing your manager reviews, so it is written
to be read by them rather than by you.

## The specification is the brief on this story, not this prompt

Read the brief above this prompt on the story page. It names this domain's real figures, your
accountable human, and the specific blockers discovery already found. **Those numbers are not
repeated here on purpose:** a second copy drifts from the first, and then nobody knows which
is true. Work from the brief; this prompt tells you how to turn it into a document.

## How to build it

- The brief already contains the disposition of every inherited legacy record for this domain, with reasons and `file:line` evidence. **Your job is not to redo that work.** It is to turn it into a plan a manager can act on, and to check it.
- Verify a sample against the repo. Open two or three of the cited `file:line` references with Claude Code and confirm they say what the brief claims. Record which ones you checked.
- Every record marked `unknown` is the real work. For each, say what single question would resolve it and who can answer.

## What the document must contain

- A disposition table: one row per legacy record, its category, and its successor capability where there is one.
- The `unknown` records called out separately, each with the question that resolves it and the person who can answer.
- Which citations you personally verified, and what you found.
- A sequence: what has to be decided first, and what is blocked until it is.
- Anything in the brief you believe is WRONG, with your evidence. Discovery was done at speed and finding an error in it is a better outcome than agreeing with all of it.

Write it as Markdown with real headings. A wall of prose is not a deliverable, and neither is
a bulleted restatement of the brief.

## Evidence this is done

Cite the real thing. For this story that is the committed file `docs/migration/legacy-migration-plan.md`, and inside it,
every claim carrying either a source or the word unknown.

**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, a document that restates the brief without answering it, or a confident sentence
with no source. Your accountable manager evaluates the evidence.

**Unknown is a real answer and is worth more than a guess.** Several of these questions have
no source material in this repository. Writing "the source does not exist, and here is what
would have to be written" is a complete answer, not a failure to find one.

## Before you start

- **The platform source is PUBLIC. You do not need access granted.** Wherever this brief
  cites a file like `backend/src/services/agentRegistrySeed.ts`, it means the Colaberry
  platform repository:
  **https://github.com/ColaberryIntern/ColaberryEnterprise_AI_LeadershipAccelerator**
  Clone it read-only beside your own project and point Claude Code at it. Sarbjit hit this
  within hours of starting and was right to stop rather than invent an answer: a brief that
  cites a path without naming its repository is the brief being wrong, not you.
- **Nothing in this story authorizes an outbound message.** Do not send an invitation, an
  email or a direct message, and do not record a meeting as booked. Arranging anything with a
  person is a human action taken outside this project.
- **Nothing here changes an agent.** Do not enable one, grant it a tool, or raise an autonomy
  level. A capability stays `draft` until your manager has actually reviewed it.
- Your repo may not be connected yet. The prompt works either way; the story cannot be
  verified and no points are awarded until a repo is connected, because verification is a
  read of your repo.

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] The plan accounts for every inherited legacy record for this domain, each one kept, merged or retired with a reason.
- [ ] The migration is described as replayable: running it twice leaves the same end state, with no duplicated side effects.
- [ ] The plan states what happens to a record the migration cannot classify, rather than assuming none exist.

When every box above is ticked, stop and show the demo.
