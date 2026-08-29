# Configuration

This page documents the configurations available in Adamas2Aurum.

---

## Where configuration lives

All runtime configuration is read from a single `.env` file at
`app/src/backend/.env`, loaded via [dotenv](https://www.npmjs.com/package/dotenv).
A template with safe local-dev defaults is given at `app/src/backend/.env.example`.

```bash
$ cp app/src/backend/.env.example app/src/backend/.env
```

---

## Environment variable reference

| Variable         | Type                 | Default                    | Set in                     |
|------------------|----------------------|----------------------------|----------------------------|
| `DB_HOST`        | string               | `localhost`                | `utils/db.js`              |
| `DB_PORT`        | number               | `8024`                     | `utils/db.js`              |
| `DB_USER`        | string               | `root`                     | `utils/db.js`              |
| `DB_PASSWORD`    | string               | `test`                     | `utils/db.js`              |
| `DB_NAME`        | string               | `testdb`                   | `utils/db.js`, `server.js` |
| `DB_SSL`         | `true` / `false`     | `false`                    | `utils/db.js`              |
| `SEED_DB`        | `true` / `false`     | `false`                    | `server.js`                |
| `CLEAR_DB`       | `true` / `false`     | `false`                    | `server.js`                |
| `LOG_DB`         | `true` / `false`     | `true`                     | `server.js`, `utils/db.js` |
| `VERBOSE_LOG_DB` | `true` / `false`     | `false`                    | `utils/db.js`              |
| `PORT`           | number               | `3000`                     | `server.js`                |
| `SESSION_SECRET` | string               | `a2a-dev-secret`           | `server.js`                |

All boolean-style variables are compared against the literal string
`'true'` — anything else (including unset, `"1"`, or `"True"`) is treated
as false.

---

## Database connection

`app/src/backend/utils/db.js` builds a `mysql2/promise` connection pool from
`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`. This same pool
backs both the application's queries **and** the Express session store
(`express-mysql-session`), so if the DB is unreachable, sessions fail along
with everything else.

Pool sizing (`waitForConnections: true`, `connectionLimit: 10`,
`queueLimit: 0`) is hardcoded in `db.js`, not env-configurable.

---

## Server & sessions

- **`PORT`** — defaults to `3000`. The backend also serves the frontend's
  static files and HTML pages directly from this same port (see
  `frontendDir` / `pagesDir` in `server.js`), so in normal local use this is
  the only port you need to visit.
- **`SESSION_SECRET`** — signs the `express-session` cookie. Defaults to the
  literal string `a2a-dev-secret` if unset. Fine for local dev; this should
  always be overridden with a long random value anywhere the app is
  reachable outside your own machine.

A few session/cookie settings are not environment-driven:

```js
cookie: {
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24,
}
```

### Better Auth

`server.js` also wires in [Better Auth](https://www.better-auth.com/) via
`./src/auth.js` for email/password sign-up and sign-in, alongside the
legacy PIN-based auth routes (kept for backward compatibility — see the
`PIN_AUTH_PATHS` gate in `server.js`). Better Auth's own configuration
(secrets, providers, its database connection, etc.) lives in
`src/auth.js`, which isn't covered by this doc.

---

## CORS

Allowed origins are a hardcoded array in `server.js`:

```js
const allowed_origins = [
  'http://localhost:8055',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]
```

`3000` and `8055` correspond to the backend and the standalone frontend
static server, respectively. `5173` is Vite's default
dev-server port, but the current root `package.json` no longer has a Vite
dependency or script. It's harmless to leave.

Any request from an origin not in this list is rejected by the CORS
middleware with `Not allowed by CORS`. Extending this list currently means
editing `server.js` directly and redeploying.

---

## Startup database behavior (`SEED_DB`, `CLEAR_DB`, `LOG_DB`)

These three flags control **destructive** behavior that runs automatically on
every backend start.

On every `server.js` startup:

```js
await initialize_database()   // always runs — CREATE TABLE IF NOT EXISTS, safe

if (process.env.CLEAR_DB === 'true') { await clear_database() }  // destructive
if (process.env.SEED_DB === 'true')  { await seed_database() }   // destructive
if (process.env.LOG_DB === 'true') { await view_database() }     // logs
```

A few notes:

> **Note**: `npm run dev:backend` uses `node --watch`. Every time a backend
> file is saved, the process restarts, and the whole block above runs
> again. If `SEED_DB=true` or `CLEAR_DB=true` is left in your `.env` while
> running in dev/watch mode, **every file save will re-truncate and
> reseed (or wipe) the database.** These flags are meant for a one-off
> run, not to be left on.

These env-driven settings are separate from the npm scripts
(`npm run db:seed` → `seed.js`, `npm run db:reset` → `reset_db.js`). The npm
scripts are one-off, manually triggered commands, and `SEED_DB`/`CLEAR_DB` are
automatic, on-every-startup triggers.

### `LOG_DB` + `VERBOSE_LOG_DB`

When both are `true`, `db.js` monkey-patches `pool.query` and `pool.execute`
to log every SQL statement and its bound parameters to the console:

This includes whatever was passed in as query params — PINs, emails, etc.
Fine for local debugging; don't leave `VERBOSE_LOG_DB=true` on anywhere logs
are persisted.

---

## Formatting

Code style is enforced with [Prettier](https://prettier.io/), configured
via `.prettierrc.yaml` and `.prettierignore` at the project root:

```bash
$ npm run format        # write formatting fixes
$ npm run format:check  # verify only, no writes
```

---

## Testing

Jest is configured via the `jest` block in the root `package.json`, split
into two named projects so frontend and backend tests can run independently
or together:

| Project    | `rootDir`          | Environment |
|------------|--------------------|-------------|
| `frontend` | `app/src/frontend` | `jsdom`     |
| `backend`  | `app/src/backend`  | `node`      |

Test files are matched as `*.test.js` under each project's `rootDir`.

---

## Before deploying remotely

- Configure `.env` to your hosted and running database.
- Set a long, random `SESSION_SECRET` — don't ship the `a2a-dev-secret` default.
- Narrow `allowed_origins` in `server.js` to your real domain(s).
- Double-check `SEED_DB` and `CLEAR_DB` are unset (or `false`) anywhere data matters.
