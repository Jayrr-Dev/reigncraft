# Harvest mechanics and gameplay

How tree chopping, rock mining, and floor-pebble picking feel, and how wood/stone are granted.

## Player-facing loop (trees)

```mermaid
sequenceDiagram
  participant P as Player
  participant AX as Axe check
  participant UI as Timed swing
  participant State as Chop state
  participant Inv as Wood

  P->>AX: Equip axe, click tree
  AX->>UI: Start swing timer
  Note over UI: 500ms + 75ms × remaining layers
  UI->>State: Remove up to 3 layers
  State->>Inv: Grant 2 wood per layer removed
  alt Fully felled
    State->>State: isStump true
  end
```

## Player-facing loop (rocks)

```mermaid
sequenceDiagram
  participant P as Player
  participant PK as Pickaxe gate
  participant UI as Timed swing
  participant State as Mine state
  participant Inv as Stone

  P->>PK: Equip pickaxe, click boulder
  PK->>UI: Start swing timer
  Note over UI: 500ms + 75ms × remaining layers
  UI->>State: Remove up to 3 layers
  State->>Inv: Grant 2 stone per layer removed
  alt Fully depleted
    State->>State: isDepleted true
  end
```

## Chop rules

| Rule                   | Value                 |
| ---------------------- | --------------------- |
| Wood per layer removed | **2**                 |
| Max layers per swing   | **3**                 |
| Max wood per swing     | **6** (3 × 2)         |
| Player Chebyshev range | **2** tiles           |
| Required tool          | Axe (soft gate today) |

### Swing duration

```
durationMs = 500 + 75 × choppableLayersRemaining
```

Examples:

| Choppable layers left | Swing time  |
| --------------------- | ----------- |
| 12                    | **1400 ms** |
| 6                     | **950 ms**  |
| 3                     | **725 ms**  |
| 1                     | **575 ms**  |

Constants: `DEFINING_WORLD_PLAZA_TREE_CHOP_BASE_DURATION_MS`, `DEFINING_WORLD_PLAZA_TREE_CHOP_DURATION_PER_REMAINING_LAYER_MS`.

### Felling

When `remainingVisualLayer <= standingSurfaceLayer`:

- Set `isStump: true`
- Stump height **14 px**, width **×1.35** trunk multiplier
- Further chops return `already-felled`

## Rock mine rules

Same economy as trees, keyed by **rock anchor** (not every footprint tile):

| Rule                    | Value                           |
| ----------------------- | ------------------------------- |
| Stone per layer removed | **2**                           |
| Max layers per swing    | **3**                           |
| Max stone per swing     | **6** (3 × 2)                   |
| Player Chebyshev range  | **2** tiles to footprint center |
| Required tool           | Pickaxe equipped (hard gate)    |

Duration formula matches trees (`ROCK_MINE_BASE_DURATION_MS` + per remaining layer).

### Depletion

When `remainingVisualLayer <= ground layer`:

- Set `isDepleted: true`
- Column rock graphics and collision disappear
- Further mines return `already-depleted`

Standing floor for mine math is the ground world layer (**1**); rock height is absolute surface layer minus ground.

## Pebble pick rules

Floor stones with `surfaceWorldLayer === null` (tiers 0–1 pebbles). Column mega-boulders stay on Mine.

Stone goes **straight into inventory** (no ground drop). If the bag cannot hold the stone, Pick fails with "Your inventory is full." and the pebble stays.

| Rule                   | Value                      |
| ---------------------- | -------------------------- |
| Stone per pick         | **1**                      |
| Duration               | Fixed **350 ms**           |
| Player Chebyshev range | **2** tiles to tile center |
| Required tool          | None (bare hands)          |

### After pick

- Persist `isPicked: true` for that tile
- Stone decoration returns null (hidden); floor chunks rebuild via `PICKED_PEBBLES` dependency
- Further picks return `already-picked`

## Targeting (trees)

Players can click trunk or canopy:

- Trunk: Chebyshev distance to tile center ≤ **2**
- Pointer: searches **3** tile radius; canopy uses **1.08** hit radius multiplier
- **8 px** padding on trunk silhouette for small screens

Resolver: `resolvingWorldPlazaInteractableTreeFromPointerGridPoint.ts`.

## Targeting (rocks)

Players click any tile in a mega-boulder footprint:

- Resolve to spacing **anchor** via column-rock metadata
- Player range measured to footprint center
- Pointer search radius **4** tiles (footprints up to 6×6)
- Hit uses max of collision radius and **1.2** tile pad

