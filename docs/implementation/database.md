# Database

## Overview

Adamas2Aurum uses **MySQL 8.4** as its single persistent data store. The
application connects via the `mysql2/promise` driver, so every query is
returned as a Promise and uses parameter placeholders (`?`).

The database can be run in one of two ways:

- **Locally via Docker** - a `docker-compose.yml` in `app/src/backend/`
  spins up a MySQL instance on port `8024` with the credentials in
  `.env`.
- **Hosted on [Aiven](https://aiven.io/)** - managed MySQL over TLS,
  used by the shared development database. `utils/db.js` reads
  `DB_SSL=true` and loads `certs/ca.pem` for the TLS handshake.

Connection settings are read from environment variables (`.env`), never
hard-coded. See `app/src/backend/utils/db.js` for the pool configuration.

## Schema lifecycle

`app/src/backend/db/schema.sql` is the database schema. Every
statement uses `CREATE TABLE IF NOT EXISTS`, so running it
against an existing database is safe and non-destructive.

The schema is applied on backend startup by `initialize_database()` in
`server.js`. There is no migration framework yet. Schema changes are
made by editing `schema.sql` and, for existing databases, running the
corresponding `ALTER` statements manually, or modifying the `CREATE` statements
and running `npm run db:reset` afterwards.

Test data is seeded separately via `npm run db:seed`, which runs
`db/seed.sql`. This is **destructive** (it truncates and reinserts) and
is therefore never run automatically - the shared Aiven database is used
by the whole team, and an accidental reseed would wipe data another
teammate is actively testing against.

## Entity-relationship summary

At a high level, the schema divides into seven domains:

- **Identity & roles** - `users`, `user_credentials`, `admin_roles`
- **Events & trivia content** - `events`, `trivia_questions`,
  `trivia_options`, `questions`, `event_qr_tokens`
- **Cards & collections** - `cards`, `event_card_pool`, `user_cards`,
  `event_card_awards`
- **Gameplay attempts & location verification** -
  `trivia_attempts`, `location_check_log`, `user_discovered_events`
- **Battles** - `battles`, `battle_decks`, `battle_turns`
- **Economy & progression** - `point_transactions`, `cosmetics`,
  `user_cosmetics`, `seasons`, `leaderboard_entries`
- **Trading & audit** - `trades`, `audit_log`

The main gameplay loop is: a player arrives at an `event`, their
location is verified (recorded in `location_check_log`), they answer a
`trivia_question` (recorded in `trivia_attempts`), and if correct and
eligible, a card from `event_card_pool` is added to their `user_cards`
with a row in `event_card_awards` as the authoritative record.

## Table reference

### Identity & roles

| Table | Purpose |
| --- | --- |
| `users` | Every account in the system. Key columns: `user_id` (PK), `email`, `name`, `avatar_url`, `points` (current score, denormalised for fast leaderboard reads). A `provider_id` unique column lets the same user be represented consistently whether they log in via PIN or Google OAuth. |
| `user_credentials` | PIN hash for users who use the legacy PIN login. One-to-one with `users`; rows exist only for users who have a PIN. |
| `admin_roles` | Role assignments. A user can hold multiple roles: `SUPER_ADMIN`, `EVENT_AUTHOR`, `CARD_AUTHOR`, `MODERATOR`. Authoring-console routes check this table before allowing write operations. |

### Events & trivia content

| Table | Purpose |
| --- | --- |
| `events` | Physical locations on campus where gameplay happens. Stores the coordinates, the interaction radius, the active time window, cooldown rules, and the point reward. |
| `trivia_questions` | Questions attached to an event. The `format` enum covers `MULTIPLE_CHOICE`, `TRUE_FALSE`, `MULTIPLE_SELECT`, and `FILL_BLANK`. Each question has a time limit and difficulty level. |
| `trivia_options` | Answer choices for `trivia_questions`. `is_correct` marks the right one(s). The server never exposes `is_correct` to the client - answer grading is always server-side. |
| `questions` | User-Story-6 question-authoring table. Stores `MULTIPLE_CHOICE` / `TRUE_FALSE` / `FILL_BLANK` questions with the correct answer directly on the row. This coexists with `trivia_questions` while the console's question editor is migrated. Deleting an event cascades to its questions. |
| `event_qr_tokens` | Fallback verification tokens for the low-GPS-accuracy path. When a player's device reports poor accuracy, the console can display a QR code whose token the client scans and submits. |

### Cards & collections

| Table | Purpose |
| --- | --- |
| `cards` | Card catalogue. Category (`CHARACTER`, `LOCATION`, `INFLUENCE`, `HISTORICAL`), rarity (`COMMON` … `LEGENDARY`), five battle stats, and an optional ability. |
| `event_card_pool` | Which cards an event can award. `weight` biases selection; `global_copy_limit` (nullable) is the total copies that can ever be awarded across all players for this event+card pair - the mechanism that enforces rarity. `copies_awarded` is incremented atomically on each award. |
| `user_cards` | A player's collection. `quantity` tracks duplicate counts, so future mechanics (duplicate fusion, sale) have a home without a schema change. |
| `event_card_awards` | The **authoritative record** that a player has earned the card for a given event. `UNIQUE(user_id, event_id)` is the hard backstop that enforces the brief's "awarded once" rule - even under concurrent requests, exactly one INSERT wins. |

### Gameplay attempts & location verification

| Table | Purpose |
| --- | --- |
| `location_check_log` | Every location check the server performs. Records the claimed coordinates, the computed distance to the event, the verification outcome (`PENDING` / `VERIFIED` / `FAILED` / `SPOOFED` / `FALLBACK_QR`), and (when available) the implied travel speed from the previous check. Doubles as the anti-spoofing audit trail. |
| `trivia_attempts` | Every question submission. Records the answer time, correctness, points awarded, whether a card was awarded, and the cooldown window (`cooldown_until`) that gates further attempts on the same user+event pair. |
| `user_discovered_events` | Which events a player has ever physically reached. Acts as an anti-exploit gate for trading (players can't trade cards for events they never visited). |

### Battles

| Table | Purpose |
| --- | --- |
| `battles` | A match header. `status` moves through `PENDING` → `ACTIVE` → `COMPLETED` / `FORFEITED` / `ABANDONED`. Supports both CPU and player-vs-player modes. |
| `battle_decks` | The cards each player brought to a battle, one row per slot. `final_health` records surviving HP at match end. `UNIQUE(battle_id, user_id, slot_position)` prevents duplicate slots. |
| `battle_turns` | The turn-by-turn action log. Records who acted, what card they played, the action type (`ATTACK`, `BUFF`, `DEBUFF`, `DEFEND`, `DODGE`, `REVIVE`), damage dealt, and whether the action landed. |

### Economy & progression

| Table | Purpose |
| --- | --- |
| `point_transactions` | Every points change as an append-only ledger. The `reason` enum (`TRIVIA_WIN`, `CARD_SOLD`, `SEASON_BONUS`, etc.) supports audit and future analytics. `users.points` is the denormalised running total. |
| `cosmetics` | Catalogue of purchasable cosmetic items - card frames, battle effects, avatars. Each has a `point_cost`. |
| `user_cosmetics` | Which cosmetics a player has bought. Join table with a composite PK. |
| `seasons` | Named competitive seasons with `starts_at` / `ends_at` and an `is_active` flag. |
| `leaderboard_entries` | Per-season score tracking. The Sprint 2 leaderboard reads from `users.points` for all-time ranking; this table exists for the Sprint 3 season-scoped leaderboard. |

### Trading & audit

| Table | Purpose |
| --- | --- |
| `trades` | Two-sided peer-to-peer card trades. One row per proposed trade with both sides' offers and a `status` enum (`PENDING` / `ACCEPTED` / `DECLINED` / `CANCELLED`). |
| `audit_log` | Every create / update / delete made through the authoring console. Captures the actor, target table and row, and JSON snapshots of state before and after the change - supports review and rollback. |

## Key design decisions

**Once-only card awards are enforced in the database, not the application.**
The brief says a card tied to an event is awarded exactly once. That rule
is enforced by `UNIQUE(user_id, event_id)` on `event_card_awards`. Two
concurrent requests can both pass the application-level eligibility
check, but only one INSERT will succeed - the other throws `ER_DUP_ENTRY`
and is treated as a benign race loss.

**`event_card_pool.global_copy_limit` enforces card scarcity.**
Rarity tiers (`LEGENDARY`, `EPIC`, etc.) are meaningful only if the total
supply of a card is bounded. `global_copy_limit` caps the lifetime awards
for a given event+card pair, and `copies_awarded` tracks how many have
been given out. The award-selection query filters out fully-claimed
pool entries, so rare cards genuinely run out.

**Location verification is server-side and audited.**
The client reports its coordinates; the server treats that claim as
untrusted and independently computes distance, timestamp delta, and
implied travel speed. Every check is written to `location_check_log`
regardless of outcome. This log is both the security audit trail and
the data source for the later trust-scoring work (Sprint 3, advanced
tier).
