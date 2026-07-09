# Building catalog

Plot limits, claim rules, API paths, and code touchpoints.

**Sources of truth:**

- `src/client/world/building/domains/definingWorldBuildingPlotConstants.ts`
- `src/shared/worldBuildingDevvit.ts`

## Plot limit constants

| Constant | Value | Gameplay |
| -------- | ----- | -------- |
| `PLOT_MAX_BLOCK_COUNT` | **256** | Max placed blocks on one plot |
| `DEFAULT_MAX_OWNER_PLOT_COUNT` | **1** | Contiguous owned plot aggregates |
| `DEFAULT_MAX_TILE_CLAIM_COUNT` | **64** | Permanent tile claims |
| `DEFAULT_MAX_TEMPORARY_TILE_COUNT` | **5** | Concurrent temporary claims |
| `OTHER_OWNER_MIN_CLAIM_DISTANCE_TILES` | **3** | Chebyshev buffer vs other owners |
| `REGISTRY_MAX_PLOT_COUNT` | **512** | Registry query slice cap |

Client and server share the same numeric defaults via mirrored constants in `worldBuildingDevvit.ts`.

## Mode and UI constants

| Constant | Value |
| -------- | ----- |
| `BUILD_MODE_TOGGLE_KEY` | `b` |
| `CLAIM_MODE_TOGGLE_KEY` | `c` |
| `CLAIM_MODE_TILE_POPOVER_DOUBLE_TAP_MAX_INTERVAL_MS` | **350** |
| `CLAIM_MODE_TILE_POPOVER_DOUBLE_TAP_MAX_DISTANCE_PX` | **28** |
| `CLAIM_MODE_PLACED_BLOCK_ALPHA` | **0.85** |

## Query and realtime keys

| Constant | Value |
| -------- | ----- |
| `PLOTS_QUERY_KEY_ROOT` | `world-building-plots` |
| `PLACED_BLOCKS_QUERY_KEY_ROOT` | `world-building-placed-blocks` |
| `PLOT_OWNER_LIMITS_QUERY_KEY_ROOT` | `world-building-plot-owner-limits` |
| `PLOTS_REGISTRY_QUERY_KEY_ROOT` | `world-building-plots-registry` |
| `PLOT_REALTIME_TOPIC_PREFIX` | `world-building-plot` |

## API paths (`worldBuildingDevvit.ts`)

| Path | Method | Purpose |
| ---- | ------ | ------- |
| `/api/world-building/plots/registry` | GET | List plots (+ blocks subset) |
| `/api/world-building/plots/bounds` | GET | Plots intersecting viewport |
| `/api/world-building/plots/owned` | GET | Current user's plots |
| `/api/world-building/plots/claim` | POST | Claim one tile |
| `/api/world-building/plots/:plotId` | DELETE | Unclaim plot |
| `/api/world-building/blocks` | POST | Place block |
| `/api/world-building/owner-limits` | GET | Per-user caps |

## Plot row shape

| Field | Type |
| ----- | ---- |
| `id` | string (UUID) |
| `owner_id` | string |
| `min_tile_x`, `min_tile_y` | number |
| `max_tile_x`, `max_tile_y` | number |
| `created_at` | ISO string |
| `is_temporary` | boolean |
| `expires_at` | ISO string \| null |

## Placed block row shape

| Field | Type |
| ----- | ---- |
| `id` | string |
| `plot_id` | string |
| `definition_id` | string |
| `tile_x`, `tile_y` | number |
| `world_layer` | number |
| `owner_id` | string |
| `metadata` | record \| null |
| `placed_at` | ISO string |

## Owner limits response

| Field | Default |
| ----- | ------- |
| `maxOwnedPlotCount` | **1** |
| `maxTileClaimCount` | **64** |
| `maxTemporaryTileCount` | **5** |

## Claim validation (server)

| Check | Rule |
| ----- | ---- |
| Auth | Reddit user required |
| Occupied | Tile not in any plot bounds |
| Buffer | ≥ **3** Chebyshev from other owners' bounds |
| Permanent cap | `ownedPermanentCount < maxTileClaimCount` |
| Temporary cap | `ownedTemporaryCount < maxTemporaryTileCount` |

File: `src/server/routes/worldBuilding.ts`

## Application files

| Concern | File |
| ------- | ---- |
| Client constants | `definingWorldBuildingPlotConstants.ts` |
| Claim mode UI constants | `definingWorldBuildingClaimModeConstants.ts` |
| Block registry | `definingWorldBuildingBlockRegistry.ts` |
| Build mode hook | `usingWorldPlazaBuildMode.ts` |
| Placed blocks query | `usingWorldPlazaPlacedBlocksQuery.ts` |
| Owner limits fetch | `fetchingWorldBuildingPlotOwnerLimitsByUserId.ts` |
| Server routes | `worldBuilding.ts` |
| Redis keys | `buildingWorldBuildingDevvitRedisKeys.ts` |

## Checklist: raise claim caps

1. [ ] Update `worldBuildingDevvit.ts` defaults (or profile columns only)
2. [ ] Mirror `definingWorldBuildingPlotConstants.ts` if client displays caps
3. [ ] Update claim mode capacity badges (automatic from API limits)
4. [ ] Update this catalog and [glossary.md](./glossary.md)
5. [ ] Consider [multiplayer](../multiplayer/) room density impact
