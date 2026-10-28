# Legacy migration plan: Marketing Intelligence & Brand

**Story:** `marketing.LEGACY-MIGRATION-PLAN` · **Release:** r1, Legacy migration plan
**Accountable human:** Sohail Syed · **Author:** Sarbjit Kaur, with Claude Code · **Date:** 2026-10-28
**Status:** draft plan for Sohail's review. Nothing here retires, disables, enables or re-homes any
agent. Every disposition below is the brief's proposal until Sohail confirms it.

> **What this is based on, and its limit.** I couldn't open the live portal. This plan is built
> from two sources. The first is the story brief in the build bundle downloaded from the platform,
> `marketing-build-docs-v1/docs/stories/marketing.LEGACY-MIGRATION-PLAN.md` (SHA-256
> `ad5249475600cc5242167733200b8d85cafb268f4471cbabb070a307e55c8652`). The second is the domain
> matrix it's generated from. If the live portal brief has changed since that download, this plan
> may not reflect the change.
>
> **Sources.** "The brief" is that downloaded file.
> It is generated from the domain matrix, `backend/src/services/agentDomain/capabilities/marketing.json`
> ("the matrix"), in the public platform repo
> [`ColaberryIntern/ColaberryEnterprise_AI_LeadershipAccelerator`](https://github.com/ColaberryIntern/ColaberryEnterprise_AI_LeadershipAccelerator),
> read at commit `b058da6`. Platform paths below are relative to `backend/src/services/` unless
> they start with `backend/`. Anything without a source is marked **unknown**.

---

## Summary for Sohail

- **40 legacy agent records** come to Marketing (brief `:3`; matrix `marketing.json:7431-7712`).
  Every one has a disposition and a reason. None is unaccounted for.
- **38 are migrated to a capability** (19 kept one-to-one, 19 merged into 6 shared capabilities).
  **1 is superseded** and **1 is retired** (brief `:5-7`).
- **No record is marked `unknown`.** But **13 of the 38 migrated records have an unconfirmed
  domain owner**: they reached Marketing "by a name or category match", not by a product decision
  (`marketing.json:7718`). Their place in this plan is provisional until that is decided. This is
  the most important open item.
- **5 decisions are needed**, in the order given in [Decision sequence](#decision-sequence). The
  first is the domain owner of those 13 records. The matrix recommends that you and "the executive
  owner" decide it (`marketing.json:7718`). Who actually has the authority to approve that decision
  isn't recorded anywhere, and is **unknown**.

---

## Disposition table

**Category** is how the migration treats the record:
- **kept**: one record carries forward to one capability;
- **merged**: several records carry forward into one shared capability;
- **superseded**: the record is dead, but its responsibility moves to a new capability;
- **retired**: the record goes, and nothing needs to replace it.

For the story's wording ("kept, merged or retired"), **superseded** counts as *kept*: the
responsibility carries forward, to a capability that replaces the record.

**Owner** is "confirmed" unless the successor capability records an unconfirmed domain owner.
"Confirmed" means only that the source records no ownership question. It doesn't mean anyone has
approved the disposition. Each
record's full reason is at the matrix line given in the last column. The table quotes its opening
words.

| # | Legacy record | Disposition | Category | Successor capability | Owner | Reason (opening words, quoted) and source |
|---|---|---|---|---|---|---|
| 1 | `AiNewsRefresh` | migrated | kept | `ai_news_ingestion_and_card_publication` | **unconfirmed** | "Live daily pipeline with a registry row and a real scheduler entry" (`marketing.json:7437`) |
| 2 | `CampaignTrafficEnforcement` | migrated | kept | `tracked_link_and_utm_governance` | confirmed | "The two-hourly flagUnregisteredTraffic run … is the enforcement half" (`:7444`) |
| 3 | `ExplorerContentSync` | migrated | kept | `lifecycle_content_catalogue_projection` | **unconfirmed** | "Projects published curriculum cards into a pointer registry" (`:7451`) |
| 4 | `ExplorerGovernorDecide` | migrated | kept | `free_tier_next_best_action_decisioning` | **unconfirmed** | "The shadow-mode journey governor" (`:7458`) |
| 5 | `ExplorerProfileRecompute` | migrated | kept | `free_tier_learner_journey_scoring` | **unconfirmed** | "The daily score and journey-state recompute" (`:7465`) |
| 6 | `Intel_ai_research_digest` | migrated | merged | `intelligence_card_generation` | **unconfirmed** | "One of nine sources registered against a single shared engine" (`:7472`) |
| 7 | `Intel_ai_architecture_breakdown` | migrated | merged | `intelligence_card_generation` | **unconfirmed** | "Same shared engine and cron" (`:7479`) |
| 8 | `Intel_build_breakdown` | migrated | merged | `intelligence_card_generation` | **unconfirmed** | "Same shared engine and cron" (`:7486`) |
| 9 | `Intel_ai_tool_of_the_day` | migrated | merged | `intelligence_card_generation` | **unconfirmed** | "Same shared engine and cron" (`:7493`) |
| 10 | `Intel_ai_quote_of_the_day` | migrated | merged | `intelligence_card_generation` | **unconfirmed** | "Same shared engine and cron" (`:7500`) |
| 11 | `Intel_claude_code_technique` | migrated | merged | `intelligence_card_generation` | **unconfirmed** | "Same shared engine and cron" (`:7507`) |
| 12 | `Intel_mcp_server_spotlight` | migrated | merged | `intelligence_card_generation` | **unconfirmed** | "Same shared engine and cron" (`:7514`) |
| 13 | `Intel_ai_video_stream` | migrated | merged | `intelligence_card_generation` | **unconfirmed** | "Same shared engine and cron" (`:7521`) |
| 14 | `Intel_market_intelligence` | migrated | merged | `intelligence_card_generation` | **unconfirmed** | "Same shared engine and cron" (`:7528`) |
| 15 | `MarketingAutomationArchitect` | migrated | kept | `marketing_department_strategy_planning` | confirmed | "The Marketing instance of the shared department strategy architect" (`:7535`) |
| 16 | `MarketingPublishingWorker` | migrated | kept | `brand_social_publishing` | confirmed | "The every-minute publishing queue tick … seeded disabled on purpose" (`:7542`) |
| 17 | `OpenclawBrowserWorkerAgent` | migrated | merged | `outreach_reply_publication` | confirmed | "The posting executor for the OpenClaw fleet" (`:7549`) |
| 18 | `OpenclawContentResponseAgent` | migrated | merged | `outreach_reply_drafting` | confirmed | "Reply generation under the platform strategy prompt with sign-off enforcement" (`:7556`) |
| 19 | `OpenclawConversationDetectionAgent` | migrated | kept | `signal_triage_and_prioritisation` | confirmed | "Relevance, engagement and risk scoring that decides what reaches drafting" (`:7563`) |
| 20 | `OpenclawEngagementMonitorAgent` | migrated | kept | `engagement_monitoring_and_intent_scoring` | confirmed | "Polls posted URLs for new replies and scores intent" (`:7570`) |
| 21 | `OpenclawFollowUpAgent` | migrated | merged | `conversation_followup_sequencing` | confirmed | "Daily stalled-conversation follow-up drafting with a per-run cap" (`:7577`) |
| 22 | `OpenclawInfraMonitorAgent` | migrated | kept | `browser_session_reliability` | confirmed | "Browser session health, captcha detection and self-healing" (`:7584`) |
| 23 | `OpenclawLearningOptimizationAgent` | migrated | kept | `outreach_learning_loop` | confirmed | "Aggregates engagement outcomes into learnings that steer scanning" (`:7591`) |
| 24 | `OpenclawLinkedInCommentMonitorAgent` | migrated | kept | `linkedin_comment_watch_and_reply_drafting` | confirmed | "Scrapes tracked LinkedIn posts and drafts replies at ready_for_manual_post" (`:7598`) |
| 25 | `OpenclawMarketSignalAgent` | migrated | kept | `social_signal_discovery` | confirmed | "Multi-platform public signal scanning with learned keyword and platform weights" (`:7605`) |
| 26 | `OpenclawQualityGateAgent` | migrated | merged | `outreach_quality_gate` | confirmed | "Deterministic, no-LLM scoring that routes passing content to pending_review for a human" (`:7612`) |
| 27 | `OpenclawResponseOrchestratorAgent` | migrated | merged | `conversation_followup_sequencing` | confirmed | "Builds the conversation chain, detects the conversion stage and drafts a follow-up" (`:7619`) |
| 28 | `OpenclawSupervisorAgent` | migrated | merged | `outreach_queue_supervision` | confirmed | "Task-queue management, stuck-task recovery and concurrency assignment" (`:7626`) |
| 29 | `OpenclawTechResearchAgent` | migrated | kept | `platform_change_surveillance` | confirmed | "Daily scan of Playwright releases, anti-bot changes and platform API updates" (`:7633`) |
| 30 | `SkoolBrowserWorker` | migrated | merged | `outreach_reply_publication` | confirmed | "Posts approved Skool content via a credentialed headless browser" (`:7640`) |
| 31 | `SkoolContentResponse` | migrated | merged | `outreach_reply_drafting` | confirmed | "Category-prompted reply and post generation writing draft SkoolResponse rows" (`:7647`) |
| 32 | `SkoolNotificationResponse` | migrated | kept | `community_direct_message_response` | confirmed | "Scans notifications and the DM inbox and sends direct messages via browser automation" (`:7654`) |
| 33 | `SkoolQualityGate` | migrated | merged | `outreach_quality_gate` | confirmed | "Deterministic scoring with a hard sign-off check" (`:7661`) |
| 34 | `SkoolSignalDetection` | migrated | kept | `community_signal_detection` | confirmed | "Per-category browser scrape of the community, scoring and task creation" (`:7668`) |
| 35 | `SkoolSupervisor` | migrated | merged | `outreach_queue_supervision` | confirmed | "Skool queue health … Merged with the OpenClaw supervisor" (`:7675`) |
| 36 | `Content_Marketing_Agent` | **retired** | retired | — (scope already covered elsewhere) | confirmed | "Genuinely dead, not merely unwired" (`:7682`; brief `:13`) |
| 37 | `MarketingReportingAgent` | **superseded** | superseded | `recurring_marketing_performance_reporting` | confirmed | "The row is dead but the responsibility is not" (`:7689`; brief `:10`) |
| 38 | `OpenclawLinkedInFlowAgent` | migrated | kept (**retire marking overridden**) | `linkedin_relationship_action_suggestions` | confirmed | "Classified retire because the registered cron … has no … entry … But the row is NOT self-justifying as a retirement" (`:7696`) |
| 39 | `OpenclawAuthorityContentAgent` | migrated | kept | `authority_content_drafting` | confirmed | "Classified tool because it is registered … but never scheduled" (`:7703`) |
| 40 | `WorkforceMarketingDirector` | migrated | kept | `content_idea_proposal_queue` | confirmed | "Classified tool because trigger_type is on_demand with no schedule" (`:7710`) |

**Totals:** 19 kept · 19 merged · 1 superseded · 1 retired = **40**, matching the brief (`:3-7`).
Successor capability ids above omit the `marketing.` prefix.

**The 6 merges.** Nine `Intel_*` rows go into `intelligence_card_generation`, and five pairs go into
`outreach_reply_publication`, `outreach_reply_drafting`, `conversation_followup_sequencing`,
`outreach_quality_gate` and `outreach_queue_supervision`. In five of those pairs, an OpenClaw row and
a Skool row (or two OpenClaw rows) do the same job on different channels.

**The special cases.** The source proposed **three** records for retirement (`proposed_kind:
retire`), and each ended up somewhere different:
- **Row 36, `Content_Marketing_Agent`:** retired. It's the only record with no successor capability.
- **Row 37, `MarketingReportingAgent`:** superseded, so it carries forward to a new capability.
- **Row 38, `OpenclawLinkedInFlowAgent`:** migrated, counted as *kept*, despite its retire marking.

Rows 37 and 38 are the two that need a closer look:
- **Row 38 was proposed for retirement and kept instead.** Its code and table exist, and its
  connection-request and DM-follow-up suggestions are "covered by no other capability in this domain,
  so retiring the row outright would be exactly the silent loss this exercise exists to prevent"
  (`:7696`). Reinstating it "means rebuilding the human gate rather than adding a cron line" (same
  line).
- **Row 37 is superseded, not retired.** Its reporting "has never actually run", but it is "a
  data-analyst responsibility the domain still needs" (brief `:10`). It is the same item as row 11 in
  [03-role-and-da-transition.md](../discovery/03-role-and-da-transition.md).

---

## Unknown records

**None.** The matrix records no `unknown` disposition for this domain: 38 migrated, 1 retired,
1 superseded (`marketing.json:7431-7712`; brief `:5-7`). The brief's template would list an
"Unresolved" section if there were any (`agentDomain/agentDomainStoryTemplates.ts:249-254`), and
this domain's brief has none.

**But 13 records are provisional,** because their domain owner is unconfirmed. Each group needs one
question answered before anything is built on it.

Two roles are kept separate below:
- **Who can answer:** who the source names as able to settle the question.
- **Who can approve the disposition:** who has the authority to make it final.

The source records the first as a *recommendation*. It records nothing about the second.

| Records | Where the owner question is recorded | The one question | Who can answer (source) | Who can approve the disposition |
|---|---|---|---|---|
| Rows 1, 6–14: `AiNewsRefresh` and the nine `Intel_*` records | `ai_news_ingestion_and_card_publication` (`marketing.json:5225`); `intelligence_card_generation` (`:5362`); also `intelligence_card_prepublication_review` (`:6962`) | Does student-facing AI news and intelligence-card content belong to Marketing, Curriculum or Product Experience? | Sohail Syed and "the executive owner", as the matrix recommends (`:7718`). The executive domain's accountable human is Ali Muwwakkil (`executive.json:3`; `agentDomain/agentDomainRegistry.ts:239`) | **Unknown.** No source grants this authority to anyone |
| Rows 3–5: `ExplorerContentSync`, `ExplorerGovernorDecide`, `ExplorerProfileRecompute` | `lifecycle_content_catalogue_projection` (`:5710`); `free_tier_next_best_action_decisioning` (`:5600`); `free_tier_learner_journey_scoring` (`:5480`) | Does free-tier learner scoring, decisioning and content projection belong to Marketing, Learner Success or Curriculum? | As above (`:7718`). Ali Muwwakkil is also Learner Success's accountable human (`learner_success.json:3`) | **Unknown**, as above |

The candidate domains' accountable humans are recorded as Swati Raman for Curriculum
(`curriculum.json:3`) and Mohammed Abdul Aleem for Product Experience (`product_experience.json:3`).
Whether they take part in the decision is **unknown**. The matrix names only "Sohail Syed and the
executive owner". "Accountable human" is a field in each domain's record. It doesn't by itself
establish authority over another domain's records.

---

## What happens to a record the migration can't classify (proposed rule)

This domain has none today. The plan still sets a rule, rather than assuming none will appear.
**This is a proposed rule, not implemented behavior.** No migration code exists to enforce it. The
platform rule quoted in step 1 governs how a brief is *rendered*, not how a migration runs.

1. **It is recorded as `unknown`, not guessed.** This is the platform's own rule: "recorded as
   `unknown` rather than guessed … an unexamined row is exactly where loss hides"
   (`agentDomain/agentDomainStoryTemplates.ts:252-254`).
2. **It is left exactly as it is.** It is not enabled, disabled, re-homed or deleted while unknown.
3. **It gets one question and one named person** who can answer it, in the format of the table
   above.
4. **The migration continues for every other record.** Counts are reported as "N of 40 classified",
   so an unknown is never folded into a total.
5. **The same applies to the 13 provisional records** while their ownership question is unsettled:
   they stay where they are, and nothing is built on their capabilities.

**Outside this plan:** the brief names **21 legacy records** whose `proposed_owner_domain` is
`unresolved` and which belong to no domain (brief `:17-18`). This plan doesn't touch them. Which
records they are, and the brief's claim that five are live in production, are **unknown** from
this repository.

---

## How the migration should stay replayable (proposed requirements)

**Nothing here is implemented or tested.** No migration code exists for these records. The table
lists **requirements** a future migration must meet so that running it twice leaves the same end
state, with no duplicated side effects. The right-hand column separates what the existing code
already shows (verified) from what is only proposed.

| Proposed step | Requirement that makes a re-run harmless | What existing code shows |
|---|---|---|
| Record each legacy record's disposition and successor | Keyed on `agent_name`, so a second write overwrites the same entry with the same values | **Verified:** the registry seed already keys rows on `agent_name`, via `AiAgent.findOrCreate({ where: { agent_name } })` (`agentRegistrySeed.ts:3165-3168`). **Proposed:** a disposition record keyed the same way. No such record exists yet |
| Keep each registry row; never delete one | Nothing is removed, so nothing can be re-created or duplicated, and history survives | **Proposed.** It follows the platform's stated rule that "No useful legacy functionality is silently lost" (`agentDomain/agentDomainStoryTemplates.ts:252-253`) |
| Retire row 36 by an explicit update setting `enabled = false` | Setting a disabled row disabled again changes nothing | **Verified constraint:** the seed can't do this, because `findOrCreate()` "honours `enabled` only at first creation" (`agentRegistrySeed.ts:3097`). **Proposed:** an explicit update keyed on `agent_name`. None exists |
| Point superseded and merged records at their successor | A mapping keyed on (`agent_name`, `capability_id`) is written once; a re-run finds it and adds nothing | **Proposed.** No such mapping table exists in the code checked |
| Send, post or schedule nothing | No external side effects to repeat | **Proposed requirement.** This story authorizes no outbound action (brief `:86-88`) |

**A required check, not yet built:** a second run must report zero changes. If it reports any, that
step isn't replayable and must be fixed before use. This follows the repository's idempotency rule
(`CLAUDE.md`, "Idempotency & Replayability").

---

## Citations I verified

I checked four of the brief's references against the platform repo at `b058da6`.

| # | Brief's claim | What the source actually says | Verdict |
|---|---|---|---|
| 1 | `MarketingReportingAgent` has a cron `'0 5 * * *'` "in registry data only (agentRegistrySeed.ts:1676, config department 'Marketing')", and no `aiOpsScheduler.ts` entry (brief `:10`) | The row is at `agentRegistrySeed.ts:1678-1686`: `schedule: '0 5 * * *'` (`:1683`), `config: { department: 'Marketing' }` (`:1686`). Line `:1676` is the closing brace of the previous entry. `aiOpsScheduler.ts` has **0** occurrences of the name | **Correct content, line drifted by 2** |
| 2 | `Content_Marketing_Agent` is classified `NO_SOURCE_FILE` / `confirmed_dead` (`agentRegistryAuditClassification.ts:23`), its source file doesn't exist, and it's "seeded at agentRegistrySeed.ts:1194" (brief `:13`) | The `NO_SOURCE_FILE` list opens at `agentRegistryAuditClassification.ts:23`, with the name on `:28`. That list is marked `status: 'confirmed_dead'` at `:96-98`. `agents/contentMarketingAgent.ts` is absent on disk. The seed row is at `agentRegistrySeed.ts:1196`; `:1194` is the section comment above it | **Correct content, seed line drifted by 2.** "No git history" couldn't be checked, because the clone is shallow |
| 3 | Two fabricating agents were deleted after a `DO_NOT_BUILD` audit and are held dead by a ratchet test (`departments/marketing/__tests__/deletedMarketingAgents.test.ts:1-40`) (brief `:13`) | Lines 1–40 describe exactly that: `contentGenerationAgent.ts` and `audienceSegmentationAgent.ts` deleted after a DO_NOT_BUILD audit (`:5-21`), and the `SERVES_CAPABILITY` false-execution point (`:25-34`). Both files are absent on disk | **Correct** |
| 4 | The cron baseline fixture records `MarketingReportingAgent` as confirmed dead, referenced only by the seed (brief `:10`) | `__tests__/fixtures/cronRegistryBaseline.ts:65`: "audit: confirmed_dead, referenced only by the seed file" | **Correct** |

**References I did not check.** Everything else the brief or the matrix cites is **unchecked** by me.
That includes:
- every `file:line` inside the per-record reasons in the disposition table (for example
  `schedulerService.ts:2082` or `openclawBrowserWorkerAgent.ts:18`);
- the brief's claim that the audit classifies `MarketingReportingAgent` as `REPORTING_UNWIRED`. I
  saw the name in the `REPORTING_UNWIRED` list at `agentRegistryAuditClassification.ts:40`, but
  didn't trace how that list is used;
- the brief's statements about other domains and production (brief `:15`, `:18`).

Those references are the matrix's, and they are cited as such.

---

## Decision sequence

The middle column names who the **source** says should decide. Where the source names nobody with
that authority, the column says so.

| Order | Decision | Decider named in the source | What it blocks until decided |
|---|---|---|---|
| 1 | Domain owner of the 13 provisional records (rows 1, 3–14) | Recommended: Sohail Syed and "the executive owner" (`marketing.json:7718`). Who can approve: **unknown** | Any work on the 5 affected capabilities and their pre-publication review. The final count of Marketing's own legacy records (40 now; 27 if all 13 leave). Every later decision that touches those rows |
| 2 | Confirm the one retirement (row 36) | "the manager's confirmation" (brief `:15`); Sohail is this domain's accountable human (`agentDomain/agentDomainRegistry.ts:113-125`) | Disabling the `Content_Marketing_Agent` registry row |
| 3 | Confirm the supersession (row 37) | Sohail, who must confirm the successor capability's scope (`marketing.json:6406`, `validation_dependency`) | Disabling the `MarketingReportingAgent` row, and treating the recurring report as its replacement. The report is also blocked on scope, recipients and cadence, and on there being no per-manager time zone (`marketing.json:6406`, `blocked_by`) |
| 4 | Confirm keeping row 38 despite its retire marking | **Not named** for the record itself. Sohail must validate its successor capability (`marketing.json:7714`) | Any reinstatement work on LinkedIn relationship suggestions, which needs its human gate rebuilt first (`:7696`) |
| 5 | Confirm the 6 merges (19 records) | **Not named** for the merges themselves. Sohail must validate each successor capability (`marketing.json:7714`) | Consolidating duplicate OpenClaw and Skool rows into one capability each |
| — | All 64 capabilities are still `draft` | Sohail, as the validation dependency of every capability (`marketing.json:7714`) | **Every** successor capability. Nothing above runs until its capability is validated |

**Outside this sequence:** the 21 unowned records (brief `:17-18`) need an owner decision that isn't
Marketing's to make. Who makes it is **unknown** from this repository.

---

## What in the brief looks wrong or incomplete

1. **Two line references have drifted.** `agentRegistrySeed.ts:1676` should be `:1678-1686`, and
   `:1194` should be `:1196` (see [Citations I verified](#citations-i-verified)). The facts they
   support are correct. The matrix itself warns that its line references drift
   (`marketing.json:7717`).
2. **The headline overstates how settled the 38 migrations are.** The brief shows "migrated_to_capability: 38"
   (`:5`) with no caveat. Its own source records that 13 of them have an unconfirmed domain owner
   (`marketing.json:7718`), and their capabilities say so in `blocked_by` (`:5225`, `:5362`, `:5480`,
   `:5600`, `:5710`). Those 13 are provisional, not settled.
3. **The brief's "Owner" field is blank** (brief `:21`), although it names Sohail as the accountable
   human (brief `:32`) and so does the domain registry (`agentDomain/agentDomainRegistry.ts:113-125`).
   That looks like a rendering gap.
4. **Claims I couldn't verify:** "no git history" for `contentMarketingAgent.ts`, since the clone is
   shallow; "28 of 39 rows marked `retire`" across three domains (brief `:15`), since other domains
   weren't examined; and "Five of them are live production rows" (brief `:18`), since there's no
   production access. These are marked **unknown**, not wrong.

---

## Remaining unknowns

- **Who has the authority** to approve the domain owner of the 13 boundary records. The matrix only
  *recommends* that Sohail and "the executive owner" decide.
- Whether Swati Raman and Mohammed Abdul Aleem, the candidate domains' accountable humans, take part.
- Whether the live portal brief still matches the downloaded copy this plan is built from.
- Which records make up the 21 unowned records, and who decides their owner.
- Whether any record is live in production today. The repository shows code and schedules, not
  production state.
- The git history of `contentMarketingAgent.ts`.

---

## Sources

Paths are in the platform repo at `b058da6`. "Brief" lines are in the bundle's
`docs/stories/marketing.LEGACY-MIGRATION-PLAN.md`.

| Claim | Source |
|---|---|
| 40 records and their disposition counts | brief `:3-7`; `backend/src/services/agentDomain/capabilities/marketing.json:7431-7712` |
| Each record's disposition, successor and reason | `marketing.json:7437`–`:7710` (one reason line per record, in the table) |
| 13 records reached Marketing by name match; who should decide | `marketing.json:7718` |
| Unconfirmed ownership in successor capabilities | `marketing.json:5225`, `:5362`, `:5480`, `:5600`, `:5710`, `:6962` |
| All 64 capabilities `draft`; report blockers; line-drift warning | `marketing.json:7714`, `:6406`, `:7717` |
| Domain owners | `agentDomain/agentDomainRegistry.ts:89`, `:102`, `:113-125`, `:128`, `:239`; `executive.json:3`; `learner_success.json:3`; `curriculum.json:3`; `product_experience.json:3` |
| Unknown records are recorded, not guessed | `agentDomain/agentDomainStoryTemplates.ts:249-254` |
| Registry keyed on `agent_name`; `enabled` honoured only at creation | `agentRegistrySeed.ts:3165-3168`, `:3097` |
| Verified citations | `agentRegistrySeed.ts:1678-1686`, `:1196`; `agentRegistryAuditClassification.ts:23`, `:28`, `:96-98`; `agents/departments/marketing/__tests__/deletedMarketingAgents.test.ts:1-40`; `__tests__/fixtures/cronRegistryBaseline.ts:65` |
| Retirements need the manager's confirmation; unowned records; no outbound action | brief `:15`, `:17-18`, `:86-88` |
