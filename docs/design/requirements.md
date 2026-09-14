---
sidebar_position: 1
---

# Requirements

Derived from the COMS3011A Wits Quest brief, stakeholder meetings ( Weeks 1–3 in `project-management/meetings.md`), and the curation brief added Sprint 3.

## 1. Functional Requirements

| ID | Requirement | Priority | Verification |
|----|-------------|----------|--------------|
| FR-01 | Player auth via Username+PIN and Google OAuth | Must | `routes/auth.js:23,88`, `auth-helpers.test.js` |
| FR-02 | Role-based access (`SUPER_ADMIN`, `EVENT_AUTHOR`, `CARD_AUTHOR`) | Must | `routes/events.js:88`, console `auth-helpers.js` |
| FR-03 | Geo-fenced events (`latitude`, `longitude`, `radius_meters`, `starts_at/ends_at`) | Must | `routes/events.js:79`, `utils/geo.js` |
| FR-04 | Trivia fetch + server-graded submit (no `is_correct` leak, server-timed) | Must | `routes/trivia.js:87,376`, `trivia.test.js` |
| FR-05 | Card award — one per event, speed-ranked rarity, global copy limit | Must | `services/card_award.js`, `routes/event_pool.js` |
| FR-06 | **Curation workflow** `DRAFT→IN_REVIEW→PUBLISHED→RETIRED→ARCHIVED` | Must (Sprint 3) | `routes/events.js:13` (TRANSITIONS), `events.test.js` |
| FR-07 | **Campaigns** scheduled around term/open day, link/unlink events | Must (Sprint 3) | `routes/campaigns.js`, `campaigns.test.js` |
| FR-08 | **Insights**: surface hard questions (>60% fail, ≥5 attempts) + stale events (30d) for repair/retire | Must (Sprint 3) | `routes/analytics.js`, `implementation/curation.md` |
| FR-09 | Battle deck validation & turn engine, trading, leaderboard/seasons | Should | `routes/cards.js`, `websocket/socket_router.js` |
| FR-10 | Offline deferred verification | Should | `routes/sync.js` |

## 2. Non-Functional Requirements

| ID | Requirement | Target | Evidence |
|----|-------------|--------|----------|
| NFR-01 | Performance: map first paint &lt;1.5s, API p95 &lt;200ms | &lt;200ms | `deployment/configuration.md` (pool 10, cache) |
| NFR-02 | Reliability: no client can fake location/score | Server-graded | `routes/trivia.js:40` `isEventPlayable` |
| NFR-03 | Test coverage ≥70% lines/branches/functions | ≥70% | `package.json:44` threshold, 83.4% achieved |
| NFR-04 | CI must fail on threshold breach | exit 1 | `.gitea/workflows/ci.yml:76` |
| NFR-05 | Badges committed, self-contained (no Codecov) | SVG in `badges/` | `badges/badge-*.svg` + README |
| NFR-06 | Aesthetics & responsiveness | Wits palette, mobile header collapse | `css/style.css`, Lighthouse (see `deployment/performance.md` placeholder) |
| NFR-07 | Documentation hosted, versioned | Docusaurus on GitHub Pages | `docusaurus.config.js` |

## 3. Constraints

- Self-hosted Gitea, Node 20, Express 5, MySQL 8.4, no ORM (`mysql2/promise`).
- Timebox 2 Aug – 23 Oct 2026; sprints mapped in `project-management/project-plan.md`.
- Time stored UTC, compared to `UTC_TIMESTAMP()` (`routes/events.js:16` `toUtcDatetime`).

## 4. Traceability

Each FR maps to a user story table in `project-management/user-stories.md` and an API section in `implementation/api-reference.md`. Curation FR-06…FR-08 were added Sprint 3 after stakeholder feedback “authoring should become curation” and are detailed in `docs/curation.md`.

## 5. Out of Scope

Native apps, push, SonarQube (placeholder kept), real-time voice, payment.
