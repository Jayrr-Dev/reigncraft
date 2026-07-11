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

Held visuals: `public/harvest/sprites/hoes.webp`, `scythes.webp`.

## Ground marker colors

| Phase   | Role                     |
| ------- | ------------------------ |
| tilled  | Brown soil tint          |
| planted | Light green              |
| growing | Mid green, taller marker |
| mature  | Gold harvest-ready       |

`definingWorldPlazaFarmlandGroundMarkerPresentation.ts`.

## Ground marker render tick (engine)

Source: `renderingWorldPlazaFarmlandGroundMarkers.tsx`.

| Behavior            | Detail                                                                  |
| ------------------- | ----------------------------------------------------------------------- |
| Tick registration   | `usingWorldPlazaSafeTick(..., 'tick:farmland-markers')`                 |
| Tick error handling | Logged to client debug error lines; other plaza subsystems keep running |
| Player impact       | **None** — same phase colors, diamond markers, and growth presentation  |

## Scythe harvest inventory add SFX

| Constant / file                                                   | Value / role                                                 |
| ----------------------------------------------------------------- | ------------------------------------------------------------ |
| `DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_CLIP_ID_BY_ACTION.pickup` | `strap_tighten`                                              |
| Asset                                                             | `public/inventory/sfx/filmcow-recorded/strap-tighten-03.ogg` |
| Base pickup volume                                                | **0.58** (pre SFX slider)                                    |
| `notifyingWorldPlazaInventoryItemAdded.ts`                        | Fires pickup clip when `quantityAccepted > 0`                |
| `usingWorldPlazaFarmingInteraction.ts`                            | Calls notifier after successful harvest grant                |
| `usingWorldPlazaInventoryBagSfx.ts`                               | Shared-bus preload and playback                              |

## Player-facing Guide / tutorial sync

| Surface             | File / section                                                                      | This session                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Controls / tutorial | definingPlazaTutorialConstants.ts, definingWorldPlazaWorldNotificationsConstants.ts | **N/A** — ground marker tick wrapped in usingWorldPlazaSafeTick; no new inputs or rule change |
| Mechanics Guide     | definingPlazaMechanicsConstants.ts                                                  | **N/A** — till/plant/harvest rules unchanged                                                  |
| Biomes Guide        | definingPlazaBiomesGuideConstants.ts                                                | **N/A**                                                                                       |
| Bestiary            | —                                                                                   | **N/A**                                                                                       |
