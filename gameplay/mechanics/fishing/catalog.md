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

## Catch inventory add SFX

| Constant / file                                                   | Value / role                                       |
| ----------------------------------------------------------------- | -------------------------------------------------- |
| `DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_CLIP_ID_BY_ACTION.pickup` | `strap_tighten`                                    |
| Asset                                                             | `public/sfx/filmcow-recorded/strap-tighten-03.wav` |
| Base pickup volume                                                | **0.58** (pre SFX slider)                          |
| `notifyingWorldPlazaInventoryItemAdded.ts`                        | Fires pickup clip when `quantityAccepted > 0`      |
| `usingWorldPlazaFishingInteraction.ts`                            | Calls notifier after successful catch grant        |
| `usingWorldPlazaInventoryBagSfx.ts`                               | Shared-bus preload and playback                    |

## Player-facing Guide / tutorial sync

| Surface             | File / section                                                                          | This session                                                            |
| ------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Controls / tutorial | `definingPlazaTutorialConstants.ts`, `definingWorldPlazaWorldNotificationsConstants.ts` | **N/A** — no new inputs; catch uses existing strap-tighten pickup audio |
| Mechanics Guide     | `definingPlazaMechanicsConstants.ts`                                                    | **N/A** — audio feedback only                                           |
| Biomes Guide        | `definingPlazaBiomesGuideConstants.ts`                                                  | **N/A**                                                                 |
| Bestiary            | —                                                                                       | **N/A**                                                                 |
