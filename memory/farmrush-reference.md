# FarmRush — Reference Architecture for Reigncraft

Saved for later. **Do not treat this as live code** — it documents how [FarmRush](https://github.com/abenezer101/farmrush) solves multiplayer on Reddit Devvit without WebSockets.

## Why this reference matters

Reigncraft goals overlap with FarmRush:

- Top-down movement (WASD / arrows)
- Multiple players in one post
- Shared world state
- Redis persistence (works immediately, no HTTP fetch approval)

FarmRush explicitly documents the Devvit constraint: **no WebSockets → HTTP polling + Redis**.

---

## Stack

| Layer | Choice |
|-------|--------|
| Client | Phaser 3, TypeScript, Vite |
| Server | Express on Devvit (serverless) — can map to Hono in reigncraft |
| Database | **Devvit Redis only** |
| Sync | **HTTP polling** (not Realtime, not Colyseus) |
| Devvit version in repo | 0.12.1 (older split client/server Vite builds) |

Reigncraft already uses `@devvit/start` unified Vite + Hono — keep that tooling; borrow FarmRush’s **data model and polling pattern**.

---

## Multiplayer model (core solution)

```
Client A ──POST /api/player-position──► Devvit server ──► Redis
Client B ◄──GET /api/active-players──── Devvit server ◄── Redis
Client B ──POST /api/harvest-corn──────► Devvit server ──► Redis (shared tiles)
All      ◄──GET /api/game-timer─────────  (authoritative round clock)
```

- **No external domains** — everything via `/api/*`
- **No Convex / Colyseus** required
- **Per-post rooms** — `postId` from Devvit `context` scopes all Redis keys

### Polling intervals (from FarmGame.ts)

| Action | Interval | Endpoint |
|--------|----------|----------|
| Send own position | **150ms** | `POST /api/player-position` |
| Fetch other players | **400ms** | `GET /api/active-players` |
| Sync harvested tiles | **300ms** | `GET /api/harvested-corn` |
| Game timer / phase | **1000ms** | `GET /api/game-timer` |

Expected latency: ~150–400ms. Acceptable for 3-player co-op; tune down if fewer players.

---

## Redis key schema

| Key | Type | Purpose |
|-----|------|---------|
| `player:{postId}:{userId}` | Hash | Position, rotation, cornCount, lastUpdate |
| `active-players:{postId}` | Hash | userId → JSON player snapshot |
| `leaderboard:{postId}` | Sorted set | userId → high score |
| `timer:{postId}` | Hash | WAITING / ACTIVE / ENDED state + timestamps |
| `harvested-corn:{postId}` | Hash | `"x,y"` → harvest timestamp |
| `score:{postId}:{userId}` | String | Current session score (optional) |

**TTL pattern:** `expire` player keys and `active-players` hash at **5 seconds** so disconnected players drop off without explicit leave events.

---

## Server API (copy this surface for Reigncraft)

### Init & scoring

- `GET /api/game-init` — username, current score, top-10 leaderboard
- `POST /api/save-score` — `{ score }` — only updates if new high score (`zAdd`)
- `GET /api/leaderboard` — top 10

### Multiplayer sync

- `POST /api/player-position` — `{ x, y, rotation, cornCount }`
- `GET /api/active-players` — `{ players: [...] }` (excludes self)

### Shared world

- `POST /api/harvest-corn` — `{ x, y }` — marks tile harvested for all
- `GET /api/harvested-corn` — `{ harvestedCorn: [{ x, y }] }`

### Round timer (optional for Reigncraft)

- `GET /api/game-timer` — server-owned state machine:

```
WAITING (10s) → ACTIVE (60s) → ENDED (10s) → WAITING ...
```

First request initializes timer in Redis; all clients stay in sync by polling.

---

## Client architecture (Phaser)

### Scenes

```
Boot → Preloader → SplashScreen → LoadingScene → FarmGame → GameOver
```

- **FarmGame.ts** (~1000 lines) — main scene: movement, polling, other player sprites, harvest, timer HUD
- Procedural graphics (rectangles + emoji) — no heavy assets required initially

### Multiplayer client patterns

1. **Own player** — move locally every frame; POST position on interval
2. **Other players** — Map keyed by `userId`; create/update/destroy sprites on poll
3. **Shared tiles** — local harvest → POST to server; poll harvested set to hide corn globally
4. **Labels** — username + corn count above each tractor

### Movement

- Speed: 250 px/s, normalized diagonals
- Camera lerp: ~0.08 follow
- Grid: 120×120 × 24px tiles (adjust for isometric later)

---

## Game design parameters (defaults)

| Setting | Value |
|---------|-------|
| Max players (FarmRush) | Uncapped in code; use TTL + polling |
| **Reigncraft target** | **Cap at 3** — enforce in join/position handlers |
| Round time | 60s active, 10s lobby/end |
| Tile regrow | 60s client-side + server harvest hash |

---

## Mapping FarmRush → Reigncraft (when ready)

| FarmRush | Reigncraft adaptation |
|----------|----------------------|
| Top-down tractor | Isometric 8-dir sprites |
| `rotation` field | `direction` 0–7 or angle |
| Corn harvest grid | Tile/world edits (blocks, resources) |
| 120×120 grid | Smaller initial world; expand later |
| Express server | Hono routes in `src/server/routes/` |
| Single `index.html` | Keep `splash.html` + `game.html` entrypoints |
| No player cap | **`if (count >= 3) reject join`** on server |

### Reigncraft `devvit.json` permissions needed

```json
"permissions": {
  "redis": true,
  "realtime": false
}
```

Realtime is optional — FarmRush proves polling alone works. Can add Realtime later to reduce poll frequency.

---

## What FarmRush does NOT use

- Convex / Supabase / external HTTP fetch
- WebSockets / Colyseus
- Devvit Realtime (`connectRealtime`) — polling only
- tRPC

---

## Known limits (from FarmRush README)

- ~150–400ms sync latency
- No dedicated disconnect handler — relies on Redis TTL (5s)
- Harvest validation is server-side for shared corn; movement is trust-but-verify
- Older Devvit 0.12 split-build layout — reigncraft 0.13 unified Vite is fine

---

## Files to read in upstream repo

| Path | Why |
|------|-----|
| `src/server/index.ts` | All Redis + API logic |
| `src/client/game/scenes/FarmGame.ts` | Polling loops + multiplayer rendering |
| `src/shared/types/api.ts` | Shared types |
| `README.md` | Full API + tuning docs |

Clone when needed:

```bash
git clone https://github.com/abenezer101/farmrush.git
```

---

## Decision log

- **2026-07-02:** Chose to **record** FarmRush pattern, not port yet. Use Redis + polling as foundation when building Reigncraft multiplayer (3 players max). Convex remains blocked until Reddit approves domain.
