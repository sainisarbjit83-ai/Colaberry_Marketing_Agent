/*
 * Command Center: router, shared header, and the Overview tab.
 * The other eight tabs live in tabs-plan.js and tabs-work.js and register into CC.tabs.
 *
 * Every value shown comes from CC.load*() at runtime. Text that is NOT from the data files
 * (platform rules) says where it comes from.
 */
window.CC = window.CC || {};
CC.tabs = CC.tabs || {};

const { h, orNotSet, card, detailRow, back, sourceLine, PLATFORM_RULES_SOURCE } = CC.ui;

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'outcomes', label: 'Outcomes' },
  { id: 'users', label: 'Users and use case' },
  { id: 'guardrails', label: 'Guardrails' },
  { id: 'systems', label: 'Systems' },
  { id: 'project', label: 'Project management' },
  { id: 'agents', label: 'AI agents' },
  { id: 'knowledge', label: 'Knowledge base' },
  { id: 'data-model', label: 'Data model' },
];

/**
 * The page opens in Real mode every time. Sample is chosen with the switch and lasts only for
 * the current page view. `?mode=sample` in the URL also selects it, so a test or a demo link can
 * open it deliberately; the plain address always opens Real.
 */
let modeOverride = null;
function getMode() {
  if (modeOverride) return modeOverride;
  return new URLSearchParams(location.search).get('mode') === 'sample' ? 'sample' : 'real';
}

