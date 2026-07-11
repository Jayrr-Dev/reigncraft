# Inventory / food catalog

Every edible item type, hunger restore values, and code touchpoints.

**Item registry:** `src/client/world/inventory/domains/definingWorldPlazaInventoryItemTypes.ts`

**Meat catalog:** `src/client/world/wildlife/domains/definingWildlifeMeatRegistry.ts`

**Eat resolver:** `src/client/world/inventory/domains/resolvingWorldPlazaInventoryFoodEatEffects.ts`

## Forage and catch food (non-wildlife-meat)

| Item       | `itemTypeId`          | Restore ratio | Restore % | Eat time          | Disease / buff                                                            | Edit file                                 |
| ---------- | --------------------- | ------------- | --------- | ----------------- | ------------------------------------------------------------------------- | ----------------------------------------- |
| Berries    | `world-plaza-berries` | 0.15          | 15%       | **1 s**           | None                                                                      | `definingWorldPlazaInventoryItemTypes.ts` |
| Apple      | `world-plaza-apple`   | 0.25          | 25%       | **1.5 s**         | None                                                                      | `definingWorldPlazaInventoryItemTypes.ts` |
| Wheat      | `world-plaza-wheat`   | 0.18          | 18%       | **2 s** (default) | None                                                                      | same + `HUNGER_RESTORE_WHEAT`             |
| Fish (raw) | `world-plaza-fish`    | 0.20          | 20%       | **2 s** (default) | `meatKind: raw`, popover sickness **8%** (no `rawDiseaseId` / poison yet) | same + `HUNGER_RESTORE_FISH`              |

Restore constants also live in `definingWorldPlazaHungerConstants.ts` (`HUNGER_RESTORE_BERRIES`, `APPLE`, `FISH`, `WHEAT`).

**Wheat seeds** (`world-plaza-wheat-seed`) are not edible; they are plantable inventory only.

Eat times: `definingWorldPlazaInventoryFoodEatDurationRegistry.ts` (berries/apple explicit; wheat/fish use `DEFINING_WORLD_PLAZA_FOOD_EAT_DURATION_MS_DEFAULT` = **2000 ms**).

## Non-food inventory (tools and seeds)

Equipment `food` is absent. Tool rows use `equipment: DefiningWorldPlazaEquipmentItemCapabilities` (`toolKinds`, `harvestSpeedMultiplier`, optional `heldItemVisualId` / `heldItemTier`, `attackEvModifier` / `defenseEvModifier`, legacy `meleeDamageMultiplier`).

Every item type requires **`rarity`**. Optional: `tags`, `forgeLevel`, `cost`.

### Item rarity ladder

| Rank      | Id          | Typical defaults                              |
| --------- | ----------- | --------------------------------------------- |
| Basic     | `basic`     | Wood, stone, wheat seed                       |
| Common    | `common`    | Forage food, raw meat, wood tools, small bags |
| Uncommon  | `uncommon`  | Flint, cooked meat, iron tools, mid bags      |
| Rare      | `rare`      | Steel tools, expedition bag                   |
| Epic      | `epic`      | Gold tools                                    |
| Mythic    | `mythic`    | (reserved)                                    |
| Legendary | `legendary` | Soulcore                                      |
| Godly     | `godly`     | (reserved)                                    |

Special tags (optional): `godforge`, `unique`, `quest-reward`. Paint + labels: `definingWorldPlazaInventoryItemRarityConstants.ts`, `definingWorldPlazaInventoryItemSpecialTagConstants.ts`.

### Equipment attack / defense EV

| Field                   | Behavior                                                                                                                                |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `attackEvModifier`      | `{ mode: 'additive' \| 'multiplicative', value }` applied to character attack EV while equipped (`resolvingWorldPlazaEquippedAttackEv`) |
| `defenseEvModifier`     | Same shape; schema + item info only (incoming defense not in damage pipeline yet)                                                       |
| `meleeDamageMultiplier` | Legacy multiplicative attack path; still honored when `attackEvModifier` is absent                                                      |

Swords set both `attackEvModifier` (multiplicative from tier) and `meleeDamageMultiplier` for compatibility.

### Reserved weapon/tool hotbar slot

