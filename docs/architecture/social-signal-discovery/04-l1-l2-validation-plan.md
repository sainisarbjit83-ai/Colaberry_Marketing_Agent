# L1 and L2 validation plan

What the first two ladder steps must prove before anything is requested (L3) or built (before L4),
and how each finding feeds the 13 components. **The acceptance criteria below are quoted exactly
from `.colaberry/progress.json` and are not changed here.** Sohail Syed evaluates the evidence.

## 1. L1: do it by hand

Story: `marketing.CAP.social_signal_discovery.L1-BY-HAND` (state: not_started).

**Acceptance criteria (verbatim):**

1. "The capability was performed end to end by hand, producing its real outcome on real inputs."
2. "A run log exists recording the date, the elapsed time, each step actually performed, every judgment call made, and at least one way the recorded workflow differed from what the work was really like."

**Scope authorized by Ali:** manual, read-only, human pace, on Reddit, Hacker News, Dev.to, Hashnode,
Discourse, Bluesky, YouTube and Product Hunt. Excluded: X, LinkedIn comments, Facebook Groups. No
scripts, API calls, posting, commenting or contact.

**Working materials:** a research worksheet, a signal register and a run log, kept in a private
local folder outside this public repository because they hold public usernames and links.

**What L1 must surface for the components:**

| Finding from L1 | Feeds component |
|---|---|
| The judgment calls made when deciding whether a post is a buyer signal | 2 System Prompt, 10 Guardrails |
| The steps actually performed, in order | 9 Planning / Task Decomposition, 5 Agent Loop |
| Which steps were mechanical and which needed judgment (the story asks for this split) | 6 Tools (the L3 request is argued from it) |
| Where the recorded workflow differed from reality | 5 Agent Loop, 7 Knowledge Base / RAG |
| The exceptions met (a site erroring, a post with no author, flat keyword weights) | 10 Guardrails, 12 Logging & Observability |
| The finished register and run log, as the reference outcome | 13 Evaluation |

## 2. L2: do it in the app

Story: `marketing.CAP.social_signal_discovery.L2-IN-THE-APP` (state: not_started). Starts only after
L1 is complete.

**Acceptance criteria (verbatim):**

1. "The same outcome was produced a second time using only the product, with no agent, no script and no direct database edit -- or the exact step that made this impossible is written down as a named gap."
2. "The app route was compared against the step 1 run log, and every difference between them is recorded."

**Product surfaces the story lists:** `/admin/intelligence` (Outreach tab) and
`/admin/marketing/performance` (Outreach tab), backed by `GET /api/admin/openclaw/signals`,
`GET /api/admin/openclaw/signals/:id` and `POST /api/admin/openclaw/scan`.

**Caution for L2:** the Outreach pages may offer a scan action (`POST /api/admin/openclaw/scan`
runs the live scanner). Running it would be an automated scan, which is not authorized. If the
product's only route to the outcome is that scan, record it as the named gap that criterion 1
allows, rather than running it, unless Ali authorizes it.

**What L2 must surface for the components:**

| Finding from L2 | Feeds component |
|---|---|
| How stored signals appear in the product, including rows that are not buyer conversations | 7 Knowledge Base / RAG |
| Which product pages a person can use, and their gaps | 1 User Interface |
| Each difference from the L1 run log | 5 Agent Loop, 13 Evaluation |

## 3. After L2: the proposed R2 test design (not yet buildable)

The audit already specifies how a future R2 answer path would be tested:
[../../discovery/social-signal-discovery-audit.md](../../discovery/social-signal-discovery-audit.md),
section "Proposed validation test for the R2 answer path". It uses a seeded sandbox database, a
blocked network, spies on the scanner and on every write, a row-count and checksum comparison, an
empty case, a repeatability check, and a static import check. It is a specification only; the path
it tests does not exist and is not authorized.

**Test infrastructure found in the platform repository** (read-only review, November 9, 2026):

| Exists | Missing |
|---|---|
| A database-backed integration tier: any `*.integration.test.ts` gets its own throwaway Postgres, in CI and locally | Any `openclaw_signals` fixture or seed data |
| An established pattern for building tables from models and seeding rows in a test database | Any mechanism that blocks or counts outbound network calls in tests |
| A write-spy pattern (`jest.spyOn` on model methods) | A built-in guard that refuses a production database |
| A precedent for refusing to run unless the database name marks it as a test database | Any test of a stored-signal read |

## 4. Open decisions before and during L1 and L2

| # | Decision | Who | Blocks |
|---|---|---|---|
| 1 | The keyword list (the story's blocker: "manager has not validated the keyword or platform set") | Sohail | L1 |
| 2 | The written test for what counts as a buyer signal | Sohail | L1 |
| 3 | Which Discourse forums to search | Sohail | L1 |
| 4 | Whether a local, de-duplicated register counts as the "real outcome" (the story's output is `openclaw_signals` rows, which L1 will not write) | Sohail or Ali | L1 criterion 1 |
| 5 | Whether browsing while signed in to a platform is allowed | Ali | L1 |
| 6 | Where the register and run log may be stored and shared, given the public usernames they hold | Ali | L1 and L2 |
| 7 | Whether L2 may use the product's scan action, or must record it as a named gap | Ali | L2 |
| 8 | Whether R2 may use a hosted model | Sohail | Phase 3 |
| 9 | Whether R2 runs may write bookkeeping rows | Sohail | Phase 3 |
| 10 | How L4 criterion 2 relates to criterion 1 (see [03-dependencies-and-roadmap.md](03-dependencies-and-roadmap.md), section 6) | Sohail or the platform | L4 |

## 5. Inconsistencies recorded for clarification

- **"Blocked by: nothing"** appears on all four ladder stories, although each depends on the one
  before (L2 compares with the L1 run log; L3 cites L1 and L2; L4 says to start only after step 3
  has a recorded decision).
- **The Owner field is blank** on all four stories.
- **L4's criteria conflict**, as described in the roadmap.
- **The data in the knowledge layer is mixed:** `openclaw_signals` also holds Colaberry's own
  generated posts and tracking rows ([01-agent-architecture.md](01-agent-architecture.md), section 5).
- **The anatomy document is partly out of date:** it records `agent_id: null`; the snapshot now
  shows a disabled agent record.
