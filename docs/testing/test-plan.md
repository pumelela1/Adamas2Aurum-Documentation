---
sidebar_position: 1
---

# Test Plan

## Purpose

This is the authoritative test strategy for **Adamas2Aurum**. It supersedes the Sprint 2 draft that left user feedback and DOM tests as “future work” — both are now formalised and measured.

## Scope

### In scope (automated, run on every push)

- **Backend HTTP APIs** — every router that mutates or reads game state has success + failure paths (auth 401/403, validation 400, not-found 404). New Sprint 3 curation (`events`, `campaigns`, `analytics`) is fully covered (`events.test.js`, `campaigns.test.js`, `analytics.test.js`).
- **Business-logic services** — `services/card_award.js` (once-only, speed bracket, race) and `utils/geo.js` keep 100% coverage.
- **Frontend pure + DOM utilities** — `js/utils.js` (95%), `js/general.js` (100%), `js/icons.js` (100%), `js/campus-style.js` (94.9% — `isInsideCampus`, `createCampusStyle`, `applyChromeTheme`, `addGroundTexture`), `js/auth-helpers.js` (88.8% — `isAdmin`, `redirectAfterLogin`, `updateAuthNav` with DOM, avatar menu), `js/geolocation.js` (57% — wrapper).

### Out of scope (deliberate)

- Live MySQL / Aiven, real Google OAuth, Cloudflare deploy — mocked via `pool` (`jest.unstable_mockModule`) and `fetch` harness.
- Full E2E Playwright/Cypress — out of semester scope; `js/dom` is covered via `jsdom` instead.
- Load/performance — correctness only.

## Tools

| Tool | Role | Version |
|------|------|---------|
| Jest 29 + `--experimental-vm-modules` | Runner, ESM native | `package.json:6` `jest 29.7.0` |
| `jest-environment-jsdom` | `document`/`window` for frontend | `29.7.0` |
| `jest-coverage-badges` | SVG badges from `coverage-summary.json` | `1.1.2` |
| Gitea Actions | CI | `.gitea/workflows/ci.yml` Node 20 |

Split via `package.json:13` `jest.projects` (`frontend` → `jsdom`, `backend` → `node`, both `**/*.test.js`).

## Configuration

```json
// package.json:13 jest
{
  "projects": [
    { "displayName":"frontend","rootDir":"app/src/frontend","collectCoverageFrom":["**/*.js","!**/*.test.js"] },
    { "displayName":"backend", "rootDir":"app/src/backend", "collectCoverageFrom":["**/*.js","!**/*.test.js","!campus.geojson"] }
  ],
  "coverageReporters": ["json","lcov","json-summary","text"],
  "coverageThreshold": { "global": { "branches":70,"functions":70,"lines":70,"statements":70 } }
}
```

- `collectCoverageFrom` covers `app/src/**/*.js` excluding `*.test.js` and `node_modules` (per-project). This yields **All 83.43%** today; `backend/routes 80.31%`, `frontend/js 91.05%` (see `coverage/coverage-summary.json`).
- `coverageReporters` `json` + `lcov` satisfy rubric; `json-summary` feeds `jest-coverage-badges`, `text` prints table in CI.
- `coverageThreshold 70%` **fails the pipeline** (`npm run test:ci` exits 1) — enforced in `ci.yml:32`.

## Strategy & Mocking

- **DB at boundary:** `jest.unstable_mockModule('../utils/db.js', () => ({ default:{query:jest.fn(), getConnection:jest.fn()} }))` — asserts on SQL via `mock.calls[n][0]`, not on engine.
- **HTTP:** ephemeral `express` + `http.createServer` + built-in `fetch` (`node 20`) — exercises routing/middleware/parsing end-to-end (pattern in `routes/leaderboard.test.js:22`).
- **Browser APIs:** hand-rolled `navigator.geolocation`; canvas mocked for `addGroundTexture` (`campus-style.test.js:91`).
- Speed: full suite **≈5.5s**, deterministic, no external deps.

## Policy

### Every PR and push

Workflow `.gitea/workflows/ci.yml` (Node 20) on `push: [main,dev]` and `pull_request: [main]`:

1. `npm ci` (root) + `npm ci --prefix app/src/backend`
2. `npm run test:ci` (`--ci --coverage`) — id `tests`, `continue-on-error: true` so badges still generate
3. `if: always()` → `npm run badges` (`jest-coverage-badges --input coverage/coverage-summary.json --output badges`) → `badges/badge-{statements,branches,functions,lines}.svg`
4. `if: always()` → `curl -s https://img.shields.io/badge/tests-${{steps.tests.outcome=='success'?'passing-brightgreen':'failing-red'}} -o badges/badge-tests.svg`
5. `if: always()` → `git config user.name gitea-actions` + `git add badges/` + `git diff --staged --quiet || git commit -m "chore: update coverage badges [skip ci]" && git push` (prevents loop via `[skip ci]`)
6. `if: always()` → `actions/upload-artifact@v4` (`coverage/lcov-report/`, 14 days, `coverage-report`)
7. `if: always()` → `exit 1` if `steps.tests.outcome == 'failure'` → pipeline fails on threshold breach.

Separate `format-check.yml` runs `prettier --check .` on `push`/`pull_request` to `main`.

### Adding/changing a test

Tests live next to code (`*.test.js`). Feature diff and test diff are reviewed together; reviewer asks why if feature lacks test.

### Coverage

`npm run test:coverage` locally prints table. Badge SVGs committed to `badges/` render in `README.md` (relative paths) on Gitea without Codecov/Coveralls, per constraint `No external services`.

## Results (14 Sep 2026)

```
Test Suites: 19 passed
Tests:       207 passed
All files    83.43% stmts / 72.96% branches / 90.5% funcs / 83.77% lines
backend/routes 80.31%   frontend/js 91.05%
```

Threshold 70% met. See `testing/test-cases.md` for per-suite catalogue.

## Gaps Closed Since Sprint 2 Draft

- **User feedback:** formalised — Sprint 2 UAT form, 2 play-tests, feedback integrated into curation brief (see `sprints/sprint-2-meeting-17.md`).
- **Frontend DOM:** `leaderboard.js` still manual, but `console.js` curation + `campus-style.js` now 94.9%, `auth-helpers.js` 88.8% via `jsdom`.
- **WebSocket:** battle lobby still manual; unit covered via `valid_user_cards` mock.
- **Coverage policy:** now enforced (was “not yet” in draft `130-142`).
