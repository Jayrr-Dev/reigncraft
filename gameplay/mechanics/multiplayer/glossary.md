# Multiplayer glossary (ubiquitous language)

Terms for Devvit HTTP polling multiplayer rooms.

## Room terms

| Term | Meaning |
| ---- | ------- |
| **Room** | One shard of a Reddit post plaza; max **3** players (`PLAZA_DEVVIT_ONLINE_MAX_PLAYERS`). |
| **Room index** | 1-based `?room=` query param on sync/players API URLs. |
| **Participant count** | Live roster size returned on sync/players responses. |
| **Room full** | Join/sync rejected when count ≥ max; toast mentions 3 player cap. |

## Sync terms

| Term | Meaning |
| ---- | ------- |
| **Position sync** | Client POST to `/api/plaza/sync` every **150 ms**. |
| **Players poll** | Client GET `/api/plaza/players` every **400 ms**. |
| **Player TTL** | Redis record expires after **5 s** without sync. |
| **Sync payload** | `PlazaDevvitOnlineSyncRequest` motion + health + optional events. |
| **Player snapshot** | Sync payload plus `userId` and `updatedAt` ISO string. |

## Wildlife multiplayer

| Term | Meaning |
| ---- | ------- |
| **Wildlife leader** | Lowest lexicographic `userId` in room roster runs full wildlife sim. |
| **Wildlife snapshot** | Leader publishes mob positions/clips/health on sync. |
| **Wildlife damage event** | Leader publishes damage dealt for followers to apply. |
| **Follower client** | Non-leader applies remote snapshots; does not sim wildlife AI. |

## Combat sync

| Term | Meaning |
| ---- | ------- |
| **Projectile spawn event** | One fired projectile descriptor on sync POST. |
| **Max spawn events per sync** | **8** (`DEFINING_WORLD_PLAZA_PROJECTILE_ONLINE_SYNC_MAX_SPAWN_EVENTS`). |

## Profile fields on wire

| Term | Meaning |
| ---- | ------- |
| **displayName** | Shown nametag |
| **avatarUrl** | Serialized profile avatar (nullable) |
| **profileStatusKind** | Community status badge (nullable) |
| **avatarSkinId** | Selected skin for remote avatar render |

## Local-only (not synced)

| Term | Meaning |
| ---- | ------- |
| **Hunger tick** | Stays on local client |
| **Stamina tick** | Stays on local client |
| **SP fire cells** | Local store when not in online room |
| **Disease scheduler** | World epoch on save slot, not room sync |

## API response kinds

| Type | Meaning |
| ---- | ------- |
| `sync` | Join/heartbeat success with counts |
| `players` | Remote roster list |
| `rooms` | Room browser listing |
| `error` | Failure; may include `isRoomFull` |

## Code prefixes

| Prefix | Role |
| ------ | ---- |
| `PLAZA_DEVVIT_ONLINE_*` | Shared caps and paths |
| `usingWorldPlazaDevvitPolling*` | Client poll hooks |
| `electingWildlife*` | Leader pick |
| `buildingPlazaDevvitOnlineRoomApiUrl` | Room shard URLs |

## Anti-patterns

| Don't say | Say instead |
| --------- | ----------- |
| "WebSocket multiplayer" | **HTTP polling** (Devvit webview constraint) |
| "Server simulates all players" | **Leader** sims wildlife; clients sync snapshots |
| "All stats shared" | **Hunger/stamina local**; health/motion synced |
