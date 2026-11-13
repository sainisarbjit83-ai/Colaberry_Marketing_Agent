# Master roadmap: Colaberry Marketing Agent

The central document for the project: what we are building, why, what has been done, what is
proposed next, and what must be decided first.

**As of:** November 11, 2026 (repository commit `805e3ed`, platform commit `04d10f464`).

## How to read the statuses

Every story or step in this roadmap has exactly one of these statuses:

| Status | In plain words | Example here |
|---|---|---|
| **Completed** | Finished and confirmed. For a platform story: every acceptance criterion passes with evidence **and** the platform has recorded it as verified. For work that is not a platform story: delivered and documented | The five research stories |
| **In Progress** | Someone is actively working on it now | None at the moment |
| **Blocked** | Cannot start or continue until a named dependency is resolved: a missing answer, a missing approval of scope, or a recorded blocker. The next move belongs to someone other than the person doing the work | Phase 1A brand profiles (waiting for answers from Ali) |
| **Proposed** | Suggested as a future step, not yet started, and not an approved commitment | Phase 1B calendars, every Phase 2 tool |
| **Awaiting Approval** | The work itself is done, or the question is fully prepared, and what remains is a person's sign-off or the platform's confirmation | `marketing.STORY-000` |

**Awaiting Approval is not the same as Blocked.** STORY-000 is Awaiting Approval because the work
is finished and evidenced; only the platform's verification and Sohail's review are left. Phase 1A
is Blocked because the work cannot be done yet: the answers it depends on do not exist.

## 1. Vision and business objective

The project builds a marketing agent for Colaberry's **Marketing Intelligence & Brand** domain.
**Ava** is the name Ali's First Build Challenge uses for this domain's AI employee. It is not
the registered platform name: the platform's agent record for this domain has no display name
(`.colaberry/agent-domain.json`, `agent.display_name` is empty). The domain's accountable human is
**Sohail Syed**, Marketing Lead.

The platform's capability research names 64 things this domain does or could do (see
[capability-inventory.md](capability-inventory.md)). The business objective, as the challenge
frames it, is to run real marketing for Colaberry well enough, by hand first, that the parts
worth automating become obvious and safe to hand to Ava.

## 2. The problem we are solving

From Ali's challenge brief (two live, unsolved problems):

1. **The Colaberry training brand** has "a presence that is inconsistent and largely unattended.
   There is no running campaign."
2. **Ali's personal brand**, to carry a new YouTube initiative, "does not exist in any organized
   form yet."

The November 10, 2026 research confirmed both, with evidence: see
[../marketing-campaign-challenge/02-colaberry-brand-research.md](../marketing-campaign-challenge/02-colaberry-brand-research.md)
and [../marketing-campaign-challenge/03-ali-personal-brand-research.md](../marketing-campaign-challenge/03-ali-personal-brand-research.md).
The two brands are kept separate throughout: a company brand and a personal brand need a
different voice, cadence and proof.

## 3. The intended role of Ava

- **Ava drafts. A person approves. A person publishes.** Nothing publishes on its own. See
  [human-approval-boundaries.md](human-approval-boundaries.md).
- Ava's tools are decided **after** the campaigns have been run by hand, and Ali confirms the
  tool list before any are built.
- Today the agent record exists, is **disabled**, sits at agent-level autonomy `observe`, and has
  **0 tools granted**. Every capability's effective authority is `autonomy:R0`.

## 4. How the plan is ordered

Ali's First Build Challenge sets the order: **do the marketing job by hand, evaluate it, then
decide what to automate.** It replaced Social Signal Discovery as the first build, because "you
cannot automate a job you have not done by hand."

**Source of this direction:** Ali's brief, `brand-campaign-challenge.md` ("First Build Challenge:
run two real campaigns, then teach Ava to run them"). The brief is **not currently stored in this
repository**; it was provided by Ali outside it. Its content is summarized in
[../marketing-campaign-challenge/01-project-overview.md](../marketing-campaign-challenge/01-project-overview.md).
Everything in this roadmap about the challenge, its phases and its tools comes from that brief.

