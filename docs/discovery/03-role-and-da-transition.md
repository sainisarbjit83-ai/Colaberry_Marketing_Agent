# Sohail's role, and which DA responsibilities transition

**Story:** `marketing.RESEARCH-3-ROLE-AND-DA-TRANSITION` · **Release:** Discovery and validation
**Accountable human:** Sohail Syed (`sohail@colaberry.com`), Marketing Lead · **Author:** Sarbjit Kaur, with Claude Code · **Date:** 2026-10-23
**Status:** draft for Sohail's review. Nothing here enables an agent, grants a tool, changes an autonomy level or sends anything.
**Every "transition" in this document is a proposal.** No role change has been approved. Each one
needs Sohail to validate the capability first (all 64 are `draft`, `marketing.json:7714`), and the
budget or strategy parts also need Ali (launch brief `:69`).

> **Source convention.** As in [01](01-system-classes.md) and [02](02-agent-anatomy.md): paths are
> in the public platform repo
> [`ColaberryIntern/ColaberryEnterprise_AI_LeadershipAccelerator`](https://github.com/ColaberryIntern/ColaberryEnterprise_AI_LeadershipAccelerator)
> at commit `b058da6`. "The matrix" is `backend/src/services/agentDomain/capabilities/marketing.json`.
> "Launch brief" is `docs/training-program-2026-q3/launch-briefs/13-sohail-marketing.md`.

---

## The short version

- **The accountable human is Sohail Syed, Marketing Lead.** Four records agree: the domain registry
  (`agentDomainRegistry.ts:113-125`), the human ownership map (`HUMAN_OWNERSHIP_MAP.md:12`), the
  launch roster (`03-team-roster.md:13`) and the matrix (`marketing.json:3`).
- **No document describes a Data Analyst role in Marketing**, or in any other domain. The brief
  says three researchers found this independently, and my search below confirms it for this repo.
  The matrix labels **one** capability as "DA responsibility in transition": recurring
  performance reporting. Its basis is an agent description, not a human role document.
- **Proposed transition to the agent (not approved):** content drafting in full. For four more
  responsibilities, only the preparation work is proposed to transition: strategy proposals, the
  recurring report, the publishing package and landing-page drafts.
- **Stays human:** every approval, every publish, every send, campaign go-live, metric-trust
  calls, relationship work with people, and managing the agent itself.
- **The DA source material does not exist.** [What would have to be written](#what-would-have-to-be-written)
  gives the outline and who would write it.

---

## What I searched, and what I found

The searches ran over the whole platform repo at `b058da6`, excluding `node_modules` and `.git`.

| # | Search | What it found | What that means |
|---|---|---|---|
| S1 | `"data analyst"`, any case | Curriculum lesson data, an AI component `dataAnalystAgent.ts`, a test fixture, and the capability matrices | No human DA role document. `dataAnalystAgent.ts` is "deterministic... No LLM calls" SQL enrichment (`intelligence/assistant/agents/dataAnalystAgent.ts:1-5`), not a person's job |
| S2 | `DA` as a whole word, in `.md` files | 10 files: governance, prompts, a session log, a launch brief | None defines DA duties |
| S3 | `"(DA)"`, `"DA duties"`, `"DA responsibilit"`, `"DA role"` | Only the story template and the capability matrices | Other domains record the same gap: "No DA role or responsibilities document exists for Colaberry to transition from" (`executive.json:7266`); "THE DA-RESPONSIBILITIES-TO-AI SOURCE MATERIAL DOES NOT EXIST FOR THIS DOMAIN" (`admissions.json:5367`) |
| S4 | Matrix capabilities whose name, source or outcome mention DA or data analyst | One: `marketing.recurring_marketing_performance_reporting` (`marketing.json:6406`) | The matrix's only marketing DA item |
| S5 | `sohail`, any case, in `.md`/`.json`/`.ts`/`.csv` (tests excluded) | About 30 files. The ones that describe his role are the launch brief, the team roster, the ownership map, the AI employee roster and the domain registry | These are the sources for his role below |
| S6 | `.loop-architect/runs/20261007-school-agent-factory/plan.md`, which the matrices cite as the origin of the DA requirement | **Not in the public repo** | The requirement's original wording can't be checked from here |

---

## Sohail's role, as the sources describe it

His launch brief says: "You own strategy, copy, ads, social, blogs, podcasts, newsletter, email
campaigns, A/B testing, and the Mailchimp alumni push. CB drafts; you direct + approve" (launch
brief `:3`). "CB" is the platform's AI execution queue (`03-team-roster.md:23`). He shares
Marketing Approval with Ali (`03-team-roster.md:30`; launch brief `:59`). Budget and strategy
decisions go to Ali (launch brief `:69`).

**Caveat on how current this is.** The launch brief was written for the June–July 2026 launch, with
deliverables due from 2026-06-05 (launch brief `:18`). The matching job posting describes a
part-time contract "through Jul 10, 2026", reporting to Ali (`TEAM_LEAD_JOB_DESCRIPTIONS.md:51-55`).
Whether this is still Sohail's role in late October is **unknown**. That's open question 1.

**Caveat on "as actually performed".** The brief asks for the role as it is actually performed.
This document is built from written sources only. Nobody has observed the work or interviewed
Sohail, so how the role is performed day to day is **unknown**. The interview in RESEARCH-4
(`04-manager-interview.md`) is where these rows get confirmed or corrected.

---

## Responsibilities: stays human, proposed transition to AI, or proposed split

Each row is a responsibility named in a source. I added none. The brief's three categories (stays
human / transitions to AI / splits) are kept, but any move to the agent is labelled *proposed*,
because none is approved.

