# API Reference

Adamas2Aurum exposes a single HTTP API served by a Node.js/Express backend. Every endpoint returns JSON. Requests are authenticated with a session cookie set by the login endpoints (or by Better Auth's Google flow); there is no bearer token or API key mechanism.

* **Base URL (local development):** `http://localhost:3000/api`
* **Production URL:** *Not yet deployed. This document describes the contract; deployment to a public host is tracked separately.*

## API Conventions

* **Request Format:** All request bodies must be `application/json`.
* **Response Format:** All responses are JSON.
* **Authentication:** Managed via a session cookie. Use `credentials: 'include'` on the client.
* **Errors:** Returned as `{ "error": "<human-readable message>" }` with an appropriate HTTP status code.
* **Success:** Successful responses return either the resource directly, or `{ "message": "..." }` for operations that do not return a resource.

---

## Authentication

Two authentication systems coexist. Both populate the same `req.session.user` shape (`{ user_id, name, email }`), ensuring downstream routes do not need to know which method was used.

* **PIN Auth (Legacy):** Email + 4-digit PIN. Endpoints under `/api/auth/*` (specifically `/login`, `/register`, `/logout`, `/me`) bypass Better Auth.
* **Google OAuth (Better Auth):** All other `/api/auth/*` paths are forwarded to the Better Auth handler. Requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`.

### `POST /api/auth/register`

Create a new account with email and PIN.

* **Auth required:** No
* **Errors:** `400` (missing fields, PIN too short), `409` (email already registered)

**Request Body:**

```json
{
  "email": "player@example.com",
  "name": "Test Player",
  "pin": "1234"
}
```

**Response `201`:**

```json
{
  "message": "Account created",
  "user_id": 5
}
```

### `POST /api/auth/login`

Sign in with email and PIN. Sets a session cookie.

* **Auth required:** No
* **Errors:** `401` (invalid credentials)

**Request Body:**

```json
{
  "email": "player@example.com",
  "pin": "1234"
}
```

**Response `200`:**

```json
{
  "user": {
    "user_id": 5,
    "name": "Test Player",
    "email": "player@example.com",
    "avatar_url": null,
    "points": 105
  }
}
```

### `GET /api/auth/me`

Return the currently authenticated user.

* **Auth required:** Yes
* **Errors:** `401` (no session)
* **Response `200`:** Returns the same user object as `/login`.

### `POST /api/auth/logout`

Clear the session cookie.

* **Auth required:** Yes
* **Response `200`:** `{ "message": "Logged out" }`

### Better Auth (OAuth) Endpoints

All other `/api/auth/*` endpoints are handled by Better Auth using standard conventions:

* `POST /api/auth/sign-in/social` - Initiate Google login.
* `POST /api/auth/sign-up/email` / `POST /api/auth/sign-in/email` - Standard Better Auth email flows (currently unused by the game; the UI uses the PIN flow).

---

## Events

**Mount:** `/api/events`

**Routers:** `routes/events.js`, `routes/event_pool.js`, `routes/qr.js`

### `GET /api/events`

List active events whose time window includes the current moment. Publicly used by the map page.

* **Auth required:** No

| Query Param | Type | Description |
| --- | --- | --- |
| `all` | string | Set to `"true"` to return all events (including inactive/future). Requires an author role. |

**Response `200`:**

```json
[
  {
    "event_id": 1,
    "title": "Origins of Gold Reef City",
    "description": "…",
    "latitude": "-26.19050000",
    "longitude": "28.02850000",
    "radius_meters": 100,
    "point_reward": 20,
    "starts_at": "2026-09-01T00:00:00.000Z",
    "ends_at": "2026-12-01T00:00:00.000Z",
    "is_active": 1,
    "author_id": 3
  }
]
```

### `GET /api/events/:id`

Fetch a single event.

* **Auth required:** No
* **Errors:** `404` (not found)
* **Response `200`:** Single event object.

### `POST /api/events`

Create a new event.

* **Auth required:** Yes (`SUPER_ADMIN` or `EVENT_AUTHOR` role)
* **Errors:** `400` (missing required fields), `401`, `403`

**Request Body:**

```json
{
  "title": "…",
  "description": "…",
  "latitude": -26.1905,
  "longitude": 28.0285,
  "radius_meters": 100,
  "point_threshold": 0,
  "point_reward": 10,
  "starts_at": "2026-09-01T00:00:00Z",
  "ends_at": "2026-12-01T00:00:00Z",
  "repeat_interval": null,
  "attempt_cooldown_s": 86400,
  "max_attempts_per_window": 1,
  "is_active": true
}
```

**Response `201`:** `{ "message": "Event created", "event_id": 7 }`

### `PUT /api/events/:id`

Update an event.

* **Auth required:** Yes (Author role)
* **Request Body:** Same shape as `POST /api/events`.
* **Response `200`:** `{ "message": "Event updated" }`

### `DELETE /api/events/:id`

Delete an event.

* **Auth required:** Yes (Author role)
* **Errors:** `404` (not found)
* **Response `200`:** `{ "message": "Event deleted" }`

### `GET /api/events/:eventId/pool`

List the cards an event can award.

* **Auth required:** Yes (Author role)

**Response `200`:**

```json
[
  {
    "pool_id": 1,
    "event_id": 1,
    "card_id": 3,
    "weight": 1,
    "global_copy_limit": 50,
    "copies_awarded": 12,
    "name": "Barney Barnato",
    "rarity": "RARE",
    "category": "CHARACTER",
    "image_url": "…"
  }
]
```

### `POST /api/events/:eventId/pool`

Add a card to an event's award pool.

* **Auth required:** Yes (Author role)
* **Errors:** `400` (invalid card_id or weight)

**Request Body:**

```json
{ "card_id": 3, "weight": 1, "global_copy_limit": 50 }
```

### `PUT /api/events/:eventId/pool/:poolId`

Update a pool entry's weight and copy limit.

* **Auth required:** Yes (Author role)
* **Request Body:** `{ "weight": 2, "global_copy_limit": 100 }` (Both optional)

### `DELETE /api/events/:eventId/pool/:poolId`

Remove a card from an event's pool.

* **Auth required:** Yes (Author role)
* **Response `200`:** `{ "message": "Card removed from pool" }`

### `GET /api/events/:id/qr-token`

Generate an expiring QR fallback token for an event (used when GPS accuracy is too poor).

* **Auth required:** Yes (Author role)

**Response `200`:**

```json
{
  "token": "abc123…",
  "qr_url": "http://localhost:3000/qr/abc123…",
  "expires_at": "2026-09-12T18:00:00.000Z"
}
```

### `POST /api/events/:id/verify-qr`

Verify a QR token submitted by a player. Writes a `FALLBACK_QR` row to `location_check_log`.

* **Auth required:** Yes
* **Errors:** `400` (missing token), `403` (expired or invalid)

**Request Body:**

```json
{ "token": "abc123…" }
```

**Response `200`:**

```json
{ "location_check_id": 42, "status": "FALLBACK_QR" }
```

---

## Questions (Authoring)

**Mount:** `/api` (Root-level router serves both event-scoped and direct-question paths)

**Router:** `routes/questions.js`

### `GET /api/events/:eventId/questions`

List all questions attached to an event. *The correct answer is not included in the response.*

* **Auth required:** No

**Response `200`:**

```json
[
  {
    "id": 1,
    "event_id": 1,
    "type": "MULTIPLE_CHOICE",
    "text": "Who founded Wits?",
    "options": ["Answer A", "Answer B", "Answer C"],
    "time_limit_s": 30,
    "difficulty": 1
  }
]
```

### `POST /api/events/:eventId/questions`

Create a question for an event.

* **Auth required:** Yes (Author role)
* **Errors:** `400` (validation), `404` (event not found)

**Request Body:**

```json
{
  "type": "MULTIPLE_CHOICE",
  "text": "Who founded Wits?",
  "correctAnswer": "Answer A",
  "options": ["Answer A", "Answer B", "Answer C"]
}
```

*(Valid types: `MULTIPLE_CHOICE`, `TRUE_FALSE`, `FILL_BLANK`)*

**Response `201`:** `{ "message": "Question created", "id": 12 }`

### `PUT /api/questions/:id`

Update a question. Old options are deleted and reinserted.

* **Auth required:** Yes (Author role)
* **Request Body:** Same as `POST`.

### `DELETE /api/questions/:id`

Delete a question (options cascade via FK).

* **Auth required:** Yes (Author role)

---

## Trivia (Gameplay)

**Mount:** `/api/trivia`

**Routers:** `routes/trivia.js`, `routes/sync.js`

### `GET /api/trivia/event/:eventId`

Fetch a random question for an event. *The correct option is never included in the response.*

* **Auth required:** Yes

**Query Parameters:** *(All required when `REQUIRE_LOCATION_VERIFICATION !== 'false'`)*

| Param | Type | Description |
| --- | --- | --- |
| `lat` | decimal | Player's claimed latitude |
| `lng` | decimal | Player's claimed longitude |
| `accuracy` | number | Reported GPS accuracy in meters |
| `qr_verified` | string | Set to `"true"` when using QR fallback path |
| `location_check_id` | integer | Required if `qr_verified` is true |

**Response `200` (Success):**

```json
{
  "question_id": 42,
  "body": "Who founded Wits?",
  "format": "MULTIPLE_CHOICE",
  "time_limit_s": 30,
  "options": [
    { "option_id": 1, "body": "Answer A" },
    { "option_id": 2, "body": "Answer B" }
  ],
  "card_eligibility": {
    "already_earned": false,
    "earned_card": null
  }
}
```

**Response `200` (GPS too poor, QR fallback required):**

```json
{
  "fallback_required": true,
  "reason": "GPS accuracy (75m) exceeds threshold.",
  "threshold_m": 50,
  "reported_accuracy_m": 75
}
```

### `POST /api/trivia/submit`

Submit an answer. The server grades it; the client sees the correct answer only *after* submission.

* **Auth required:** Yes
* **Errors:** `400` (missing fields), `401`, `404` (unknown question/invalid option)

**Request Body:**

```json
{
  "event_id": 1,
  "question_id": 42,
  "selected_option_id": 2,
  "answer_time_ms": 1500,
  "claimed_lat": -26.1905,
  "claimed_lng": 28.0285,
  "timed_out": false
}
```

*(On timeout: omit `selected_option_id` and set `"timed_out": true`)*

**Response `200`:**

```json
{
  "success": true,
  "is_correct": true,
  "timed_out": false,
  "location_verified": true,
  "distance_meters": 12,
  "points_awarded": 18,
  "answer_time_ms": 1487,
  "time_limit_s": 30,
  "elapsed_fraction": 0.049,
  "card_awarded": true,
  "awarded_card": {
    "card_id": 3,
    "name": "Barney Barnato",
    "image_url": "…",
    "rarity": "RARE",
    "category": "CHARACTER"
  },
  "already_earned_card": false,
  "correct_option_id": 2,
  "correct_option_text": "Answer B",
  "message": "Correct! You earned 18 points and a new card: …"
}
```

### `POST /api/trivia/offline-attempts`

Sync a batch of offline attempts. Evaluated against their captured `client_timestamp`.

* **Auth required:** Yes
* **Errors:** `400` (empty queue), `401`

**Request Body:**

```json
{
  "queued_attempts": [
    {
      "event_id": 1,
      "question_id": 42,
      "selected_option_id": 2,
      "answer_time_ms": 1500,
      "claimed_lat": -26.1905,
      "claimed_lng": 28.0285,
      "client_timestamp": "2026-09-11T10:00:00.000Z"
    }
  ]
}
```

**Response `200`:**

```json
{
  "synced": true,
  "results": [
    {
      "event_id": 1,
      "question_id": 42,
      "status": "ACCEPTED",
      "points_awarded": 15,
      "card_awarded": false,
      "awarded_card": null,
      "message": "Offline attempt successfully verified and credited."
    }
  ]
}
```

**Sync Status Codes:**

| Status | Meaning |
| --- | --- |
| `ACCEPTED` | Attempt verified and credited |
| `REJECTED_WINDOW_EXPIRED` | Captured timestamp is outside the event's active window |
| `REJECTED_GEOFENCE` | Coordinates outside the event radius |
| `REJECTED_WRONG_ANSWER` | Answer was incorrect |
| `REJECTED_INVALID_OPTION` | Option doesn't belong to the question |
| `REJECTED_EVENT_NOT_FOUND` | Event ID doesn't exist |
| `REJECTED_MALFORMED_PAYLOAD` | Missing required fields |
| `REJECTED_INVALID_DATA` | Unparseable coordinates or timestamp |
| `ERROR` | Server error during processing |

---

## Cards

**Mount:** `/api/cards`

**Router:** `routes/cards.js`

### `GET /api/cards/get-all`

List every card in the game catalogue.

* **Auth required:** No

### `GET /api/cards/:id`

Fetch a single card's metadata.

* **Auth required:** No

### `POST /api/cards/valid-cards`

Return all cards with availability info (used by the console's card-pool picker).

* **Auth required:** Yes

### `POST /api/cards/check-existence`

Given a list of card IDs, return the ones that still exist in the catalogue. Used to reconcile local collections after schema changes.

* **Auth required:** Yes

### `GET /api/cards/collection/mine`

Return the authenticated player's card collection.

* **Auth required:** Yes

### `POST /api/cards`

Create a new card.

* **Auth required:** Yes (`SUPER_ADMIN` or `CARD_AUTHOR` role)

### `PUT /api/cards/:id`

Update a card.

* **Auth required:** Yes (Author role)

### `POST /api/cards/sell`

Sell a duplicate card for points.

* **Auth required:** Yes

**Request Body:**

```json
{ "card_id": 3, "quantity": 1 }
```

### `DELETE /api/cards/:id`

Delete a card.

* **Auth required:** Yes (Author role)

---

## Leaderboard

**Mount:** `/api/leaderboard`

**Router:** `routes/leaderboard.js`

### `GET /api/leaderboard`

Return a paginated global leaderboard, sorted by points (descending) and user ID (ascending).

* **Auth required:** No

| Query Param | Default | Range |
| --- | --- | --- |
| `limit` | 50 | 1–100 |
| `offset` | 0 | ≥ 0 |

**Response `200`:**

```json
{
  "entries": [
    {
      "rank": 1,
      "user_id": 3,
      "name": "Alice Nkosi",
      "avatar_url": null,
      "points": 150,
      "wins": 3,
      "losses": 1
    }
  ],
  "total": 5,
  "limit": 50,
  "offset": 0
}
```

### `GET /api/leaderboard/me`

Return the current player's rank and a small sliding window of adjacent ranks.

* **Auth required:** Yes

**Response `200`:**

```json
{
  "rank": 2,
  "points": 105,
  "total_players": 5,
  "entry": { "rank": 2, "user_id": 5, "name": "Test Player", "points": 105 },
  "neighbours": [
    /* Up to 5 entries around the caller */
  ]
}
```

---

## Trades

Card-for-card swaps between two players. Mounted at `/api/trades`. All endpoints require a session.

### Trade object

Every trade returned by the endpoints below has the same shape:

```json
{
  "trade_id": 123,
  "initiator_id": 1,
  "receiver_id": 2,
  "initiator_card_id": 10,
  "receiver_card_id": 42,
  "status": "PENDING",
  "created_at": "2026-09-21T14:00:00.000Z",
  "resolved_at": null,
  "initiator": { "user_id": 1, "name": "Alice", "avatar_url": null },
  "receiver":  { "user_id": 2, "name": "Bob",   "avatar_url": null },
  "initiator_card": {
    "card_id": 10, "name": "Barney Barnato",
    "rarity": "RARE", "category": "CHARACTER", "image_url": "…"
  },
  "receiver_card": {
    "card_id": 42, "name": "Wits Great Hall",
    "rarity": "UNCOMMON", "category": "LOCATION", "image_url": "…"
  }
}
```

*`status` is one of `PENDING`, `ACCEPTED`, `DECLINED`, `CANCELLED`.*

### `POST /api/trades`

Create a new trade offer. The caller is the initiator.

* **Auth required:** Yes

**Request Body:**

```json
{
  "receiver_id": 2,
  "initiator_card_id": 10,
  "receiver_card_id": 42
}
```

* **Response `200`:** The newly created trade object.
* **Errors:**
  * `400` — Missing fields, trading with yourself, either party doesn't own their offered card, or the card rarities are too asymmetric.
  * `403` — One or both accounts are under 1 hour old.
  * `429` — Initiator has hit the daily trade cap (5 per 24h).

### `GET /api/trades/incoming`

Offers where the caller is the receiver, still `PENDING`.

* **Auth required:** Yes
* **Response `200`:** Array of trade objects, newest first.

### `GET /api/trades/outgoing`

Offers the caller has made, in any status.

* **Auth required:** Yes
* **Response `200`:** Array of trade objects, newest first.

### `POST /api/trades/:id/accept`

Atomically execute the swap. This is the only endpoint that moves cards.

* **Auth required:** Yes. Only the receiver may call this.
* **Response `200`:** The trade object with `status: "ACCEPTED"`.
* **Errors:**
  * `404` — Trade not found.
  * `403` — Caller is not the receiver.
  * `409` — Trade is no longer `PENDING`, or one party no longer owns their offered card.

### `POST /api/trades/:id/decline`

Receiver declines a pending trade. Does not touch cards.

* **Auth required:** Yes. Only the receiver may call this.
* **Response `200`:** `{ "message": "Trade declined" }`
* **Errors:** `403`, `404`, `409`

### `POST /api/trades/:id/cancel`

Initiator withdraws their own pending offer. Does not touch cards.

* **Auth required:** Yes. Only the initiator may call this.
* **Response `200`:** `{ "message": "Trade cancelled" }`
* **Errors:** `403`, `404`, `409`

### Anti-abuse Rules

All rules are checked at create time, so the receiver never sees an offer that would fail on accept:

| Rule | Threshold |
| --- | --- |
| `Daily cap` | Max 5 completed trades per user per rolling 24h |
| `Rarity balance` | `abs(rarity_value(init) - rarity_value(recv)) <= 20` |
| `Account age` | Both accounts must be at least 1 hour old |

Rarity values are defined in `utils/rarity_points.js` (`COMMON=5`, `UNCOMMON=10`, `RARE=20`, `EPIC=40`, `LEGENDARY=80`).

---

## Zones

Territory control. Each event is a "zone", and its owner is the player who has accumulated the most points from that event's trivia challenges over the last 24 hours. Ownership is resolved at read time by a deterministic function, with no background jobs.

Mounted at `/api/zones`.

### Zone Object

```json
{
  "event_id": 1,
  "event_title": "Great Hall",
  "owner_id": 5,
  "owner_name": "Alice",
  "score": 120,
  "updated_at": "2026-09-21T15:00:00.000Z"
}
```

### `GET /api/zones`

List every zone that currently has an owner.

* **Auth required:** No — public read (matches the leaderboard).
* **Response `200`:** Array of zone objects, ordered by most recently updated first.

### `GET /api/zones/:eventId`

Zone detail with the current owner and the recent scoreboard of challengers. Resolves the owner fresh on every call, so the response is always the current truth.

* **Auth required:** Yes
* **Response `200`:**

```json
{
  "event": { "event_id": 1, "title": "Great Hall", "radius_meters": 100 },
  "owner": {
    "user_id": 5,
    "name": "Alice",
    "score": 120
  },
  "previous_owner_id": null,
  "owner_changed": true,
  "window_hours": 24,
  "defence_bonus": 1.2,
  "scoreboard": [
    { "user_id": 5, "name": "Alice", "points": 120 },
    { "user_id": 6, "name": "Bob",   "points":  80 }
  ]
}
```

*`owner` is `null` if no player has been active in the window.*

* **Errors:** `401`, `404` (event not found)

### `GET /api/zones/mine`

Which zones the caller currently owns, plus their zone-count.

* **Auth required:** Yes
* **Response `200`:**

```json
{
  "zones": [
    { "event_id": 1, "event_title": "Great Hall", "score": 120, "updated_at": "…" }
  ],
  "zone_count": 1,
  "bonus_awarded_today": 0
}
```

Calling this endpoint triggers a lazy check for the daily zone ownership stipend (see below). `bonus_awarded_today` is the number of points awarded during this call — `0` if the player is not yet due the bonus.

### Defence Mechanic

The current owner gets a 20% score bonus. A challenger must beat the incumbent's stored score × 1.2 to take over the zone.

*Example:* Owner has a cached score of 100. Their effective defence threshold is 120. A challenger with 110 points does not take over; a challenger with 130 does.

### Zone Ownership Stipend

| Zones Owned | Daily Bonus |
| --- | --- |
| 0 – 2 | 0 points |
| 3 – 4 | +50 points |
| 5+ | +150 points |

Awarded at most once per calendar day per user, lazily when the user calls `GET /api/zones/mine`. No scheduled job — if the player never reads their zones, they never receive the bonus that day.

The bonus is recorded as a `ZONE_BONUS` row in `point_transactions`.

---

## Battles (WebSocket)

**Mount:** `/ws/battle`

**Routers:** `socket_router.js`, `battle_socket.js`

Adamas2Aurum handles live multiplayer and NPC card battles over a persistent WebSocket connection.

### Connection & Authentication

* **Auth required:** Yes. Authentication relies on the same session cookie as the HTTP API. The connection will be rejected with an HTTP `401 Unauthorized` during the upgrade phase if the session is invalid or missing.
* **Message Format:** All incoming and outgoing messages must be stringified JSON.
* **Reconnection Window:** If a player disconnects during an active battle, they are placed in a timeout state. They have exactly 2 minutes (120,000 ms) to reconnect; otherwise, the match is marked as `ABANDONED`.

### Client-to-Server Messages

Clients interact with the battle server by sending JSON objects containing a `type` property.

#### `join_lobby`

Places the player in the matchmaking lobby, or gracefully reconnects them to an active/pending battle if one exists.

* **Request:** `{ "type": "join_lobby" }`

#### `challenge_player`

Issues a pending PvP battle challenge to an available player in the lobby.

* **Request:** `{ "type": "challenge_player", "target_user_id": 12 }`

#### `accept_challenge`

Accepts or declines an incoming PvP match request.

* **Request:**

```json
{
  "type": "accept_challenge",
  "accept": true,
  "challenger_id": 12
}
```

#### `start_npc_battle`

Bypasses the lobby and immediately provisions a battle against the CPU using a randomly generated deck.

* **Request:** `{ "type": "start_npc_battle" }`

#### `submit_deck`

Commits the player's 5-card deck for an initialized battle.

* **Request:**

```json
{
  "type": "submit_deck",
  "deck": [
    { "card_id": 1 }, { "card_id": 2 }, { "card_id": 3 }, { "card_id": 4 }, { "card_id": 5 }
  ]
}
```

*(Note: Decks must contain exactly 5 valid cards)*

#### `attack`

Executes a combat turn. The turn is validated against the active player's state and card categories.

* **Request:**

```json
{
  "type": "attack",
  "attacker_slot": 0,
  "target_slot": 2,
  "action": "ATTACK"
}
```

*(Valid actions include `ATTACK`, `DEFEND`, `DODGE`, `BUFF`, `DEBUFF`, and `REVIVE`, depending on the card's category)*

#### `forfeit`

Forfeits an active battle, immediately awarding the win to the opponent.

* **Request:** `{ "type": "forfeit" }`

#### `ping`

Keep-alive mechanism.

* **Request:** `{ "type": "ping" }`

### Server-to-Client Events

The server pushes JSON payloads back to connected clients to update their state and respond to actions.

#### `lobby_users`

Broadcasts the list of currently online users resting in the lobby.

**Response:**

```json
{
  "type": "lobby_users",
  "users": [
    {
      "user_id": 12,
      "username": "Test Player",
      "name": "Test Player"
    }
  ]
}
```

#### `incoming_challenge`

Notifies a user that they have been challenged to a PvP match.

**Response:**

```json
{
  "type": "incoming_challenge",
  "from_user_id": 5,
  "from_username": "ChallengerName"
}
```

#### `reject_challenge`

Notifies the challenger that their match request was declined or the opponent was busy.

**Response:**

```json
{
  "type": "reject_challenge",
  "challenger_id": 5
}
```

#### `battle_started`

Indicates a match has been created and prompts clients to submit their decks. Includes `is_npc: true` if playing against the CPU, or the respective player IDs for PvP.

**Response (PvP):**

```json
{
  "type": "battle_started",
  "battle_id": 42,
  "player1_id": 5,
  "player2_id": 12
}
```

#### `deck_accepted`

Confirms a successful deck submission while waiting for the opponent.

**Response:**

```json
{
  "type": "deck_accepted",
  "battle_id": 42,
  "message": "Deck saved. Waiting for opponent..."
}
```

#### `state_update`

Delivers the complete, synchronized state of the board. Sent upon reconnection or after both decks are submitted.

**Response:**

```json
{
  "type": "state_update",
  "battle_id": 42,
  "state": { 
    /* large object that has information on the current state of the game */
  }
}
```

#### `turn_result`

Delivers the combat log and math results of an executed turn. If the opponent is an NPC, their turn is calculated and included in `opponent_result` within the same payload.

**Response:**

```json
{
  "type": "turn_result",
  "battle_id": 42,
  "player_user_id": 5,
  "winner": -1,
  "state": { /* Updated board state */ },
  "player_result": {
    "action": "ATTACK",
    "attacker_slot": 0,
    "target_slot": 2,
    "landed": true,
    "damage": 25,
    "target_health_after": 75
  },
  "opponent_result": null 
}
```

*(Note: `winner` returns `-1` if the match is ongoing, or the `user_id` of the victor if the match has concluded).*

#### `match_results`

Signals the end of the battle (due to knockout, forfeit, or abandonment).

**Response:**

```json
{
  "type": "match_results",
  "winner": 5
}
```

*(Note: `winner` is `null` if the match was abandoned by both players).*

#### `error`

Sent if a request fails validation. Often includes a `reject_type` indicating which action failed.

**Response:**

```json
{
  "type": "error",
  "reject_type": "attack",
  "message": "Not your turn"
}
```

#### `pong`

Standard response to a client `ping`.

**Response:**

```json
{ "type": "pong" }
```

---

## System / Miscellaneous

### `GET /api/health`

Health check endpoint to confirm DB connectivity.

* **Auth required:** No
* **Response `200`:** `{ "success": true, "tables": [...] }`

### `GET /api/me`

Top-level convenience endpoint that mirrors `GET /api/auth/me`. Returns the currently authenticated user.

* **Auth required:** Yes

---

## External Integrations

* **OpenStreetMap Tile Server:** Client-side map tiles used by Leaflet. Loaded directly from `tile.openstreetmap.org` in the frontend; this is not proxied through the backend.
* **Better Auth + Google OAuth:** Third-party identity provider used for sign-in. Requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
* **Aiven:** Managed MySQL host used for the shared development database.
