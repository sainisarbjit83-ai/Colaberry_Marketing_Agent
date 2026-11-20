# 13-component implementation matrix

All 13 core agent components, using the component names requested by the project manager, applied
to Social Signal Discovery. Status labels are defined in the [README](README.md#status-labels).
**No component listed as Proposed, Requires investigation or Pending approval has been built.**

## Summary

| # | Component | Status | One-line basis |
|---|---|---|---|
| 1 | User Interface (UI) | Existing and verified (Command Center, read-only); Requires investigation (platform Outreach pages) | `marketing.STORY-000` verified; admin pages untested by us |
| 2 | System Prompt | Proposed | No system prompt or charter exists for this agent |
| 3 | Context Manager | Proposed | Nothing exists |
| 4 | LLM (Brain) | Pending approval | A hosted model call counts as outbound, which R2 forbids |
| 5 | Agent Loop (Orchestrator) | Existing (platform `runAgent` wrapper, scanner path); Proposed (R2 read-only path) | Audit, questions 2 and 11 |
| 6 | Tools | Pending approval | 0 granted; 4 named by the capability record |
| 7 | Knowledge Base / RAG | Existing (`openclaw_signals` table); Proposed (retrieval) | Audit, questions 3 and 7; November 9 data review |
| 8 | Memory | Requires investigation | Nobody has decided what the agent should remember |
| 9 | Planning / Task Decomposition | Proposed (fixed workflow) | System-classes recommendation |
| 10 | Guardrails | Existing (platform rules, partly enforced); Proposed (R2 guardrails) | Approval-boundaries doc; discovery 05 |
| 11 | Human-in-the-Loop (HITL) | Existing (governance decisions); Proposed (per-run approval) | L3 and L4 stories |
| 12 | Logging & Observability | Existing (activity log on the scheduled path only); Proposed (run trace) | Audit, question 11 |
| 13 | Evaluation | Proposed | No evaluation exists for this capability |

**Coverage:** all 13 components are planned below (the manager asked for at least 75%, which is 10).
Planned is not implemented: of the 13, only parts of components 1, 5, 7, 10, 11 and 12 exist today.

## Mapping to the nine-element agent anatomy

The anatomy in [../../discovery/02-agent-anatomy.md](../../discovery/02-agent-anatomy.md) uses
nine elements. This table maps the 13 components onto them; the anatomy document holds the
evidence and is not repeated here.

| Component | Anatomy element(s) | Anatomy status (October 23, 2026) |
|---|---|---|
| 1 User Interface | 4 Communication | known, missing |
| 2 System Prompt | 1 Reasoning, 6 Procedures | unknown |
| 3 Context Manager | 3 Inputs | known, missing |
| 4 LLM (Brain) | 1 Reasoning | unknown |
| 5 Agent Loop (Orchestrator) | 6 Procedures, 7 Coordination | unknown; known, missing |
| 6 Tools | 5 Tools | known, missing |
| 7 Knowledge Base / RAG | 3 Inputs | known, missing |
| 8 Memory | 2 Memory | unknown |
| 9 Planning / Task Decomposition | 6 Procedures | unknown |
| 10 Guardrails | 8 Safeguards | known, partial |
| 11 Human-in-the-Loop (HITL) | 4 Communication, 8 Safeguards | known, missing; known, partial |
| 12 Logging & Observability | 9 Verification (partly) | unknown |
| 13 Evaluation | 9 Verification | unknown |

Components 3, 7 and 12 have no anatomy element of their own; they are folded into the nearest
element above.

---

## 1. User Interface (UI)

| Field | Detail |
|---|---|
| Purpose | Where a person asks a question, reads the answer and its citations, and approves or rejects a run |
| Applies to Social Signal Discovery | A marketing user asks "where are buyers talking about this?" and sees platforms, counts and the cited posts |
| Proposed approach | Add a read-only question panel for this capability; location to be decided (Command Center or the platform's Outreach admin pages). Show every citation as a row id with its link |
| Inputs and outputs | In: a question, optional platform and date filters. Out: an answer with cited row ids; an approval control |
| Technology options | Extend the static Command Center (`index.html`, `assets/`), or use the platform admin UI (`/admin/intelligence`, Outreach tab) |
| Dependencies | Knowledge Base / RAG (7), HITL (11), Logging (12) |
| Security and approval | Read-only; no posting or outreach controls; the approval control records who approved |
| Testing and evaluation | Rendered-page tests in the style of `tests/command-center/`; L2 checks the platform pages by hand |
| Status | **Existing and verified:** the Command Center (read-only, `marketing.STORY-000` verified). **Requires investigation:** the platform's Outreach pages (L2). **Proposed:** the question panel |

## 2. System Prompt

| Field | Detail |
|---|---|
| Purpose | The standing instructions that define the agent's job, limits and output format |
| Applies to Social Signal Discovery | States the R2 rules: answer only from stored signals, cite every statement, never scan, never contact anyone, decline when nothing matches |
| Proposed approach | Write it after L1 and L2, from the run log's judgment calls. Version it, and review changes with Sohail |
| Inputs and outputs | In: the charter, guardrail rules, Sohail's buyer-signal criteria (PENDING). Out: a versioned prompt text |
| Technology options | A versioned text file or a platform agent field (`system_prompt` on the agent record, currently empty per the anatomy document) |
| Dependencies | LLM (4) only if an LLM is approved; Evaluation (13) for revisions |
| Security and approval | Sohail approves the content; changes go through review, never edited by the agent |
| Testing and evaluation | Fixed test questions with expected behavior, including refusals |
| Status | **Proposed.** None exists. Only needed in full if an LLM is approved; a deterministic first version needs the same rules as configuration |

## 3. Context Manager

| Field | Detail |
|---|---|
| Purpose | Assembles exactly what the agent needs for one request, and nothing more |
| Applies to Social Signal Discovery | Combines the question, filters, system-prompt rules, guardrail limits and the retrieved rows; keeps out data that should not be there (for example non-buyer rows) |
| Proposed approach | A fixed, deterministic assembly step with a bounded number of rows |
| Inputs and outputs | In: question, filters, rules, retrieved rows. Out: a bounded, structured context for composing the answer |
| Technology options | A plain function in the orchestrator; no external service |
| Dependencies | System Prompt (2), Knowledge Base / RAG (7), Guardrails (10) |
| Security and approval | No secrets or credentials in context; a hard cap on size |
| Testing and evaluation | Unit tests: same inputs produce the same context; the row cap is respected |
| Status | **Proposed.** Nothing exists |

## 4. LLM (Brain)

| Field | Detail |
|---|---|
| Purpose | The model that reasons over the context and writes the answer |
| Applies to Social Signal Discovery | Could phrase the "where" answer from retrieved rows |
| Proposed approach | **First version without an LLM:** compose the answer with a fixed template (counts by platform plus the cited rows). Add an LLM only if Sohail agrees how it squares with "zero outbound network calls" |
| Inputs and outputs | In: the bounded context. Out: a draft answer with citations |
| Technology options | None chosen. Options to evaluate if approved: a hosted model (outbound) or a locally hosted model (no outbound). Changing AI model class is an escalation item under `CLAUDE.md` |
| Dependencies | System Prompt (2), Context Manager (3), Guardrails (10) |
| Security and approval | **Pending approval** by Sohail (the audit's open question: "whether R2 may use a hosted model") |
| Testing and evaluation | If added: every statement must still cite a row id; outbound-call count checked in the trace |
| Status | **Pending approval** |

## 5. Agent Loop (Orchestrator)

| Field | Detail |
|---|---|
| Purpose | Runs the steps of a request in order and decides what happens next |
| Applies to Social Signal Discovery | Runs retrieve, check, compose, submit for approval, log |
| Proposed approach | A fixed workflow, per the system-classes recommendation. A separate read-only R2 path that does not extend the scanner and does not reuse the admin routes (audit, "Proposed R2 architecture") |
| Inputs and outputs | In: a request. Out: a result awaiting approval, plus a run record |
| Technology options | The platform's `runAgent` wrapper (exists; writes run bookkeeping) or a standalone read-only module |
| Dependencies | Planning (9), Tools (6), Guardrails (10), HITL (11), Logging (12) |
| Security and approval | Read-only by structure: imports no network client and no scanner. Whether run bookkeeping rows may be written is a decision for Sohail |
| Testing and evaluation | A static import check plus the R2 test assertions ([04-l1-l2-validation-plan.md](04-l1-l2-validation-plan.md)) |
| Status | **Existing:** the `runAgent` wrapper (serves the scanner; audit, question 11). **Proposed:** the R2 read-only path |

## 6. Tools

| Field | Detail |
|---|---|
| Purpose | The specific, granted actions the agent may take |
| Applies to Social Signal Discovery | The capability record names four: `platform_public_api_read_allowlisted`, `read_marketing_database`, `sandbox_database_write`, `agent_activity_log_write`. The read-only R2 path would need only `read_marketing_database` (and possibly `agent_activity_log_write`) |
| Proposed approach | Request the smallest set at L3, with scope, what each must never touch, and who approves a run, as the L3 story requires |
| Inputs and outputs | Depends on the tool; for R2, a bounded read of stored signal rows |
| Technology options | Platform tool grants, through the Change Requests page (`POST /api/admin/agent-domain-change-requests`, per the L3 story) |
| Dependencies | L1 and L2 evidence (the L3 request must cite them) |
| Security and approval | A filed request grants nothing; a named human other than the builder decides. `no_tool_grants` holds anything above R2 back to R2 while no tool is granted |
| Testing and evaluation | Each tool's typed input and output tested, including bad input and repeat runs |
| Status | **Pending approval.** 0 granted, 0 requested |

## 7. Knowledge Base / RAG

| Field | Detail |
|---|---|
| Purpose | Where the agent's answers come from: retrieved, citable records |
| Applies to Social Signal Discovery | The stored `openclaw_signals` rows. "RAG" here means retrieval over those rows; no external documents |
| Proposed approach | Deterministic retrieval: filter to rows the scanner wrote (exclude Colaberry's own posts and tracking rows), match on stored fields, rank in a fixed order, cap the result. No embeddings in the first version |
| Inputs and outputs | In: question terms and filters. Out: matching rows with their ids |
| Technology options | A query over the existing table; Postgres full-text search later would need an index, which is a schema change and a separate decision |
| Dependencies | Tools (6) for read access; Guardrails (10) |
| Security and approval | Read only; never inserts, updates or deletes |
| Testing and evaluation | Seeded test rows; every citation must exist; same question returns the same rows |
| Status | **Existing:** the table and model (audit). **Proposed:** the retrieval layer. **Requires investigation:** which rows are buyer signals in production data, and how a "buyer" is defined (Sohail, PENDING) |

## 8. Memory

| Field | Detail |
|---|---|
| Purpose | What the agent keeps between runs |
| Applies to Social Signal Discovery | Possibly approved keyword lists, past questions, or reviewer feedback |
| Proposed approach | None in the first version. Decide after L1 and L2 what, if anything, is worth remembering |
| Inputs and outputs | To be decided |
| Technology options | The platform's agent memory proposals (an approval-gated mechanism exists in the platform, per the anatomy document) |
| Dependencies | HITL (11) to approve anything remembered |
| Security and approval | Nothing remembered without human approval |
| Testing and evaluation | To be designed once a memory scope exists |
| Status | **Requires investigation** |

## 9. Planning / Task Decomposition

| Field | Detail |
|---|---|
| Purpose | Breaks a request into steps |
| Applies to Social Signal Discovery | The steps are known in advance: retrieve, check, compose, approve, log |
| Proposed approach | A fixed workflow, not model-generated plans, per [../../discovery/01-system-classes.md](../../discovery/01-system-classes.md) |
| Inputs and outputs | In: a request type. Out: the fixed step list |
| Technology options | Configuration in the orchestrator |
| Dependencies | Agent Loop (5) |
| Security and approval | Changes to the workflow are reviewed by Sohail |
| Testing and evaluation | Each step's order and output tested |
| Status | **Proposed** |

## 10. Guardrails

| Field | Detail |
|---|---|
| Purpose | Rules enforced during a run, not just at the end |
| Applies to Social Signal Discovery | No outbound calls; no scanning; no writes to `openclaw_signals`; no excluded platforms; every statement cited; bounded results; no contact with anyone |
| Proposed approach | Enforce at each stage: context assembly, orchestrator steps, tool calls, retrieval and result. Read-only by structure (no network client imported), because write-permission tiers are not enforced for these agents |
| Inputs and outputs | In: each step's action or output. Out: allow, block, with the rule that blocked it |
| Technology options | Checks inside the orchestrator; a network interceptor in tests |
| Dependencies | All components |
| Security and approval | Guardrail rules are set by humans; the agent cannot relax them |
| Testing and evaluation | The R2 assertions (zero outbound, zero writes, unchanged checksum) |
| Status | **Existing:** platform rules: the ladder, `effectiveAuthority()`, `no_tool_grants`, human-decision caps ([human-approval-boundaries.md](../../capabilities-map/human-approval-boundaries.md)). **Existing, not enforced:** write-permission tiers ([../../discovery/05-three-proposed-tasks.md](../../discovery/05-three-proposed-tasks.md), "Write-permission enforcement"). **Proposed:** the R2 guardrails above |

## 11. Human-in-the-Loop (HITL)

| Field | Detail |
|---|---|
| Purpose | People decide what the agent may do and approve what it produces |
| Applies to Social Signal Discovery | Sohail validates the capability; a named human decides the L3 tool request; a named human approves every L4 run |
| Proposed approach | An approval step before any result takes effect, recording who approved and when |
| Inputs and outputs | In: a proposed result. Out: approved, changes requested, or declined, with the approver |
| Technology options | The platform's change-request and approval mechanisms |
| Dependencies | UI (1), Logging (12) |
| Security and approval | The builder never approves their own request (L3 criterion 3) |
| Testing and evaluation | Every run in an evidence window has a named approver (L4 criterion 3) |
| Status | **Existing:** governance decisions by named humans. **Proposed:** per-run approval for this agent |

## 12. Logging & Observability

| Field | Detail |
|---|---|
| Purpose | A record of what happened in every run |
| Applies to Social Signal Discovery | The run trace that proves "zero outbound network calls in the trace" (R2 and L4 criterion 1) |
| Proposed approach | Record inputs, rows read, citations, guardrail results, approver, duration and the outbound-attempt count, in structured form, per `CLAUDE.md`'s observability rules |
| Inputs and outputs | In: events from every step. Out: one structured record per run |
| Technology options | The platform's `ai_agent_activity_logs` (written by `runAgent` on scheduled runs) or a dedicated run record |
| Dependencies | Agent Loop (5) |
| Security and approval | No secrets or personal data beyond what the run needs |
| Testing and evaluation | A test run must produce a complete record with zero outbound attempts |
| Status | **Existing:** activity logging on the scheduled path only; the manual scan path writes none (audit, question 11). **Proposed:** the run trace |

## 13. Evaluation

| Field | Detail |
|---|---|
| Purpose | Shows whether the agent does the job correctly, and feeds improvements back |
| Applies to Social Signal Discovery | Compares agent runs with the L1 run log, and checks the R2 assertions |
| Proposed approach | The R2 test design from the audit (seeded sandbox rows, network blocked, write spies, checksum, empty case, repeatability), plus comparison with the L1 reference outcome |
| Inputs and outputs | In: run records and the L1 run log. Out: pass or fail per assertion, and findings for the prompt, workflow and guardrails |
| Technology options | The platform's per-suite throwaway Postgres integration tier (`*.integration.test.ts`); a network-blocking mechanism would need adding |
| Dependencies | Logging (12), the L1 run log |
| Security and approval | Evaluation results inform humans; they never raise autonomy (`NON_PROMOTING_SIGNALS`) |
| Testing and evaluation | This component is the testing |
| Status | **Proposed.** No evaluation exists for this capability |
