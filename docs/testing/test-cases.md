---
sidebar_position: 2
---

# Test Cases

Catalogue as of 9 Oct 2026 — **55 suites, 765 tests**, `npm run test:coverage` → **All 86.93%** (branches 77.58%, functions 87.75%, statements 85.63%). Every file lives as `*.test.js` next to its source and runs via Gitea `coverage.yml`.

## Backend — routes (19 suites, 336 tests)

### `routes/auth.test.js` (47) + `routes/auth-reset.test.js` (6)

- **Auth:** `POST /login` 400/401 not-found/401 wrong PIN/200 + roles + password alias, rate-limiter blocks, `POST /register` 400/400 exists/201 (+ terms gate), `GET /me` 401/200, `POST /logout` 200, `POST /change-pin` flow, `DELETE /account` 401/confirmation/200.
- **PIN reset (Milestone 4 password-reset requirement):** `POST /forgot-pin` 400 missing email / 200 generic message for unknown user (no user enumeration) / 400 for Google-only accounts / full flow issues 64-hex single-use token; `POST /reset-pin` consumes token once (replay → 400), validates new PIN, rejects expired tokens and clears them. Backed by `pinResetTokens` (15-min TTL, in-memory map — no SMTP in demo deployment; token returned in-body).

### `routes/analytics.test.js` (30 — was 8, expanded Sprint 3→4)

| Route | Coverage |
|-------|----------|
| `GET /questions/hard` | 401/403/200 with enriched options + numeric conversion, empty list |
| `GET /events/stale` | 401/200 with `days` filter |
| `GET /engagement` | 401/403/200 numeric conversion incl. `correct_rate: null` for zero-attempt events, sort/order whitelist (`unique_players ASC` honoured; bogus key falls back to `attempts DESC` — SQL injection guard), limit capped at 200, 500 |
| `GET /questions/difficulty` | 401/403, all four flag buckets (`TOO_HARD`/`TOO_EASY`/`OK`/`IGNORED` zero-attempt), `flag=too_hard` filtering, unknown flag returns unfiltered, defaults (`correct_rate ASC`, `min_attempts` floors at 0, limit cap 200) |
| `GET /cards/drop-rates` | 401/403, 400 non-integer `event_id`, global view (actual 0.3 / expected 0.25 / drift 0.05), per-event view (`WHERE p.event_id = ?` + params `[7,7,500]`), zero-total edge (rate 0, expected+drift null), 500 |
| `GET /overview` | 401/200, best-effort rollups succeed (`easy_questions`, `total_attempts`, `total_awards`), rollups null out when tables missing (query throws — old-DB resilience), 500 on required query |

### `routes/moderation.test.js` (30 — was 6, expanded Sprint 3→4)

| Route | Coverage |
|-------|----------|
| `GET /flagged` | 401/403/200 sorted by trust ASC with parsed evidence + recommended tier |
| `GET /actions` | 401/403/200 evidence JSON parsed (malformed kept raw), limit capped at 100, 500 |
| `GET /history/:userId` | 200 scoped to target + evidence parse, 500 |
| `GET /trust-scores` | 200 `trust_score` numeric conversion + evidence parse, 500 |
| `POST /action` | 401, 400 missing fields, 400 invalid tier, 400 non-integer target, 400 self-moderation, 404 unknown target, RESTRICTION defaults 3 days + UTC expiry + `moderation_status='RESTRICTED'` written, explicit `duration_days` honoured, 0/91 rejected (1–90 window), WARNING forces duration+expiry null, graduated_hint when applied tier exceeds recommendation (trust 45 → recommends RESTRICTION), `Unknown column` UPDATE swallow on pre-migration DBs, INSERT failure → rollback + 500 + connection released, 500 role-check failure |
| `POST /trust-score` | 400 missing fields, 400 range (−1/101/`abc`), 404 unknown user, 200 upsert (`ON DUPLICATE KEY UPDATE` SQL + evidence JSON params), 500 |

### `services/trust_score.test.js` (12 — new Sprint 4)

- `recommendTier` full branch matrix: null at/above threshold 70 or NaN; `< 25` → SUSPENSION; `25–49` → RESTRICTION (→ SUSPENSION after prior restriction); `50–69` → WARNING (→ RESTRICTION after prior warning, → SUSPENSION after prior restriction); irrelevant action shapes ignored; documented `TIER_THRESHOLDS` values asserted.
- `getFlaggedPlayers`: enrichment (prior actions + live `location_check_log` evidence merged, numbers converted), pre-migration fallback (no `moderation_status` column → slimmer SELECT, status defaults `NONE`), object evidence wrapped to array, malformed JSON dropped, threshold/limit passthrough with limit capped at 100.
- `getTrustScoreForUser` row/null; `setTrustScore` upsert with JSON-serialised evidence (null stays null); `computeTrustScore` stub contract.

### Curation & content — `routes/events.test.js` (25), `campaigns.test.js` (13), `cards.test.js` (22), `questions.test.js` (21), `event_pool.test.js` (12), `trades.test.js` (17), `ranked.test.js` (18), `placement.test.js` (15), `zones.test.js` (12), `battles.test.js` (4), `movement_flags.test.js` (5)

