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
| **Eat channel**              | Timed interaction before effects apply; player is held in place until complete or damage cancel.                |
| **Eat duration**             | Channel length in ms (`1_000`–`10_000`) from `resolvingWorldPlazaInventoryFoodEatDurationMs`.                   |
| **Munching overlay**         | World-anchored "Munching..." + flavor line + progress ring above the avatar while the channel runs.             |
| **Damage cancel**            | New damage (`lastDamagedAtMs` after channel start) aborts the eat; item is not consumed.                        |
| **Double activation**        | Double-tap / double-click a hotbar slot to run the item primary use (eat, equip, open bag) without the action popover. |
| **Item action popover**      | Single-tap menu on a hotbar slot (Eat, Equip, Open, Drop, active enhancements/enchantments, info).              |
| **Enhancement**              | Item mod for raw physical / concrete capability (yield, harvest speed, durability, build boost). Shown under **Enhancements**. |
| **Enchantment**              | Item mod for status, buffs, debuffs, and damage types. Shown under **Enchantments**. Combat procs declared via `combatEffects` (not all wired yet). |
| **Item mod family**          | `family: 'enhancement' \| 'enchantment'` on each registry definition. Same metadata list (`enchantments`) holds both. |
| **Passive / active**         | Activation kind: always-on vs player-armed (`kind: 'passive' \| 'active'`). Independent of family. |

## Meat pipeline terms

| Term                       | Meaning                                                                                                                                                                          |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Meat kind**              | `raw` or `cooked` on wildlife meat food definitions. Chooses eat branch in `resolvingWorldPlazaInventoryFoodEatEffects`.                                                         |
| **Wildlife species id**    | Links meat item back to `definingWildlifeMeatRegistry` entry (`chicken`, `deer`, …).                                                                                             |
| **Meat inspect reveal**    | Study-gated fields on wildlife meat item details. Unlocks with bestiary study count for that species (0 title-only → 200 full odds). See `definingWorldPlazaInventoryWildlifeMeatDetailRevealConstants.ts`. |
| **Meat flavor tier**       | Progressive description depth for wildlife meat: 1 vague, 2 cautious, 3 full (`resolvingWorldPlazaInventoryWildlifeMeatFlavorDescription`). Unlocks at 1 / 10 / 50 studies. |
| **Raw disease roll**       | On raw eat: if `sicknessRoll < rawDiseaseChance`, contract `rawDiseaseId` with per-species `rawSymptomIntensity` / `rawDurationIntensity` via `applyingWorldPlazaEntityDisease`. |
| **Fallback poison**        | If raw disease roll misses but `rawPoisonFlatEv` and duration are set, apply toxic DoT (`addingWorldPlazaEntityHealthDamageOverTime`).                                           |
| **Residual disease**       | On cooked eat: prion-style `cookedResidualDiseaseId` at `cookedResidualDiseaseChance` (deer, beef).                                                                              |
| **Well-fed roll**          | On cooked eat: if `wellFedRoll < cookedWellFedChance`, apply `cookedWellFedBuffId` buff.                                                                                         |
| **Sickness roll**          | Single `Math.random()` used for disease/poison on raw and residual disease on cooked.                                                                                            |
| **Well-fed roll**          | Separate `Math.random()` for cooked buff (defaults to sickness roll value if omitted).                                                                                           |
| **Simulation clock (eat)** | `nowMs` / `performance.now()`: well-fed buff stamps, fallback poison DoT, disease grant effect expiry.                                                                           |
| **World epoch (eat)**      | `worldEpochMs` / `Date.now()`: disease incubation and grant fire scheduling.                                                                                                     |

## Food sickness

| Term                     | Meaning                                                                                                                                                                |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Food sickness**        | State where hunger restore is multiplied by **0.5** (`DEFINING_WILDLIFE_FOOD_SICKNESS_HUNGER_MULTIPLIER`).                                                             |
| **isSick**               | True when eat rolled a disease this bite **or** player is already symptomatic (`checkingWorldPlazaEntityDiseaseIsSymptomatic`).                                        |
| **food-sickness-debuff** | Registry buff id (`DEFINING_WORLD_PLAZA_FOOD_SICKNESS_DEBUFF_ID`) for sprint lock when that movement modifier is active. Hunger halving uses `isSick` directly on eat. |

## Catalog and registration

