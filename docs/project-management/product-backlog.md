---
sidebar_position: 3
---

# Product Backlog

Source of truth: **Taiga** Kanban `Adamas2Aurum` (epics → user stories → tasks → subtasks). Export snapshot 14 Sep 2026. Prioritised by MoSCoW; status reflects Gitea `dev` branch.

## Epics & Prioritisation

| Epic | Stories | Priority | Status |
|------|---------|----------|--------|
| **Map & Exploration** | US-01 Geo, US-02 Guest, US-03 Proximity | Must | Done Sprint 1 |
| **Auth & Roles** | US-01 Auth, US-04 Roles | Must | Done Sprint 1 |
| **Trivia & Verification** | US-05 Location, US-06 Question CRUD, US-07 Challenge, US-08 Card award | Must | Done Sprint 1–2 |
| **Collection & Economy** | US-09 Cards, US2-08 Rarity/duplicates, US-10 Battle | Must | Done Sprint 1–2 |
| **Curation (Sprint 3)** | US2-10 / Sprint 3 curation brief | Must | **Done Sep 2026** — `events.curation_status`, `campaigns`, `analytics` |
| **Realtime & Social** | US2-05 Async PvP, US3-01 Live sync, US3-09 Trading, US2-07 Leaderboard | Should | Done (async), Leaderboard done, Trading/Season schema ready |
| **Trust & Offline** | US2-01..04 Offline, movement check, QR, US3-04 Fraud score | Should | Done |
| **Tooling** | CI, coverage, docs | Must | Done — `ci.yml`, `badges/`, `threshold 70%` |

## Detailed Backlog (Taiga export, top 20)

| Rank | Story | Points | Sprint | Status | Assignee |
|------|-------|--------|--------|--------|----------|
| 1 | US-01 Auth (PIN + OAuth) | 5 | 1 | Done | Pumelela |
| 2 | US-04 Event CRUD | 5 | 1 | Done | Sibusiso |
| 3 | US-05 Server location verify | 3 | 1 | Done | Samukelo |
| 4 | US-06 Question authoring MC/TF/FB | 3 | 1 | Done | Pumelela |
| 5 | US-07 Challenge verification | 3 | 1 | Done | Banele |
| 6 | US-08 Single card award | 5 | 1 | Done | Busisiwe |
| 7 | US2-10 Curation Draft→Publish | 8 | 3 | **Done** | Sibusiso |
| 8 | Curation — Campaigns term/open-day | 5 | 3 | **Done** | Sibusiso |
| 9 | Curation — Hard-question analytics | 3 | 3 | **Done** | Sibusiso |
| 10 | Curation — Retire stale (30d) | 2 | 3 | **Done** | Sibusiso |
| 11 | US2-02 Offline sync deferred | 5 | 2 | Done | Banele |
| 12 | US2-04 QR fallback | 3 | 2 | Done | Sibusiso |
| 13 | US2-07 Leaderboard | 3 | 2 | Done | Banele |
| 14 | US2-08 Duplicate sell | 3 | 2 | Done | Pumelela |
| 15 | CI with coverage badges (self-hosted) | 5 | 3 | **Done** | Team |
| 16 | Docs: curation + API + testing 83% | 5 | 3 | **Done** | Team |
| 17 | US3-06 Procedural placement | 5 | 3 | To Do (Future) | TBD |
| 18 | US3-04 Trust scoring engine | 5 | 3 | To Do | TBD |
| 19 | US3-09 Atomic trading | 5 | 3 | Schema done | TBD |
| 20 | US3-10 Analytics dashboard | 3 | 3 | **Done** (Insights tab) | TBD |

*Full Taiga board: `https://taiga.sdp.ms.wits.ac.za/project/adamas2aurum` (Wits SSO). 46 cards, 12 in Done Sprint 3, 6 WIP, 28 To Do (Sprint 3-4 stretch).*

## Sprint Mapping

- **Sprint 1 (2–23 Aug):** US-01…US-10 (auth, map, trivia, cards, battle).
- **Sprint 2 (24 Aug–13 Sep):** US2-01…US2-10 (offline, QR, PvP, leaderboard, rarity, trails, curation kickoff).
- **Sprint 3 (14 Sep–23 Oct):** Curation workflow + campaigns + analytics + `ci.yml` 83.4% + docs (this board). See `project-plan.md` Gantt.

## Refinement

Weekly backlog grooming (Mondays 14:00, see `meetings.md`). Curation stories were split from US2-10 after stakeholder review “authoring should become curation” (Sprint 2 meeting 17).