Resolver: `resolvingWorldPlazaInteractableRockFromPointerGridPoint.ts`.

## Targeting (pebbles)

Players click a floor pebble decoration:

- Resolve stone via `resolvingWorldPlazaStoneDecorationAtTileIndex`; skip if null or `surfaceWorldLayer !== null`
- Player range measured to tile center
- Pointer search radius **2** tiles; hit radius **0.6** tiles

Resolver: `resolvingWorldPlazaInteractablePebbleFromPointerGridPoint.ts`.

## Persistence modes

| Session         | Owner id                  | Trees                                    | Rocks                                  | Pebbles                                   |
| --------------- | ------------------------- | ---------------------------------------- | -------------------------------------- | ----------------------------------------- |
| Reddit online   | `redditUserId`            | Redis `/chopped-trees`, `/chop-tree`     | Redis `/mined-rocks`, `/mine-rock`     | Redis `/picked-pebbles`, `/pick-pebble`   |
| Local / SP slot | `localPersistenceOwnerId` | localStorage `world-plaza-chopped-trees` | localStorage `world-plaza-mined-rocks` | localStorage `world-plaza-picked-pebbles` |

Hooks: `usingWorldPlazaTreeChopInteraction.ts`, `usingWorldPlazaRockMineInteraction.ts`, `usingWorldPlazaPebblePickInteraction.ts`.

On success, tree wood and mined boulder stone drop as ground items (`droppingWorldPlazaTreeChopWoodGroundItem.ts`, `droppingWorldPlazaRockMineStoneGroundItem.ts`). Pebble stone goes straight into inventory via `usingWorldPlazaPebblePickInteraction.ts`.

## Shared mutation (server and client)

`computingWorldTreeChopLayerMutation` in `worldTreeChop.ts`:

1. `checkingWorldTreeChopLayerEligibility`
2. `layersRemoved = min(3, choppableLayers)`
3. `woodQuantity = layersRemoved × 2`
4. Return `nextTileState`

Server route mirrors the same math for authoritative online chops.

## Tiered axes and pickaxes

Wood, iron, steel, and gold axes share the chop loop; pickaxes share the mine loop. Higher tiers raise `harvestSpeedMultiplier` (**1.0–1.6**) and max durability per `definingWorldPlazaToolTierConstants.ts`. Wood Axe (`world-plaza-axe`) and Wood Pickaxe (`world-plaza-pickaxe`) are starter tools. New inventories get both. Inventory glyphs use the Tools Icons pack via Vite `?url` imports (`definingWorldPlazaToolInventoryIconConstants.ts`). Held overlay is currently **off** (see below); pickaxe reuses the axe sheet id until `pickaxes.png` ships.

## Held tool overlay

**Currently disabled.** `DEFINING_WORLD_PLAZA_HELD_ITEM_OVERLAY_ENABLED` in `definingWorldPlazaHeldItemTypes.ts` is **`false`**. Equipping a tool does not draw a floating sprite on the local or remote avatar. Inventory glyphs, tool kinds, harvest speed, and chop timing still work. Set the flag to **`true`** to restore overlays.

