# Social Signal Discovery — Full Hybrid Demo

A local, working demonstration of how a Social Signal Discovery agent would be built from the
13-component agent architecture. It runs on one computer, uses **fictional records only**, and is
meant for internal review. For the guided presentation, see [DEMO_GUIDE.md](DEMO_GUIDE.md).

---

## 1. Purpose and business problem

People discuss AI training and AI adoption in public communities every day. A small share of
those posts show an organization that may be ready to buy: a team looking for a training partner,
a department with budget, a leader evaluating vendors. Finding them by hand is slow, and it is
easy to over-read a casual comment as a sales lead.

This demo shows how an agent could help, **safely**: find candidate posts, explain each
classification with the exact words that support it, put every result in front of a person
before anything counts, remember those decisions, and measure itself honestly.

It is a demonstration of the architecture, not a lead-generation tool.

## 2. What it does and does not do

| It does (locally) | It does not |
|---|---|
| Accept a research question and validate its scope | Search any live platform |
| Plan the work as visible subtasks and run them in order | Call any external API or a real LLM |
| Retrieve, de-duplicate and rank fictional sample records | Use production data or the `openclaw_signals` table |
| Give each record a preliminary classification with evidence and reasoning | Identify, profile or contact the authors of posts |
| Queue every result for human approve / reject / correct | Publish, post, comment or message anyone |
| Remember earlier runs and review decisions | Change any agent permission, autonomy level or production setting |
| Log every step and refuse blocked actions | Claim that any classification is a verified lead or buyer |
| Measure software correctness and classification quality separately | Represent its benchmark as approved buyer criteria |

## 3. The 13 architecture components

| # | Component | Status in this demo | What it actually does | Limits |
|---|---|---|---|---|
| 1 | User Interface (UI) | Implemented in the demo | Browser interface on 127.0.0.1 | One local user, no sign-in |
| 2 | System Prompt | Implemented in the demo | Versioned instructions stored as configuration, validated and shown in every trace | The simulated provider does not interpret it like a real LLM |
| 3 | Context Manager | Implemented in the demo | Validates question, keywords, platforms, dates, limits; carries results between steps | Excluded platforms are refused |
| 4 | LLM (Brain) | **Simulated** | Deterministic word rules behind a provider interface; a real-LLM adapter exists but is disabled | Demo-only rules; real criteria pending Sohail Syed |
| 5 | Agent Loop (Orchestrator) | Implemented in the demo | Runs subtasks in order; stops on a guardrail block or critical failure | One run at a time |
| 6 | Tools | Implemented in the demo | Six local tools with input/output contracts and permission checks | None can reach a network or publish |
| 7 | Knowledge Base / RAG | **Partly implemented** | Keyword retrieval over 20 fictional records, each traceable to its source | No embeddings or vector search |
| 8 | Memory | Implemented in the demo | Run summaries, processed records and review feedback, recalled by later runs | Local only |
| 9 | Planning / Task Decomposition | **Partly implemented** | Every request becomes eleven visible, tracked subtasks | Fixed plan template, not generated per request |
| 10 | Guardrails | **Partly implemented** | Action allow-list, platform scope, evidence checks, in-process network block | Demonstration guardrail, not a production security boundary |
| 11 | Human-in-the-Loop (HITL) | Implemented in the demo | Approve, reject or correct every result, with a reviewer note | Approval triggers no external action |
| 12 | Logging & Observability | Implemented in the demo | Structured log entry for every task, tool call, decision and guardrail event | No dashboards or alerting |
| 13 | Evaluation | Implemented in the demo | Software checks plus classification metrics, stored and repeatable | Benchmark is fictional and illustrative |

The Overview page shows the same components with the same statuses (from
`server/components-status.js`); a test fails if this table and that file ever disagree.

## 4. How it works

```
 Research request ──► Context Manager ──► Planner ──► Agent Loop ─────────────────────────────┐
  (UI)                 validate scope      11 subtasks   runs each subtask in order            │
                       (Guardrails)                      │                                     │
                                                         ├─ Memory: recall earlier runs/reviews │
                                                         ├─ Tools: retrieve (Knowledge Base),  │
                                                         │   normalize, dedupe, rank           │
                                                         ├─ LLM (simulated): classify + evidence│
                                                         │   checked by Guardrails             │
                                                         ├─ save results ─► Human review queue │
                                                         ├─ Tools: report (cites every record) │
                                                         └─ Memory: remember this run          │
 Logging records every step ◄──────────────────────────────────────────────────────────────────┘
 Evaluation runs separately: software checks + benchmark quality
```

**End to end:** a person asks a question → the request is validated (out-of-scope platforms are
refused) → the planner lists the subtasks → the agent loop runs them: recall memory, retrieve,
normalize, de-duplicate, rank, classify, attach earlier reviews, save, queue for review, report,
remember → the person reviews each result → the next run recalls those decisions.

If a guardrail refuses anything, or a critical step fails, the run stops safely and the remaining
steps are marked skipped, with the reason shown in plain language.

## 5. Technology and local data

- **Node.js only** (version 22.5 or newer), with no added packages: the built-in web server,
  built-in SQLite database and built-in test runner. Plain HTML, CSS and JavaScript in the browser.
- **One local database file**, `tmp/ssd-full/demo.sqlite`, created on first start. The repository
  already ignores `tmp/`, so it is never committed. It holds the 20 fictional sample records, runs
  and subtasks, results, review decisions, memory, execution logs, and evaluation results.
