# marketing.CAP.banned_copy_compliance_scanning — Banned-copy compliance scanning across source

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

The word Colaberry is legally barred from advertising cannot appear anywhere a prospect can read it - including React source the composer never sees - so a statutory rule is enforced rather than remembered.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- manager has not validated the banned word list beyond the statutory term already encoded

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Banned-copy compliance scanning across source
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.banned_copy_compliance_scanning`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** existing_application
## The business outcome
The word Colaberry is legally barred from advertising cannot appear anywhere a prospect can read it - including React source the composer never sees - so a statutory rule is enforced rather than remembered.
Intended users: Marketing manager, Marketing AI employee, Compliance owner.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Parse the source with the real TypeScript parser rather than a regex
- Separate user-facing copy from comments, identifiers and route strings
- Report an occurrence in user-facing copy as a violation
- Account for every other occurrence by name rather than discarding it
- Compare against the baseline so a new occurrence fails rather than blending in
**Inputs**
- TypeScript and TSX source as strings
- The banned word list
- A known-occurrence baseline
**Outputs**
- Located occurrences in user-facing copy
- An accounted-for list of every other occurrence
- A baseline diff that fails when a new occurrence appears
**Exceptions that must be handled**
- A regex approach was rejected because a parser with holes is a silent pass, and the repo has a recorded case of a lint whose pattern reported all-green while a live job matched nothing
- The design principle is completeness, not a better pattern: unclassified occurrences are listed, never dropped
- Brand governance can only see composer content, which is why this exists as the other half
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- repository_source_read
- ast_parse
**Application surfaces**
- none - this runs as a source-level check, not a screen
- none - invoked from the test and validation layer
**Source modules**
- backend/src/services/content/bannedCopyScanner.ts
- backend/src/services/content/frontendCopyBaseline.ts
**Dependencies**
- marketing.brand_governance_enforcement
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R9**.
Why that ceiling: A pure, deterministic source scan with no write and no outbound action, whose whole purpose is to keep a statutory rule continuously true. Operational ownership is the correct destination.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Answers where a banned term currently appears and in what role.

Acceptance: Every occurrence is classified; none is reported without its role.
## Before you start
- manager has not validated the banned word list beyond the statutory term already encoded
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/content/bannedCopyScanner.ts:6
- backend/src/services/content/bannedCopyScanner.ts:13
- backend/src/services/content/bannedCopyScanner.ts:21
- backend/src/services/content/frontendCopyBaseline.ts
- backend/src/services/agents/skool/skoolPlatformStrategy.ts:81

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Every occurrence is classified; none is reported without its role.

When every box above is ticked, stop and show the demo.
