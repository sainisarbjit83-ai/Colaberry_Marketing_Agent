/*
 * The six STORY-000 panels (docs/stories/marketing.STORY-000.md), shown on the Overview.
 *
 * Every value comes from .colaberry/agent-domain.json: the platform's committed snapshot of three
 * signed-in admin endpoints (platform agentDomainSnapshot.ts). Each panel names the endpoint its
 * part of the snapshot came from, and says in words whether it is loading, empty, missing or
 * invalid. A field the snapshot does not carry is labelled, never filled with an example.
 *
 * Sample mode never reaches these panels: they show real data or say why they cannot.
 */
window.CC = window.CC || {};

(function () {
  const { h, arr, orNotSet, central, detailRow, RUNGS } = CC.ui;
  const SNAP = () => CC.FILES.agentDomain;
  const HUMAN = 'human_decision_required_at_every_level';
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  /** What the story asks for that the public snapshot does not carry. */
  const NOT_IN_SNAPSHOT = [
    'classification', 'implementation_state', 'requirement_validation_state', 'starting_autonomy',
    'max_permitted_autonomy (each ceiling) and the reason for it', 'human_decision as its own field',
    'release_behaviour[] (per-rung behaviour and its acceptance criteria)',
  ];

  // Endpoint names from the story brief, used only to say what WOULD have been read when the
  // snapshot that names them did not load.
  const EXPECTED = {
    agent: () => 'GET /api/admin/agent-domains-mine',
    capabilities: (data) => `GET /api/admin/agent-domains/${(data.plan && data.plan.project && data.plan.project.name) || '<domain>'}`,
    governance: () => 'GET /api/admin/agent-domain-change-requests-mine',
  };

  function endpoint(data, key) {
    const named = data.agentDomain && data.agentDomain.sources && data.agentDomain.sources[key];
    if (named) return named;
    const loading = data.status && data.status.agentDomain === 'loading';
    return `${EXPECTED[key](data)} (expected: the snapshot that names it ${loading ? 'is still loading' : 'did not load'})`;
  }

  function sourceFor(data, keys) {
    const age = CC.dataAge(data.manifest);
    const when = age ? `last changed ${age.absolute}` : 'last-changed time unknown (no manifest generated_at)';
    return `Endpoint read: ${keys.map((k) => endpoint(data, k)).join('; ')}. Via ${SNAP()}, the platform’s committed snapshot, ${when}.`;
  }

  const STATE_LABEL = { loading: 'Loading', loaded: 'Loaded', empty: 'Empty', missing: 'Missing', invalid: 'Invalid' };

  function panel(n, title, question, result, source) {
    const { state, body } = result;
    return h('section', { class: `panel is-${state}`, 'data-state': state, 'aria-busy': state === 'loading' ? 'true' : null, 'aria-labelledby': `panel-${n}` },
      h('div', { class: 'panel-head' },
        h('h3', { id: `panel-${n}` }, `${n}. ${title}`),
        h('span', { class: 'state-badge' }, STATE_LABEL[state])),
      h('p', { class: 'muted' }, question),
      body,
      h('p', { class: 'source' }, source));
  }

  /** The snapshot file itself did not load: say which way, and show nothing from it. */
  function fileProblem(data, state) {
    if (state === 'loading') return h('p', { class: 'loading-text' }, `Loading: waiting for ${SNAP()}. Nothing is shown until it arrives.`);
    const err = arr(data.errors).find((e) => e.startsWith(SNAP())) || `${SNAP()} did not load`;
    if (state === 'empty') return h('p', { class: 'empty' }, `Nothing returned: ${err}. There is no data for this panel.`);
    if (state === 'missing') return h('p', { class: 'empty' }, `Not loaded: ${err}. Nothing from it is shown, and no figure is filled in.`);
    return h('p', { class: 'empty' }, `Not usable: ${err}. Nothing from it is shown.`);
  }

  const invalid = (section) => ({ state: 'invalid', body: h('p', { class: 'empty' }, `Not usable: ${SNAP()} has no valid ${section} section. Nothing from it is shown.`) });

  /** Run a panel body only when the snapshot loaded; otherwise report the file's own state. */
  function resolve(data, build) {
    const fileState = (data.status && data.status.agentDomain) || 'loading';
    return fileState === 'loaded' ? build(data.agentDomain) : { state: fileState, body: fileProblem(data, fileState) };
  }

  // ── 1. Employee ───────────────────────────────────────────────────────────────
  function employee(data) {
    return resolve(data, (snap) => {
      const a = snap.agent;
      if (!a || typeof a !== 'object') return invalid('agent');
      if (a.exists === false) {
        return { state: 'empty', body: h('p', { class: 'empty' }, 'No agent yet: no AI employee is linked to this domain. This is a real state reported by the platform, not a failed load.') };
      }
      const tools = arr(a.tools_granted);
      const source = a.autonomy_level_source;
      const setByGap = arr(snap.not_recorded).some((g) => g.field === 'agent.autonomy_level_set_by');
      return { state: 'loaded', body: h('table', {},
        detailRow('Agent id', a.agent_id ? h('code', {}, a.agent_id) : orNotSet(null, 'no agent id recorded')),
        detailRow('Name (display_name)', orNotSet(a.display_name, 'no display name set')),
        detailRow('Enabled', a.enabled === true ? 'Yes' : a.enabled === false ? 'No: this agent is disabled' : orNotSet(null, 'not recorded')),
        detailRow('Autonomy level', h('span', {}, orNotSet(a.autonomy_level, 'not recorded'),
          h('span', { class: 'muted' }, ' · an agent-level setting (observe, suggest, act_audited, communicate). It is not a rung on the autonomy:R0 to R9 ladder and is never compared with one.'))),
        detailRow('Autonomy last set', central(a.autonomy_level_set_at)),
        detailRow('How it was set', source === 'auto' ? 'auto: defaulted, not chosen by a person'
          : source === 'manual' ? 'manual: chosen by a person' : orNotSet(source, 'not recorded')),
        detailRow('Set by', h('span', { class: 'empty' }, setByGap
          ? 'Not recorded: the platform stores when and how autonomy was set, but not who set it.' : 'Not recorded.')),
        detailRow('Tools granted', tools.length ? `${tools.length}: ${tools.join(', ')}` : '0. No tool is granted to this agent.')) };
    });
  }

  // ── 2. Capability inventory ──────────────────────────────────────────────────
  function inventory(data) {
    return resolve(data, (snap) => {
      const list = snap.authority;
      if (!Array.isArray(list)) return invalid('authority');
      if (!list.length) return { state: 'empty', body: h('p', { class: 'empty' }, 'The snapshot lists no capabilities for this domain.') };
      const human = list.filter((c) => arr(c.reasons).includes(HUMAN)).length;
      return { state: 'loaded', body: h('div', {},
        h('p', {}, `${plural(list.length, 'capability', 'capabilities')} in the snapshot. ${human} of them are marked as human decisions, which no autonomy level ever automates.`),
        h('p', { class: 'muted' }, `The human-decision mark comes from effectiveAuthority()’s reason ${HUMAN}, not from a field of its own. Listed in the snapshot’s order (sorted by capability id); research order is not in the snapshot.`),
        h('p', { class: 'muted' }, 'Not in the public snapshot, so not shown: classification, implementation state, requirement validation state, starting autonomy and ceiling. Because validation state is not shown, none of these should be read as agreed.'),
        h('details', {}, h('summary', {}, `Show all ${list.length} capabilities`),
          h('table', {}, h('tr', {}, h('th', {}, 'Capability'), h('th', {}, 'Effective authority'), h('th', {}, 'Human decision')),
            list.map((c) => h('tr', {}, h('td', {}, h('code', {}, orNotSet(c.capability_id, 'no id'))),
              h('td', {}, orNotSet(c.effective_autonomy, 'none: no approved autonomy')),
              h('td', {}, arr(c.reasons).includes(HUMAN) ? 'Yes' : h('span', { class: 'muted' }, 'not flagged'))))))) };
    });
  }

  // ── 3. Autonomy ladder and authority ─────────────────────────────────────────
  function ladder(data) {
    return resolve(data, (snap) => {
      const list = snap.authority;
      const rule = snap.authority_rule;
      if (!Array.isArray(list) || !rule || typeof rule !== 'object') return invalid('authority or authority_rule');
      const at = (stage) => list.filter((c) => c.effective_autonomy === stage).length;
      const noLevel = list.filter((c) => !c.effective_autonomy).length;
      const constrained = list.filter((c) => arr(c.reasons).includes('no_tool_grants')).length;
      const reported = rule.approved_above_r2;
      const level = snap.agent && snap.agent.exists !== false ? snap.agent.autonomy_level : null;
      return { state: 'loaded', body: h('div', {},
        h('table', {}, h('tr', {}, h('th', {}, 'Rung'), h('th', {}, 'What it means (owner’s words)'), h('th', {}, 'Capabilities whose effective authority is here'), h('th', {}, 'Ceilings that stop here')),
          RUNGS.map(([r, text]) => h('tr', {}, h('td', {}, `autonomy:${r}`), h('td', {}, text),
            h('td', {}, String(at(`autonomy:${r}`))),
            h('td', {}, r === 'R8' ? 'Unreachable by fact: agent-to-agent handoff does not exist in this platform today.'
              : h('span', { class: 'empty' }, 'Not in the public snapshot'))))),
        noLevel ? h('p', {}, `${plural(noLevel, 'capability has', 'capabilities have')} no effective authority (no approved autonomy).`) : null,
        h('p', { class: 'muted' }, level
          ? `Your employee is not placed on this ladder. Its autonomy (${level}) is an agent-level setting on a different scale, so marking it as a rung would be wrong.`
          : 'Your employee is not placed on this ladder: the snapshot has no agent-level autonomy to report, and that scale is different from these rungs anyway.'),
        h('p', { class: 'muted' }, 'Ceilings (max_permitted_autonomy) are not in the public snapshot, so no capability can be marked against the rung it stops at. That needs the platform to publish them.'),
        h('h4', {}, 'Effective authority, as effectiveAuthority() returned it'),
        h('p', {}, RUNGS.filter(([r]) => at(`autonomy:${r}`)).map(([r]) => `autonomy:${r}: ${plural(at(`autonomy:${r}`), 'capability', 'capabilities')}`).join('; ') || 'No capability has an effective authority.'),
        h('p', { class: 'muted' }, 'Computed by the platform’s effectiveAuthority() (autonomyLadder.ts) when it wrote the snapshot. This page shows the value it returned and does not recompute it. The level each capability record asks for is not in the public snapshot, so the two cannot be shown side by side.'),
        h('h4', {}, 'The no_tool_grants rule'),
        h('p', {}, orNotSet(rule.rule, 'rule text not in the snapshot')),
        h('p', { class: 'big-ish' }, constrained === 0
          ? 'In force, and currently constrains 0 capabilities: no capability in this domain is approved above autonomy:R2 yet, so the rule binds nothing.'
          : `In force, and currently constrains ${plural(constrained, 'capability', 'capabilities')}: each is held at autonomy:R2 because no tool is granted.`),
        typeof reported === 'number' && reported !== constrained
          ? h('p', { class: 'warning-text' }, `The snapshot’s own count (authority_rule.approved_above_r2 = ${reported}) disagrees with the ${constrained} no_tool_grants reasons listed. Shown above: the reasons.`) : null) };
    });
  }

  // ── 4. Per-rung behaviour ────────────────────────────────────────────────────
  function behaviour(data) {
    return resolve(data, () => ({ state: 'missing', body: h('p', { class: 'empty' },
      'Not in the public snapshot: release_behaviour[], the per-rung behaviour and its acceptance criteria, is held only in the capability records behind a signed-in endpoint. Nothing is shown here rather than an example, so what the next rung requires cannot be read from this page yet.') }));
  }

  // ── 5. Governance ────────────────────────────────────────────────────────────
  // The platform's own values, from ensureAgentDomainChangeRequestSchema.ts and
  // agentChangeRequestService.ts: kind is CHANGE_REQUEST_KINDS = ['change', 'tool'] (column
  // default 'change'); status is 'submitted' (default) until a named human decides 'approved' or
  // 'declined'. Anything else is shown as unknown rather than guessed into a group.
  const KINDS = { tool: 'tool', change: 'change' };
  const UNDECIDED = 'submitted';

  function statusWords(r) {
    if (r.status === UNDECIDED) return 'Submitted: nobody has decided yet. Grants nothing.';
    if (r.status === 'approved') return 'Approved by a named human';
    if (r.status === 'declined') return `Declined${r.declined_reason ? `: ${r.declined_reason}` : ''}`;
    return r.status ? `Unknown status "${r.status}"` : orNotSet(null, 'no status recorded');
  }

  function requestTable(rows, emptyText) {
    return rows.length === 0 ? h('p', { class: 'empty' }, emptyText) : h('table', {},
      h('tr', {}, ['Request', 'Status', 'Filed', 'Decided'].map((x) => h('th', {}, x))),
      rows.map((r) => h('tr', {}, h('td', {}, orNotSet(r.title, 'untitled')), h('td', {}, statusWords(r)),
        h('td', {}, central(r.requested_at)), h('td', {}, central(r.approved_at, 'not decided')))));
  }

  function governance(data) {
    return resolve(data, (snap) => {
      const g = snap.governance;
      if (!g || !Array.isArray(g.requests)) return invalid('governance');
      const tools = g.requests.filter((r) => r.kind === KINDS.tool);
      const changes = g.requests.filter((r) => r.kind === KINDS.change);
      const unknown = g.requests.filter((r) => r.kind !== KINDS.tool && r.kind !== KINDS.change);
      // Counted by the platform's own status values only; anything else is counted as unknown,
      // never folded into one of the three.
      const byStatus = (s) => g.requests.filter((r) => r.status === s).length;
      const pending = byStatus(UNDECIDED);
      const approved = byStatus('approved');
      const declined = byStatus('declined');
      const otherStatus = g.requests.length - pending - approved - declined;
      const granted = snap.agent && snap.agent.exists !== false ? arr(snap.agent.tools_granted).length : 0;
      return { state: g.requests.length ? 'loaded' : 'empty', body: h('div', {},
        h('p', { class: 'disclosure' }, orNotSet(g.disclosure, 'A filed request grants nothing.')),
        g.requests.length === 0 ? h('p', { class: 'empty' }, 'Nothing returned: no change requests and no tool requests are on record for this domain, so none is awaiting a decision.') : null,
        h('h4', {}, 'Tool requests (asked for, not granted)'),
        requestTable(tools, 'No tool requests on record.'),
        h('h4', {}, 'Change requests'),
        requestTable(changes, 'No change requests on record.'),
        unknown.length ? h('h4', {}, 'Requests of an unknown type') : null,
        unknown.length ? h('p', { class: 'muted' }, `Their kind is not one the platform defines (change or tool): ${unknown.map((r) => `"${r.kind === undefined || r.kind === null ? 'none' : r.kind}"`).join(', ')}. They are not counted as tool or change requests.`) : null,
        unknown.length ? requestTable(unknown, '') : null,
        h('p', { class: 'governance-counts' },
          `Pending (status submitted): ${pending} · Approved: ${approved} · Declined: ${declined}`,
          otherStatus ? ` · Unknown status: ${otherStatus}` : ''),
        h('p', { class: 'muted' }, `Tools actually granted come from the agent record on panel 1, not from this queue: ${granted} granted. Who proposed and who decided each request is not in the public snapshot.`)) };
    });
  }

  // ── 6. What is not available ─────────────────────────────────────────────────
  function gaps(data) {
    const items = [
      'Coordinated handoff between two agents does not exist in this platform today, so autonomy:R8 is unreachable by fact, not by choice.',
      'Draft is not approved. The validation state of each capability is not in the public snapshot, so this page cannot show which are agreed; treat none as agreed.',
      'Per-rung behaviour (release_behaviour[]) is not in the public snapshot, so no capability’s next rung can be shown.',
      `Not in the public snapshot at all: ${NOT_IN_SNAPSHOT.join('; ')}.`,
      `${(data.agentDomain && data.agentDomain.sources && data.agentDomain.sources.capabilities) || EXPECTED.capabilities(data)}/coverage is not in the snapshot, so nothing from it is shown.`,
      'Nothing is reported live: no running system writes a status this page can read.',
    ];
    const snapState = (data.status && data.status.agentDomain) || 'loading';
    const recorded = data.agentDomain ? arr(data.agentDomain.not_recorded) : [];
    return { state: snapState === 'loaded' ? 'loaded' : snapState, body: h('div', {},
      snapState === 'loaded' ? null : fileProblem(data, snapState),
      h('ul', {}, items.map((t) => h('li', {}, t)),
        recorded.map((g) => h('li', {}, `${g.field}: the platform declares it does not record this.`)))) };
  }

  /** The six panels, in the story's order. Sample mode gets a statement instead of panels. */
  function render(data) {
    if (data.mode === 'sample') {
      return h('div', { class: 'panels-off' }, 'The six STORY-000 panels show real data only, so they are not drawn with made-up data. Switch to Real to see them.');
    }
    const all = ['agent', 'capabilities', 'governance'];
    return h('div', { class: 'panels' },
      panel(1, 'Your employee', 'Does it exist, and what is it allowed to do?', employee(data), sourceFor(data, ['agent'])),
      panel(2, 'Capability inventory', 'What am I actually building?', inventory(data), sourceFor(data, ['capabilities'])),
      panel(3, 'Autonomy ladder and authority', 'Where is this going?', ladder(data), sourceFor(data, ['capabilities', 'agent'])),
      panel(4, 'Per-rung behaviour', 'What does the next rung require of me?', behaviour(data), sourceFor(data, ['capabilities'])),
      panel(5, 'Governance queue', 'What am I waiting on a human for?', governance(data), sourceFor(data, ['governance', 'agent'])),
      panel(6, 'What is not available', 'What would I be lying about?', gaps(data), sourceFor(data, all)));
  }

  CC.panels = { render };
})();
