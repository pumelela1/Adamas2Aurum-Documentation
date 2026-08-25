# Backend Deployment Implementation

## Overview

The backend for Adamas2Aurum ("Wit's Quest") is deployed as a standalone web service on **Render**, connecting to a **MySQL database hosted on Aiven** and serving both a REST API and Better Auth authentication endpoints. The frontend is deployed separately on **Cloudflare Pages**, so the system runs as a split-origin architecture: the frontend and backend are on different domains and communicate over HTTPS.

## Why Render

Render was chosen for the backend because it offers free-tier Node.js web service hosting with automatic deploys triggered directly from a connected Git repository, removing the need to manually build and push containers or manage server infrastructure ourselves.

## Repository Mirroring: Gitea → GitHub

The project's source of truth is a **Gitea** repository hosted at `sdp.ms.wits.ac.za`, which is behind university SSO and not directly reachable by Render (Render only integrates natively with GitHub, GitLab, and Bitbucket). To bridge this, the repository is mirrored to a GitHub repository:

```bash
git clone --mirror https://sdp.ms.wits.ac.za/404-found-us/Adamas2Aurum.git
cd Adamas2Aurum.git
git remote add github https://github.com/Busisiwe-Mnguni/Adamas2Aurum-backend-deployment.git
git push --mirror github
```

This pushes all branches (`dev`, `main`, feature branches) and tags as-is. When new commits land on Gitea, the mirror is refreshed with:

```bash
git fetch -p origin
git push --mirror github
```

Render is connected to this GitHub mirror and watches the `dev` branch, so any resync of the mirror triggers an automatic redeploy.

## Render Web Service Configuration

| Setting | Value |
|---|---|
| Branch | `dev` |
| Root Directory | `app/src/backend` |
| Runtime | Node |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Plan | Free |

### Environment Variables

The following are set in the Render dashboard (not committed to the repo — they're excluded via `.gitignore`):

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (`a2adb`), `DB_SSL=true` — Aiven MySQL connection
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` — set to the Render-assigned URL once the first deploy completes
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — Google OAuth
- `SESSION_SECRET`
- `SEED_DB=false`, `LOG_DB_INFO=false`

Render automatically injects `PORT`, which `server.js` reads via `process.env.PORT || 3000`.

## Cross-Origin Configuration

Because the frontend (Cloudflare Pages) and backend (Render) live on different domains, several adjustments were required to the codebase that assumed same-origin deployment:

- **CORS**: the backend's allowed-origins list was extended to include the Cloudflare Pages URL, in addition to localhost for local development.
- **Cookies**: session cookies are set with `secure: true` and `sameSite: 'none'` so authentication cookies survive a cross-origin, HTTPS-only request.
- **API base URLs**: frontend code no longer hardcodes `localhost:3000`; it points to the Render backend URL via a configurable constant.
- **Better Auth client**: the client's `baseURL` is set explicitly to the Render URL rather than relying on `window.location.origin`, which would resolve to the Cloudflare domain.
- **OAuth redirect URIs**: both the Render and Cloudflare URLs were registered in Google Cloud Console as authorized redirect URIs.

## Database

No separate database provisioning was needed on Render — the backend connects to the existing Aiven-hosted MySQL instance over the network. On startup, `initialize_database()` runs `schema.sql` using `CREATE TABLE IF NOT EXISTS`, so the schema is idempotent and safe to run on every deploy.

## Deployment Order

The backend was deployed before the frontend, since the frontend's configuration (API base URL, Better Auth client, OAuth redirects) depends on already knowing the Render URL. The backend itself only depends on the Aiven database, which existed independently, so it could be verified in isolation via a `/api/health` endpoint before the frontend was connected.


## Verification

After each backend deploy, the service is checked via `GET /api/health`, which returns a JSON list of tables from the connected Aiven database, confirming both the server and database connection are functioning before the frontend is wired up against it.