- **Events:** public returns only `PUBLISHED` (falls back when column missing), `?all=true` 401/403, POST validation + DRAFT default, `TRANSITIONS` state machine (`DRAFT→PUBLISHED` blocked, `DRAFT→IN_REVIEW` allowed, `/:id/transition` full matrix incl. race + no-questions + already-in-state), `/:id/retire` sets `RETIRED, is_active=FALSE`.
- **Campaigns:** public/401/403, POST 400 name/status/201, PUT 404/200, DELETE unlinks, `POST /:id/events` 400/200.
- **Cards:** CRUD + `collection/mine` 401/200, category/rarity validation, DELETE 409 when referenced, `POST /sell` quantity/not-owned/last-copy/duplicate-payout rules.
- **Questions:** per-event listing with options, POST type validation (MC needs correct answer, TRUE_FALSE, fill-blank), 404 event, PUT/DELETE + tx `getConnection` mock.
- **Pool/trades/ranked/placement/zones/battles/movement-flags:** config CRUD validation, trade offers, ranked seasons (schema + routes), Eason pop-up placement, zone geofence CRUD, battle sessions, flag ingestion.

### Gameplay — `routes/trivia.test.js` (26), `leaderboard.test.js` (8), `sync.test.js` (14), `feedback.test.js` (11)

- **Trivia:** `isEventPlayable` (PUBLISHED gate, location, server-timed), `is_correct` never leaked to clients, `points_awarded` time-decay, attempt windows/cooldowns.
- **Leaderboard:** 1-based paginated rank, `limit` clamped `[1,100]`.
- **Sync:** deferred `client_timestamp` window + geofence validation (anti-spoof).
- **Feedback:** submit/list feedback endpoints, moderation states.

## Backend — services, utils, websocket, placement (18 suites, 241 tests)

- **`services/card_award.test.js` (12):** once-only award race (`ER_DUP_ENTRY` swallow), rarity payout rules.
- **`services/movementTrust.test.js` (10):** movement trust scoring (velocity/teleport evidence), boot migration idempotency.
- **`utils/pin_hash.test.js` (18):** PIN hashing/verification round-trips, malformed input.
- **`utils/battle.test.js` (19), `utils/login_limiter.test.js` (7), `utils/response.test.js` (2), `utils/db.test.js` (1), `utils/better_auth_sync.test.js` (4):** battle state machine helpers, login rate-limiter windows, `error`/`success` response helpers, pool shape, Better Auth user resolution.
- **`db/ranked_schema.test.js` (6), `db/migrate_better_auth.test.js` (3):** ranked-season schema idempotency, Better Auth migration planning.
- **`websocket/battle_socket.test.js` (23), `battle_effects.test.js` (19), `spectate_socket.test.js` (11):** lobby/turn lifecycle, effect resolution, spectate subscription auth (mock `ws` clients).
- **`placement/rotation_job.test.js` (48), `placement.test.js` (19), `eason_job.test.js` (5), `scripts/fetch_osm_paths.test.js` (22):** rotation scheduling/locking/failure states, pop-up placement scoring, OSM path-fetch parsing.

## Frontend — `js/*` (18 suites, 188 tests)

- **`placement-console.test.js` (34):** console tab logic for placement queue.
- **`event-status.test.js` (19):** event state pills (OUT OF RANGE/ACTIVE/expired), distance formatting.
- **`auth-helpers.test.js` (18):** `isAdmin` all `ADMIN_ROLES`, `redirectAfterLogin` admin vs player, `logout` dual-fetch, `updateAuthNav` logged-out/player/admin, refresh dedup, avatar menu toggle.
- **`utils.test.js` (18):** `esc` HTML, datetime formatting UTC↔local round-trips, `buildCardBody` title XSS + status pills + campaign pill, `curationBadge`, `showToast` timer.
- **`voice-guide.test.js` (16), `campus-style.test.js` (15):** speech announcements, campus bbox check, MapLibre style layers, day/night theme + `prefers-reduced-motion`.
- **`spectate.test.js` (13), `help-modal.test.js` (12), `card-sell.test.js` (6), `auth-client.test.js` (6):** spectate polling/teardown, per-page help content, sell dialog math, fetch wrappers (incl. PIN-reset wrappers).
- **`feedback.test.js` (6), `terms.test.js` (5), `daynight.test.js` (5):** feedback drawer, terms gate, `nightFactorAt` 0/1 bounds + smooth dawn/dusk.
- **`spectate-demo.test.js` (3), `question-form.test.js` (3), `icons.test.js` (3), `geolocation.test.js` (3), `general.test.js` (3):** demo replay, question authoring form, icon registry, geolocation wrapper, haversine (Wits→Constitution Hill 0.5–2 km).

## What Is Still Manual

- `js/leaderboard.js` DOM (manual browser), `websocket/battle` lobby (manual), `main.js`/`events.js` full map interaction (polling verified manually — the PIN-reset drawer flow was additionally browser-verified 9 Oct 2026 with a headless Chromium pass: forgot → token issued → reset → login with new PIN, 14/14 checks). Tracked as tech-debt in `test-plan.md`.

## How to Run

```bash
npm run test              # 765 tests, 55 suites
npm run test:coverage     # table + All 86.93%
npm run test:ci           # --ci --coverage + threshold 70% (fails pipeline if below)
npm run badges            # jest-coverage-badges → coverage/badge-*.svg → copied to badges/
```

Artifacts: `coverage/lcov-report/` (uploaded, 14-day retention), `badges/badge-*.svg` (5) rendered in `README.md`.
