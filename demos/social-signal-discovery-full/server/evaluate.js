#!/usr/bin/env node
/*
 * Run and inspect evaluations from the command line. Local only.
 *
 *   node demos/social-signal-discovery-full/server/evaluate.js            run one evaluation (demo database)
 *   node demos/social-signal-discovery-full/server/evaluate.js --memory   run in a throwaway in-memory database
 *   node demos/social-signal-discovery-full/server/evaluate.js --list     list stored evaluations
 *   node demos/social-signal-discovery-full/server/evaluate.js --show EVAL-0001
 *
 * The demo database is tmp/ssd-full/demo.sqlite (gitignored).
 */
'use strict';

const { open } = require('./db');
const { createAgent } = require('./agent');
const { formatReport } = require('./evaluation/format');

function main(argv) {
  const { db, file } = open(argv.includes('--memory') ? ':memory:' : undefined);
  const agent = createAgent({ db });
  if (argv.includes('--list')) {
    const rows = agent.evaluation.list();
    console.log(rows.length ? rows.map((r) => `${r.evalRunId}  ${r.createdAt}  ${r.benchmark}  ${r.provider}  quality ${r.quality}${r.accuracy ? ` acc ${r.accuracy.numerator}/${r.accuracy.denominator}` : ''}  software ${r.software}  results ${r.resultsHash}`).join('\n') : `No evaluations stored in ${file}.`);
    return 0;
  }
  const show = argv.indexOf('--show');
  if (show !== -1) {
    const found = agent.evaluation.get(argv[show + 1]);
    if (!found) { console.error(`No evaluation ${argv[show + 1]} in ${file}.`); return 1; }
    console.log(formatReport(found.report));
    return 0;
  }
  console.log(formatReport(agent.evaluation.run()));
  console.log(`\nStored in ${file}.`);
  return 0;
}

process.exitCode = main(process.argv.slice(2));
