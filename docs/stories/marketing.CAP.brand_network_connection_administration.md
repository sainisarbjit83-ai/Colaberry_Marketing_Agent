# marketing.CAP.brand_network_connection_administration — Brand network connection administration

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

The marketing team can put a brand on a new network themselves, and everyone knows whose profile a brand's posts will appear under.

**Built today:** partial. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- secret_exfiltration (the agent must never see the resulting credential)
- the person whose profile is bound must consent
- manager has not confirmed which colleague's profile should carry which brand

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Brand network connection administration
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.brand_network_connection_administration`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** partial · **Source:** manager_defined
## The business outcome
The marketing team can put a brand on a new network themselves, and everyone knows whose profile a brand's posts will appear under.
Intended users: Marketing manager, Marketing AI employee.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Open the brand in the admin Brands page
- Click connect for the network and complete the network's own approval
- Confirm the returned row shows the profile name and the granted scopes
- If the posting scope appears under missing, disconnect and connect again
- Record that this brand's posts now publish from this profile
**Inputs**
- A registered developer app per network
- The manager's or a colleague's own network sign-in
- The exact redirect URL for that network
**Outputs**
- A connected account bound to a brand
- A clear record of which profile a brand publishes from
- A scope-gap warning where posting permission was declined
**Exceptions that must be handled**
- Connecting is explicitly not the same as posting: a connected account still hands off until that network's adapter is switched on
- If two people connect, the most recently connected profile is used, and the composer's confirmation screen names which one before every publish
- The connecting must be done on the public marketing host, not the enterprise host, because the networks return the browser there and sign-ins are per host
- As of the recorded state, direct posting is built for LinkedIn personal and company, Facebook Pages and Instagram, but switched on only for LinkedIn personal
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- oauth_connect_flow_initiate
**Application surfaces**
- /admin/marketing/brands
- GET /api/admin/marketing/connectors
- POST /api/admin/marketing/connect/:connector
- POST /api/admin/channel-accounts
**Source modules**
- backend/src/services/marketing/oauth
- backend/src/routes/marketingOAuthCallbackRoutes.ts
**Dependencies**
- marketing.channel_account_connection_and_credential_custody
- marketing.platform_app_review_and_representation
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R2**.
Why that ceiling: Binding a named person's social identity to a brand's publishing path is a consent decision by that person, not an operation. The agent's useful role is explaining what each network needs and reporting the result; the connecting stays human.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R2)**
Explains what a given network requires and which brands still need connecting.

Acceptance: Requirements match the recorded runbook; no flow is initiated and no credential is read.
## Before you start
- secret_exfiltration (the agent must never see the resulting credential)
- the person whose profile is bound must consent
- manager has not confirmed which colleague's profile should carry which brand
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- docs/marketing/LINKEDIN_GO_LIVE.md:44
- docs/marketing/LINKEDIN_GO_LIVE.md:52
- docs/marketing/CONNECT_NETWORKS.md:1
- docs/marketing/CONNECT_NETWORKS.md:9
- docs/marketing/CONNECT_NETWORKS.md:24
- docs/marketing/APP_REVIEW_META.md:10
- backend/src/routes/admin/channelAccountRoutes.ts:159

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Requirements match the recorded runbook; no flow is initiated and no credential is read.

When every box above is ticked, stop and show the demo.
