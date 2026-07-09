# Cooking and campfire catalog

Every wildlife meat row, cook timing, hunger values, disease wiring, well-fed rewards, and prion residuals.

**Source of truth:** `src/client/world/wildlife/domains/definingWildlifeMeatRegistry.ts`

**Cook recipes (derived):** `src/client/world/wildlife/domains/definingWildlifeMeatCookRecipes.ts`

**Disease definitions:** [disease/catalog.md](../disease/catalog.md)

**Species loot:** [wildlife/catalog.md](../wildlife/catalog.md)

---

## Summary table

| speciesId  | Raw item                        | Cooked item                        | Raw hunger | Cooked hunger | Cook time | Raw disease       | Raw % | Well-fed buff            | Well-fed % | Residual           |
| ---------- | ------------------------------- | ---------------------------------- | ---------- | ------------- | --------- | ----------------- | ----- | ------------------------ | ---------- | ------------------ |
| chicken    | world-plaza-raw-chicken-meat    | world-plaza-cooked-chicken-meat    | 0.12       | 0.30          | 2.5s      | salmonellosis     | 45%   | well-fed-comfort-buff    | 35%        | none               |
| deer       | world-plaza-raw-deer-meat       | world-plaza-cooked-deer-meat       | 0.22       | 0.48          | 4.0s      | chronic-wasting   | 35%   | well-fed-fleet-buff      | 40%        | 5% chronic-wasting |
| boar       | world-plaza-raw-boar-meat       | world-plaza-cooked-boar-meat       | 0.28       | 0.55          | 6.5s      | trichinellosis    | 40%   | well-fed-toughened-buff  | 38%        | none               |
| cow        | world-plaza-raw-beef            | world-plaza-cooked-beef            | 0.32       | 0.62          | 8.0s      | mad-cow           | 30%   | well-fed-prime-buff      | 42%        | 3% mad-cow         |
| sheep      | world-plaza-raw-mutton          | world-plaza-cooked-mutton          | 0.24       | 0.46          | 5.0s      | liver-fluke       | 35%   | well-fed-vigor-buff      | 36%        | none               |
| zebra      | world-plaza-raw-zebra-meat      | world-plaza-cooked-zebra-meat      | 0.26       | 0.50          | 5.5s      | sleeping-sickness | 38%   | well-fed-endurance-buff  | 40%        | none               |
| grey-wolf  | world-plaza-raw-wolf-meat       | world-plaza-cooked-wolf-meat       | 0.20       | 0.42          | 4.5s      | wolf-fever        | 42%   | well-fed-strength-buff   | 35%        | none               |
| omega-wolf | world-plaza-raw-omega-wolf-meat | world-plaza-cooked-omega-wolf-meat | 0.28       | 0.55          | 6.0s      | wolf-fever        | 50%   | strength + skew + siphon | 50%        | none               |
| brown-bear | world-plaza-raw-bear-meat       | world-plaza-cooked-bear-meat       | 0.38       | 0.68          | 10.0s     | bear-worm         | 45%   | well-fed-hearty-buff     | 45%        | none               |
| lion       | world-plaza-raw-lion-meat       | world-plaza-cooked-lion-meat       | 0.30       | 0.58          | 7.5s      | toxoplasmosis     | 38%   | well-fed-strength-buff   | 40%        | none               |
| lioness    | world-plaza-raw-lioness-meat    | world-plaza-cooked-lioness-meat    | 0.28       | 0.56          | 7.0s      | toxoplasmosis     | 36%   | well-fed-strength-buff   | 38%        | none               |
| crocodile  | world-plaza-raw-crocodile-meat  | world-plaza-cooked-crocodile-meat  | 0.25       | 0.52          | 6.0s      | vibrio-infection  | 40%   | well-fed-reptile-buff    | 37%        | none               |

**Loot quantity:** **1** for most species; **omega-wolf** drops **2**.

**Hunger values** are ratios of player max hunger (multiply by max hunger at eat time).

---

## chicken

| Field                        | Value                                                           |
| ---------------------------- | --------------------------------------------------------------- |
| **rawItemTypeId**            | `world-plaza-raw-chicken-meat`                                  |
| **cookedItemTypeId**         | `world-plaza-cooked-chicken-meat`                               |
| **rawHungerRestoreRatio**    | 0.12                                                            |
| **cookedHungerRestoreRatio** | 0.30                                                            |
| **cookDurationMs**           | 2,500                                                           |
| **rawDiseaseId**             | `salmonellosis` (mild)                                          |
| **rawDiseaseChance**         | 0.45                                                            |
| **cookedWellFedBuffId**      | `well-fed-comfort-buff` (Comfort Food, stamina regen ×1.2, 60s) |
| **cookedWellFedChance**      | 0.35                                                            |
| **cookedResidual**           | none                                                            |

