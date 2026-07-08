# Cooking and campfire glossary (ubiquitous language)

Terms used consistently across code, docs, and player-facing copy for campfire cooking and wildlife meat.

## Meat catalog

| Term | Meaning |
| ---- | ------- |
| **Meat catalog row** | One `DefiningWildlifeMeatCatalogEntry` per species: raw/cooked item ids, hunger ratios, disease odds, well-fed reward, cook duration, loot quantity. |
| **Raw item type id** | Inventory id for the loot drop (`world-plaza-raw-chicken-meat`, …). |
| **Cooked item type id** | Inventory id after campfire cook (`world-plaza-cooked-chicken-meat`, …). |
| **Hunger restore ratio** | Fraction of player **max hunger** restored on eat (not a flat point value). |
| **Loot quantity** | Stacks dropped per kill. All 11 species drop **1**. |
| **Cook recipe** | Derived `{ rawItemTypeId, cookedItemTypeId, cookDurationMs }` from the meat catalog. |

## Disease and safety

| Term | Meaning |
| ---- | ------- |
| **Raw disease id** | `DefiningWorldPlazaEntityDiseaseId` rolled on eating the raw cut. |
| **Raw disease chance** | Per-bite probability (`rawDiseaseChance`, typically **30-45%**). See [disease](../disease/glossary.md). |
| **Residual disease** | Prion-style `cookedResidualDiseaseId` + `cookedResidualDiseaseChance` on **cooked** eat. Only deer (**5%**) and cow (**3%**) today. |
| **Fallback raw poison** | If disease roll misses, generic toxic DoT (`DEFINING_WILDLIFE_RAW_MEAT_POISON_FLAT_EV` **5** over **60s**). |
| **Food sickness** | Hunger restore × **0.5** while symptomatic or on failed raw bite ([disease](../disease/) + `DEFINING_WILDLIFE_FOOD_SICKNESS_HUNGER_MULTIPLIER`). |

## Cooked rewards

| Term | Meaning |
| ---- | ------- |
| **Well-fed buff id** | Timed buff granted on cooked eat (`well-fed-comfort-buff`, …). |
| **Well-fed chance** | Independent roll per cooked bite (`cookedWellFedChance`, **35-45%** typical). |
| **Cook channel** | Timed interaction at a lit campfire; duration = `cookDurationMs` per species (**2.5s-10s**). |

## Campfire and fuel

| Term | Meaning |
| ---- | ------- |
| **Lit campfire** | Active `WorldFireDevvitCell` with kind `campfire` on the pit tile. Required to start cooking. |
| **Interaction radius** | **2** tiles Chebyshev (shared with ignite/refuel). Player must stay in range and keep the pit selected. |
| **Fuel wood** | Placed wood floor, wooden door, or wooden sign within **2** tiles of the pit (excludes the pit tile itself). |
| **Inventory wood refuel** | One inventory wood adds **3 min** (small tier) or **1 min** (big tier) depending on nearby placed wood count. |
| **Small fuel tier** | **1-3** total wood: **3 min** per wood. |
| **Big fuel tier** | **4+** total wood: **1 min** per wood. |
| **Max fuel** | **20 minutes** stored (`WORLD_CAMPFIRE_FUEL_MAX_MS`). |
| **Burn tier** | Visual label from nearby placed wood only: `weak` (0), `small` (1-2), `mid` (3), `big` (4+). |
| **Campfire warmth** | Lit campfire tile contributes **72°C** environmental heat. See [fire](../fire/) and [environment](../environment/). |

## Player actions

| Term | Meaning |
| ---- | ------- |
| **Cook start validation** | Checks lit fire, raw meat in bag, and capacity for one cooked stack before channel begins. |
| **Cook complete** | Atomically consumes **1** raw stack and adds **1** cooked stack (`cookingWildlifeMeatAtCampfire.ts`). |
| **First raw meat in bag** | Cook picks the first inventory slot (in order) that holds a raw meat type with a recipe. |
| **Channel cancel** | Moving out of range, deselecting pit, or fire going out stops progress with no item change. |

## Code prefixes (project convention)

| Prefix | Role in this context |
| ------ | -------------------- |
| `defining*` | Meat catalog, cook recipes, temperature constants |
| `cooking*` | Atomic raw→cooked inventory swap |
| `validating*` | Pre-channel checks |
| `using*` | Cook progress hook over timed interaction |
| `resolving*` | Food eat effects, recipe lookup |
| `computing*` / `counting*` | Fuel duration and nearby wood (in `worldCampfireFuel.ts`) |
| `rendering*` | Campfire interaction labels |

## Cross-context links

| Term | Bounded context |
| ---- | ---------------- |
| **Species loot** | [wildlife](../wildlife/) death drop |
| **Disease instance** | [disease](../disease/) scheduler |
| **Eat food** | [inventory-food](../inventory-food/) hunger restore |
| **Light / Add Wood** | [fire](../fire/) ignite and refuel |
| **Well-fed buff defs** | [buffs](../buffs/) (registry entries) |

## Anti-patterns (words to avoid)

| Don't say | Say instead |
| --------- | ----------- |
| "Cooking removes all disease" | Cooking removes **raw** disease; **residual** prion risk remains on deer and beef |
| "Campfire hunger" | **Hunger restore ratio** on the cooked **item** when eaten |
| "Fuel blocks" | **Placed wood** within fuel radius plus optional **inventory wood** on refuel |
