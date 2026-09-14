---
sidebar_position: 2
---

# Backend Implementation

Express 5 + `mysql2/promise` on Node 20, same-origin static serving. Entry `app/src/backend/server.js:1`.

## 1. Request Lifecycle

```
fetch → cors → express.json → session (MySQLStore) → bridge (Better Auth ↔ PIN) → routes → pool.query → JSON
```

- **Session:** `express-session` + `express-mysql-session` (pool, 24h). `key: a2a-session-key`, `httpOnly` (`server.js:80`).
- **Bridge:** `server.js:109` populates `req.user` from `req.session.user` (PIN) or `auth.api.getSession()` (Google), creates `users` row for first-time OAuth.
- **Static:** `server.js:209` serves `app/src/frontend` on `:3000`; `GET /` → `index.html`.
- **DB init:** `initialize_database()` → `execute_sql_script(pool, './db/schema.sql')` (`CREATE TABLE IF NOT EXISTS`) + `ensure_curation_schema()` migration (`249`), safe every boot.

## 2. Routers (`app/src/backend/routes/`)

| Router | Prefix | Guard | Key files |
|--------|--------|-------|-----------|
| `auth.js` | `/api/auth` (`/login`, `/register`, `/me`, `/logout`) | —/session | `hashPin()` SHA256, session `user_id` (`98` roles query) |
| `events.js` | `/api/events` | `requireAuth`+`requireEventAuthor` | `VALID_CURATION` + `TRANSITIONS` (`6`), `toUtcDatetime` (`52`), `GET /` PUBLISHED filter (`149`), `POST`/`PUT` curation, `POST /:id/transition` (`463`), `POST /:id/retire` (`518`) |
| `campaigns.js` | `/api/campaigns` | same | CRUD + `term`/`is_open_day`, bulk `POST /:id/events` |
| `analytics.js` | `/api/analytics` | same | `hard`/`stale`/`overview` |
| `questions.js` | `/api` | same | `validateQuestion` (`47`), tx `trivia_questions`+`trivia_options` |
| `trivia.js` | `/api/trivia` | `requireAuth` | `getEventLocation` + `isEventPlayable` (`48`), `GET /event/:id`, `POST /submit` (time-decay `points`, card bracket) |
| `event_pool.js` | `/api/events/:id/pool` | same | weight/copy-limit, `409` duplicate |
| `cards.js` | `/api/cards` | `requireCardAuthor` | `COMMON…LEGENDARY`, `POST /sell` duplicates only |
| `sync.js` | `/api/trivia/offline-attempts` | same | deferred `client_timestamp` window + geofence |
| `leaderboard.js` | `/api/leaderboard` | public | paginated, `GET /me` rank |
| `qr.js` | `/api/events/:id/qr` | — | `event_qr_tokens` fallback |

All routers log `Router Log` prefix; 401/403 JSON on auth/role fail (tested in `*test.js` via ephemeral `express`+`fetch`).

## 3. Services

- `services/card_award.js` — `canAwardCard` (prior `is_correct` win check), `getEventCardForSpeed` (rarest-first bracket), `awardCardIfEligible` (UNIQUE backstop `ER_DUP_ENTRY` → `RACE_LOST`). 100% in `card_award.test.js`.
- `utils/geo.js` — `distance_meters` haversine, used in both trivia routes.
- `utils/response.js` — `error`/`success` helpers (100% `response.test.js`).

## 4. Auth Duality

`auth.js:7 hashPin` + `pool query` for PIN; `src/auth.js` Better Auth for OAuth. Gate middleware in `server.js:98` (`PIN_AUTH_PATHS` bypass Better Auth). `auth-helpers.js` on frontend drives `isAdmin()` + `updateAuthNav()`.

## 5. Deployment Note

Split-origin (Render backend, Cloudflare frontend, Aiven DB) details moved to `deployment/deployment.md`. Local same-origin needs no CORS beyond `localhost:8055/3000` (`server.js:48`).

## 6. Verification

- **Tests:** 11 backend suites, 144 tests (`events.test.js`, `campaigns.test.js`, `analytics.test.js`, `questions.test.js`, `cards.test.js`, `auth.test.js`, `event_pool.test.js`, `trivia.test.js`, `sync.test.js`, `leaderboard.test.js`, `card_award.test.js`) — `backend/routes 80.3%`.
- **Threshold:** `package.json:44` global 70% (`npm run test:ci` fails if below).
- **Health:** `GET /api/health` → `SHOW TABLES`.