| Rule               | Behavior                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Slot index         | **0** (far left): `DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX`                                                |
| Allowed items      | Any item type with non-empty `equipment.toolKinds` (axe, pickaxe, sword, hoe, scythe, fishrod, build, ignite/flint, …)   |
| Blocked items      | Food, resources, bags, seeds, Soulcores, and other non-equipment stacks                                                  |
| Always equipped    | Whatever is in slot 0 is the equipped tool (no separate Equip toggle). Empty = unarmed fist melee                        |
| UI outline         | Charcoal border (`.plaza-inventory-slot--weapon-tool`) so the equipment socket reads as distinct from general slots      |
| Empty presentation | Faded `ph:hand-fist` icon (`DEFINING_WORLD_PLAZA_INVENTORY_EMPTY_FIST_OPACITY` = **0.4**); label **Unarmed (fist)**      |
| Pickup / seed      | Auto-place skips slot 0 for non-tools; tools prefer slot 0 when empty                                                    |
| Starter tool       | New inventories and empty reserved slots get a **Wood Axe** (`DEFINING_WORLD_PLAZA_INVENTORY_STARTER_TOOL_ITEM_TYPE_ID`) |
| Legacy saves       | On load, a non-tool in slot 0 shifts to the first free general slot; empty slot 0 then receives the starter axe          |

Code: `checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId.ts`, `addingWorldPlazaInventoryItemWithStacking.ts`, `movingWorldPlazaInventoryItemToSlot.ts`, `normalizingWorldPlazaInventoryWeaponToolSlot.ts`, empty fist in `renderingWorldPlazaInventorySlotCell.tsx`.

| Family  | Tool kind | Tiers                                                 | Registration                                                                                                     |
| ------- | --------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Axe     | `axe`     | wood (legacy `world-plaza-axe`) + iron/steel/gold     | Wood row inline in item types; iron+ from `registeringWorldPlazaTieredToolInventoryItems` (skips legacy wood id) |
| Pickaxe | `pickaxe` | wood → gold (`world-plaza-pickaxe` + iron/steel/gold) | tiered registrar (all four tiers; starter wood pickaxe)                                                          |
| Sword   | `sword`   | wood → gold                                           | tiered registrar (`attackEvModifier` multiplicative from tier melee stats)                                       |
| Hoe     | `hoe`     | wood → gold                                           | tiered registrar                                                                                                 |
| Scythe  | `scythe`  | wood → gold                                           | tiered registrar                                                                                                 |
| Fishrod | `fishrod` | wood → gold                                           | tiered registrar (display name **Fishing Rod**)                                                                  |
| Build   | `build`   | single (**Build Tool**, `world-plaza-tool`)           | inline in `definingWorldPlazaInventoryItemTypes.ts`                                                              |

Tier stats (`DEFINING_WORLD_PLAZA_TOOL_TIER_STATS` in `definingWorldPlazaToolTierConstants.ts`): wood harvest **1×** / melee **1×** / dur **60**; iron **1.2×** / **1.15×** / **100**; steel **1.4×** / **1.3×** / **150**; gold **1.6×** / **1.45×** / **200**.

### Inventory glyphs (equipment)

Hotbar / bag / inspect glyphs resolve in order:

1. `iconImageUrl` (Vite-bundled PNG via `?url`, nearest-neighbor)
2. `iconifyIcon` (bundled Iconify id)
3. Lucide `Icon`
4. emoji / `?`

Pixel tool art lives under `src/client/world/inventory/assets/tools-icons/` (Tools Icons pack; mirrored in `public/tools-icons/`). Bundled via Vite `?url` in `definingWorldPlazaToolInventoryIconConstants.ts` so playtest uploads them when `copyPublicDir` is skipped. Renderer: `renderingWorldPlazaInventoryItemGlyph.tsx`.

| Item / family                                       | Glyph                           | Notes                                                                       |
| --------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------- |
| Wood Axe (`world-plaza-axe`) + iron/steel/gold axes | `{tier}-axe.png` via `?url`     | Legacy wood row + tiered axe family                                         |
| Pickaxe (all tiers)                                 | `{tier}-pickaxe.png` via `?url` | Tiered registrar                                                            |
| Sword (all tiers)                                   | `{tier}-sword.png` via `?url`   | Tiered registrar                                                            |
| Hoe (all tiers)                                     | `{tier}-hoe.png` via `?url`     | Farming progress UI still uses Iconify `game-icons:farm-tractor` separately |
| Scythe (all tiers)                                  | `game-icons:scythe`             | No pack PNG yet; Iconify fallback                                           |
| Fishing Rod (all tiers)                             | `fishrod.png` via `?url`        | Same PNG for all tiers                                                      |
| Build Tool                                          | `mdi:hammer`                    | Inline item types; Iconify                                                  |

