---
sidebar_position: 4
---

# Game Systems

## 1. Trivia Scoring & Card Award (`routes/trivia.js:40`, `services/card_award.js:1`)

- **Eligible:** `is_correct && locationVerified && !timedOut`. Server-timed `elapsed_ms = Date.now() - req.session.trivia_issue.issued_at` (grace 1s, capped at limit).
- **Points:** `max(1, round(point_reward * (1 - elapsed_fraction/2)))` — instant = full, limit = half (linear decay, 50% floor).
- **Card rarity:** `getEventCardForSpeed(conn, event_id, elapsed_fraction)` pools `event_card_pool` with `copies_remaining`, sorted LEGENDARY→COMMON, picks `min(N-1, floor(fraction*N))` — fastest gets rarest. Eligibility once-only via `event_card_awards UNIQUE(user_id,event_id)` (`card_award.test.js:203` scenarios).

## 2. Card Pool (`routes/event_pool.js:28`)

`event_card_pool (pool_id, event_id, card_id, weight, global_copy_limit, copies_awarded)` with `UNIQUE(event_id,card_id)`. Console Card Pool sub-tab inline edits weight/limit, add via rarity-sorted dropdown. Tests `event_pool.test.js:84%`.

Cards 22 seeded (`seed.sql:62`) across `CHARACTER/LOCATION/INFLUENCE/HISTORICAL` × `COMMON…LEGENDARY`, stats `stat_attack/location/influence/legacy/legacy`.

## 3. Collection & Selling (`routes/cards.js:308`)

`user_cards UNIQUE(user_id,card_id)` quantity. `POST /api/cards/sell {card_id, quantity}` sells duplicates only (`quantity < owned.quantity`), points `RARITY_POINTS[rarity]*quantity` (COMMON 5…LEGENDARY 100), `UPDATE user_cards`, `UPDATE users.points`, `INSERT point_transactions CARD_SOLD` in transaction. Tested `cards.test.js:76%`.

## 4. Battle (`websocket/socket_router.js`, `js/battle.js`)

Lobby `battles` (`PENDING→ACTIVE`), `battle_decks` (slot_position 0-4, `final_health`), `battle_turns` (`ATTACK/BUFF/...`). `valid_user_cards()` checks ownership; `ws` 8.x syncs `battle_decks`/`battle_turns`. Frontend `battle.js` deck 5 validation via `POST /api/cards/valid-cards`.

## 5. Points & Seasons

`users.points` + `point_transactions` (`TRIVIA_WIN`, `CARD_SOLD`, …), `seasons` + `leaderboard_entries` (`wins/losses/score`). `GET /api/leaderboard` public paginated, `GET /me` rank.

## 6. Curation Systems (see `curation.md`)

Hard-question `failure_rate` and stale `days_since_end` drive repair/retire, not gameplay but progression curation.

## 7. Verification

- Unit: `card_award.test.js:100%` (4 scenarios + race), `cards.test.js`, `event_pool.test.js`.
- Manual: speed bracket manual timing, once-only card modal “already earned”.
