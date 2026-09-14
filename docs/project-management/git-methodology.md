---
sidebar_position: 6
---

# Git Methodology

*Source: `Adamas2Aurum/docs/git_methodology.md` (Gitea `dev` branch, sdp.ms.wits.ac.za) — mirrored here for rubric “Git Methodology: Documented + Used”.*

## Branching Strategy — GitHub Flow + `dev`

Based on [Lecture 2: Collaborative Software Development](https://sdp.ms.wits.ac.za) (COMS3011A, 30 Jul 2026).

- `main` — stable, tagged `v0.1.0`/`v0.2.0`/`v0.3.0`/`v1.0.0` per milestone. Never direct commit.
- `dev` — integration, daily work.
- `feat/<short>` / `fix/` / `chore/` / `docs/` / `test/` — one branch per user story, off `dev`.

See `project-plan.md` Gantt for tag dates.

## Naming & Commits

`type/short-description` lower, hyphenated, e.g. `feat/visitor-map-access`. Commits follow [Conventional Commits](https://conventionalcommits.org):

```
<type>: <short>
[body]
Assisted-by: Muse Spark (opencode)  # if AI used
```

Atomic, working state, no `wip`.

## Pull Requests

`feat/* → dev` (or `dev → main` at milestone). Must have:

1. One peer approval
2. Pass CI (`test.yml` + `ci.yml` + `format-check.yml`)
3. Verified description
4. Linked issue `Closes #N`

Board `In Review → Done` on merge (Taiga).

## Evidence — Used

- Gitea log: `git log --oneline --graph` shows `feat/curation-workflow` (14 Sep), `feat/ci-badges` (14 Sep), `feat/testing-80` (14 Sep) all `→ dev` via PR.
- Commit quality: `prettier --check` enforced (`format-check.yml`), `badges/` commit `[skip ci]` avoids loop.
- Tags: `git tag` lists `v0.1.0` (Sprint 1, 23 Aug), `v0.2.0` (13 Sep).

## Versioning

| Milestone | Tag |
|-----------|-----|
| Sprint 1 | `v0.1.0` |
| Sprint 2 | `v0.2.0` |
| Sprint 3 | `v0.3.0` |
| Submission | `v1.0.0` |

Consistent per lecture.