When enabled, the equipped tool sprite follows the avatar with a per-facing pose: a hand offset in avatar-frame px, a carry tilt, and a behind-avatar flag for the three facing-away directions. Base scale is **3.8×** the avatar sprite scale (scythe **4.2×**, fishing rod **3.5×**) with nearest-neighbor filtering for crisp pixels. Full pose table and per-tool offsets: [catalog.md](./catalog.md#held-tool-overlay-presentation).

During a chop (when enabled), the tool plays a keyframed swing on top of the carry pose: windup behind the shoulder, strike across the body, short follow-through, back to carry. One cycle lasts **520 ms** and loops until the timed interaction ends. Each of the 8 facings has its own keyframe track; eating does not swing. Exact phases and offsets: [catalog.md](./catalog.md#swing-move-set-tool-actions).

## Harvest impact audio

Each timed chop, mine, or pick channel fires **three** impact sounds aligned to timed-interaction milestones (`start`, `mid`, `final`). Clips come from the FilmCow Hits & Crunches pack under `public/sfx/filmcow-equipment/`.

| Tool action   | Clip feel (pools)                    | Base volume (pre-slider) |
| ------------- | ------------------------------------ | ------------------------ |
| `tree-chop`   | Wood hit + fronds hit                | **0.52**                 |
| `rock-mine`   | Brick hit + metal hit + ground thump | **0.58**                 |
| `pebble-pick` | Tiny hit + ground thump              | **0.38**                 |

The `final` milestone gets an extra **×1.12** gain. Pools rotate between completed swings so repeats do not always land on the same clip. Volume respects the **SFX** slider in Settings (separate from music volume).

### Shared audio wiring

Harvest impacts share the plaza **star-audio** bus with footsteps, wildlife SFX, biome ambience, and other hooks. One Howler pool avoids exhausting WebMediaPlayer limits in the Devvit iframe.

```mermaid
flowchart LR
  subgraph hooks [Progress hooks]
    T[Tree chop progress]
    R[Rock mine progress]
    P[Pebble pick progress]
  end
  subgraph bridge [Equipment SFX bridge]
    PL[playingWorldPlazaEquipmentSfx]
    US[usingWorldPlazaEquipmentSfx]
  end
  subgraph audio [Shared bus]
    SA[managingWorldPlazaStarAudio]
    UL[Plaza audio unlock listeners]
  end
  T --> PL
  R --> PL
  P --> PL
  PL --> US
  US --> SA
  UL --> SA
```

| Rule              | Detail                                                                                                                                                                                                                                                                                                    |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Instance lifetime | `acquiringWorldPlazaStarAudio()` on hook mount; `releasingWorldPlazaStarAudio()` on unmount. The bus destroys only when every consumer has released.                                                                                                                                                      |
| Preload           | `preloadingWorldPlazaStarAudioManifest(buildingWorldPlazaEquipmentStarAudioManifest())` adds only keys not already warmed on the bus. World boot also queues the same manifest in the **deferred** star-audio slice (`preloadingWorldPlazaWorldBootStarAudio`) so the first chop often hits a warm cache. |
| Playback gate     | No sound while preload is incomplete or audio is still locked pending user gesture.                                                                                                                                                                                                                       |
| Unlock retry      | Registers on the plaza gesture-unlock bus; unlock + SFX volume re-applied after first click/tap/key.                                                                                                                                                                                                      |
| Clip rotation     | Pool index advances only after a completed swing's `final` milestone plays.                                                                                                                                                                                                                               |

Wiring: milestone handlers in `usingWorldPlazaTreeChopProgress.ts`, `usingWorldPlazaRockMineProgress.ts`, and `usingWorldPlazaPebblePickProgress.ts` call `playingWorldPlazaEquipmentSfx`. Preload and playback: `usingWorldPlazaEquipmentSfx.ts` (mounted from the Pixi scene via `renderingWorldPlazaEquipmentSfx.tsx`).

## Design knobs

| Knob             | Location                                                               |
| ---------------- | ---------------------------------------------------------------------- |
| Wood yield       | `TREE_CHOP_WOOD_PER_LAYER`                                             |
| Stone yield      | `ROCK_MINE_STONE_PER_LAYER` / `WORLD_ROCK_MINE_*`                      |
| Layers per swing | `*_LAYERS_PER_SWING`                                                   |
| Swing timing     | `*_BASE/DURATION_PER_REMAINING_LAYER_MS`                               |
| Player range     | `*_PLAYER_RANGE_TILES`                                                 |
| Hit radii        | Tree `POINTER_HIT_*`; rock `ROCK_MINE_POINTER_HIT_*`                   |
| Stump visuals    | `TREE_STUMP_HEIGHT_PX`, `TREE_STUMP_WIDTH_MULTIPLIER`                  |
| Impact volumes   | `DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_TARGET_VOLUME_BY_TOOL_ACTION`      |
| Final swing gain | `DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_FINAL_MILESTONE_VOLUME_MULTIPLIER` |

## Edge cases

- **No persistence owner**: Toast that chop/mine is unavailable in this session.
- **No pickaxe**: Toast "Equip a pickaxe to mine rocks."
- **Concurrent swings**: `isCompletionPendingRef` blocks double completion.
- **Tall tree on slope**: `standingSurfaceLayer` prevents chopping below walkable floor.
- **Multi-tile boulder**: Persist and select by anchor; any footprint click maps to that anchor.
- **Fire spread on trees**: `natural:tree:oak` is flammable ([fire](../fire/)); chop state independent of burn.
- **Pebbles vs boulders**: Floor pebbles use **Pick** (bare hands). Medium+ column rocks use **Mine** (pickaxe).
