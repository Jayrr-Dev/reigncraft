# Inventory / food catalog

Every edible item type, hunger restore values, and code touchpoints.

**Item registry:** `src/client/world/inventory/domains/definingWorldPlazaInventoryItemTypes.ts`

**Meat catalog:** `src/client/world/wildlife/domains/definingWildlifeMeatRegistry.ts`

**Eat resolver:** `src/client/world/inventory/domains/resolvingWorldPlazaInventoryFoodEatEffects.ts`

## Forage food (non-meat)

| Item    | `itemTypeId`          | Restore ratio | Restore % | Eat time  | Disease / buff | Edit file                                 |
| ------- | --------------------- | ------------- | --------- | --------- | -------------- | ----------------------------------------- |
| Berries | `world-plaza-berries` | 0.15          | 15%       | **1 s**   | None           | `definingWorldPlazaInventoryItemTypes.ts` |
| Apple   | `world-plaza-apple`   | 0.25          | 25%       | **1.5 s** | None           | `definingWorldPlazaInventoryItemTypes.ts` |

Restore constants also live in `definingWorldPlazaHungerConstants.ts` (`HUNGER_RESTORE_BERRIES`, `HUNGER_RESTORE_APPLE`).

Eat times: `definingWorldPlazaInventoryFoodEatDurationRegistry.ts`.

## Wildlife meat (all species)

Loot quantity per kill: **1** for every species. Cook times: see [cooking-campfire](../cooking-campfire/).

| Species        | Raw `itemTypeId`                  | Raw restore | Raw disease (chance)    | Cooked `itemTypeId`                  | Cooked restore | Well-fed buff (chance)                     | Cooked residual      |
| -------------- | --------------------------------- | ----------- | ----------------------- | ------------------------------------ | -------------- | ------------------------------------------ | -------------------- |
| chicken        | `world-plaza-raw-chicken-meat`    | 12%         | salmonellosis (45%)     | `world-plaza-cooked-chicken-meat`    | 30%            | well-fed-comfort-buff (35%)                | —                    |
| deer           | `world-plaza-raw-deer-meat`       | 22%         | chronic-wasting (35%)   | `world-plaza-cooked-deer-meat`       | 48%            | well-fed-fleet-buff (40%)                  | chronic-wasting (5%) |
| boar           | `world-plaza-raw-boar-meat`       | 28%         | trichinellosis (40%)    | `world-plaza-cooked-boar-meat`       | 55%            | well-fed-toughened-buff (38%)              | —                    |
| cow (beef)     | `world-plaza-raw-beef`            | 32%         | mad-cow (30%)           | `world-plaza-cooked-beef`            | 62%            | well-fed-prime-buff (42%)                  | mad-cow (3%)         |
| sheep (mutton) | `world-plaza-raw-mutton`          | 24%         | liver-fluke (35%)       | `world-plaza-cooked-mutton`          | 46%            | well-fed-vigor-buff (36%)                  | —                    |
| zebra          | `world-plaza-raw-zebra-meat`      | 26%         | sleeping-sickness (38%) | `world-plaza-cooked-zebra-meat`      | 50%            | well-fed-endurance-buff (40%)              | —                    |
| grey-wolf      | `world-plaza-raw-wolf-meat`       | 20%         | wolf-fever (42%)        | `world-plaza-cooked-wolf-meat`       | 42%            | well-fed-strength-buff (35%)               | —                    |
| omega-wolf     | `world-plaza-raw-omega-wolf-meat` | 28%         | wolf-fever (50%)        | `world-plaza-cooked-omega-wolf-meat` | 55%            | strength + omega skew + omega siphon (50%) | —                    |
| brown-bear     | `world-plaza-raw-bear-meat`       | 38%         | bear-worm (45%)         | `world-plaza-cooked-bear-meat`       | 68%            | well-fed-hearty-buff (45%)                 | —                    |
| lion           | `world-plaza-raw-lion-meat`       | 30%         | toxoplasmosis (38%)     | `world-plaza-cooked-lion-meat`       | 58%            | well-fed-strength-buff (40%)               | —                    |
| lioness        | `world-plaza-raw-lioness-meat`    | 28%         | toxoplasmosis (36%)     | `world-plaza-cooked-lioness-meat`    | 56%            | well-fed-strength-buff (38%)               | —                    |
| crocodile      | `world-plaza-raw-crocodile-meat`  | 25%         | vibrio-infection (40%)  | `world-plaza-cooked-crocodile-meat`  | 52%            | well-fed-reptile-buff (37%)                | —                    |

