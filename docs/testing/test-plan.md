# Test Plan

## Purpose

This document describes how the Adamas2Aurum team approaches
testing: what we test, what we deliberately don't, the tools we use,
and the policies that govern tests in the development workflow.

## Scope

### In scope

- **Backend HTTP APIs** - every route that reads or writes game
  state is expected to have at least one integration test covering
  the success path and one covering the failure path (auth
  rejection, validation rejection, or resource missing).
- **Business-logic services** - pure or near-pure modules such as
  `services/card_award.js` and `services/movementTrust.js` are
  expected to have thorough unit tests, because their logic is
  where correctness bugs would be most costly and where mocking is
  easiest.
- **Frontend utility modules** - pure functions with no DOM
  dependency (geolocation wrappers, general helpers) are tested
  with Jest running in a `jsdom` environment.

### Out of scope

- **Live third-party services.** The test suite never calls the real
  database, the real Better Auth provider, or the Aiven hosted MySQL.
  Every external dependency is mocked.
- **End-to-end browser tests.** We do not currently run Playwright
  or Cypress. A sprint 3 goal is to add DOM tests for the leaderboard
  page; full browser-driven E2E is out of scope for the semester.
- **Load and performance testing.** No throughput or latency
  benchmarks are run. Test scope is correctness, not performance.
- **Manual UI walkthroughs.** Those are captured separately under
  user feedback once that process is formalised (see "Gaps and
  future work" below).

## Tools

| Tool | Role |
| --- | --- |
| [Jest](https://jestjs.io/) `^29.7.0` | Test runner for both backend and frontend suites |
| [`jest-environment-jsdom`](https://github.com/jsdom/jsdom) `^29.7.0` | DOM environment for frontend tests |
| Node `--experimental-vm-modules` | Required flag to run Jest under native ESM (our codebase is `"type": "module"`) |
| [Gitea Actions](https://docs.gitea.io/en-us/usage/actions/overview/) | Runs tests automatically on push and on pull requests |

Backend tests run in the default `node` environment; frontend tests
run in `jsdom`. This split is configured in `package.json` under the
`jest.projects` array.

## Configuration

Jest is configured at the repository root in `package.json`:

- **`projects.frontend`** - root `app/src/frontend`, test environment
  `jsdom`, matches `<rootDir>/**/*.test.js`
- **`projects.backend`** - root `app/src/backend`, test environment
  `node`, matches `<rootDir>/**/*.test.js`

Test files live alongside the code they test and are named
`*.test.js`. There is no separate `__tests__/` directory.

## Strategy

### What does not earn a test

- Trivial getters, single-line wrappers, or configuration files.
- Code that is inherently non-deterministic (e.g. spawning a
  `watchPosition` polling loop).
- Third-party library behaviour (we trust Jest, Express, and MySQL
  to be tested by their maintainers).

### Mocking philosophy

The test suite **mocks at the boundary of our code**, not deeper:

- **Database** - tests mock the `pool` object from
  `utils/db.js` using `jest.unstable_mockModule`. They assert on
  which SQL statements were issued, not on the SQL engine's
  response.
- **HTTP requests** - tests that need to hit routes spin up a real
  in-process Express app on an ephemeral port and use the built-in
  `fetch`. This exercises routing, middleware, request parsing,
  and response formatting end-to-end, without requiring a running
  server or a network connection.
- **Browser APIs** - frontend tests replace `navigator.geolocation`
  and similar globals with hand-rolled mocks rather than adding a
  DOM mocking library.

This keeps tests fast (the full suite runs in about 1.5 seconds),
deterministic, and free of external dependencies - which means they
run identically on every developer machine and on the CI runner.

## Policy

### Every pull request

Every pull request that targets `dev` or `main` must pass the CI
workflow defined in `.gitea/workflows/test.yml`:

1. `npm ci` at the repository root
2. `npm ci --prefix app/src/backend`
3. `npm test`

A PR cannot be merged with a failing `Tests` job. Formatting is also
enforced by a separate `format-check.yml` workflow.

### Every push

The `test.yml` workflow runs on every push to any branch, not only on
PRs. This means a developer sees a red X on their own branch as soon
as they push a broken test - before opening the PR.

### Adding or changing a test

Test files live next to the code they cover, so the diff that adds a
feature and the diff that tests it are reviewed together. A reviewer
who sees a feature change with no test change is expected to ask why
in the PR comments.

### Coverage

`npm run test:coverage` produces a per-file coverage report. We do
not enforce a numeric threshold yet.

## Gaps and future work

Two items from the Milestone 2 rubric are not yet formalised:

- **User feedback process.** We have not yet run a formal user test
  with a structured collection method. This will be addressed before
  the Sprint 3 submission.
- **Frontend DOM tests.** The leaderboard page (`js/leaderboard.js`)
  and the console page (`js/console.js`) currently have zero
  automated frontend tests. The leaderboard was verified manually in
  the browser; the intent is to refactor it for testability and add
  DOM tests in Sprint 3.

Both items are tracked in the "Testing" section of the Sprint 3
board rather than silently ignored.
