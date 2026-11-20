// Shared setup for the Phase 1 tests: a fresh in-memory demo database per test. Never a file
// outside the OS temp folder, and never any other database.
'use strict';

const path = require('path');

const SERVER = path.resolve(__dirname, '..', '..', 'demos', 'social-signal-discovery-full', 'server');
const req = (p) => require(path.join(SERVER, p));

function freshDb() {
  return req('db').open(':memory:').db;
}

module.exports = { SERVER, req, freshDb };
