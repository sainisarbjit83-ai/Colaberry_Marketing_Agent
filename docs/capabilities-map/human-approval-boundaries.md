# Human approval boundaries

What a person must approve or do in the Colaberry Marketing Agent project, and the governance
rules already in force. This file **records** existing decisions; it changes none of them, and
no autonomy, permission or tool grant is changed by it.

**Recorded:** November 11, 2026.

## The core rule

**Ava drafts. A person approves. A person publishes.**

("Ava" is the name Ali's First Build Challenge uses for this domain's AI employee; it is not the
registered platform agent name. See [MASTER-ROADMAP.md](MASTER-ROADMAP.md), section 1.)

Source: Ali's First Build Challenge, "The agent drafts. A person approves. The person posts.
Nothing in this challenge publishes on its own. That boundary is not a limitation to engineer
around, it is the design." (summarized in
[../marketing-campaign-challenge/01-project-overview.md](../marketing-campaign-challenge/01-project-overview.md)).

## Who decides what

| Decision | Who | Source |
|---|---|---|
| Direction of the first build (brand campaigns before automation) | Ali | The challenge brief |
| Validating a capability's scope, exceptions and success measures (moving it out of `draft`) | Sohail Syed, the domain's accountable human | Platform capability record (`validation_dependency`); [../discovery/03-role-and-da-transition.md](../discovery/03-role-and-da-transition.md) |
| Closing `marketing.STORY-000` | Sohail Syed, against the page itself | [../stories/marketing.STORY-000.md](../stories/marketing.STORY-000.md), "Who closes this story" |
| Promoting the agent's autonomy | A named human, one rung at a time, on evidence | [../stories/marketing.STORY-000.md](../stories/marketing.STORY-000.md), "Finishing work does not promote anything" |
| Granting any tool | A human approves a filed tool request; filing grants nothing | [../stories/marketing.STORY-000.md](../stories/marketing.STORY-000.md); platform snapshot `governance.disclosure` |
| Approving the two Phase 1A brand profiles | **UNKNOWN**: open question 13 | [../marketing-campaign-challenge/04-open-questions-and-decisions.md](../marketing-campaign-challenge/04-open-questions-and-decisions.md) |
| Posting campaign content (Phase 1D) | A person, by hand; which accounts is **UNKNOWN** (open question 11) | the brief; the same open-questions file |

## The autonomy ladder, in plain English

The platform measures how much a capability may do on its own with a ladder of ten rungs, from
**R0** to **R9**:

- **R0 is where every capability is today.** At R0 the agent's job is to help define the work:
  the workflow, the requirements, the risks and which decisions belong to people. It acts on
  nothing.
- **Each higher rung adds authority**, step by step: from answering questions using approved
  knowledge, to working in a sandbox, to shadow testing, to a supervised production pilot, and
  only at the top to automating explicitly authorized actions and owning ongoing operation.
- **A ceiling** (`max_permitted_autonomy`) is the highest rung a capability may ever reach. It is
  a decision someone made, with a recorded reason, not a target and not a grant.
- **A capability cannot go above its approved ceiling.** It also never moves up on its own: a
  named human promotes it one rung at a time, on evidence.
- **All 64 capabilities remain at `autonomy:R0` today**, whatever their ceiling.

The exact wording of all ten rungs, and the platform rules behind them, are in
[../stories/marketing.STORY-000.md](../stories/marketing.STORY-000.md) (panel "3. The autonomy
ladder", under "The six panels, and the question each one answers", and the section "The rules
this page must not break"). Each capability's ceiling is listed in
[capability-inventory.md](capability-inventory.md). The rules below are unchanged by this summary.

## Rules the platform enforces or states

| Rule | What it means | Source |
|---|---|---|
| Effective authority, not requested authority | What applies is what `effectiveAuthority()` returns | platform `autonomyLadder.ts`; panel 3 of the Command Center |
| `no_tool_grants` | A capability approved above R2 with no granted tools is held at R2 | platform `autonomyLadder.ts` |
| Human decisions stay human | A capability with `human_decision: true` keeps that requirement at every level and is capped at R5 | platform `autonomyLadder.ts` |
| Production needs a separate pilot approval | Reaching R6 or above in production is not granted by approval alone | platform `autonomyLadder.ts` |
| R8 is unreachable by fact | Agent-to-agent handoff does not exist in this platform today | [../stories/marketing.STORY-000.md](../stories/marketing.STORY-000.md) |
| Finishing work promotes nothing | A story marked complete, elapsed time, a good conversation or a mocked test passing never raises autonomy (`NON_PROMOTING_SIGNALS`) | [../stories/marketing.STORY-000.md](../stories/marketing.STORY-000.md) |
| Draft is not approved | No capability is agreed until its accountable human validates it | [../stories/marketing.STORY-000.md](../stories/marketing.STORY-000.md) |

## Current state (as recorded, not changed)

From `.colaberry/agent-domain.json` and the platform capability record, read November 11, 2026:

- The agent exists and is **disabled**, at agent-level autonomy `observe`, with **0 tools granted**.
- All **64** capabilities have effective authority **`autonomy:R0`** and are **`draft`**.
- **28** capabilities are human decisions at every level (see
  [capability-inventory.md](capability-inventory.md)).
- The governance queue has **0** requests: no tool or change has been asked for.

## Existing boundaries already documented

These were verified earlier and are not repeated here:

- What each proposed agent task must NOT do:
  [../discovery/05-three-proposed-tasks.md](../discovery/05-three-proposed-tasks.md) ("Must NOT do (boundary)" under each task).
- Whether the platform actually enforces write permissions and the post-approval boundary:
  [../discovery/05-three-proposed-tasks.md](../discovery/05-three-proposed-tasks.md), sections
  "Write-permission enforcement (verified 2026-10-28)" and "Task 3 approval boundary (verified 2026-10-28)".
- Responsibilities that stay human, and why:
  [../discovery/03-role-and-da-transition.md](../discovery/03-role-and-da-transition.md).
- The R2 read-only boundary proposed for social signal discovery (not approved by Sohail):
  [../discovery/social-signal-discovery-audit.md](../discovery/social-signal-discovery-audit.md).

## Marketing content rules (authoritative copy)

**This section is the authoritative statement of the content rules** for this documentation set.
Other files in `docs/capabilities-map/` and `docs/artifacts/` link here instead of repeating them.
Source: Ali's challenge brief ("Rules the compliance check must enforce"), which is not stored in
this repository (see [MASTER-ROADMAP.md](MASTER-ROADMAP.md), section 4). Earlier documents in
[../marketing-campaign-challenge/](../marketing-campaign-challenge/README.md) also list them; if
the wording ever differs, this section and the brief take precedence.

Every draft must pass these before a person approves it:

- Never use "free" in anything advertising training (Texas Workforce Commission rule 807.172(d)).
- No claim without evidence. A number with no source does not ship.
- American spelling.
- No em dashes or en dashes.

The live training site already breaks the first two rules in places; see
[../marketing-campaign-challenge/02-colaberry-brand-research.md](../marketing-campaign-challenge/02-colaberry-brand-research.md),
section 4. Nothing on any live site has been changed.
