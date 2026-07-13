# Multiplayer mechanics and gameplay

How players coexist in a Devvit post room without WebSockets.

## Architecture overview

```mermaid
flowchart LR
  subgraph clientA [Client A]
    SA[POST sync 150ms]
    PA[GET players 400ms]
  end

  subgraph redis [Redis]
    R[Player records TTL 5s]
  end

  subgraph clientB [Client B]
    SB[POST sync 150ms]
    PB[GET players 400ms]
  end

  SA --> R
  SB --> R
  R --> PA
  R --> PB
```

Devvit webviews use **HTTP polling** only. No persistent WebSocket channel.

## Room capacity

| Parameter             | Value      |
| --------------------- | ---------- |
| Min players per world | **2**      |
| Max players per world | **4**      |
| Default on create     | **3**      |
| Player TTL            | **5 s**    |
| Sync POST interval    | **150 ms** |
| Remote poll interval  | **400 ms** |

Joining when full returns error with `isRoomFull: true`. Message uses that world's `maxPlayers` (not a fixed 3).

Home flow: **Create** / **Open** (public occupied) / **Join by name** / **Continue** (alumni). Empty public worlds hide from Open but keep progress. Private worlds never appear on Open.

API: `GET/POST /api/plaza/rooms`, `GET .../mine`, `GET .../lookup`, `GET .../hosted`, `DELETE /api/plaza/rooms?room=`, `POST .../kick`.

## Sync loop (per client)

```mermaid
sequenceDiagram
  participant C as Local client
  participant S as /api/plaza/sync
  participant P as /api/plaza/players
  participant R as Remote clients

  loop Every 150ms
    C->>S: POST sync payload
    S-->>C: participantCount, maxPlayers
  end

  loop Every 400ms
    C->>P: GET players
    P-->>C: remote snapshots
    C->>R: Apply remote avatars
  end
```

Hook: `usingWorldPlazaDevvitPollingRoom.ts`.

On disable/unmount, client stops POSTing; record expires after **5 s** TTL.

### Sync loop performance diagnostics

Dev-facing meters only. No player toast or HUD change. Emitted from `postingPlazaSync` via `measuringWorldPlazaPerformanceDiagnostics` + `definingWorldPlazaPerformanceDiagnosticsConstants`.

| Signal                         | Kind    | When                                                    |
| ------------------------------ | ------- | ------------------------------------------------------- |
| `ONLINE_SYNC_SKIPPED_INFLIGHT` | counter | Sync requested while another POST still in flight       |
| `ONLINE_SYNC_ROUND_TRIP`       | sample  | Duration of one POST attempt (success, error, or throw) |
| `ONLINE_SYNC_FAILURE`          | counter | Response `type: 'error'` or network/parse throw         |
| `ONLINE_PARTICIPANT_COUNT`     | gauge   | Set to `data.participantCount` after successful sync    |

Failure counter fires before the existing disconnect / room-full snapshot update. Skipped in-flight requests still return `false` and wait for the next **150 ms** tick.

## Movement sync cadence

Normal movement is published by the **150 ms** sync interval. Click-walk updates the local position every rendered frame, but those steps do not start their own HTTP requests.

| Event                                       | Sync behavior                                     |
| ------------------------------------------- | ------------------------------------------------- |
| Click-walk step                             | Wait for the shared 150 ms interval               |
| Click-walk arrival                          | Request an immediate sync                         |
| Jump, roll, teleport, or respawn transition | Request an immediate sync                         |
| Request while another sync POST is active   | Skip it; the next interval sends the latest state |

`usingWorldPlazaDevvitPollingRoom.ts` owns the single-flight guard. `renderingWorldPlazaPixiScene.tsx` keeps inventory drop range checks on each walk step without coupling those checks to a network POST.

## What syncs

### Always on each POST

| Field                                                           | Purpose                                                                                                     |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Position `x`, `y`, `layer`                                      | Avatar placement                                                                                            |
| `motionKind`, `facingDirection`                                 | Animation state                                                                                             |
| `jumpStartedAtMs`, `jumpArcPeakScreenPx`                        | Jump arc sync                                                                                               |
| `healthCurrent`, `healthEffectiveMax`                           | Health bar                                                                                                  |
| `shieldPoints`, `isInvincible`                                  | Combat state                                                                                                |
| `displayName`, `avatarUrl`, `profileStatusKind`, `avatarSkinId` | Nametag and cosmetics                                                                                       |
| `heldItemVisualId`, `heldItemTier`                              | Equipped hotbar overlay pair (still synced; draw gated by `DEFINING_WORLD_PLAZA_HELD_ITEM_OVERLAY_ENABLED`) |

Local walk avatar writes the pair onto motion state each tick from `equippedHeldItemPresentationRef`. Poll hook copies them onto `PlazaDevvitOnlineSyncRequest`. Remotes map snapshots into `DefiningWorldPlazaRemotePlayer`, then `renderingWorldPlazaGirlSampleRemoteAvatar` resolves presentation with `resolvingWorldPlazaHeldItemPresentationFromNetworkFields`. Overlay draw is currently **off** for local and remote (`DEFINING_WORLD_PLAZA_HELD_ITEM_OVERLAY_ENABLED = false`).

| Condition                            | Remote overlay            |
| ------------------------------------ | ------------------------- |
| Overlay flag false                   | Always hide               |
| Both fields valid registry ids       | Show matching sheet frame |
| Either `null` / missing / unknown id | Hide overlay (unarmed)    |

### Optional event arrays (when non-empty)

