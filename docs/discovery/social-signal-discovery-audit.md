# Evidence audit: `marketing.social_signal_discovery`

**Capability:** `marketing.social_signal_discovery` · **Validation state:** `draft` (not validated by this audit)
**Accountable human:** Sohail Syed · **Starting autonomy:** `R0` · **First release target:** `R2`
**Author:** Sarbjit Kaur, with Claude Code · **Date:** 2026-10-30
**Status:** evidence-only audit. No code, tool, permission, agent setting or autonomy level was
changed.

> **Sources.** Paths are in the public platform repo
> [`ColaberryIntern/ColaberryEnterprise_AI_LeadershipAccelerator`](https://github.com/ColaberryIntern/ColaberryEnterprise_AI_LeadershipAccelerator)
> at commit `b058da6`, relative to `backend/src/` unless noted. "The agent" is
> `services/agents/openclaw/openclawMarketSignalAgent.ts`. "The scaler" is
> `services/agents/openclaw/openclawSignalScaler.ts`. "The matrix" is
> `services/agentDomain/capabilities/marketing.json`, where this capability's record starts at
> `:19`. Every finding comes from reading code. Nothing was executed against a database or a
> network, so runtime and production behavior are **unknown** unless stated otherwise.

---

## Summary for Sohail

- **R2 as defined doesn't exist yet.** The matrix defines R2 as answering "where are buyers talking
  about this" **from already-stored signals without scanning**, with every answer citing a stored
  `openclaw_signals` row id and **zero outbound network calls** (matrix R2 release behavior). The
  agent has no such path. Both of its entry points run a **live scan** of public platforms. The only
  read-only access to stored signals today is two admin web routes.
- **Neither R2 criterion can be demonstrated today.** There's no R2 answer path and no test of one,
  and no test anywhere runs with the network blocked.
- **Tests are thin.** One test file covers this capability, and only the scaler's two pure
  functions, with inline data. Nothing tests the agent itself, deduplication, error handling, the
  read routes or lead capture.
- **Four gaps matter for later releases:**
  - one platform's host comes from editable agent config (an allow-list hole);
  - deduplication isn't enforced by the database;
  - most platforms' HTTP failures are swallowed and reported as "0 results";
  - the declared permission tier isn't enforced.

**Proposed direction (not yet approved by Sohail):** R2 should be a **separate, read-only agent
path** that answers from stored `openclaw_signals` rows. It should not extend the live-scanning
workflow. See [Proposed R2 architecture](#proposed-r2-architecture-not-yet-approved-by-sohail). The
capability stays `draft`, and autonomy stays `R0`.

**Smallest next step:** see [Proposed validation test](#proposed-validation-test-for-the-r2-answer-path).

---

## Answers to the 12 questions

Result scale: **confirmed**, **partially confirmed**, **not confirmed**, **unknown**.

### 1. Does it search public platforms, or only read stored signals?
**Result: confirmed. It runs live searches.**
- `scanPlatform` sends HTTP requests with `axios` to public APIs: Reddit (agent `:141`), Hacker News
  (`:172`), Dev.to (`:196`), Hashnode (`:249`), Discourse forums (`:292`), Twitter/X (`:328`),
  Bluesky (`:372`), YouTube (`:413`, `:431`) and Product Hunt (`:483`).
- Its only reads of stored signals are deduplication lookups (`:56-58`). It never *answers* from
  stored signals.
- Some platforms are conditional. Twitter, YouTube and Product Hunt run only if a token is set
  (`:325-326`, `:409-410`, `:467-468`). Quora, Facebook Groups and LinkedIn comments do nothing
  (`:519-529`).
- The seeded registry config limits platforms to `reddit`, `hackernews` and `devto`
  (`services/agentRegistrySeed.ts:1422`), while the code's default list has 11 (agent `:29`).
  **Production's actual config is unknown.**
- **Tests:** none of the agent. **Missing evidence:** the production `ai_agents.config` for this
  agent.

### 2. What does the R2 query path execute?
**Result: not confirmed. No R2 path exists.**
- **The agent's entry points both scan live:**
  - the scheduled run: `aiOpsScheduler.ts:244` → `runOpenclawMarketSignal` → `runAgent('OpenclawMarketSignalAgent', …)` (`services/aiOrchestrator.ts:538`) → the agent;
  - the manual scan: `POST /api/admin/openclaw/scan` calls the agent directly
    (`routes/admin/openclawRoutes.ts:2176-2182`).
- **The only read-only access to stored signals is two admin routes** behind `requireAdmin`
  (`openclawRoutes.ts:30`):
  - `GET /api/admin/openclaw/signals` runs `OpenclawSignal.findAndCountAll` with optional
    `platform` and `status` filters, newest first, paged (`:253-275`);
  - `GET /api/admin/openclaw/signals/:id` runs `OpenclawSignal.findByPk` including the linked
    response (`:277-287`).
- These are web routes for a person, not an agent answer path. Neither filters by keyword or topic,
  which "where are buyers talking about this" would need. The page size is uncapped, because
  `limit` comes straight from the query string (`:258`).
- **They are useful for inspecting stored signals, but they don't satisfy the R2 answer
  requirement.** They return rows, not answers to a question. Testing them would prove nothing
  about an R2 answer path.
- **Tests:** none of these routes. **Missing evidence:** an R2 answer path, defined and tested.

### 3. Can every answer cite a real `openclaw_signals` row id?
**Result: partially confirmed.**
- Every signal row has a UUID primary key (`models/OpenclawSignal.ts:51-55`), and both read routes
  return whole rows, `id` included (`openclawRoutes.ts:271`, `:283`). A citation is therefore
  *possible*.
- Nothing *enforces* that an answer cites one, because no answer layer exists (question 2).
- **Tests:** none. **Missing evidence:** an answer format that carries the row id, and a test
  asserting that each cited id exists.

### 4. Can we show zero outbound network calls during R2?
**Result: not confirmed.**
- By reading the code, the two read routes make no `axios` or other HTTP calls; they only call
  Sequelize (`openclawRoutes.ts:253-287`). That's a code-reading observation, not a trace.
- The agent always makes outbound calls (question 1), so it can't be the R2 path.
- **Tests:** none run with the network blocked. **Missing evidence:** a test or trace that runs the
  R2 path with outbound connections disabled, and records zero requests.

### 5. Do tests use real database records or mocked data?
**Result: neither, for anything except the scaler.**
- The only related test file is `__tests__/services/openclawPhase4.test.ts`. Its scaler tests call
  the pure functions directly with inline arrays. There's no database, no mocks and no `axios`.
- **Tests that exist** (all inline data):
  - `computeKeywordPriority`: `returns top-performing topics as primary keywords` (`:186`),
    `falls back to base keywords when no learnings` (`:198`), `deduplicates between primary and
    secondary` (`:204`), `filters out low-confidence learnings` (`:214`), `assigns weights to all
    keywords` (`:222`);
  - `computePlatformScanPriority`: `high-engagement platforms get > 1.0 multiplier` (`:237`),
    `low-engagement platforms get < 1.0 multiplier` (`:249`), `multiplier capped at [0.5, 2.0]`
    (`:261`), `platforms with no data get 1.0` (`:274`), `insufficient sample size gets default
    multiplier` (`:281`).
- **Not tested at all:** the agent, `getOptimizedScanConfig` (the database-backed half of the
  scaler), deduplication, HTTP error handling, the read routes and lead capture
  (`captureLeadFromSignal` has 0 tests).

### 6. Is a platform allow-list enforced, or can arbitrary URLs be fetched?
**Result: partially confirmed. Mostly fixed hosts, with one config-driven hole.**
- **Fixed:** each platform's host is hard-coded in a `switch`, and an unknown platform name is
  skipped (agent `:138`, `:531-533`). The manual scan route can pass `platforms`, but only names
  the `switch` knows reach the network (`openclawRoutes.ts:2178-2182`).
- **The hole:** Discourse fetches `${forum.base_url}/search.json` for each forum in
  `config.discourse_forums` (agent `:285-292`). The config comes from the agent's database row
  (`services/aiOrchestrator.ts:208`). So **whoever can edit that row can point the agent at any
  host.** Who can edit it is **unknown**. The matrix already lists this as a blocker:
  "unbounded_network (platform scanning must stay on an explicit provider allow-list, never
  arbitrary fetch)" (matrix, `blocked_by`).
- No central allow-list check exists. The declared tool `platform_public_api_read_allowlisted` is
  the matrix's own name, not code.
- **Tests:** none. **Missing evidence:** a test that a non-allow-listed host is refused.

### 7. How are duplicates detected?
**Result: partially confirmed. Application-level only, with gaps.**
- Before each insert, the agent looks for an existing row with the same `source_url`, and skips the
  item if it finds one (agent `:55-59`).
- **The database doesn't enforce it.** The model has no unique index on `source_url`; its indexes
  are `platform`, `status`, `relevance_score` and `created_at` (`models/OpenclawSignal.ts:133-138`).
  No migration or DDL for `openclaw_signals` exists anywhere in the repo, so the production schema is
  **unknown**.
- **Concurrent runs can duplicate.** The 30-minute scheduled run (`aiOpsScheduler.ts:244`) and a
  manual `POST /scan` (`openclawRoutes.ts:2176`) could both pass the check before either inserts.
  Nothing serialises them.
- **Empty URLs collapse distinct posts.** Dev.to, Hashnode and Product Hunt fall back to
  `source_url: ''` when a URL is missing (agent `:204`, `:262`, `:500`). After the first such row,
  every later item with an empty URL "matches" it and is skipped.
- **Cross-platform matching:** Hacker News uses the *linked article's* URL when there is one
  (`:180`), so a story pointing at a URL already found elsewhere is skipped as a duplicate.
- **Tests:** none. **Missing evidence:** the R4 criterion, "Two consecutive runs over the same
  fixture set produce an identical row set (de-dup proven, not asserted)" (matrix R4).

### 8. How are 429 and 5xx responses handled?
**Result: not confirmed as designed. There's no status-specific handling, and most failures are hidden.**
- No code inspects the HTTP status, so 429 and 5xx are treated like any other error. There are no
  retries, so nothing retries without limit. Each request has a timeout of 15 s, or 30 s for
  Hashnode (for example agent `:147`, `:254`).
- **Reddit, Hacker News and Dev.to:** an error propagates to the per-platform `catch`, which records
  a `scan_platform_error` action and moves on (`:88-100`). That matches the matrix's "skipped for
  the tick".
- **Hashnode, Discourse, Twitter, Bluesky, YouTube and Product Hunt:** the error is caught *inside*
  `scanPlatform` and only logged with `console.warn` (`:275-277`, `:316-318`, `:363-365`,
  `:401-403`, `:459-461`, `:513-515`). The platform then returns no results, and is recorded as a
  **successful** scan that "found 0 results" (`:78-87`). The failure never reaches the run's actions
  or errors.
- **Rate limiter and circuit breaker aren't used.** The matrix lists `openclawRateLimiter` and
  `openclawCircuitBreaker` as dependencies, but the agent imports neither (agent `:1-4`).
- **Tests:** none. **Missing evidence:** tests for 429 and 5xx on each platform.

### 9. What happens when author identity can't be resolved?
**Result: confirmed by code; untested.**
- The signal is still stored, with `author: ''` (for example agent `:155`, `:181`, `:205`, `:349`).
- Lead capture then returns `null` for an empty, `'unknown'` or `'[deleted]'` author
  (`services/agents/openclaw/openclawLeadCaptureService.ts:32-33`). This matches the matrix's
  exception: "still stored but cannot be lead-captured".
- **Tests:** none (0 tests reference `captureLeadFromSignal`).

### 10. Are keyword weights equal when there's no learning data?
**Result: confirmed by code, partly tested. But the weights are never used.**
- With no learnings, there are no primary keywords, the base keywords become secondary, and every
  base keyword gets weight 1 (scaler `:47-63`). Every platform gets multiplier 1.0 (`:76-81`).
- **Tests:** `platforms with no data get 1.0` asserts the multiplier (`openclawPhase4.test.ts:274-279`).
  `falls back to base keywords when no learnings` checks only primary and secondary, not the weights
  (`:198-202`). The default weight of 1 is asserted only when a learning *exists* (`:222-231`).
- **The agent never reads the `weights` map.** It merges primary and secondary into a list (agent
  `:39-40`) and builds its query from the **first 3 keywords only** (`:135`). With the 7 seeded
  keywords (`services/agentRegistrySeed.ts:1421`), four are never searched on a cold start. Once
  learnings exist, the first 3 are the top performers. So "flat weights on a cold start" holds in
  the scaler, but has no effect on what is searched.
- The platform multiplier scales the **result count** per platform (agent `:50-51`), not scan
  frequency as its name suggests.

### 11. What does a run write, including bookkeeping?
**Result: partially confirmed.**
- **Business data:** one `openclaw_signals` row for each new item, with status `discovered` (agent
  `:61-74`).
- **`openclaw_learning`:** read only (scaler `:130-141`). No write.
- **Bookkeeping, scheduled run only:** the `runAgent` wrapper updates the agent's `ai_agents` row
  twice and writes one `ai_agent_activity_logs` row (`services/aiOrchestrator.ts:197`, `:215-228`,
  `:235-252`). The same holds on failure (`:266-272`, `:274`).
- **Bookkeeping, manual scan:** none, because `POST /scan` bypasses the wrapper
  (`openclawRoutes.ts:2179-2182`). That also skips the enabled/paused check (`aiOrchestrator.ts:183-191`).
- **Possibly more:** the scheduler can wrap a runner in `instrumentCronJob`
  (`aiOpsScheduler.ts:531-532`). Whether that applies here, and what it writes, wasn't traced and is
  **unknown**.

### 12. What permissions and autonomy settings actually apply?
**Result: partially confirmed. Declared settings aren't enforced, and production values are unknown.**
- **Grant map:** the agent has no entry, so it falls to the default `suggest_only` tier
  (`services/agentPermissionService.ts:99-105`, `:111-113`). That tier would forbid writing
  `openclaw_signals`, but the agent never calls `validateAgentWrite` and writes directly. **The
  declared tier is not enforced** (see also
  [05-three-proposed-tasks.md](05-three-proposed-tasks.md), "Write-permission enforcement").
- **Registry row:** no `tools_granted`, `enabled` or autonomy fields are seeded
  (`services/agentRegistrySeed.ts:1411-1426`). `enabled` defaults to `true` (`models/AiAgent.ts:423-426`).
  An autonomy level is classified when the row is created (`services/agentRegistrySeed.ts:3209`).
  **Production values of `enabled`, `autonomy_level` and `config` are unknown.**
- **ABAC** defaults to `shadow`, meaning it logs but never blocks (`services/settingsService.ts:69`).
  Production mode is **unknown**.
- **The capability:** `starting_autonomy` `R0`, ceiling `R7`, `draft`, `human_decision: false`
  (matrix record from `:19`). **Nothing is authorized.**
- **Admin routes:** require an admin token (`openclawRoutes.ts:30`).

---

## R2 acceptance evidence matrix

The R2 criterion: "Every answer cites a stored openclaw_signals row id; zero outbound network calls
in the trace" (matrix R2 release behavior).

| Requirement | What the code shows | Test evidence | Status | What's missing |
|---|---|---|---|---|
| An R2 path exists that answers from stored signals without scanning | The agent always scans (Q1). The only stored-signal reads are two admin routes with no topic filter, which don't answer questions (Q2) | None | **Not met** | A separate read-only R2 path (proposed below), agreed with Sohail |
| Every answer cites a stored `openclaw_signals` row id | Rows have a UUID `id`, and the routes return it (Q3) | None | **Not demonstrated** | An answer format carrying ids, and a test that each id exists |
| Zero outbound network calls in the trace | The routes make no HTTP calls, by reading (Q4) | None | **Not demonstrated** | A network-blocked test or trace of the R2 path |
| Supporting: answers come from real stored rows, not fixtures | Unknown | No database-backed test exists (Q5) | **Unknown** | A test against seeded sandbox rows |

**R2 is not ready to claim.** The capability must stay `draft`.

---

## Proposed R2 architecture (not yet approved by Sohail)

**Status:** proposed by Sarbjit on 2026-10-30, after this audit. **Sohail hasn't approved it.** It
authorizes nothing, and nothing has been built. The capability stays `draft`, and its autonomy
stays `R0`.

**Direction:** R2 is a **separate, read-only agent path**. It does not extend the live-scanning
workflow in `openclawMarketSignalAgent.ts`, and it does not reuse the admin routes. Those routes
stay useful for a person inspecting stored signals, but they return rows, not answers.

**What the R2 path must do**
1. **Answer from stored records only.** The input is a question, such as "where are buyers talking
   about AI training?", with optional platform and date filters. The answer is built only from
   existing `openclaw_signals` rows.
2. **Cite real stored signal UUIDs.** Every statement in an answer carries the `id` of each row it
   rests on (the UUID primary key, `models/OpenclawSignal.ts:51-55`). A statement with no citation
   is not allowed.
3. **Make zero outbound network calls.** No platform API, no `axios`, and no other HTTP.
4. **Never scan, insert or modify.** It must not call `runOpenclawMarketSignalAgent` or
   `scanPlatform`, and must not create, update or delete any `openclaw_signals` row.
5. **Say so when nothing is stored.** If no stored row matches, the answer says that no stored
   signals were found, with zero citations. It never falls back to scanning.

**Design constraints this implies** (each needs Sohail's or the builder's decision)
- **No hosted model call.** A call to a hosted LLM is an outbound network call, so it would break
  requirement 3. An R2 answer must therefore be put together deterministically from the rows (for
  example counts by platform, plus the matching rows with their ids), unless Sohail agrees that a
  model call doesn't count as outbound. **This needs his decision.**
- **No run bookkeeping, or an explicit exception.** If R2 ran through the `runAgent` wrapper, every
  run would update `ai_agents` and insert an `ai_agent_activity_logs` row
  (`services/aiOrchestrator.ts:197`, `:215-228`, `:235-252`). That doesn't touch `openclaw_signals`,
  but it is an insert. Whether logging the run is acceptable is **a decision for Sohail**.
- **Read-only by structure, not by permission tier.** The grant map doesn't enforce tiers for these
  agents (Q12). So the guarantee has to come from the module itself: it reads `OpenclawSignal`
  only, imports nothing that can reach the network or the scanner, and has a bounded result limit,
  unlike `GET /signals`, whose `limit` is uncapped (`openclawRoutes.ts:258`).
- **Matching on stored fields only:** `topic_tags`, `title`, `content_excerpt`, `platform` and
  `discovered_at`, all of which the agent stores (`openclawMarketSignalAgent.ts:61-74`).

---

## Proposed validation test for the R2 answer path

**A test of `GET /signals` alone is not enough.** The test must call the **actual R2 answer path**.
That path doesn't exist yet, so this test is a specification for whoever builds it. Nothing was
written here.

**Setup**
- **A real, seeded sandbox database,** not mocks, because only real rows can prove that a cited
  UUID exists. Seed a known set of `openclaw_signals` rows: some that match the test question, some
  on other topics, at least two platforms, and one row with an empty `author`.
- **Record the table's state:** row count, plus a checksum of every row's contents.
- **Block the network:** make any outgoing HTTP or HTTPS request fail and be counted, through an
  interceptor on `axios` and on Node's `http` and `https` modules.
- **Watch for forbidden calls:** spy on `runOpenclawMarketSignalAgent`, and on
  `OpenclawSignal.create`, `update`, `destroy`, `bulkCreate` and `upsert`.

**Assertions**

| # | Assertion | Proves |
|---|---|---|
| 1 | Every citation in the answer is a UUID that exists in the seeded table and matches the question | Requirement 2: real stored UUIDs |
| 2 | No statement in the answer lacks a citation | Requirement 2: nothing unsourced |
| 3 | Zero outbound requests were attempted | Requirement 3 |
| 4 | The scanner spy and every write spy were called 0 times | Requirement 4 |
| 5 | The row count and checksum are identical before and after | Requirement 4: nothing inserted or modified |
| 6 | A question that matches no stored row returns "no stored signals found", zero citations, zero outbound requests and no scan | Requirement 5 |
| 7 | Running the same question twice returns the same citations | That the answer is reproducible from stored data |

**Plus one static check:** the R2 module's imports don't include `axios`, the signal agent or any
other network client. That turns the read-only structure into something a test can fail on.

**What this test would *not* prove:** production configuration, production data, or anything about
the live scanner. Those remain the subjects of R4 and R7.

**Before building, two questions for Sohail:** whether R2 may use a hosted model (it would count as
outbound), and whether R2 runs may write bookkeeping rows.

---

## Other findings, not asked but relevant

- **The scheduler and the registry use different names:** `OpenclawMarketSignal`
  (`aiOpsScheduler.ts:244`) versus `OpenclawMarketSignalAgent` (`services/agentRegistrySeed.ts:1412`;
  `services/aiOrchestrator.ts:538`). The run itself looks up the second name. Whether the first
  affects monitoring is **unknown**.
- **The registry description is stale.** It says the agent scans "Reddit, LinkedIn, HackerNews,
  Quora, Dev.to, and Medium" (`services/agentRegistrySeed.ts:1419`), but Medium was removed
  (agent `:281`), and LinkedIn and Quora do nothing (`:519-529`).
- **The matrix's citation has drifted.** The matrix cites `agentRegistrySeed.ts:1397` for this
  agent; at `b058da6` the row is at `:1412`.

---

## Sources

| Claim | Source |
|---|---|
| Capability record, R2/R4/R7 criteria, `blocked_by` | `services/agentDomain/capabilities/marketing.json:19` (record start) |
| Live scanning per platform; dedup; writes; error handling; keyword use | `services/agents/openclaw/openclawMarketSignalAgent.ts:1-4`, `:29`, `:39-40`, `:50-51`, `:55-74`, `:78-100`, `:135`, `:138-537` (line references in each answer) |
| Scaler: cold-start weights and multipliers; read only | `services/agents/openclaw/openclawSignalScaler.ts:47-63`, `:76-81`, `:130-141` |
| Schedule and runner | `services/aiOpsScheduler.ts:244`, `:531-532`; `services/aiOrchestrator.ts:183-191`, `:197-280`, `:208`, `:538` |
| Registry row, seeded config and description | `services/agentRegistrySeed.ts:1411-1426`, `:3209` |
| Model: id, no unique `source_url` | `models/OpenclawSignal.ts:51-55`, `:60-63`, `:133-138` |
| `enabled` default | `models/AiAgent.ts:423-426` |
| Admin read and scan routes | `routes/admin/openclawRoutes.ts:30`, `:253-287`, `:2176-2188` |
| Lead capture rejects a blank author | `services/agents/openclaw/openclawLeadCaptureService.ts:32-33` |
| Permission default and check | `services/agentPermissionService.ts:99-105`, `:111-113` |
| ABAC default | `services/settingsService.ts:69` |
| Tests | `__tests__/services/openclawPhase4.test.ts:183-282` |
