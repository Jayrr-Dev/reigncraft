# Multiplayer catalog

Sync payload fields, TTLs, intervals, event shapes, and code touchpoints.

**Source of truth:** `src/shared/plazaDevvitOnline.ts`

## Room capacity and timing

| Constant                                 | Value   | Effect                     |
| ---------------------------------------- | ------- | -------------------------- |
| `PLAZA_DEVVIT_ONLINE_MAX_PLAYERS`        | **3**   | Hard cap per room shard    |
| `PLAZA_DEVVIT_ONLINE_PLAYER_TTL_SECONDS` | **5**   | Redis player record expiry |
| `PLAZA_DEVVIT_ONLINE_SYNC_INTERVAL_MS`   | **150** | Client POST rate           |
| `PLAZA_DEVVIT_ONLINE_POLL_INTERVAL_MS`   | **400** | Client GET remotes rate    |

## Client sync scheduling

| Trigger                      | Network rule                                                | Code                                                     |
| ---------------------------- | ----------------------------------------------------------- | -------------------------------------------------------- |
| Shared timer                 | POST latest player state every **150 ms**                   | `usingWorldPlazaDevvitPollingRoom.ts`                    |
| Immediate action sync        | POST now when no sync request is active                     | `syncingMovePositionRef`                                 |
| Concurrent immediate request | Skip while a POST is active; next timer sends current state | `isPostingSync` in `postingPlazaSync`                    |
| Click-walk frame step        | No direct POST                                              | `onWalkStepRef` in `renderingWorldPlazaPixiScene.tsx`    |
| Click-walk arrival           | Immediate sync request                                      | `onWalkArrivedRef` in `renderingWorldPlazaPixiScene.tsx` |

## Sync performance diagnostics

Constants live in `definingWorldPlazaPerformanceDiagnosticsConstants.ts`. Hook wires them in `usingWorldPlazaDevvitPollingRoom.ts` → `postingPlazaSync`.

| Constant key                   | Kind    | Metric id                      | Trigger                                                                 |
| ------------------------------ | ------- | ------------------------------ | ----------------------------------------------------------------------- |
| `ONLINE_SYNC_SKIPPED_INFLIGHT` | counter | `online-sync-skipped-inflight` | `isPostingSync` already true                                            |
| `ONLINE_SYNC_ROUND_TRIP`       | sample  | `online-sync-round-trip`       | `beginningWorldPlazaPerformanceSample` around POST; finish in `finally` |
| `ONLINE_SYNC_FAILURE`          | counter | `online-sync-failure`          | Sync `error` body or catch path                                         |
| `ONLINE_PARTICIPANT_COUNT`     | gauge   | `online-participant-count`     | Successful sync sets `participantCount`                                 |

Helpers: `incrementingWorldPlazaPerformanceDiagnosticsCounter`, `beginningWorldPlazaPerformanceSample`, `settingWorldPlazaPerformanceDiagnosticsGauge` in `measuringWorldPlazaPerformanceDiagnostics.ts`.

## API paths

| Constant                               | Path                 |
| -------------------------------------- | -------------------- |
| `PLAZA_DEVVIT_ONLINE_SYNC_API_PATH`    | `/api/plaza/sync`    |
| `PLAZA_DEVVIT_ONLINE_PLAYERS_API_PATH` | `/api/plaza/players` |
| `PLAZA_DEVVIT_ONLINE_ROOMS_API_PATH`   | `/api/plaza/rooms`   |

Room shard: `buildingPlazaDevvitOnlineRoomApiUrl(path, roomIndex)` → `{path}?room={index}`.

## Sync request fields (`PlazaDevvitOnlineSyncRequest`)

