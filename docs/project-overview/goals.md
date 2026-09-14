---
sidebar_position: 2
---

# Goals

## Vision

**Adamas2Aurum (A2A)** is a location-based campus game for the University of the Witwatersrand that turns the Braamfontein campus into a playable map. Students explore real landmarks, trigger geo-fenced trivia challenges, earn collectible cards, and battle with those cards — blending orientation, heritage learning, and collectible progression.

The Wits Quest brief (Project 6) asked for a *Pokémon GO-style* experience; our product reframes “authoring as curation”: content is drafted, reviewed, and published, scheduled around terms/open days, retired when stale, and improved from analytics.

## Primary Goals

| # | Goal | Success metric |
|---|------|----------------|
| G1 | **Campus orientation & engagement** — first-years discover buildings, history, and traditions through play | 80% of testers can locate 5 landmarks after one session (user testing, Sprint 2) |
| G2 | **Heritage learning** — trivia difficulty reflects real Wits history (founding 1922, mines, Taung Child, etc.) | Question bank ≥20 curated items; hard-question analytics flags >60% fail rate for repair |
| G3 | **Fair, verifiable play** — location and scoring cannot be faked client-side | GPS/QR verification + server-timed scoring (see `docs/design/architecture/system-architecture.md`) |
| G4 | **Sustained collection loop** — one card per event, rarity by speed, duplicate selling | 22 cards across 5 rarities; pool weight/copy-limit implemented |
| G5 | **Authoring as curation** — staff draft → review → publish, schedule campaigns, retire stale content | Workflow implemented Sprint 3; 4 campaigns, 3 retired events in seed; `docs/implementation/curation.md` |

## Non-Goals (explicit)

- Photo-realistic 3D (MapLibre cartoon style chosen over Cesium).
- Built-in social chat or push notifications — out of COMS3011A scope.
- iOS/Android native wrapper — responsive web only.

## Stakeholder Alignment

| Stakeholder | Need | How we validated |
|-------------|------|------------------|
| Students (players) | Fun, quick sessions between lectures | Bi-weekly play-tests (see `project-management/meetings.md`), UAT form Sprint 2 |
| Authors / Wits Heritage staff | Curate without going live as written | Sprint 3 stakeholder review of `DRAFT→IN_REVIEW→PUBLISHED→RETIRED` workflow |
| Course markers | Rubric Advanced on Milestones 1–4, 70% coverage, CI on Gitea | Evidence in `docs/testing/test-plan.md`, `.gitea/workflows/ci.yml` |

## Constraints

- Period: **2 Aug – 23 Oct 2026** (Sprints 1–3 + submission).
- Self-hosted Gitea, no external Codecov/SonarQube, badges committed to repo.
- MySQL (Docker or Aiven) — schema via `CREATE TABLE IF NOT EXISTS`, no ORM.

## AI Use

All AI assistance is declared per-file in **[AI Declaration](../ai-declaration.md)**. AI was used for scaffolding, never for unreviewed commits.