```
Done                              Now                                   Proposed (not approved)
r0 Discovery and validation  ->   First Build Challenge, Phase 1   ->   Phase 2: tools for Ava
r1 Legacy migration plan          (two brands, run by hand)             (scope confirmed by Ali)
STORY-000 Command Center
                                                                    ->  r2 capability stories,
                                                                        one at a time, once
                                                                        validated by Sohail
```

## 5. Existing stories

### 5a. Platform stories with a known outcome

| Story | Purpose | Delivered | Roadmap status | Artifacts |
|---|---|---|---|---|
| `marketing.RESEARCH-1-SYSTEM-CLASSES` | Place this domain among the five system classes | Analysis recommending a tool-using agent inside fixed workflows | **Completed** (platform verified) | [../discovery/01-system-classes.md](../discovery/01-system-classes.md) |
| `marketing.RESEARCH-2-AGENT-ANATOMY` | Map the nine anatomy elements onto this domain's agent | Element-by-element map (4 of 9 unknown) | **Completed** (platform verified) | [../discovery/02-agent-anatomy.md](../discovery/02-agent-anatomy.md) |
| `marketing.RESEARCH-3-ROLE-AND-DA-TRANSITION` | Document Sohail Syed's role and which data-analyst duties transition | Role description; proposed split of responsibilities | **Completed** (platform verified) | [../discovery/03-role-and-da-transition.md](../discovery/03-role-and-da-transition.md) |
| `marketing.RESEARCH-4-MANAGER-INTERVIEW` | Prepare a 30-minute interview with Sohail and a weekly check-in | Interview plan (not yet held) | **Completed** (platform verified) | [../discovery/04-manager-interview.md](../discovery/04-manager-interview.md) |
| `marketing.RESEARCH-5-THREE-PROPOSED-TASKS` | Capture three proposed agent tasks with boundaries and evidence | Three proposals, none approved; permission and approval-boundary checks | **Completed** (platform verified) | [../discovery/05-three-proposed-tasks.md](../discovery/05-three-proposed-tasks.md) |
| `marketing.LEGACY-MIGRATION-PLAN` | Account for every inherited legacy agent record | Disposition for all 40 records (proposals until Sohail confirms) | **Completed** (platform verified) | [../migration/legacy-migration-plan.md](../migration/legacy-migration-plan.md) |
| `marketing.STORY-000` | Build the Command Center: six panels showing the domain, its ladder and governance honestly | Static Command Center (`index.html`, `assets/`), 334 rendered-page checks and 13 question-box checks passing (last run November 9, 2026) | **Awaiting Approval.** All 6 criteria are ticked with evidence and pushed (commit `805e3ed`); the platform record still shows `in_progress`, 0 of 6, because it has not synced since November 4, 2026; Sohail closes it against the page | [../stories/marketing.STORY-000.md](../stories/marketing.STORY-000.md) |

Story artifact folders do not exist yet; see [../artifacts/README.md](../artifacts/README.md).

### 5b. STORY-001

**No STORY-001 exists in the repository evidence.** It is not in `.colaberry/plan.json` or
`.colaberry/progress.json`; the only appearance of the id is as an example in this repository's
`CLAUDE.md`. Ali's First Build Challenge (sections 5d and 6) is the natural candidate, but no story id
has been assigned to it. **Status: Awaiting Approval** of whether, and under what id, the platform
records it.

### 5c. Capability stories (release r2)

64 stories, one per researched capability (`marketing.CAP.*`). Every one is **draft**, carries a
recorded blocker, has 0 of 1 criteria passed, and sits at effective authority `autonomy:R0`.
Roadmap status for all 64: **Blocked**, until Sohail validates the capability and its blocker
is resolved. The platform records 63 as `in_progress` and 1 with no state; that platform label
does not mean work has been done on them.

