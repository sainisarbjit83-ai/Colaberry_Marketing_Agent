# marketing.CAP.channel_account_connection_and_credential_custody — Social channel connection and credential custody

**CANDIDATE -- not started, not assigned.** This is one line on this domain's list of everything its agent could eventually do. It becomes real work only when the builder picks it and their manager agrees, at which point it opens as four stories. Until then it is deliberately inert, and the honest status of it is "not started" rather than "behind".

A brand's social accounts can be connected, rotated and revoked through one screen, with the tokens sealed in a vault, so publishing is possible without anyone handling a raw credential.

**Built today:** implemented. **Requirement validated:** draft -- Sohail Syed must confirm scope, exceptions and success measures

**Blocked by**
- secret_exfiltration (an agent must never read a sealed credential; only the single scoped accessor may)
- manager and the profile owner must each consent to the binding
- manager has not validated which profiles may be bound to which brand

Full build prompt is attached to this story.

**Release:** autonomy:R0 · Legacy migration plan (weeks 0–0)
**Owner:** 
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

_No requirement linked._

## How to build it

# Social channel connection and credential custody
**Domain:** Marketing Intelligence & Brand · **Capability:** `marketing.channel_account_connection_and_credential_custody`
**Accountable human:** Sohail Syed · **Validation state:** draft
**Built today:** implemented · **Source:** existing_application
## The business outcome
A brand's social accounts can be connected, rotated and revoked through one screen, with the tokens sealed in a vault, so publishing is possible without anyone handling a raw credential.
Intended users: Marketing manager, Marketing AI employee, Security owner.
## The human-operable process, as it works now
This must be operable by a person before an agent touches it. If a human cannot do it by hand
against the surfaces below, the agent version has nothing to stand on.
**Workflow**
- Start the network's OAuth flow from the Brands page for the selected brand
- Receive the callback on the registered redirect URL for that provider
- Seal the credential into the vault, refusing outright if the vault is unavailable
- Record the account, its scopes and its expiry
- Expose health - revoked, expired, unhealthy, unselected, expiring, ok - and let an operator rotate or revoke
**Inputs**
- An OAuth authorisation from the network
- The credential vault master key
- The provider's scope requirements
**Outputs**
- A connected account row with a health state
- A sealed credential readable only through one accessor
- A scope-gap warning when a required permission was declined
**Exceptions that must be handled**
- There is no plaintext fallback: if the vault is unavailable, connecting refuses rather than storing a bare token, leaving the product in its known-good handoff state
- A secret enters only through connect or rotate and leaves only through one accessor, so the escape surface is three greppable call sites
- Whoever connects their personal profile is whose profile that brand's posts publish from
## The tool interface
**Tools this capability requires** (none is one of the eight default-denied capabilities;
anything that would need one is listed under blockers instead)
- read_marketing_database
- oauth_connect_flow_initiate
- credential_vault_read_scoped
**Application surfaces**
- /admin/marketing/brands
- /admin/marketing (Overview, account health)
- GET /api/admin/channel-accounts
- GET /api/admin/channel-accounts/status
- POST /api/admin/channel-accounts
- POST /api/admin/channel-accounts/:id/credentials
- DELETE /api/admin/channel-accounts/:id
- POST /api/admin/channel-accounts/:id/select
- GET /api/admin/marketing/connectors
- POST /api/admin/marketing/connect/:connector
**Source modules**
- backend/src/services/marketing/channelAccountService.ts
- backend/src/services/marketing/linkedInOAuth.ts
- backend/src/services/marketing/oauth
**Dependencies**
- Credential vault master key
- Network developer apps registered per platform
- marketing.platform_app_review_and_representation
## The agent behaviour that uses it
Starting autonomy **autonomy:R0**; ceiling **autonomy:R2**.
Why that ceiling: Connecting an account binds a real person's social identity to the platform's publishing path, and the credential is a secret. The agent's share of this is reading health only; the connect, rotate and revoke actions stay with a named human at every level.

**THIS IS A HUMAN DECISION.** It stays human-required at every autonomy level, forever. An
agent may prepare, summarise and propose; it may never decide. No amount of evidence
promotes this into automation.
**First release behaviour (autonomy:R2)**
Reports which accounts are connected, expiring or revoked, and what each is missing.

Acceptance: No credential value appears in any output or log; health verdicts match the stored expiry.
## Before you start
- secret_exfiltration (an agent must never read a sealed credential; only the single scoped accessor may)
- manager and the profile owner must each consent to the binding
- manager has not validated which profiles may be bound to which brand
## Evidence this is done
Cite the real thing: a named passing test, a measured figure with its query, or a file:line.
**None of these count:** this story being marked complete, elapsed time, a conversation that
went well, or a mocked test passing. Sohail Syed evaluates the evidence, and
nothing here is validated yet.
## Evidence this capability rests on
- backend/src/services/marketing/channelAccountService.ts:15
- backend/src/services/marketing/channelAccountService.ts:23
- backend/src/services/marketing/overviewHealth.ts:19
- backend/src/routes/admin/channelAccountRoutes.ts:159
- backend/src/routes/admin/channelAccountRoutes.ts:197
- backend/src/routes/admin/channelAccountRoutes.ts:218
- backend/src/routes/admin/marketingConnectRoutes.ts:43
- backend/src/routes/marketingOAuthCallbackRoutes.ts
- frontend/src/pages/admin/marketing/ChannelAccountsPanel.tsx
- frontend/src/pages/admin/marketing/ConnectNetworks.tsx
- table: marketing_channel_accounts
- docs/marketing/CONNECT_NETWORKS.md:24

## Failure paths you must handle


## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] No credential value appears in any output or log; health verdicts match the stored expiry.

When every box above is ticked, stop and show the demo.