**Where added**

| Layer         | File                                                 |
| ------------- | ---------------------------------------------------- |
| Meat row      | `definingWildlifeMeatRegistry.ts`                    |
| Disease       | `definingWorldPlazaEntityDiseaseRegistry.ts`         |
| Well-fed buff | `definingWorldPlazaEntityBuffRegistry.ts`            |
| Inventory     | `registeringWorldPlazaWildlifeMeatInventoryItems.ts` |

---

## deer (prion)

| Field                           | Value                                                 |
| ------------------------------- | ----------------------------------------------------- |
| **rawHungerRestoreRatio**       | 0.22                                                  |
| **cookedHungerRestoreRatio**    | 0.48                                                  |
| **cookDurationMs**              | 4,000                                                 |
| **rawDiseaseId**                | `chronic-wasting` (severe prion)                      |
| **rawDiseaseChance**            | 0.35                                                  |
| **cookedWellFedBuffId**         | `well-fed-fleet-buff` (Fleet Footed, speed ×1.2, 90s) |
| **cookedWellFedChance**         | 0.40                                                  |
| **cookedResidualDiseaseId**     | `chronic-wasting`                                     |
| **cookedResidualDiseaseChance** | 0.05                                                  |

Cooking lowers risk but does not eliminate prions. See [disease/catalog.md](../disease/catalog.md#chronic-wasting--chronic-wasting-prion).

---

## boar

| Field                        | Value                                                          |
| ---------------------------- | -------------------------------------------------------------- |
| **rawHungerRestoreRatio**    | 0.28                                                           |
| **cookedHungerRestoreRatio** | 0.55                                                           |
| **cookDurationMs**           | 6,500                                                          |
| **rawDiseaseId**             | `trichinellosis` (severe)                                      |
| **rawDiseaseChance**         | 0.40                                                           |
| **cookedWellFedBuffId**      | `well-fed-toughened-buff` (Toughened, damage taken ×0.85, 90s) |
| **cookedWellFedChance**      | 0.38                                                           |
| **cookedResidual**           | none                                                           |

---

## cow / beef (prion)

| Field                           | Value                                                   |
| ------------------------------- | ------------------------------------------------------- |
| **rawItemTypeId**               | `world-plaza-raw-beef`                                  |
| **cookedItemTypeId**            | `world-plaza-cooked-beef`                               |
| **rawHungerRestoreRatio**       | 0.32                                                    |
| **cookedHungerRestoreRatio**    | 0.62                                                    |
| **cookDurationMs**              | 8,000                                                   |
| **rawDiseaseId**                | `mad-cow` (critical prion)                              |
| **rawDiseaseChance**            | 0.30                                                    |
| **cookedWellFedBuffId**         | `well-fed-prime-buff` (Prime Cut, attack EV ×1.1, 100s) |
| **cookedWellFedChance**         | 0.42                                                    |
| **cookedResidualDiseaseId**     | `mad-cow`                                               |
| **cookedResidualDiseaseChance** | 0.03                                                    |

---

## sheep

| Field                        | Value                                                     |
| ---------------------------- | --------------------------------------------------------- |
| **rawHungerRestoreRatio**    | 0.24                                                      |
| **cookedHungerRestoreRatio** | 0.46                                                      |
| **cookDurationMs**           | 5,000                                                     |
| **rawDiseaseId**             | `liver-fluke` (moderate)                                  |
| **rawDiseaseChance**         | 0.35                                                      |
| **cookedWellFedBuffId**      | `well-fed-vigor-buff` (Pasture Vigor, heal amp ×1.2, 90s) |
| **cookedWellFedChance**      | 0.36                                                      |
| **cookedResidual**           | none                                                      |

Grey-wolf **favorite prey**; see [wildlife/catalog.md](../wildlife/catalog.md).

---

## zebra

| Field                        | Value                                                                    |
| ---------------------------- | ------------------------------------------------------------------------ |
| **rawHungerRestoreRatio**    | 0.26                                                                     |
| **cookedHungerRestoreRatio** | 0.50                                                                     |
| **cookDurationMs**           | 5,500                                                                    |
| **rawDiseaseId**             | `sleeping-sickness` (critical)                                           |
| **rawDiseaseChance**         | 0.38                                                                     |
| **cookedWellFedBuffId**      | `well-fed-endurance-buff` (Savanna Endurance, stamina regen ×1.35, 120s) |
| **cookedWellFedChance**      | 0.40                                                                     |
| **cookedResidual**           | none                                                                     |

---

## grey-wolf

| Field                        | Value                                                              |
| ---------------------------- | ------------------------------------------------------------------ |
| **rawItemTypeId**            | `world-plaza-raw-wolf-meat`                                        |
| **cookedItemTypeId**         | `world-plaza-cooked-wolf-meat`                                     |
| **rawHungerRestoreRatio**    | 0.20                                                               |
| **cookedHungerRestoreRatio** | 0.42                                                               |
| **lootQuantity**             | 1                                                                  |
| **cookDurationMs**           | 4,500                                                              |
| **rawDiseaseId**             | `wolf-fever` (severe)                                              |
| **rawDiseaseChance**         | 0.42                                                               |
| **cookedWellFedBuffId**      | `well-fed-strength-buff` (Predator Strength, attack EV ×1.15, 90s) |
| **cookedWellFedChance**      | 0.35                                                               |
| **cookedResidual**           | none                                                               |

Flavor: raw warns about wolf fever (no jump/roll, then confusion); cooked may sharpen strikes briefly (`definingWildlifeMeatItemDescriptionCorpus.ts`).

---

## omega-wolf

| Field                        | Value                                                          |
| ---------------------------- | -------------------------------------------------------------- |
| **rawItemTypeId**            | `world-plaza-raw-omega-wolf-meat`                              |
| **cookedItemTypeId**         | `world-plaza-cooked-omega-wolf-meat`                           |
| **rawDisplayName**           | Raw Omega Wolf Meat                                            |
| **cookedDisplayName**        | Cooked Omega Wolf Meat                                         |
| **rawHungerRestoreRatio**    | 0.28                                                           |
| **cookedHungerRestoreRatio** | 0.55                                                           |
| **lootQuantity**             | **2**                                                          |
| **cookDurationMs**           | 6,000                                                          |
| **rawDiseaseId**             | `wolf-fever` (severe; same disease as grey-wolf)               |
| **rawDiseaseChance**         | **0.50**                                                       |
| **cookedWellFedBuffId**      | `well-fed-strength-buff` (primary id)                          |
| **cookedWellFedBuffIds**     | strength + omega skew + omega siphon (all applied on one roll) |
| **cookedWellFedChance**      | **0.50**                                                       |
| **cookedResidual**           | none                                                           |

On a successful well-fed roll (**50%**), cooked omega wolf applies **all three** timed buffs for **90s**:

| Buff id                      | Label             | Effect                                                                 |
| ---------------------------- | ----------------- | ---------------------------------------------------------------------- |
| `well-fed-strength-buff`     | Predator Strength | Attack EV ×**1.15**                                                    |
| `well-fed-omega-skew-buff`   | Omega Skew        | Luck **+0.5** + critical bias **+1** (skews rolls toward crits)        |
| `well-fed-omega-siphon-buff` | Omega Siphon      | Heal **25%** of physical damage dealt (same ratio as `siphoning-buff`) |

Richer pack-leader cut: more hunger than grey-wolf, longer cook, higher fever risk, and a multi-buff cooked reward.

**Where added**

| Layer     | File                                                            |
| --------- | --------------------------------------------------------------- |
| Meat row  | `definingWildlifeMeatRegistry.ts` (`omega-wolf`)                |
| Flavor    | `definingWildlifeMeatItemDescriptionCorpus.ts`                  |
| Buffs     | `definingWorldPlazaEntityBuffRegistry.ts` (omega skew / siphon) |
| Disease   | reuses `wolf-fever`                                             |
| Inventory | `registeringWorldPlazaWildlifeMeatInventoryItems.ts`            |

---

## brown-bear

| Field                        | Value                                                       |
| ---------------------------- | ----------------------------------------------------------- |
| **rawHungerRestoreRatio**    | 0.38                                                        |
| **cookedHungerRestoreRatio** | 0.68                                                        |
| **cookDurationMs**           | 10,000                                                      |
| **rawDiseaseId**             | `bear-worm` (severe)                                        |
| **rawDiseaseChance**         | 0.45                                                        |
| **cookedWellFedBuffId**      | `well-fed-hearty-buff` (Hearty Meal, +80 temp max HP, 120s) |
| **cookedWellFedChance**      | 0.45                                                        |
| **cookedResidual**           | none                                                        |

Longest cook channel in the roster.

---

## lion

| Field                        | Value                      |
| ---------------------------- | -------------------------- |
| **rawHungerRestoreRatio**    | 0.30                       |
| **cookedHungerRestoreRatio** | 0.58                       |
| **cookDurationMs**           | 7,500                      |
| **rawDiseaseId**             | `toxoplasmosis` (moderate) |
| **rawDiseaseChance**         | 0.38                       |
| **cookedWellFedBuffId**      | `well-fed-strength-buff`   |
| **cookedWellFedChance**      | 0.40                       |
| **cookedResidual**           | none                       |

---

## lioness

| Field                        | Value                      |
| ---------------------------- | -------------------------- |
| **rawHungerRestoreRatio**    | 0.28                       |
| **cookedHungerRestoreRatio** | 0.56                       |
| **cookDurationMs**           | 7,000                      |
| **rawDiseaseId**             | `toxoplasmosis` (moderate) |
| **rawDiseaseChance**         | 0.36                       |
| **cookedWellFedBuffId**      | `well-fed-strength-buff`   |
| **cookedWellFedChance**      | 0.38                       |
| **cookedResidual**           | none                       |

---

## crocodile

| Field                        | Value                                                          |
| ---------------------------- | -------------------------------------------------------------- |
| **rawHungerRestoreRatio**    | 0.25                                                           |
| **cookedHungerRestoreRatio** | 0.52                                                           |
| **cookDurationMs**           | 6,000                                                          |
| **rawDiseaseId**             | `vibrio-infection` (severe)                                    |
| **rawDiseaseChance**         | 0.40                                                           |
| **cookedWellFedBuffId**      | `well-fed-reptile-buff` (River Hunter, damage taken ×0.9, 90s) |
| **cookedWellFedChance**      | 0.37                                                           |
| **cookedResidual**           | none                                                           |

---

## Shared tuning (all meat)

| Constant                                  | Value | File                              |
| ----------------------------------------- | ----- | --------------------------------- |
| Raw fallback poison EV                    | 5     | `definingWildlifeMeatRegistry.ts` |
| Raw fallback poison duration              | 60s   | same                              |
| Legacy sickness chance (generic fallback) | 0.35  | same                              |
| Food sickness hunger multiplier           | 0.5   | same                              |

---

## Campfire fuel (not per-meat)

| Constant              | Value             | File                                        |
| --------------------- | ----------------- | ------------------------------------------- |
| Fuel radius           | 2 tiles Chebyshev | `worldCampfireFuel.ts`                      |
| Small tier (1-3 wood) | 3 min/wood        | same                                        |
| Big tier (4+ wood)    | 1 min/wood        | same                                        |
| Max fuel              | 20 min            | `WORLD_CAMPFIRE_FUEL_MAX_MS`                |
| Campfire tile warmth  | 72°C              | `definingWorldPlazaTemperatureConstants.ts` |

Ignite/refuel UX: [fire](../fire/).

---

## Shared code paths (all meat types)

| Concern                 | File                                                                                                            |
| ----------------------- | --------------------------------------------------------------------------------------------------------------- |
| Cook validate           | `validatingWorldPlazaCampfireCookStart.ts`                                                                      |
| Cook channel            | `usingWorldPlazaCampfireCookProgress.ts`                                                                        |
| Cook complete           | `cookingWildlifeMeatAtCampfire.ts`                                                                              |
| Eat pipeline            | `resolvingWorldPlazaInventoryFoodEatEffects.ts` (`nowMs` = simulation clock, `worldEpochMs` = disease schedule) |
| Food definition resolve | `resolvingWorldPlazaInventoryItemFood.ts`                                                                       |
| Item registration       | `registeringWorldPlazaWildlifeMeatInventoryItems.ts`                                                            |
| Flavor copy             | `definingWildlifeMeatItemDescriptionCorpus.ts`                                                                  |
| Tests                   | `definingWildlifeMeatRegistry.test.ts`, `cookingWildlifeMeatAtCampfire.test.ts`                                 |

## Checklist: add meat row

1. [ ] Add row to `definingWildlifeMeatRegistry.ts`
2. [ ] Add flavor lines in `definingWildlifeMeatItemDescriptionCorpus.ts`
3. [ ] Add or reuse disease in `definingWorldPlazaEntityDiseaseRegistry.ts`
4. [ ] Add or reuse `well-fed-*` buff in buff registry
5. [ ] Register raw + cooked items
6. [ ] Wire species `loot` in `definingWildlifeSpeciesRegistry.ts`
7. [ ] Update [disease catalog](../disease/catalog.md) summary table
8. [ ] Update [wildlife catalog](../wildlife/catalog.md)
9. [ ] Run `npm run test -- definingWildlifeMeatRegistry`
10. [ ] Update this catalog
