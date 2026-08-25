# Sprint 1 - Meeting 7 Minutes

**Project:** Wits Quest  
**Group:** 404 Found Us  
**Date:** 18 August 2026  
**Time:** 14:15 – 17:00 (02:15 PM – 05:00 PM)  
**Venue:** Physical Team Meeting  
**Minutes Recorded By:** Samukelo  

---

## 1. Attendance
| Member | Status |
| :--- | :--- |
| Pumelela | Present |
| Banele | Present |
| Busisiwe | Present |
| Sibusiso | Present |
| Samukelo | Present |

*All members present.*

---

## 2. Team Discussion Summary
* Discussed sign-in using `better-auth` for third-party auth, alongside a webapp-based option (email and password).
* Evaluated database architecture: having two separate tables (one for `better-auth` accounts and one for webapp-based sign-ins) versus a single table with a boolean field indicating authentication type.
* Noted that UI design clarifications were addressed in the previous meeting's minutes.
* Discussed Busisiwe retrieving player location via the Geolocation API and marking it on the map previously implemented by Jon as part of his user story.
* **Git Policy Update:** Every member is now responsible for merging their own branches into `dev` and ensuring they do not break existing features.

---

## 3. User Story Allocations (Sprint 1)
| User Story         | Description                                                                                                                                                                                                    | Assigned Member |
| :---               | :---                                                                                                                                                                                                           | :---            |
| **User Story #6**  | As a content author, I can attach one or more questions (with correct answers) to an event, in different formats (multiple choice, true/false, fill-in-the-blank, etc.), so trivia isn't identical every time. | Pumelela        |
| **User Story #7**  | As a player, when I open a challenge I'm at, I'm shown a question and my answer is checked by the server and I see the correct answer afterward regardless of whether I got it right.                          | Banele          |
| **User Story #8**  | As a player, I receive the card tied to an event the first time I answer correctly and if I retry the event afterward (whether I won or lost previously), I don't get a second card.                           | Busisiwe        |
| **User Story #9**  | As a content author, I can define cards with a category and a set of attribute values in the console; as a player, I can browse the cards I've collected.                                                      | Sibusiso        |
| **User Story #10** | As a player, I can choose a deck from my collection and play a turn-based match against the CPU, picking an attribute each round to compare, with the game enforcing the rules and saving the finished match.  | Samukelo        |

---

## 4. Client Meeting with Adrusha
* **Attendance:** All team members present.
* Discussed prioritizing completion of basic requirements early to allow sufficient time for advanced requirements before the project deadline.
* Demonstrated backend, frontend, and database progress.
* Explained that certain features remain rigid (e.g., non-interactive database seeding) and experimental features are kept off the `dev` branch until bugs are resolved.
* Showcase included map implementation, content console, event fetching, and live player location mapping (currently on a feature branch).

---

## 5. Next Meeting
* **Date:** 20 August 2026  
* **Time:** 20:00 - 21:00
