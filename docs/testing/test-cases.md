---
sidebar_position: 2
---

# Test Cases

Catalogue as of 14 Sep 2026 — 19 suites, 207 tests, `npm run test:coverage` → `All 83.43%`. Every file lives as `*.test.js` next to its source and runs via Gitea `ci.yml`.

## Backend — `routes/events.test.js` (Sprint 3 curation, 14 tests)

| # | Test | Verifies |
|---|------|----------|
| 1 | public returns only PUBLISHED when column exists | `GET /api/events` → `WHERE curation_status='PUBLISHED'` |
| 2 | falls back when column missing | No `curation_status` in SQL |
| 3 | `GET ?all=true` 401/403 | Auth + author gate |
| 4 | POST 401/400 missing fields | Validation |
| 5 | POST 400 invalid `curation_status` | `VALID_CURATION` enum |
| 6 | POST 201 DRAFT default (both columns) | Insert includes `curation_status`+`campaign_id` |
| 7 | PUT 400 invalid `DRAFT→PUBLISHED` | `TRANSITIONS` table |
| 8 | PUT 200 `DRAFT→IN_REVIEW` | Valid transition |
| 9 | POST `/:id/transition` 401/403/400 invalid/missing/race/no-questions/Already | Full curation state machine |
| 10 | POST `/:id/retire` 200 sets `RETIRED, is_active=FALSE` | Retire alias |
| | | *Mock: `SHOW COLUMNS` → `hasCurationColumn`, ephemeral Express+fetch* |

## Backend — `routes/campaigns.test.js` (11 tests)

`GET /` public/401/403, `POST` 401/403/400 name/400 status/201, `PUT` 404/200, `DELETE` unlinks, `POST /:id/events` 400/200

## Backend — `routes/analytics.test.js` (8 tests)

`GET /questions/hard` 401/403/200 with options + empty, `GET /events/stale` 401/200, `GET /overview` 401/200 hard/stale counts

## Backend — `routes/cards.test.js` (15 tests), `questions.test.js` (15), `event_pool.test.js` (11), `auth.test.js` (11)

- **Cards:** `GET /`/`/:id`, `GET /collection/mine` 401/200, `POST` 401/403/400 missing/invalid category/rarity/201, `PUT` 404, `DELETE` 409 referenced/200, `POST /sell` 400 quantity/404 not-owned/400 last-copy/200 duplicate (RARE 20*2)
- **Questions:** `GET /:id/questions` with options array, POST 401/403/400 type/MC correctAnswer TRUE_FALSE/404 event/201 MC/TF/FB, PUT 404/200, DELETE 404/200 (tx `getConnection` mock)
- **Auth:** `POST /login` 400/401 not-found/401 pin/200 + roles + password alias, `POST /register` 400/400 exists/201, `GET /me` 401/200, `POST /logout` 200
- **Pool:** `GET` 401/403/200, `POST` 400 card_id/400 weight/201/409 duplicate, `PUT` 400/200/404, `DELETE` 200/404

## Backend — `routes/leaderboard.test.js` (9), `routes/trivia.test.js` (13), `routes/sync.test.js` (14), `services/card_award.test.js` (10)

Leaderboard paginated rank 1-based, clamp `limit[1,100]`; Trivia `isEventPlayable` (PUBLISHED gate, location, server-timed), `is_correct` never leaked, `points_awarded` time-decay; Sync deferred `client_timestamp` window/geofence; Card award once-only race `ER_DUP_ENTRY`.

## Backend — `utils/response.test.js` (2), `services/card_award` already 100%

`error`/`success` helpers → mocked `res.status().json()`.

## Frontend — `js/utils.test.js` (11 tests, 95.2%)

`esc` HTML, `formatDT`/`toDatetimeLocal`/`toUtcIso` null/invalid/valid, `buildCardBody` title XSS + DRAFT/PUBLISHED default + IN_REVIEW gold + campaign pill, `curationBadge`, `showToast` timer

## Frontend — `js/general.test.js` (3, 100%)

`distance()` haversine 0, 111km, Wits-Constitution Hill 0.5–2km

## Frontend — `js/icons.test.js` (3, 100%)

`svgIcon` known/unknown

## Frontend — `js/campus-style.test.js` (9, 94.9%)

Constants, `isInsideCampus` bbox, `createCampusStyle` layers, `applyChromeTheme` night/day, `applyMapTheme` delegates, `resetCamera`, `startDayNightCycle`/`startChromeDayNightCycle` stop fns, `addGroundTexture` null/layer-exists + canvas mock

## Frontend — `js/auth-helpers.test.js` (11, 88.8%)

`isAdmin` all `ADMIN_ROLES`, `redirectAfterLogin` console vs events, `logout` dual fetch, `updateAuthNav` logged-out/player/admin, refresh dedup, avatar click toggles menu, soon-notify, icon fallback

## Frontend — `js/geolocation.test.js` (2), `js/daynight.test.js` (5)

Wrapper resolves tuple; `nightFactorAt` deep night 1, midday 0, smooth dawn/dusk, [0,1].

## What Is Still Manual

- `js/leaderboard.js` DOM (manual browser), `websocket/battle` (manual lobby), `main.js`/`events.js` full map (polling verified manually). Tracked as tech-debt in `test-plan.md`.

## How to Run

```bash
npm run test              # 207
npm run test:coverage     # table + All 83.43%
npm run test:ci           # --ci --coverage + threshold 70% (fails pipeline if below)
npm run badges            # jest-coverage-badges → badges/*.svg
```

Artifacts: `coverage/lcov-report/` (upload 14d), `badges/badge-*.svg` (5) rendered in `README.md`.
