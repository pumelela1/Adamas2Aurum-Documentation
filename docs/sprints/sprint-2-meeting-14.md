# sprint-2-meeting-14

## Sprint 2 - Meeting 1 Minutes

**Project:** Wits Quest

**Group:** 404 Found Us

**Date:** 3 September 2026

**Time:** 20:00 – 21:00 (08:00 PM – 09:00 PM)

**Venue:** Online Team Meeting

**Minutes Recorded By:** Sibusiso

---

### 1. Attendance

| Member | Status |
| --- | --- |
| Pumelela | Present |
| Banele | Present |
| Busisiwe | Present |
| Sibusiso | Present |
| Samukelo | Present |

*All members present.*

---

### 2. Team Discussion Summary

- Shared secrets with the team, as some members were experiencing issues — distributed the updated `.env` file and the `ca.pem` key.
- Banele completed his assigned user story; all other members are still in progress with their respective work.
- Pumelela fixed the authentication bug related to `better-auth`.

---

### 3. User Story Allocations (Sprint 2)

| User Story | Description | Assigned Member |
| --- | --- | --- |
| **Offline attempt capture (client-side)** | As a player without signal, I can open an event I've reached, answer its challenge, and have my attempt stored on my device, so a dead zone on campus doesn't stop me from playing. Includes: attempt (answer + timestamp + location fix) written to local storage and not sent yet; UI clearly shows a "saved, will sync" state rather than pretending it succeeded live; queue survives an app restart. | Busisiwe |
| **Offline sync & deferred verification (backend)** | As the game, when a device reconnects, I check each queued attempt as though it happened at its captured timestamp — against the event's active window and radius at that time — not against "now." Includes: verification logic reuses the Basic-tier check, keyed off the stored timestamp; correctly handles an event that expired between capture and sync (still counts if valid when captured); rejects a queued attempt whose timestamp falls outside the event's window. | Banele |
| **Movement-based trust check (anti-cheat v1)** | As the game, I analyze a player's sequence of past verified location checks to flag journeys that couldn't have been walked (e.g. two events 2km apart "reached" 30 seconds apart), so a spoofed single GPS ping isn't enough to cheat. Includes: reads from the location log the Basic-tier verification already writes; flags (doesn't yet auto-punish) attempts where implied travel speed exceeds a walking-speed threshold; result is queryable via a flag field or table, not just a console log. | Pumelela |
| **Low-accuracy fallback verification** | As the game, when a device reports GPS accuracy too poor to trust, I fall back to a secondary signal — e.g. scanning a campus WiFi network name (WitsGuest or eduroam) — to confirm presence instead. Includes: define and implement one fallback method (QR is simplest to build and demo); triggered automatically when reported accuracy exceeds a threshold; fallback success/failure feeds into the same verification result as the GPS path. | Sibusiso |
| **Asynchronous PvP (challenge, turn exchange, forfeiture)** | As a player, I can challenge another player to a match, each of us takes our turn whenever it suits us, and if one of us goes quiet for too long the match is forfeited automatically. Includes: reuses Basic-tier turn-based battle logic, persisted between turns instead of resolved live; notification/flag that it's "your turn"; a configurable timeout (e.g. 48h) auto-forfeits an inactive player. | Samukelo |

---

### 4. Next Meeting

- **Date:** Sunday, 6 September 2026
- **Time:** 20:00 (Online)

---