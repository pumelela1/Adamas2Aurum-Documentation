# API Reference

Adamas2Aurum exposes a single HTTP API served by the Node.js/Express
backend. Every endpoint returns JSON. Requests are authenticated with
a session cookie set by the login endpoints (or by Better Auth's
Google flow); there is no bearer token or API key mechanism.

**Base URL (local development):** `http://localhost:3000/api`

**Production URL:** not yet deployed. This document describes the
contract; deployment to a public host is tracked separately.

## Conventions

- All request bodies are `application/json`.
- All responses are JSON.
- Authentication is via a session cookie. Use `credentials: 'include'`
  on the client.
- Errors are returned as `{ "error": "<human-readable message>" }`
  with an appropriate HTTP status code.
- Successful responses return either the resource directly, or
  `{ "message": "..." }` for operations that don't return a resource.

## Authentication

Two systems coexist. Both populate the same `req.session.user`
shape (`{ user_id, name, email }`), so downstream routes don't care
which method was used.

- **PIN auth** — email + 4-digit PIN. Endpoints under `/api/auth/*`
  with the path `/login`, `/register`, `/logout`, `/me` bypass
  Better Auth and are served by the legacy PIN router.
- **Google OAuth** — via Better Auth. All other `/api/auth/*` paths
  are forwarded to the Better Auth handler. Requires
  `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`; if
  missing, the Google flow returns `Provider not found`.

### `POST /api/auth/register`

Create a new account with email and PIN.

**Auth required:** No.