| # | Responsibility | Source | Decision | Reason |
|---|---|---|---|---|
| 1 | Marketing strategy: channels, per-channel hypothesis and KPI, budget allocation | launch brief `:22`, `:69` | **proposed split** | Budget and strategy are decided by Ali and Sohail. The matrix allows an agent to *propose* initiatives from evidence, at most in a supervised pilot (`R6`), with "a human accepting each initiative" (`marketing.json:4897`) |
| 2 | Drafting copy: landing pages, social, blog, newsletter, email | launch brief `:3`, `:26`, `:68` | **proposed transition to AI** | AI already drafts today ("CB drafts"). The matrix rates composition as fully reversible, because nothing it drafts can publish without a separate approval (`marketing.json:2657`) |
| 3 | Copy direction and approval (Marketing Approval) | `03-team-roster.md:30`; launch brief `:59` | **stays human** | "An agent that could approve its own content would dissolve every other control" (`marketing.json:2899`) |
| 4 | Social publishing | launch brief `:41` | **proposed split** | "No auto-posts to LinkedIn. Every social media post is human-approved before publish." The platform enforces a human yes for every public post (`agentAutonomy.ts:123`) |
| 5 | Landing pages: outline and direction (Tejesh builds) | launch brief `:23` | **proposed split** | Drafting and preview can be automated. Publishing is "a published claim about the business", and the generator has "a recorded history of inventing copy nobody wrote" (`marketing.json:3725`) |
| 6 | Email campaigns, including the Mailchimp alumni push | launch brief `:3`, `:28-35` | **stays human** (the send) | Real email is denied to agents by default (`delivery/execution/executionPolicy.ts:33`). Drafting is covered by row 2. **Gap:** the matrix has no email-campaign capability (S7 in [Queries](#queries)) |
| 7 | Campaign approval and go-live | launch brief `:59`; `marketing.json:4669` | **stays human** | "Approving a campaign authorises outbound contact with real people. An agent must never hold that decision" (`marketing.json:4669`) |
| 8 | A/B testing | launch brief `:3` | **unknown** | The matrix covers generating variants (`marketing.json:2657`), not choosing a winner. No source says who decides or how. Open question 3 |
| 9 | Spot-checking auto-generated Build Log posts before they publish | `TEAM_LEAD_JOB_DESCRIPTIONS.md:63` | **stays human** | The spot-check *is* the human gate on auto-generated content. Automating it would remove the gate |
| 10 | Ali's LinkedIn lives, testimonial capture, sequencing viral video | launch brief `:38`, `:47-53` | **stays human** | Coordinating people and their calendars. No matrix capability covers it (S8 in [Queries](#queries)), and nothing in this project authorizes outbound contact |
| 11 | **Recurring marketing performance report: the matrix's one DA item** (campaign ROI, open/reply rates, cost per lead, funnel velocity) | `marketing.json:6406`; `agentRegistrySeed.ts:1678-1686` | **proposed split** | "Composing the report is safe and is the clearest DA task to hand over. Delivering it sends real mail, which is a denied capability" (`marketing.json:6406`, `max_autonomy_rationale`) |
| 12 | Deciding which metrics can be trusted when one is in doubt | `marketing.json:6169` | **stays human** | Human-reserved in the matrix. **Source caveat:** this comes from the matrix, not Sohail's brief, so Sohail has to confirm it's his |
| 13 | Managing the marketing AI employee: restrictions, goals, one-to-ones, approving what it learns | `marketing.json:6278` | **stays human** | A new duty created by having an agent at all. Human-reserved, with a ceiling of `R2`. Blocked today by a 403 until the agent's `reports_to` points at him (`marketing.json:7716`) |

### Where each proposed split falls

| # | Agent's side (proposed) | Human's side | Who holds the human side |
|---|---|---|---|
| 1 | Turns department health signals into proposed initiatives, citing real data. Persists nothing until accepted | Accepting or rejecting each initiative; all budget allocation | Sohail accepts initiatives. Ali decides budget (launch brief `:69`) |
| 4 | Prepares the post and its publishing package in the queue. Zero direct posts to a network | Approving the post, then publishing it | Sohail approves, with Ali for Marketing Approval (`03-team-roster.md:30`). The person who publishes is **unknown**: the launch brief says only "you sequence + distribute" (`:38`) |
| 5 | Drafts each page section from the outline and reports any sentence not in the brief | Publishing the page on a Colaberry domain | Sohail approves the content. Tejesh builds the site (launch brief `:23`) |
| 11 | Composes and previews the period report, naming every figure it can't compute | Choosing recipients and cadence, and sending | Sohail as the report's owner. **Who receives it today is unknown** (open question 2) |

---

## What would show the agent is ready

For every responsibility, or part of one, with a proposed transition. The criteria are the
matrix's own acceptance criteria for each autonomy level. On top of that, the platform refuses
elapsed time, story completion, a good conversation or passing mocked tests as evidence of
readiness (`agentDomain/promotionCriteria.ts:6-11`).

| # | Part proposed to transition | Evidence of readiness | Source |
|---|---|---|---|
| 1 | Proposing strategic initiatives | `R2`: every signal cited resolves to real data, and no initiative or ticket is created. `R6`: no initiative exists that a human did not accept, and the open-ticket count doesn't grow without a named owner | `marketing.json:4897` |
| 2 | Drafting copy | `R4`: an edit after approval always invalidates that approval. `R7`: no item reaches a published state without passing approval, and every edit is attributable | `marketing.json:2657` |
| 4 | Preparing social posts | `R4`: a replayed job never publishes twice, and both failure paths have been exercised. `R5`: zero direct network publications originate from the agent, and every package a human used is recorded against its receipt | `marketing.json:3245` |
| 5 | Drafting landing pages | `R1`: every section of the brief appears, and a count of sentences not in the brief is reported. `R5`: fidelity to the brief is reported per bullet, and no invented detail reaches a published page | `marketing.json:3725` |
| 11 | Composing the recurring report | `R2`: every figure cites its registry key and trust status, and figures it can't compute are named, never zeroed. `R4`: two renders over the same period are identical, and every untrusted metric is excluded from every aggregate and listed | `marketing.json:6406` |

**Before any of these, Sohail has to validate the capability.** All 64 are `draft`
(`marketing.json:7714`). The `R5` and higher criteria also need reference outcomes he has approved,
and none exist yet (see [02](02-agent-anatomy.md), element 9).

---

## Responsibilities that stay human, and why

The table has 11 rows, but they are **not 11 more responsibilities**. They come from the same 13
in the main table:
- the 7 that stay human entirely (rows 3, 6, 7, 9, 10, 12, 13);
- the human side of the 4 proposed splits (rows 1, 4, 5, 11).

Row 2 (a proposed transition) and row 8 (unknown) are not here.

| # | Responsibility | Why it's reserved |
|---|---|---|
| 3 | Marketing Approval of copy | The approval is the control every other gate depends on (`marketing.json:2899`) |
| 4 | Approving and publishing social posts | The platform requires a human yes for every public post (`agentAutonomy.ts:123`), and the launch brief forbids auto-posts (`:41`) |
| 5 | Publishing landing pages | A public claim about the business, from a generator that has invented copy before (`marketing.json:3725`) |
| 6 | Sending email campaigns | Agents are denied real email by default (`executionPolicy.ts:33`) |
| 7 | Approving and launching campaigns | Authorizes contact with real people (`marketing.json:4669`) |
| 9 | Spot-checking Build Log posts | It is the human review gate itself (`TEAM_LEAD_JOB_DESCRIPTIONS.md:63`) |
| 10 | LinkedIn lives, testimonials, video sequencing | Work with people. No capability covers it, and no outbound action is authorized |
| 11 | Sending the recurring report | Real mail is denied to agents (`marketing.json:6406`) |
| 12 | Metric-trust decisions | Human-reserved in the matrix (`marketing.json:6169`) |
| 13 | Managing the marketing agent | Oversight can't be delegated to the thing being overseen (`marketing.json:6278`) |
| 1 | Budget and accepting strategy | Budget is Ali's call (launch brief `:69`). Each initiative needs a human to accept it (`marketing.json:4897`) |

---

## What would have to be written

The DA source material doesn't exist, so the honest deliverable is an outline of the document that
would fill the gap.

**Document:** *Marketing analytics responsibilities (current state)*
**Written by:** Sohail Syed, together with whoever produces marketing reports today. That person is
**unknown**; open question 2.
**Reviewed by:** Ali, who owns budget and strategy decisions (launch brief `:69`).

1. **Each recurring analysis or report produced today:** its name, what it answers, who receives
   it, and how often.
2. **For each one, the sources and steps:** which systems it pulls from (for example, the platform's
   campaign tables, Mailchimp or LinkedIn analytics) and which steps are done by hand.
3. **The decisions each report feeds,** and who makes them.
4. **Which figures are trusted** and which are known to be shaky.
5. **For each duty, a proposed disposition** (stays human / proposed transition / proposed split) using the table
   format above, which turns this outline straight into an update to this document.

Until that document exists, row 11 is the only DA item, and it rests on the matrix's label, not on
a description of real human work.

---

## Assumptions, unknowns and open questions

**Assumptions** (3, each logged):
1. The launch brief still describes Sohail's responsibilities. It's the most detailed source, but it
   was written for June 2026.
2. The Marketing Team Lead job posting (`TEAM_LEAD_JOB_DESCRIPTIONS.md:51-63`) describes Sohail's
   role. The roster confirms he is Marketing Lead (`03-team-roster.md:13`), but the posting itself
   names no one. Only row 9 rests on it.
3. "CB drafts" means AI drafting already happens today, so row 2 is a change of drafter, not a new
   automation. It rests on launch brief `:3` and `03-team-roster.md:23`.

**Open questions for Sohail:**
1. Is the launch-brief scope still your role after the July 10 contract date? What has been added or
   dropped?
2. Who produces marketing reports today, for whom, and how often? This is the missing DA
   information.
3. How are A/B tests decided today, and by whom?
4. Do you want email campaigns, especially the alumni push, covered by the agent at all? The matrix
   has no capability for them.
5. Are metric-trust decisions (row 12) yours?
6. Who presses publish on social posts today: you, or someone else?

**Known gap, not a question:** you can't manage the agent until its `reports_to` points at you
(`marketing.json:7716`). That is an engineering change, not something to decide here.

---

## Sources

Paths are in the platform repo at `b058da6`.

| Claim | Source |
|---|---|
| Sohail is the domain's accountable human | `backend/src/services/agentDomain/agentDomainRegistry.ts:113-125`; `docs/architecture/ai-workforce-management/HUMAN_OWNERSHIP_MAP.md:12`; `marketing.json:3` |
| Sohail is Marketing Lead; CB is the AI execution queue | `docs/training-program-2026-q3/launch-briefs/03-team-roster.md:13`, `:23` |
| Marketing Approval is Ali + Sohail | `03-team-roster.md:30`; launch brief `:59` |
| His scope, "CB drafts; you direct + approve" | launch brief `:3`, `:22-26`, `:28-35`, `:38-53`, `:68-69` |
| No auto-posts | launch brief `:41` |
| Job posting: contract to Jul 10, reports to Ali, Build Log spot-check | `docs/training-program-2026-q3/TEAM_LEAD_JOB_DESCRIPTIONS.md:51-63` |
| `dataAnalystAgent` is deterministic SQL enrichment | `backend/src/intelligence/assistant/agents/dataAnalystAgent.ts:1-5` |
| No DA document in other domains | `backend/src/services/agentDomain/capabilities/executive.json:7266`; `admissions.json:5367` |
| No DA duties anywhere (brief) | `backend/src/services/agentDomain/agentDomainStoryTemplates.ts:168` |
| The one marketing DA capability | `marketing.json:6406` |
| The reporting agent it's based on | `backend/src/services/agentRegistrySeed.ts:1678-1686` |
| Capability records for rows 1–13 | `marketing.json:2657`, `:2899`, `:3245`, `:3725`, `:4669`, `:4897`, `:6169`, `:6278` |
| No capability validated; 403 for Sohail | `marketing.json:7714`, `:7716` |
| Human yes for public posts | `backend/src/services/agentAutonomy.ts:123` |
| Real email denied by default | `backend/src/services/delivery/execution/executionPolicy.ts:33` |
| What doesn't count as readiness | `backend/src/services/agentDomain/promotionCriteria.ts:6-11` |

### Queries

Run from the platform repo root:

```sh
# S1-S3: DA role searches
grep -rli --exclude-dir=node_modules --exclude-dir=.git "data analyst" .
grep -rlw --exclude-dir=node_modules --exclude-dir=.git --include=*.md "DA" .
grep -rn --exclude-dir=node_modules --exclude-dir=.git -i "(DA)\|DA duties\|DA responsibilit\|DA role" --include=*.md --include=*.ts --include=*.json --include=*.js .

# S4: DA-labelled marketing capabilities -> 1
node -e 'const C=require("./backend/src/services/agentDomain/capabilities/marketing.json").capabilities;console.log(C.filter(c=>/\bDA\b|data analyst/i.test(c.name+c.source+c.business_outcome)).map(c=>c.capability_id))'

# S7: email / Mailchimp / newsletter capabilities -> none
node -e 'const C=require("./backend/src/services/agentDomain/capabilities/marketing.json").capabilities;console.log(C.filter(c=>/email|mailchimp|newsletter|sequence/i.test(c.capability_id+" "+c.name)).length)'

# S8: capabilities covering lives / testimonials / video / podcasts -> 1, a false positive:
#     intelligence_card_generation, where "video" is a content stream, not Ali's lives or testimonials
node -e 'const C=require("./backend/src/services/agentDomain/capabilities/marketing.json").capabilities;console.log(C.filter(c=>/testimon|webinar|livestream|linkedin live|video|calendar coordinat|podcast/i.test(c.capability_id+" "+c.name+" "+c.business_outcome)).map(c=>c.capability_id))'
```
