---
sidebar_position: 3
---

# Frontend Implementation

Plain **HTML/CSS/JS (ESM, no framework)**. Backend serves it statically on `:3000` same-origin (`server.js:209`); Vite on `:8055` optional for HMR.

## 1. Page → Module Map

| Page | File | JS | Purpose |
|------|------|----|---------|
| `/` (landing) | `index.html` | `js/main.js`, `js/campus-style.js`, `js/geolocation.js` | Map, avatar, event markers, trivia overlay |
| `/pages/events.html` | `events.html` | `js/events.js` | Player dashboard: sidebar list + map, range pills, challenge flow |
| `/pages/console.html` | `console.html` | `js/console.js` | Author console: 4 tabs (Events/Campaigns/Cards/Insights), side sub-tabs (Details/Questions/Pool) |
| `/pages/collection.html` | `collection.html` | `js/collection.js` | Card grid, rarity colours |
| `/pages/battle.html` | `battle.html` | `js/battle.js` | Deck select, WebSocket lobby |
| `/pages/leaderboard.html` | `leaderboard.html` | `js/leaderboard.js` | Global seasons |

Shared: `js/utils.js` (toast, `esc`, `formatDT`, `toDatetimeLocal`, `toUtcIso`, `buildCardBody`, `curationBadge`), `js/auth-helpers.js` ( `isAdmin`, `updateAuthNav`, `logout`), `js/constants.js` (`API_BASE`), `js/qr-scanner.js` (camera fallback), `css/style.css` + `console-tabs.css`.

Test runner: `jest` with `jsdom` (`package.json:13` projects `frontend`/`backend`). Frontend suites: `utils.test.js`, `general.test.js`, `auth-helpers.test.js`, `campus-style.test.js:1`, `geolocation.test.js`, `daynight.test.js`, `icons.test.js` (61 tests, `frontend/js 91.1%`). Full map spec: **[Map System](./map-system.md)**.

## 2. Player Map (`js/main.js`, `js/events.js`) — see `map-system.md` for full spec

- **Renderer:** **MapLibre GL JS v3.6.2** (CDN, no key) — *not* Leaflet (Leaflet was evaluated and rejected, see `technology-stack.md` and `map-system.md` Architecture). **Style truth:** `campus-style.js:65 createCampusStyle()` — Carto Voyager vector tiles, PoGO palette (green base, parks `#66B78E`, water `#8ACDE8`, muted buildings, asphalt roads + yellow edge casing). No street names/POI labels; gameplay only on markers. Day/night blended via `nightFactorAt()`/`applyMapTheme()`/`startDayNightCycle()` (tested `daynight.test.js:8` + `campus-style.test.js:55`).
- **Avatar:** `navigator.geolocation.watchPosition` blue dot + accuracy circle (`geolocation.js:18` `get_player_location()`), heading wedge, breadcrumb trail, follow mode with drag-to-free-look and recenter.
- **Geofence:** `isInsideCampus()` bbox `28.017–28.050, -26.198–-26.173` (`campus-style.js:365`); off-campus banner, tap shows “You need to be on Wits campus” not trivia.
- **Events:** `GET /api/events` (public `PUBLISHED` only since Sprint 3), polling 30s + `visibilitychange`, `cache:'no-store'`, radius disks `GeoJSON` built at runtime.

## 3. Trivia Flow (mirrored in `events.js:566` and `main.js`)

1. Click **Attempt Challenge** → `get_location_for_challenge()` (QR fallback if accuracy>50).
2. `GET /api/trivia/event/:id?lat=&lng=` (stashes `req.session.trivia_issue.issued_at` server-side).
3. Modal `showTriviaModal()` countdown bar 6px, 100ms ticks, blue→amber→red, auto-submit `timed_out:true`.
4. `POST /api/trivia/submit` with `claimed_lat/lng` + `answer_time_ms`; server returns `is_correct`, `points_awarded` (time-decayed), `awarded_card`, `correct_option_text`.
5. `showResultModal()` status icon, correct answer, time, points, card rarity badge (COMMON grey … LEGENDARY gold).

## 4. Author Console (`js/console.js:60`, `pages/console.html:223`)

- **Auth gate:** `auth-helpers.js:39 updateAuthNav()` header (avatar dropdown vs Sign In), `isAdmin()` roles `SUPER_ADMIN/EVENT_AUTHOR/CARD_AUTHOR`, 401→ `/`.
- **Top tabs:** `Events|Campaigns|Cards|Insights` lazy-loaded. Events list grouped `draft/in_review/published/active/scheduled/retired/archived/inactive/expired` (`classifyEvent():239`), filter chips injected (`1450`), sort newest/oldest/title/points.
- **Event edit:** `Details` (title/desc/geo/radius/window/points + `f-curation`/`f-campaign` `660` + `renderCurationActions()`), `Questions` (type MC/TF/FB, options, correct), `Card Pool` (pool weight/copy-limit inline, add/remove). See `curation.md`.
- **Insights:** `GET /api/analytics/overview|questions/hard|events/stale` (see `curation.md:5`). Hard “Repair” jumps to Questions.

## 5. Auth & Nav

Single entry `/` drawer (Username+PIN + Google OAuth), `auth-helpers.js:24 redirectAfterLogin()` players→`events.html`, admins→`console.html`; header shows only role links; `logout()` dual-session via `Promise.allSettled` (`api/auth/logout` + `api/auth/sign-out`).

## 6. Styling

`:root` vars Wits blue `#0C2461`, night `body.night` `#070F1A`; `console-tabs.css` side sub-tabs (180px left, collapses to horizontal ≤720px). Prettier enforced via `format-check.yml`.

## 7. Verification

`npm run test:frontend` 61 tests; `utils.test.js:95%`, `general.js 100%`, `campus-style 94.9%`, `auth-helpers 88.8%`. E2E via manual play on `http://localhost:3000` (or Cloudflare).
