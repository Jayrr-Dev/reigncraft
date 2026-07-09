# Inventory and food mechanics

How eating works from the hotbar through hunger restore and health side effects.

## Player-facing loop

```mermaid
sequenceDiagram
  participant P as Player
  participant HB as Hotbar
  participant SC as Pixi scene
  participant CH as Eat channel
  participant FE as Eat effects resolver
  participant HP as Health state
  participant HU as Hunger hook

  P->>HB: Use food item
  HB->>SC: startFoodEatFromHotbar
  alt Already full or already eating
    SC-->>P: Toast
  else Start channel
    SC->>CH: startingFoodEat (duration by food)
    Note over P,CH: Held in place; Munching... + flavor + progress ring
    alt Damage during channel
      CH-->>P: Cancel (no consume)
    else Channel completes
      CH->>FE: resolvingWorldPlazaInventoryFoodEatEffects
      FE->>HU: eatingFoodRef(effectiveHungerRestoreRatio)
      SC->>HP: healthStateRef = nextHealthState
      SC->>HB: Consume 1 stack
    end
  end
```

## Eat channel

Eating is a timed interaction (`usingWorldPlazaInventoryFoodEatProgress`), not instant.

| Rule          | Behavior                                                                              |
| ------------- | ------------------------------------------------------------------------------------- |
| Duration      | **1–10 s** by food / animal (`definingWorldPlazaInventoryFoodEatDurationRegistry.ts`) |
| Hold in place | Avatar tool action `eat` clears walk/run/jump each frame (same lock as tree chop)     |
| Move / jump   | Input is ignored; channel continues                                                   |
| Damage        | Any new `lastDamagedAtMs` after channel start cancels; item stays in inventory        |
| UI            | Progress ring + **"Munching..."** + one random flavor line above the player           |

Forage defaults: berries **1 s**, apple **1.5 s**, wheat/fish **2 s** (default). Wildlife meats share one duration for raw and cooked of the same species (chicken **1 s** … elephant/mammoth **10 s**).

## Hotbar double activation

Single tap/click on a filled hotbar slot opens the item action popover (after a short defer so a second press can cancel it). Double-tap or double-click runs the item's **primary use** and skips the popover:

| Item kind | Primary use |
| --------- | ----------- |
| Food | Eat (same path as popover Eat) |
| Unequipped equipment | Equip |
| Bag | Open / close bag storage |
| Everything else (or already equipped) | Open item action popover |

Detection: mouse `event.detail >= 2`, or touch second tap on the same slot within **500 ms** and **28 px** (`checkingWorldPlazaInventorySlotDoubleActivation`). Action pick: `resolvingWorldPlazaInventorySlotDoubleActivationAction`. Wiring: `renderingWorldPlazaInventorySlotCell.tsx`.

## Item inspect (info dialog)

Opening **Item details** from the action tower shows:

| Surface | Content |
| ------- | ------- |
| Badge row | Rarity (always), special tags, forge level when set, plus existing food/tool chips |
| Details rows | Rarity, Created by (if `metadata.createdBy`), forge level, cost (resolved), attack/defense EV modifiers, hunger/tool/storage rows |
| Enchantments | Passive harvest/build enchants; optional `combatEffects` on defs are declared only (not applied on hit yet) |

Badge paints: rainbow poster chips via `DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_BADGE_PAINT_BY_VARIANT`.

## Equipped attack EV

Melee damage EV while a hotbar weapon is selected:

```
attackEv = computingWorldPlazaEquipmentModifiedEv(characterAttackPower, attackEvModifier)
```

- **Additive:** `base + value`
- **Multiplicative:** `base × value`
- Unarmed / no modifier: character attack power unchanged

Resolver: `resolvingWorldPlazaEquippedAttackEv` (used from `renderingWorldPlazaPixiScene.tsx`). Defense EV modifiers display in inspect UI only.

## Eat entry point

Hotbar food use in `renderingWorldPlazaPixiScene.tsx`:

