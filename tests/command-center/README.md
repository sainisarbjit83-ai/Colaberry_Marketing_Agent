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

- **`render.test.js`** serves the site on ports 8765 and 8781–8792 (plus 9333 for Edge's debugging port) and loads every tab in
  headless Edge, in Real and Sample mode. It opens every card link it finds, and checks
  edited, stale and missing copies of the data files. Set `EDGE_PATH` if Edge is not at
  `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`.
- **`chat.test.js`** runs the question-box logic in Node against the repo's own data files,
  with and without the agent-domain snapshot.
- **`serve.js`** is the small localhost-only server the browser suite uses. An optional fourth
  argument names paths it never answers, which is how the suite sees a panel still loading.

Set `CC_REPO` to test a different copy, for example an export of a commit:
`CC_REPO=/path/to/export node tests/command-center/render.test.js`.

## The six STORY-000 panels

The Overview's six panels read `.colaberry/agent-domain.json`. The browser suite checks them on
the real snapshot, then on copies where the snapshot is:

| Copy | Snapshot | Expected on every panel |
|---|---|---|
| F | deleted | `missing`, with the HTTP 404 named |
| G | not JSON | `invalid` |
| H | an empty file | `empty` |
| I | edited: no agent, one pending tool request, one capability capped by `no_tool_grants` | panel 1 `empty`; the count of 1 and the pending request shown as not granted |
| J | never answered by the server | `loading`, while the plan cards still render |
| K | edited: one capability with no ceiling or rationale, one with a non-rung approved value and its note, one with an empty rationale, one with a null ceiling | each gap stated in words in panel 3, never blank; R8 still unreachable by fact |
| L | edited: the five autonomy fields removed from every capability (a snapshot from before AF12.3) | panel 3 says ceilings are not in the snapshot and draws no ceiling table |

On the real snapshot, panel 3 is checked capability by capability against `agent-domain.json`:
approved, ceiling, effective and ceiling reason in their own columns, `reasons` kept apart from
`ceiling_reason`, R8 unreachable by fact in every strip, and R9 ceilings stated as unable to rise
above R7 today.

Copy J is read over Edge's DevTools protocol (debugging port 9333), not `--dump-dom`. Virtual
time waits for every pending request, so a file that never arrives would never dump. A plain
dump fires at the load event, which can come before the other files arrive. The test therefore
polls until the plan cards are drawn, then reads the page.

The ten rung descriptions are checked against a copy of the platform's `AUTONOMY_MEANINGS`
written into the test, not against the page's own list.

## Expected to change when the platform syncs

`chat.test.js` checks some answers against today's data: the "Data as of" date, the
`6 of 71` totals, the three releases, the agent record and the `no_tool_grants` count of
`0 of 64`. When a platform sync rewrites `.colaberry/`, update those expectations to the new data
rather than treating the failure as a page bug. `render.test.js` takes its story ids and figures
from the data files. The exception is one check that names release `r1` ("Legacy migration
plan"), which needs updating if that release changes.
