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
