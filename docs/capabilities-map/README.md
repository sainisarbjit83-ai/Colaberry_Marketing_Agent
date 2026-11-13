# Capabilities map

The system-level view of the Colaberry Marketing Agent: where the project is going, what the agent
could do, what it would need, and what stays with people.

**Created:** November 11, 2026. Read [MASTER-ROADMAP.md](MASTER-ROADMAP.md) first.

## Files

| File | Answers |
|---|---|
| [MASTER-ROADMAP.md](MASTER-ROADMAP.md) | Why the project exists, every existing story and its status, proposed future stories, dependencies and decisions still needed |
| [capability-inventory.md](capability-inventory.md) | Every capability, sorted into discovered, proposed, approved, built, tested, blocked and human-reserved |
| [capability-to-tool-mapping.md](capability-to-tool-mapping.md) | Which tools each capability needs, its story, and its current status |
| [human-approval-boundaries.md](human-approval-boundaries.md) | What a person must approve or do, and the governance rules already in force |

## Where the facts come from

| Source | What it supplies | Owner |
|---|---|---|
| `.colaberry/plan.json` | Stories, releases, schedule | Platform (synced) |
| `.colaberry/progress.json` | Acceptance criteria, ticks, platform verification state | Platform and us (co-owned) |
| `.colaberry/agent-domain.json` | The agent record, effective authority, ceilings, governance queue | Platform (synced) |
| Platform capability record, `backend/src/services/agentDomain/capabilities/marketing.json` | Implementation state, validation state, blockers, required tools, human decisions | Platform repo (read only), unchanged since October 23, 2026 |
| Ali's brief, `brand-campaign-challenge.md` | The First Build Challenge direction: run two campaigns by hand, then build tools | Ali. **Not currently stored in this repository**; summarized in [../marketing-campaign-challenge/01-project-overview.md](../marketing-campaign-challenge/01-project-overview.md) |
| [../marketing-campaign-challenge/](../marketing-campaign-challenge/README.md) | The brand research and open questions | Us |
| [../discovery/](../discovery/01-system-classes.md) and [../migration/](../migration/legacy-migration-plan.md) | Completed research stories | Us |

All figures were read on November 11, 2026, from repository commit `805e3ed` and platform commit
`04d10f464`. When the platform syncs, these files can go out of date; the sources above win.

## Labels

Platform states use the platform's own words (`verified`, `in_progress`, `draft`, `implemented`,
`partial`, `absent`). Roadmap statuses are one of **Completed**, **In Progress**, **Blocked**,
**Proposed** and **Awaiting Approval**, each defined in plain words in
[MASTER-ROADMAP.md](MASTER-ROADMAP.md#how-to-read-the-statuses). Anything not confirmed is marked
**UNKNOWN**. Proposed items are proposals, not approved commitments. The marketing content rules
are kept in full in one place: [human-approval-boundaries.md](human-approval-boundaries.md#marketing-content-rules-authoritative-copy).