| Term                            | Meaning                                                                                                                                                                                                                                                                               |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Meat catalog**                | `DEFINING_WILDLIFE_MEAT_CATALOG` in `definingWildlifeMeatRegistry.ts`. Source for raw/cooked item pairs.                                                                                                                                                                              |
| **Meat inventory registration** | `registeringWorldPlazaWildlifeMeatInventoryItems()` spreads meat rows into the item type list.                                                                                                                                                                                        |
| **Generic forage / catch food** | Berries, apple, wheat, and fish defined inline in `definingWorldPlazaInventoryItemTypes.ts` (not in meat catalog). Fish uses `meatKind: 'raw'` plus `rawSicknessChance` (**8%**) for popover copy; eat effects need `rawDiseaseId` / poison fields before sickness applies in combat. |
| **Wheat seed**                  | `world-plaza-wheat-seed`: plantable stack, not edible.                                                                                                                                                                                                                                |
| **Tiered tool registration**    | `registeringWorldPlazaTieredToolInventoryItems()` spreads sword/axe/hoe/scythe/fishrod rows (wood→gold) into the item type list. Legacy wood axe stays as inline `world-plaza-axe`.                                                                                                   |
| **iconifyIcon**                 | Optional bundled Iconify glyph id on an item type (e.g. `game-icons:wood-axe`, `mdi:hammer`). Glyph renderer prefers this over Lucide `Icon` / emoji. Must be registered in `registeringBundledIconifyIcons.ts`.                                                                      |
| **Equipment capabilities**      | `DefiningWorldPlazaEquipmentItemCapabilities` (aliased as inventory `equipment`): `toolKinds`, `harvestSpeedMultiplier`, optional held visuals, `attackEvModifier` / `defenseEvModifier` (additive or multiplicative), legacy `meleeDamageMultiplier`.                                                                                 |
| **Item rarity**                 | Required rank on every item type: Basic → Common → Uncommon → Rare → Epic → Mythic → Legendary → Godly (`definingWorldPlazaInventoryItemRarityConstants.ts`). Shown as a thematic badge in item info.                                                                                                                              |
| **Special tag**                 | Optional multi tags: Godforge, Unique, Quest Reward (`definingWorldPlazaInventoryItemSpecialTagConstants.ts`).                                                                                                                                                                                                                        |
| **Forge level**                 | Optional non-negative int on the type (or instance `metadata.forgeLevel`) for future equipment upgrades. Shown when set.                                                                                                                                                                                                              |
| **Item cost**                   | Optional `cost.base` plus named `cost.multipliers`; resolved by `computingWorldPlazaInventoryItemResolvedCost`. Economy wiring later.                                                                                                                                                                                                 |
| **Created by**                  | Instance `metadata.createdBy` string; shown in item info when present (future crafting provenance).                                                                                                                                                                                                                                   |
| **Enchantment combat effects**  | Optional `combatEffects` on enchantment defs (e.g. on-hit bleed/poison ids). Declared for later hit wiring; not applied at runtime yet.                                                                                                                                                                                               |
| **Weapon/tool slot**            | Far-left hotbar index **0** (`DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX`). Only items with `equipment.toolKinds` may occupy it. Empty shows a faded fist (unarmed).                                                                                                       |
| **Loot quantity**               | Meat drops per kill (`lootQuantity`; most species **1**, omega-wolf **2**).                                                                                                                                                                                                           |
| **Ground item**                 | Stack lying on a plaza tile (`DefiningWorldPlazaGroundItem`); pickable and edible by wildlife.                                                                                                                                                                                        |
| **Item weight**                 | Unitless carry cost per item type (`resolvingWorldPlazaInventoryItemWeight`). Lightest **0.5**, heaviest **100**. Meat scales from species `massKg`.                                                                                                                                  |
| **Pickup channel**              | Timed hold before a ground stack enters inventory. Duration **0.5–10 s** from weight (`resolvingWorldPlazaGroundItemPickupDurationMs`). Walk out of range cancels.                                                                                                                     |
| **Ground progress ring**        | Reusable SVG ring centered on every ground glyph (`RenderingWorldPlazaGroundItemProgressRing`). Always mounted, invisible until player pickup or wildlife eat fills it.                                                                                                              |
| **Ground despawn**              | Auto-remove after **1 minute** from `spawnedAt` (`WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DESPAWN_MS`).                                                                                                                                                                                    |

## Code prefixes (project convention)

| Prefix                               | Role in this context                        |
| ------------------------------------ | ------------------------------------------- |
| `definingWorldPlazaInventory*`       | Item types, ids, registry                   |
| `resolvingWorldPlazaInventory*`      | Food resolution and eat effects             |
| `registeringWorldPlazaWildlifeMeat*` | Meat item code generation                   |
| `registeringWorldPlazaTieredTool*`   | Tiered tool item code generation            |
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
