/*
 * Tabs read from the plan's derived lists: Outcomes, Users and use case, Guardrails, Systems,
 * and Data model. Each card drills down one level. An empty list still renders a card whose
 * detail says what will be there and what has to happen first (STORY-000.md, "Tabs").
 */
window.CC = window.CC || {};
CC.tabs = CC.tabs || {};

(function () {
  const { h, orNotSet, card, back, sourceLine, arr, enc, stateOf } = CC.ui;
  const derived = (data) => (data.plan && data.plan.derived) || {};
  const ABOUT = 'about';

  /** A detail page for a card id the data doesn't contain. */
  function notFound(tabHref, tabLabel) {
    return [back(tabHref, tabLabel), h('p', { class: 'empty' }, 'That item is not in your plan data.')];
  }

  /** Label for a list item that may be a string or an object. */
  function labelOf(item) {
    if (item === null || item === undefined) return '';
    if (typeof item === 'string') return item;
    return item.name || item.role || item.statement || item.id || JSON.stringify(item);
  }

  // ── Outcomes ────────────────────────────────────────────────────────────────
  CC.tabs.outcomes = {
    render(data) {
      const measures = arr(derived(data).measures);
      const src = `${CC.FILES.plan} → derived.measures`;
      const cards = measures.length
        ? measures.map((m) => card(data, `#/outcomes/${enc(m.id)}`, String(m.id),
          h('div', {}, h('p', {}, orNotSet(m.statement)), h('p', { class: 'empty' }, 'No numeric target in your plan yet.')), src))
        : [card(data, `#/outcomes/${ABOUT}`, 'No measures yet',
          h('p', { class: 'empty' }, 'Your plan carries no measures and no numeric target yet.'), src)];
      return [h('h2', {}, 'Outcomes: the numbers this has to move'), h('div', { class: 'cards' }, cards)];
    },
    detail(data, id) {
      const src = `${CC.FILES.plan} → derived.measures`;
      if (id === ABOUT) {
        return [back('#/outcomes', 'Outcomes'), h('h2', {}, 'No measures yet'),
          h('p', {}, 'This tab will hold one card per measure in your plan: what it measures, its numeric target and, once your system reports it, the current value.'),
          h('p', {}, 'What has to happen first: measures are written into your plan through the portal. Until then there is nothing to show, and nothing is invented to fill the space.'),
          sourceLine(data, src)];
      }
      const m = arr(derived(data).measures).find((x) => String(x.id) === id);
      if (!m) return notFound('#/outcomes', 'Outcomes');
      return [back('#/outcomes', 'Outcomes'), h('h2', {}, String(m.id)),
        h('p', {}, orNotSet(m.statement)),
        h('p', { class: 'empty' }, 'Target: not set in your plan. Current value: no measurement recorded.'),
        sourceLine(data, src)];
    },
  };

  // ── Users and use case ──────────────────────────────────────────────────────
  const AS_A = /^\s*As an?\s+/i;
  CC.tabs.users = {
    render(data) {
      const roles = arr(derived(data).roles);
      const stories = arr(data.plan && data.plan.stories);
      const src = `${CC.FILES.plan} → derived.roles, stories[].narrative`;
      const cards = roles.length
        ? roles.map((r, i) => card(data, `#/users/${i}`, labelOf(r),
          h('p', {}, 'Stories written from this role are listed in the detail.'), src))
        : [card(data, `#/users/${ABOUT}`, 'Roles not yet named',
          h('div', {}, h('p', { class: 'empty' }, 'Your stories do not name a role yet.'),
            h('p', { class: 'muted' }, `${stories.filter((s) => AS_A.test(s.narrative || '')).length} of ${stories.length} story narratives are written "As a …".`)), src)];
      return [h('h2', {}, 'Users and use case'), h('div', { class: 'cards' }, cards)];
    },
    detail(data, id) {
      const stories = arr(data.plan && data.plan.stories);
      const src = `${CC.FILES.plan} → derived.roles, stories[].narrative`;
      if (id === ABOUT) {
        return [back('#/users', 'Users and use case'), h('h2', {}, 'Roles not yet named'),
          h('p', {}, 'Roles come from stories written "As a <role>, I want …". None of your story narratives uses that form, so no role is shown rather than one guessed from a title.'),
          h('p', {}, 'What has to happen first: stories that name who they are for. Each narrative is below, as written.'),
          h('table', {}, h('tr', {}, h('th', {}, 'Story'), h('th', {}, 'Narrative')),
            stories.map((s) => h('tr', {}, h('td', {}, h('a', { href: `#/project/${enc('story:' + s.id)}` }, s.id)), h('td', {}, orNotSet(s.narrative, 'no narrative'))))),
          sourceLine(data, src)];
      }
      const role = arr(derived(data).roles)[Number(id)];
      if (role === undefined) return notFound('#/users', 'Users and use case');
      const name = labelOf(role).toLowerCase();
      const from = stories.filter((s) => (s.narrative || '').toLowerCase().includes(name));
      return [back('#/users', 'Users and use case'), h('h2', {}, labelOf(role)),
        from.length ? h('ul', {}, from.map((s) => h('li', {}, h('a', { href: `#/project/${enc('story:' + s.id)}` }, s.id), ': ', s.narrative)))
          : h('p', { class: 'empty' }, 'No story narrative mentions this role.'),
        sourceLine(data, src)];
    },
  };

  // ── Guardrails ──────────────────────────────────────────────────────────────
  /** Follow guardrail → requirement.fulfilled_by → story verification states. */
  function guardrailStatus(data, g) {
    const req = arr(data.plan && data.plan.requirements).find((r) => r.id === g.id);
    const ids = req ? arr(req.fulfilled_by) : [];
    const states = ids.map((sid) => ({ id: sid, state: stateOf(data, sid) }));
    const kept = ids.length > 0 && states.every((s) => s.state === 'verified');
    return { ids, states, kept };
  }
  CC.tabs.guardrails = {
    render(data) {
      const list = arr(derived(data).guardrails);
      const src = `${CC.FILES.plan} → derived.guardrails, requirements[].fulfilled_by; ${CC.FILES.progress} → stories[].verification`;
      const cards = list.length
        ? list.map((g) => {
          const st = guardrailStatus(data, g);
          return card(data, `#/guardrails/${enc(g.id)}`, String(g.id),
            h('div', {}, h('p', {}, orNotSet(g.statement)),
              h('p', { class: st.kept ? '' : 'muted' }, st.kept ? 'Every story enforcing it is verified.' : 'A promise you have made and not yet kept: its stories are not verified.')), src);
        })
        : [card(data, `#/guardrails/${ABOUT}`, 'No guardrails yet',
          h('p', { class: 'empty' }, 'Your plan has no requirement typed SAFE, so there is nothing that must never happen on record.'), src)];
      return [h('h2', {}, 'Guardrails: what must never happen'), h('div', { class: 'cards' }, cards)];
    },
    detail(data, id) {
      const src = `${CC.FILES.plan} → derived.guardrails, requirements[].fulfilled_by; ${CC.FILES.progress} → stories[].verification`;
      if (id === ABOUT) {
        return [back('#/guardrails', 'Guardrails'), h('h2', {}, 'No guardrails yet'),
          h('p', {}, 'Each guardrail would show its statement, the stories that enforce it, and whether those stories are verified.'),
          h('p', {}, 'What has to happen first: your plan needs a requirement typed SAFE. Its absence usually means a promise made in the interview was recorded as an ordinary feature. Raise it with your instructor; it is worth fixing early.'),
          sourceLine(data, src)];
      }
      const g = arr(derived(data).guardrails).find((x) => String(x.id) === id);
      if (!g) return notFound('#/guardrails', 'Guardrails');
      const st = guardrailStatus(data, g);
      return [back('#/guardrails', 'Guardrails'), h('h2', {}, String(g.id)), h('p', {}, orNotSet(g.statement)),
        st.ids.length ? h('table', {}, h('tr', {}, h('th', {}, 'Enforcing story'), h('th', {}, 'Verification state')),
          st.states.map((s) => h('tr', {}, h('td', {}, h('a', { href: `#/project/${enc('story:' + s.id)}` }, s.id)), h('td', {}, orNotSet(s.state, 'not reported')))))
          : h('p', { class: 'empty' }, 'No story fulfils this guardrail yet: a promise with nothing behind it.'),
        sourceLine(data, src)];
    },
  };

  // ── Systems ─────────────────────────────────────────────────────────────────
  CC.tabs.systems = {
    render(data) {
      const list = arr(derived(data).systems);
      const src = `${CC.FILES.plan} → derived.systems`;
      const cards = list.length
        ? list.map((s, i) => card(data, `#/systems/${i}`, labelOf(s),
          h('p', {}, h('span', { class: 'dot', title: 'unknown' }), 'not checked from here'), src))
        : [card(data, `#/systems/${ABOUT}`, 'No systems named yet',
          h('p', { class: 'empty' }, 'Your plan names no external system.'), src)];
      return [h('h2', {}, 'Systems: what this connects to'), h('div', { class: 'cards' }, cards)];
    },
    detail(data, id) {
      const src = `${CC.FILES.plan} → derived.systems`;
      const why = h('p', {}, 'A name in a file says nothing about whether the connection works. The indicator stays grey, "not checked from here", until your running system reports a status with the time it was checked.');
      if (id === ABOUT) {
        return [back('#/systems', 'Systems'), h('h2', {}, 'No systems named yet'),
          h('p', {}, 'Each external system your plan names would get a card with a grey status dot and a last-checked time.'),
          h('p', {}, 'What has to happen first: your plan has to name the systems this connects to.'), why, sourceLine(data, src)];
      }
      const s = arr(derived(data).systems)[Number(id)];
      if (s === undefined) return notFound('#/systems', 'Systems');
      return [back('#/systems', 'Systems'), h('h2', {}, labelOf(s)),
        h('p', {}, h('span', { class: 'dot', title: 'unknown' }), 'Status: not checked from here. Last checked: never.'), why, sourceLine(data, src)];
    },
  };

  // ── Data model ──────────────────────────────────────────────────────────────
  /** Requirements grouped by cluster: the inputs a model is derived from. Not tables. */
  function clusters(data) {
    const out = new Map();
    for (const r of arr(data.plan && data.plan.requirements)) {
      const k = r.cluster || 'unclustered';
      if (!out.has(k)) out.set(k, []);
      out.get(k).push(r);
    }
    return out;
  }
  CC.tabs['data-model'] = {
    render(data) {
      const groups = clusters(data);
      const src = `${CC.FILES.plan} → requirements[]`;
      const cards = groups.size
        ? [...groups.entries()].map(([k, reqs]) => card(data, `#/data-model/${enc(k)}`, `Cluster: ${k}`,
          h('p', {}, `${reqs.length} requirement(s) to derive tables from. No table is drafted yet.`), src))
        : [card(data, `#/data-model/${ABOUT}`, 'No data model yet',
          h('p', { class: 'empty' }, 'Your plan has no requirements to derive tables from.'), src)];
      return [h('h2', {}, 'Data model'),
        h('p', { class: 'muted' }, 'Tables are derived from your requirements and shown for review before any is created. Nothing here is a table that exists.'),
        h('div', { class: 'cards' }, cards)];
    },
    detail(data, id) {
      const src = `${CC.FILES.plan} → requirements[]`;
      if (id === ABOUT) {
        return [back('#/data-model', 'Data model'), h('h2', {}, 'No data model yet'),
          h('p', {}, 'This tab will show the tables behind your system, with their fields and relationships, each named for what it stores in your domain rather than after a vendor.'),
          h('p', {}, 'What has to happen first: your plan needs requirements. The model is then drafted from them and shown for review before any table is created.'),
          sourceLine(data, src)];
      }
      const reqs = clusters(data).get(id);
      if (!reqs) return notFound('#/data-model', 'Data model');
      return [back('#/data-model', 'Data model'), h('h2', {}, `Cluster: ${id}`),
        h('p', { class: 'muted' }, 'The requirements a model for this cluster would be derived from. No table has been drafted.'),
        h('table', {}, h('tr', {}, ['Requirement', 'Kind', 'Statement'].map((x) => h('th', {}, x))),
          reqs.map((r) => h('tr', {}, h('td', {}, r.id), h('td', {}, orNotSet(r.kind)), h('td', {}, orNotSet(r.statement))))),
        sourceLine(data, src)];
    },
  };
})();
