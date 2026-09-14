# Deployment

This guide covers running Adamas2Aurum.

For a full explanation of every environment variable and setting mentioned
here, see [`configuration.md`](./configuration.md).

---

## Local Deployment

### Prerequisites

| Requirement                                                                                                | Needed for                                                                           |
|------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| [Node.js](https://nodejs.org/) 18+                                                                         | running the app at all                                                               |
| npm                                                                                                        | installing dependencies, running scripts                                             |
| [Python 3](https://www.python.org/)                                                                        | `setup.py` (automated setup) and `db_connect.py` (DB CLI helper)                     |
| [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/) | only if you want a local MySQL instance instead of connecting to a shared/remote one |
| MySQL client (`mysql`) (or MariaDB client) on your `PATH`                                                  | only if you want to use `db_connect.py` to connect via the CLI                       |

### 1. Clone and install dependencies

```bash
$ git clone https://sdp.ms.wits.ac.za/404-found-us/Adamas2Aurum 
$ cd Adamas2Aurum
$ npm run install-deps
```

`install-deps` runs `npm install` at the project root, then again inside
`app/src/backend`, since the backend has its own `package.json` and
dependency tree.

You can skip this step and let the automated setup script (below) handle
it instead.

### 2. Configure your environment

```bash
$ cp app/src/backend/.env.example app/src/backend/.env
```

The defaults in `.env.example` (`DB_HOST=localhost`, `DB_PORT=8024`, etc.)
are set up to match a MySQL instance running locally via Docker Compose
(see the next step). Details on variables are in
[`configuration.md`](./configuration.md).

> **Heads up:** if you instead point `DB_HOST`/`DB_PORT`/etc. at a shared
> database that other people also use, be aware that `npm run db:seed`
> and `CLEAR_DB=true` are destructive against
> *whatever database you're pointed at*. Check with your team before
> running either against anything shared. This guide
> assumes a local, Docker-hosted database that's yours alone.

### 3. Set up the local database

This step is optional. Skip it if you're pointing `.env` to a database
that's already running somewhere else.

```bash
# from app/src/backend, or via the root npm scripts below
$ npm run db:up      # docker compose up -d
```

> **Linux (and possibly macOS):** depending on your Docker install, this
> may need `sudo`. Either add your user to the `docker` group so elevation
> isn't required, or add `sudo` to the relevant scripts in
> `app/src/backend/package.json` yourself. The setup script does not do
> this automatically.

Once the container is up, two more scripts are relevant:

```bash
$ npm run db:reset   # (re)creates the schema from scratch
$ npm run db:seed    # populates sample users, events, trivia questions, etc.
```

`db:reset` is optional if you just want an empty-but-correct schema - the
backend also creates tables on every startup via `CREATE TABLE IF NOT
EXISTS`, which is safe and non-destructive. `db:reset` is for when you
want a genuinely clean slate.

To stop the container without deleting data:

```bash
$ npm run db:down
```

To delete the local database entirely (containers and volumes):

```bash
$ docker compose down -v   # run from app/src/backend
```

### 4. Connecting to the database directly (optional)

If you want to work in the database with the `mysql` CLI, you can run:

```bash
$ python3 db_connect.py
```

This reads your `.env` and builds the right `mysql` command for you
including passing `--ssl-ca=./certs/ca.pem` or `--skip-ssl` automatically
based on `DB_SSL`, so you don't have to remember the flag yourself.

### 5. Running the app

The recommended way is the automated setup script, which wraps steps 1–3
above and then starts everything:

```bash
$ python3 setup.py          # start mode
$ python3 setup.py --dev    # dev mode (backend restarts on file changes)
```

It will:

1. Install dependencies (`npm run install-deps`)
2. Ask whether you want to set up a local Docker database, and if so, run
   the Docker checks, `db:up`, `db:reset`, and `db:seed` for you
3. Start the backend and frontend together, and stop both cleanly on
   `Ctrl+C`

This works the same way on macOS, Linux, and Windows.

#### Running it manually instead

If you'd rather run each piece yourself:

```bash
$ npm run dev:backend      # dev mode (restarts on file changes)
$ npm run start:backend    # production
```

```bash
$ npm run dev:frontend
$ npm run start:frontend
```

> **Note:** the backend serves the frontend's static files and pages
> directly on the same port as the API (`PORT`, default `3000`) - see the
> static-serving section of `server.js`. In normal local use, you only
> need the backend running; visiting `http://localhost:3000` gets you
> the full app (API, session cookies, and frontend, all same-origin,
> which avoids cross-origin cookie issues). The separate
> `dev:frontend`/`start:frontend` server on port `8055` is a lightweight,
> standalone way to preview just the static frontend without the backend.

### 6. Verifying it's running

- Visit `http://localhost:3000`.
- Hit the health check endpoint:

  ```bash
  $ curl http://localhost:3000/api/health
  ```

  This returns `{ "success": true, "tables": [...] }` on success, backed
  by a live `SHOW TABLES` query. A `success: true` response means both
  the server and the database connection are working.

- Check the backend's console output on startup. It logs the current
  server time, database list, and table list at least once (this happens
  only if `LOG_DB` is set to `true` in `app/src/backend/.env`).

### 7. Stopping everything

- If you started via `setup.py`: `Ctrl+C` stops the backend and frontend cleanly.
- If you started manually: `Ctrl+C` each `npm run` process individually.
- The database container (if you're using the local Docker one) keeps
  running independently until you run `npm run db:down`.

### 8. Troubleshooting

| Symptom                                                                           | Likely cause / fix                                                                                                                                                                                                                                                                                                                          |
|-----------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Error: Not allowed by CORS` in the browser console                               | You're accessing the app from an origin not in `server.js`'s `allowed_origins` list.                                                                                                                                                                                                     |
| `docker compose up` fails with a permissions error                                | Your Docker install needs `sudo`, or your user isn't in the `docker` group.                                                                                                                                                                                                                                                                 |
| `python3 db_connect.py` fails with "command not found: mysql"                     | Install a MySQL client and make sure `mysql` is on your `PATH`.                                                                                                                                                                                                                                                                             |
| Login suddenly fails with "Invalid credentials" for an account that worked before | Someone ran `db:seed`, or started the backend with `SEED_DB=true`, which truncates and re-inserts data. Log in with a freshly seeded account, or re-seed yourself.                                                                                                                                                                          |
| The database gets wiped every time you save a file in dev mode                    | You have `SEED_DB=true` or `CLEAR_DB=true` set in `app/src/backend/.env`. Because `dev:backend` uses `node --watch`, every file save restarts the process. Unset them once you've seeded/cleared once.                                      |
| Port already in use (`3000`, `8055`, or `8024`)                                   | Something else is already bound to that port, either stop it, or change `PORT` in `.env` (for the backend) or the `-l` flag in the `serve` scripts (for the frontend). The local DB's port (`8024` by default) is set via `DB_PORT` and in the Docker Compose.                                                                   |

---

## Remote Deployment

### Frontend (Cloudflare Pages)

Deployed automatically via `.gitea/workflows/frontend-deploy.yml` on push to `main`. Requires secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (Gitea repo settings). The workflow runs `npx wrangler deploy --assets=./app/src/frontend --name website`.

No manual action except not pushing broken code to `main`.

### Backend (Render via GitHub Mirror)

Gitea `sdp.ms.wits.ac.za` is not reachable by Render, so a `--mirror` to GitHub is kept (see `implementation/backend.md`):

```bash
git clone --mirror https://sdp.ms.wits.ac.za/404-found-us/Adamas2Aurum.git
cd Adamas2Aurum.git
git remote add github https://github.com/Busisiwe-Mnguni/Adamas2Aurum-backend-deployment.git
git push --mirror github
# on new commits: git fetch -p origin && git push --mirror github
```

Render Web Service (`dev` branch, root `app/src/backend`, `Node`, `npm install && npm run build`, `npm start`, Free) watches the GitHub mirror. Env vars set in Render dashboard: `DB_HOST/PORT/USER/PASSWORD/NAME/SSL`, `BETTER_AUTH_SECRET/URL`, `GOOGLE_CLIENT_ID/SECRET`, `SESSION_SECRET`, `SEED_DB=false`. See `configuration.md`.

Split-origin CORS/cookies: `allowed_origins` extended, cookies `secure:true, sameSite:'none'`, frontend `API_BASE` points to Render URL, OAuth redirects registered for both domains.

### Database (Aiven)

No deploy step — backend `initialize_database()` runs `CREATE TABLE IF NOT EXISTS` + `ensure_curation_schema()` migration idempotently on every boot (see `implementation/curation.md`). For destructive schema changes on Aiven shared DB, coordinate in chat then `npm run db:seed` (or `ALTER TABLE` versioning future work — see `implementation/database.md`).

### CI/CD (Gitea Actions)

- `test.yml` — unit tests on push/PR `dev,main`.
- `ci.yml` — Node 20, `npm ci`, `npm run test:ci` (`--ci --coverage` with 70% threshold), `jest-coverage-badges` → `badges/`, Shields `badge-tests.svg`, `git commit [skip ci]` + push as `gitea-actions`, artifact `coverage-report` 14d, final `exit 1` if `steps.tests.outcome==failure`.
- `format-check.yml` — Prettier. See `deployment/ci.md`.

### Database

Handled as above. For local, see steps 1–3. Migration via `ALTER TABLE` versioning is future work.

