# Project Roadmap

A campus-based location game.
Players explore a map, complete geolocated challenges, collect cards,
and battle.
Development runs in three sprints, tracked via Kanban, with meetings every Tuesday,
Thursday, and Sunday.

---

## Timeline at a Glance

| Sprint                                     | Weeks | Dates                | Meetings | Status                             |
| ---                                        | ---   | ---                  | ---      | ---                                |
| **Sprint 1** - Core Loop                   | 1–3   | 03 Aug – 23 Aug 2026 | 1–9      | Completed                          |
| **Sprint 2** - Offline, Trust & Engagement | 4–6   | 24 Aug – 13 Sep 2026 | 10–18    | Completed                       |
| **Sprint 3** - Real-Time, Fraud & Live Ops | 7–9   | 14 Sep – 04 Oct 2026 | 19–27    | In Progress (today: Meeting 19) |
| **Wrap-up & Review**                       | 10    | 05 Oct – 11 Oct 2026 | 28–30    | Planned                         |

---

## Sprint 1 - Core Loop (Weeks 1–3) ✅

Establishing identity, the map, events, and the first playable game loop.

| ID    | Story                                                                | Owner    |
| ---   | ---                                                                  | ---      |
| US-01 | User authentication (3rd-party or username + PIN)                    | Pumelela |
| US-02 | Guest exploration of the map, login gated on challenge attempts      | Banele   |
| US-03 | Geolocation & proximity - in-range / out-of-range / expired events   | Busisiwe |
| US-04 | Event management (create/edit/remove, location, radius, time window) | Sibusiso |
| US-05 | Server-side location verification against event coordinates/radius   | Samukelo |
| US-06 | Question authoring (MCQ, T/F, fill-in-the-blank)                     | Pumelela |
| US-07 | Challenge verification - server-checked answers                      | Banele   |
| US-08 | Single card reward per event (no duplicate claims)                   | Busisiwe |
| US-09 | Card definitions & collection browsing                               | Sibusiso |
| US-10 | Turn-based CPU card battle                                           | Samukelo |

---

## Sprint 2 - Offline, Trust & Engagement (Weeks 4–6) ✅

Making the game resilient to bad connectivity and harder to spoof, plus the
first layer of retention mechanics.

| ID     | Story                                                                    | Owner                                   |
| ---    | ---                                                                      | ---                                     |
| US2-01 | Offline attempt capture on-device                                        | Busisiwe                                |
| US2-02 | Offline sync & deferred (timestamp-accurate) verification                | Banele                                  |
| US2-03 | Movement-based trust check (flagging unwalkable journeys)                | Pumelela                                |
| US2-04 | Low-accuracy GPS fallback via QR scan                                    | Sibusiso                                |
| US2-05 | Asynchronous PvP with auto-forfeit on inactivity                         | Samukelo *(swap discussed w/ Sibusiso)* |
| US2-06 | Player profile - points, achievements, streaks                           | Busisiwe                                |
| US2-07 | Leaderboard                                                              | Banele                                  |
| US2-08 | Card rarity, duplicate fusing/selling, deck constraints                  | Pumelela                                |
| US2-09 | Trails - ordered event sequences                                         | Samukelo                                |
| US2-10 | Content curation pipeline (draft → review → publish → retire, analytics) | Sibusiso                                |

---

## Sprint 3 - Real-Time, Fraud & Live Ops (Weeks 7–9) 🔄

Live multiplayer, anti-cheat maturity, and the tooling to run the game as
an ongoing service. Team assignments are still to be discussed. 

| ID     | Story                                                                    | Owner |
| ---    | ---                                                                      | ---   |
| US3-01 | Live match real-time sync (no refresh)                                   | TBD   |
| US3-02 | Turn timers & reconnect/resume handling                                  | TBD   |
| US3-03 | Match spectating                                                         | TBD   |
| US3-04 | Trust/fraud scoring engine from existing signals                         | TBD   |
| US3-05 | Graduated moderation response + console review queue                     | TBD   |
| US3-06 | Procedural event placement across campus                                 | TBD   |
| US3-07 | Ranked matchmaking, ratings & seasons                                    | TBD   |
| US3-08 | Zone/territory control with contested-zone resolution                    | TBD   |
| US3-09 | Atomic peer-to-peer card trading, with anti-funneling limits             | TBD   |
| US3-10 | Console analytics dashboard (locations, question difficulty, drop rates) | TBD   |

---

## Week 10 - Wrap-up & Review (05 Oct – 11 Oct 2026) ⏳

Buffer week for stabilization, final QA, and demo prep. No stories are
currently scheduled here. It will be for spillovers from Sprint 3 and final polish.

---

## Meeting Cadence

- Tuesdays, Thursdays, Sundays - 3 meetings/week.
- Kanban-based workflow.
