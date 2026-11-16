# marketing.CAP.outreach_post_verification — Published-comment visibility verification

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

A comment the system believes it posted is checked to be genuinely publicly visible, so shadow-banned or silently removed content is discovered rather than counted as reach.

**Built today:** partial. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- Only two platforms have a verifier; the rest must report unknown rather than visible
- manager has not validated what to do when a post is found missing

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Published-comment visibility verification
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.outreach_post_verification`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** partial · **Source:** existing_application
## The business outcome
A comment the system believes it posted is checked to be genuinely publicly visible, so shadow-banned or silently removed content is discovered rather than counted as reach.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Take a response marked posted and its recorded URL
- Fetch the public view of that URL through the platform's read API
- Look for the comment we believe we left
- Record whether it is actually visible
- Expose a bulk audit so a whole backlog can be checked at once
**Inputs**
- Responses marked posted with a stored URL
- Public read APIs for the platform in question
**Outputs**
- A verified / not-visible verdict per posted response
- An audit result across all posted URLs
**Exceptions that must be handled**
- Only Dev.to and Hashnode have an implemented verifier today; other platforms cannot be verified at all
- A verification failure is evidence of absence only where a verifier exists - elsewhere the correct state is unknown, not visible
- A removed comment cannot be distinguished from a deleted parent thread
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- platform_public_api_read_allowlisted
- read_marketing_database
- sandbox_database_write
**Application surfaces**
- /admin/intelligence (Outreach tab, Task Queue)
- GET /api/admin/openclaw/responses/:id/verify
- POST /api/admin/openclaw/responses/audit-urls
- POST /api/admin/openclaw/responses/verify-all-posted
**Source modules**
- backend/src/services/agents/openclaw/openclawCommentVerificationService.ts
**Dependencies**
- marketing.outreach_reply_publication
- Public platform read endpoints
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R7**.
Why that ceiling: Verification is a read followed by an internal flag. The ceiling sits below full ownership because coverage exists for only two platforms, so the capability cannot honestly claim to verify the estate.

Not a human-reserved decision, but promotion is still evidence-based and one step at a time.
**First release behaviour (autonomy:R2)**
Reports which posted responses have been verified and which cannot be.

Acceptance: Unverifiable platforms are reported as unknown, never as verified or as zero.
## Before you start
- Only two platforms have a verifier; the rest must report unknown rather than visible
- manager has not validated what to do when a post is found missing
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/agents/openclaw/openclawCommentVerificationService.ts:103
- backend/src/services/agents/openclaw/openclawCommentVerificationService.ts:14
- backend/src/routes/admin/openclawRoutes.ts:421
- backend/src/routes/admin/openclawRoutes.ts:466
- backend/src/routes/admin/openclawRoutes.ts:498
- table: openclaw_responses

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Unverifiable platforms are reported as unknown, never as verified or as zero.

When every box above is ticked, stop and show the demo.
