---
sidebar_position: 3
---

# Features

Feature-to-requirement traceability follows the COMS3011A brief (User Stories US-01…US-12, Sprints 1–3). Status as of 14 Sep 2026.

## Feature Map

| Feature | User Stories | Status | Where documented |
|---------|--------------|--------|------------------|
| **Map & geofence** | US-01, US-02 | Done | `design/architecture/system-architecture.md`, `implementation/frontend.md` |
| **PIN auth + Google OAuth** | US-03 | Done | `implementation/authentication.md` |
| **Role-based console** (`SUPER_ADMIN`/`EVENT_AUTHOR`/`CARD_AUTHOR`) | US-04 | Done | `implementation/backend.md` |
| **Geo-fenced trivia** (random question, 30s limit, distance check) | US-05, US-07 | Done | `implementation/api-reference.md#trivia` |
| **Card pool & awards** (one per event, speed-ranked rarity) | US-08 | Done | `implementation/game-systems.md`, `services/card_award.js` |
| **Curation workflow** `DRAFT→IN_REVIEW→PUBLISHED→RETIRED→ARCHIVED` | Sprint 3 curation | Done | `implementation/curation.md` |
| **Campaigns** (term / open-day scheduling) | Sprint 3 curation | Done | `implementation/curation.md#Campaings`, `routes/campaigns.js` |
| **Hard-question analytics** + stale-event retirement | Sprint 3 curation | Done | `implementation/curation.md#Analytics`, `routes/analytics.js` |
| **Battle & trading** (deck validation, turn engine) | US-09, US-10 | Done | `implementation/game-systems.md` |
| **Leaderboard & seasons** | US-11 | Done | `implementation/api-reference.md#leaderboard` |
| **Offline deferred verification** | US2-05 | Done | `routes/sync.js`, `implementation/api-reference.md` |
| **CI/CD + coverage badges** | Tooling | Done | `deployment/ci.md`, `testing/test-plan.md` |

## Detailed Feature Notes

### 1. Map Explorer (Player)
Leaflet + OSM/Carto tiles, MapLibre vector style (`campus-style.js`), avatar + accuracy circle, 12 PoI dots, radius disks, `isInsideCampus()` bbox gate. Verified in `frontend/js/campus-style.test.js`.

### 2. Authoring as Curation (Staff)
Replaces “goes live as written”. States and transitions (`routes/events.js:13`):

```
DRAFT → IN_REVIEW → PUBLISHED → RETIRED → ARCHIVED
```

`PUBLISHED` requires ≥1 question; only `PUBLISHED ∧ is_active ∧ in-window` appears on player map (`routes/events.js:79`). Transitions via `POST /api/events/:id/transition`.

### 3. Campaigns
`campaigns` table (`schema.sql:461`) groups events: `term` (e.g. `2026 T1`), `is_open_day`+`open_day_label`, `starts_at/ends_at`, `status DRAFT/SCHEDULED/ACTIVE/ARCHIVED`. Linked via `events.campaign_id`. API under `/api/campaigns` (see `curation.md`).

### 4. Insights
- **Hard questions:** `GET /api/analytics/questions/hard?threshold=0.6&min_attempts=5` — failure rate 60%+ flagged, options shown for repair; UI jump to event edit.
- **Stale events:** `GET /api/analytics/events/stale?days=30` — ended 30+ days ago, retired from `PUBLISHED`.

### 5. Testing & Quality
207 tests, 19 suites, **All 83.4% / backend/routes 80.3% / frontend/js 91.1%** (`npm run test:coverage`). Threshold 70% enforced in `package.json:44`. Badges committed to `badges/` and rendered in `README.md`.

### Out of Scope (Milestone 4)
Native mobile wrapper, push notifications, SonarQube (placeholder `sonar-project.properties` kept for future).
