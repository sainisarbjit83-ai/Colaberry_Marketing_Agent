# Social Signal Discovery: agent architecture (design only)

Architecture, component plan, roadmap and validation plan for the agent version of the
`marketing.social_signal_discovery` capability ("Public-platform buying-signal discovery") in the
Colaberry Marketing Intelligence & Lead Generation Agent project.

**Prepared:** November 20, 2026.

> **Status: design only. Nothing here is built, approved or authorized.** No executable agent code
> exists for this design. No tool is granted, no autonomy is raised, and the domain has no build
> authorization. Every component marked Proposed is a proposal for Sohail Syed (accountable human)
> and Ali to decide on.
>
> A separate local-only hybrid demo exists alongside this design to demonstrate the proposed
> 13-component architecture; it is not production agent code and does not implement or authorize
> this production design.

## Restrictions in force (recorded, not changed)

From `.colaberry/agent-domain.json` (read November 20, 2026) and Ali's L1 authorization:

| Item | Current state |
|---|---|
| Agent record | Exists (`cf617c6d…`), **disabled**, agent-level autonomy `observe` |
| Tools granted | **0** |
| Capability effective authority | `autonomy:R0` (ceiling `autonomy:R7`) |
| Governance requests filed | 0 |
| Build authorization for the domain | **None** |
| L1 research | Ali authorized **manual, read-only** research on Reddit, Hacker News, Dev.to, Hashnode, Discourse, Bluesky, YouTube and Product Hunt. X, LinkedIn comments and Facebook Groups are excluded |
| Not allowed | Automated scans, unauthorized API calls, outreach, publishing, production database writes |

## Files

| File | Answers |
|---|---|
| [01-agent-architecture.md](01-agent-architecture.md) | How the 13 components fit together; the architecture diagram; what exists versus what is proposed |
| [02-component-implementation-matrix.md](02-component-implementation-matrix.md) | Each of the 13 components in detail, and how they map to the nine-element agent anatomy |
| [03-dependencies-and-roadmap.md](03-dependencies-and-roadmap.md) | Which components depend on which; implementation phases; the gates at L1, L2, L3, build authorization and L4 |
| [04-l1-l2-validation-plan.md](04-l1-l2-validation-plan.md) | What the L1 and L2 stories must prove, quoted criteria, the proposed R2 test design, and open decisions |

## Status labels

| Label | Meaning |
|---|---|
| **Existing and verified** | Exists today and has been checked (by a test, a platform record or a code reading cited in the linked evidence) |
| **Proposed** | A design suggestion. Not built, not approved |
| **Requires investigation** | Not enough is known to propose a design; facts must be gathered first (often at L1 or L2) |
| **Pending approval** | A decision by a named human (Sohail, Ali or a tool-request approver) is needed before anything can proceed |

A component can have parts in different states, for example an existing platform rule plus a
proposed addition. The matrix says which part is which.

## Builds on, does not repeat

| Existing document | What this folder takes from it |
|---|---|
| [../../discovery/02-agent-anatomy.md](../../discovery/02-agent-anatomy.md) | The nine-element anatomy and its evidence; the 13 components are mapped onto it. Note: that document (October 23, 2026) records the domain's `agent_id` as null; the snapshot now shows an agent record, disabled |
| [../../discovery/01-system-classes.md](../../discovery/01-system-classes.md) | The recommendation this design follows: **a tool-using agent, inside fixed workflows** |
| [../../discovery/social-signal-discovery-audit.md](../../discovery/social-signal-discovery-audit.md) | How the existing scanner works, the **proposed R2 read-only path** (not approved by Sohail) and its **validation test specification** |
| [../../discovery/05-three-proposed-tasks.md](../../discovery/05-three-proposed-tasks.md) | Verified findings on write-permission enforcement and the approval boundary |
| [../../capabilities-map/human-approval-boundaries.md](../../capabilities-map/human-approval-boundaries.md) | The governance rules: the autonomy ladder, `effectiveAuthority()`, `no_tool_grants`, human-decision caps |
| The four stories, `docs/stories/marketing.CAP.social_signal_discovery.L1-BY-HAND.md` to `.L4-AGENT-WATCHED.md` | The ladder this design must pass, and its acceptance criteria (quoted, never changed) |

## Where private material lives

The L1 research worksheet, signal register and run log are kept **outside this public
repository**, in a local working folder. They contain public usernames and links found during
research. This folder describes them but never copies their contents.

## Writing rules

American spelling, no em dashes or en dashes, times in Central. Full rules:
[../../capabilities-map/human-approval-boundaries.md](../../capabilities-map/human-approval-boundaries.md#marketing-content-rules-authoritative-copy).
