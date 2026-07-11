# Farming mechanics and gameplay

## Player-facing loop

```mermaid
sequenceDiagram
  participant P as Player
  participant Hoe as Hoe
  participant Seed as Seeds
  participant Time as Growth tick
  participant Scythe as Scythe
  participant Inv as Wheat

  P->>Hoe: Till eligible land
  P->>Seed: Plant on tilled tile
  Time->>Time: planted ? growing ? mature
  P->>Scythe: Harvest mature crop
  Scythe->>Inv: Grant wheat stacks
```

## Phases

| Phase     | Player action  | Next         |
| --------- | -------------- | ------------ |
| (none)    | Hoe till       | `tilled`     |
| `tilled`  | Plant seed     | `planted`    |
| `planted` | wait **12s**   | `growing`    |
| `growing` | wait **24s**   | `mature`     |
| `mature`  | Scythe harvest | tile cleared |

Growth advances on read and on a **1s** local poll that persists phase changes.

## Action timings (base)

Divided by equipped tool `harvestSpeedMultiplier` (minimum divisor **0.25**).

| Action  | Base ms  | Tool         |
| ------- | -------- | ------------ |
| Till    | **1400** | Hoe          |
| Plant   | **900**  | (seeds only) |
| Harvest | **1200** | Scythe       |

## Range and persistence

| Rule           | Value                                                  |
| -------------- | ------------------------------------------------------ |
| Player range   | **2** tiles Chebyshev                                  |
| Persistence    | `localStorage` prefix `world-plaza-farmland:{ownerId}` |
| Ground visuals | Colored isometric markers per phase                    |

## Wheat crop (V1)

| Yield | **2** `world-plaza-wheat` |
| Seed item | `world-plaza-wheat-seed` |

## Runtime pipeline

1. Click ground tile with hoe/scythe/seeds context ? farmland selection key.
2. `RenderingWorldPlazaFarmingInteractionLabels` shows Till / Plant / Harvest.
3. `usingWorldPlazaFarmingProgress` channels the action.
4. `usingWorldPlazaFarmingInteraction` mutates farmland store and inventory.

## Harvest inventory audio

Only **scythe harvest** adds items to the bag (till and plant consume tools/seeds without a grant). When crop stacks are accepted, the player hears the shared **inventory add** strap-tighten clip (`public/inventory/sfx/filmcow-recorded/strap-tighten-03.ogg`).

| Rule    | Detail                                                                                                                            |
| ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Trigger | After `addingInventoryItemWithStacking` accepts harvest yield (`quantityOverflow === 0`) and farmland tile clears                 |
| Volume  | Base **0.58** before the SFX volume slider                                                                                        |
| Wiring  | `notifyingWorldPlazaInventoryItemAdded(withHarvest.quantityAccepted)` in `usingWorldPlazaFarmingInteraction.ts`                   |
| Shared  | Same bridge as pebble pick, fishing catch, ground pickup, and campfire cook; see [inventory-food](../inventory-food/mechanics.md) |

## Code entry points

| Step       | Module                                            |
| ---------- | ------------------------------------------------- |
| Till check | `checkingWorldPlazaFarmingTillEligibility.ts`     |
| Growth     | `advancingWorldPlazaFarmlandGrowthPhases.ts`      |
| Store      | `managingWorldPlazaLocalFarmland.ts`              |
| Labels     | `renderingWorldPlazaFarmingInteractionLabels.tsx` |
| Markers    | `renderingWorldPlazaFarmlandGroundMarkers.tsx`    |
