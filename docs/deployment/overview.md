---
sidebar_position: 1
---

# Deployment Overview

Adamas2Aurum is deployed as a **split-origin** system (frontend and backend on different domains, database managed separately) but also supports **same-origin local** development where the backend serves the frontend on one port.

## Deployment Targets

| Component | Host | URL | Branch | How deployed |
|-----------|------|-----|--------|--------------|
| **Frontend** | Cloudflare Pages | `https://adamas2aurum.pages.dev` (via `frontend-deploy.yml`) | `main` | Gitea Action `frontend-deploy.yml` runs `npx wrangler deploy --assets=./app/src/frontend` on push to `main` |
| **Backend** | Render | `https://adamas2aurum.onrender.com` | `dev` (mirrored to GitHub) | Render watches GitHub mirror `Busisiwe-Mnguni/Adamas2Aurum-backend-deployment` (`dev`), auto-deploys on mirror sync |
| **Database** | Aiven MySQL 8.4 | `aiven.io` managed (`a2adb`) | — | No deploy; `initialize_database()` runs `CREATE TABLE IF NOT EXISTS` + `ensure_curation_schema()` on every boot |
| **Documentation** | GitHub Pages | `https://404-found-us.github.io/Adamas2Aurum-Documentation` | `main` (docs repo) | Docusaurus `npm run deploy` |

Source of truth is **Gitea** `sdp.ms.wits.ac.za/404-found-us/Adamas2Aurum` (SSO). Render cannot reach Gitea directly, so a `--mirror` to GitHub is maintained (see `implementation/backend.md` mirroring steps).

## Diagram

![Deployment Diagram](../design/architecture/deployment-diagram-2.drawio.png)

- `Gitea → GitHub mirror → Render` (backend)
- `Gitea → Cloudflare Pages` (frontend)
- Both → Aiven MySQL
- Gitea Actions runners: `test.yml` (unit), `ci.yml` (coverage + badges + artifact, Node 20), `format-check.yml` (Prettier) — see `deployment/ci.md`.

## Configuration

All env vars, DB pool, CORS, secrets, and destructive flags are documented in [`configuration.md`](./configuration.md) (env table, idempotent schema, `SEED_DB=false` warning).

## Verification

- Local: `curl http://localhost:3000/api/health` → `{success:true, tables:[...]}`.
- Remote: same `/api/health` on Render URL; Cloudflare Pages serves `app/src/frontend` statically.
- CI: `ci.yml` uploads `coverage/lcov-report/` artifact (14 days) and commits `badges/` SVGs.

Further details: [Local + Remote Deployment](./deployment.md) and [CI/CD](./ci.md).
