---
sidebar_position: 4
---

# Troubleshooting

Consolidated from `configuration.md`, `deployment.md:174`, and Sprint 2 meeting notes (`sprint-2-meeting-17.md`).

## Local DB & Auth

| Symptom | Cause / Fix |
|---------|-------------|
| `Error: Not allowed by CORS` | Origin not in `server.js:48 allowed_origins` (`http://localhost:8055/3000`, `FRONTEND_URL`). Add to list or run same-origin via `:3000` |
| `docker compose up` permission error | Need `sudo` or add user to `docker` group (`sudo usermod -aG docker $USER`) |
| `python3 db_connect.py: command not found: mysql` | Install MySQL client (`apt install mysql-client` / `brew install mysql`) and ensure `mysql` on `PATH` |
| Login “Invalid credentials” after working before | Someone ran `npm run db:seed` or `SEED_DB=true` restart — truncates. Re-seed or use fresh seeded account (`alice@example.com/1234`) |
| DB wiped on every save in `npm run dev:backend` (`--watch`) | `SEED_DB=true` or `CLEAR_DB=true` set — unset after first seed |
| Port 3000/8055/8024 in use | Kill holder or change `PORT` in `.env` / `DB_PORT` in `docker-compose.yml` |
| `ER_DUP_FIELDNAME` on boot | Migration `ensure_curation_schema()` already applied — swallowed, safe to ignore (see `implementation/curation.md`) |

## Remote & CI

| Symptom | Fix |
|---------|-----|
| Render deploy fails, `BETTER_AUTH_URL` not set | Set `BETTER_AUTH_URL` to Render-assigned URL after first deploy, plus `GOOGLE_CLIENT_ID/SECRET`, `SESSION_SECRET` |
| Cloudflare Pages shows stale frontend | Check `frontend-deploy.yml` secrets `CLOUDFLARE_API_TOKEN/ACCOUNT_ID` and branch `main` only |
| Gitea badges not updating | `ci.yml` commit uses `[skip ci]` — loop prevented; check `badges/` commit by `gitea-actions`; Shields.io may be throttled (retry) |
| Coverage artifact empty | Ensure `coverage/lcov-report/` exists after `npm run test:ci` (reporters `json,lcov,json-summary` in `package.json:38`) |
| Format check fails | `npm run format` locally, commit, push — `format-check.yml` runs `prettier --check .` |
| GitHub mirror stale | `git fetch -p origin && git push --mirror github` (see `implementation/backend.md`) |

## Logs to Check

- Backend startup: `Executing 30 queries … successfully executed!` + `SHOW TABLES` if `LOG_DB=true`.
- Gitea Actions: `ci.yml` steps `Run Tests with Coverage` (id `tests`, `continue-on-error: true`), `Generate Coverage Badges`, `Upload Coverage Report`.
- Browser: Network tab for `401/403` on `/api/events?all=true` → role gate; `403 PUBLISHED` → curation gate.

If issue persists, open a Gitea issue with label `bug` and attach `coverage/coverage-summary.json` + `git log --oneline -5`.
