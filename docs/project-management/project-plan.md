---
sidebar_position: 4
---

# Project Plan

## Timeline (Gantt, 2 Aug – 23 Oct 2026)

```mermaid
gantt
  title Adamas2Aurum — Sprints & Milestones
  dateFormat YYYY-MM-DD
  axisFormat %d %b
  section Sprint 1
  US-01…US-10 auth/map/trivia  :done, s1, 2026-08-02, 2026-08-23
  Milestone 1 demo            :milestone, m1, 2026-08-23, 0d
  section Sprint 2
  US2-01… offline/QR/PvP      :done, s2a, 2026-08-24, 2026-09-03
  US2-05… leader/rarity       :done, s2b, 2026-09-04, 2026-09-13
  Milestone 2                 :milestone, m2, 2026-09-13, 0d
  section Sprint 3
  Curation workflow            :done, s3a, 2026-09-08, 2026-09-14
  Campaigns + analytics        :done, s3b, 2026-09-10, 2026-09-14
  CI badges 83.4% + docs       :done, s3c, 2026-09-14, 2026-09-20
  US3 stretch (procedural etc):active, s3d, 2026-09-21, 2026-10-15
  Milestone 3                 :milestone, m3, 2026-10-03, 0d
  section Submission
  Reports + presentation       : 2026-10-16, 2026-10-23
  Milestone 4                 :milestone, m4, 2026-10-23, 0d
```

## Milestones (COMS3011A rubric)

| Milestone | Date | Deliverable | Evidence |
|-----------|------|-------------|----------|
| M1 Sprint 1 | 23 Aug | Auth, map, events, trivia, cards, battle | `implementation/*`, `test-cases.md` 10 tests |
| M2 Sprint 2 | 13 Sep | Offline, QR, async PvP, leaderboard, rarity | `api-reference.md` 500+ lines, `sync.test.js` |
| M3 Sprint 3 | 3 Oct  | Curation + campaigns + analytics + `ci.yml` 83.4% | `implementation/curation.md`, `badges/` |
| M4 Submission | 23 Oct | Docs site, deployment, reports | This site, `deployment/ci.md` |

## Methodology — Scrum (motivated)

**Why Scrum over Kanban:** Timeboxed sprints match rubric milestones (1–4) and course deadlines; weekly planning/retro synchronises with stakeholder lectures; Kanban (Taiga board) still used *within* sprints for WIP limits. Evidence: `sprints/sprint-1-meeting-1.md:39` (agreed 3–4 meetings/week), `meetings.md` (17 meetings logged), `product-backlog.md` prioritised. Alternative Lean was rejected — too fluid for graded milestones.

Cadence: Mon planning, Wed standup, Fri review/retro; Taiga `To Do → In Progress → In Review → Done`.

## Risks & Mitigations

| Risk | Impact | Mitigation | Owner |
|------|--------|------------|-------|
| Aiven shared DB wipe (`SEED_DB=true` dev) | High | `SEED_DB=false` default, `initialize_database()` idempotent, chat warning before `db:seed` (`deployment/configuration.md:112`) | Sibusiso |
| Gitea outage (SSO) | High | GitHub mirror (`implementation/backend.md` Render) | Busisiwe |
| GPS spoof/fake timing | High | Server-timed `trivia_issue.issued_at`, `distance_meters` gate, `offline_trivia_queue` deferred check | Samukelo |
| Coverage drop below 70% | Medium | `package.json:44` threshold fails `ci.yml` (`test:ci --coverage`) | Banele |
| Scope creep US2-10/US3 | Medium | Split curation to 4 sub-stories (8+5+3+2 pts) in `product-backlog.md` | Team |
| Map style rejected (“ugly”) | Low | Carto Voyager PoGO palette, `campus-style.js` single truth | Busisiwe |

## Roles

- Scrum Master: Busisiwe (facilitates, unblocks)
- Product Owner (proxy): Wits Heritage stakeholder (curation feedback)
- Dev: Pumelela (auth), Banele (leaderboard/sync), Sibusiso (curation/campaigns), Samukelo (geo/battle), Busisiwe (map/cards)

## Tools

Gitea (source), Taiga (Kanban), Render + Cloudflare + Aiven (deploy), Jest (tests), Prettier + `format-check.yml` (quality), Docusaurus (docs).