### Cross-links

- Disease detail (incubation, grants): [disease/catalog.md](../disease/catalog.md)
- Well-fed buff effects: [buffs/catalog.md](../buffs/catalog.md) (`well-fed-*` rows)
- Campfire cook duration per species: `cookDurationMs` in `definingWildlifeMeatRegistry.ts` → [cooking-campfire](../cooking-campfire/)

## Eat channel durations (wildlife)

Raw and cooked of the same species share one eat time. Full map: `DEFINING_WILDLIFE_MEAT_EAT_DURATION_MS_BY_SPECIES`.

| Band   | Examples                           | Duration      |
| ------ | ---------------------------------- | ------------- |
| Fast   | chicken, monkey                    | **1 s**       |
| Light  | turtle, ostrich, antilope          | **1.5–2 s**   |
| Medium | deer, wolf, pig, boar              | **3–4.5 s**   |
| Heavy  | cow, lion, crocodile, bull         | **5–6.5 s**   |
| Huge   | giraffe, bison, bear, rhino, hippo | **7.5–9.5 s** |
| Max    | elephant, mammoth                  | **10 s**      |

Crazy chicken meat override: **2.5 s**.

## Shared eat constants

| Constant                                            | Value                  | File                                                    |
| --------------------------------------------------- | ---------------------- | ------------------------------------------------------- |
| `DEFINING_WILDLIFE_FOOD_SICKNESS_HUNGER_MULTIPLIER` | 0.5                    | `definingWildlifeMeatRegistry.ts`                       |
| `DEFINING_WILDLIFE_RAW_MEAT_POISON_FLAT_EV`         | 5                      | `definingWildlifeMeatRegistry.ts`                       |
| `DEFINING_WILDLIFE_RAW_MEAT_POISON_DURATION_MS`     | 60_000                 | `definingWildlifeMeatRegistry.ts`                       |
| `DEFINING_WILDLIFE_RAW_MEAT_SICKNESS_CHANCE`        | 0.35                   | `definingWildlifeMeatRegistry.ts` (legacy fallback)     |
| `DEFINING_WORLD_PLAZA_FOOD_SICKNESS_DEBUFF_ID`      | `food-sickness-debuff` | `resolvingWorldPlazaInventoryFoodEatEffects.ts`         |
| Eat duration registry                               | 1–10 s by species      | `definingWorldPlazaInventoryFoodEatDurationRegistry.ts` |

## Where to edit (checklist)

| Change                    | Files                                                                                                                 |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| New forage food           | `definingWorldPlazaInventoryItemTypes.ts`, optional hunger constant                                                   |
| New species meat          | `definingWildlifeMeatRegistry.ts` (auto-registers inventory via `registeringWorldPlazaWildlifeMeatInventoryItems.ts`) |
| New raw disease           | [disease](../disease/) registry + meat row `rawDiseaseId`                                                             |
| New cooked buff           | [buffs](../buffs/) registry + meat row `cookedWellFedBuffId`                                                          |
| Eat behavior change       | `resolvingWorldPlazaInventoryFoodEatEffects.ts`                                                                       |
| Eat channel duration      | `definingWorldPlazaInventoryFoodEatDurationRegistry.ts`                                                               |
| Eat flavor text           | `definingWorldPlazaInventoryFoodEatFlavorTextConstants.ts`                                                            |
| Hotbar consume flow       | `renderingWorldPlazaPixiScene.tsx` + `usingWorldPlazaInventoryFoodEatProgress.ts`                                     |
| Ground item lifetime      | `WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DESPAWN_MS` in `src/shared/worldInventoryDevvit.ts`                               |
| Item popover restore text | `resolvingWorldPlazaInventoryItemDetailPopoverModel.ts`                                                               |
| Meat item descriptions    | `definingWildlifeMeatItemDescriptionCorpus.ts`                                                                        |

## Tests

`npm run test -- resolvingWorldPlazaInventoryFoodEatEffects`

`npm run test -- definingWildlifeMeatRegistry`

`npm run test -- managingWorldPlazaGroundItemOptimisticBridge`
