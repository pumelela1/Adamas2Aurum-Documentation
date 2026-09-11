# Test Cases

A catalogue of what the current test suite covers. Every test listed
here lives in a `*.test.js` file next to the code it tests and runs
via `npm test` at the repository root.

The suite has **three files** and **21 individual test cases**, split
across two Jest projects (`backend` and `frontend`).

## Backend — `routes/leaderboard.test.js`

**9 tests.** Integration-level: mounts the leaderboard router on a
minimal Express app, spins up a real HTTP listener on an ephemeral
port, mocks only the database pool, and drives requests with the
built-in `fetch`.

### `GET /api/leaderboard` (public read)

| # | Test | What it verifies |
| --- | --- | --- |
| 1 | Returns paginated entries with global 1-based rank | Response shape (`entries`, `total`, `limit`, `offset`), rank values computed from offset, points ordering |
| 2 | Offset shifts the 1-based rank | Requesting `?offset=50` reports the first returned row as rank 51, not rank 1 |
| 3 | Clamps `limit` into `[1, 100]` and `offset >= 0` | `?limit=99999&offset=-5` returns `limit: 100, offset: 0` — no unbounded query possible |
| 4 | Falls back to defaults on non-numeric params | `?limit=banana&offset=` returns `limit: 50, offset: 0` |
| 5 | Is public — no session required | Unauthenticated request returns 200, not 401 |

### `GET /api/leaderboard/me` (session required)

| # | Test | What it verifies |
| --- | --- | --- |
| 6 | 401s when there is no session | Endpoint rejects anonymous callers before touching the DB (asserted by `pool.query` never being called) |
| 7 | Returns rank, points, total, and neighbours | Happy path: rank is computed from `ahead + 1`, points and total are surfaced, neighbour window is non-empty |
| 8 | 404s when the session points at a user that no longer exists | A stale session cookie (user deleted mid-session) returns 404, not 500 |

**Mock strategy.** The test file calls `jest.unstable_mockModule('../utils/db.js', ...)` at the top so the router imports a mocked `pool` instead of the real MySQL connection. The mock records SQL calls and returns canned rows; tests assert on the returned HTTP response, not on SQL strings.

---

## Backend — `services/card_award.test.js`

**10 tests.** Unit-level: exercises the once-only card-award logic with a hand-rolled fake transaction connection. No HTTP, no real DB, no file system.

### `canAwardCard` — eligibility check

| # | Test | What it verifies |
| --- | --- | --- |
| 9 | Returns true when the player has never won this event | First-time player is eligible |
| 10 | Returns false once a prior correct attempt exists | A single prior win blocks any further award, regardless of retries |
| 11 | A prior WRONG attempt does not block eligibility | Retry-after-loss path: wrong attempts don't count as wins |

### `getEventCardForSpeed` — card selection

| # | Test | What it verifies |
| --- | --- | --- |
| 12 | Returns the first pool card that still has copies available | Pool query returns a card and the function returns it unchanged |
| 13 | Returns null when the event has no awardable card configured | Empty pool yields `null`, not an error |
| 14 | Faster answers land in a rarer bracket than slower ones | `elapsed_fraction = 0` selects the LEGENDARY card at pool index 0; `elapsed_fraction ≈ 1` selects the COMMON card at index 1 |

### `awardCardIfEligible` — the atomic check-and-award

| # | Test | What it verifies |
| --- | --- | --- |
| 15 | Scenario 1 — first correct answer awards the card | Happy path: award ledger row inserted, inventory upserted, copies counter incremented |
| 16 | Scenario 2 — retry after a prior win awards NO second card | Idempotence: no writes at all on a losing retry |
| 17 | Scenario 3 — retry after a loss still earns the card | The prior wrong attempt doesn't count as a win; the eventual correct answer is awarded |
| 18 | Event with no awardable card awards nothing and does not throw | Graceful degradation, no exception |
| 19 | Scenario 4 — two near-simultaneous first attempts: the race loser gets no card | Simulates the `UNIQUE(user_id, event_id)` backstop firing: the losing INSERT throws `ER_DUP_ENTRY` and the function returns `RACE_LOST` without touching inventory |
| 20 | A real (non-duplicate) DB error re-throws so the transaction rolls back | Only `ER_DUP_ENTRY` is caught; any other DB error propagates so the caller can roll back |

**Mock strategy.** The file builds a fake `conn` object with a `query` method that pattern-matches the SQL it receives and returns canned responses. Side-effecting queries (INSERT, UPDATE) increment counters on `conn.calls`, which the assertions then inspect. This lets the tests cover race conditions and error paths that would be difficult to trigger against a real database.

---

## Frontend — `js/geolocation.test.js`

**1 test.** Unit-level: verifies the browser geolocation wrapper resolves with the expected coordinate tuple.

| # | Test | What it verifies |
| --- | --- | --- |
| 21 | Resolves with `[latitude, longitude]` on success | `navigator.geolocation.getCurrentPosition` is called exactly once, and the wrapper's promise resolves with the correct tuple |

**Mock strategy.** The test replaces `global.navigator.geolocation` with a hand-rolled object whose `getCurrentPosition` immediately invokes its success callback. `afterEach` restores the original descriptor so subsequent tests are unaffected.

---

## What is deliberately not covered

- **Frontend DOM behaviour.** `js/leaderboard.js` and `js/console.js`
  are not tested in the current suite. Both were verified manually in
  the browser. This is a known gap tracked under "Gaps and future
  work" in the test plan.
- **WebSocket battle logic.** `websocket/battle_socket.js` and
  `websocket/battle_state.js` have no automated tests. Battle logic
  was verified manually during development.
- **Database migrations.** The schema is applied idempotently via
  `CREATE TABLE IF NOT EXISTS`; there is no migration framework to
  test.
- **Third-party integrations.** Better Auth, Google OAuth, and
  Cloudflare Pages deployment are not covered by the test suite.

## Relationship to the rubric

The Milestone 2 rubric asks for "UI or API testing implemented — useful
and extensive tests" at the Advanced tier. The current suite covers:

- **API testing** — 9 tests across two endpoints, with happy-path,
  error-path, parameter validation, session handling, and pagination
  coverage.
- **Service-layer testing** — 10 tests covering the once-only card
  award logic, including race conditions and rollback behaviour.
- **UI-adjacent testing** — 1 test for a browser API wrapper.

The suite does not currently include DOM-level frontend tests, which
is the main gap relative to the rubric's "UI and API testing" phrasing.
The plan is to close that gap in Sprint 3.
