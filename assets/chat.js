/*
 * Knowledge base question box. Deterministic: it answers only from the data already loaded on
 * this page, makes no network request and calls no model. Every answer names the tab and the
 * file field it came from. If the data cannot answer, it says so instead of guessing.
 */
window.CC = window.CC || {};

(function () {
  const { h, arr } = CC.ui;
  const STOP = new Set(['the', 'a', 'an', 'of', 'to', 'is', 'are', 'what', 'which', 'how', 'many', 'my', 'in', 'for', 'and', 'or', 'does', 'do', 'any', 'there', 'this', 'that', 'about', 'with', 'on', 'me', 'show', 'list', 'tell', 'story', 'stories', 'mention', 'mentions', 'contain', 'contains', 'find', 'have', 'has', 'where']);

  const words = (q) => q.toLowerCase().match(/[a-z0-9_.-]+/g) || [];
  const has = (q, ...keys) => keys.some((k) => q.includes(k));
  const answer = (text, tab, field) => ({ text, cite: `${tab} tab · ${field}` });
  const count = (list, one, many) => `${list.length} ${list.length === 1 ? one : many}`;

  /** Rules are checked in order; the first that matches answers. */
  function ask(data, question) {
    const q = question.toLowerCase().trim();
    const plan = data.plan || {};
    const d = plan.derived || {};
    const t = data.progress && data.progress.totals;
    if (!q) return null;

    if (has(q, 'as of', 'fresh', 'how old', 'last sync', 'when was')) {
      const age = CC.dataAge(data.manifest);
      return age ? answer(`The data is as of ${age.absolute} (${age.relative}).`, 'Every', `${CC.FILES.manifest} → generated_at`)
        : answer('The data date is unknown: the manifest is missing or has no generated_at.', 'Every', CC.FILES.manifest);
    }
    // A question about stories searches story titles first, so "stories about agents" finds stories.
    if (has(q, 'story', 'stories')) {
      const found = searchStories(plan, q);
      if (found) return found;
    }
    if (has(q, 'verified', 'progress', 'criteria', 'points', 'how far')) {
      if (!t) return answer('The progress file has no totals.', 'Overview', `${CC.FILES.progress} → totals`);
      return answer(`${t.stories_verified} of ${t.stories_total} stories verified; ${t.criteria_passed} of ${t.criteria_total} criteria passed; ${t.points_awarded} points. These are the platform's totals as of its last sync.`,
        'Overview', `${CC.FILES.progress} → totals`);
    }
    if (has(q, 'release')) {
      const r = arr(plan.releases);
      return answer(r.length ? `${count(r, 'release', 'releases')}: ${r.map((x) => `${x.key} ${x.name} (${arr(x.story_ids).length})`).join('; ')}.` : 'Your plan has no releases.',
        'Project management', `${CC.FILES.plan} → releases`);
    }
    if (has(q, 'measure', 'outcome', 'target', 'kpi')) {
      const m = arr(d.measures);
      return answer(m.length ? `${count(m, 'measure', 'measures')}: ${m.map((x) => x.statement || x.id).join('; ')}.` : 'Your plan has no measures and no numeric target yet.',
        'Outcomes', `${CC.FILES.plan} → derived.measures`);
    }
    if (has(q, 'role', 'user', 'who is it for', 'persona')) {
      const r = arr(d.roles);
      return answer(r.length ? `${count(r, 'role', 'roles')}: ${r.map((x) => (typeof x === 'string' ? x : x.name || x.role)).join(', ')}.` : 'Your stories do not name a role yet.',
        'Users and use case', `${CC.FILES.plan} → derived.roles`);
    }
    if (has(q, 'guardrail', 'must never', 'safe')) {
      const g = arr(d.guardrails);
      return answer(g.length ? `${count(g, 'guardrail', 'guardrails')}: ${g.map((x) => x.statement || x.id).join('; ')}.` : 'Your plan has no guardrail (no requirement typed SAFE).',
        'Guardrails', `${CC.FILES.plan} → derived.guardrails`);
    }
    if (has(q, 'system', 'integration', 'connect')) {
      const s = arr(d.systems);
      return answer(s.length ? `${count(s, 'system', 'systems')} named: ${s.join(', ')}. None is checked from this page.` : 'Your plan names no external system.',
        'Systems', `${CC.FILES.plan} → derived.systems`);
    }
    if (has(q, 'requirement', 'traceab')) {
      const r = arr(plan.requirements);
      return answer(r.length ? `${count(r, 'requirement', 'requirements')} in your plan.` : 'Your plan has no requirements yet.',
        'Knowledge base', `${CC.FILES.plan} → requirements`);
    }
    if (has(q, 'no_tool_grants', 'tool grant', 'authority', 'effective')) {
      const snap = data.agentDomain;
      if (!snap || !Array.isArray(snap.authority)) return answer('The public snapshot is not loaded, so effective authority cannot be shown.', 'Overview', CC.FILES.agentDomain);
      const n = snap.authority.filter((c) => arr(c.reasons).includes('no_tool_grants')).length;
      return answer(`The no_tool_grants rule currently constrains ${n} of ${snap.authority.length} capabilities.${n === 0 ? ' None is approved above autonomy:R2, so it binds nothing.' : ''}`,
        'Overview', `${CC.FILES.agentDomain} → authority[].reasons, authority_rule`);
    }
    if (has(q, 'agent', 'owner', 'autonomy', 'employee')) {
      const ag = data.agentDomain && data.agentDomain.agent;
      if (ag && ag.exists) {
        return answer(`Your employee exists and is ${ag.enabled ? 'enabled' : 'disabled'}, with agent-level autonomy "${ag.autonomy_level || 'not recorded'}" (not a ladder rung) and ${count(arr(ag.tools_granted), 'tool', 'tools')} granted. Capability ceilings are not in the public snapshot.`,
          'Overview', `${CC.FILES.agentDomain} → agent`);
      }
      if (ag && ag.exists === false) return answer('No agent yet: no AI employee is linked to this domain.', 'Overview', `${CC.FILES.agentDomain} → agent`);
      const a = arr(plan.agents);
      return answer(a.length ? `${count(a, 'agent', 'agents')}: ${a.map((x) => x.name).join(', ')}. No runs are recorded.`
        : 'Your plan has no scoped agent roster, and the public snapshot is not loaded. Autonomy levels and capability ceilings are not in your data files.',
      'AI agents', `${CC.FILES.plan} → agents`);
    }
    if (has(q, 'project', 'name', 'what is this', 'descriptor')) {
      const p = plan.project || {};
      return p.name ? answer(`${p.name}: ${p.descriptor || 'no descriptor in your plan'}.`, 'Overview', `${CC.FILES.plan} → project`)
        : answer('The plan has no project name.', 'Overview', `${CC.FILES.plan} → project`);
    }

    return searchStories(plan, q) || { text: 'I can’t answer that from the data on this page.', cite: null };
  }

  /** Stories whose id or title shares a meaningful word with the question, or null. */
  function searchStories(plan, q) {
    const terms = words(q).filter((w) => w.length > 2 && !STOP.has(w));
    if (!terms.length) return null;
    const hits = arr(plan.stories).filter((s) => {
      const hay = `${s.id} ${s.title || ''}`.toLowerCase();
      return terms.some((w) => hay.includes(w));
    });
    if (!hits.length) return null;
    const shown = hits.slice(0, 5);
    return answer(`${count(hits, 'story matches', 'stories match')}${hits.length > 5 ? ' (first 5 shown)' : ''}: ${shown.map((s) => `${s.id} (${s.title})`).join('; ')}.`,
      'Project management', `${CC.FILES.plan} → stories[].id, title`);
  }

  function render(data) {
    const out = h('div', { class: 'chat-answer', 'aria-live': 'polite' },
      h('span', { class: 'muted' }, 'Ask about releases, progress, stories, measures, roles, guardrails, systems, requirements, agents, authority or how fresh the data is.'));
    const input = h('input', { type: 'text', class: 'chat-input', 'aria-label': 'Question', placeholder: 'e.g. Which stories mention signal?' });
    const form = h('form', { class: 'chat' }, input, h('button', { type: 'submit' }, 'Ask'));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const a = ask(data, input.value);
      if (!a) return;
      out.replaceChildren(h('p', {}, a.text), a.cite ? h('p', { class: 'muted' }, `From: ${a.cite}`) : null,
        data.mode === 'sample' ? h('p', { class: 'muted' }, 'This answer is from SAMPLE data.') : null);
    });
    return h('div', { class: 'chat-panel' }, form, out,
      h('p', { class: 'muted' }, 'Answers come only from the data loaded on this page. No question leaves your browser.'));
  }

  CC.chat = { render, ask };
})();
