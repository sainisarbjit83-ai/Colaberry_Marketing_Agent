# Capability inventory

Every capability the platform has researched for the Marketing Intelligence & Brand domain, sorted by
where it stands. Facts come from the platform capability record (read only), `.colaberry/agent-domain.json`
and `.colaberry/progress.json`. Nothing here approves, builds or grants anything.

**As of:** November 11, 2026 (platform capability record `backend/src/services/agentDomain/capabilities/marketing.json` read at platform commit `04d10f464`, unchanged since October 23, 2026; snapshot and progress.json at repository commit `805e3ed`).

## Summary by stage

| Stage | Count | What it means here | Source |
|---|---|---|---|
| **Discovered** | 64 | Researched and recorded by the platform as a capability of this domain | platform capability record |
| **Proposed** | 9 capabilities, plus 5 Phase 2 tools | Capabilities the research classifies `proposed_new` (not existing today); and the five tools in Ali's brief (section "Proposed outside the capability record") | platform `classification`; the challenge brief |
| **Approved** | 0 | Validated by the accountable human. Every capability is `draft`; none is validated, and no autonomy above the starting level is approved | platform `requirement_validation_state` |
| **Code exists (platform-reported)** | 36 implemented, 20 partial | The platform reports that code for it exists (`implementation_state`). This is existing or inherited code, not built by this project. **Existing code is not necessarily functional, validated or approved**: none of these capabilities has been validated by its accountable human or passed an acceptance criterion. 7 are absent and 1 unknown | platform `implementation_state` |
| **Tested** | 0 | No capability story has a passed acceptance criterion (0 of 1 on all 64) | `progress.json` |
| **Blocked** | 64 | Carries at least one recorded blocker | platform `blocked_by` |
| **Human-reserved** | 28 | A human decision at every autonomy level; never automated, and capped at R5 by `effectiveAuthority()` | platform `human_decision` |

A capability can sit in several stages at once (for example code exists, blocked and human-reserved).

### By classification (platform)

| Classification | Count |
|---|---|
| `inherited` | 25 |
| `existing_application` | 24 |
| `manager_defined` | 6 |
| `proposed_new` | 9 |

## Every capability

Effective authority is `autonomy:R0` for all. Ceiling is the highest rung the capability may ever reach (`max_permitted_autonomy`); a ceiling is a limit, not a grant.

