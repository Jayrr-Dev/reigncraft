# Harvest bounded context (DDD)

|                  |            |
| ---------------- | ---------- |
| **Version**      | 1.1.0      |
| **Last updated** | 2026-07-09 |

Plaza **harvest** covers tree chopping and rock mining: timed swings, wood/stone yield, stump or depleted state, and persistence per tile (or rock anchor).

## Docs in this folder

| File | Purpose |
| ---- | ------- |
| [glossary.md](./glossary.md) | Swing, layer, range, and persistence terms |
| [mechanics.md](./mechanics.md) | Chop/mine loops, timing formulas, pointer hit |
| [catalog.md](./catalog.md) | Constants table and code touchpoints |

## DDD map

### Bounded context

**Plaza Harvest** — remove visual layers from procedural trees and mega-boulders, grant wood or stone as ground drops, leave stumps or clear depleted rocks, persist state per tile/anchor.

Touches **Inventory** (wood, stone), **Equipment** (axe / pickaxe gates), **Movement** (player range), and **Multiplayer** (Redis harvest state vs local persistence). Does not own tree or rock procedural placement.

### Aggregates

| Aggregate | Root | Responsibility |
| --------- | ---- | -------------- |
| **Chopped tree tile** | `WorldTreeChopTileState` | `remainingVisualLayer`, `isStump` per tile key |
| **Mined rock anchor** | `WorldRockMineTileState` | `remainingVisualLayer`, `isDepleted` per anchor key |
| **Harvest swing** | Timed interaction | One completed swing removes up to **3** layers |

### Value objects

- Tile / anchor key — `"tileX,tileY"`
- Wood or stone per layer — **2**
- Layers per swing — **3**
- Chebyshev player range — **2** tiles

### Domain services (pure)

| Service | File |
| ------- | ---- |
| Tree eligibility / mutation | `worldTreeChop.ts` |
| Rock eligibility / mutation | `worldRockMine.ts` |
| Trees in range | `listingWorldPlazaTreesInInteractionRange.ts` |
| Rocks in range | `listingWorldPlazaRocksInInteractionRange.ts` |

### Application layer

| Use case | Entry |
| -------- | ----- |
| Timed chop | `usingWorldPlazaTreeChopInteraction.ts` |
| Timed mine | `usingWorldPlazaRockMineInteraction.ts` |
| Online harvest API | `callingWorldHarvestDevvitApi.ts` |
| Local tree / rock stores | `managingWorldPlazaLocalChoppedTrees.ts`, `managingWorldPlazaLocalMinedRocks.ts` |
| Wood / stone ground drops | `droppingWorldPlazaTreeChopWoodGroundItem.ts`, `droppingWorldPlazaRockMineStoneGroundItem.ts` |

### Declarative registries (source of truth)

| Registry | File |
| -------- | ---- |
| Client chop constants | `definingWorldPlazaTreeChopConstants.ts` |
| Client mine constants | `definingWorldPlazaRockMineConstants.ts` |
| Shared chop rules | `src/shared/worldTreeChop.ts` |
| Shared mine rules | `src/shared/worldRockMine.ts` |

## Cross-context links

- Wood / stone items: [inventory-food](../inventory-food/)
- Fire fuel wood: [fire](../fire/)
- Equipment tools: equipment engine in [game-engines-reference](../../../memory/game-engines-reference.md)

## Related AI references

- Tuning numbers: [memory/game-mechanics-reference.md](../../../memory/game-mechanics-reference.md) (section 13)
- Engine wiring: [memory/game-engines-reference.md](../../../memory/game-engines-reference.md)