Shovel PNGs (`{tier}-shovel.png`) are extracted for future use; no shovel tool kind yet.

New Iconify ids still need `registeringBundledIconifyIcons.ts`. New pack icons: add PNG under `assets/tools-icons/` (and mirror in `public/tools-icons/`), then import with `?url` in `definingWorldPlazaToolInventoryIconConstants.ts`.

Equipment type alias: `DefiningWorldPlazaInventoryItemEquipmentBehavior` = `DefiningWorldPlazaEquipmentItemCapabilities` (`definingWorldPlazaInventoryItemTypeDefinition.ts`).

Demo seed also grants wood sword, hoe, scythe, fishrod, and **8** wheat seeds (`DEFINING_WORLD_PLAZA_INVENTORY_DEMO_SEED_ITEMS`).

## Item enhancements and enchantments

Item mods share one registry (`definingWorldPlazaInventoryEnchantmentRegistry.ts`) and one metadata list (`enchantments` on the item instance). Each definition has a **family**:

| Family        | Player section   | Meaning                              | Examples (shipped)                                                                            |
| ------------- | ---------------- | ------------------------------------ | --------------------------------------------------------------------------------------------- |
| `enhancement` | **Enhancements** | Raw physical / concrete capability   | Extra Wood, Steady Grip, Blueprint Flash (Swift Chop remains in registry, not on starter axe) |
| `enchantment` | **Enchantments** | Status, buffs, debuffs, damage types | None shipped yet; use `combatEffects` slots for bleed/poison procs                            |

Activation is separate: `kind: 'passive' \| 'active'`. Passiveives show as expandable badges in the item info dialog. Actives appear as use rows in the hotbar action tower.

| Id constant        | Display name    | Family      | Kind    | Effect                                                                                           |
| ------------------ | --------------- | ----------- | ------- | ------------------------------------------------------------------------------------------------ |
| `…TIMBER_WHISPER`  | Extra Wood      | enhancement | passive | Extra wood yield (declared)                                                                      |
| `…SWIFT_CHOP`      | Swift Chop      | enhancement | active  | Armed next chop harvest speed **2×**, cooldown **30 s** (registry only; not default on wood axe) |
| `…STEADY_GRIP`     | Steady Grip     | enhancement | passive | Slower tool wear (declared)                                                                      |
| `…BLUEPRINT_FLASH` | Blueprint Flash | enhancement | active  | Armed placement boost, cooldown **45 s**                                                         |

Default attachments: wood axe gets Extra Wood; build tool gets Steady Grip + Blueprint Flash (`defaultEnchantments` on item types).

## Wildlife meat (all species)

Loot quantity per kill: usually **1**; omega-wolf and some large species use higher `lootQuantity` in the meat catalog. Cook times: see [cooking-campfire](../cooking-campfire/).

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

| Constant                                            | Value                  | File                                                                                              |
| --------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------- |
| `DEFINING_WILDLIFE_FOOD_SICKNESS_HUNGER_MULTIPLIER` | 0.5                    | `definingWildlifeMeatRegistry.ts`                                                                 |
| `DEFINING_WILDLIFE_RAW_MEAT_POISON_FLAT_EV`         | 5                      | `definingWildlifeMeatRegistry.ts`                                                                 |
| `DEFINING_WILDLIFE_RAW_MEAT_POISON_DURATION_MS`     | 60_000                 | `definingWildlifeMeatRegistry.ts`                                                                 |
| `DEFINING_WILDLIFE_RAW_MEAT_SICKNESS_CHANCE`        | 0.35                   | `definingWildlifeMeatRegistry.ts` (legacy fallback)                                               |
| `DEFINING_WORLD_PLAZA_FOOD_SICKNESS_DEBUFF_ID`      | `food-sickness-debuff` | `resolvingWorldPlazaInventoryFoodEatEffects.ts`                                                   |
| Eat duration registry                               | 1–10 s by species      | `definingWorldPlazaInventoryFoodEatDurationRegistry.ts`                                           |
| Item weight band                                    | 0.5–100                | `definingWorldPlazaInventoryItemWeightConstants.ts`                                               |
| Pickup channel duration                             | 0.5–10 s by weight     | `resolvingWorldPlazaGroundItemPickupDurationMs.ts`                                                |
| Contested pickup (meal theft)                       | 2–10 s roll            | `definingWildlifeMealTheftConstants.ts` + `rollingWildlifeContestedGroundFoodPickupDurationMs.ts` |

