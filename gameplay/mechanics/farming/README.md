# Farming bounded context (DDD)

|                  |                                                        |
| ---------------- | ------------------------------------------------------ |
| **Version**      | 1.0.2                                                  |
| **Last updated** | 2026-07-10 (farmland marker safe tick error isolation) |

## Docs in this folder

| File                           | Purpose                                |
| ------------------------------ | -------------------------------------- |
| [glossary.md](./glossary.md)   | Ubiquitous language                    |
| [mechanics.md](./mechanics.md) | Player loop and runtime pipeline       |
| [catalog.md](./catalog.md)     | Crops, constants, and code touchpoints |

## DDD map

### Bounded context

**Tilling walkable land, planting seeds, timed crop growth, and scythe harvest into food items.**

### Aggregates

| Aggregate       | Root                      | Responsibility                             |
| --------------- | ------------------------- | ------------------------------------------ |
| Farmland tile   | Tile key `(x,y)`          | Phase: tilled → planted → growing → mature |
| Crop definition | `cropId`                  | Growth timings and harvest yield           |
| Equipped tools  | Hoe / scythe hotbar slots | Action gate, speed, durability             |

### Declarative registries

| Registry          | File                                                    |
| ----------------- | ------------------------------------------------------- |
| Farming constants | `definingWorldPlazaFarmingConstants.ts`                 |
| Crop registry     | `definingWorldPlazaCropRegistry.ts`                     |
| Ground markers    | `definingWorldPlazaFarmlandGroundMarkerPresentation.ts` |

## How to extend

1. Add crop rows to `definingWorldPlazaCropRegistry.ts`.
2. Register seed and harvest item types in inventory definitions.
3. Update `catalog.md` and `gameplay/doc-triggers.json`.