function parseRoute() {
  const parts = (location.hash.replace(/^#\/?/, '') || 'overview').split('/');
  const tab = TABS.some((t) => t.id === parts[0]) ? parts[0] : 'overview';
  return { tab, detail: parts[1] ? CC.ui.dec(parts[1]) : null };
}

// ── Shared header ─────────────────────────────────────────────────────────────

function renderHeader(data, route) {
  const project = data.plan && data.plan.project;
  const age = CC.dataAge(data.manifest);
  let stamp;
  if (!age) {
    stamp = h('div', { class: 'data-stamp is-error' },
      `Data as of: unknown. ${CC.FILES.manifest} is missing or has no generated_at.`);
  } else if (age.stale) {
    stamp = h('div', { class: 'data-stamp is-warning', role: 'status' },
      `Data as of ${age.absolute} (${age.relative}). Over a week old: sync from the portal to refresh.`);
  } else {
    stamp = h('div', { class: 'data-stamp' }, `Data as of ${age.absolute} (${age.relative})`);
  }

  const mode = data.mode;
  const switcher = h('div', { class: 'mode-switch' }, 'Data:',
    h('button', { type: 'button', 'aria-pressed': String(mode === 'real'), 'data-mode': 'real' }, 'Real'),
    h('button', { type: 'button', 'aria-pressed': String(mode === 'sample'), 'data-mode': 'sample' }, 'Sample'));
  switcher.addEventListener('click', (e) => {
    const m = e.target && e.target.getAttribute('data-mode');
    if (m && m !== mode) { modeOverride = m; start(); }
  });

  const tabs = h('nav', { class: 'tabs', 'aria-label': 'Command Center tabs' },
    TABS.map((t) => h('a', { href: `#/${t.id}`, 'aria-current': t.id === route.tab ? 'page' : null }, t.label)));

  return h('header', { class: 'header' },
    h('div', { class: 'header-top' },
      h('div', {},
        h('p', { class: 'title' }, 'Command Center: ', project ? orNotSet(project.name) : 'project name unavailable'),
        h('div', { class: 'subtitle' }, project ? orNotSet(project.descriptor, 'no descriptor in your plan') : '')),
      stamp, switcher),
    tabs);
}

function sampleBanner(data) {
  return data.mode === 'sample'
    ? h('div', { class: 'banner is-sample', role: 'note' },
      'SAMPLE DATA: everything on this screen is made up to show the layout. None of it describes this project. Switch to Real to see your data.')
    : null;
}

// ── Overview ──────────────────────────────────────────────────────────────────

function overviewCards(data) {
  const plan = data.plan || {};
  const totals = (data.progress && data.progress.totals) || null;
  const releases = Array.isArray(plan.releases) ? plan.releases : [];
  const systems = (plan.derived && Array.isArray(plan.derived.systems)) ? plan.derived.systems : [];

  const where = releases.length === 0
    ? h('p', { class: 'empty' }, 'Your plan has no releases yet.')
    : h('div', {},
      h('ul', {}, releases.map((r) => {
        const n = (r.story_ids || []).length;
        return h('li', {}, `${r.key}: ${r.name} (${n} ${n === 1 ? 'story' : 'stories'})`);
      })),
      plan.schedule
        ? h('p', { class: 'muted' }, 'Build ', orNotSet(plan.schedule.build_start), ' to ', orNotSet(plan.schedule.build_end))
        : h('p', { class: 'empty' }, 'Your plan has no schedule and no release dates, so which release you are in cannot be shown.'));

  const progress = !totals
    ? h('p', { class: 'empty' }, 'No totals in the progress file.')
    : h('div', {},
      h('div', { class: 'big' }, `${totals.stories_verified} of ${totals.stories_total} stories verified`),
      h('div', {}, `${totals.criteria_passed} of ${totals.criteria_total} criteria passed · ${totals.points_awarded} points`),
      h('p', { class: 'muted' }, 'These totals are written by the platform when it syncs. Criteria ticked since then are not counted here until the next sync. Progress is not authority: nothing here raises an agent’s autonomy.'));

  const live = systems.length === 0
    ? h('p', { class: 'empty' }, 'Nothing is reported live. Your plan names no external system.')
    : h('ul', {}, systems.map((s) => h('li', {}, h('span', { class: 'dot', title: 'unknown' }), `${s}: not checked from here`)));

  const authority = h('div', {},
    h('p', {}, 'Your AI employee’s status and autonomy are not available on this page: they need a signed-in platform endpoint, and a public static page holds no credentials.'),
    h('p', { class: 'muted' }, 'Draft is not approved. R8 (agent-to-agent handoff) does not exist in this platform, so it is unreachable by fact.'));

  return [
    card(data, '#/overview/project', 'What this is',
      h('div', {}, h('div', { class: 'big' }, orNotSet(plan.project && plan.project.name)),
        h('p', {}, orNotSet(plan.project && plan.project.descriptor, 'no descriptor in your plan'))),
      `${CC.FILES.plan} → project`),
    card(data, '#/overview/releases', 'Where you are', where, `${CC.FILES.plan} → releases, schedule`),
    card(data, '#/overview/progress', 'How far along', progress, `${CC.FILES.progress} → totals`),
    card(data, '#/overview/live', 'What is live', live, `${CC.FILES.plan} → derived.systems`),
    card(data, '#/overview/authority', 'Your AI employee and its authority', authority, PLATFORM_RULES_SOURCE),
  ];
}

function renderOverview(data) {
  return [h('h2', {}, 'Overview'), h('div', { class: 'cards' }, overviewCards(data))];
}

const OVERVIEW_DETAILS = {
  project(data) {
    const p = (data.plan && data.plan.project) || {};
    return [h('h2', {}, 'What this is'), h('table', {},
      detailRow('Name', orNotSet(p.name)),
      detailRow('Descriptor', orNotSet(p.descriptor)),
      detailRow('Plan version', orNotSet(p.plan_version)),
      detailRow('Plan SHA-256', p.plan_sha256 ? h('code', {}, p.plan_sha256) : orNotSet(null)),
      detailRow('Repository URL', orNotSet(p.repo_url))),
    sourceLine(data, `${CC.FILES.plan} → project`)];
  },
  releases(data) {
    const releases = (data.plan && Array.isArray(data.plan.releases)) ? data.plan.releases : [];
    const s = data.plan && data.plan.schedule;
    return [h('h2', {}, 'Where you are'),
      releases.length === 0 ? h('p', { class: 'empty' }, 'Your plan has no releases yet.') : h('table', {},
        h('tr', {}, ['Release', 'Name', 'Starts', 'Ends', 'Stories', 'Demo target'].map((x) => h('th', {}, x))),
        releases.map((r) => h('tr', {},
          h('td', {}, r.key), h('td', {}, r.name), h('td', {}, orNotSet(r.starts_on)), h('td', {}, orNotSet(r.ends_on)),
          h('td', {}, String((r.story_ids || []).length)), h('td', {}, r.is_demo_target ? 'yes' : 'no')))),
      s ? h('table', {},
        detailRow('Build start', orNotSet(s.build_start)), detailRow('Build end', orNotSet(s.build_end)),
        detailRow('Demo day', orNotSet(s.demo_day)), detailRow('Demo release', orNotSet(s.demo_release_key)))
        : h('p', { class: 'empty' }, 'Your plan has no schedule (plan.schedule is empty). The full timeline is on the Project management tab.'),
      sourceLine(data, `${CC.FILES.plan} → releases, schedule`)];
  },
  progress(data) {
    const t = data.progress && data.progress.totals;
    const fields = ['stories_total', 'stories_verified', 'stories_submitted', 'stories_in_progress', 'stories_not_started', 'criteria_total', 'criteria_passed', 'points_awarded'];
    return [h('h2', {}, 'How far along'),
      t ? h('table', {}, fields.map((f) => detailRow(f, orNotSet(t[f], 'not in the file')))) : h('p', { class: 'empty' }, 'No totals in the progress file.'),
      h('p', {}, 'These are the platform’s own totals, read as written. This page does not recount them.'),
      h('p', { class: 'muted' }, 'Progress is not authority. A story marked complete, elapsed time, a good conversation or a mocked test passing never raises an agent’s autonomy (promotionCriteria.ts, NON_PROMOTING_SIGNALS). A named human promotes an agent, one rung at a time, on evidence.'),
      sourceLine(data, `${CC.FILES.progress} → totals`)];
  },
  live(data) {
    const systems = (data.plan && data.plan.derived && Array.isArray(data.plan.derived.systems)) ? data.plan.derived.systems : [];
    return [h('h2', {}, 'What is live'),
      h('p', {}, 'Whether anything is connected is a fact about your running system, and these files cannot tell it. Every indicator stays grey and says "not checked from here" until your own system reports otherwise.'),
      h('p', {}, 'Before anything can be reported live, your system has to be built, running, and writing a status this page can read, with the time it was last checked; until then, grey is the honest answer.'),
      systems.length === 0 ? h('p', { class: 'empty' }, 'Your plan names no external system yet.')
        : h('ul', {}, systems.map((s) => h('li', {}, h('span', { class: 'dot', title: 'unknown' }), `${s}: not checked from here`))),
      sourceLine(data, `${CC.FILES.plan} → derived.systems`)];
  },
  authority() {
    return [h('h2', {}, 'Your AI employee and its authority'),
      h('p', {}, 'Not available on this page. The employee’s record, its enabled state, autonomy level and tool grants come from signed-in platform endpoints. This page is public and static, so it holds no credentials and calls no such endpoint.'),
      h('ul', {},
        h('li', {}, 'Draft is not approved. A capability in draft has not been agreed by anyone.'),
        h('li', {}, 'R8, coordinated handoff between agents, does not exist in this platform today, so it is unreachable by fact rather than by choice.'),
        h('li', {}, 'Without granted tools, the platform caps any capability at R2 (effectiveAuthority, no_tool_grants). Whether any tool is granted to this domain’s agent cannot be read from this page.'),
        h('li', {}, 'Progress shown on this page is never authority.')),
      h('p', { class: 'muted' }, `Source: ${PLATFORM_RULES_SOURCE}`)];
  },
};

CC.tabs.overview = {
  render: renderOverview,
  detail(data, id) {
    const fn = OVERVIEW_DETAILS[id];
    return [back('#/overview', 'Overview'), ...(fn ? fn(data) : [h('p', { class: 'empty' }, 'No such detail page.')])];
  },
};

// ── Boot ──────────────────────────────────────────────────────────────────────

let current = null;

function render() {
  const route = parseRoute();
  const tab = TABS.find((t) => t.id === route.tab);
  const impl = CC.tabs[tab.id];
  const root = document.getElementById('app');
  root.replaceChildren();
  root.append(renderHeader(current, route));
  const main = h('main', {}, sampleBanner(current));
  if (current.errors.length) {
    main.append(h('div', { class: 'banner is-error', role: 'alert' },
      'Some data could not be loaded, so nothing from those files is shown: ', current.errors.join('; ')));
  }
  if (current.schemaNote) main.append(h('div', { class: 'banner' }, current.schemaNote));
  let content;
  if (!impl) content = [h('h2', {}, tab.label), h('p', { class: 'empty' }, 'This tab failed to load.')];
  else if (route.detail) content = impl.detail(current, route.detail);
  else content = impl.render(current);
  main.append(...content);
  root.append(main);
}

async function start() {
  current = getMode() === 'sample' ? CC.loadSample() : await CC.loadReal();
  render();
}

window.addEventListener('hashchange', () => { if (current) render(); });
start();