| Capability | Name | Classification | Implementation | Validation | Human-reserved | Ceiling | Blockers | Story state |
|---|---|---|---|---|---|---|---|---|
| `social_signal_discovery` | Public-platform buying-signal discovery | inherited | implemented | draft | No | R7 | 2 | in_progress (0/1) |
| `community_signal_detection` | Skool community question detection | inherited | implemented | draft | No | R6 | 3 | in_progress (0/1) |
| `signal_triage_and_prioritisation` | Outreach signal triage | inherited | implemented | draft | No | R7 | 2 | in_progress (0/1) |
| `outreach_reply_drafting` | Platform-native reply drafting | inherited | implemented | draft | No | R7 | 2 | in_progress (0/1) |
| `outreach_quality_gate` | Deterministic pre-publication quality gate | inherited | partial | draft | No | R7 | 2 | in_progress (0/1) |
| `outreach_reply_publication` | Approved reply publication to public platforms | inherited | implemented | draft | Yes | R5 | 4 | in_progress (0/1) |
| `community_direct_message_response` | Community notification and direct-message response | inherited | implemented | draft | Yes | R4 | 4 | in_progress (0/1) |
| `engagement_monitoring_and_intent_scoring` | Posted-content engagement monitoring | inherited | implemented | draft | No | R7 | 2 | in_progress (0/1) |
| `conversation_followup_sequencing` | Stalled-conversation follow-up drafting | inherited | implemented | draft | No | R7 | 2 | in_progress (0/1) |
| `outreach_queue_supervision` | Outreach work-queue supervision and recovery | inherited | implemented | draft | No | R9 | 1 | in_progress (0/1) |
| `browser_session_reliability` | Headless browser session health and self-healing | inherited | implemented | draft | No | R9 | 2 | in_progress (0/1) |
| `outreach_learning_loop` | Outreach performance learning loop | inherited | partial | draft | No | R7 | 2 | in_progress (0/1) |
| `platform_change_surveillance` | Outreach platform and tooling change watch | inherited | implemented | draft | No | R7 | 2 | in_progress (0/1) |
| `linkedin_comment_watch_and_reply_drafting` | Tracked LinkedIn post comment watch | inherited | implemented | draft | No | R7 | 2 | in_progress (0/1) |
| `authority_content_drafting` | Authority and thought-leadership content drafting | inherited | partial | draft | Yes | R5 | 2 | in_progress (0/1) |
| `linkedin_relationship_action_suggestions` | LinkedIn relationship action suggestions | inherited | partial | draft | Yes | R4 | 3 | in_progress (0/1) |
| `outreach_lead_capture_and_scoring` | Social-signal lead capture and tiering | existing_application | implemented | draft | No | R7 | 2 | in_progress (0/1) |
| `outreach_conversion_attribution` | Social-outreach conversion attribution | existing_application | partial | draft | No | R6 | 3 | in_progress (0/1) |
| `outreach_rate_and_circuit_control` | Outreach rate limiting and circuit breaking | existing_application | implemented | draft | No | R9 | 2 | in_progress (0/1) |
| `outreach_post_verification` | Published-comment visibility verification | existing_application | partial | draft | No | R7 | 2 | in_progress (0/1) |
| `outreach_daily_human_action_queue` | Daily human outreach action queue | existing_application | implemented | draft | No | R7 | 2 | in_progress (0/1) |
| `brand_registry_and_readiness` | Brand registry and publish readiness | existing_application | implemented | draft | No | R7 | 1 | in_progress (0/1) |
| `channel_account_connection_and_credential_custody` | Social channel connection and credential custody | existing_application | implemented | draft | Yes | R2 | 3 | none recorded (0/1) |
| `content_composition_and_variant_generation` | Multi-network content composition | existing_application | implemented | draft | No | R7 | 1 | in_progress (0/1) |
| `content_platform_fitness_validation` | Per-network content fitness validation | existing_application | implemented | draft | No | R9 | 2 | in_progress (0/1) |
| `content_approval_workflow` | Content approval with revision-pinned decisions | existing_application | implemented | draft | Yes | R4 | 2 | in_progress (0/1) |
| `brand_governance_enforcement` | Brand governance rule enforcement | existing_application | implemented | draft | Yes | R5 | 2 | in_progress (0/1) |
| `banned_copy_compliance_scanning` | Banned-copy compliance scanning across source | existing_application | implemented | draft | No | R9 | 1 | in_progress (0/1) |
| `brand_social_publishing` | Brand social publishing queue | inherited | partial | draft | Yes | R5 | 3 | in_progress (0/1) |
| `publishing_failure_and_handoff_recovery` | Publishing failure and handoff reconciliation | existing_application | implemented | draft | Yes | R4 | 2 | in_progress (0/1) |
| `marketing_calendar_planning` | Marketing calendar and scheduled-content planning | existing_application | implemented | draft | No | R7 | 2 | in_progress (0/1) |
| `marketing_overview_and_attention_triage` | Marketing overview and needs-attention triage | existing_application | implemented | draft | No | R9 | 1 | in_progress (0/1) |
| `landing_page_generation_and_publication` | Landing page generation and publication | existing_application | implemented | draft | Yes | R5 | 4 | in_progress (0/1) |
| `content_history_import_from_loomly` | Content history import from the incumbent scheduler | existing_application | partial | draft | Yes | R4 | 3 | in_progress (0/1) |
| `marketing_surface_problem_reporting` | In-surface problem reporting for marketing operators | existing_application | implemented | draft | No | R2 | 2 | in_progress (0/1) |
| `campaign_funnel_performance_analysis` | Campaign funnel performance analysis | existing_application | implemented | draft | No | R9 | 1 | in_progress (0/1) |
| `campaign_and_channel_metric_reporting` | Campaign and channel metric reporting under a trust registry | existing_application | partial | draft | No | R7 | 2 | in_progress (0/1) |
| `multi_touch_attribution` | Multi-touch campaign attribution with honest coverage | existing_application | partial | draft | No | R7 | 2 | in_progress (0/1) |
| `tracked_link_and_utm_governance` | Tracked link, UTM taxonomy and traffic registration | inherited | partial | draft | No | R7 | 2 | in_progress (0/1) |
| `brand_attribution_of_campaigns` | Brand attribution integrity for campaigns | existing_application | implemented | draft | No | R7 | 2 | in_progress (0/1) |
| `campaign_approval_and_golive` | Campaign approval and go-live control | existing_application | partial | draft | Yes | R3 | 4 | in_progress (0/1) |
| `outreach_consent_and_channel_suppression` | Per-channel consent and suppression honouring | existing_application | partial | draft | Yes | R2 | 3 | in_progress (0/1) |
| `marketing_department_strategy_planning` | Marketing department strategy and initiative planning | inherited | partial | draft | No | R6 | 2 | in_progress (0/1) |
| `content_idea_proposal_queue` | Grounded content-idea proposal queue | inherited | implemented | draft | No | R7 | 1 | in_progress (0/1) |
| `ai_news_ingestion_and_card_publication` | AI news ingestion and daily card publication | inherited | implemented | draft | Yes | R5 | 3 | in_progress (0/1) |
| `intelligence_card_generation` | Multi-source intelligence card generation | inherited | implemented | draft | Yes | R5 | 3 | in_progress (0/1) |
| `free_tier_learner_journey_scoring` | Free-tier learner journey scoring | inherited | implemented | draft | No | R7 | 3 | in_progress (0/1) |
| `free_tier_next_best_action_decisioning` | Free-tier next-best-action decisioning in shadow | inherited | implemented | draft | Yes | R5 | 4 | in_progress (0/1) |
| `lifecycle_content_catalogue_projection` | Lifecycle content catalogue projection | inherited | implemented | draft | No | R9 | 3 | in_progress (0/1) |
| `publishing_calendar_operations_ownership` | Day-to-day publishing calendar ownership and tool retirement | manager_defined | unknown | draft | Yes | R2 | 3 | in_progress (0/1) |
| `brand_network_connection_administration` | Brand network connection administration | manager_defined | partial | draft | Yes | R2 | 3 | in_progress (0/1) |
| `handoff_package_manual_publication` | Handoff package publication by a person | manager_defined | implemented | draft | Yes | R4 | 2 | in_progress (0/1) |
| `platform_app_review_and_representation` | Network app review and public representation | manager_defined | partial | draft | Yes | R2 | 3 | in_progress (0/1) |
| `metric_trust_escalation_decisions` | Marketing metric trust escalation and resolution | manager_defined | partial | draft | Yes | R3 | 3 | in_progress (0/1) |
| `marketing_agent_management_and_oversight` | Manager oversight of the marketing AI employee | manager_defined | partial | draft | Yes | R2 | 4 | in_progress (0/1) |
| `recurring_marketing_performance_reporting` | Recurring marketing performance reporting (DA responsibility in transition) | proposed_new | absent | draft | Yes | R4 | 4 | in_progress (0/1) |
| `revenue_and_cost_metric_truthing` | Revenue and cost-per-lead truthing | proposed_new | partial | draft | Yes | R4 | 3 | in_progress (0/1) |
| `outreach_human_approval_gap_closure` | Closing the outreach human-approval bypasses | proposed_new | absent | draft | Yes | R4 | 3 | in_progress (0/1) |
| `agent_write_authorization_enforcement` | Enforcing agent write authorization on marketing agents | proposed_new | absent | draft | Yes | R4 | 3 | in_progress (0/1) |
| `intelligence_card_prepublication_review` | Pre-publication review for generated intelligence cards | proposed_new | absent | draft | Yes | R4 | 3 | in_progress (0/1) |
| `brand_and_competitor_mention_monitoring` | Brand and competitor mention monitoring | proposed_new | absent | draft | No | R6 | 3 | in_progress (0/1) |
| `content_repurposing_and_template_library` | Content repurposing and reusable template library | proposed_new | absent | draft | No | R7 | 2 | in_progress (0/1) |
| `manager_marketing_brief_subscription` | Manager marketing brief subscription | proposed_new | partial | draft | Yes | R4 | 4 | in_progress (0/1) |
| `outreach_coverage_and_blind_spot_reporting` | Outreach coverage and blind-spot reporting | proposed_new | absent | draft | No | R9 | 1 | in_progress (0/1) |

## Proposed outside the capability record

Ali's First Build Challenge expects five tools, to be confirmed or corrected after Phase 1 and approved by Ali before
any are built. Source: Ali's brief, `brand-campaign-challenge.md`, which is not currently stored in this repository (see
[MASTER-ROADMAP.md](MASTER-ROADMAP.md), section 4). They are **Proposed**, not in the platform capability record, and have no story id.

| Proposed tool | Input | Output | Stage |
|---|---|---|---|
| Brand profile | A brand name | Audience, belief shift, voice rules, approved proof points | Proposed |
| Campaign planner | A brand profile and a date range | A dated calendar of planned posts | Proposed |
| Post drafter | A calendar entry and a brand profile | A drafted post in that brand's voice | Proposed |
| Compliance check | A drafted post | Pass or fail, with the rule it broke | Proposed |
| Performance log | A posted link | Whatever the channel reports back | Proposed |

## Notes

- `social_signal_discovery` was audited on October 30, 2026; its R2 criterion is not met. See [../discovery/social-signal-discovery-audit.md](../discovery/social-signal-discovery-audit.md).
- One capability story is recorded in `progress.json` under a truncated id; its platform state is not set.
- The platform labels 63 capability stories `in_progress`. That label does not mean this project has worked on them.
