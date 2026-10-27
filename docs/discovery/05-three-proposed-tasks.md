# Three proposed agent tasks, with boundaries and completion evidence

**Story:** `marketing.RESEARCH-5-THREE-PROPOSED-TASKS` · **Release:** Discovery and validation
**Accountable human:** Sohail Syed, Marketing Lead · **Author:** Sarbjit Kaur, with Claude Code · **Date:** 2026-10-27
**Status:** three **proposals**, draft. None is approved, built, enabled or granted any tool. No
interview with Sohail has taken place ([04](04-manager-interview.md) is a plan only), so none of
these choices reflects his answers.

> **Source convention.** As in [01](01-system-classes.md)–[04](04-manager-interview.md): paths are
> in the public platform repo
> [`ColaberryIntern/ColaberryEnterprise_AI_LeadershipAccelerator`](https://github.com/ColaberryIntern/ColaberryEnterprise_AI_LeadershipAccelerator)
> at commit `b058da6`. "The matrix" is `backend/src/services/agentDomain/capabilities/marketing.json`.
> Each fact is labelled **verified** (read in code or the matrix), **assumption** (logged, not
> checked) or **unknown**.

**This document grants no permissions and authorizes no autonomy increase.** It changes no setting.
Every level named below is a proposal for Sohail to validate. Four different things are kept
separate throughout:

| Term | Meaning | Value today, all three tasks |
|---|---|---|
| **Current level** | What the capability's `starting_autonomy` records now | `R0` ("define the workflow, requirements, risks and human decisions", `autonomyLadder.ts:59`) |
| **Proposed next step** | The rung this document asks Sohail to consider, and only after he validates the capability | Task 1: `R2`, then `R4`. Task 2: `R2`, then `R4`. Task 3: `R1`, then `R4` |
| **Platform ceiling** | `max_permitted_autonomy`: the highest rung the matrix would ever allow. A limit, not a target | Task 1: `R9`. Task 2: `R4`. Task 3: `R7` |
| **Actual authorization** | What anyone has approved | **None.** All 64 capabilities are `draft` (`marketing.json:7714`), and the marketing agent is disabled with no tools (`agentRegistry/domainAgents.ts:66-71`) |

---

## The three, at a glance

| # | Task | Matrix capability | Built today? | Current → proposed next → ceiling | Approver |
|---|---|---|---|---|---|
| 1 | Explain campaign funnel health | `marketing.campaign_funnel_performance_analysis` (`marketing.json:4081`) | the underlying job: yes, already scheduled | `R0` → `R2`/`R4` → `R9` | Sohail Syed |
| 2 | Compose the recurring marketing report (no sending) | `marketing.recurring_marketing_performance_reporting` (`marketing.json:6406`) | **no**: capability `absent` | `R0` → `R2`/`R4` → `R4` | Sohail Syed |
| 3 | Draft multi-network posts for approval | `marketing.content_composition_and_variant_generation` (`marketing.json:2657`) | the composer: yes | `R0` → `R1`/`R4` → `R7` | Sohail Syed (with Ali for Marketing Approval) |

**Why these three.** The brief requires choosing from the domain's 64 draft capabilities rather than
inventing tasks (`agentDomainStoryTemplates.ts:195-196`). These are the three
[04](04-manager-interview.md) Q3 puts to Sohail as candidates. Between them they cover reading
(1), assembling (2) and writing a draft (3), and each sits on the "proposed transition" side of
[03](03-role-and-da-transition.md) (rows 11 and 2).
- **Task 1** is already running, read-only.
- **Task 2** is the only item the matrix labels a DA responsibility.
- **Task 3** is the drafting that AI already does today.

**If Sohail's Q3 answer differs, his answer wins** and this document gets revised.

**Why not lead generation first.** You've called this the "Marketing Intelligence & Lead Generation"
agent. The platform's title for the domain is "Marketing Intelligence & Brand"
(`agentDomainRegistry.ts:116`). The lead-generation capabilities exist (for example
`marketing.social_signal_discovery`, `marketing.json:19`, and
`marketing.outreach_lead_capture_and_scoring`, `marketing.json:1861`). They run on the OpenClaw
agents, whose writes are not checked by the platform's permission service (`marketing.json:7722`),
and first contact with a new lead always needs a human yes (`agentAutonomy.ts:125`). A first task
should not inherit an unenforced write path. That's an argument for sequencing, not a ruling: Sohail
decides.

**What "available" means for tools below.** The tool names are the matrix's own declarations,
because "no global allow-list of agent capabilities exists in the repository" (`marketing.json:7724`).
The marketing agent has **no tools granted** (`agentRegistry/domainAgents.ts:71`). So every tool is
*not available to the agent* today. What the tables check is whether the **underlying code or data
exists**. No access to a CRM, Mailchimp, analytics suite or social account is assumed anywhere.

---

## Task 1: Explain campaign funnel health

### Completion evidence (written first)

The task completed correctly when **all** of these are true. A task being marked done, time
passing, a good conversation, or a mocked test passing does not count
(`agentDomainResearchPrompts.ts`, RESEARCH-5 evidence rule; `promotionCriteria.ts:14-15` records
106 approvals decided by a timer).
- **At `R2`:** every verdict the agent states reproduces from the stored report, and the failure
  rate is given with its denominator (`marketing.json:4081`, release criteria).
- **At `R4`:** a sandbox run that includes a malformed campaign row lists that row in `errors`,
  never counts it in `campaigns_processed`, and two runs return identical numbers (same source).
- **Throughout:** a record of every answer the agent gave and the stored report it cited, so Sohail
  can check any answer against the data.

### Must NOT do (boundary)

- Pause, edit or reschedule any campaign or email. The capability is "read-only by contract", and
  its test asserts that no write method is ever called
  (`agents/departments/marketing/__tests__/campaignPerformanceAgent.test.ts:20-27`, `:71-73`).
- Combine two tenants in one answer or report (`marketing.json:4081`, outputs).
- Decide what to do about a degraded funnel. That is Sohail's call, and unvalidated
  (`marketing.json:4081`, `blocked_by`).
- Raise alerts in production. That belongs to the `R9` rung, which is out of scope for this
  proposal.

| Field | Content | Status |
|---|---|---|
| **Business need** | "A broken funnel is found by a check rather than by someone noticing" (`marketing.json:4081`) | verified |
| **Trigger / input** | Sohail asks about a campaign or the whole funnel. Inputs: active campaigns, enrolled lead counts, scheduled-email sent/pending/failed counts (`marketing.json:4081`) | verified |
| **Workflow** | Read the latest stored funnel report, which is produced every six hours by `DeptCampaignPerformanceAgent` (`aiOpsScheduler.ts:189`). Answer with the verdict, the counts and the failure rate with its denominator. Say so when the report is stale or missing | verified (the report job). The agent-answering layer is proposed |
| **Expected output** | A plain-language answer per campaign: healthy / degraded / empty, with the numbers behind it | proposed |
| **Supporting evidence** | Scheduled (`aiOpsScheduler.ts:189`); registered and enabled (`agentRegistrySeed.ts:1937-1946`); implementation (`agents/departments/marketing/campaignPerformanceAgent.ts`, 359 lines); read-only test (above). **The existing job already runs in production. That is not this task.** This task is the marketing agent *answering from* the job's reports. The job's own production `autonomy_level` is **unknown** from the repository (`marketing.json:7719`) | verified, except the production level |
| **Tools and data** | `read_marketing_database`, `agent_activity_log_write` (matrix names). Data: tables `campaigns`, `campaign_leads`, `scheduled_emails` (`marketing.json:4081`, evidence) | Code and tables: verified in the matrix and code. Granted to the agent: **no**. Production row counts: **unknown** (no database access) |
| **Approval gate** | Sohail validates the capability out of `draft` before anything runs (`marketing.json:4081`, `validation_dependency`). No per-answer approval is needed, because nothing is written | verified |
| **Measurable success** | The two release criteria above, pass or fail. No baseline numbers exist and none are invented here. A target (for example, how quickly a degraded campaign gets a human decision) is for Sohail to set as a **proposed** threshold ([04](04-manager-interview.md) Q6) | criteria verified; thresholds **unknown** |
| **Autonomy** | **Current:** `R0`. **Proposed next step:** `R2`, then `R4`, sandbox only. **Ceiling:** `R9`, because the capability is read-only, tenant-partitioned and uses bounded queries, and "two runs over unchanged data leave the database byte-identical" (`marketing.json:4081`, `max_autonomy_rationale`). **Authorized:** none | current and ceiling verified; the step is proposed |
| **Risks** | Counts can be "wrong-but-plausible" after a stale read or a cancelled query, and no in-process check can detect that (`marketing.json:4081`, exceptions). The degraded threshold is unvalidated | verified |
| **Switch it off if** | Any answer doesn't reproduce from the stored report; any answer mixes tenants; any write appears from this agent in the activity log | proposed |
| **Unresolved** | What counts as "degraded" for Sohail, and what he does when one appears; whether `/admin/marketing/performance` already meets the need without an agent | **unknown** ([04](04-manager-interview.md) Q3, Q6) |

---

## Task 2: Compose the recurring marketing report (no sending)

### Completion evidence (written first)

- **At `R2`:** every figure in an on-demand answer cites its registry key and trust status, and
  figures it can't compute are named, never shown as zero (`marketing.json:6406`, release criteria).
- **At `R4`:** two sandbox renders over the same period are identical, and every untrusted metric is
  left out of every total and listed as unavailable (same source).
- **Throughout:** each rendered report is stored with the exact metric set it was built from
  (`marketing.json:6406`, workflow), so any number can be traced back.

### Must NOT do (boundary)

- Send the report by email or any other channel. Real email is a default-denied capability
  (`delivery/execution/executionPolicy.ts:33`), and the matrix keeps delivery as "a human-initiated
  or separately-authorised send" (`marketing.json:6406`, `max_autonomy_rationale`).
- Show any money figure (revenue, cost, ROI) until `marketing.revenue_and_cost_metric_truthing` lands
  (`marketing.json:6406`, `blocked_by`).
- Fill in, estimate or zero a figure it can't compute.
- Choose the report's scope, recipients or cadence. Sohail hasn't defined them
  (`marketing.json:6406`, `blocked_by`).

| Field | Content | Status |
|---|---|---|
| **Business need** | "The recurring marketing report a data analyst assembles by hand ... is produced on a cadence from registered metrics, with every untrustworthy figure named rather than filled in" (`marketing.json:6406`) | verified as the matrix's statement. **Who assembles it today is unknown** ([03](03-role-and-da-transition.md) open question 2) |
| **Trigger / input** | Sohail requests a report for a period. Inputs: registered marketing metrics and their trust status, a period, and later a recipient, cadence and time zone (`marketing.json:6406`) | verified |
| **Workflow** | Resolve the metric scope against the registry, compute each metric with its trust status, exclude untrusted ones and list them, render, and store with its metric set. The matrix's last step, delivery, is **excluded** from this proposal (`marketing.json:6406`, workflow) | verified, minus delivery |
| **Expected output** | A report Sohail can preview in the admin surface, plus a list of figures that couldn't be computed | proposed |
| **Supporting evidence** | Matrix record (`marketing.json:6406`). The declared but never-wired `MarketingReportingAgent` (`agentRegistrySeed.ts:1678-1686`): its module `agents/reporting/departmentReporterAgent.ts` **exists**, but has no scheduler entry and no importer (Query R2). An orchestration service also exists (`reporting/reportingOrchestrationService.ts`) | verified |
| **Tools and data** | `read_marketing_database`, `metric_registry_read`, `kpi_snapshot_write`, `email_engagement_metrics_read` (matrix names). Data: tables `department_reports`, `kpi_snapshots` (`marketing.json:6406`, evidence) | The matrix marks the capability **`absent`**. An unwired reporter module exists; whether it meets this capability's workflow is **unknown** (not reviewed). Granted: **no**. Where `email_engagement_metrics_read` gets its data: **unknown** |
| **Approval gate** | Sohail validates the capability and defines scope, cadence and recipients first. Every send stays a human action. Human-reserved at every level (`human_decision: true`) | verified |
| **Measurable success** | The two release criteria above. Pass/fail is checkable without a baseline. Which metrics belong in the report is Sohail's to define | criteria verified; scope **unknown** |
| **Autonomy** | **Current:** `R0`. **Proposed next step:** `R2`, then `R4`, sandbox only. **Ceiling:** `R4`, because "Composing the report is safe ... Delivering it sends real mail, which is a denied capability", and a human-reserved capability is capped at `R5` by code anyway (`autonomyLadder.ts:214-219`). **Authorized:** none | current and ceiling verified; the step is proposed |
| **Risks** | The capability is `absent`, so delivering it is build work. How much the unwired reporter module can be reused is unknown. Report scope could drift into money figures before they're trustworthy. There's no per-manager time-zone field, so scheduled delivery isn't time-zone-safe (`marketing.json:7208`) | verified |
| **Switch it off if** | Any figure appears without its registry key; any untrusted figure appears in a total; any money figure appears early; any attempt to send | proposed |
| **Unresolved** | Who produces this report today, for whom and how often, and which figures Sohail distrusts ([04](04-manager-interview.md) Q2) | **unknown** |

---

## Task 3: Draft multi-network posts for approval

### Completion evidence (written first)

- **At `R1`:** in a fixture run, every provider in the target set gets a variant, and the revision
  number moves on every recorded edit (`marketing.json:2657`, release criteria).
- **At `R4`:** an edit after approval always invalidates that approval, and a read-only imported
  item always refuses the edit (same source). The workflow records invalidation as an event, not an
  overwrite (`content/contentWorkflowService.ts:25-28`).
- **Throughout:** the approval trail shows a human as the decider on every draft that moved
  forward. The agent never appears as `decided_by` (`marketing.json:2899`, `R3` criterion).

### Must NOT do (boundary)

- Approve its own draft, or anyone's. Approval stays human at every level (`marketing.json:2899`).
- Publish or schedule anything. Every public post needs a human yes (`agentAutonomy.ts:123`). Live
  connectors are off by default (`publishing/providerCapabilities.ts:310-321`), and the publishing
  worker is seeded disabled (`agentRegistrySeed.ts:3102`).
- Invent brand positioning. The launch brief requires the brand canon, "never invent positioning"
  (`13-sohail-marketing.md:65`), and brand voice is still unvalidated (`marketing.json:2657`,
  `blocked_by`).
- Edit an imported historical item (`marketing.json:2657`, exceptions).

| Field | Content | Status |
|---|---|---|
| **Business need** | "One idea becomes a per-network post ... so publishing to five places does not mean rewriting five times" (`marketing.json:2657`). Today, "CB drafts; you direct + approve" (`13-sohail-marketing.md:3`) | verified |
| **Trigger / input** | Sohail starts a content item: brand, campaign, content type, target networks, and a base message or generation brief (`marketing.json:2657`) | verified |
| **Workflow** | Set up the item, draft the base message, generate one variant per network, attach media, and record every edit so the revision moves (`marketing.json:2657`). Then the item goes to the human approval queue | verified (the composer). The agent driving it is proposed |
| **Expected output** | A draft `content_items` row with one `content_variants` row per network and an audited edit trail (`marketing.json:2657`), sitting in the approval queue | verified |
| **Supporting evidence** | Composer services exist: `content/composerService.ts`, `composerVariants.ts`, `contentWorkflowService.ts`, plus `routes/admin/contentComposerRoutes.ts` | verified (files present) |
| **Tools and data** | `llm_text_generation`, `read_marketing_database`, `content_item_draft_write`, `media_asset_attach`, `brand_governance_rules_read` (matrix names). Tables: `content_items`, `content_variants`, `content_item_media` | Code: verified. Granted: **no**. An LLM provider is a dependency (`marketing.json:2657`), and whether one is configured in production is **unknown** |
| **Approval gate** | Sohail validates the capability and the brand voice first. Each draft then needs Marketing Approval, which is Ali + Sohail (`03-team-roster.md:30`) | verified |
| **Measurable success** | The release criteria above, pass or fail. A quality measure such as "share of drafts approved without edits" is a **candidate** for Sohail to set ([04](04-manager-interview.md) Q6). No current rate is known and none is assumed | criteria verified; quality threshold **unknown** |
| **Autonomy** | **Current:** `R0`. **Proposed next step:** `R1`, then `R4`, sandbox only. **Ceiling:** `R7`, because "Composing is fully reversible: an item stays a draft until a separate approval and a separate publish act on it" (`marketing.json:2657`, `max_autonomy_rationale`). **Authorized:** none | current and ceiling verified; the step is proposed |
| **Risks** | Off-brand or invented copy reaching the approval queue and wasting reviewer time. Approval fatigue, where a busy reviewer approves without reading, which is the failure the timer-decided approvals show (`promotionCriteria.ts:14-15`) | verified (pattern); likelihood here **unknown** |
| **Switch it off if** | Any draft reaches a published or scheduled state without a human approval event; the agent appears as an approver; a draft contradicts the brand canon after brand voice has been validated | proposed |
| **Unresolved** | Brand voice and default networks (`marketing.json:2657`, `blocked_by`); whether email copy is in scope ([03](03-role-and-da-transition.md) row 6, [04](04-manager-interview.md) Q4) | **unknown** |

---

## Assumptions, and what can't be verified

**Assumptions** (3, each logged):
1. Sohail's shortlist will overlap with these three. That's untested until the interview
   ([04](04-manager-interview.md) Q3).
2. Read-only access, as in Task 1, is the lowest-risk first grant. This follows the platform's own
   ordering (`autonomyLadder.ts:59-68`) but is not a decision anyone has made.
3. The marketing agent will run through `workforceAgentRuntime`, so its writes pass
   `validateAgentWrite` ([02](02-agent-anatomy.md), element 8). If it doesn't, Task 3's write path
   would be unenforced too.

**Can't be verified from the repository:**
- production data volumes and whether the tables are populated;
- whether an LLM provider is configured;
- the source of email engagement metrics;
- any baseline KPI;
- Sohail's priorities.

None is filled in with a guess.

---

## Sources

Paths are in the platform repo at `b058da6` unless noted.

| Claim | Source |
|---|---|
| Choose from the domain's draft capabilities; state start, ceiling and why; the evidence rule | `backend/src/services/agentDomain/agentDomainStoryTemplates.ts:190-202`; `agentDomainResearchPrompts.ts` (RESEARCH-5 entry) |
| Acceptance criteria | `backend/src/scripts/lib/researchStoryAcceptance.js:57-61` |
| Domain title | `backend/src/services/agentDomain/agentDomainRegistry.ts:116` |
| Capability records | `marketing.json:19`, `:1861`, `:2657`, `:2899`, `:4081`, `:6406` |
| Tool names are the matrix's own; no global allow-list | `marketing.json:7724` |
| Unenforced writes for OpenClaw agents | `marketing.json:7722` |
| No per-manager time zone | `marketing.json:7208` |
| No tools granted to the marketing agent | `backend/src/services/agentRegistry/domainAgents.ts:71` |
| Funnel agent scheduled | `backend/src/services/aiOpsScheduler.ts:189` |
| Funnel agent registered and enabled | `backend/src/services/agentRegistrySeed.ts:1937-1946` |
| Funnel job's production autonomy level not verifiable | `marketing.json:7719` |
| Current level R0 meaning | `backend/src/services/agentDomain/autonomyLadder.ts:59` |
| All 64 capabilities `draft`; agent disabled with no tools | `marketing.json:7714`; `backend/src/services/agentRegistry/domainAgents.ts:66-71` |
| Funnel agent writes nothing (test) | `backend/src/services/agents/departments/marketing/__tests__/campaignPerformanceAgent.test.ts:20-27`, `:71-73` |
| `MarketingReportingAgent` declared but never wired | `backend/src/services/agentRegistrySeed.ts:1678-1686`; Query R2 |
| Approval invalidation is an event | `backend/src/services/content/contentWorkflowService.ts:25-28` |
| Human yes for public posts and new leads | `backend/src/services/agentAutonomy.ts:123`, `:125` |
| Real email denied by default | `backend/src/services/delivery/execution/executionPolicy.ts:33` |
| Live connectors off; publishing worker disabled | `backend/src/services/publishing/providerCapabilities.ts:310-321`; `agentRegistrySeed.ts:3102` |
| Human-reserved ⇒ capped at R5; ladder rungs | `backend/src/services/agentDomain/autonomyLadder.ts:59-68`, `:214-219` |
| 106 timer-decided approvals | `backend/src/services/agentDomain/promotionCriteria.ts:14-15` |
| Brand canon; "CB drafts"; Marketing Approval | `docs/training-program-2026-q3/launch-briefs/13-sohail-marketing.md:3`, `:65`; `03-team-roster.md:30` |

### Queries

Run from `backend/src/services` in the platform repo:

```sh
# R1: the funnel agent is on the scheduler
grep -n "DeptCampaignPerformanceAgent" aiOpsScheduler.ts

# R2: MarketingReportingAgent is never wired. The module file exists, but there
#     is no scheduler entry (no output), and the module is named only as a
#     source_file string in the two registry seeds (agentRegistrySeed.ts,
#     agentRegistrySeed-Ali-AI.ts). No import (last command: no output)
ls agents/reporting/departmentReporterAgent.ts
grep -n "MarketingReportingAgent" aiOpsScheduler.ts schedulerService.ts
grep -rn "departmentReporterAgent" --include=*.ts . | grep -v __tests__
grep -rn "from .*departmentReporterAgent\|require(.*departmentReporterAgent" --include=*.ts --include=*.js .. | grep -v __tests__
```
