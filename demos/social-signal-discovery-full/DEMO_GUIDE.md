# Demonstration Guide — Social Signal Discovery Hybrid Demo

For the internal review with Ali. About 10–12 minutes. Every screen is a **local demo with
fictional records**; nothing searches a live platform, calls a real LLM, or sends anything.

**Before you start:** stop any running copy, delete `tmp/ssd-full/` for a clean state, then run
`node demos/social-signal-discovery-full/server/server.js` and open http://127.0.0.1:4310.

Each section separates **Working in the demo** (built, local, tested) from **Proposed for
production** (not built, not authorized).

---

## 1. The business problem
*Screen: Overview*

Public communities contain occasional signs that an organization may want AI training or
services. Finding them manually is slow, and a casual comment is easily mistaken for a lead. The
goal is an agent that surfaces candidates **with evidence**, keeps a person in charge of every
decision, and measures itself honestly.

- **Working in the demo:** the full workflow on 20 fictional records; the banner states this on
  every screen.
- **Proposed for production:** real, approved sources and Sohail's buyer criteria (neither exists
  in the demo).

## 2. How a research request enters the system
*Screen: Research → question "Which teams want AI training?", keywords `ai, training` → Run research*

The Context Manager validates the request: question length, keywords, platforms (only the eight
approved ones), dates and result limit. The run records which system prompt version it used, and
says plainly that the simulated provider does not interpret it.

- **Working:** validation, scope refusal ("Try an out-of-scope platform" shows LinkedIn comments
  being refused), stored system prompt with version and fingerprint.
- **Proposed:** a real LLM that actually reads the prompt; requires an AI-model decision.

## 3. How the agent plans and executes tasks
*Screen: Research → "Agent plan"; then Execution trace & logs*

The planner breaks the request into eleven subtasks; the agent loop runs them in order and marks
each completed, failed or skipped. A guardrail block or a critical failure stops the run safely.
Every step, tool call and decision is logged.

- **Working:** visible plan, task states, stop conditions, full execution log per run.
- **Proposed:** plans generated per request (today the plan is a fixed template); concurrent runs.

## 4. How results and evidence are presented
*Screen: Research → result cards*

Each card shows the record with the supporting words highlighted, the preliminary
classification, the rule strength and the step-by-step reasoning. Duplicates removed are listed
with their reason. The report cites every record id.

- **Working:** evidence that is checked to really exist in the record; nothing is called a
  verified lead.
- **Proposed:** semantic retrieval (embeddings) and model-based reasoning instead of word rules.

## 5. How human review works
*Screen: Research → on the cards: approve S-005, reject S-002, correct S-001 to "General AI interest"*

Every result waits for a person. A correction needs a different label, every decision needs a
note, and a decision cannot be silently changed later. Show the message when a note is missing.
Point out "No external action was taken".

- **Working:** approve / reject / correct, stored permanently as an audit history.
- **Proposed:** reviewer sign-in and roles; any action after approval would need separate
  authorization (none exists).

## 6. How memory recalls earlier decisions
*Screen: Research → "Follow-up: leadership training demand", keywords `training, leadership, ai`*

The second run lists the earlier run it recalled. On S-001, the earlier correction appears in a
separate blue "recalled from memory" box, while the new classification stays as the rules produced
it. Then on **Memory & review history**, clear memory: the review audit history remains.

- **Working:** cross-run memory of runs, processed records and review decisions; clear vs. audit
  history.
- **Proposed:** using approved feedback to improve classification (deliberately not done: the
  demo shows memory, it does not silently apply it).

## 7. How evaluation measures correctness and quality
*Screen: Evaluation → Run evaluation (twice)*

Two separate panels:
1. **Software correctness**: 11 checks that the workflow behaves as designed (all pass).
2. **Classification quality**: against a **fictional, illustrative benchmark, not approved by
   Sohail**: 75% accuracy (18 of 24); all 17 clear records right, 1 of 7 hard ones. The mistakes
   table shows why: negation, "business model", "rag rug", and buying intent in unusual words.

Running it again gives the identical results fingerprint.

- **Working:** metrics with definitions, confusion matrix, clear/hard split, stored and repeatable.
- **Proposed:** a real benchmark labelled against Sohail's criteria by several reviewers.

## 8. How the 13 components work together
*Screen: Overview → component table; Guardrails*

UI → Context Manager → Planner → Agent Loop, which calls Memory, Tools, Knowledge Base and the
(simulated) LLM, with Guardrails checking every step, results going to Human-in-the-Loop, Logging
recording everything, and Evaluation measuring the whole. On **Guardrails**, try "send_message"
(blocked with its reason) and "Prove outbound network calls are blocked" (four network functions,
all refused, tested against the computer's own address only).

Statuses are stated plainly: the LLM is **Simulated**; Knowledge Base, Planning and Guardrails are
**Partly implemented**; the other nine are implemented in the demo.

## 9. What would be required before any real-world implementation

None of the following is built or authorized:
1. Sohail Syed's approved buyer-signal criteria and a properly labelled benchmark.
2. A decision on a real LLM (an escalation), including its network and cost implications.
3. Approved, compliant data sources per platform; privacy and legal review.
4. A governed production data design, including any use of `openclaw_signals`.
5. Production security (network egress controls, authentication), hosting and monitoring.
6. Permission and autonomy changes through platform governance. The agent is disabled at the
   lowest autonomy level today; this demo changes nothing there.

---

## Short demonstration script

| Time | Screen | Do | Say |
|---|---|---|---|
| 0:00 | Overview | Point at the banner and the component table | "Local demo, fictional records, honest statuses." |
| 1:00 | Research | Run "Which teams want AI training?" (`ai, training`) | "Validated, planned into eleven subtasks, all completed." |
| 2:30 | Research | Open S-001: highlighted evidence and reasoning | "Every label shows the exact words behind it; preliminary, not a lead." |
| 3:30 | Research | Approve S-005, reject S-002, correct S-001 | "A person decides; nothing is sent anywhere." |
| 5:00 | Research | Run the follow-up question | "It recalls the earlier run and shows my correction separately." |
| 6:00 | Research | Try an out-of-scope platform | "Excluded platforms are refused before any work starts." |
| 6:30 | Trace | Open the second run's log | "Every step and decision is recorded." |
| 7:30 | Evaluation | Run it, then run again | "Software correct 11/11; quality 75% on an illustrative benchmark; repeatable." |
| 9:00 | Memory | Clear memory | "Memory forgets; the audit history does not." |
| 9:30 | Guardrails | Try send_message; prove the network block | "Outreach and network calls are refused." |
| 10:30 | Overview | Close on section 9 above | "What it would take, and what is not authorized." |

## Not authorized

This demo does not authorize, and was not built for: **production deployment; live platform
scanning; real LLM calls; any external action** (publishing, posting, commenting, messaging or
contacting anyone); **use of production data or `openclaw_signals`**; or **any change to agent
permissions or autonomy**.
