---
sidebar_position: 1
---

# Project Overview


## Adamas to Aurum (A2A)

**Adamas to Aurum** is a location-based trivia and card-battle web game played on the campus of the University of the Witwatersrand (Wits). Players walk around campus to find events, answer questions about Wits history at those events, and earn collectible cards that they can use to battle other players.

The game is built by team **404 Found Us** as part of the **Wits Quest** project for the Software Design Project module.

> The campus *is* the game board. Wherever you are on campus, the game is being played around you.

---

## The Story Behind the Name

*Adamas* is Latin for **diamond**, and *Aurum* is Latin for **gold**. The name traces the real journey of Wits University itself:

| Year | Milestone |
|------|-----------|
| 1896 | The **South African School of Mines** is founded in **Kimberley**, the heart of South Africa's diamond-mining industry. |
| 1904 | The school moves to **Johannesburg**, the city built on the Witwatersrand gold reef, and becomes the **Transvaal Technical Institute**. |
| 1906 | Renamed the **Transvaal University College**. |
| 1910 | Renamed the **South African School of Mines and Technology**. |
| 1920 | Renamed the **University College, Johannesburg**. |
| 1922 | Granted full university status as the **University of the Witwatersrand**, with effect from 1 March. |

From the diamonds of Kimberley to the gold of the Witwatersrand, the university's story is literally one of *Adamas to Aurum*. The game carries this theme throughout: its questions and cards are built around Wits history, so every challenge doubles as a "did you know?" moment about the campus players walk through every day.

---

## How the Game Works

The core gameplay loop is simple:

1. **Explore** the campus map and see nearby events, shown as in-range, out-of-range, or expired.
2. **Walk** to an event's real-world location. The game verifies that you are physically within the event's radius before you can attempt it.
3. **Answer** the event's question. Questions come in different formats (multiple choice, true/false, fill-in-the-blank) and are checked by the server. The correct answer is always revealed afterwards, so you learn something either way.
4. **Collect** the card tied to that event the first time you answer correctly. Each card has a category, rarity, and a set of attributes.
5. **Battle** using a deck built from your collection. In each round, players pick an attribute to compare, and the stronger card wins the round.
6. **Climb** by earning points, unlocking achievements, keeping daily streaks, and rising up the leaderboard and ranked seasons.

As the game grows, players can also follow guided **trails** of events, challenge friends to **PvP matches** (asynchronous or live), **spectate** other matches, **trade** cards, and compete for control of campus **zones**.

---

## Who It's For

Adamas to Aurum is for **everyone on the Wits campus**: students, staff, and visitors alike. If you are on campus, you are a player.

- **Visitors** can open the website and explore the full map and events without an account, so there is no barrier to seeing what the game is about.
- **Players** log in (via a third-party identity provider, or a username and PIN) the moment they want to attempt a challenge, so their cards, points, and matches are saved to a persistent identity.
- **Content authors** use the admin console to create and publish events, questions, and cards.
- **Moderators** review flagged players and apply fair, graduated responses to suspicious behaviour.

---

## Platform

Adamas to Aurum is a **web application**. It runs in the browser on any phone, tablet, or computer with location access, so there is nothing to download or install. The game is designed primarily for mobile play, since players are walking around campus while they play.

For a full breakdown of the technologies used, see the [Tech Stack](./tech-stack.md) page. For a detailed list of what the game can do, see the [Features](./features.md) page.

---

## Key Principles

These principles shaped how the game was designed and built:

- **Real presence matters.** Challenges can only be attempted where they physically are. Location claims are verified on the server, backed up by fallback checks for poor GPS and anti-cheat analysis of movement patterns.
- **Learning through play.** Every question teaches something about Wits, whether the player gets it right or not.
- **Campus-wide coverage.** Events are placed and rotated across campus, including procedurally, so no area stays permanently empty and the game stays fresh.
- **Works on a real campus.** Dead zones happen, so attempts can be captured offline and verified later against the time and place they were made.
- **Fair competition.** Trust scoring, graduated moderation, and trading limits keep the game fair for honest players.

---

## Project Context

| | |
|---|---|
| **Module** | Software Design Project |
| **Project** | Wits Quest |
| **Team** | 404 Found Us (5 members) |
| **Methodology** | Agile using Kanban, delivered in 4 sprints |
| **Development time** | 70 days of dedicated development |

### Development Approach

The team used **Kanban** to manage the work. User stories for each sprint were placed on a shared Kanban board and moved through the workflow (e.g. *To Do → In Progress → Review → Done*), giving everyone visibility of what was being worked on and what was blocked. The project was delivered incrementally, with each sprint building on the last:

| Sprint | Focus | Highlights |
|--------|-------|------------|
| **Sprint 1: Basics** | Core gameplay | Accounts, campus map, location verification, questions, card collection, and CPU battles |
| **Sprint 2: Intermediate** | Depth and reliability | Offline play, anti-cheat, asynchronous PvP, profiles and achievements, leaderboard, card rarity, trails, and content review |
| **Sprint 3: Advanced** | Live and competitive play | Real-time matches, spectating, trust scoring, moderation, procedural event placement, ranked seasons, zone control, trading, and analytics |
| **Sprint 4: Submission** | Polish and delivery | Final integration, testing, and submission |

### Timeline

| Milestone | Date |
|-----------|------|
| Group Selection | 26 July 2026 |
| Project Proposal | 31 July 2026 |
| Project Assignment | 2 August 2026 |
| Milestone 1: Sprint 1 | 25 August 2026 |
| Milestone 2: Sprint 2 | 15 September 2026 |
| Milestone 3: Sprint 3 | 29 September 2026 |
| Milestone 4: Submission | 11 October 2026 |
| Group Report | 18 October 2026 |
| Group Presentation | 19–23 October 2026 |
| Individual Report & Peer Review | 27 October 2026 |

---

## The Team

**404 Found Us**

- Busisiwe Mnguni
- Banele Mjali
- Pumelela Mapukata
- Samkelo Zwane
- Sibusiso Ndunge

Rather than assigning fixed roles, the team divided work **per sprint**. Each sprint's user stories were shared out among all five members, so everyone worked across every part of the system: frontend, backend, database, and testing. This meant every member gained full-stack experience and no part of the codebase depended on a single person.