One has had dedicated work: **`marketing.CAP.social_signal_discovery`** was audited (October 30,
2026) and its R2 path investigated (November 9, 2026). Its R2 criterion is not met. Social Signal
Discovery was **replaced as the first build** by Ali's First Build Challenge; the capability itself
**remains in the capability inventory** and in the plan, Blocked like the other 63. Evidence:
[../discovery/social-signal-discovery-audit.md](../discovery/social-signal-discovery-audit.md).

### 5d. First Build Challenge progress

The challenge is **directed by Ali** (his brief), but it is **not a platform story**: it has no story
id (see 5b). Its completed steps are recorded here; its future steps are in section 6.

| Step | Delivered | Roadmap status | Artifacts |
|---|---|---|---|
| Phase 1 research | What is published under both brands today, with source URLs and labeled evidence (November 10, 2026). Documentation only | **Completed** | [../marketing-campaign-challenge/README.md](../marketing-campaign-challenge/README.md) |

The full list, with purpose and status, is in the appendix (section 9).

## 6. Proposed future stories

The remaining steps of Ali's First Build Challenge (its completed research is in section 5d). Ali
set the direction; the individual steps have **no platform story id**, and each is labeled by where
it actually stands. Each runs separately for the two brands.

| Step | Expected delivery | Depends on | Roadmap status |
|---|---|---|---|
| 1A Brand profiles | One page per brand: audience, belief shift, the ask, evidenced proof, two test sentences of voice | Answers to open questions 1, 2, 4, 5 and 13 | **Blocked** on those answers |
| 1B Content calendars | Two weeks per brand: channel, date, hook, body, call to action, expected result | 1A approved; posting accounts (question 11); start date (question 12) | **Proposed** |
| 1C Write the posts | All posts written in one batch before any are posted | 1B | **Proposed** |
| 1D Post and log | Posted by a person; a log of what each post returned | 1C; a person and accounts to post from | **Proposed** |
| 1E Lessons learned | One page on what worked, and where judgment calls were hard | 1D | **Proposed** |
| Phase 2 tool: Brand profile | Brand name in; audience, belief shift, voice rules, approved proof out | 1E; Ali confirms the tool list | **Proposed** |
| Phase 2 tool: Campaign planner | Brand profile and date range in; dated calendar out | Brand profile tool | **Proposed** |
| Phase 2 tool: Post drafter | Calendar entry and brand profile in; drafted post out | Campaign planner | **Proposed** |
| Phase 2 tool: Compliance check | Drafted post in; pass or fail with the rule broken | The marketing content rules, kept in full in [human-approval-boundaries.md](human-approval-boundaries.md#marketing-content-rules-authoritative-copy) | **Proposed** |
| Phase 2 tool: Performance log | Posted link in; whatever the channel reports out | 1D shows what channels report | **Proposed** |
| Phase 2 demo | Brand profile and date range in; a drafted calendar a person could approve | All five tools | **Proposed** |

Each Phase 2 tool needs a typed input and output, and tests for the happy path, bad input, and
running twice with the same result. Deliverables per the brief: brand pages and calendars by
email at the end of week 1; posts, log and writeup as a visual PDF built from HTML at the end of
week 2.

**Ali's personal YouTube initiative:** its link, topic, audience and start date are **UNKNOWN**
(open question 1). Nothing in this roadmap assumes them.

## 7. Dependencies and decisions required

Before Phase 1A can start (tracked with owners in
[../marketing-campaign-challenge/04-open-questions-and-decisions.md](../marketing-campaign-challenge/04-open-questions-and-decisions.md)):

- The YouTube initiative link (question 1) and confirmation of Ali's identity (question 2).
- The scope of "training brand" (question 4).
- Evidence for Colaberry's published statistics (question 5); without it, no proof points.
- Who approves the two brand profiles (question 13).

Before Phase 1D: which accounts are used and who posts (question 11), and the start date
(question 12).

Before Phase 2: Ali confirms the tool list after reading the 1E writeup.

Before any capability story moves: Sohail validates it, its blocker is resolved, and any tool it
needs is requested and approved by a human (see
[capability-to-tool-mapping.md](capability-to-tool-mapping.md)).

Other decisions this documentation surfaces:

- Whether STORY-001 should be created for the First Build Challenge, and by whom.
- Whether completed stories' existing documents are moved or copied into
  [../artifacts/](../artifacts/README.md), or only linked.
- Whether the live training site's prohibited "free" wording is fixed (question 6).

## 8. What is known to be out of date or unknown

- The platform has not synced since November 4, 2026, so its record for `marketing.STORY-000`
  predates our ticks.
- The interview with Sohail ([../discovery/04-manager-interview.md](../discovery/04-manager-interview.md))
  has not taken place, so none of the capabilities has a manager-confirmed priority.
- Production values of the agent's configuration are UNKNOWN beyond what the snapshot shows.

## 9. Appendix: all 64 capability stories

Source: platform capability record (read only) and `.colaberry/progress.json`. Roadmap status for
every row is **Blocked** (draft, with a recorded blocker). Details, tools and ceilings:
[capability-inventory.md](capability-inventory.md) and
[capability-to-tool-mapping.md](capability-to-tool-mapping.md).

| Story | Capability | Implementation | Human-reserved | Platform state | Roadmap status |
|---|---|---|---|---|---|
| `marketing.CAP.social_signal_discovery` | Public-platform buying-signal discovery | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.community_signal_detection` | Skool community question detection | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.signal_triage_and_prioritisation` | Outreach signal triage | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.outreach_reply_drafting` | Platform-native reply drafting | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.outreach_quality_gate` | Deterministic pre-publication quality gate | partial | No | in_progress (0/1) | Blocked |
| `marketing.CAP.outreach_reply_publication` | Approved reply publication to public platforms | implemented | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.community_direct_message_response` | Community notification and direct-message response | implemented | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.engagement_monitoring_and_intent_scoring` | Posted-content engagement monitoring | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.conversation_followup_sequencing` | Stalled-conversation follow-up drafting | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.outreach_queue_supervision` | Outreach work-queue supervision and recovery | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.browser_session_reliability` | Headless browser session health and self-healing | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.outreach_learning_loop` | Outreach performance learning loop | partial | No | in_progress (0/1) | Blocked |
| `marketing.CAP.platform_change_surveillance` | Outreach platform and tooling change watch | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.linkedin_comment_watch_and_reply_drafting` | Tracked LinkedIn post comment watch | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.authority_content_drafting` | Authority and thought-leadership content drafting | partial | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.linkedin_relationship_action_suggestions` | LinkedIn relationship action suggestions | partial | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.outreach_lead_capture_and_scoring` | Social-signal lead capture and tiering | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.outreach_conversion_attribution` | Social-outreach conversion attribution | partial | No | in_progress (0/1) | Blocked |
| `marketing.CAP.outreach_rate_and_circuit_control` | Outreach rate limiting and circuit breaking | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.outreach_post_verification` | Published-comment visibility verification | partial | No | in_progress (0/1) | Blocked |
| `marketing.CAP.outreach_daily_human_action_queue` | Daily human outreach action queue | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.brand_registry_and_readiness` | Brand registry and publish readiness | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.channel_account_connection_and_credential_cust` | Social channel connection and credential custody | implemented | Yes | none recorded (0/1) | Blocked |
| `marketing.CAP.content_composition_and_variant_generation` | Multi-network content composition | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.content_platform_fitness_validation` | Per-network content fitness validation | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.content_approval_workflow` | Content approval with revision-pinned decisions | implemented | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.brand_governance_enforcement` | Brand governance rule enforcement | implemented | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.banned_copy_compliance_scanning` | Banned-copy compliance scanning across source | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.brand_social_publishing` | Brand social publishing queue | partial | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.publishing_failure_and_handoff_recovery` | Publishing failure and handoff reconciliation | implemented | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.marketing_calendar_planning` | Marketing calendar and scheduled-content planning | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.marketing_overview_and_attention_triage` | Marketing overview and needs-attention triage | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.landing_page_generation_and_publication` | Landing page generation and publication | implemented | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.content_history_import_from_loomly` | Content history import from the incumbent scheduler | partial | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.marketing_surface_problem_reporting` | In-surface problem reporting for marketing operators | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.campaign_funnel_performance_analysis` | Campaign funnel performance analysis | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.campaign_and_channel_metric_reporting` | Campaign and channel metric reporting under a trust registry | partial | No | in_progress (0/1) | Blocked |
| `marketing.CAP.multi_touch_attribution` | Multi-touch campaign attribution with honest coverage | partial | No | in_progress (0/1) | Blocked |
| `marketing.CAP.tracked_link_and_utm_governance` | Tracked link, UTM taxonomy and traffic registration | partial | No | in_progress (0/1) | Blocked |
| `marketing.CAP.brand_attribution_of_campaigns` | Brand attribution integrity for campaigns | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.campaign_approval_and_golive` | Campaign approval and go-live control | partial | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.outreach_consent_and_channel_suppression` | Per-channel consent and suppression honouring | partial | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.marketing_department_strategy_planning` | Marketing department strategy and initiative planning | partial | No | in_progress (0/1) | Blocked |
| `marketing.CAP.content_idea_proposal_queue` | Grounded content-idea proposal queue | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.ai_news_ingestion_and_card_publication` | AI news ingestion and daily card publication | implemented | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.intelligence_card_generation` | Multi-source intelligence card generation | implemented | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.free_tier_learner_journey_scoring` | Free-tier learner journey scoring | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.free_tier_next_best_action_decisioning` | Free-tier next-best-action decisioning in shadow | implemented | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.lifecycle_content_catalogue_projection` | Lifecycle content catalogue projection | implemented | No | in_progress (0/1) | Blocked |
| `marketing.CAP.publishing_calendar_operations_ownership` | Day-to-day publishing calendar ownership and tool retirement | unknown | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.brand_network_connection_administration` | Brand network connection administration | partial | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.handoff_package_manual_publication` | Handoff package publication by a person | implemented | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.platform_app_review_and_representation` | Network app review and public representation | partial | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.metric_trust_escalation_decisions` | Marketing metric trust escalation and resolution | partial | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.marketing_agent_management_and_oversight` | Manager oversight of the marketing AI employee | partial | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.recurring_marketing_performance_reporting` | Recurring marketing performance reporting (DA responsibility in transition) | absent | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.revenue_and_cost_metric_truthing` | Revenue and cost-per-lead truthing | partial | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.outreach_human_approval_gap_closure` | Closing the outreach human-approval bypasses | absent | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.agent_write_authorization_enforcement` | Enforcing agent write authorization on marketing agents | absent | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.intelligence_card_prepublication_review` | Pre-publication review for generated intelligence cards | absent | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.brand_and_competitor_mention_monitoring` | Brand and competitor mention monitoring | absent | No | in_progress (0/1) | Blocked |
| `marketing.CAP.content_repurposing_and_template_library` | Content repurposing and reusable template library | absent | No | in_progress (0/1) | Blocked |
| `marketing.CAP.manager_marketing_brief_subscription` | Manager marketing brief subscription | partial | Yes | in_progress (0/1) | Blocked |
| `marketing.CAP.outreach_coverage_and_blind_spot_reporting` | Outreach coverage and blind-spot reporting | absent | No | in_progress (0/1) | Blocked |
