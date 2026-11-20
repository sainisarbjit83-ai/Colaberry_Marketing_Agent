# Social Signal Discovery demo tests

Tests for the local demo in `demos/social-signal-discovery/`. Both suites only read the repository
and make no network requests beyond `127.0.0.1`.

```sh
node tests/social-signal-demo/logic.test.js    # pipeline logic in Node
node tests/social-signal-demo/render.test.js   # rendered page in headless Edge (port 8800)
```

Each prints `N passed, M failed` and exits non-zero on failure. Set `EDGE_PATH` if Edge is not at
`C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`.

- **`logic.test.js`** covers: sample records labeled and author-free; URL normalization; both
  deliberate duplicates (by normalized URL and by repeated id); all three classifications with
  reasons; the happy path, result order and evidence fields; relevance ranking (records matching
  more terms first, full-topic phrase matches, a rare word outweighing a common one such as "ai",
  no matching record dropped, date tie-breaks, classification independent of rank); duplicate
  kinds (repeated id versus same URL); the guardrails; running the same
  query twice giving identical results; and failure and boundary cases (empty, non-text,
  stop-words-only and over-length queries, zero matches, the result limit, a guardrail failure).
  It also checks statically that no demo module contains network or browser-storage code.
- **`render.test.js`** loads the page through the Command Center's local server
  (`tests/command-center/serve.js`) and checks the banner, result cards, order, relevance
  explanations, labels, the duplicate messages (a repeated id worded as such), run trace, the
  13-component table (each manager name once, in order, with one of the five statuses),
  no-match and rejected-input messages, and that the page loads no remote files.
