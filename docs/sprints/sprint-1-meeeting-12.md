# Meeting 12 — Development Issues and Sprint 2 Work Allocation

**Date:** 30 August 2026
**Meeting Type:** Development and Sprint Planning Meeting
**Attendance:** All team members were present.
**Minutes taken by:** Pumelela

## Purpose of Meeting

The team met to review the outstanding development issues, discuss problems affecting the development branch, and allocate the **Sprint 2 – Intermediate** user stories among team members.

## Development Issues

The following technical issues were discussed:

* Problems with running the **development branch**.
* Issues with the **login and authentication functionality**.
* Complications when **merging changes between branches**.

These issues needed to be addressed to ensure that team members could continue development and integrate their work successfully.

## Sprint 2 – Intermediate User Story Allocation

The Sprint 2 user stories were allocated as follows:

| Team Member    | User Story                                                        |
| -------------- | ----------------------------------------------------------------- |
| **Busisiwe**   | **1. Offline Attempt Capture (Client-Side)**                      |
| **Banele Jon** | **2. Offline Sync & Deferred Verification (Backend)**             |
| **Pumelela**   | **3. Movement-Based Trust Check (Anti-Cheat v1)**                 |
| **Samkelo**    | **4. Low-Accuracy Fallback Verification**                         |
| **Sibusiso**   | **5. Asynchronous PvP (Challenge, Turn Exchange and Forfeiture)** |

### 1. Offline Attempt Capture (Client-Side) — Busisiwe

The functionality allows a player without network signal to open an event they have reached, complete its challenge, and have their attempt stored locally on their device.

The implementation should include:

* Storing the player's answer, timestamp, and location fix in local storage.
* Displaying a clear **"Saved, will sync"** state to the player.
* Ensuring that queued attempts remain available after the application is restarted.

### 2. Offline Sync & Deferred Verification (Backend) — Banele Jon

When a device reconnects, queued attempts must be verified based on the **time at which they were captured**, rather than the time at which they are synchronised.

The implementation should include:

* Reusing the existing Basic-tier verification logic using the stored timestamp.
* Allowing an attempt to count if the event was valid when the attempt was captured, even if it expired before synchronisation.
* Rejecting queued attempts captured outside the event's active window.

### 3. Movement-Based Trust Check (Anti-Cheat v1) — Pumelela

This feature will analyse a player's sequence of previously verified location checks to identify journeys that would not realistically have been possible on foot.

The implementation should include:

* Reading from the location log created by the existing Basic-tier verification process.
* Flagging attempts where the implied travel speed exceeds a defined walking-speed threshold.
* Making the result queryable through a flag field or database table rather than only displaying it in the console.

At this stage, suspicious attempts only need to be **flagged** and do not need to be automatically punished or rejected.

### 4. Low-Accuracy Fallback Verification — Samkelo

When GPS accuracy is too poor to reliably verify a player's location, the system should use a secondary verification method.

The implementation should include:

* Defining and implementing one fallback method, with **QR verification** identified as the simplest option to build and demonstrate.
* Automatically triggering the fallback when the reported GPS accuracy exceeds a defined threshold.
* Feeding the fallback success or failure result into the same verification process used for GPS verification.

### 5. Asynchronous PvP — Sibusiso

This feature allows players to challenge one another to a match where each player can take their turn at a convenient time rather than requiring both players to be online simultaneously.

The implementation should include:

* Reusing the existing Basic-tier turn-based battle logic.
* Persisting the match state between turns.
* Providing a notification or indicator when it is a player's turn.
* Implementing a configurable timeout, for example **48 hours**, after which an inactive player automatically forfeits the match.

## Discussion on Work Distribution

During the meeting, some team members initially wanted to continue working only on the user stories or areas they had previously worked on. However, it became apparent that the team needed a better understanding of **each other's work** and the overall project.

Concerns were raised regarding the available time and the need to complete the Sprint 2 work efficiently. After discussion, the team agreed that members should not be restricted to working only on their individually assigned user stories.

Although each user story has a primary team member responsible for it, the team agreed to work collaboratively and assist with other user stories where necessary. This would ensure that:

* Team members have a better understanding of the overall system.
* Work can continue if a team member encounters difficulties.
* Knowledge of the project is shared across the team.
* The available time can be used more effectively to complete Sprint 2.

## Decisions

The team agreed to:

* Resolve the issues affecting the development branch.
* Investigate and fix the login and authentication problems.
* Address merge complications between branches.
* Begin work on the allocated Sprint 2 user stories.
* Allow team members to contribute to other user stories when necessary.
* Ensure that all team members develop an understanding of the work completed across the project.

## Next Meeting

The next meeting was scheduled for **Tuesday, 1 September 2026**, with the client, **Adrusha Reddy**.

The purpose of the meeting will be to review the team's progress and discuss the current state of the project.

---

*Declaration: ChatGPT was used to assist with correcting grammar, wording, and formatting of these meeting minutes. The content, user story allocation, discussions, and decisions reflect the team's meeting.*
