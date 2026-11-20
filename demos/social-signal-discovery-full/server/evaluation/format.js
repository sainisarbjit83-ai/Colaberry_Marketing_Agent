/*
 * Plain-text rendering of an evaluation report, for the command line. Software correctness and
 * classification quality are printed as separate sections and never combined into one score.
 */
'use strict';

const pct = (r) => (r.value === null ? `undefined (${r.reason})` : `${(r.value * 100).toFixed(1)}%  (${r.numerator}/${r.denominator})`);
const pad = (s, n) => String(s).padEnd(n);

/** Stored times are ISO UTC; people read Central time with the zone written out. */
function central(iso) {
  const d = new Date(iso);
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short' })
    .formatToParts(d).map((p) => [p.type, p.value]));
  return `${parts.hour}:${parts.minute} ${parts.dayPeriod} ${parts.timeZoneName} on ${parts.year}-${parts.month}-${parts.day}`;
}

function formatReport(report) {
  const { config: c, software: s, quality: q } = report;
  const out = [
    `Evaluation ${report.evalRunId}  |  ${central(report.createdAt)}  |  results ${report.resultsHash}`,
    `Benchmark ${c.benchmark.id}@${c.benchmark.version} (${c.benchmark.records} records, #${c.benchmark.hash})  |  provider ${c.provider.name}  |  prompt v${c.systemPrompt.version}  |  config ${c.configHash}`,
    `NOTE: ${c.benchmark.label}`,
    '',
    `SOFTWARE CORRECTNESS: ${s.ran ? `${s.passed}/${s.total} checks passed` : 'not run'}`,
    `  ${s.note}`,
    ...s.checks.map((k) => `  [${k.passed ? 'PASS' : 'FAIL'}] ${pad(k.id, 28)} ${k.detail}`),
    '',
    `CLASSIFICATION QUALITY: ${q.status}`,
    `  ${q.note}`,
  ];
  if (q.status !== 'completed') return [...out, `  ${q.reason}`].join('\n');
  out.push(`  Accuracy        ${pct(q.accuracy)}`);
  for (const m of ['precision', 'recall', 'f1']) out.push(`  Macro ${pad(m, 9)} ${q.macro[m].value === null ? 'undefined' : `${(q.macro[m].value * 100).toFixed(1)}%`}  (over ${q.macro[m].labelsIncluded}/${q.macro[m].labelsTotal} labels)`);
  out.push('', `  ${pad('label', 9)} ${pad('support', 8)} ${pad('TP/FP/FN', 9)} ${pad('precision', 22)} ${pad('recall', 22)} f1`);
  for (const [l, r] of Object.entries(q.perLabel)) out.push(`  ${pad(l, 9)} ${pad(r.support, 8)} ${pad(`${r.tp}/${r.fp}/${r.fn}`, 9)} ${pad(pct(r.precision), 22)} ${pad(pct(r.recall), 22)} ${pct(r.f1)}`);
  out.push('', `  Confusion matrix (rows = expected, columns = predicted)`, `  ${pad('', 9)} ${q.confusion.columns.map((x) => pad(x, 8)).join(' ')}`);
  for (const e of q.confusion.rows) out.push(`  ${pad(e, 9)} ${q.confusion.columns.map((x) => pad(q.confusion.matrix[e][x], 8)).join(' ')}`);
  out.push('', `  By difficulty: clear ${q.byDifficulty.clear.correct}/${q.byDifficulty.clear.total}, hard ${q.byDifficulty.hard.correct}/${q.byDifficulty.hard.total}`);
  out.push(`  Mistakes (${q.mistakes.length}):`, ...q.mistakes.map((m) => `    ${m.id} expected ${m.expected}, predicted ${m.predicted ?? 'error'} [${m.difficulty}] - ${m.rationale}`));
  return out.join('\n');
}

module.exports = { formatReport, central };