| Field                   | Type            | Required | Notes                                                       |
| ----------------------- | --------------- | -------- | ----------------------------------------------------------- |
| `healthCurrent`         | number          | yes      | Current HP                                                  |
| `healthEffectiveMax`    | number          | yes      | Effective max HP                                            |
| `shieldPoints`          | number          | yes      | Shield layer                                                |
| `isInvincible`          | boolean         | yes      | I-frames flag                                               |
| `displayName`           | string          | yes      | Nametag                                                     |
| `avatarUrl`             | string \| null  | yes      | Serialized URL                                              |
| `profileStatusKind`     | string \| null  | yes      | Status badge                                                |
| `avatarSkinId`          | string          | yes      | Skin id                                                     |
| `x`                     | number          | yes      | World X                                                     |
| `y`                     | number          | yes      | World Y                                                     |
| `layer`                 | number          | yes      | World layer                                                 |
| `motionKind`            | string          | yes      | Avatar motion enum                                          |
| `facingDirection`       | string          | yes      | Cardinal/diagonal facing                                    |
| `jumpStartedAtMs`       | number          | yes      | Jump start epoch                                            |
| `jumpArcPeakScreenPx`   | number          | yes      | Arc height                                                  |
| `heldItemVisualId`      | string \| null? | no       | Overlay sheet id; `null` unarmed; omit ok for older clients |
| `heldItemTier`          | string \| null? | no       | Overlay tier column; pair with visual id                    |
| `projectileSpawnEvents` | array?          | no       | Max **8** per POST                                          |
| `wildlifeSnapshots`     | array?          | no       | Leader publishes                                            |
| `wildlifeDamageEvents`  | array?          | no       | Leader publishes                                            |

### Held-item visual ids (wire strings)

| `heldItemVisualId` | Sheet under `public/harvest/sprites/` |
| ------------------ | ------------------------------------- |
| `sword`            | `swords.webp`                         |
| `axe`              | `axes.webp`                           |
| `hoe`              | `hoes.webp`                           |
| `scythe`           | `scythes.webp`                        |
| `fishrod`          | `fishrods.webp`                       |

### Held-item tiers (wire strings)

`wood` · `iron` · `steel` · `gold` (see `DEFINING_WORLD_PLAZA_HELD_ITEM_TIERS`; sheet columns 0–3).

## Player snapshot (`PlazaDevvitOnlinePlayerSnapshot`)

Sync fields plus:

| Field       | Type         |
| ----------- | ------------ |
| `userId`    | string       |
| `updatedAt` | string (ISO) |

## Projectile spawn event

| Field                               | Type    |
| ----------------------------------- | ------- |
| `projectileId`                      | string  |
| `archetypeId`                       | string  |
| `originX`, `originY`, `originLayer` | number  |
| `targetX`, `targetY`, `targetLayer` | number? |
| `directionX`, `directionY`          | number? |
| `spawnedAtMs`                       | number  |
| `seed`                              | number  |
| `spawnerUserId`                     | string  |

Cap constant: `DEFINING_WORLD_PLAZA_PROJECTILE_ONLINE_SYNC_MAX_SPAWN_EVENTS` = **8** in `definingWorldPlazaProjectileConstants.ts`.

## Wildlife snapshot

| Field             | Type   |
| ----------------- | ------ |
| `instanceId`      | string |
| `speciesId`       | string |
| `x`, `y`          | number |
| `facingDirection` | string |
| `motionClip`      | string |
| `healthCurrent`   | number |

### Snapshot send gate

| Rule               | Detail                                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| When attached      | Leader sync POST includes `wildlifeSnapshots` only if fingerprint ≠ last successfully sent fingerprint                                            |
| Fingerprint inputs | `instanceId`, `speciesId`, `round(x*10)`, `round(y*10)`, `facingDirection`, `motionClip`, `round(healthCurrent)` joined per mob, then `\|`-joined |
| Helper             | `computingWildlifeNetworkSnapshotsFingerprint.ts`                                                                                                 |
| Hook state         | `lastSentWildlifeSnapshotsFingerprintRef` in `usingWorldPlazaDevvitPollingRoom.ts`                                                                |
| Empty roster       | No snapshots attached (fingerprint `''`)                                                                                                          |

## Wildlife damage event

