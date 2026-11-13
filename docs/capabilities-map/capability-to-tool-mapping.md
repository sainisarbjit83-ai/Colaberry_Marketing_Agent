# Capability to tool mapping

Which tools each capability needs, the story it belongs to, and its current status. Tool names are the platform
capability record's `required_tools`. **No tool is granted today** (`agent.tools_granted_count` is 0 in
`.colaberry/agent-domain.json`), and the governance queue holds no tool requests. A tool request grants nothing until a
human approves it; see [human-approval-boundaries.md](human-approval-boundaries.md).

**As of:** November 11, 2026 (platform capability record `backend/src/services/agentDomain/capabilities/marketing.json` read at platform commit `04d10f464`, unchanged since October 23, 2026; snapshot and progress.json at repository commit `805e3ed`).

## Summary

- **39** distinct tools are named across **64** capabilities.
- **0** are granted. **0** tool requests are filed.
- The most needed: `read_marketing_database` (62), `sandbox_database_write` (23), `llm_text_generation` (15), `metric_registry_read` (12), `content_item_draft_write` (9).

## By capability

Status: story state from `progress.json` (criteria passed), effective authority from the snapshot.

| Capability | Story | Required tools | Status |
|---|---|---|---|
| `social_signal_discovery` | `marketing.CAP.social_signal_discovery` | `platform_public_api_read_allowlisted`, `read_marketing_database`, `sandbox_database_write`, `agent_activity_log_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `community_signal_detection` | `marketing.CAP.community_signal_detection` | `headless_browser_sandbox`, `read_marketing_database`, `sandbox_database_write`, `credential_vault_read_scoped` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `signal_triage_and_prioritisation` | `marketing.CAP.signal_triage_and_prioritisation` | `read_marketing_database`, `sandbox_database_write`, `risk_classification_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `outreach_reply_drafting` | `marketing.CAP.outreach_reply_drafting` | `llm_text_generation`, `read_marketing_database`, `content_item_draft_write`, `brand_governance_rules_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `outreach_quality_gate` | `marketing.CAP.outreach_quality_gate` | `read_marketing_database`, `brand_governance_rules_read`, `sandbox_database_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `outreach_reply_publication` | `marketing.CAP.outreach_reply_publication` | `headless_browser_sandbox`, `sandbox_social_post_dry_run`, `screenshot_capture`, `read_marketing_database`, `sandbox_database_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `community_direct_message_response` | `marketing.CAP.community_direct_message_response` | `headless_browser_sandbox`, `llm_text_generation`, `read_marketing_database`, `sandbox_database_write`, `credential_vault_read_scoped` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `engagement_monitoring_and_intent_scoring` | `marketing.CAP.engagement_monitoring_and_intent_scoring` | `platform_public_api_read_allowlisted`, `llm_text_generation`, `read_marketing_database`, `sandbox_database_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `conversation_followup_sequencing` | `marketing.CAP.conversation_followup_sequencing` | `llm_text_generation`, `read_marketing_database`, `content_item_draft_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `outreach_queue_supervision` | `marketing.CAP.outreach_queue_supervision` | `read_marketing_database`, `openclaw_task_queue_write`, `circuit_breaker_state_read`, `agent_activity_log_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `browser_session_reliability` | `marketing.CAP.browser_session_reliability` | `read_marketing_database`, `headless_browser_sandbox`, `sandbox_database_write`, `agent_activity_log_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `outreach_learning_loop` | `marketing.CAP.outreach_learning_loop` | `read_marketing_database`, `sandbox_database_write`, `metric_registry_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `platform_change_surveillance` | `marketing.CAP.platform_change_surveillance` | `platform_public_api_read_allowlisted`, `sandbox_database_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `linkedin_comment_watch_and_reply_drafting` | `marketing.CAP.linkedin_comment_watch_and_reply_drafting` | `llm_text_generation`, `read_marketing_database`, `content_item_draft_write`, `credential_vault_read_scoped` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `authority_content_drafting` | `marketing.CAP.authority_content_drafting` | `llm_text_generation`, `read_marketing_database`, `content_item_draft_write`, `brand_governance_rules_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `linkedin_relationship_action_suggestions` | `marketing.CAP.linkedin_relationship_action_suggestions` | `read_marketing_database`, `llm_text_generation`, `sandbox_database_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `outreach_lead_capture_and_scoring` | `marketing.CAP.outreach_lead_capture_and_scoring` | `read_marketing_database`, `sandbox_database_write`, `lead_record_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `outreach_conversion_attribution` | `marketing.CAP.outreach_conversion_attribution` | `read_marketing_database`, `sandbox_database_write`, `tracked_link_mint` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `outreach_rate_and_circuit_control` | `marketing.CAP.outreach_rate_and_circuit_control` | `read_marketing_database`, `circuit_breaker_state_read`, `agent_activity_log_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `outreach_post_verification` | `marketing.CAP.outreach_post_verification` | `platform_public_api_read_allowlisted`, `read_marketing_database`, `sandbox_database_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `outreach_daily_human_action_queue` | `marketing.CAP.outreach_daily_human_action_queue` | `read_marketing_database` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `brand_registry_and_readiness` | `marketing.CAP.brand_registry_and_readiness` | `read_marketing_database`, `brand_governance_rules_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `channel_account_connection_and_credential_custody` | `marketing.CAP.channel_account_connection_and_credential_cust` | `read_marketing_database`, `oauth_connect_flow_initiate`, `credential_vault_read_scoped` | none recorded, 0/1 passed; effective R0; tools granted 0 |
| `content_composition_and_variant_generation` | `marketing.CAP.content_composition_and_variant_generation` | `llm_text_generation`, `read_marketing_database`, `content_item_draft_write`, `media_asset_attach`, `brand_governance_rules_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `content_platform_fitness_validation` | `marketing.CAP.content_platform_fitness_validation` | `read_marketing_database`, `provider_capability_registry_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `content_approval_workflow` | `marketing.CAP.content_approval_workflow` | `read_marketing_database`, `approval_request_open`, `content_item_draft_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `brand_governance_enforcement` | `marketing.CAP.brand_governance_enforcement` | `read_marketing_database`, `brand_governance_rules_read`, `brand_offer_policy_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `banned_copy_compliance_scanning` | `marketing.CAP.banned_copy_compliance_scanning` | `repository_source_read`, `ast_parse` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `brand_social_publishing` | `marketing.CAP.brand_social_publishing` | `read_marketing_database`, `sandbox_social_post_dry_run`, `publishing_handoff_package_mint`, `credential_vault_read_scoped`, `kill_switch_state_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `publishing_failure_and_handoff_recovery` | `marketing.CAP.publishing_failure_and_handoff_recovery` | `read_marketing_database`, `publishing_job_state_write`, `sandbox_database_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `marketing_calendar_planning` | `marketing.CAP.marketing_calendar_planning` | `read_marketing_database` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `marketing_overview_and_attention_triage` | `marketing.CAP.marketing_overview_and_attention_triage` | `read_marketing_database`, `metric_registry_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `landing_page_generation_and_publication` | `marketing.CAP.landing_page_generation_and_publication` | `llm_text_generation`, `read_marketing_database`, `content_item_draft_write`, `landing_page_preview_render`, `repo_branch_commit_sandbox` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `content_history_import_from_loomly` | `marketing.CAP.content_history_import_from_loomly` | `read_marketing_database`, `csv_export_file_read`, `content_item_draft_write`, `sandbox_database_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `marketing_surface_problem_reporting` | `marketing.CAP.marketing_surface_problem_reporting` | `read_marketing_database` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `campaign_funnel_performance_analysis` | `marketing.CAP.campaign_funnel_performance_analysis` | `read_marketing_database`, `agent_activity_log_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `campaign_and_channel_metric_reporting` | `marketing.CAP.campaign_and_channel_metric_reporting` | `read_marketing_database`, `metric_registry_read`, `email_engagement_metrics_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `multi_touch_attribution` | `marketing.CAP.multi_touch_attribution` | `read_marketing_database`, `metric_registry_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `tracked_link_and_utm_governance` | `marketing.CAP.tracked_link_and_utm_governance` | `read_marketing_database`, `tracked_link_mint`, `metric_registry_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `brand_attribution_of_campaigns` | `marketing.CAP.brand_attribution_of_campaigns` | `read_marketing_database`, `metric_registry_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `campaign_approval_and_golive` | `marketing.CAP.campaign_approval_and_golive` | `read_marketing_database`, `approval_request_open`, `tracked_link_mint` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `outreach_consent_and_channel_suppression` | `marketing.CAP.outreach_consent_and_channel_suppression` | `read_marketing_database`, `suppression_list_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `marketing_department_strategy_planning` | `marketing.CAP.marketing_department_strategy_planning` | `read_marketing_database`, `llm_text_generation`, `initiative_ticket_create`, `proposed_agent_action_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `content_idea_proposal_queue` | `marketing.CAP.content_idea_proposal_queue` | `read_marketing_database`, `llm_text_generation`, `proposed_agent_action_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `ai_news_ingestion_and_card_publication` | `marketing.CAP.ai_news_ingestion_and_card_publication` | `rss_feed_read`, `llm_text_generation`, `read_marketing_database`, `intel_card_draft_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `intelligence_card_generation` | `marketing.CAP.intelligence_card_generation` | `rss_feed_read`, `youtube_data_api_read`, `llm_text_generation`, `read_marketing_database`, `intel_card_draft_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `free_tier_learner_journey_scoring` | `marketing.CAP.free_tier_learner_journey_scoring` | `read_marketing_database`, `sandbox_database_write`, `metric_registry_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `free_tier_next_best_action_decisioning` | `marketing.CAP.free_tier_next_best_action_decisioning` | `read_marketing_database`, `sandbox_database_write`, `suppression_list_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `lifecycle_content_catalogue_projection` | `marketing.CAP.lifecycle_content_catalogue_projection` | `read_marketing_database`, `sandbox_database_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `publishing_calendar_operations_ownership` | `marketing.CAP.publishing_calendar_operations_ownership` | `read_marketing_database`, `csv_export_file_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `brand_network_connection_administration` | `marketing.CAP.brand_network_connection_administration` | `read_marketing_database`, `oauth_connect_flow_initiate` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `handoff_package_manual_publication` | `marketing.CAP.handoff_package_manual_publication` | `read_marketing_database`, `publishing_handoff_package_mint` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `platform_app_review_and_representation` | `marketing.CAP.platform_app_review_and_representation` | `repository_source_read`, `read_marketing_database` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `metric_trust_escalation_decisions` | `marketing.CAP.metric_trust_escalation_decisions` | `read_marketing_database`, `metric_registry_read`, `repository_source_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `marketing_agent_management_and_oversight` | `marketing.CAP.marketing_agent_management_and_oversight` | `read_marketing_database`, `manager_directive_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `recurring_marketing_performance_reporting` | `marketing.CAP.recurring_marketing_performance_reporting` | `read_marketing_database`, `metric_registry_read`, `kpi_snapshot_write`, `email_engagement_metrics_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `revenue_and_cost_metric_truthing` | `marketing.CAP.revenue_and_cost_metric_truthing` | `read_marketing_database`, `metric_registry_read`, `repository_source_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `outreach_human_approval_gap_closure` | `marketing.CAP.outreach_human_approval_gap_closure` | `read_marketing_database`, `repository_source_read`, `sandbox_database_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `agent_write_authorization_enforcement` | `marketing.CAP.agent_write_authorization_enforcement` | `read_marketing_database`, `repository_source_read`, `agent_activity_log_write`, `sandbox_database_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `intelligence_card_prepublication_review` | `marketing.CAP.intelligence_card_prepublication_review` | `read_marketing_database`, `intel_card_draft_write`, `approval_request_open`, `sandbox_database_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `brand_and_competitor_mention_monitoring` | `marketing.CAP.brand_and_competitor_mention_monitoring` | `platform_public_api_read_allowlisted`, `llm_text_generation`, `read_marketing_database`, `sandbox_database_write` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `content_repurposing_and_template_library` | `marketing.CAP.content_repurposing_and_template_library` | `llm_text_generation`, `read_marketing_database`, `content_item_draft_write`, `brand_governance_rules_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `manager_marketing_brief_subscription` | `marketing.CAP.manager_marketing_brief_subscription` | `read_marketing_database`, `metric_registry_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |
| `outreach_coverage_and_blind_spot_reporting` | `marketing.CAP.outreach_coverage_and_blind_spot_reporting` | `read_marketing_database`, `metric_registry_read` | in_progress, 0/1 passed; effective R0; tools granted 0 |

