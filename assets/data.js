/*
 * The one place the Command Center gets its data.
 *
 * Real mode reads the three files the platform commits into .colaberry/, at runtime, every
 * page load. Nothing from them is copied into this code. Sample mode swaps in sample.js,
 * which is made-up data and is labelled as such everywhere it shows.
 *
 * Fields we don't know are ignored, and a newer schema_version still renders, because the
 * platform only ever adds fields (docs/stories/STORY-000.md, "Where the data comes from").
 */
window.CC = window.CC || {};

CC.FILES = {
  plan: '.colaberry/plan.json',
  progress: '.colaberry/progress.json',
  manifest: '.colaberry/manifest.json',
};
CC.BUILT_AGAINST_SCHEMA = 2;
CC.STALE_AFTER_DAYS = 7;

/** Fetch one JSON file. A failure names the file instead of returning a guess. */
async function fetchJson(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${path} could not be loaded (HTTP ${res.status})`);
  try {
    return await res.json();
  } catch {
    throw new Error(`${path} is not valid JSON`);
  }
}

/**
 * Load the real data. Returns { plan, progress, manifest, errors }. Any file that fails is
 * null, and its error is listed; the page then shows that error rather than any number.
 */
CC.loadReal = async function loadReal() {
  const out = { mode: 'real', plan: null, progress: null, manifest: null, errors: [] };
  await Promise.all(Object.entries(CC.FILES).map(async ([key, path]) => {
    try { out[key] = await fetchJson(path); } catch (e) { out.errors.push(e.message); }
  }));
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
