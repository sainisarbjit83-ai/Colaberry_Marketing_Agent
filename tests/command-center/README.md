# Command Center tests

Two suites for the static Command Center at the repo root (`index.html`). Both only **read**
the repo. Modified copies of the data files are made in the system temp folder and deleted
afterwards. No network access beyond `127.0.0.1`.

## Run them

From the repo root, with Node 18 or later:

```sh
node tests/command-center/render.test.js   # rendered-page checks (headless Edge)
node tests/command-center/chat.test.js     # Knowledge base question-box checks
```

Each prints `N passed, M failed` and exits non-zero if anything fails.

- **`render.test.js`** serves the site on ports 8765 and 8781–8785 and loads every tab in
  headless Edge, in Real and Sample mode. It opens every card link it finds, and checks
  edited, stale and missing copies of the data files. Set `EDGE_PATH` if Edge is not at
  `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`.
- **`chat.test.js`** runs the question-box logic in Node against the repo's own data files.
- **`serve.js`** is the small localhost-only server the browser suite uses.

Set `CC_REPO` to test a different copy, for example an export of a commit:
`CC_REPO=/path/to/export node tests/command-center/render.test.js`.

## Expected to change when the platform syncs

`chat.test.js` checks some answers against today's data: the "Data as of" date, the
`0 of 71` totals, and the three releases. When a platform sync rewrites `.colaberry/`, update
those expectations to the new data rather than treating the failure as a page bug.
`render.test.js` takes its story ids and figures from the data files. The exception is one check
that names release `r1` ("Legacy migration plan"), which needs updating if that release changes.