| Array                   | Publisher      | Consumer                  |
| ----------------------- | -------------- | ------------------------- |
| `projectileSpawnEvents` | Shooter client | Peers spawn visuals/logic |
| `wildlifeSnapshots`     | Leader only    | Followers render mobs     |
| `wildlifeDamageEvents`  | Leader only    | Followers apply damage    |

Projectile batch capped at **8** events per sync (`DEFINING_WORLD_PLAZA_PROJECTILE_ONLINE_SYNC_MAX_SPAWN_EVENTS`).

## Wildlife leader election

```mermaid
flowchart TD
  R[Roster = local userId + remote userIds]
  S[Sort lexicographic]
  L[Lowest userId = leader]
  R --> S --> L
  L -->|leader| SIM[Run full wildlife sim]
  L -->|follower| SNAP[Consume snapshots]
```

Function: `electingWildlifeSimulationLeaderUserId(localUserId, remoteUserIds)`.

Solo player: leader is self. Tie-break is stable string sort on Reddit-prefixed ids.

## What stays local

| System                  | Why                                |
| ----------------------- | ---------------------------------- |
| Hunger drain            | Not in sync payload                |
| Stamina / fatigue       | Not in sync payload                |
| Inventory stacks / bags | Only held visual pair syncs        |
| Disease incubation      | Save-slot world epoch              |
| Fire cells (no room)    | `managingWorldPlazaLocalFireCells` |
| Single-player chops     | localStorage when offline owner    |

Online room routes (**building**, **fire**, **harvest**) use `resolvingPlazaDevvitOnlineRoomScope()` for shared Redis.

## Room API URLs

`buildingPlazaDevvitOnlineRoomApiUrl(path, roomId)` appends `?room={roomId}`.

| Path                        | Role                                      |
| --------------------------- | ----------------------------------------- |
| `/api/plaza/sync`           | POST heartbeat + state                    |
| `/api/plaza/players`        | GET remote roster                         |
| `/api/plaza/rooms`          | GET open public worlds / POST create      |
| `/api/plaza/rooms/mine`     | GET Continue worlds                       |
| `/api/plaza/rooms/lookup`   | GET join-by-name                          |
| `/api/plaza/rooms/hosted`   | GET host's world                          |
| `/api/plaza/rooms/kick`     | POST host kick                            |

## Remote player application

Poll results map through `listingWorldPlazaRemotePlayerFromDevvitOnlineSnapshot` into `DefiningWorldPlazaRemotePlayer` registry (includes `heldItemVisualId` / `heldItemTier`). Scene applies live updates via `applyingWorldPlazaRemotePlayerLiveUpdate`.

Removed players drop from registry when absent from poll snapshot.

Presence-only remotes (non-Devvit broadcast path) default held fields to `null` until a full snapshot arrives (`handlingWorldPlazaOnlineRoomPositionBroadcastEvent`).

## HUD roster change detection

Room status HUD reads `roomSnapshot.onlineParticipants` and `participantCount` (`renderingWorldPlazaRoomStatusHud.tsx`).

| Check      | Detail                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| Helper     | `checkingWorldPlazaOnlineParticipantsSnapshotChanged.ts`                                                |
| Inputs     | Previous `DefiningWorldPlazaOnlineRoomSnapshot`, latest `participantCount`, latest `onlineParticipants` |
| True when  | Count differs, roster length differs, or any index differs in `userId` / `displayName`                  |
| False when | Same ordered roster ids and names (motion/health updates alone do not trip this gate)                   |

Use this before rewriting HUD-facing TanStack Query fields so join/leave/rename churn does not get lost in high-frequency position sync.

**Player-facing Guides:** Controls / Mechanics / Biomes / Bestiary: **N/A**. This changes transport scheduling, not controls, rules, biome content, or wildlife entries.

## Failure modes

| Condition        | Behavior                               |
| ---------------- | -------------------------------------- |
| Connection error | Toast: check connection                |
| Room full        | Sync error, `isRoomFull`               |
| Missing `userId` | Polling disabled                       |
| Stale remote     | TTL removes after **5 s** without sync |

## Design knobs

| Knob           | Location                                                       |
| -------------- | -------------------------------------------------------------- |
| Traveler cap   | `MIN` / `MAX` / `DEFAULT_MAX_PLAYERS` in `plazaDevvitOnline.ts` |
| TTL            | `PLAZA_DEVVIT_ONLINE_PLAYER_TTL_SECONDS`                       |
| Intervals      | `SYNC_INTERVAL_MS`, `POLL_INTERVAL_MS`                         |
| Projectile cap | `DEFINING_WORLD_PLAZA_PROJECTILE_ONLINE_SYNC_MAX_SPAWN_EVENTS` |

## Edge cases

- **Named worlds**: Create/join/continue by unique name; APIs scoped by `roomId`.
- **Host kick / delete**: Kick blocks rejoin; delete frees name and host slot; clients force-exit home.
- **Leader disconnect**: Next lexicographic user becomes leader on next election tick.
- **Projectile burst**: Engine queues spawns; only first **8** per sync POST ship.
- **Health defaults**: If ref unset, sync uses `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX`.
- **Held-item omit**: Older clients may omit the fields; parser treats non-string as `undefined`, listing maps to `null` (no overlay).
- **Sync overlap**: `isPostingSync` in `usingWorldPlazaDevvitPollingRoom.ts` drops overlapping POSTs (also increments `ONLINE_SYNC_SKIPPED_INFLIGHT`); the **150 ms** timer always publishes the latest local refs next tick.

**Player-facing Guides:** Controls / Mechanics / Biomes / Bestiary: **N/A**. Sync diagnostics are engine meters only; room rules and copy unchanged.
