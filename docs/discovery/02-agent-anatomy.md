# The nine anatomy elements, mapped onto Marketing's agent

**Story:** `marketing.RESEARCH-2-AGENT-ANATOMY` · **Release:** Discovery and validation
**Accountable human:** Sohail Syed · **Author:** Sarbjit Kaur, with Claude Code · **Date:** 2026-10-23
**Status:** draft for Sohail's review. Nothing in this document enables an agent, grants a tool or raises an autonomy level.

> **Source convention.** As in [01-system-classes.md](01-system-classes.md): paths are in the public
> platform repo
> [`ColaberryIntern/ColaberryEnterprise_AI_LeadershipAccelerator`](https://github.com/ColaberryIntern/ColaberryEnterprise_AI_LeadershipAccelerator)
> at commit `b058da6`. "The matrix" is `backend/src/services/agentDomain/capabilities/marketing.json`.

---

## Headline: 4 of 9 are unknown

| # | Element | For the marketing agent today | Status |
|---|---|---|---|
| 1 | Reasoning | nothing: no persona, no prompt, no charter | **unknown** |
| 2 | Memory | nothing: no approved memories, and nobody has decided what it should remember | **unknown** |
| 3 | Inputs | not wired; the domain's data sources exist and are named in the matrix | known, missing |
| 4 | Communication | blocked: Sohail gets a 403 until `reports_to` is set | known, missing |
| 5 | Tools | none granted; 39 declared in the matrix | known, missing |
| 6 | Procedures | nothing: no marketing employee charter or directive | **unknown** |
| 7 | Coordination | does not exist in the platform | known, missing |
| 8 | Safeguards | platform gates exist; the grant map is checked only on the workforce-director path, and partially | known, partial |
| 9 | Verification | nothing: no reference outcomes to evaluate it against | **unknown** |

**0 of 9 exist for this agent**, because the agent itself does not exist. The marketing domain has
`agent_id: null` (`agentDomainRegistry.ts:121`). The seeded `MarketingDomainAgent` row is disabled,
has no tools and has no `system_prompt` (`agentRegistry/domainAgents.ts:66-71`, `:84-91`).

The statuses use this rule. **Unknown** means the repository holds no approved design for what
this agent's version of the element should be, so any answer would be a guess. **Known, missing**
means the element is absent, but the repository already says what it would be built from.

The reference throughout is **Dara**, the platform's only finished AI employee. She has a persona,
six named tools and a written charter (`agentRegistrySeed.ts:2502-2531`;
`docs/architecture/ai-workforce-management/employees/curriculum/`). Dara is what "done" looks like
here.

---

## 1. Reasoning: unknown

- **Exists today:** the mechanism. An agent's reasoning is configured by `system_prompt` and
  versioned by `persona_version` (`models/AiAgent.ts:240-242`). Dara uses both
  (`agentRegistrySeed.ts:2523`, `:2531`). The marketing workflows that call a model today do it
  with a single text prompt and no tool use. For example, `openclawAiHelper.ts:16-21` sends one
  user message to `gpt-4o` and returns text.
- **Missing:** any persona or prompt for a marketing employee, and any decision on whether it needs
  model reasoning at all.
- **First honest version:** no free-form reasoning. Of the 64 capabilities, 36 are already
  implemented as deterministic code (see [01](01-system-classes.md), Query B). The first version
  can route requests to those implementations and explain the results. A persona should wait
  until Sohail has approved a charter (element 6).

## 2. Memory: unknown

- **Exists today:** an approval-gated memory mechanism. An agent *proposes* a memory, a human
  approves or rejects it, and only approved texts are read back
  (`agentMemoryProposalService.ts:32`, `:60`, `:116-120`, `:132`). Separately, OpenClaw keeps
  domain "learnings", but their `applied` flag "is documented elsewhere in this repo as never set
  and never read for gating" (matrix, `marketing.outreach_learning_loop`, `marketing.json:1302`).
- **Missing:** a decision about what the marketing agent should remember. Brand rules? Past
  campaign outcomes? Sohail's preferences? Nothing in the repository says.
- **First honest version:** no memory except what Sohail approves through the existing proposal
  flow. Nothing is learned automatically.

## 3. Inputs: known, missing

- **Exists today:** the domain's data sources. Examples are public-platform signals
  (`openclawMarketSignalAgent.ts`), campaign funnel data read by `DeptCampaignPerformanceAgent`
  (`agentRegistrySeed.ts:1937-1945`), and brand and content records under
  `backend/src/services/content/`. Each capability in the matrix lists its own `inputs`.
- **Missing:** a connection from any of those sources to the agent. With no tools granted, the
  agent can't read anything (`autonomyLadder.ts:208-210`).
- **First honest version:** read-only access to the inputs of the 36 implemented capabilities,
  starting with the ones that are already read-only by contract. Example: funnel analysis is
  "three bounded SELECTs, no writes" (`agentRegistrySeed.ts:1945`).

## 4. Communication: known, missing

- **Exists today:** two channels, both gated.
  - **To Sohail:** an agent reports to a human through `reports_to_type`/`reports_to_id`
    (`models/AiAgent.ts:257-258`). Sohail has a login, but a request as him returned 403 "This
    agent is not in your reporting chain" (`marketing.json:7716`). The matrix records managing the
    agent as `partial` (`marketing.marketing_agent_management_and_oversight`,
    `marketing.json:6278`).
  - **To the public:** every public social post requires a human yes (`agentAutonomy.ts:123`), and
    so does first contact with a new lead (`agentAutonomy.ts:125`). Live network publishing is off
    by configuration (`publishing/providerCapabilities.ts:310-321`).
- **Missing:** `reports_to` pointing at Sohail, and a reporting cadence. The brief subscription is
  `partial`, and no per-manager timezone field exists anywhere in the platform
  (`marketing.manager_marketing_brief_subscription`, `marketing.json:7208`).
- **First honest version:** the agent talks only to Sohail, in the admin surface, once `reports_to`
  is set. It sends nothing outside the platform.

## 5. Tools: known, missing

- **Exists today:** the grant mechanism `tools_granted` (`models/AiAgent.ts:241`), and a list of 39
  tools the matrix declares the capabilities need (`marketing.json:9`). The matrix states these
  names are its own declaration, because "no global allow-list of agent capabilities exists in the
  repository". Eight capabilities are denied by default, including `live_email`
  (`delivery/execution/executionPolicy.ts:33`).
- **Missing:** every grant. The agent has `tools_granted: []` (`agentRegistry/domainAgents.ts:71`).
- **First honest version:** a small set of read-only tools for implemented, non-human-reserved
  capabilities. Each grant is approved by Sohail as a manager decision, as the seed requires
  ("Capability grants are AF7.1 and require a manager", `agentRegistry/domainAgents.ts:78-79`).
  Dara shipped with six tools, not thirty-nine.

## 6. Procedures: unknown

- **Exists today:** the pattern for writing them down. Dara has a role charter, an accountability
  contract, a personality profile, a tool design and a risk register
  (`docs/architecture/ai-workforce-management/employees/curriculum/ROLE_CHARTER_v1.md`,
  `ACCOUNTABILITY_v1.md`, `TOOL_CAPABILITY_DESIGN_v1.md`, `RISK_REGISTER.md`). The only marketing
  directive is `directives/marketing-site.md`, which is about the website, not an agent.
- **Missing:** every one of those documents for marketing. Also undecided is which domain owns 13
  of the 40 legacy rows (`marketing.json:7718`). That changes which procedures the agent would
  even run.
- **First honest version:** a role charter for the marketing employee, modelled on Dara's and
  approved by Sohail, covering only the capabilities he validates. Until it exists, the agent has
  no procedures to follow.

## 7. Coordination: known, missing

- **Exists today:** nothing agent-to-agent. "Agent-to-agent handoff does NOT exist in this platform"
  (`agentDomainStoryTemplates.ts:160`). Two things exist that look similar, and neither is
  coordination:
  - A **super agent** aggregates reports from a group. `ContentEngineSuperAgent` reads the
    `marketing` group, which has one member (`agentRegistrySeed.ts:2151-2159`, `:3360`).
  - **Handoff to a human** exists. Dara's `escalate_to_human` tool hands work to a person through a
    ticket (`agentRegistrySeed.ts:2529`).

  The 15 OpenClaw agents pass work by writing to shared tables, without enforced write permissions
  (`marketing.json:7722`).
- **Missing:** a handoff mechanism, plus authorization for one agent to give work to another
  (ladder rung `R8`, `autonomyLadder.ts:67`). No marketing capability has an `R8` ceiling (see
  [01](01-system-classes.md), Query C).
- **What coordination would require:** a defined handoff record (who, what, with which
  authority), a check that the receiving agent may accept that work, an audit trail, and a
  capability that actually needs it. None of the four exists. **First honest version:**
  `escalate_to_human` only, as Dara does.

## 8. Safeguards: known, partial

- **Exists today:** several layers that apply to any agent.
  - Runtime refuses a disabled agent, an active kill switch or safe mode before doing anything
    (`workforce/workforceAgentRuntime.ts:69-71`).
  - The ladder clamps an agent with no tools to `R2`, and any human-reserved capability to `R5`
    (`autonomyLadder.ts:208-219`).
  - Production needs a separately approved pilot (`autonomyLadder.ts:202-205`).
  - Human-in-the-loop rules cover public posts and new leads (`agentAutonomy.ts:123-125`).
  - Eight capabilities are denied by default (`executionPolicy.ts:33`).
  - Promotion refuses elapsed time, story completion, a good conversation or mocked tests as
    evidence (`agentDomain/promotionCriteria.ts:6-11`).
- **Missing:** write enforcement for marketing agents. `validateAgentWrite`
  (`agentPermissionService.ts:125`) has one real caller (`workforce/workforceAgentRuntime.ts:160`),
  and its tier table lists no OpenClaw or Skool agent (`marketing.json:7722`). The matrix raises
  this as `marketing.agent_write_authorization_enforcement`, state `absent` (`marketing.json:6752`).
- **What the check actually does** (verified 2026-10-28): `validateAgentWrite` reads only the
  agent's tier and, for two tiers, the table (`agentPermissionService.ts:146-168`). It never checks
  `allowedOperations`, and the table it checks is the one the caller declares, not the one
  actually written (`workforceAgentRuntime.ts:160-168`). Only 9 of the 36 agents in the grant map
  reach it. See [05](05-three-proposed-tasks.md), "Write-permission enforcement".
- **First honest version:** run the marketing agent only through `workforceAgentRuntime`, so that
  its writes at least pass `validateAgentWrite`'s tier and declared-table check. Add a check on the
  table actually written and the operation performed, since nothing checks those today. Never let
  it write the way OpenClaw does today.

## 9. Verification: unknown

- **Exists today:** pieces for parts of the domain. Post verification exists, but "only Dev.to and
  Hashnode have an implemented verifier today" (`marketing.outreach_post_verification`,
  `marketing.json:2205`). The promotion module accepts evaluation evidence but "never generates an
  evaluation result" (`promotionCriteria.ts:24-28`).