1. Resolve `foodDefinition` from `itemTypeId` via `resolvingWorldPlazaInventoryFoodDefinition`.
2. Reject if asleep, stunned, dead, already eating, or `hungerRatio >= 1`.
3. Start the eat channel with duration from `resolvingWorldPlazaInventoryFoodEatDurationMs`.
4. On channel complete, call `resolvingWorldPlazaInventoryFoodEatEffects` with `healthState`, `nowMs = performance.now()` (simulation clock for buffs / poison / grant stamps), `worldEpochMs = Date.now()` (disease incubation schedule), `sicknessRoll`, and separate `wellFedRoll`.
5. Pass `effectiveHungerRestoreRatio` to `eatingFoodRef`.
6. On success, assign `nextHealthState` to `healthStateRef` and consume one item from inventory.

Berries, apple, and wheat skip meat branches (no `meatKind`). Raw fish sets `meatKind: 'raw'` so it enters the raw eat path; without `rawDiseaseId` / poison fields it currently restores hunger only (popover still lists the configured sickness chance for UI). Wildlife meat rows include full disease and well-fed metadata from the meat catalog.

## Raw vs cooked

### Raw meat (`meatKind: 'raw'`)

| Step | Behavior                                                                                                  |
| ---- | --------------------------------------------------------------------------------------------------------- |
| 1    | If `rawDiseaseId` and `sicknessRoll < rawDiseaseChance` → contract disease, stop poison fallback          |
| 2    | Else if `rawPoisonFlatEv > 0` and `rawPoisonDurationMs > 0` → toxic DoT at `flatEv / duration` per second |
| 3    | Species values come from `definingWildlifeMeatRegistry.ts` per row                                        |

Generic fallback constants (non-catalog items): `DEFINING_WILDLIFE_RAW_MEAT_POISON_FLAT_EV` = **5**, duration **60_000 ms**, legacy sickness chance **0.35** (used when food row supplies those fields).

### Cooked meat (`meatKind: 'cooked'`)

| Step | Behavior                                                                                           |
| ---- | -------------------------------------------------------------------------------------------------- |
| 1    | Roll `cookedResidualDiseaseId` at `cookedResidualDiseaseChance` (prions: deer **5%**, beef **3%**) |
| 2    | Roll `cookedWellFedBuffId` at `cookedWellFedChance` → `applyingWorldPlazaEntityBuff`               |
| 3    | No raw poison path on cooked                                                                       |

Cook channel durations and campfire UI: [cooking-campfire](../cooking-campfire/).

## Disease roll

Raw and cooked residual paths call `applyingWorldPlazaEntityDisease` with the species-linked disease id.

- Incubation is silent (no HUD until symptomatic). See [disease mechanics](../disease/mechanics.md).
- Contract on eat sets `didRollDisease: true` for that bite.

## Hunger restore

| Case                                   | Formula                             |
| -------------------------------------- | ----------------------------------- |
| Healthy                                | `foodDefinition.hungerRestoreRatio` |
| Sick (`didRollDisease` or symptomatic) | `hungerRestoreRatio × 0.5`          |

Sick check uses `checkingWorldPlazaEntityDiseaseIsSymptomatic` with the eat call's `worldEpochMs` so active illnesses penalize restore even if this bite did not roll a new disease.

Restore applies only through `eatingFoodRef` in the hunger hook. Health state mutation does not change hunger by itself.

## Buff apply (cooked well-fed)

On successful well-fed roll, `applyingWorldPlazaEntityBuff` adds a timed buff from [buffs catalog](../buffs/catalog.md) (`well-fed-*` ids). Each species maps to one buff id and chance in the meat catalog.

Buffs appear in the HUD row when not hidden. They stack with hunger tier effects independently.

## Food sickness sprint lock

Registry entry `food-sickness-debuff` blocks sprint when its movement modifier is active (`checkingWorldPlazaEntityActionLocked`). The eat pipeline today applies the **hunger multiplier** via `isSick` without always applying this buff instance. Disease symptom buffs use separate `disease-*` ids from the disease scheduler.

## Generic forage and catch restore

| Item    | `itemTypeId`          | Restore ratio  | Notes                                                                                              |
| ------- | --------------------- | -------------- | -------------------------------------------------------------------------------------------------- |
| Berries | `world-plaza-berries` | **15%** (0.15) | Forage                                                                                             |
| Apple   | `world-plaza-apple`   | **25%** (0.25) | Forage                                                                                             |
| Wheat   | `world-plaza-wheat`   | **18%** (0.18) | Harvested crop; no meat pipeline                                                                   |
| Fish    | `world-plaza-fish`    | **20%** (0.20) | Raw catch (`meatKind: 'raw'`); popover shows **8%** sickness hint; no disease/poison ids wired yet |