## By tool

| Tool | Granted | Needed by (count) | Capabilities |
|---|---|---|---|
| `read_marketing_database` | No | 62 | `social_signal_discovery`, `community_signal_detection`, `signal_triage_and_prioritisation`, `outreach_reply_drafting`, `outreach_quality_gate`, `outreach_reply_publication`, `community_direct_message_response`, `engagement_monitoring_and_intent_scoring`, `conversation_followup_sequencing`, `outreach_queue_supervision`, `browser_session_reliability`, `outreach_learning_loop`, `linkedin_comment_watch_and_reply_drafting`, `authority_content_drafting`, `linkedin_relationship_action_suggestions`, `outreach_lead_capture_and_scoring`, `outreach_conversion_attribution`, `outreach_rate_and_circuit_control`, `outreach_post_verification`, `outreach_daily_human_action_queue`, `brand_registry_and_readiness`, `channel_account_connection_and_credential_custody`, `content_composition_and_variant_generation`, `content_platform_fitness_validation`, `content_approval_workflow`, `brand_governance_enforcement`, `brand_social_publishing`, `publishing_failure_and_handoff_recovery`, `marketing_calendar_planning`, `marketing_overview_and_attention_triage`, `landing_page_generation_and_publication`, `content_history_import_from_loomly`, `marketing_surface_problem_reporting`, `campaign_funnel_performance_analysis`, `campaign_and_channel_metric_reporting`, `multi_touch_attribution`, `tracked_link_and_utm_governance`, `brand_attribution_of_campaigns`, `campaign_approval_and_golive`, `outreach_consent_and_channel_suppression`, `marketing_department_strategy_planning`, `content_idea_proposal_queue`, `ai_news_ingestion_and_card_publication`, `intelligence_card_generation`, `free_tier_learner_journey_scoring`, `free_tier_next_best_action_decisioning`, `lifecycle_content_catalogue_projection`, `publishing_calendar_operations_ownership`, `brand_network_connection_administration`, `handoff_package_manual_publication`, `platform_app_review_and_representation`, `metric_trust_escalation_decisions`, `marketing_agent_management_and_oversight`, `recurring_marketing_performance_reporting`, `revenue_and_cost_metric_truthing`, `outreach_human_approval_gap_closure`, `agent_write_authorization_enforcement`, `intelligence_card_prepublication_review`, `brand_and_competitor_mention_monitoring`, `content_repurposing_and_template_library`, `manager_marketing_brief_subscription`, `outreach_coverage_and_blind_spot_reporting` |
| `sandbox_database_write` | No | 23 | `social_signal_discovery`, `community_signal_detection`, `signal_triage_and_prioritisation`, `outreach_quality_gate`, `outreach_reply_publication`, `community_direct_message_response`, `engagement_monitoring_and_intent_scoring`, `browser_session_reliability`, `outreach_learning_loop`, `platform_change_surveillance`, `linkedin_relationship_action_suggestions`, `outreach_lead_capture_and_scoring`, `outreach_conversion_attribution`, `outreach_post_verification`, `publishing_failure_and_handoff_recovery`, `content_history_import_from_loomly`, `free_tier_learner_journey_scoring`, `free_tier_next_best_action_decisioning`, `lifecycle_content_catalogue_projection`, `outreach_human_approval_gap_closure`, `agent_write_authorization_enforcement`, `intelligence_card_prepublication_review`, `brand_and_competitor_mention_monitoring` |
| `llm_text_generation` | No | 15 | `outreach_reply_drafting`, `community_direct_message_response`, `engagement_monitoring_and_intent_scoring`, `conversation_followup_sequencing`, `linkedin_comment_watch_and_reply_drafting`, `authority_content_drafting`, `linkedin_relationship_action_suggestions`, `content_composition_and_variant_generation`, `landing_page_generation_and_publication`, `marketing_department_strategy_planning`, `content_idea_proposal_queue`, `ai_news_ingestion_and_card_publication`, `intelligence_card_generation`, `brand_and_competitor_mention_monitoring`, `content_repurposing_and_template_library` |
| `metric_registry_read` | No | 12 | `outreach_learning_loop`, `marketing_overview_and_attention_triage`, `campaign_and_channel_metric_reporting`, `multi_touch_attribution`, `tracked_link_and_utm_governance`, `brand_attribution_of_campaigns`, `free_tier_learner_journey_scoring`, `metric_trust_escalation_decisions`, `recurring_marketing_performance_reporting`, `revenue_and_cost_metric_truthing`, `manager_marketing_brief_subscription`, `outreach_coverage_and_blind_spot_reporting` |
| `content_item_draft_write` | No | 9 | `outreach_reply_drafting`, `conversation_followup_sequencing`, `linkedin_comment_watch_and_reply_drafting`, `authority_content_drafting`, `content_composition_and_variant_generation`, `content_approval_workflow`, `landing_page_generation_and_publication`, `content_history_import_from_loomly`, `content_repurposing_and_template_library` |
| `brand_governance_rules_read` | No | 7 | `outreach_reply_drafting`, `outreach_quality_gate`, `authority_content_drafting`, `brand_registry_and_readiness`, `content_composition_and_variant_generation`, `brand_governance_enforcement`, `content_repurposing_and_template_library` |
| `agent_activity_log_write` | No | 6 | `social_signal_discovery`, `outreach_queue_supervision`, `browser_session_reliability`, `outreach_rate_and_circuit_control`, `campaign_funnel_performance_analysis`, `agent_write_authorization_enforcement` |
| `repository_source_read` | No | 6 | `banned_copy_compliance_scanning`, `platform_app_review_and_representation`, `metric_trust_escalation_decisions`, `revenue_and_cost_metric_truthing`, `outreach_human_approval_gap_closure`, `agent_write_authorization_enforcement` |
| `credential_vault_read_scoped` | No | 5 | `community_signal_detection`, `community_direct_message_response`, `linkedin_comment_watch_and_reply_drafting`, `channel_account_connection_and_credential_custody`, `brand_social_publishing` |
| `platform_public_api_read_allowlisted` | No | 5 | `social_signal_discovery`, `engagement_monitoring_and_intent_scoring`, `platform_change_surveillance`, `outreach_post_verification`, `brand_and_competitor_mention_monitoring` |
| `headless_browser_sandbox` | No | 4 | `community_signal_detection`, `outreach_reply_publication`, `community_direct_message_response`, `browser_session_reliability` |
| `approval_request_open` | No | 3 | `content_approval_workflow`, `campaign_approval_and_golive`, `intelligence_card_prepublication_review` |
| `intel_card_draft_write` | No | 3 | `ai_news_ingestion_and_card_publication`, `intelligence_card_generation`, `intelligence_card_prepublication_review` |
| `tracked_link_mint` | No | 3 | `outreach_conversion_attribution`, `tracked_link_and_utm_governance`, `campaign_approval_and_golive` |
| `circuit_breaker_state_read` | No | 2 | `outreach_queue_supervision`, `outreach_rate_and_circuit_control` |
| `csv_export_file_read` | No | 2 | `content_history_import_from_loomly`, `publishing_calendar_operations_ownership` |
| `email_engagement_metrics_read` | No | 2 | `campaign_and_channel_metric_reporting`, `recurring_marketing_performance_reporting` |
| `oauth_connect_flow_initiate` | No | 2 | `channel_account_connection_and_credential_custody`, `brand_network_connection_administration` |
| `proposed_agent_action_write` | No | 2 | `marketing_department_strategy_planning`, `content_idea_proposal_queue` |
| `publishing_handoff_package_mint` | No | 2 | `brand_social_publishing`, `handoff_package_manual_publication` |
| `rss_feed_read` | No | 2 | `ai_news_ingestion_and_card_publication`, `intelligence_card_generation` |
| `sandbox_social_post_dry_run` | No | 2 | `outreach_reply_publication`, `brand_social_publishing` |
| `suppression_list_read` | No | 2 | `outreach_consent_and_channel_suppression`, `free_tier_next_best_action_decisioning` |
| `ast_parse` | No | 1 | `banned_copy_compliance_scanning` |
| `brand_offer_policy_read` | No | 1 | `brand_governance_enforcement` |
| `initiative_ticket_create` | No | 1 | `marketing_department_strategy_planning` |
| `kill_switch_state_read` | No | 1 | `brand_social_publishing` |
| `kpi_snapshot_write` | No | 1 | `recurring_marketing_performance_reporting` |
| `landing_page_preview_render` | No | 1 | `landing_page_generation_and_publication` |
| `lead_record_write` | No | 1 | `outreach_lead_capture_and_scoring` |
| `manager_directive_read` | No | 1 | `marketing_agent_management_and_oversight` |
| `media_asset_attach` | No | 1 | `content_composition_and_variant_generation` |
| `openclaw_task_queue_write` | No | 1 | `outreach_queue_supervision` |
| `provider_capability_registry_read` | No | 1 | `content_platform_fitness_validation` |
| `publishing_job_state_write` | No | 1 | `publishing_failure_and_handoff_recovery` |
| `repo_branch_commit_sandbox` | No | 1 | `landing_page_generation_and_publication` |
| `risk_classification_read` | No | 1 | `signal_triage_and_prioritisation` |
| `screenshot_capture` | No | 1 | `outreach_reply_publication` |
| `youtube_data_api_read` | No | 1 | `intelligence_card_generation` |

## Proposed Phase 2 tools (not in the capability record)

From Ali's First Build Challenge (source: his brief, `brand-campaign-challenge.md`, not currently stored in this
repository; see [MASTER-ROADMAP.md](MASTER-ROADMAP.md), section 4). **Proposed**, no story id, not mapped to platform tools yet. Which platform tools each
would need is **UNKNOWN** until Phase 1 shows the job and Ali confirms the tool list.

| Proposed tool | Related step | Platform tools it would need | Status |
|---|---|---|---|
| Brand profile | 1A | UNKNOWN | Proposed |
| Campaign planner | 1B | UNKNOWN | Proposed |
| Post drafter | 1C | UNKNOWN | Proposed |
| Compliance check | 1C (rules in the brief) | UNKNOWN | Proposed |
| Performance log | 1D | UNKNOWN | Proposed |
