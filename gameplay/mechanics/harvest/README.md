# Harvest bounded context (DDD)

|                  |                                           |
| ---------------- | ----------------------------------------- |
| **Version**      | 1.2.0                                     |
| **Last updated** | 2026-07-09 (FilmCow equipment impact SFX) |

Plaza **harvest** covers tree chopping, rock mining, and floor-pebble picking: timed swings, wood/stone yield, stump / depleted / picked state, and persistence per tile (or rock anchor).

## Docs in this folder

| File                           | Purpose                                            |
| ------------------------------ | -------------------------------------------------- |
| [glossary.md](./glossary.md)   | Swing, layer, range, and persistence terms         |
| [mechanics.md](./mechanics.md) | Chop/mine/pick loops, timing formulas, pointer hit |
| [catalog.md](./catalog.md)     | Constants table and code touchpoints               |

## DDD map

### Bounded context

**Plaza Harvest** — remove visual layers from procedural trees and mega-boulders, pick floor pebbles into inventory, grant wood or mined stone as ground drops, leave stumps or clear depleted rocks / picked pebbles, persist state per tile/anchor.

Touches **Inventory** (wood, stone), **Equipment** (axe / pickaxe gates; pebbles need no tool), **Movement** (player range), and **Multiplayer** (Redis harvest state vs local persistence). Does not own tree or rock procedural placement.

### Aggregates

| Aggregate              | Root                       | Responsibility                                           |
| ---------------------- | -------------------------- | -------------------------------------------------------- |
| **Chopped tree tile**  | `WorldTreeChopTileState`   | `remainingVisualLayer`, `isStump` per tile key           |
| **Mined rock anchor**  | `WorldRockMineTileState`   | `remainingVisualLayer`, `isDepleted` per anchor key      |
| **Picked pebble tile** | `WorldPebblePickTileState` | `isPicked: true` per tile key (only picked tiles stored) |
| **Harvest swing**      | Timed interaction          | Chop/mine remove up to **3** layers; pick is one-shot    |

### Value objects

- Tile / anchor key — `"tileX,tileY"`
- Wood or stone per layer (chop/mine) — **2**
- Pebble pick stone — **1**
- Layers per swing (chop/mine) — **3**
- Chebyshev player range — **2** tiles

### Domain services (pure)

| Service                       | File                                            |
| ----------------------------- | ----------------------------------------------- |
| Tree eligibility / mutation   | `worldTreeChop.ts`                              |
| Rock eligibility / mutation   | `worldRockMine.ts`                              |
| Pebble eligibility / mutation | `worldPebblePick.ts`                            |
| Trees in range                | `listingWorldPlazaTreesInInteractionRange.ts`   |
| Rocks in range                | `listingWorldPlazaRocksInInteractionRange.ts`   |
| Pebbles in range              | `listingWorldPlazaPebblesInInteractionRange.ts` |

### Application layer

| Use case                          | Entry                                                                                                                       |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Timed chop                        | `usingWorldPlazaTreeChopInteraction.ts`                                                                                     |
| Timed mine                        | `usingWorldPlazaRockMineInteraction.ts`                                                                                     |
| Timed pick                        | `usingWorldPlazaPebblePickInteraction.ts`                                                                                   |
| Harvest impact SFX                | `usingWorldPlazaEquipmentSfx.ts` (milestone hooks in `*ChopProgress`, `*RockMineProgress`, `*PebblePickProgress`)           |
| Online harvest API                | `callingWorldHarvestDevvitApi.ts`                                                                                           |
| Local tree / rock / pebble stores | `managingWorldPlazaLocalChoppedTrees.ts`, `managingWorldPlazaLocalMinedRocks.ts`, `managingWorldPlazaLocalPickedPebbles.ts` |
| Wood / mined-stone ground drops   | `droppingWorldPlazaTreeChopWoodGroundItem.ts`, `droppingWorldPlazaRockMineStoneGroundItem.ts`                               |
| Pebble stone to inventory         | `usingWorldPlazaPebblePickInteraction.ts`                                                                                   |

### Declarative registries (source of truth)

| Registry                   | File                                         |
| -------------------------- | -------------------------------------------- |
| Client chop constants      | `definingWorldPlazaTreeChopConstants.ts`     |
| Client mine constants      | `definingWorldPlazaRockMineConstants.ts`     |
| Client pick constants      | `definingWorldPlazaPebblePickConstants.ts`   |
| Shared chop rules          | `src/shared/worldTreeChop.ts`                |
| Shared mine rules          | `src/shared/worldRockMine.ts`                |
| Shared pick rules          | `src/shared/worldPebblePick.ts`              |
| Equipment impact SFX pools | `definingWorldPlazaEquipmentSfxConstants.ts` |

## Cross-context links

- Wood / stone items: [inventory-food](../inventory-food/)
- Fire fuel wood: [fire](../fire/)
- Equipment tools: equipment engine in [game-engines-reference](../../../memory/game-engines-reference.md)

## Related AI references

- Tuning numbers: [memory/game-mechanics-reference.md](../../../memory/game-mechanics-reference.md) (section 13)
- Engine wiring: [memory/game-engines-reference.md](../../../memory/game-engines-reference.md)
