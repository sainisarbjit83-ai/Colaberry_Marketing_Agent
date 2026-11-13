# Story artifacts

The permanent record of every completed story in the Colaberry Marketing Agent project: what was
asked, what was built or written, how it was validated, what was decided, and what is still open.

**Created:** November 11, 2026. **No per-story folder exists yet.** This file defines the
structure and lists which stories qualify; the folders are added only when a story's evidence is
gathered, not before.

## What counts as completed

A story is completed only when **both** are true, matching the definition of done in this
repository's `CLAUDE.md` ("When you finish a story"):

1. Every acceptance criterion passes, with evidence, in `.colaberry/progress.json`.
2. The platform has recorded it as verified (`stories[].verification.state` is `verified`).

Ticked criteria without platform verification are **not** completed; such a story is
**Awaiting Approval**. The five roadmap statuses are defined in
[../capabilities-map/MASTER-ROADMAP.md](../capabilities-map/MASTER-ROADMAP.md#how-to-read-the-statuses).
Nothing is moved into this folder on intent, and no completion evidence is written that does not
already exist.

## Folder structure (one folder per completed story)

```
docs/artifacts/
  <story-id>/
    story-summary.md          the story as asked: id, title, release, acceptance criteria verbatim
    implementation-notes.md   what was built or written, with file paths and commit hashes
    validation-results.md     test results, platform verification record, reviewer sign-off
    decisions.md              decisions made during the story, who made them, and when
    outstanding-questions.md  anything left open when the story closed
```

Include a file only when it applies; a research story may have no implementation notes. Every
statement links to its evidence (a file, a commit, a test result or a platform record).

## Stories and their artifact status (as of November 11, 2026)

Status is read from `.colaberry/progress.json` at commit `805e3ed`.

| Story | Platform state | Qualifies for an artifact folder | Existing evidence (not yet moved) |
|---|---|---|---|
| `marketing.RESEARCH-1-SYSTEM-CLASSES` | verified | Yes | [../discovery/01-system-classes.md](../discovery/01-system-classes.md) |
| `marketing.RESEARCH-2-AGENT-ANATOMY` | verified | Yes | [../discovery/02-agent-anatomy.md](../discovery/02-agent-anatomy.md) |
| `marketing.RESEARCH-3-ROLE-AND-DA-TRANSITION` | verified | Yes | [../discovery/03-role-and-da-transition.md](../discovery/03-role-and-da-transition.md) |
| `marketing.RESEARCH-4-MANAGER-INTERVIEW` | verified | Yes | [../discovery/04-manager-interview.md](../discovery/04-manager-interview.md) |
| `marketing.RESEARCH-5-THREE-PROPOSED-TASKS` | verified | Yes | [../discovery/05-three-proposed-tasks.md](../discovery/05-three-proposed-tasks.md) |
| `marketing.LEGACY-MIGRATION-PLAN` | verified | Yes | [../migration/legacy-migration-plan.md](../migration/legacy-migration-plan.md) |
| `marketing.STORY-000` | in_progress | **Not yet.** All 6 criteria are ticked in our file, but the platform record still shows 0 of 6 and no verification | [../stories/marketing.STORY-000.md](../stories/marketing.STORY-000.md), the Command Center (`index.html`, `assets/`), tests in `tests/command-center/` |
| 64 `marketing.CAP.*` stories | in_progress (63), none recorded (1) | No. 0 criteria passed on any | see [../capabilities-map/capability-inventory.md](../capabilities-map/capability-inventory.md) |

The existing documents stay where they are. Whether to move or copy them into artifact folders is
a separate decision (see [../capabilities-map/MASTER-ROADMAP.md](../capabilities-map/MASTER-ROADMAP.md),
"Decisions required").

## Rules

- Never claim a story is complete without the two conditions above.
- Copy acceptance criteria verbatim from `progress.json`; do not paraphrase them.
- Record times in Central time, as `CLAUDE.md` requires.
- Follow the Colaberry writing rules, kept in full in
  [../capabilities-map/human-approval-boundaries.md](../capabilities-map/human-approval-boundaries.md#marketing-content-rules-authoritative-copy).