Constants: `DEFINING_WORLD_PLAZA_HUNGER_RESTORE_BERRIES`, `APPLE`, `WHEAT`, `FISH`.

Wheat seeds are not food. Wood fishrod / hoe / scythe / sword are equipment (see catalog tools section), not hunger restores.

## Hotbar weapon/tool reservation

The far-left hotbar slot (**index 0**) is reserved for weapons and tools.

| Rule           | Behavior                                                                                                                                                        |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accept         | Item types with `equipment.toolKinds` (length > 0)                                                                                                              |
| Reject         | All other item types (food, bags, resources, …)                                                                                                                 |
| Empty UI       | Faded fist icon; selecting the slot still equips unarmed melee                                                                                                  |
| Auto-add       | `findingWorldPlazaInventoryFirstEmptySlotForItemTypeId` skips slot 0 for non-tools                                                                              |
| Drag / bag     | Moves that would place a non-tool in slot 0 (or swap one into it) are no-ops                                                                                    |
| Load normalize | `normalizingWorldPlazaInventoryWeaponToolSlot` relocates a legacy non-tool out of slot 0 when space exists, then grants a **Wood Axe** if slot 0 is still empty |

## Ground item lifetime

Dropped stacks (player drop, tree wood, wildlife meat) despawn after **1 minute** (`WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DESPAWN_MS` = **60_000**).

| Path                    | Behavior                                                         |
| ----------------------- | ---------------------------------------------------------------- |
| Devvit / Redis          | List endpoint deletes expired rows on poll                       |
| Local single-player     | `listingWorldPlazaLocalGroundItems` filters and rewrites storage |
| Optimistic UI merge     | Expired pending rows are not re-merged after the poll drops them |
| Wildlife ephemeral food | `listingWildlifeGroundFoodItems` prunes expired corpse meat      |

Predicate: `checkingWorldInventoryGroundItemIsExpired` / `checkingWorldPlazaGroundItemIsExpired`.

Ground markers render as bare glyphs with a medium black outline (no cream circular plate). Every marker mounts a reusable progress ring centered on the glyph; the ring stays invisible until a channel is active.

### Pickup channel (weight)

Picking up a ground stack is a timed channel, not instant (click and walk-over auto-pickup share the same path).

| Rule | Behavior |
| ---- | -------- |
| Weight | Every item type has a carry weight (`resolvingWorldPlazaInventoryItemWeight`). Explicit table for resources/tools/bags; wildlife meat from species `massKg` (**3 kg** → **0.5**, **5_000 kg** → **100**). |
| Duration | **0.5–10 s** linear from weight (`computingWorldPlazaGroundItemPickupDurationMs`). Berries ~**0.5 s**; elephant meat ~**10 s**. |
| Range | Must stay in pickup radius for the whole channel; walking away cancels with no grant. |
| Capacity | Inventory full still blocks before the channel starts (same "Full" hint). |
| UI | Ground progress ring fills while channeling (same reusable ring wildlife uses for forage-eat). |
| One at a time | Only one player pickup channel runs; auto-pickup waits until it finishes. |

Drop placement (hotbar Drop / drag-off): tap a ground tile; preview shows the **item icon** (not an arrow) bobbing on the target diamond. No toast for “tap the ground.”

## Enhancements vs enchantments

Items may carry **enhancements** and/or **enchantments** (same engine list, different `family`).

| Family | Player-facing | Scope |
| ------ | ------------- | ----- |
| Enhancement | Section **Enhancements** (blue badges) | Yield, harvest speed, durability, build placement, other concrete tool capability |
| Enchantment | Section **Enchantments** (violet badges) | Status effects, buffs, debuffs, damage types (`combatEffects` declared for future hit wiring) |

Passive mods: expandable badges in the item info dialog (tap name → description). Active mods: action-tower use buttons (arm / cooldown).

Registry: `definingWorldPlazaInventoryEnchantmentRegistry.ts`. Resolver: `resolvingWorldPlazaInventoryItemEnchantments.ts`.

## Key files