- **Missing:** what counts as the agent having done a task *correctly*. `R5` means "Evaluate in
  shadow mode against approved reference outcomes" (`autonomyLadder.ts:64`), and no approved
  reference outcome exists for any of the 64 capabilities, all of which are `draft`
  (`marketing.json:7714`).
- **First honest version:** for each capability Sohail validates, a small set of reference outcomes
  he approves. The agent's shadow results are compared against those, and the comparison is
  recorded as evidence. Until then, the honest answer to "did it work?" is "unknown".

---

## What this changes in 01-system-classes.md

[01](01-system-classes.md) listed as unknown whether the 15 OpenClaw agents are tool-using agents or
fixed workflows. **Resolved: fixed workflows with model-generated text.** No file in
`backend/src/services/agents/openclaw/` or `agents/skool/` passes `tools` or `tool_choice` to a model
(Query F). The model calls there are plain completions, for example `openclawAiHelper.ts:16-21`.
This supports 01's recommendation: the domain has no tool-using agent yet, which is the gap a first
marketing employee would fill.

---

## Sources

All paths are under `backend/src/` in the platform repo at `b058da6`, unless they start with `docs/`.

| Claim | Source |
|---|---|
| Marketing domain has no agent | `services/agentDomain/agentDomainRegistry.ts:121` |
| `MarketingDomainAgent`: disabled, no tools, no prompt; grants need a manager | `services/agentRegistry/domainAgents.ts:66-71`, `:78-79`, `:84-91` |
| Agent fields: prompt, tools, persona, reporting line | `models/AiAgent.ts:240-242`, `:257-258` |
| Dara: persona, six tools, `escalate_to_human` | `services/agentRegistrySeed.ts:2502-2531` |
| Dara's charter documents | `docs/architecture/ai-workforce-management/employees/curriculum/` |
| OpenClaw model call is plain text | `services/agents/openclaw/openclawAiHelper.ts:16-21` |
| Approval-gated memory | `services/agentMemoryProposalService.ts:32`, `:60`, `:116-120`, `:132` |
| Funnel analysis is read-only | `services/agentRegistrySeed.ts:1937-1945` |
| No tools ⇒ R2; human decision ⇒ R5 | `services/agentDomain/autonomyLadder.ts:208-219` |
| Pilot needed for production | `services/agentDomain/autonomyLadder.ts:202-205` |
| R5 and R8 definitions | `services/agentDomain/autonomyLadder.ts:64`, `:67` |
| Human yes for public posts and new leads | `services/agentAutonomy.ts:123-125` |
| Publishing off by configuration | `services/publishing/providerCapabilities.ts:310-321` |
| Default-denied capabilities | `services/delivery/execution/executionPolicy.ts:33` |
| Runtime kill switch, safe mode, enabled checks | `services/workforce/workforceAgentRuntime.ts:69-71` |
| `validateAgentWrite` and its one caller | `services/agentPermissionService.ts:125`; `services/workforce/workforceAgentRuntime.ts:160` |
| The check reads tier and declared table only; it never reads operations | `services/agentPermissionService.ts:146-168`; `services/workforce/workforceAgentRuntime.ts:160-168` |
| Promotion refuses time, completion, conversation, mocks | `services/agentDomain/promotionCriteria.ts:6-11`, `:24-28` |
| No agent-to-agent handoff | `services/agentDomain/agentDomainStoryTemplates.ts:160` |
| Super agent over the marketing group | `services/agentRegistrySeed.ts:2151-2159`, `:3360` |
| 39 declared tools; none validated; 403; boundary; write gap | `marketing.json:9`, `:7714`, `:7716`, `:7718`, `:7722` |
| Capability records cited above | `marketing.json:1302`, `:2205`, `:6278`, `:6752`, `:7208` |

### Queries

```sh
# F: any function-calling in OpenClaw or Skool? -> no output
cd backend/src/services && grep -ln "tool_choice\|tools: \[" agents/openclaw/*.ts agents/skool/*.ts
```
