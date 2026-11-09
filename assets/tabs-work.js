/*
 * Tabs about the work itself: Project management, AI agents and Knowledge base.
 * Plan and progress are joined on story id. Status always comes from the progress file's
 * verification.state, and is shown as "not reported" when the platform has written none.
 */
window.CC = window.CC || {};
CC.tabs = CC.tabs || {};

(function () {
  const { h, orNotSet, card, detailRow, back, sourceLine, arr, enc, progressFor, stateOf, PLATFORM_RULES_SOURCE } = CC.ui;
  const stories = (data) => arr(data.plan && data.plan.stories);
  const releases = (data) => arr(data.plan && data.plan.releases);
  const storyLink = (id) => h('a', { href: `#/project/${enc('story:' + id)}` }, id);
  const status = (data, id) => orNotSet(stateOf(data, id), 'not reported');

  // ── Project management ──────────────────────────────────────────────────────
  /** Bars for releases with both dates; a plain statement when none has them. */
  function gantt(data) {
    const dated = releases(data).filter((r) => r.starts_on && r.ends_on);
    if (dated.length === 0) {
      return h('p', { class: 'empty' }, 'No release in your plan has start and end dates, so no timeline can be drawn. Dates are set in the portal.');
    }
    const t = (d) => new Date(d).getTime();
    const min = Math.min(...dated.map((r) => t(r.starts_on)));
    const span = Math.max(...dated.map((r) => t(r.ends_on))) - min || 1;
    return h('div', { class: 'gantt' }, dated.map((r) => {
      const left = ((t(r.starts_on) - min) / span) * 100;
      const width = Math.max(((t(r.ends_on) - t(r.starts_on)) / span) * 100, 1);
      return h('div', { class: 'gantt-row' }, h('span', { class: 'gantt-label' }, `${r.key} ${r.name}`),
        h('span', { class: 'gantt-track' }, h('span', { class: 'gantt-bar', style: `left:${left}%;width:${width}%` })),
        h('span', { class: 'muted' }, `${r.starts_on} to ${r.ends_on}${r.is_demo_target ? ' · demo' : ''}`));
    }));
  }

  function storyTable(data, list) {
    return h('table', {},
      h('tr', {}, ['Story', 'Title', 'Release', 'Due', 'First due', 'Status'].map((x) => h('th', {}, x))),
      list.map((s) => h('tr', {}, h('td', {}, storyLink(s.id)), h('td', {}, orNotSet(s.title)), h('td', {}, orNotSet(s.release)),
        h('td', {}, orNotSet(s.due_on)), h('td', {}, orNotSet(s.due_baseline_on)), h('td', {}, status(data, s.id)))));
  }

  CC.tabs.project = {
    render(data) {
      const src = `${CC.FILES.plan} → releases`;
      const cards = releases(data).length
        ? releases(data).map((r) => card(data, `#/project/${enc('release:' + r.key)}`, `${r.key}: ${r.name}`,
          h('div', {}, h('p', {}, `${arr(r.story_ids).length} ${arr(r.story_ids).length === 1 ? 'story' : 'stories'}`),
            h('p', { class: 'muted' }, 'Starts ', orNotSet(r.starts_on), ' · ends ', orNotSet(r.ends_on))), src))
        : [card(data, `#/project/${enc('release:none')}`, 'No releases yet', h('p', { class: 'empty' }, 'Your plan has no releases.'), src)];
      return [h('h2', {}, 'Project management'),
        h('h3', {}, 'Timeline'), gantt(data),
        h('h3', {}, 'Releases'), h('div', { class: 'cards' }, cards),
        h('h3', {}, 'Every task, with its due date'),
        h('p', { class: 'muted' }, '"Due" is the current date; "First due" is the date it was first given. A gap between them is slippage. Status comes from the platform, not from this page.'),
        stories(data).length ? storyTable(data, stories(data)) : h('p', { class: 'empty' }, 'Your plan has no stories.'),
        sourceLine(data, `${CC.FILES.plan} → releases, schedule, stories; ${CC.FILES.progress} → stories[].verification.state`)];
    },
    detail(data, id) {
      const [kind, ...rest] = id.split(':');
      const key = rest.join(':');
      if (kind === 'release') {
        const r = releases(data).find((x) => x.key === key);
        if (!r) {
          return [back('#/project', 'Project management'), h('h2', {}, 'No releases yet'),
            h('p', {}, 'Each release would list its dates and its stories here. What has to happen first: releases are added to your plan in the portal.')];
        }
        const list = stories(data).filter((s) => arr(r.story_ids).includes(s.id));
        return [back('#/project', 'Project management'), h('h2', {}, `${r.key}: ${r.name}`),
          h('table', {}, detailRow('Starts', orNotSet(r.starts_on)), detailRow('Ends', orNotSet(r.ends_on)),
            detailRow('Demo target', r.is_demo_target ? 'yes' : 'no'), detailRow('Stories', String(arr(r.story_ids).length))),
          list.length ? storyTable(data, list) : h('p', { class: 'empty' }, 'No stories in this release.'),
          sourceLine(data, `${CC.FILES.plan} → releases, stories`)];
      }
      const s = stories(data).find((x) => x.id === key);
      if (!s) return [back('#/project', 'Project management'), h('p', { class: 'empty' }, 'That story is not in your plan.')];
      const p = progressFor(data, s.id);
      const crit = p ? arr(p.criteria) : [];
      const slip = s.due_on && s.due_baseline_on && s.due_on !== s.due_baseline_on;
      return [back('#/project', 'Project management'), h('h2', {}, s.id), h('p', {}, h('strong', {}, orNotSet(s.title))),
        h('table', {},
          detailRow('Release', orNotSet(s.release)), detailRow('Narrative', orNotSet(s.narrative, 'no narrative')),
          detailRow('Due', orNotSet(s.due_on)), detailRow('First due', orNotSet(s.due_baseline_on)),
          detailRow('Slippage', slip ? `moved from ${s.due_baseline_on} to ${s.due_on}` : h('span', { class: 'empty' }, 'none recorded')),
          detailRow('Owner', orNotSet(s.owner_agent, 'unassigned')),
          detailRow('Platform status', status(data, s.id)),
          detailRow('Criteria ticked in your progress file', p
            ? `${crit.filter((c) => c.passed).length} of ${crit.length} (your claims; the platform decides verification)`
            : h('span', { class: 'empty' }, 'not in the progress file'))),
        h('h3', {}, 'Acceptance criteria (from the plan)'),
        arr(s.acceptance).length ? h('ul', {}, arr(s.acceptance).map((a) => h('li', {}, typeof a === 'string' ? a : (a.text || JSON.stringify(a)))))
          : h('p', { class: 'empty' }, 'none in the plan'),
        h('h3', {}, 'Failure paths (from the plan)'),
        arr(s.failure_paths).length ? h('ul', {}, arr(s.failure_paths).map((f) => h('li', {}, typeof f === 'string' ? f : JSON.stringify(f))))
          : h('p', { class: 'empty' }, 'none in the plan'),
        sourceLine(data, `${CC.FILES.plan} → stories; ${CC.FILES.progress} → stories`)];
    },
  };

  // ── AI agents ───────────────────────────────────────────────────────────────
  const { RUNGS } = CC.ui;

  function owners(data) {
    const map = new Map();
    for (const s of stories(data)) {
      const o = s.owner_agent || 'Unassigned';
      if (!map.has(o)) map.set(o, []);
      map.get(o).push(s);
    }
    return map;
  }

  CC.tabs.agents = {
    render(data) {
      const agents = arr(data.plan && data.plan.agents);
      const src = `${CC.FILES.plan} → agents`;
      let cards;
      let note;
      if (agents.length) {
        note = null;
        cards = agents.map((a, i) => card(data, `#/agents/${enc('agent:' + i)}`, a.name || 'Unnamed agent',
          h('div', {}, h('p', {}, orNotSet(a.purpose)), h('p', { class: 'muted' }, 'Autonomy in the plan: ', orNotSet(a.autonomy_level)),
            h('p', { class: 'muted' }, arr(a.skills).length ? `Skills: ${arr(a.skills).join(', ')}` : 'No skills registered yet'),
            h('p', { class: 'muted' }, 'No runs recorded')), src));
      } else {
        note = h('p', { class: 'muted' }, 'Your plan has no scoped agent roster, so this tab is built from who owns each story. These are owners, not scoped AI agents.');
        cards = [...owners(data).entries()].map(([o, list]) => card(data, `#/agents/${enc('owner:' + o)}`, `${o} (owner, not a scoped agent)`,
          h('div', {}, h('p', {}, `Owns ${list.length} ${list.length === 1 ? 'story' : 'stories'}.`),
            h('p', { class: 'muted' }, 'No skills registered yet'), h('p', { class: 'muted' }, 'No runs recorded')),
          `${CC.FILES.plan} → stories[].owner_agent`));
      }
      cards.push(card(data, '#/agents/ladder', 'Autonomy ladder and capability ceilings',
        h('div', {}, h('p', {}, CC.ladder.snapshotHasCeilings(data.agentDomain)
          ? 'Each capability’s ceiling and effective authority are on the Overview, panel 3. Per-rung behaviour: unavailable, because the public snapshot does not contain it.'
          : 'Capability ceilings and per-rung behaviour: unavailable. Neither your plan files nor the public snapshot contains them. Effective authority is on the Overview, panel 3.'),
          h('p', { class: 'muted' }, 'R8 is unreachable by fact: agent-to-agent handoff does not exist in this platform.')), PLATFORM_RULES_SOURCE));
      return [h('h2', {}, 'AI agents'), note, h('div', { class: 'cards' }, cards)];
    },
    detail(data, id) {
      const [kind, ...rest] = id.split(':');
      const key = rest.join(':');
      if (id === 'ladder') {
        const byAutonomy = (data.plan && data.plan.derived && data.plan.derived.counts && data.plan.derived.counts.agents_by_autonomy) || {};
        return [back('#/agents', 'AI agents'), h('h2', {}, 'Autonomy ladder and capability ceilings'),
          h('table', {}, h('tr', {}, h('th', {}, 'Rung'), h('th', {}, 'What it means'), h('th', {}, 'Availability')),
            RUNGS.map(([r, text]) => h('tr', {}, h('td', {}, `autonomy:${r}`), h('td', {}, text),
              h('td', {}, r === 'R8' ? 'Unreachable by fact: agent-to-agent handoff does not exist in this platform today' : '')))),
          h('p', {}, CC.ladder.snapshotHasCeilings(data.agentDomain)
            ? 'Each capability’s approved autonomy, ceiling, ceiling reason and effective authority are on the Overview, panel 3, from the public snapshot (.colaberry/agent-domain.json). Per-rung behaviour: unavailable, because the snapshot does not contain it. Your employee’s record is on panel 1.'
            : 'Each capability’s ceiling and per-rung behaviour: unavailable. Neither your plan files nor the public snapshot (.colaberry/agent-domain.json) contains them, and this page calls no signed-in endpoint. Your employee’s record and each capability’s effective authority are on the Overview, panels 1 and 3.'),
          h('ul', {},
            h('li', {}, 'Draft is not approved: a capability in draft has not been agreed by anyone.'),
            h('li', {}, 'Without granted tools, the platform caps any capability at R2 (effectiveAuthority, no_tool_grants).'),
            h('li', {}, 'Finishing work never promotes an agent. A named human promotes one rung at a time, on evidence.')),
          h('p', { class: 'muted' }, 'Agents by autonomy, from your plan: ',
            Object.keys(byAutonomy).length ? Object.entries(byAutonomy).map(([k, v]) => `${k}: ${v}`).join(', ') : h('span', { class: 'empty' }, 'none')),
          h('p', { class: 'muted' }, `Source: ${PLATFORM_RULES_SOURCE}; ${CC.FILES.plan} → derived.counts`)];
      }
      if (kind === 'agent') {
        const a = arr(data.plan && data.plan.agents)[Number(key)];
        if (!a) return [back('#/agents', 'AI agents'), h('p', { class: 'empty' }, 'That agent is not in your plan.')];
        const field = (k) => detailRow(k, Array.isArray(a[k]) ? (a[k].length ? a[k].join(', ') : h('span', { class: 'empty' }, 'none')) : orNotSet(a[k]));
        return [back('#/agents', 'AI agents'), h('h2', {}, a.name || 'Unnamed agent'),
          h('table', {}, ['purpose', 'trigger_type', 'trigger', 'inputs', 'outputs', 'autonomy_level', 'approval_gates', 'escalation_rules', 'skills'].map(field)),
          h('p', { class: 'muted' }, 'Run history: no runs recorded.'),
          h('h3', {}, 'Stories it owns'), arr(a.owns).length ? h('ul', {}, arr(a.owns).map((sid) => h('li', {}, storyLink(sid), ' · ', status(data, sid)))) : h('p', { class: 'empty' }, 'none'),
          sourceLine(data, `${CC.FILES.plan} → agents`)];
      }
      const list = owners(data).get(key);
      if (!list) return [back('#/agents', 'AI agents'), h('p', { class: 'empty' }, 'No such owner in your plan.')];
      return [back('#/agents', 'AI agents'), h('h2', {}, `${key} (owner, not a scoped agent)`),
        h('p', { class: 'muted' }, 'No skills registered yet. No runs recorded.'),
        h('table', {}, h('tr', {}, h('th', {}, 'Story'), h('th', {}, 'Title'), h('th', {}, 'Status')),
          list.map((s) => h('tr', {}, h('td', {}, storyLink(s.id)), h('td', {}, orNotSet(s.title)), h('td', {}, status(data, s.id))))),
        sourceLine(data, `${CC.FILES.plan} → stories[].owner_agent; ${CC.FILES.progress} → stories[].verification.state`)];
    },
  };

  // ── Knowledge base ──────────────────────────────────────────────────────────
  CC.tabs.knowledge = {
    render(data) {
      const reqs = arr(data.plan && data.plan.requirements);
      const gaps = reqs.filter((r) => r.priority === 'must' && arr(r.fulfilled_by).length === 0).length;
      return [h('h2', {}, 'Knowledge base'), h('div', { class: 'cards' },
        card(data, '#/knowledge/requirements', 'Requirements and traceability',
          reqs.length ? h('p', {}, `${reqs.length} requirement(s); ${gaps} "must" requirement(s) with no story.`)
            : h('p', { class: 'empty' }, 'Your plan has no requirements yet.'), `${CC.FILES.plan} → requirements[]`),
        card(data, '#/knowledge/stories', 'Stories',
          h('p', {}, `${stories(data).length} stories in your plan.`), `${CC.FILES.plan} → stories[]`),
        card(data, '#/knowledge/notes', 'Decisions and notes',
          h('p', { class: 'empty' }, 'No notes recorded yet.'), null)),
      h('h3', {}, 'Ask about this page'), CC.chat.render(data)];
    },
    detail(data, id) {
      if (id === 'requirements') {
        const reqs = arr(data.plan && data.plan.requirements);
        return [back('#/knowledge', 'Knowledge base'), h('h2', {}, 'Requirements and traceability'),
          reqs.length ? h('table', {}, h('tr', {}, ['Requirement', 'Kind', 'Priority', 'Statement', 'Fulfilled by', 'Verified?'].map((x) => h('th', {}, x))),
            reqs.map((r) => {
              const ids = arr(r.fulfilled_by);
              const verified = ids.length > 0 && ids.every((sid) => stateOf(data, sid) === 'verified');
              return h('tr', {}, h('td', {}, r.id), h('td', {}, orNotSet(r.kind)), h('td', {}, orNotSet(r.priority)), h('td', {}, orNotSet(r.statement)),
                h('td', {}, ids.length ? ids.map((sid, i) => [i ? ', ' : '', storyLink(sid)]) : h('span', { class: 'empty' }, r.priority === 'must' ? 'none: a real gap' : 'none')),
                h('td', {}, ids.length ? (verified ? 'yes' : 'not yet') : '—'));
            }))
            : h('p', { class: 'empty' }, 'Your plan has no requirements, so there is nothing to trace. What has to happen first: requirements are added to your plan in the portal.'),
          sourceLine(data, `${CC.FILES.plan} → requirements[]; ${CC.FILES.progress} → stories[].verification.state`)];
      }
      if (id === 'stories') {
        return [back('#/knowledge', 'Knowledge base'), h('h2', {}, 'Stories'),
          h('table', {}, h('tr', {}, h('th', {}, 'Story'), h('th', {}, 'Title'), h('th', {}, 'Status')),
            stories(data).map((s) => h('tr', {}, h('td', {}, storyLink(s.id)), h('td', {}, orNotSet(s.title)), h('td', {}, status(data, s.id))))),
          sourceLine(data, `${CC.FILES.plan} → stories[]`)];
      }
      if (id === 'notes') {
        return [back('#/knowledge', 'Knowledge base'), h('h2', {}, 'Decisions and notes'),
          h('p', {}, 'This section will grow for the whole programme: decisions made and notes added as you go.'),
          h('p', {}, 'What has to happen first: there is no notes file in this repository yet. Once one is committed beside the data files, this page will read it the same way it reads the plan.')];
      }
      return [back('#/knowledge', 'Knowledge base'), h('p', { class: 'empty' }, 'No such section.')];
    },
  };
})();
