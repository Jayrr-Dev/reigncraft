# Fishing catalog

## Constants

| Symbol                                               | Value | File                                    |
| ---------------------------------------------------- | ----- | --------------------------------------- |
| `DEFINING_WORLD_PLAZA_FISHING_PLAYER_RANGE_TILES`    | 2     | `definingWorldPlazaFishingConstants.ts` |
| `DEFINING_WORLD_PLAZA_FISHING_BASE_CAST_DURATION_MS` | 2200  | same                                    |
| `DEFINING_WORLD_PLAZA_FISHING_CATCH_QUANTITY`        | 1     | same                                    |

## Fishrod items (tiered)

Registered via `registeringWorldPlazaTieredToolInventoryItems.ts`:

| Item type id                | Tier  | Tool kind |
| --------------------------- | ----- | --------- |
| `world-plaza-fishrod-wood`  | wood  | fishrod   |
| `world-plaza-fishrod-iron`  | iron  | fishrod   |
| `world-plaza-fishrod-steel` | steel | fishrod   |
| `world-plaza-fishrod-gold`  | gold  | fishrod   |

## Catch item

| Item type id       | Name | Food                                 |
| ------------------ | ---- | ------------------------------------ |
| `world-plaza-fish` | Fish | Hunger restore + raw sickness chance |

## Held-item visuals

Fishrods use sheet `public/tools-8dir/fishrods.png` via `definingWorldPlazaHeldItemPresentationRegistry.ts`.