| Field                   | Type    |
| ----------------------- | ------- |
| `instanceId`            | string  |
| `damageAmount`          | number  |
| `attackerUserId`        | string  |
| `atMs`                  | number  |
| `projectileArchetypeId` | string? |

## API responses

### Sync success

| Field              | Type     |
| ------------------ | -------- |
| `type`             | `'sync'` |
| `participantCount` | number   |
| `maxPlayers`       | number   |

### Sync error

| Field        | Type      |
| ------------ | --------- |
| `type`       | `'error'` |
| `message`    | string    |
| `isRoomFull` | boolean?  |

### Players success

| Field              | Type                                |
| ------------------ | ----------------------------------- |
| `type`             | `'players'`                         |
| `players`          | `PlazaDevvitOnlinePlayerSnapshot[]` |
| `participantCount` | number                              |
| `maxPlayers`       | number                              |

### Room listing entry

| Field              | Type    |
| ------------------ | ------- |
| `roomIndex`        | number  |
| `participantCount` | number  |
| `maxPlayers`       | number  |
| `isFull`           | boolean |

## Application files

| Concern                     | File                                                          |
| --------------------------- | ------------------------------------------------------------- |
| Shared types                | `plazaDevvitOnline.ts`                                        |
| Poll hook                   | `usingWorldPlazaDevvitPollingRoom.ts`                         |
| Sync perf meters            | `definingWorldPlazaPerformanceDiagnosticsConstants.ts`        |
| Sync perf helpers           | `measuringWorldPlazaPerformanceDiagnostics.ts`                |
| Click-walk sync callbacks   | `renderingWorldPlazaPixiScene.tsx`                            |
| Online room hook            | `usingWorldPlazaOnlineRoom.ts`                                |
| Server routes               | `plazaOnline.ts`                                              |
| Room scope                  | `resolvingPlazaDevvitOnlineRoomScope.ts`                      |
| Leader election             | `electingWildlifeSimulationLeaderUserId.ts`                   |
| Remote player map           | `listingWorldPlazaRemotePlayerFromDevvitOnlineSnapshot.ts`    |
| Remote player type          | `definingWorldPlazaOnlineRoom.ts`                             |
| HUD roster change gate      | `checkingWorldPlazaOnlineParticipantsSnapshotChanged.ts`      |
| Room status HUD             | `renderingWorldPlazaRoomStatusHud.tsx`                        |
| Presence broadcast defaults | `handlingWorldPlazaOnlineRoomPositionBroadcastEvent.ts`       |
| Live apply                  | `applyingWorldPlazaRemotePlayerLiveUpdate.ts`                 |
| Held overlay from wire      | `resolvingWorldPlazaHeldItemPresentationFromNetworkFields.ts` |
| Remote avatar overlay       | `renderingWorldPlazaGirlSampleRemoteAvatar.tsx`               |
| Local motion held fields    | `definingWorldPlazaAvatarMotionConstants.ts`                  |
| Room browser UI             | `renderingPlazaMultiplayerRoomBrowserPanel.tsx`               |
| Projectile cap              | `definingWorldPlazaProjectileConstants.ts`                    |
| Projectile engine           | `usingWorldPlazaProjectileEngine.ts`                          |

## Not synced (reference)

| System            | Local owner                          |
| ----------------- | ------------------------------------ |
| Hunger            | Client tick only                     |
| Stamina / fatigue | Client tick only                     |
| Inventory stacks  | Client only (held visual pair syncs) |
| Fire (no room)    | `managingWorldPlazaLocalFireCells`   |
| Disease           | Save slot `playerConditions`         |

## Checklist: change room size

1. [ ] Edit `PLAZA_DEVVIT_ONLINE_MAX_PLAYERS`
2. [ ] Update full-room toast in `usingWorldPlazaDevvitPollingRoom.ts`
3. [ ] Update room browser copy if hardcoded
4. [ ] Load-test Redis write rate (sync × player count)
5. [ ] Update this catalog and [mechanics.md](./mechanics.md)
