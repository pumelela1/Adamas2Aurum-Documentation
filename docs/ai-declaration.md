---
sidebar_position: 99
---

# AI Declaration

This project was developed with AI assistance, disclosed per Wits COMS3011A policy. All AI-generated code, prose, and diagrams were **reviewed, tested, and approved by a human author** before commit. No submission was generated wholesale by AI without human oversight.

## Tools Used

| Tool | Model / Version | Role | Where |
|------|-----------------|------|-------|
| **Muse Spark via Opencode** (`muse-spark-1.2`, `opencode/muse-spark-1.2-contributor-free`) | Meta | Scaffolding, bug-fix, test generation, docs drafting | Sprint 1–3 curation workflow, CI pipeline, documentation site |
| **Qoder** | — | Architecture sketching, refactor suggestions | Sprint 1 auth consolidation, console sub-tabs |
| **Antigravity** (earlier) | — | Map GPS overhaul, session termination audit | `MAP.md` history (retroactively documented) |

No Codex, Copilot, or external SonarQube was used at runtime.

## Scope of AI Help — By Artefact

### 1. Curation Workflow (Sprint 3) — `docs/implementation/curation.md`, `app/src/backend/routes/{events,campaigns,analytics}.js`, `app/src/frontend/js/console.js`

- **Prompt (user):** “Authoring should become curation. Content should be drafted, reviewed, and published rather than going live as written, campaigns scheduled around a term or an open day, old events retired, and questions everybody gets wrong surfaced so they can be repaired.”
- **AI did:** Drafted state machine `VALID_CURATION` + `TRANSITIONS` (`routes/events.js:6`), `campaigns` table (`schema.sql:461`), `analytics` queries (hard 60%/5, stale 30d), and console tabs (`console.html:223`, `console.js:60`). Suggested `ensure_curation_schema()` idempotent migration (`server.js:249`) and backfill.
- **Human did:** Chose 5-state enum (vs 3), enforced “publish requires ≥1 question”, wired `isEventPlayable()` gate, reviewed `campus-style` bbox vs polygon, manually tested Draft→Publish→Retire flow, fixed double `getEventLocation()` mock shift in `trivia.test.js`.

### 2. Testing — `app/src/frontend/js/{utils,campus-style,auth-helpers,general,icons}.test.js`, `app/src/backend/routes/*.test.js` (19 suites, 207 tests)

- **AI did:** Scaffolding for `utils.test.js` (esc, buildCardBody), `events.test.js` (transition matrix), `campaigns.test.js`, `analytics.test.js`, `cards/questions/auth/pool` suites using the existing `jest.unstable_mockModule` + ephemeral `express` harness pattern (`leaderboard.test.js:22`).
- **Human did:** Fixed `formatDT` Invalid Date expectation, `cards` rarity mock, `event_pool` weight 0→1 default, `auth` session shape (`req.session.user` vs `req.user`), added `response.test.js` for `utils/response.js`. Verified threshold 70% (`package.json:44`) locally `83.43%`.

### 3. CI/CD — `package.json:69` `test:ci`/`badges`, `.gitea/workflows/ci.yml`

- **AI did:** Proposed `jest --ci --coverage` + `jest-coverage-badges` + Shields curl with `continue-on-error` + `steps.tests.outcome`, `if: always()` commit `[skip ci]` as `gitea-actions`, artifact `coverage-report` 14d, `collectCoverageFrom` per-project.
- **Human did:** Moved `collectCoverageFrom` from global `app/src/**/*.js` (0% bug) to per-project `**/*.js` (`package.json:14` fix after `All 0%` run), installed `jest-coverage-badges@1.1.2` at root (not backend), verified `coverage-summary.json` + `badges/badge-*.svg` generation, fixed `git push` branch var to plain `git push`.

### 4. Documentation Site (this repo)

- **AI did:** Drafted `goals.md`, `features.md`, `requirements.md`, `system-architecture.md`, `component-diagram.md`, `frontend.md`, `game-systems.md`, `curation.md`, `test-plan.md`, `deployment/ci.md` etc., from rubric gaps audit (see `audit` task).
- **Human did:** Rewrote `backend.md` (was misplaced deployment), corrected `Cloudfare→Cloudflare`, `Aizen→Aiven`, filled `product-backlog.md` from Taiga export, drew burndown mermaid, verified mermaid syntax, ran `npm run build` locally before push.

## Commit Hygiene

Every AI-assisted commit is tagged in its body:

```
Assisted-by: Muse Spark (opencode/muse-spark-1.2) via Opencode
```

and squashed with human `Reviewed-by: <author>` in PR review. `git log --grep=Assisted-by` lists them; `HANDOFF.md` and `IMPLEMENTATION_NOTES.md` in app repo also carry per-file AI notes.

## Verification Statement

We, **404 Found Us**, affirm:

- No AI was used to fabricate meeting minutes (`sprints/sprint-1-meeting-*.md` are human-written; `sprint-2-meeting-17.md:31` explicitly flags missing minutes as TODO).
- Test oracles (expected ranks, SQL, badge URLs) were human-chosen; AI only scaffolded harness.
- Coverage `83.43%` is from real Jest runs, not invented.

*Date: 14 Sep 2026 — Scrum Master (Busisiwe) on behalf of the team.*
