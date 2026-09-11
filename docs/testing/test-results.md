# Test Results

The current state of the test suite as of the latest commit on `main`.
This page is updated at the end of every sprint.

## Summary

| Metric | Value |
| --- | --- |
| Test suites | 3 |
| Total tests | 21 |
| Passing | 21 |
| Failing | 0 |
| Wall-clock runtime | ~1.5 seconds |
| CI job runtime | ~30–60 seconds (including dependency install) |

Every test suite passes on `main` and on every open pull request.
Results are validated automatically by the `test.yml` Gitea Actions
workflow; see "CI evidence" below.

## Per-suite results

| Suite | Project | Tests | Status |
| --- | --- | --- | --- |
| `app/src/backend/routes/leaderboard.test.js` | backend | 9 | ✅ Passing |
| `app/src/backend/services/card_award.test.js` | backend | 10 | ✅ Passing |
| `app/src/frontend/js/geolocation.test.js` | frontend | 1 | ✅ Passing |

## Coverage

Coverage is generated on demand with `npm run test:coverage`. The
numbers below are from the latest run on `main`. We do not currently
enforce a threshold — the goal is visibility, not gatekeeping.

```text
-----------------|---------|----------|---------|---------|-------------------
File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------|---------|----------|---------|---------|-------------------
All files        |   88.37 |       90 |      90 |    87.5 | 
 backend/routes  |   94.44 |      100 |     100 |   93.93 | 
  leaderboard.js |   94.44 |      100 |     100 |   93.93 | 103,183
 frontend/js     |   57.14 |       50 |      75 |   57.14 | 
  geolocation.js |   57.14 |       50 |      75 |   57.14 | 5-6,18
-----------------|---------|----------|---------|---------|-------------------

**Notes on the numbers:**

- **`backend/routes/leaderboard.js` — 94.44% statements, 100% branches,
  100% functions.** The two uncovered lines are at the extreme tail of
  the file (an error branch in `loadMyRank` and a defensive check that
  never fires in practice).
- **`frontend/js/geolocation.js` — 57.14% statements.** Only the happy
  path is currently tested; the error path (permission denied, timeout,
  unsupported browser) is not.
- **Overall 88.37% statements.** This is a solid number for a project
  of this size and reflects a test suite that focuses on
  high-value logic rather than chasing coverage percentages.

Modules that are not imported by any test file are not included in the
coverage report (they are not shown as 0%). This is Jest's default
behaviour; it means the coverage numbers describe the quality of tests
that exist, not the fraction of the codebase under test. The "What is
deliberately not covered" section of the [Test Cases](test-cases.md)
page lists the modules that fall outside the current suite.

## CI evidence

Every push to any branch, and every pull request targeting `dev` or
`main`, triggers the `Tests` workflow (`.gitea/workflows/test.yml`).
The workflow:

1. Checks out the repository
2. Sets up Node.js 20 with npm caching
3. Installs root dependencies (`npm ci`)
4. Installs backend dependencies (`npm ci --prefix app/src/backend`)
5. Runs `npm test`

A failing test blocks the merge. The workflow was introduced by
PR #55 and has run on every subsequent push.

The most recent successful run is visible in the
[Actions tab](https://sdp.ms.wits.ac.za/404-found-us/Adamas2Aurum/actions)
of the main repository.

## How to reproduce locally

```bash
# Install dependencies (root + backend)
npm run install-deps

# Run all tests
npm test

# Run only backend or frontend
npm run test:backend
npm run test:frontend

# Re-run tests on file changes
npm run test:watch

# Generate a coverage report (writes to coverage/)
npm run test:coverage

The suite requires no external services. The database is mocked at
the module level, and HTTP tests run against an in-process Express
app on an ephemeral port. This means the tests produce the same
result on any developer machine, on the CI runner, and offline.

Known non-issues

Two test-adjacent items look like failures but are not:

    The ALTER TABLE statement at the end of schema.sql. MySQL
    does not support IF NOT EXISTS for ALTER TABLE, so the enum
    modification runs every time the schema is applied. It is
    idempotent in effect and produces no error on a re-run.

    Console warnings during tests. The leaderboard router logs
    each request to stdout. Jest surfaces these under the passing
    suite's output. They are log noise, not warnings from the test
    framework.

Gaps and future work

The following are not currently covered and are planned for Sprint 3:

    Frontend DOM tests. js/leaderboard.js, js/console.js, and
    js/main.js have no automated tests. A refactor to make
    leaderboard.js importable in a Jest environment, followed by
    DOM-level tests for its render functions, is the first item on the
    Sprint 3 testing backlog.

    WebSocket battle tests. websocket/battle_socket.js and
    websocket/battle_state.js are untested. These require either a
    WebSocket test harness or a higher-level abstraction; the effort
    is scheduled for Sprint 3.

    Geolocation error-path tests. Only the success path is
    covered. Permission-denied and timeout behaviours should be added.

    User feedback process. Formal user testing has not yet been
    run. This is a Milestone 2 gap that will be addressed before the
    Sprint 3 submission.

