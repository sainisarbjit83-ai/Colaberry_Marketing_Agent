# Five system classes, and where Marketing Intelligence & Brand sits

**Story:** `marketing.RESEARCH-1-SYSTEM-CLASSES` · **Release:** Discovery and validation
**Accountable human:** Sohail Syed · **Author:** Sarbjit Kaur, with Claude Code · **Date:** 2026-10-23
**Status:** draft for Sohail's review. Nothing in this document enables an agent, grants a tool or raises an autonomy level.

> **Source convention.** Every platform citation is a path in the public platform repo
> [`ColaberryIntern/ColaberryEnterprise_AI_LeadershipAccelerator`](https://github.com/ColaberryIntern/ColaberryEnterprise_AI_LeadershipAccelerator),
> read at commit `b058da6`, written as `file:line`. "The matrix" means
> `backend/src/services/agentDomain/capabilities/marketing.json`, the capability research this
> domain's brief is generated from. Counts that are not a single line in a file come with the
> query that produced them (see [Queries](#queries)). Anything with no source is marked **unknown**.

---

## The answer in one paragraph

Marketing needs **one tool-using agent that works inside the deterministic workflows the platform
already runs**. It does not need an agentic system yet, and it does not need a multi-agent system
at all. The numbers behind that: of 64 candidate capabilities, **28 are reserved to a human at
every level**. The platform clamps those 28 at `R5` (shadow evaluation), so they can never be
automated. All 64 start at `R0` and all 64 are still `draft`. And **zero** capabilities need
agent-to-agent handoff, the one thing a multi-agent system adds.

---

## The five classes, as this platform would see them

The platform's own R0–R9 autonomy ladder (`autonomyLadder.ts:59-68`) gives a concrete way to tell
the classes apart, so each class below is tied to the rung where it starts.

### 1. Chatbot

It answers questions from approved knowledge and takes no action in any system. On the ladder,
that is `R2`: "Answer questions using approved knowledge and records" (`autonomyLadder.ts:61`).
The platform clamps any agent with no tool grants to `R2`, whatever its approval says
(`autonomyLadder.ts:208-210`).

### 2. Fixed workflow

A deterministic sequence that runs the same steps every time, either on a schedule or on an event.
No model decides what happens next. Most of this platform is this class. Example: the publishing
worker takes due rows off a queue and hands each to a provider adapter
(`agentRegistrySeed.ts:3089-3102`). Another: the funnel analysis is "three bounded SELECTs, no
writes, nothing sent" (`agentRegistrySeed.ts:1937-1945`).

### 3. Tool-using agent

A model that chooses which granted tool to call in order to finish a task a person started, and
whose results are checked. On the ladder this is `R3`–`R4`: "approved, user-initiated sandbox tool
operations", then "stateful, multi-step sandbox tasks" (`autonomyLadder.ts:62-63`). The agent's
scope is exactly its `tools_granted`.

### 4. Agentic system

The agent sets its own sub-goals and acts without a person starting each run, within limits that
were authorized in advance. On the ladder this is `R7`: "Automate only explicitly authorized action
classes within limits" (`autonomyLadder.ts:66`). Production needs a separately approved pilot
first (`R6`, `autonomyLadder.ts:202-205`).

### 5. Multi-agent system

Several agents divide one job and pass work between each other. On the ladder this is `R8`:
"Coordinate necessary, authorized handoffs with other agents" (`autonomyLadder.ts:67`).
**Agent-to-agent handoff does not exist in this platform** (`agentDomainStoryTemplates.ts:160`).
The closest thing is a "super agent" that aggregates other agents' reports. For example,
`ContentEngineSuperAgent` reads the `marketing` group (`agentRegistrySeed.ts:2151-2159`,
`agentRegistrySeed.ts:3360`). That is supervision of reports, not a handoff of work.

---

## What Marketing has today

| Fact | Figure | Source |
|---|---|---|
| Candidate capabilities | 64 | matrix `marketing.json:8` |
| Inherited legacy agent records | 40 | matrix `marketing.json:7` |
| Distinct tools the capabilities require | 39 | matrix `marketing.json:9` |
| Capabilities reserved to a human at every level (`human_decision: true`) | **28 of 64** | Query A |
| Capabilities still `draft` (none validated) | 64 of 64 | Query B, `marketing.json:7714` |
| Capabilities whose starting autonomy is `R0` | 64 of 64 | Query B |
| Implementation state | 36 implemented · 20 partial · 7 absent · 1 unknown | Query B |
| Legacy records that are OpenClaw outreach agents | 15 of 40 | Query D |
| Marketing AI employee linked to the domain | **none** (`agent_id: null`) | `agentDomainRegistry.ts:121` |
| `MarketingDomainAgent` registry row | exists, **disabled, no tools** | `agentRegistry/domainAgents.ts:66-71`, `:84` |

The last two rows are easy to misread together. A `MarketingDomainAgent` row is seeded so the
domain has "an inspectable agent to build on", but it is disabled and has an empty
`tools_granted`. The domain registry does not link it (`agent_id: null`). With no tools, the
platform clamps it to `R2` (`autonomyLadder.ts:208-210`). **So today the domain's own agent is at
most a chatbot, and it is switched off.**

### How far each capability is allowed to climb

These are ceilings, not current levels. The `human_decision` split decides most of the argument.

| Ceiling (`max_permitted_autonomy`) | Human-reserved (28) | Not human-reserved (36) |
|---|---|---|
| `R2` chatbot | 6 | 1 |
| `R3` tool-using | 2 | 0 |
| `R4` tool-using, multi-step | 12 | 0 |
| `R5` shadow evaluation | 8 | 0 |
| `R6` supervised pilot | 0 | 4 |
| `R7` agentic, within limits | 0 | 22 |
| `R8` multi-agent handoff | 0 | 0 |
| `R9` reliable ownership | 0 | 9 |

Source: Query C. The 28 human-reserved capabilities stop at `R5` because the platform enforces
it. A human-required decision "stays human-required at EVERY level" and is capped at `R5`
(`autonomyLadder.ts:214-219`).

---

## Recommendation: a tool-using agent, inside fixed workflows

**Class: tool-using agent (R3–R4), run in the sandbox and evaluated in shadow (R5). Fixed
workflows stay the execution layer, and every outbound step keeps its human gate.**

The reasons, each tied to this domain's figures:

1. **A chatbot is too little.** Only 7 of 64 capabilities have a chatbot ceiling (`R2`). The other
   57 act on systems: they draft, score, queue, compose or report. They need 39 distinct tools
   (`marketing.json:9`). An `R2` agent can serve the 7 and none of the rest.
2. **An agentic system is too much for now. The binding number is 28.** Those 28 human-reserved
   capabilities are held at `R5` or below by code (`autonomyLadder.ts:214-219`), so agentic
   autonomy is unreachable for 44% of the domain. Each of these is an independent gate:
   - The platform's own rules require a human yes for every public social post
     (`agentAutonomy.ts:123`) and for first contact with a new lead (`agentAutonomy.ts:125`). Those
     are the actions that make marketing *marketing*.
   - All 64 capabilities are `draft`, with "no path to 'confirmed' in this exercise"
     (`marketing.json:7714`). An agentic system needs authorized action classes, and none are
     authorized.
   - Live publishing is switched off by configuration: `LIVE_CONNECTORS` is empty by default
     (`publishing/providerCapabilities.ts:310-321`), and the publishing worker ships disabled
     (`agentRegistrySeed.ts:3102`). Even an agentic design would hand every post to a person today.
3. **A tool-using agent is the class that fits the 36 that are not human-reserved.** 36 of 64 are
   already implemented in code (Query B). The work is giving one agent scoped tools over those
   implementations and evaluating it, not inventing new behaviour. The ladder's next honest steps
   for them are `R3`→`R5`, and `R6`/`R7` only after a separately approved pilot
   (`autonomyLadder.ts:202-205`).

If 28 were close to 0 and the 64 were validated, the argument would change: the 22
capabilities with an `R7` ceiling would make an agentic system the right target. The
recommendation depends on those two numbers.

---

## What this domain explicitly does NOT need

**A multi-agent system.** Not now, and not as the next step after a tool-using agent:

- **No capability's ceiling is `R8`**, the handoff rung (Query C). The 9 capabilities that reach
  `R9` are internal controls (rate limits, circuit breakers, compliance scans, read-only
  reporting). None of their stated rationales mentions a handoff to another agent (Query E).
- **Only 1 of 64 capabilities depends on another agent at all:**
  `marketing.community_signal_detection` relies on `skoolSupervisorAgent` for stuck-task recovery
  (Query E). That is a recovery dependency, not shared work.
- **The platform has no handoff mechanism to build on** (`agentDomainStoryTemplates.ts:160`). Today
  the 15 OpenClaw outreach agents coordinate by writing to shared tables, and no code checks those
  writes against the platform's grant map. Its write check, `validateAgentWrite`, has one non-test
  caller, the AI Workforce director runtime, which no OpenClaw or Skool agent uses
  (`agentPermissionService.ts:125`; `workforceAgentRuntime.ts:160`; `marketing.json:7722`). Adding
  more agents that pass work between them would multiply that gap.

---

## What would have to change before the next class up is justified

The next class up is the **agentic system (`R7`)**. It becomes justified for a capability only
when **all** of these are true. Each is a checkable condition, not "more maturity":

1. **Sohail has moved the capability out of `draft`.** Today 0 of 64 are validated
   (`marketing.json:7714`). Check: the capability's `requirement_validation_state` is no longer
   `draft`.
2. **It is not human-reserved.** Only the 36 qualify. The 28 never will, by design
   (`autonomyLadder.ts:214-219`). Check: `human_decision: false`.
3. **It passed `R5` shadow evaluation against approved reference outcomes, then an `R6` pilot that
   was approved separately** (`autonomyLadder.ts:64-65`, `:202-205`). Check: the recorded pilot
   approval and its evaluation results.
4. **Write permissions are actually enforced for the agent doing it.** Today the grant map is
   checked on one path only, for 9 of its 36 agents, and there only by tier and a caller-declared
   table. Its `allowedOperations` lists are enforced nowhere (`agentPermissionService.ts:125-169`;
   `workforceAgentRuntime.ts:160-168`). Check: the agent's real write path calls a check that
   inspects the table actually written and the operation performed, and a test proves a
   disallowed write is refused.
5. **Sohail can manage the agent.** He has a login, but a request as him returned 403 "This agent
   is not in your reporting chain" until `reports_to` points at him (`marketing.json:7716`). Check:
   the marketing agent's `reports_to` resolves to Sohail.

For the class above that (**multi-agent, `R8`**), add a sixth condition: **the platform has a real,
authorized agent-to-agent handoff, and at least one validated capability needs it.** Today neither
is true (`agentDomainStoryTemplates.ts:160`; Query C shows 0 capabilities with an `R8` ceiling).

---

## Unknowns and gaps

- **Live autonomy levels of the existing marketing agents: unknown.** The repository has no
  database access. The matrix itself declines to assert the production `autonomy_level` of
  `DeptCampaignPerformanceAgent` (`marketing.json:7719`). What would close it: a read-only query
  of `ai_agents.autonomy_level` for the agents in `AGENT_GROUP_MAP.marketing`.
- ~~Whether each legacy OpenClaw agent calls an LLM with tools or runs as a fixed workflow.~~
  **Resolved in [02-agent-anatomy.md](02-agent-anatomy.md):** they are fixed workflows with
  model-generated text. No OpenClaw or Skool file passes `tools` or `tool_choice` to a model
  (02, Query F).
- **Domain boundary is unresolved.** 13 of the 40 legacy rows reached this domain by a name match
  rather than a product decision, and the ten `Intel_*` rows produce learner-facing content
  (`marketing.json:7718`). If they leave the domain, the 40 and the 64 both change. The
  recommendation does not, because none of those rows needs handoff. This needs a decision from
  Sohail and the executive owner.
- **The story page's brief was not visible to me.** I rebuilt its figures (64 capabilities, 40
  legacy records, 28 human-reserved) from the same matrix the brief template reads
  (`agentDomainStoryTemplates.ts:139-146`). If the page shows different numbers, the page wins and
  this document needs updating.
- **Line drift.** The matrix's own notes cite some older line numbers. For example, it puts
  `DeptCampaignPerformanceAgent` at `agentRegistrySeed.ts:1935`, and it is at `:1937` on
  `b058da6`. Citations here are what I measured at `b058da6`.

---

## Sources

All paths are in the platform repo at commit `b058da6`.

| Claim | Source |
|---|---|
| R0–R9 ladder definitions | `backend/src/services/agentDomain/autonomyLadder.ts:59-68` |
| Production needs separate pilot approval | `backend/src/services/agentDomain/autonomyLadder.ts:202-205` |
| No tools ⇒ clamped to R2 | `backend/src/services/agentDomain/autonomyLadder.ts:208-210` |
| Human decision ⇒ capped at R5, never automated | `backend/src/services/agentDomain/autonomyLadder.ts:214-219` |
| Public social post needs a human yes | `backend/src/services/agentAutonomy.ts:123` |
| First touch with a new lead needs a human yes | `backend/src/services/agentAutonomy.ts:125` |
| No agent-to-agent handoff in the platform | `backend/src/services/agentDomain/agentDomainStoryTemplates.ts:160` |
| Brief figures come from the matrix | `backend/src/services/agentDomain/agentDomainStoryTemplates.ts:139-146` |
| Marketing domain: Sohail, `agent_id: null` | `backend/src/services/agentDomain/agentDomainRegistry.ts:113-125` |
| `MarketingDomainAgent`: disabled, no tools | `backend/src/services/agentRegistry/domainAgents.ts:66-71`, `:84-91` |
| Publishing worker seeded disabled | `backend/src/services/agentRegistrySeed.ts:3089-3102` |
| Funnel analysis is read-only | `backend/src/services/agentRegistrySeed.ts:1937-1945` |
| Super agent over the marketing group | `backend/src/services/agentRegistrySeed.ts:2151-2159`, `:3360` |
| `LIVE_CONNECTORS` empty by default | `backend/src/services/publishing/providerCapabilities.ts:310-321` |
| 40 legacy rows / 64 capabilities / 39 tools | `backend/src/services/agentDomain/capabilities/marketing.json:7-9` |
| No capability validated | `marketing.json:7714` |
| Sohail's 403 before `reports_to` | `marketing.json:7716` |
| Unresolved domain boundary (13 rows) | `marketing.json:7718` |
| Write-permission enforcement gap | `marketing.json:7722` |
| Write check reads tier and table only; one non-test caller (9 of 36 grant-map agents) | `backend/src/services/agentPermissionService.ts:125-169`; `backend/src/services/workforce/workforceAgentRuntime.ts:160-168`; `backend/src/services/workforce/directorActions.ts:48`, `:96`, `:131` |

### Queries

Run from `backend/src/services/agentDomain/capabilities/` in the platform repo:

```sh
# A: human-reserved count -> 28
node -e 'const m=require("./marketing.json");console.log(m.capabilities.filter(c=>c.human_decision).length)'

# B: validation, starting autonomy, implementation state
node -e 'const C=require("./marketing.json").capabilities;for(const k of ["requirement_validation_state","starting_autonomy","implementation_state"]){const o={};for(const c of C)o[c[k]]=(o[c[k]]||0)+1;console.log(k,o)}'

# C: ceiling by human_decision
node -e 'const o={};for(const c of require("./marketing.json").capabilities){const k=c.max_permitted_autonomy+" human="+c.human_decision;o[k]=(o[k]||0)+1}console.log(o)'

# D: OpenClaw rows among legacy dispositions -> 15
node -e 'console.log(require("./marketing.json").legacy_dispositions.filter(r=>/^Openclaw/.test(r.agent_name)).length)'

# E: handoff in R9 rationales (-> 0); dependencies mentioning "agent" (-> 3 lines, 1 real:
#    skoolSupervisorAgent. The other two are a review surface and a capability id, not agents)
node -e 'const C=require("./marketing.json").capabilities;console.log(C.filter(c=>c.max_permitted_autonomy==="autonomy:R9"&&/handoff|other agent|R8/i.test(c.max_autonomy_rationale)).length);for(const c of C)for(const d of c.dependencies||[])if(/agent/i.test(d))console.log(c.capability_id,"->",d)'
```
