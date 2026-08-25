# Sprint 1 - Meeting 3 Minutes

**Project:** Wits Quest  
**Group:** 404 Found Us  
**Repository Name:** Adamas2Aurum  
**Date:** 9 August 2026  
**Meeting Type:** Third meeting / Second daily standup (Sprint 1, Kanban)  
**Minutes Taken By:** Busisiwe Mnguni  

---

## Attendees & Attendance
* **Present:** Pumelela Mapukata, Busisiwe Mnguni  
* **Absent:** Sibusiso Ndunge, Banele Mjali, Samukelo Zwane  
* **Apologies:** None  

---

## Purpose of the Meeting
To define the basic requirements for the Wits Quest project and come up with user stories for the core functionality.

---

## Project Brief Summary
Wits Quest is a campus exploration web game inspired by Pokémon GO. Players move around a campus map, discover nearby events, answer trivia questions, collect cards, and use those cards in turn-based battles against other players or the CPU. The game must verify location claims, award cards fairly, and provide a content authoring console for creating events, questions, and cards.

---

## Agreed User Stories
1. **Auth:** Users can register/log in via a third-party identity provider or with a username + PIN, with persistent sessions and full account management.
2. **Guest-accessible map / Login-gated challenges:** Visitors can browse the map without an account, but must log in before attempting a challenge.
3. **Live map with player position + Event proximity:** Players can see their live position and the range status of nearby events.
4. **Event authoring console (v0):** Content authors can create, edit, and remove events with coordinates, radius, and active time window.
5. **Server-side location verification:** The game verifies device-reported location against event coordinates and radius before allowing a challenge attempt.
6. **Question & answer authoring:** Content authors can attach multiple question formats and correct answers to events.
7. **Challenge flow with server-side marking:** Answers are marked by the server and the correct answer is shown after the attempt.
8. **Once-only card award with repeat-attempt handling:** Cards are awarded once per player/event pair, with clear repeat-attempt behaviour.
9. **Card definition (console) + Player collection view:** Authors can define cards and players can browse collected cards.
10. **Deck selection + Turn-based CPU battle:** Players can choose a deck and play a turn-based attribute comparison battle against the CPU.

---

## Key Decisions & Notes
* The team agreed to structure the game around a Kanban workflow.
* The basic requirements focus on map exploration, verification of presence, trivia challenges, card collection, and battle mechanics.
* The authoring console was explicitly defined as a separate authenticated area for content creators, not players.
* Location claims must be treated as unverified until the server checks them.
* Card rewards must be tracked per player and event, not per attempt.

---

## Next Steps
Use these user stories to break down Sprint 1 tasks, assign roles to team members, and begin implementation planning.