## Where to edit (checklist)

| Change                           | Files                                                                                                                                                                        |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New forage / catch food          | `definingWorldPlazaInventoryItemTypes.ts`, optional hunger constant (`HUNGER_RESTORE_*`)                                                                                     |
| New tiered tool family           | `registeringWorldPlazaTieredToolInventoryItems.ts` + item type ids + `DEFINING_WORLD_PLAZA_TOOL_TIER_STATS`                                                                  |
| Tool / equipment glyph           | Prefer `iconImageUrl` via Vite `?url` in `definingWorldPlazaToolInventoryIconConstants.ts` (`assets/tools-icons/`). Else `iconifyIcon` + `registeringBundledIconifyIcons.ts` |
| Equipment capabilities           | `definingWorldPlazaEquipmentToolKind.ts` (`DefiningWorldPlazaEquipmentItemCapabilities`)                                                                                     |
| New species meat                 | `definingWildlifeMeatRegistry.ts` (auto-registers inventory via `registeringWorldPlazaWildlifeMeatInventoryItems.ts`)                                                        |
| New raw disease                  | [disease](../disease/) registry + meat row `rawDiseaseId`                                                                                                                    |
| New cooked buff                  | [buffs](../buffs/) registry + meat row `cookedWellFedBuffId`                                                                                                                 |
| Eat behavior change              | `resolvingWorldPlazaInventoryFoodEatEffects.ts`                                                                                                                              |
| Eat channel duration             | `definingWorldPlazaInventoryFoodEatDurationRegistry.ts`                                                                                                                      |
| Eat channel cancel gate          | `checkingWorldPlazaInventoryFoodEatShouldContinue.ts` (damage, walk, jump, roll)                                                                                             |
| Item weight / pickup time        | `definingWorldPlazaInventoryItemWeightConstants.ts`                                                                                                                          |
| Eat flavor text                  | `definingWorldPlazaInventoryFoodEatFlavorTextConstants.ts`                                                                                                                   |
| Hotbar consume flow              | `renderingWorldPlazaPixiScene.tsx` + `usingWorldPlazaInventoryFoodEatProgress.ts`                                                                                            |
| Ground pickup channel            | `usingWorldPlazaGroundItemPickupProgress.ts` + `renderingWorldPlazaGroundItems.tsx`                                                                                          |
| Contested pickup / meal theft    | `definingWildlifeMealTheftConstants.ts` + `applyingWildlifeMealTheftAggroForGroundItem.ts` (wildlife) + ground-items wire                                                    |
| Inventory move SFX               | `definingWorldPlazaInventoryBagSfxConstants.ts` (`move` → strap, **0.28**) + `notifyingWorldPlazaInventoryItemMoved.ts` + bag-aware drag end / `moveItem`                    |
| Ground item lifetime             | `WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DESPAWN_MS` in `src/shared/worldInventoryDevvit.ts`                                                                                      |
| Item popover / inspect UI        | `resolvingWorldPlazaInventoryItemDetailPopoverModel.ts` (break-at-zero + non-droppable as badges; durability as bar)                                                         |
| Meat item descriptions           | `definingWildlifeMeatItemDescriptionCorpus.ts`                                                                                                                               |
| Item enhancements / enchantments | `definingWorldPlazaInventoryEnchantmentRegistry.ts` (`family: enhancement \| enchantment`) + type ids file                                                                   |

## Tests

`npm run test -- resolvingWorldPlazaInventoryFoodEatEffects`

`npm run test -- definingWildlifeMeatRegistry`

`npm run test -- resolvingWorldPlazaGroundItemPickupDurationMs`

`npm run test -- managingWorldPlazaGroundItemOptimisticBridge`
