---
sidebar_position: 1
---

# Implementation Overview

This section is the implementation truth for **Adamas2Aurum**. Every subsection is code-linked (`file:line`) and test-linked (`*.test.js`).

## Map

| Document | Covers | Key files |
|----------|--------|-----------|
| [Backend](backend.md) | Express routers, services, middleware, session bridge | `app/src/backend/routes/*.js:1`, `server.js:109`, `services/card_award.js` |
| [Frontend](frontend.md) | Player map, console, auth UI, day/night, QR fallback | `app/src/frontend/js/{events,console,auth-helpers,campus-style}.js` |
| [Curation Workflow](curation.md) | **Sprint 3** Draft→Review→Publish, campaigns, hard-question & stale analytics | `routes/{events,campaigns,analytics}.js` |
| [Authentication](authentication.md) | PIN + Google OAuth, role bridge, header menu | `routes/auth.js:7`, `js/auth-helpers.js:39` |
| [Database](database.md) | 23 tables, lifecycle, seeds | `db/schema.sql`, `db/seed.sql` |
| [Game Systems](game-systems.md) | Card award, rarity, selling, battle, trading, points | `routes/cards.js:308`, `routes/event_pool.js` |
| [API Reference](api-reference.md) | Full external REST + WebSocket | All `routes/*.js` |
| [Database Deployment](../deployment/deployment.md) | Render ↔ Gitea mirror, Cloudflare, Aiven | `.gitea/workflows/ci.yml` |

## How to Navigate

- **New to the codebase?** Start `backend.md` (request lifecycle) → `frontend.md` (page → JS module map) → `database.md` (ER).
- **Reviewing Sprint 3 curation?** Jump to `curation.md` (workflow + campaigns + analytics).
- **Verifying rubric?** Each doc ends with “Verification” linking to its `*.test.js` and coverage line.

## Build & Run (recap)

Backend serves frontend statically on `:3000` same-origin (`server.js:209`). Dev optionally via `Vite` on `:8055`. DB `mysql2/promise` pool 10, `initialize_database()` idempotent. Tests `207` suites, `83.4%` All (`npm run test:ci`).

## AI Declaration

See [AI Declaration](../ai-declaration.md) — every AI-assisted commit is flagged `Assisted-by:` and reviewed.
