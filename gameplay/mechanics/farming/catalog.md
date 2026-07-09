# Farming catalog

## Constants

| Symbol                                                  | Value | File                                    |
| ------------------------------------------------------- | ----- | --------------------------------------- |
| `DEFINING_WORLD_PLAZA_FARMING_PLAYER_RANGE_TILES`       | 2     | `definingWorldPlazaFarmingConstants.ts` |
| `DEFINING_WORLD_PLAZA_FARMING_TILL_BASE_DURATION_MS`    | 1400  | same                                    |
| `DEFINING_WORLD_PLAZA_FARMING_PLANT_BASE_DURATION_MS`   | 900   | same                                    |
| `DEFINING_WORLD_PLAZA_FARMING_HARVEST_BASE_DURATION_MS` | 1200  | same                                    |

## Crops

| cropId  | Seed item                | Harvest item        | Qty | Sprout ms | Grow ms |
| ------- | ------------------------ | ------------------- | --- | --------- | ------- |
| `wheat` | `world-plaza-wheat-seed` | `world-plaza-wheat` | 2   | 12000     | 24000   |

Registry: `definingWorldPlazaCropRegistry.ts`.

## Tiered tools

Hoes and scythes: `registeringWorldPlazaTieredToolInventoryItems.ts` (`world-plaza-hoe-*`, `world-plaza-scythe-*`).

Held visuals: `public/tools-8dir/hoes.png`, `scythes.png`.

## Ground marker colors

| Phase   | Role                     |
| ------- | ------------------------ |
| tilled  | Brown soil tint          |
| planted | Light green              |
| growing | Mid green, taller marker |
| mature  | Gold harvest-ready       |

`definingWorldPlazaFarmlandGroundMarkerPresentation.ts`.
