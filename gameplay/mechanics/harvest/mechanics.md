# Harvest mechanics and gameplay

How tree chopping feels and how wood is granted.

## Player-facing loop

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

## Chop rules

| Rule                   | Value         |
| ---------------------- | ------------- |
| Wood per layer removed | **2**         |
| Max layers per swing   | **3**         |
| Max wood per swing     | **6** (3 × 2) |
| Player Chebyshev range | **2** tiles   |
| Required tool          | Axe equipped  |

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

## Targeting

Players can click trunk or canopy:

- Trunk: Chebyshev distance to tile center ≤ **2**
- Pointer: searches **3** tile radius; canopy uses **1.08** hit radius multiplier
- **8 px** padding on trunk silhouette for small screens

Resolver: `resolvingWorldPlazaInteractableTreeFromPointerGridPoint.ts`.

## Persistence modes

| Session         | Owner id                  | Storage                                         |
| --------------- | ------------------------- | ----------------------------------------------- |
| Reddit online   | `redditUserId`            | Redis via `/api/world-harvest`                  |
| Local / SP slot | `localPersistenceOwnerId` | localStorage prefix `world-plaza-chopped-trees` |

Hook: `usingWorldPlazaTreeChopInteraction.ts` picks path via `checkingWorldPlazaChoppedTreesUseLocalPersistence`.

On success, wood may enter inventory or drop as ground item (`droppingWorldPlazaTreeChopWoodGroundItem.ts`) depending on bag space.

## Shared mutation (server and client)

`computingWorldTreeChopLayerMutation` in `worldTreeChop.ts`:

1. `checkingWorldTreeChopLayerEligibility`
2. `layersRemoved = min(3, choppableLayers)`
3. `woodQuantity = layersRemoved × 2`
4. Return `nextTileState`

Server route mirrors the same math for authoritative online chops.

## Tiered axes

Wood, iron, steel, and gold axes share the chop loop. Higher tiers raise `harvestSpeedMultiplier` (**1.0–1.6**) and max durability per `definingWorldPlazaToolTierConstants.ts`. Wood Axe (`world-plaza-axe`) maps to the wood tier column. Held overlay for axes is currently **off** (see below).

## Held tool overlay

**Currently disabled.** `DEFINING_WORLD_PLAZA_HELD_ITEM_OVERLAY_ENABLED` in `definingWorldPlazaHeldItemTypes.ts` is **`false`**. Equipping a tool does not draw a floating sprite on the local or remote avatar. Inventory glyphs, tool kinds, harvest speed, and chop timing still work. Set the flag to **`true`** to restore overlays.

When enabled, the equipped tool sprite follows the avatar with a per-facing pose: a hand offset in avatar-frame px, a carry tilt, and a behind-avatar flag for the three facing-away directions. Base scale is **3.8×** the avatar sprite scale (scythe **4.2×**, fishing rod **3.5×**) with nearest-neighbor filtering for crisp pixels. Full pose table and per-tool offsets: [catalog.md](./catalog.md#held-tool-overlay-presentation).

During a chop (when enabled), the tool plays a keyframed swing on top of the carry pose: windup behind the shoulder, strike across the body, short follow-through, back to carry. One cycle lasts **520 ms** and loops until the timed interaction ends. Each of the 8 facings has its own keyframe track; eating does not swing. Exact phases and offsets: [catalog.md](./catalog.md#swing-move-set-tool-actions).

## Design knobs

| Knob             | Location                                              |
| ---------------- | ----------------------------------------------------- |
| Wood yield       | `TREE_CHOP_WOOD_PER_LAYER`                            |
| Layers per swing | `TREE_CHOP_LAYERS_PER_SWING`                          |
| Swing timing     | `TREE_CHOP_BASE/DURATION_PER_REMAINING_LAYER_MS`      |
| Player range     | `TREE_CHOP_PLAYER_RANGE_TILES`                        |
| Hit radii        | `POINTER_HIT_*`, `CANOPY_POINTER_HIT_*`               |
| Stump visuals    | `TREE_STUMP_HEIGHT_PX`, `TREE_STUMP_WIDTH_MULTIPLIER` |

## Edge cases

- **No persistence owner**: Toast "Tree chopping is unavailable in this session."
- **Concurrent swings**: `isCompletionPendingRef` blocks double completion.
- **Tall tree on slope**: `standingSurfaceLayer` prevents chopping below walkable floor.
- **Fire spread on trees**: `natural:tree:oak` is flammable ([fire](../fire/)); chop state independent of burn.
