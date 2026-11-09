/*
 * Panel 3 of the STORY-000 Command Center: the autonomy ladder, each capability's ceiling marked
 * against it, the effective authority, and the no_tool_grants rule. Split out of panels.js
 * because it is the largest panel. Every value comes from .colaberry/agent-domain.json.
 *
 * Four per-capability values, never interchangeable:
 *   approved_autonomy       the level the capability record asks for
 *   max_permitted_autonomy  its ceiling: a decision somebody made, with a reason
 *   effective_autonomy      what effectiveAuthority() returned, which is what actually applies
 *   ceiling_reason          WHY the ceiling sits where it does
 * `reasons` is a fifth, different thing: how the EFFECTIVE level was arrived at.
 *
 * A `*_note` field is filled by the platform only when the value is not one of the ten rungs, so
 * a null note beside a valid rung is the normal case, not a gap.
 */
window.CC = window.CC || {};

(function () {
  const { h, arr, orNotSet, RUNGS } = CC.ui;
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const STAGES = RUNGS.map(([r]) => `autonomy:${r}`);
  const R8 = 'autonomy:R8';
  const isRung = (v) => STAGES.includes(v);
  const idx = (v) => STAGES.indexOf(v);

  /** A rung, or an explicit statement of why this capability has none. Never a blank. */
  function rungCell(c, field, noteField, label) {
    const v = c[field];
    if (isRung(v)) return v;
    if (typeof c[noteField] === 'string' && c[noteField].trim()) return h('span', { class: 'empty' }, `Not a rung: ${c[noteField]}`);
    if (!(field in c)) return h('span', { class: 'empty' }, `No ${label} in the snapshot for this capability`);
    return h('span', { class: 'empty' }, v === null ? `No ${label} recorded (null, with no note)` : `Not a valid rung: "${v}"`);
  }

  function ceilingReasonCell(c) {
    if (!('ceiling_reason' in c)) return h('span', { class: 'empty' }, 'No ceiling rationale in the snapshot for this capability.');
    if (typeof c.ceiling_reason !== 'string' || !c.ceiling_reason.trim()) return h('span', { class: 'empty' }, 'No ceiling rationale recorded (empty).');
    return c.ceiling_reason;
  }

  /**
   * Where the ceiling leaves this capability on the ladder, in words. R8 is unreachable by fact,
   * and promotion is one rung at a time (marketing.STORY-000.md), so a ceiling at R8 or R9 does
   * not make anything above R7 reachable today.
   */
  function ceilingSentence(c) {
    if (!isRung(c.max_permitted_autonomy)) return 'No ceiling recorded, so this capability cannot be marked against the ladder.';
    const ceil = idx(c.max_permitted_autonomy);
    if (ceil >= idx(R8)) {
      return `Ceiling ${c.max_permitted_autonomy}. autonomy:R8 is unreachable by fact and promotion is one rung at a time, so it cannot rise above autonomy:R7 today.`;
    }
    // Ceiling is R7 or lower here, so at least R8 and R9 sit above it.
    return `Stops at ${c.max_permitted_autonomy}: autonomy:R${ceil + 1} to R9 are above its ceiling, unreachable for this capability.`;
  }

  /** Ten cells: each rung marked open, above the ceiling, or unreachable by fact. */
  function strip(c) {
    const ceil = isRung(c.max_permitted_autonomy) ? idx(c.max_permitted_autonomy) : null;
    const eff = isRung(c.effective_autonomy) ? idx(c.effective_autonomy) : null;
    const asked = isRung(c.approved_autonomy) ? idx(c.approved_autonomy) : null;
    return h('span', { class: 'strip', 'aria-hidden': 'true' }, STAGES.map((s, i) => {
      let kind;
      let word;
      if (s === R8) { kind = 'is-fact'; word = 'unreachable by fact'; }
      else if (ceil === null) { kind = 'is-unknown'; word = 'ceiling not recorded'; }
      else if (i > ceil) { kind = 'is-above'; word = 'above the ceiling'; }
      else { kind = 'is-open'; word = 'within the ceiling'; }
      const marks = [i === eff ? 'effective' : null, i === asked ? 'approved' : null, i === ceil ? 'ceiling' : null].filter(Boolean);
      return h('span', {
        class: `rung ${kind}${i === ceil ? ' is-ceiling' : ''}${i === eff ? ' is-effective' : ''}`,
        'data-rung': `R${i}`,
        title: `${s}: ${[...marks, word].join(', ')}`,
      }, `R${i}`);
    }));
  }

  const hasField = (list, f) => list.some((c) => f in c);

  function ceilingTable(list) {
    return h('details', { open: true }, h('summary', {}, `Each capability against the ladder (${list.length})`),
      h('p', { class: 'muted' }, 'Approved is what the capability record asks for. Ceiling is the highest rung it may ever reach, and the ceiling reason says why. Effective is what applies now. Reasons say how the effective level was reached; they are not the ceiling reason. In each strip, R8 is crossed out because it is unreachable by fact, and greyed rungs are above that capability’s ceiling.'),
      h('table', { class: 'ceilings' },
        h('tr', {}, ['Capability', 'Approved (asks for)', 'Ceiling (max permitted)', 'Effective (applies now)', 'Against the ladder', 'Ceiling reason (why the ceiling is there)', 'Reasons (how the effective level was reached)'].map((x) => h('th', {}, x))),
        list.map((c) => h('tr', { 'data-capability': c.capability_id || '' },
          h('td', {}, h('code', {}, orNotSet(c.capability_id, 'no id'))),
          h('td', {}, rungCell(c, 'approved_autonomy', 'approved_autonomy_note', 'approved autonomy')),
          h('td', {}, rungCell(c, 'max_permitted_autonomy', 'max_permitted_autonomy_note', 'ceiling')),
          h('td', {}, orNotSet(c.effective_autonomy, 'none: no approved autonomy')),
          h('td', {}, strip(c), h('span', { class: 'ceiling-sentence' }, ceilingSentence(c))),
          h('td', {}, ceilingReasonCell(c)),
          h('td', {}, arr(c.reasons).length ? arr(c.reasons).join(', ') : h('span', { class: 'muted' }, 'none recorded'))))));
  }

  /** Panel 3's body, given a loaded snapshot. Returns { state, body } like every panel. */
  function build(snap, invalid) {
    const list = snap.authority;
    const rule = snap.authority_rule;
    if (!Array.isArray(list) || !rule || typeof rule !== 'object') return invalid('authority or authority_rule');
    const at = (stage) => list.filter((c) => c.effective_autonomy === stage).length;
    const ceilingsAt = (stage) => list.filter((c) => c.max_permitted_autonomy === stage).length;
    const withCeilings = hasField(list, 'max_permitted_autonomy');
    const noCeiling = list.filter((c) => !isRung(c.max_permitted_autonomy)).length;
    const noLevel = list.filter((c) => !c.effective_autonomy).length;
    const constrained = list.filter((c) => arr(c.reasons).includes('no_tool_grants')).length;
    const reported = rule.approved_above_r2;
    const level = snap.agent && snap.agent.exists !== false ? snap.agent.autonomy_level : null;

    const ceilingCell = (stage) => {
      if (!withCeilings) return stage === R8 ? 'Unreachable by fact: agent-to-agent handoff does not exist in this platform today.' : h('span', { class: 'empty' }, 'Not in the public snapshot');
      const n = ceilingsAt(stage);
      if (stage === R8) return `Unreachable by fact: agent-to-agent handoff does not exist in this platform today.${n ? ` ${plural(n, 'ceiling is', 'ceilings are')} recorded here.` : ''}`;
      if (stage === 'autonomy:R9' && n) return `${n} (autonomy:R8 below it is still unreachable by fact)`;
      return String(n);
    };

    return { state: 'loaded', body: h('div', {},
      h('table', {}, h('tr', {}, h('th', {}, 'Rung'), h('th', {}, 'What it means (owner’s words)'), h('th', {}, 'Capabilities whose effective authority is here'), h('th', {}, 'Ceilings that stop here')),
        RUNGS.map(([r, text]) => h('tr', {}, h('td', {}, `autonomy:${r}`), h('td', {}, text),
          h('td', {}, String(at(`autonomy:${r}`))), h('td', {}, ceilingCell(`autonomy:${r}`))))),
      noLevel ? h('p', {}, `${plural(noLevel, 'capability has', 'capabilities have')} no effective authority (no approved autonomy).`) : null,
      h('p', { class: 'muted' }, level
        ? `Your employee is not placed on this ladder. Its autonomy (${level}) is an agent-level setting on a different scale, so marking it as a rung would be wrong.`
        : 'Your employee is not placed on this ladder: the snapshot has no agent-level autonomy to report, and that scale is different from these rungs anyway.'),
      !withCeilings
        ? h('p', { class: 'muted' }, 'Ceilings (max_permitted_autonomy) are not in the public snapshot, so no capability can be marked against the rung it stops at. That needs the platform to publish them.')
        : h('p', { class: 'muted' }, noCeiling
          ? `${plural(noCeiling, 'capability has', 'capabilities have')} no valid ceiling recorded and ${noCeiling === 1 ? 'is' : 'are'} shown with an explanation instead of a mark. The rest are marked below.`
          : `Each of the ${list.length} capabilities has its ceiling marked against the ladder below, with the reason the ceiling sits there. A ceiling is what may ever be permitted, not what is granted.`),
      withCeilings ? ceilingTable(list) : null,
      h('h4', {}, 'Effective authority, as effectiveAuthority() returned it'),
      h('p', {}, RUNGS.filter(([r]) => at(`autonomy:${r}`)).map(([r]) => `autonomy:${r}: ${plural(at(`autonomy:${r}`), 'capability', 'capabilities')}`).join('; ') || 'No capability has an effective authority.'),
      h('p', { class: 'muted' }, `Computed by the platform’s effectiveAuthority() (autonomyLadder.ts) when it wrote the snapshot. This page shows the value it returned and does not recompute it. ${hasField(list, 'approved_autonomy')
        ? 'The level each capability record asks for is shown beside it in the table above as Approved; the effective level is what applies.'
        : 'The level each capability record asks for is not in the public snapshot, so the two cannot be shown side by side.'}`),
      h('h4', {}, 'The no_tool_grants rule'),
      h('p', {}, orNotSet(rule.rule, 'rule text not in the snapshot')),
      h('p', { class: 'big-ish' }, constrained === 0
        ? 'In force, and currently constrains 0 capabilities: no capability in this domain is approved above autonomy:R2 yet, so the rule binds nothing.'
        : `In force, and currently constrains ${plural(constrained, 'capability', 'capabilities')}: each is held at autonomy:R2 because no tool is granted.`),
      typeof reported === 'number' && reported !== constrained
        ? h('p', { class: 'warning-text' }, `The snapshot’s own count (authority_rule.approved_above_r2 = ${reported}) disagrees with the ${constrained} no_tool_grants reasons listed. Shown above: the reasons.`) : null) };
  }

  /** True when the snapshot carries per-capability ceilings, for the panels that mention them. */
  const snapshotHasCeilings = (snap) => !!snap && Array.isArray(snap.authority) && hasField(snap.authority, 'max_permitted_autonomy');

  CC.ladder = { build, snapshotHasCeilings };
})();