- **Configuration files**: `server/config/system-prompt.json` (the agent's instructions),
  `server/config/scope.json` (approved and excluded platforms, input limits) and
  `server/evaluation/benchmark.json` (the fictional benchmark).

## 6. Start it

```
node demos/social-signal-discovery-full/server/server.js
```

Open **http://127.0.0.1:4310**. Stop with Ctrl+C. Nothing to install.

| Option | Effect |
|---|---|
| `--port 5000` (or environment variable `SSD_PORT=5000`) | Use a different port |
| `--memory` | Use a throwaway in-memory database; nothing is kept |
| `--db path/to/file.sqlite` | Use a specific database file |

To start from a clean state, stop the server and delete `tmp/ssd-full/`. Node prints a one-line
"ExperimentalWarning" about SQLite on start; it is harmless (hide it by adding
`--disable-warning=ExperimentalWarning` after `node`).

Evaluations can also be run from the command line:
`node demos/social-signal-discovery-full/server/evaluate.js --memory` (or `--list`, `--show EVAL-0001`).

## 7. Walkthrough

About ten minutes; the full script with talking points is in [DEMO_GUIDE.md](DEMO_GUIDE.md).

1. **Overview**: the local-demo banner and the 13 components with their honest statuses.
2. **Research**: run "Which teams want AI training?" with keywords `ai, training`. Look at the
   plan, the highlighted evidence and the reasoning.
3. **Review**: approve S-005, reject S-002, correct S-001 to "General AI interest" (a correction
   needs a label and a note).
4. **Memory recall**: run "Follow-up: leadership training demand" with keywords
   `training, leadership, ai`. Earlier decisions appear in a separate "recalled from memory" box;
   the new classification is not changed.
5. **Out of scope**: press "Try an out-of-scope platform" and read the rejection.
6. **Execution trace & logs**: open the second run's log.
7. **Evaluation**: run it; compare the software checks with the quality metrics; run it again to
   see the identical results fingerprint.
8. **Memory & review history**: clear memory; the review audit history stays.
9. **Guardrails**: try a blocked action and the network-block test.

## 8. The simulated LLM and the fictional benchmark

**Simulated LLM.** Classification uses fixed word rules: a record that mentions AI, an
organization and buying intent is a "potential enterprise AI buying signal"; AI alone is
"general AI interest"; otherwise "not relevant". Each classification lists the exact words that
triggered it and where they appear. The same input always gives the same answer. It is **not a
language model** and does not read the system prompt the way a real LLM would; the prompt is
stored and shown so reviewers can see what a real model would be given. A real-LLM adapter exists
in the code but is disabled and refuses every call.

**Fictional benchmark.** 24 invented records (8 per label, 7 deliberately hard) with an expected
label and a written reason for each. The expected labels are the demo author's illustrative
judgements, **not Sohail Syed's approved buyer-signal criteria**, which are still pending. Scores
on it show how quality would be measured, not how well a real system would perform.

## 9. Memory, human review, evaluation and guardrails

- **Memory.** After each run the agent remembers the question, keywords, counts and the records it
  processed; each review decision is remembered too. A later run that shares a keyword recalls
  those runs, and any record seen before shows its earlier decision **beside** the new
  classification. Clearing memory deletes what runs recall; it does **not** delete the review
  audit history.
- **Human review.** Every result starts as "waiting for review". A reviewer approves, rejects or
  corrects it. A correction must name a different label, and every decision needs a note. A
  decision cannot be silently changed later. Approving records a decision only; nothing is sent
  anywhere.
- **Evaluation.** Two separate answers, never combined: *software correctness* (11 checks that the
  workflow behaves as designed) and *classification quality* (accuracy, precision, recall, F1,
  a confusion matrix and a clear/hard breakdown against the fictional benchmark). A metric whose
  denominator is zero is shown as "undefined", not 0%. Every evaluation is stored and repeatable.
- **Guardrails.** Only local actions are allowed; publishing, commenting, messaging, contacting,
  external fetches, live searches and writes to `openclaw_signals` are refused with a reason.
  Excluded platforms (X, LinkedIn comments, Facebook Groups) are refused. Evidence must really
  appear in the record. Outbound network calls are blocked in the server process; the "prove it"
  test calls four network functions against the computer's own loopback address and shows each
  refused. This is a demonstration guardrail, not a production security boundary.

## 10. Tests and latest results

```
node --disable-warning=ExperimentalWarning --test tests/social-signal-full/*.test.js
```

Latest run, 2026-11-20: **92 of 92 tests passed**, covering every component, failure and stop
conditions, the API against the real server (rejected inputs, blocked actions, persistence across a
restart) and a 12-step browser walkthrough in headless Microsoft Edge (skipped if Edge is not
installed; set `EDGE_PATH`). The original prototype's tests also pass (1 logic test, 26 rendered
checks). The same browser walkthrough also passed against the server started with the documented
command from a clean state.

## 11. Known limitations and future dependencies

**Limitations of this demo**
- Rule-based classification on fictional data: it misreads negation ("no budget"), double meanings
  ("business model", "rag rug") and buying intent phrased in unusual words.
- Keyword retrieval only; a fixed plan template; one user and one run at a time.
- The benchmark is small, written by the same author as the rules, and labelled by one person.
- Runs viewed after a restart show slightly less detail than a run just executed.
- The network block is in-process only.

**Before any real-world use, at minimum**
- Sohail Syed's approved buyer-signal criteria, and a benchmark labelled against them by more than
  one reviewer.
- A decision on whether and which real LLM to use (an AI-model escalation), including how it fits
  the "no outbound network" constraint.
- Approved, compliant data sources for each platform, plus privacy and legal review.
- A governed path for any production data, including whether `openclaw_signals` is involved.
- Production security (real network egress controls, authentication), hosting and monitoring.
- Permission and autonomy changes through the platform's governance process. The agent is
  currently disabled at the lowest autonomy level, and this demo changes none of that.
