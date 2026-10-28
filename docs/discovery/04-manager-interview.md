# Interview plan for Sohail Syed, and a proposed weekly check-in

**Story:** `marketing.RESEARCH-4-MANAGER-INTERVIEW` · **Release:** Discovery and validation
**Accountable human:** Sohail Syed, Marketing Lead · **Author:** Sarbjit Kaur, with Claude Code · **Date:** 2026-10-23
**Status:** proposed agenda, draft. **No interview has taken place and none is scheduled.** This
document sends nothing: no invite, no scheduling link, no attendee list, no email. Arranging the
conversation is a human action outside this project. Everything below is a proposal until Sohail
agrees to it.

> **Source convention.** As in [01](01-system-classes.md)–[03](03-role-and-da-transition.md): paths
> are in the public platform repo
> [`ColaberryIntern/ColaberryEnterprise_AI_LeadershipAccelerator`](https://github.com/ColaberryIntern/ColaberryEnterprise_AI_LeadershipAccelerator)
> at commit `b058da6`. "The matrix" is `backend/src/services/agentDomain/capabilities/marketing.json`.
> "R3 doc" is [03-role-and-da-transition.md](03-role-and-da-transition.md) in this repo.

---

## What this interview is for

The earlier discovery documents left questions that only Sohail can answer. Three matter most:

- **His role in practice.** It's sourced only from a June 2026 launch brief and a contract ending
  July 10 (R3 doc, "Caveat on how current this is" and "Caveat on 'as actually performed'").
- **The missing DA information:** who produces marketing reports today (R3 doc, open question 2).
- **The four things the brief asks to cover:** which capabilities first, which stay human forever,
  what "good" looks like in numbers, and what gets switched off immediately
  (`agentDomainStoryTemplates.ts:182-183`).

Eight questions in 30 minutes. Each has a stated purpose and a stated use for the answer, so a
completed interview changes the build rather than only recording opinions.

---

## Agenda (30 minutes)

| Time | Minutes | Section | Questions |
|---|---|---|---|
| 0:00–0:02 | 2 | Purpose and ground rules: everything is a draft, nothing is approved, and "I don't know yet" is a useful answer | — |
| 0:02–0:08 | 6 | A. Your role today | Q1, Q2 |
| 0:08–0:14 | 6 | B. Which capabilities first | Q3, Q4 |
| 0:14–0:18 | 4 | C. What stays human forever | Q5 |
| 0:18–0:22 | 4 | D. What "good" looks like, in numbers | Q6 |
| 0:22–0:25 | 3 | E. What gets switched off immediately | Q7 |
| 0:25–0:28 | 3 | F. Access item to raise | Q8 |
| 0:28–0:30 | 2 | Proposed weekly check-in, and recap of what's unanswered | — |
| | **30** | | |

If time runs short, cut from the end of a section, not a whole section. Every question not
reached goes in [Unanswered questions](#unanswered-questions).

---

## The questions

### A. Your role today

**Q1. Your launch brief says you own "strategy, copy, ads, social, blogs, podcasts, newsletter,
email campaigns, A/B testing, and the Mailchimp alumni push". Since the July 10 contract date,
what has been added or dropped?**
- *Purpose:* confirm or correct the 13 responsibilities in the R3 doc, which rest on launch-brief
  `:3` and a job posting dated to Jul 10 (`TEAM_LEAD_JOB_DESCRIPTIONS.md:54`).
- *Expected evidence:* a list of what's current, in his words.
- *What we do with the answer:* drop rows he no longer owns from the R3 table. Add any new duty as
  a row whose source is this interview. Rows he doesn't address stay marked **unknown**.

**Q2. Who produces the marketing numbers today (campaign ROI, open and reply rates, cost per lead,
funnel velocity), for whom, and how often? Which of those figures do you trust least?**
- *Purpose:* fill in the missing Data Analyst information. No document describes DA duties (R3
  doc, searches S1–S6), and the matrix's only DA item is this report (`marketing.json:6406`). Also
  confirms whether metric-trust decisions are his (R3 row 12, `marketing.json:6169`).
- *Expected evidence:* the name of the person or tool, the recipients, the cadence, and the
  figures he distrusts.
- *What we do with the answer:* it becomes sections 1–4 of the outline in the R3 doc ("What would
  have to be written"), and decides whether row 11's proposed split holds. The distrusted figures
  become the first items the report must name as unavailable rather than fill in.

### B. Which capabilities first

**Q3. Of the capabilities the matrix allows to be automated, which two or three would you validate
first? Candidates from the earlier documents: copy drafting (`marketing.json:2657`), composing the
recurring report (`marketing.json:6406`), and the read-only funnel analysis that already runs
(`agentRegistrySeed.ts:1937-1945`).**
- *Purpose:* all 64 capabilities are `draft` (`marketing.json:7714`), and 36 are not
  human-reserved ([01](01-system-classes.md), Query A). He decides where validation starts.
- *Expected decision:* an ordered shortlist.
- *What we do with the answer:* RESEARCH-5 (`05-three-proposed-tasks.md`) picks its three tasks
  from his shortlist. Capabilities he doesn't pick stay `draft`.

**Q4. Two gaps: should email campaigns, including the alumni push, be in the agent's scope at all?
The matrix has no capability for them. And who decides the winner of an A/B test today?**
- *Purpose:* resolve R3 open questions 3 and 4. Email campaigns are in his brief (launch brief `:3`,
  `:28-35`), but no capability exists (R3 doc, query S7). A/B testing is R3 row 8, marked
  **unknown**.
- *Expected decision:* in scope or out of scope for email, and a named decider for A/B tests.
- *What we do with the answer:* if email is in scope, record a gap: a new capability would have to
  be proposed, and nothing is built from this interview. Row 8 gets his answer as its source.

### C. What stays human forever

**Q5. The matrix reserves 28 of 64 capabilities to a human at every level, including content
approval, campaign go-live and social publishing. Is there anything on that list you would
release, or anything not on it you want added? And who presses "publish" on social posts today?**
- *Purpose:* test the human-reserved list against his judgement (`marketing.json:2899`, `:4669`,
  `:3245`; [01](01-system-classes.md), Query A). The publish question resolves the "unknown"
  publisher in R3 row 4.
- *Expected decision:* additions or removals, each with his reason, and the publisher's name.
- *What we do with the answer:* any change becomes a *proposed* change to the matrix. This project
  doesn't edit the matrix, and his answer is recorded as the source. The platform still requires a
  human yes for every public post (`agentAutonomy.ts:123`), whatever is said here.

### D. What "good" looks like, in numbers

**Q6. For the first capability you picked in Q3, what result would convince you it works? For
example, for the report: every figure traced to its source, and no figure filled in when it can't
be computed. For drafting: how often you approve a draft without edits.**
- *Purpose:* turn "good" into thresholds. The examples come from the matrix's own acceptance
  criteria (`marketing.json:6406`, `:2657`). They are prompts, not his answers.
- *Expected evidence:* one or two numbers, each with what it measures.
- *What we do with the answer:* each number is recorded as a **proposed** threshold. On this
  platform a threshold stays proposed until a named human accepts it
  (`agentDomain/promotionCriteria.ts:18-22`), so nothing is promoted on the strength of this
  conversation. The numbers become the completion evidence in RESEARCH-5.

### E. What gets switched off immediately

**Q7. Marketing-agent stop conditions: what specific marketing behavior would make you want the
agent switched off immediately? For example, content reaching "approved" without your decision, a
report presenting an unverified financial figure as fact, or a funnel analysis mixing data across
customers or tenants. What other behavior should trigger an immediate stop?**
- *Purpose:* define stop conditions in this domain's terms. The three examples come from verified
  findings:
  - **Content approved without his decision:** the `/transition` route can do this today, and no
    detector exists ([05](05-three-proposed-tasks.md), "Task 3 approval boundary").
  - **An unverified financial figure:** Task 2 is barred from money figures until
    `marketing.revenue_and_cost_metric_truthing` lands (`marketing.json:6406`, `blocked_by`).
  - **Tenant mixing:** the funnel analysis's own header records that it once merged tenants and
    now partitions its output by tenant
    (`agents/departments/marketing/campaignPerformanceAgent.ts:15-20`). That's the header's
    statement; the partitioning code and any test enforcing it weren't checked here.

  Mechanisms to stop an agent already exist: an agent can be disabled, and a global kill switch
  and safe mode block it before it acts (`workforce/workforceAgentRuntime.ts:69-71`). The
  publishing worker also halts on the kill switch "before any claim"
  (`agentRegistrySeed.ts:3101`). These are ways to *stop* an agent, not ways to *detect* a
  condition.
- *Expected decision:* a short list of stop conditions in his words.
- *What we do with the answer:* record each stop condition, identify how it could be detected, and
  distinguish controls already enforced in code from proposed controls that still need
  implementation and testing. An unimplemented stop condition is not treated as an active
  safeguard.

### F. Access item to raise

**Q8. Can you see the marketing agent's pages in the admin surface today?**
- *Purpose:* raise an access problem. It's for him to know about, not for fixing in the meeting.
  - **The brief says he has access.** The domain registry records `can_reach_surface: true`,
    `blocker: null` (`agentDomainRegistry.ts:119-120`). That is why the brief says the check-in
    "can review real state" (`agentDomainStoryTemplates.ts:184-185`).
  - **The matrix records a caveat.** A live check returned 403 "This agent is not in your
    reporting chain" for his account, so having a login is "necessary and not sufficient"
    (`marketing.json:7716`).
  - **There is also no marketing agent to see yet** (`agent_id: null`,
    `agentDomainRegistry.ts:121`).
- *Expected evidence:* whether he can open the pages now. Whether the 403 still happens is
  **unknown** from the repository.
- *What we do with the answer:* if he can't, record it as a blocker for the check-in. Fixing it is
  an engineering change (setting the agent's `reports_to`), done outside this project.

---

## Proposed weekly check-in

All of this is a **proposal** for Sohail to accept, change or decline. It is not scheduled.

| | Proposal | Why |
|---|---|---|
| **Day** | Tuesday | His launch brief has drafts produced on Monday for a Tuesday–Friday refine (launch brief `:26`). Tuesday reviews the week's drafts while there's time to act |
| **Duration** | 20 minutes | Three fixed items. Short enough to keep weekly |
| **Time and time zone** | **unknown**, for Sohail to choose | The platform has no per-manager time-zone field (`marketing.json:7208`) |
| **Who** | Sohail and Sarbjit | Sohail is the accountable human (`agentDomainRegistry.ts:113-125`); Sarbjit is the domain's builder (`agentDomainRegistry.ts:122`) |

**The three things it reviews**

1. **Validation queue.** Which capabilities moved out of `draft` this week, and which are waiting on
   his decision. Source of truth: each capability's `requirement_validation_state` (all 64 are
   `draft` today, `marketing.json:7714`). *Output:* his validate or hold decision on each waiting
   item.
2. **Approval queue.** What was prepared for him, against what he approved or rejected. The record
   is `content_approval_requests`, which the matrix requires an agent's view to reconcile with
   (`marketing.json:2899`). *Output:* any pattern of rejections becomes a change to the drafting
   brief.
3. **Funnel health and stop triggers.** The campaign funnel analysis gives a
   healthy/degraded/empty verdict per campaign, read-only (`agentRegistrySeed.ts:1945`). Also any
   of his Q7 triggers that fired that week. *Output:* a decision on any degraded campaign, and
   on any trigger that fired.

Until a marketing agent exists and Sohail can reach its pages (Q8), items 1 and 3 review data that
exists today. Item 2 reviews whatever drafts are in the queue.

---

## After the interview

This section stays empty until the interview has actually taken place. Fill it in during or right
after the conversation, so this file becomes the record.

**Interview date:** _(not yet held)_ · **Present:** _(blank)_ · **Notes taken by:** _(blank)_

| Q | His answer (his words where possible) | Decision made | Evidence offered | Follow-up and owner |
|---|---|---|---|---|
| Q1 | | | | |
| Q2 | | | | |
| Q3 | | | | |
| Q4 | | | | |
| Q5 | | | | |
| Q6 | | | | |
| Q7 | | | | |
| Q8 | | | | |
| Check-in proposal | accepted / changed / declined: | | | |

### Unanswered questions

Any question not reached, or answered "don't know yet", goes here. Don't guess an answer.

| Q | Why unanswered (not reached / not known yet / needs someone else) | Who can answer | How it will be resolved | Status |
|---|---|---|---|---|
| | | | | open |

---

## What can't be verified from here

- **Whether Sohail can reach the agent pages today.** The registry says yes and the matrix records
  a 403 (Q8). The repository can't settle it.
- **His time zone and preferred meeting time.** No field records them (`marketing.json:7208`).
- **His current role.** The sources date from June 2026 (R3 doc). Q1 exists to settle this.
- **Whether the interview will happen, and when.** That's outside this project.

---

## Sources

Paths are in the platform repo at `b058da6`, apart from links to the R1–R3 documents, which are in
this repo.

| Claim | Source |
|---|---|
| What the interview must cover; send nothing; the check-in can review real state | `backend/src/services/agentDomain/agentDomainStoryTemplates.ts:174-189` |
| The agenda contract (timings, groups, blocker, answers section) | `backend/src/services/agentDomain/agentDomainResearchPrompts.ts:227-251` |
| Sohail is the accountable human; `can_reach_surface`, `blocker`, `agent_id`, builder | `backend/src/services/agentDomain/agentDomainRegistry.ts:113-125` |
| 403 until `reports_to` is set | `marketing.json:7716` |
| All 64 capabilities are `draft` | `marketing.json:7714` |
| Capability records cited in Q2–Q6 | `marketing.json:2657`, `:2899`, `:3245`, `:4669`, `:6169`, `:6406` |
| No per-manager time zone | `marketing.json:7208` |
| Funnel analysis: read-only, verdict per campaign | `backend/src/services/agentRegistrySeed.ts:1937-1945` |
| Publishing worker halts on the kill switch | `backend/src/services/agentRegistrySeed.ts:3101` |
| Runtime: disabled agent, kill switch, safe mode | `backend/src/services/workforce/workforceAgentRuntime.ts:69-71` |
| Funnel analysis header: tenant mixing fixed by partitioning | `backend/src/services/agents/departments/marketing/campaignPerformanceAgent.ts:15-20` |
| Approved without a decision (`/transition`); money figures barred from Task 2 | [05-three-proposed-tasks.md](05-three-proposed-tasks.md), "Task 3 approval boundary"; `marketing.json:6406` |
| Thresholds stay proposed until a named human accepts | `backend/src/services/agentDomain/promotionCriteria.ts:18-22` |
| Human yes for every public post | `backend/src/services/agentAutonomy.ts:123` |
| His scope; Monday drafts for a Tuesday–Friday refine | `docs/training-program-2026-q3/launch-briefs/13-sohail-marketing.md:3`, `:26`, `:28-35` |
| Contract through Jul 10, 2026 | `docs/training-program-2026-q3/TEAM_LEAD_JOB_DESCRIPTIONS.md:54` |
| 36 not human-reserved; 28 human-reserved | [01-system-classes.md](01-system-classes.md), Queries A and C |
| Role caveats, DA gap, rows 4/8/11/12, open questions, queries S1–S7 | [03-role-and-da-transition.md](03-role-and-da-transition.md) |
