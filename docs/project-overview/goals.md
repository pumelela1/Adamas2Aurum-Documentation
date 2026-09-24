---
sidebar_position: 2
---

# Goals

## Vision

**Adamas2Aurum (A2A)** is a location-based campus game for the University of the Witwatersrand that turns the Braamfontein campus into a playable map. Students explore real landmarks, trigger geo-fenced trivia challenges, earn collectible cards, and battle with those cards — blending orientation, heritage learning, and collectible progression.

The Wits Quest brief (Project 6) asked for a *Pokémon GO-style* experience; our product reframes “authoring as curation”: content is drafted, reviewed, and published, scheduled around terms/open days, retired when stale, and improved from analytics.

> Turn the Wits campus into a living game board, where every walk between lectures is a chance to discover the university's history, collect something new, and compete with the people around you.

## Primary Goals

| # | Goal | Success metric |
|---|------|----------------|
| G1 | **Campus orientation & engagement** — first-years discover buildings, history, and traditions through play | 80% of testers can locate 5 landmarks after one session (user testing, Sprint 2) |
| G2 | **Heritage learning** — trivia difficulty reflects real Wits history (founding 1922, mines, Taung Child, etc.) | Question bank ≥20 curated items; hard-question analytics flags >60% fail rate for repair |
| G3 | **Fair, verifiable play** — location and scoring cannot be faked client-side | GPS/QR verification + server-timed scoring (see `docs/design/architecture/system-architecture.md`) |
| G4 | **Sustained collection loop** — one card per event, rarity by speed, duplicate selling | 22 cards across 5 rarities; pool weight/copy-limit implemented |
| G5 | **Authoring as curation** — staff draft → review → publish, schedule campaigns, retire stale content | Workflow implemented Sprint 3; 4 campaigns, 3 retired events in seed; `docs/implementation/curation.md` |
| G6 | **Competitive & social play** — players compete with each other, not just the CPU | Async PvP with auto-forfeit timeout; live real-time matches with spectating; rating-based matchmaking with seasonal resets; global leaderboard |
| G7 | **Reliable on a real campus** — dead zones and dropped connections don't stop play | Offline attempts queued on device and verified against their captured timestamp on sync; reconnect restores full live-match state |
| G8 | **No cold wall at the door** — anyone on campus can see what the game is before committing | Map and events browsable without an account; login (third-party provider or username + PIN) required only to attempt a challenge |
| G9 | **Proportionate integrity response** — suspicious behaviour is detected and handled fairly | Movement-speed flags and per-player trust score; console review queue with graduated response (warning → restriction → suspension) |
| G10 | **Evidence-based tuning** — the game improves from real player data | Analytics dashboard showing engagement per event/zone, correct-rate per question, and actual vs. configured card drop rates |

## Player Experience Principles

These principles sit behind the goals above and guide design decisions:

- **Exploration is rewarded.** Events, trails, and procedurally rotated placements spread play across the whole campus so no area stays permanently empty.
- **Every attempt teaches something.** The correct answer is always revealed, so even a wrong answer is a “did you know?” moment about Wits.
- **Progress is always visible.** Points, achievements, daily streaks, and ranked seasons give both short-term and long-term reasons to return.
- **Battles involve real decisions.** Deck-building constraints and attribute choice each round make matches strategic rather than random.

## Project & Delivery Goals

- **Deliver incrementally** — a working product at every milestone, growing from Basics through Intermediate to Advanced.
- **Work visibly with Kanban** — all user stories tracked on a shared board so progress and blockers are clear to the whole team.
- **Share ownership** — work divided per sprint so every member contributes across the full stack and no part of the system depends on one person.

## Non-Goals (explicit)

- Photo-realistic 3D (MapLibre cartoon style chosen over Cesium).
- Built-in social chat or push notifications — out of COMS3011A scope.
- iOS/Android native wrapper — responsive web only.
- Play outside the Wits campus.
- Real-money purchases or monetisation of cards.
- Replacing official Wits tours or academic content.

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
