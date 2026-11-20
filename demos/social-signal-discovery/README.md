# Social Signal Discovery: local demo

A local, read-only demonstration of the proposed Social Signal Discovery agent architecture
([../../docs/architecture/social-signal-discovery/](../../docs/architecture/social-signal-discovery/README.md)),
built for review by Ali.

> **This is a demo, not the agent.** It runs on fictional sample data only. It searches no live
> platform, calls no API, reads or writes no database, sends nothing and posts nothing. It does not
> enable, deploy or grant anything, and it is not domain build authorization. The agent stays
> disabled at `autonomy:R0` with no tools.

## Run it

**Simplest:** open `demos/social-signal-discovery/index.html` directly in a browser (double-click
it). The demo loads no data over the network, so it works from disk. Add `?q=` to the address to
start with a search, for example `index.html?q=AI%20training`.

**Or serve it locally** (Node 18 or later). From the repository root in PowerShell:

```powershell
node tests/command-center/serve.js (Get-Location).Path 8765
```

Then open <http://127.0.0.1:8765/demos/social-signal-discovery/index.html>. Two details of the
shared local server: it needs the repository's **full path** (a relative `.` is refused with
HTTP 403), and it maps only the site root to `index.html`, so include `index.html` in the address.

## What it does

1. **Search** fictional sample records by topic or keyword.
2. **Deduplicate** records by record id and normalized URL (case, `www.`, query string, fragment
   and trailing slash ignored), and list each duplicate removed with its reason. A repeated record
   id is explained as a repeated id, not as a comparison of two different records.
3. **Classify** each match as "Potential enterprise AI buying signal", "General AI interest" or
   "Not relevant", with a one-sentence reason naming the words that triggered it.
4. **Show evidence**: every result carries its sample record id, platform, title, excerpt,
   classification and reason, and is labeled as a fictional sample.
5. **Show the run**: a trace of the six fixed steps, including the guardrail checks.

## Important limits

- **The sample data is fictional.** Every record was written for this demo; platform names show
  where such a discussion could appear. URLs are placeholders on `example.com`. No author names.
- **The classification rules are illustrative.** The real buyer-signal criteria are PENDING Sohail
  Syed's confirmation. A classification here is preliminary and never a verified lead or buyer.
- **No LLM is used.** Fixed rules stand in for model judgment.

## Files

| File | Responsibility |
|---|---|
| `index.html` | Page shell; loads the shared `assets/tokens.css`, `assets/app.css` and `assets/ui.js` |
| `demo.css` | Demo-only styles (colors from the shared tokens) |
| `js/sample-data.js` | The fictional, labeled sample records |
| `js/dedupe.js` | Duplicate detection by id and normalized URL |
| `js/retrieval.js` | Query validation and deterministic keyword retrieval |
| `js/classify.js` | Preliminary classification with reasons (demo-only rules) |
| `js/pipeline.js` | The fixed workflow (orchestrator), guardrail checks and run trace |
| `js/app.js` | Presentation only |

## Architecture components in this demo

All 13 components, in the manager's order and names. Each has exactly one of five statuses:
**Implemented in the demo**, **Partly implemented**, **Simulated**, **Implemented outside the page**,
**Proposed / not implemented**. A simulated or proposed component is not implemented.

| # | Component | Status in this demo | What the demo actually does |
|---|---|---|---|
| 1 | User Interface (UI) | Implemented in the demo | This page: a search box, result cards with evidence, the duplicates list and a run trace |
| 2 | System Prompt | Proposed / not implemented | None. Without an LLM there is no prompt; the rules live in code |
| 3 | Context Manager | Partly implemented | Validates the query and bounds the result set; nothing more is assembled |
| 4 | LLM (Brain) | Simulated | No model is called. Fixed, demo-only word rules stand in for model judgment when classifying |
| 5 | Agent Loop (Orchestrator) | Implemented in the demo | `pipeline.js` runs one fixed workflow: validate, deduplicate, retrieve, classify, guardrail checks, present |
| 6 | Tools | Proposed / not implemented | None. The demo reads only its own sample file and calls no tool |
| 7 | Knowledge Base / RAG | Simulated | Deterministic retrieval and ranking over fictional sample records, not `openclaw_signals` |
| 8 | Memory | Proposed / not implemented | None. Nothing is remembered between searches |
| 9 | Planning / Task Decomposition | Partly implemented | The step list is fixed in code; no task is decomposed and no plan is generated |
| 10 | Guardrails | Implemented in the demo | Rejects bad queries, checks every cited id exists and is a labeled sample, enforces the result limit; the code has no network calls |
| 11 | Human-in-the-Loop (HITL) | Proposed / not implemented | No approval workflow. Results are only labeled as preliminary, for human review |
| 12 | Logging & Observability | Simulated | A trace of each run is shown on the page; nothing is stored or monitored |
| 13 | Evaluation | Implemented outside the page | Automated tests in `tests/social-signal-demo/` check the logic and the rendered page |

## How results are ranked

Relevance only; classification is a separate step and does not affect order.

1. **Terms matched:** a record matching more of the distinct search terms ranks higher.
2. **Score:** each matched word counts by field (title 3, topic 2, excerpt 1), multiplied by how rare
   the word is across the sample, so a common word such as "ai" counts for less than "leadership".
3. **Phrase bonus:** extra weight when the full multi-word query matches the record's topic exactly,
   or appears as a phrase in its title or excerpt.
4. **Ties:** newest date first, then record id.

Every record matching at least one term stays in the results; fewer matches only means a lower rank.

## Tests

```sh
node tests/social-signal-demo/logic.test.js    # pipeline logic, in Node
node tests/social-signal-demo/render.test.js   # the rendered page, in headless Edge
```

See [../../tests/social-signal-demo/README.md](../../tests/social-signal-demo/README.md).