**Body:**
```json
{
  "email": "player@example.com",
  "name": "Test Player",
  "pin": "1234"
} Response 201:
json

{ "message": "Account created", "user_id": 5 }

Errors: 400 (missing fields, PIN too short), 409 (email already registered).
POST /api/auth/login

Sign in with email and PIN. Sets a session cookie.

Auth required: No.

Body:
json

{ "email": "player@example.com", "pin": "1234" }

Response 200:
json

{
  "user": {
    "user_id": 5,
    "name": "Test Player",
    "email": "player@example.com",
    "avatar_url": null,
    "points": 105
  }
}

Errors: 401 (invalid credentials).
GET /api/auth/me

Return the currently authenticated user.

Auth required: Yes.

Response 200: Same user object as above.

Errors: 401 (no session).
POST /api/auth/logout

Clear the session cookie.

Auth required: Yes.

Response 200: { "message": "Logged out" }
Better Auth (Google OAuth)

All other /api/auth/* endpoints are handled by Better Auth. Key
paths (standard Better Auth client conventions):

    POST /api/auth/sign-in/social — initiate Google login

    POST /api/auth/sign-up/email, POST /api/auth/sign-in/email —
    email + password flows (not used by the game; the UI uses PIN)

Events

Mount: /api/events
Router: routes/events.js, routes/event_pool.js, routes/qr.js
GET /api/events

List active events whose time window includes the current moment.
Public — used by the map page.

Auth required: No.

Query params:
Param	Type	Description
all	"true"	If set, returns all events (including inactive and future) for authoring. Requires an author role.

Response 200: array of events.
json

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

GET /api/events/:id

Fetch a single event.

Auth required: No.

Response 200: single event object.

Errors: 404 (not found).
POST /api/events

Create a new event.

Auth required: Yes — SUPER_ADMIN or EVENT_AUTHOR role.

Body: (fields marked * are required)
json

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

Response 201: { "message": "Event created", "event_id": 7 }

Errors: 400 (missing required fields), 401, 403.
PUT /api/events/:id

Update an event. Same body shape as POST.

Auth required: Yes — author role.

Response 200: { "message": "Event updated" }
DELETE /api/events/:id

Delete an event.

Auth required: Yes — author role.

Response 200: { "message": "Event deleted" }

Errors: 404.
GET /api/events/:eventId/pool

List the cards an event can award.

Auth required: Yes — author role.

Response 200: array of pool entries with joined card metadata:
json

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

POST /api/events/:eventId/pool

Add a card to an event's award pool.

Auth required: Yes — author role.

Body:
json

{ "card_id": 3, "weight": 1, "global_copy_limit": 50 }

Errors: 400 (invalid card_id or weight).
PUT /api/events/:eventId/pool/:poolId

Update a pool entry's weight and copy limit.

Auth required: Yes — author role.

Body: { "weight": 2, "global_copy_limit": 100 } (both optional).
DELETE /api/events/:eventId/pool/:poolId

Remove a card from an event's pool.

Auth required: Yes — author role.

Response 200: { "message": "Card removed from pool" }
GET /api/events/:id/qr-token

Generate a QR fallback token for an event. The client scans the
resulting QR code when GPS accuracy is too poor. QR tokens expire.

Auth required: Yes — author role.

Response 200:
json

{
  "token": "abc123…",
  "qr_url": "http://localhost:3000/qr/abc123…",
  "expires_at": "2026-09-12T18:00:00.000Z"
}

POST /api/events/:id/verify-qr

Verify a QR token submitted by a player's scanner. On success, writes
a FALLBACK_QR row to location_check_log and returns its
location_check_id — the player then includes that id when opening
and submitting a challenge.

Auth required: Yes.

Body: { "token": "abc123…" }

Response 200:
json

{ "location_check_id": 42, "status": "FALLBACK_QR" }

Errors: 400 (missing token), 403 (expired or invalid).
Questions (authoring)

Mount: /api (root level — the router serves both event-scoped
and direct-question paths)
Router: routes/questions.js
GET /api/events/:eventId/questions

List all questions attached to an event. The correct answer is
not included in the response.

Auth required: No.

Response 200: array of questions:
json

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

POST /api/events/:eventId/questions

Create a question.

Auth required: Yes — author role.

Body:
json

{
  "type": "MULTIPLE_CHOICE",
  "text": "Who founded Wits?",
  "correctAnswer": "Answer A",
  "options": ["Answer A", "Answer B", "Answer C"]
}

type is one of MULTIPLE_CHOICE, TRUE_FALSE, FILL_BLANK.

Response 201: { "message": "Question created", "id": 12 }

Errors: 400 (validation), 404 (event not found).
PUT /api/questions/:id

Update a question — old options are deleted and reinserted.

Auth required: Yes — author role.

Body: same as POST.
DELETE /api/questions/:id

Delete a question (options cascade via FK).

Auth required: Yes — author role.
Trivia (player-facing)

Mount: /api/trivia
Routers: routes/trivia.js, routes/sync.js
GET /api/trivia/event/:eventId

Fetch a random question for an event, ready for the player to answer.
The correct option is never included in the response.

Auth required: Yes.

Query params (all required when REQUIRE_LOCATION_VERIFICATION !== 'false'):
Param	Type	Description
lat	decimal	Player's claimed latitude
lng	decimal	Player's claimed longitude
accuracy	number	Reported GPS accuracy in meters
qr_verified	"true"	Set when using QR fallback path
location_check_id	integer	Required with qr_verified

Response 200:
json

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

Special response 200 — GPS too poor, QR required:
json

{
  "fallback_required": true,
  "reason": "GPS accuracy (75m) exceeds threshold.",
  "threshold_m": 50,
  "reported_accuracy_m": 75
}

Errors: 401 (no session), 403 (outside radius / invalid QR),
404 (event or question not found), 400 (missing location).
POST /api/trivia/submit

Submit an answer. The server grades it; the client never sees
the correct answer until after submission.

Auth required: Yes.

Body:
json

{
  "event_id": 1,
  "question_id": 42,
  "selected_option_id": 2,
  "answer_time_ms": 1500,
  "claimed_lat": -26.1905,
  "claimed_lng": 28.0285,
  "timed_out": false
}

On a timeout submission, omit selected_option_id and set
"timed_out": true.

Response 200:
json

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

correct_option_text is always returned, whether the player got
the answer right or wrong — this is the Story 7 requirement.

Errors: 400 (missing fields), 401, 404 (unknown question or
invalid option).
POST /api/trivia/offline-attempts

Sync a batch of attempts captured offline. Each attempt is evaluated
against its captured client_timestamp, not the current server time.

Auth required: Yes.

Body:
json

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

Response 200:
json

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

Possible status values:
Status	Meaning
ACCEPTED	Attempt verified and credited
REJECTED_WINDOW_EXPIRED	Captured timestamp outside the event's active window
REJECTED_GEOFENCE	Captured coordinates outside the event radius
REJECTED_WRONG_ANSWER	Answer was incorrect
REJECTED_INVALID_OPTION	Option doesn't belong to the question
REJECTED_EVENT_NOT_FOUND	Event id doesn't exist
REJECTED_MALFORMED_PAYLOAD	Missing required fields
REJECTED_INVALID_DATA	Unparseable lat/lng/timestamp
ERROR	Server error during processing

Errors: 400 (empty queued_attempts), 401.
Cards

Mount: /api/cards
Router: routes/cards.js
GET /api/cards

List every card in the game (catalogue).

Auth required: No.
GET /api/cards/:id

Fetch a single card's metadata.

Auth required: No.
GET /api/cards/get-all

Return all cards with availability info (used by the console's
card-pool picker).

Auth required: Yes.
POST /api/cards/valid-cards

Given a list of card ids, return the ones that still exist in the
catalogue. Used by clients to reconcile their local collection with
the server after a schema change.

Auth required: Yes.

Body: { "card_ids": [1, 2, 3] }
GET /api/cards/collection/mine

Return the authenticated player's card collection.

Auth required: Yes.
POST /api/cards

Create a new card.

Auth required: Yes — SUPER_ADMIN or CARD_AUTHOR role.
PUT /api/cards/:id

Update a card.

Auth required: Yes — author role.
POST /api/cards/sell

Sell a duplicate card for points.

Auth required: Yes.

Body: { "card_id": 3, "quantity": 1 }
DELETE /api/cards/:id

Delete a card.

Auth required: Yes — author role.
Leaderboard

Mount: /api/leaderboard
Router: routes/leaderboard.js
GET /api/leaderboard

Return a page of the global leaderboard, sorted by
users.points DESC, users.user_id ASC.

Auth required: No.

Query params:
Param	Default	Range
limit	50	1–100
offset	0	≥ 0

Response 200:
json

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

GET /api/leaderboard/me

Return the current player's rank and a small neighbour window.

Auth required: Yes.

Response 200:
json

{
  "rank": 2,
  "points": 105,
  "total_players": 5,
  "entry": { "rank": 2, "user_id": 5, "name": "Test Player", "points": 105 },
  "neighbours": [ /* up to 5 entries around the caller */ ]
}

Miscellaneous
GET /api/health

Health check — confirms DB connectivity.

Auth required: No.

Response 200: { "success": true, "tables": [...] }
GET /api/me

Return the currently authenticated user (top-level convenience
endpoint, mirrors GET /api/auth/me).

Auth required: Yes.
External API integrations

    OpenStreetMap tile server —
    client-side map tiles used by Leaflet. Loaded directly from
    tile.openstreetmap.org in the frontend; not proxied through the
    backend.

    Better Auth + Google OAuth —
    third-party identity provider used for sign-in. Requires
    GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.

    Aiven — managed MySQL host used by the
    shared development database.
