# Inventory / food glossary (ubiquitous language)

Terms used consistently across code, docs, and player-facing copy for edible inventory items and the eat pipeline.

## Core concepts

| Term                         | Meaning                                                                                                         |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Item type id**             | Stable inventory key (`world-plaza-berries`, `world-plaza-cooked-beef`, …). Primary lookup for food resolution. |
| **Food block**               | Optional `food` field on `DefiningWorldPlazaInventoryItemTypeDefinition` marking an item edible.                |
| **Food definition**          | Runtime `DefiningWorldPlazaInventoryFoodDefinition` built by `resolvingWorldPlazaInventoryFoodDefinition`.      |
| **Hunger restore ratio**     | Fraction of the hunger bar restored per single consume (0..1). Shown in item popover as percent.                |
| **Effective hunger restore** | Final ratio passed to `eatingFoodRef` after food sickness penalty.                                              |
| **Consume**                  | Remove one stack unit from inventory after a successful eat (`consumingWorldPlazaInventoryItemByType`).         |
| **Already full**             | Eat rejected when `hungerRatio >= 1`; toast shown, no item consumed.                                            |

## Meat pipeline terms

| Term                       | Meaning                                                                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Meat kind**              | `raw` or `cooked` on wildlife meat food definitions. Chooses eat branch in `resolvingWorldPlazaInventoryFoodEatEffects`.               |
| **Wildlife species id**    | Links meat item back to `definingWildlifeMeatRegistry` entry (`chicken`, `deer`, …).                                                   |
| **Raw disease roll**       | On raw eat: if `sicknessRoll < rawDiseaseChance`, contract `rawDiseaseId` via `applyingWorldPlazaEntityDisease`.                       |
| **Fallback poison**        | If raw disease roll misses but `rawPoisonFlatEv` and duration are set, apply toxic DoT (`addingWorldPlazaEntityHealthDamageOverTime`). |
| **Residual disease**       | On cooked eat: prion-style `cookedResidualDiseaseId` at `cookedResidualDiseaseChance` (deer, beef).                                    |
| **Well-fed roll**          | On cooked eat: if `wellFedRoll < cookedWellFedChance`, apply `cookedWellFedBuffId` buff.                                               |
| **Sickness roll**          | Single `Math.random()` used for disease/poison on raw and residual disease on cooked.                                                  |
| **Well-fed roll**          | Separate `Math.random()` for cooked buff (defaults to sickness roll value if omitted).                                                 |
| **Simulation clock (eat)** | `nowMs` / `performance.now()`: well-fed buff stamps, fallback poison DoT, disease grant effect expiry.                                 |
| **World epoch (eat)**      | `worldEpochMs` / `Date.now()`: disease incubation and grant fire scheduling.                                                           |

## Food sickness

| Term                     | Meaning                                                                                                                                                                |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Food sickness**        | State where hunger restore is multiplied by **0.5** (`DEFINING_WILDLIFE_FOOD_SICKNESS_HUNGER_MULTIPLIER`).                                                             |
| **isSick**               | True when eat rolled a disease this bite **or** player is already symptomatic (`checkingWorldPlazaEntityDiseaseIsSymptomatic`).                                        |
| **food-sickness-debuff** | Registry buff id (`DEFINING_WORLD_PLAZA_FOOD_SICKNESS_DEBUFF_ID`) for sprint lock when that movement modifier is active. Hunger halving uses `isSick` directly on eat. |

## Catalog and registration

| Term                            | Meaning                                                                                                  |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Meat catalog**                | `DEFINING_WILDLIFE_MEAT_CATALOG` in `definingWildlifeMeatRegistry.ts`. Source for raw/cooked item pairs. |
| **Meat inventory registration** | `registeringWorldPlazaWildlifeMeatInventoryItems()` spreads meat rows into the item type list.           |
| **Generic forage food**         | Berries and apple defined inline in `definingWorldPlazaInventoryItemTypes.ts` (not in meat catalog).     |
| **Loot quantity**               | Meat drops per kill (`lootQuantity`, always **1** per species today).                                    |

## Code prefixes (project convention)

| Prefix                               | Role in this context                        |
| ------------------------------------ | ------------------------------------------- |
| `definingWorldPlazaInventory*`       | Item types, ids, registry                   |
| `resolvingWorldPlazaInventory*`      | Food resolution and eat effects             |
| `registeringWorldPlazaWildlifeMeat*` | Meat item code generation                   |
| `definingWildlifeMeat*`              | Species meat catalog and sickness constants |
| `consumingWorldPlazaInventory*`      | Stack removal after eat                     |

## Anti-patterns (words to avoid)

| Don't say                                    | Say instead                                                                      |
| -------------------------------------------- | -------------------------------------------------------------------------------- |
| "Food heals you"                             | **Hunger restore ratio** (health changes are separate disease/buff/poison paths) |
| "Cooking cures disease"                      | Cooking removes **raw** disease roll; **residual** prion chance may remain       |
| "Eating always applies food-sickness debuff" | **Hunger restore ×0.5** when `isSick`; debuff buff is a separate registry entry  |
| "Cooked meat always gives buff"              | **Well-fed chance** roll per species (`cookedWellFedChance`)                     |
| "Meat item id" without kind                  | **`rawItemTypeId`** vs **`cookedItemTypeId`**                                    |
