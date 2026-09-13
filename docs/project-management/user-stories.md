# User Stories
This document details the Sprint requirements for **Adamas2Aurum** (404-Found-Us).

---

## User Stories for Sprint 1

### Sprint 1 User Stories & Team Assignments

| Story ID | User Story Description | Assigned Member |
| :--- | :--- | :--- |
| **US-01** | **User Authentication:** As a user, I can register/log in via a third-party identity provider (e.g. Better Auth) or create a username + PIN so I have a persistent identity. | **Pumelela** |
| **US-02** | **Guest Exploration:** As a visitor, I can see and explore the map without an account, but I'm prompted to log in the moment I try to attempt a challenge. | **Banele** |
| **US-03** | **Geolocation & Proximity:** As a player, I can see my current position on the map alongside events, and tell at a glance which are in-range, out-of-range, or expired. | **Busisiwe** |
| **US-04** | **Event Management:** As a content author, I can create, edit, and remove events on the map — setting their location, radius, and active time window. | **Sibusiso** |
| **US-05** | **Server-Side Verification:** As the game, I must verify a player's device-reported location against an event's real coordinates and radius before allowing a challenge attempt. | **Samukelo** |
| **US-06** | **Question Authoring:** As a content author, I can attach one or more questions (with correct answers) to an event in different formats (MCQ, T/F, fill-in-the-blank). | **Pumelela** |
| **US-07** | **Challenge Verification:** As a player, when I open a challenge, I'm shown a question and my answer is checked by the server, seeing the correct answer afterward. | **Banele** |
| **US-08** | **Single Card Reward Constraint:** As a player, I receive the card tied to an event the first time I answer correctly, preventing duplicate card claims on retries. | **Busisiwe** |
| **US-09** | **Card Definitions & Collection:** As a content author, I can define cards with a category and attributes in the console; as a player, I can browse collected cards. | **Sibusiso** |
| **US-10** | **Turn-Based CPU Card Battle:** As a player, I can choose a deck from my collection and play a turn-based match against the CPU evaluating attribute values. | **Samukelo** |

---

## User Stories for Sprint 2

### Sprint 2 User Stories & Team Assignments

| Story ID   | User Story Description                                                                                                                                                                                                                                         | Assigned Member                                       |
| :---       | :---                                                                                                                                                                                                                                                           | :---                                                  |
| **US2-01** | **Offline attempt capture (client-side):** As a player without signal, I can open an event I've reached, answer its challenge, and have my attempt stored on my device, so a dead zone on campus doesn't stop me from playing.                                 | **Busisiwe**                                          |
| **US2-02** | **Offline sync & deferred verification (backend):** As the game, when a device reconnects, I check each queued attempt as though it happened at its captured timestamp — against the event's active window and radius at that time — not against "now".        | **Banele**                                            |
| **US2-03** | **Movement-based trust check:** As the game, I analyze a player's sequence of past verified location checks to flag journeys that couldn't have been walked, so a spoofed single GPS ping isn't enough to cheat.                                               | **Pumelela**                                          |
| **US2-04** | **Low-accuracy fallback verification:** As the game, when a device reports GPS accuracy too poor to trust, I fall back to a secondary signal (QR scan) to confirm presence instead.                                                                            | **Sibusiso**                                          |
| **US2-05** | **Asynchronous PvP:** As a player, I can challenge another player to a match, each of us takes our turn whenever it suits us, and if one of us goes quiet for too long the match is forfeited automatically.                                                   | **Samukelo** (Sibusiso and Samukelo discussed a swap) |
| **US2-06** | **Player profile, points, achievements, streaks:** As a player, I have a profile showing my points, unlocked achievements, and my current daily streak, so there's a reason to keep coming back beyond just collecting cards.                                  | **Busisiwe**                                          |
| **US2-07** | **Leaderboard:** As a player, I can see how I rank against everyone else by points, so there's competitive pull to keep playing.                                                                                                                               | **Banele**                                            |
| **US2-08** | **Card rarity, duplicate value, and deck constraints:** As a player, rarer cards are harder to obtain, duplicates I collect can be fused/sold for value instead of sitting dead, and my deck must follow build constraints rather than being freely assembled. | **Pumelela**                                          |
| **US2-09** | **Trails:** As a player, I can follow a trail — a set of events I must complete in order — and see what's nearby and still unvisited, so exploration feels guided rather than random.                                                                          | **Samukelo**                                          |
| **US2-10** | **Content curation pipeline:** As a content author, I draft an event/question/card and it only goes live after review and publish — and I can schedule it for a campaign window, retire it afterward, and see which questions players get wrong most often.    | **Sibusiso**                                          |


---

## User Stories for Sprint 3

### Sprint 3 User Stories & Team Assignments

| Story ID | User Story Description | Assigned Member |
| :--- | :--- | :--- |
| **US3-01** | **Live match real-time sync:** As two players in the same match, our moves and board state update for both of us instantly, without refreshing, so the match feels live rather than turn-by-turn-with-a-delay. | **TBD** |
| **US3-02** | **Turn timers & reconnect handling:** As a player in a live match, I have a limited time to take my turn, and if I disconnect mid-match I can rejoin and resume exactly where I left off instead of losing the match outright. | **TBD** |
| **US3-03** | **Match spectating:** As any player, I can watch a live match in progress without participating, so matches have visibility beyond just the two players. | **TBD** |
| **US3-04** | **Trust/fraud scoring engine:** As the game, I compute a trust score per player from signals already being logged — implausible movement, duplicate submissions, accounts that only ever match each other — so suspicious behavior is detected rather than assumed absent. | **TBD** |
| **US3-05** | **Proportionate moderation response + console review queue:** As a moderator, I see flagged players surfaced on the console with the evidence behind the flag, and the system applies a graduated response (warning → restriction → suspension) rather than an instant ban. | **TBD** |
| **US3-06** | **Procedural event placement:** As the game, I automatically distribute events across campus — respecting walkable paths, keeping them spaced apart, capping how many are live at once, and rotating them over time — so no part of campus stays permanently empty. | **TBD** |
| **US3-07** | **Ranked matchmaking, ratings & seasons:** As a competitive player, I have a rating that goes up or down based on match results, I get matched against players of similar standing, and periodically a new season resets the field. | **TBD** |
| **US3-08** | **Zone/territory control:** As a player, I can claim a campus zone by being active there, hold it against other players, and see contested zones resolve fairly when multiple players act on the same zone at once. | **TBD** |
| **US3-09** | **Atomic peer-to-peer trading:** As a player, I can offer specific cards to another player in exchange for theirs, and the trade either completes fully for both of us or not at all — with limits in place so this can't be used to funnel an entire collection into one account. | **TBD** |
| **US3-10** | **Console analytics dashboard:** As a content author, I can see which locations and events draw players and which are ignored, which questions are answered correctly too often to be worth asking, and whether card drop rates match what was intended, so I can tune the game with evidence instead of guessing. | **TBD** |