| Concern                | File                                                                                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Eat channel hook       | `src/client/world/inventory/hooks/usingWorldPlazaInventoryFoodEatProgress.ts`                                                            |
| Eat duration registry  | `src/client/world/inventory/domains/definingWorldPlazaInventoryFoodEatDurationRegistry.ts`                                               |
| Eat flavor lines       | `src/client/world/inventory/domains/definingWorldPlazaInventoryFoodEatFlavorTextConstants.ts`                                            |
| Eat overlay UI         | `src/client/world/inventory/components/renderingWorldPlazaInventoryFoodEatOverlay.tsx`                                                   |
| Eat resolver           | `src/client/world/inventory/domains/resolvingWorldPlazaInventoryFoodEatEffects.ts`                                                       |
| Food metadata resolver | `src/client/world/inventory/domains/resolvingWorldPlazaInventoryItemFood.ts`                                                             |
| Item type registry     | `src/client/world/inventory/domains/definingWorldPlazaInventoryItemTypes.ts`                                                             |
| Item type shape        | `src/client/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition.ts` (`food` / `equipment` behaviors)                   |
| Item weight            | `definingWorldPlazaInventoryItemWeightConstants.ts` + `resolvingWorldPlazaInventoryItemWeight.ts`                                       |
| Pickup duration        | `computingWorldPlazaGroundItemPickupDurationMs.ts` + `resolvingWorldPlazaGroundItemPickupDurationMs.ts`                                 |
| Pickup channel hook    | `usingWorldPlazaGroundItemPickupProgress.ts`                                                                                             |
| Ground progress ring   | `renderingWorldPlazaGroundItemProgressRing.tsx`                                                                                          |
| Tiered tool generation | `src/client/world/inventory/domains/registeringWorldPlazaTieredToolInventoryItems.ts`                                                    |
| Tool tier stats        | `src/client/world/equipment/domains/definingWorldPlazaToolTierConstants.ts`                                                              |
| Meat item generation   | `src/client/world/inventory/domains/registeringWorldPlazaWildlifeMeatInventoryItems.ts`                                                  |
| Species meat catalog   | `src/client/world/wildlife/domains/definingWildlifeMeatRegistry.ts`                                                                      |
| Hotbar eat wiring      | `src/client/world/components/renderingWorldPlazaPixiScene.tsx`                                                                           |
| Item mod registry      | `definingWorldPlazaInventoryEnchantmentRegistry.ts` (`family` + `kind`)                                                                  |
| Item mod UI            | `renderingWorldPlazaInventoryItemInfoDialog.tsx` + `resolvingWorldPlazaInventoryItemEnchantments.ts`                                     |
| Hunger restore         | `src/client/world/hunger/hooks/usingWorldPlazaPlayerHunger.ts`                                                                           |
| Ground despawn         | `src/shared/checkingWorldInventoryGroundItemIsExpired.ts` + `WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DESPAWN_MS`                              |
| Ground marker style    | `definingWorldPlazaGroundItemConstants.ts` + `.world-plaza-ground-item-glyph-outline`                                                    |
| Tests                  | `resolvingWorldPlazaInventoryFoodEatEffects.test.ts`, eat duration registry test, `resolvingWorldPlazaGroundItemPickupDurationMs.test.ts`, `managingWorldPlazaGroundItemOptimisticBridge.test.ts` |

## Tuning checklist

| Goal                           | Edit                                                                         |
| ------------------------------ | ---------------------------------------------------------------------------- |
| Berry/apple/wheat/fish restore | `definingWorldPlazaHungerConstants.ts` + item types                          |
| Tiered tool balance            | `definingWorldPlazaToolTierConstants.ts` + tiered tool registrar             |
| Eat channel duration           | `definingWorldPlazaInventoryFoodEatDurationRegistry.ts`                      |
| Item weight / pickup time      | `definingWorldPlazaInventoryItemWeightConstants.ts`                          |
| Munching flavor lines          | `definingWorldPlazaInventoryFoodEatFlavorTextConstants.ts`                   |
| Species raw/cooked restore     | `rawHungerRestoreRatio` / `cookedHungerRestoreRatio` in meat catalog         |
| Raw disease odds               | `rawDiseaseChance` on meat row + disease definition                          |
| Cooked buff odds               | `cookedWellFedChance` + buff in buff registry                                |
| Prion residual                 | `cookedResidualDiseaseChance` on deer/beef rows                              |
| Sickness hunger penalty        | `DEFINING_WILDLIFE_FOOD_SICKNESS_HUNGER_MULTIPLIER` (0.5)                    |
| Ground item lifetime           | `WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DESPAWN_MS` in `worldInventoryDevvit.ts` |
