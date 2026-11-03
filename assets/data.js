/*
 * The one place the Command Center gets its data.
 *
 * Real mode reads the four files the platform commits into .colaberry/, at runtime, every
 * page load. Nothing from them is copied into this code. Sample mode swaps in sample.js,
 * which is made-up data and is labelled as such everywhere it shows.
 *
 * `agent-domain.json` is the committed snapshot of three signed-in admin endpoints. The page is
 * public, so it reads the snapshot instead of the endpoints (platform agentDomainSnapshot.ts,
 * owner decision of 2 Nov 2026), and names the endpoint each part came from.
 *
 * Fields we don't know are ignored, and a newer schema_version still renders, because the
 * platform only ever adds fields (docs/stories/STORY-000.md, "Where the data comes from").
 */
window.CC = window.CC || {};

CC.FILES = {
  plan: '.colaberry/plan.json',
  progress: '.colaberry/progress.json',
  manifest: '.colaberry/manifest.json',
  agentDomain: '.colaberry/agent-domain.json',
};
CC.BUILT_AGAINST_SCHEMA = 2;
CC.AGENT_DOMAIN_SCHEMA = 'colaberry.agent-domain/v1';
CC.STALE_AFTER_DAYS = 7;

/**
 * Fetch one JSON file and classify the result. Never throws, never guesses:
 *   loaded  — parsed JSON object
 *   empty   — HTTP 200 with an empty body
 *   missing — HTTP error or the request failed
 *   invalid — a body that is not a JSON object
 */
async function fetchJson(path) {
  let res;
  try {
    res = await fetch(path, { cache: 'no-store' });
  } catch {
    return { status: 'missing', error: `${path} could not be loaded (request failed)` };
  }
  if (!res.ok) return { status: 'missing', error: `${path} could not be loaded (HTTP ${res.status})` };
  const text = await res.text();
  if (!text.trim()) return { status: 'empty', error: `${path} is empty` };
  try {
    const value = JSON.parse(text);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return { status: 'invalid', error: `${path} is not a JSON object` };
    return { status: 'loaded', value };
  } catch {
    return { status: 'invalid', error: `${path} is not valid JSON` };
  }
}

/** A snapshot that does not declare the agent-domain schema is not trusted as one. */
function checkAgentDomain(result) {
  if (result.status !== 'loaded') return result;
  const schema = result.value.schema;
  if (typeof schema !== 'string' || !schema.startsWith('colaberry.agent-domain/')) {
    return { status: 'invalid', error: `${CC.FILES.agentDomain} does not declare the ${CC.AGENT_DOMAIN_SCHEMA} schema` };
  }
  return result;
}

/**
 * Load the real data. Returns { plan, progress, manifest, agentDomain, status, errors }. Any
 * file that fails is null, its status says why, and its error is listed; the page then shows
 * that error rather than any number. `status[key]` is 'loading' until that file settles, and
 * `onUpdate` is called as each one does, so a panel can show it is still loading.
 */
CC.loadReal = async function loadReal(onUpdate) {
  const out = { mode: 'real', plan: null, progress: null, manifest: null, agentDomain: null, status: {}, errors: [] };
  for (const key of Object.keys(CC.FILES)) out.status[key] = 'loading';
  if (onUpdate) onUpdate(out);
  await Promise.all(Object.entries(CC.FILES).map(async ([key, path]) => {
    let r = await fetchJson(path);
    if (key === 'agentDomain') r = checkAgentDomain(r);
    out.status[key] = r.status;
    if (r.status === 'loaded') out[key] = r.value;
    else out.errors.push(r.error);
    if (onUpdate) onUpdate(out);
  }));
  const schema = out.agentDomain && out.agentDomain.schema;
  if (schema && schema !== CC.AGENT_DOMAIN_SCHEMA) {
    out.schemaNote = `${CC.FILES.agentDomain} declares ${schema}; this page was built against ${CC.AGENT_DOMAIN_SCHEMA} and still renders the fields it knows.`;
  }
  for (const key of ['plan', 'progress']) {
    const v = out[key] && out[key].schema_version;
    if (out[key] && typeof v === 'number' && v > CC.BUILT_AGAINST_SCHEMA) {
      out.schemaNote = `${CC.FILES[key]} declares schema_version ${v}; this page was built against ${CC.BUILT_AGAINST_SCHEMA} and still renders the fields it knows.`;
    }
  }
  return out;
};

CC.loadSample = function loadSample() {
  return Object.assign({ mode: 'sample', errors: [] }, CC.sampleData());
};

/**
 * "Data as of": an absolute date in Central time plus a relative age, and whether it is stale.
 * Returns null when the manifest has no usable generated_at, so callers show that plainly.
 */
CC.dataAge = function dataAge(manifest, now = new Date()) {
  const raw = manifest && manifest.generated_at;
  const at = raw ? new Date(raw) : null;
  if (!at || Number.isNaN(at.getTime())) return null;
  const days = (now.getTime() - at.getTime()) / 86400000;
  const absolute = at.toLocaleString('en-US', {
    timeZone: 'America/Chicago', day: 'numeric', month: 'long', year: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
  });
  let relative;
  if (days < 1) relative = 'less than a day ago';
  else if (days < 2) relative = '1 day ago';
  else relative = `${Math.floor(days)} days ago`;
  return { absolute, relative, days, stale: days > CC.STALE_AFTER_DAYS };
};
