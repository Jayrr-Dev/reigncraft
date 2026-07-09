# Disease catalog

Every registered disease, where it is defined, how players contract it, and which code files reference it.

**Source of truth for definitions:** `src/client/world/health/domains/definingWorldPlazaEntityDiseaseRegistry.ts`

**Source of truth for meat triggers:** `src/client/world/wildlife/domains/definingWildlifeMeatRegistry.ts`

## Summary table

| Disease id          | Label             | Severity | Species / meat | Raw chance | Cooked residual |
| ------------------- | ----------------- | -------- | -------------- | ---------- | --------------- |
| `salmonellosis`     | Salmonellosis     | mild     | chicken        | 45%        | —               |
| `chronic-wasting`   | Chronic Wasting   | severe   | deer           | 35%        | 5%              |
| `trichinellosis`    | Trichinellosis    | severe   | boar           | 40%        | —               |
| `mad-cow`           | Mad Cow           | critical | cow (beef)     | 30%        | 3%              |
| `liver-fluke`       | Liver Fluke       | moderate | sheep (mutton) | 35%        | —               |
| `sleeping-sickness` | Sleeping Sickness | critical | zebra          | 38%        | —               |
| `wolf-fever`        | Wolf Fever        | severe   | grey-wolf      | 42%        | —               |
| `bear-worm`         | Bear Worm         | severe   | brown-bear     | 45%        | —               |
| `toxoplasmosis`     | Toxoplasmosis     | moderate | lion, lioness  | 38% / 36%  | —               |
| `vibrio-infection`  | Vibrio Infection  | severe   | crocodile      | 40%        | —               |

---

## mild

### `salmonellosis` — Salmonellosis

| Field          | Value                                 |
| -------------- | ------------------------------------- |
| **Severity**   | mild                                  |
| **Incubation** | 8 in-game hours (~13 real min)        |
| **Illness**    | 2 in-game days (~80 real min)         |
| **Stages**     | +0h nausea slow · +6h toxic poison 25 |

**Where added**

| Layer           | File                                                 | What to edit                                             |
| --------------- | ---------------------------------------------------- | -------------------------------------------------------- |
| Definition      | `definingWorldPlazaEntityDiseaseRegistry.ts`         | `salmonellosis` descriptor block                         |
| Meat trigger    | `definingWildlifeMeatRegistry.ts`                    | `speciesId: 'chicken'` → `rawDiseaseId: 'salmonellosis'` |
| Inventory items | `registeringWorldPlazaWildlifeMeatInventoryItems.ts` | auto from meat catalog                                   |
| Item copy       | `definingWildlifeMeatItemDescriptionCorpus.ts`       | raw chicken description                                  |
| Debuff buff     | `definingWorldPlazaEntityBuffRegistry.ts`            | `disease-nausea-slow-debuff`                             |
| Tests           | `definingWorldPlazaEntityDiseaseRegistry.test.ts`    | registry + meat coverage                                 |

---

## moderate

### `liver-fluke` — Liver Fluke

| Field          | Value                                                                        |
| -------------- | ---------------------------------------------------------------------------- |
| **Severity**   | moderate                                                                     |
| **Incubation** | 2 in-game days (~80 real min)                                                |
| **Illness**    | 6 in-game days (~4 real hours)                                               |
| **Stages**     | +0h nausea slow (−30% move) · +4h stamina sick (2× sprint drain, 0.5× regen) |

**Where added**

| Layer        | File                                         | What to edit                                                |
| ------------ | -------------------------------------------- | ----------------------------------------------------------- |
| Definition   | `definingWorldPlazaEntityDiseaseRegistry.ts` | `liver-fluke` block                                         |
| Meat trigger | `definingWildlifeMeatRegistry.ts`            | `speciesId: 'sheep'`                                        |
| Debuff buffs | `definingWorldPlazaEntityBuffRegistry.ts`    | `disease-nausea-slow-debuff`, `disease-stamina-sick-debuff` |

### `toxoplasmosis` — Toxoplasmosis

| Field          | Value                              |
| -------------- | ---------------------------------- |
| **Severity**   | moderate                           |
| **Incubation** | 3 in-game days (~2 real hours)     |
| **Illness**    | 5 in-game days (~3.3 real hours)   |
| **Stages**     | +0h nausea slow · +1d confusion 50 |

**Where added**

| Layer        | File                                         | What to edit                        |
| ------------ | -------------------------------------------- | ----------------------------------- |
| Definition   | `definingWorldPlazaEntityDiseaseRegistry.ts` | `toxoplasmosis` block               |
| Meat trigger | `definingWildlifeMeatRegistry.ts`            | `speciesId: 'lion'` and `'lioness'` |

---

## severe

### `chronic-wasting` — Chronic Wasting (prion)

| Field           | Value                                            |
| --------------- | ------------------------------------------------ |
| **Severity**    | severe                                           |
| **Incubation**  | 3 in-game days                                   |
| **Illness**     | 7 in-game days                                   |
| **Stages**      | +0d confusion 25 · +2d nausea · +5d confusion 50 |
| **Cooked risk** | 5% residual (`cookedResidualDiseaseId`)          |

**Where added**

| Layer        | File                                         | What to edit                          |
| ------------ | -------------------------------------------- | ------------------------------------- |
| Definition   | `definingWorldPlazaEntityDiseaseRegistry.ts` | `chronic-wasting` block               |
| Meat trigger | `definingWildlifeMeatRegistry.ts`            | `speciesId: 'deer'` + residual fields |

### `trichinellosis` — Trichinellosis

| Field          | Value                                                     |
| -------------- | --------------------------------------------------------- |
| **Severity**   | severe                                                    |
| **Incubation** | 1.5 in-game days                                          |
| **Illness**    | 5 in-game days                                            |
| **Stages**     | +0d muscle lock (no sprint/jump) · +2d venomous poison 40 |

**Where added**

| Layer        | File                                         | What to edit                 |
| ------------ | -------------------------------------------- | ---------------------------- |
| Definition   | `definingWorldPlazaEntityDiseaseRegistry.ts` | `trichinellosis` block       |
| Meat trigger | `definingWildlifeMeatRegistry.ts`            | `speciesId: 'boar'`          |
| Debuff buff  | `definingWorldPlazaEntityBuffRegistry.ts`    | `disease-muscle-lock-debuff` |

### `wolf-fever` — Wolf Fever

| Field          | Value                                            |
| -------------- | ------------------------------------------------ |
| **Severity**   | severe                                           |
| **Incubation** | 12 in-game hours                                 |
| **Illness**    | 3 in-game days                                   |
| **Stages**     | +0d joint lock (no jump/roll) · +1d confusion 45 |

**Where added**

| Layer        | File                                         | What to edit                |
| ------------ | -------------------------------------------- | --------------------------- |
| Definition   | `definingWorldPlazaEntityDiseaseRegistry.ts` | `wolf-fever` block          |
| Meat trigger | `definingWildlifeMeatRegistry.ts`            | `speciesId: 'grey-wolf'`    |
| Debuff buff  | `definingWorldPlazaEntityBuffRegistry.ts`    | `disease-joint-lock-debuff` |

### `bear-worm` — Bear Worm

| Field          | Value                                              |
| -------------- | -------------------------------------------------- |
| **Severity**   | severe                                             |
| **Incubation** | 2 in-game days                                     |
| **Illness**    | 6 in-game days                                     |
| **Stages**     | +0d weakness (+30% incoming damage) · +3d bleed 30 |

**Where added**

| Layer        | File                                         | What to edit              |
| ------------ | -------------------------------------------- | ------------------------- |
| Definition   | `definingWorldPlazaEntityDiseaseRegistry.ts` | `bear-worm` block         |
| Meat trigger | `definingWildlifeMeatRegistry.ts`            | `speciesId: 'brown-bear'` |
| Debuff buff  | `definingWorldPlazaEntityBuffRegistry.ts`    | `disease-weakness-debuff` |

### `vibrio-infection` — Vibrio Infection

| Field          | Value                                           |
| -------------- | ----------------------------------------------- |
| **Severity**   | severe                                          |
| **Incubation** | 4 in-game hours                                 |
| **Illness**    | 1 in-game day                                   |
| **Stages**     | +0h toxic 30 · +2h nausea · +8h fated damage 20 |

**Where added**

| Layer        | File                                         | What to edit             |
| ------------ | -------------------------------------------- | ------------------------ |
| Definition   | `definingWorldPlazaEntityDiseaseRegistry.ts` | `vibrio-infection` block |
| Meat trigger | `definingWildlifeMeatRegistry.ts`            | `speciesId: 'crocodile'` |

---

## critical

### `mad-cow` — Mad Cow (prion)

| Field           | Value                                                     |
| --------------- | --------------------------------------------------------- |
| **Severity**    | critical                                                  |
| **Incubation**  | 5 in-game days (~3.3 real hours)                          |
| **Illness**     | 7 in-game days                                            |
| **Stages**      | +0d confusion 40 · +3d confusion 65 · +4d fated damage 35 |
| **Cooked risk** | 3% residual                                               |

**Where added**

| Layer        | File                                         | What to edit                         |
| ------------ | -------------------------------------------- | ------------------------------------ |
| Definition   | `definingWorldPlazaEntityDiseaseRegistry.ts` | `mad-cow` block                      |
| Meat trigger | `definingWildlifeMeatRegistry.ts`            | `speciesId: 'cow'` + residual fields |

### `sleeping-sickness` — Sleeping Sickness

| Field          | Value                                                             |
| -------------- | ----------------------------------------------------------------- |
| **Severity**   | critical                                                          |
| **Incubation** | 4 in-game days                                                    |
| **Illness**    | 7 in-game days                                                    |
| **Stages**     | +0d confusion 30 · +2d sleep 8h · +4d confusion 55 · +5d sleep 6h |

**Where added**

| Layer        | File                                         | What to edit              |
| ------------ | -------------------------------------------- | ------------------------- |
| Definition   | `definingWorldPlazaEntityDiseaseRegistry.ts` | `sleeping-sickness` block |
| Meat trigger | `definingWildlifeMeatRegistry.ts`            | `speciesId: 'zebra'`      |

---

## Shared code paths (all diseases)

These files reference diseases generically. You do **not** edit them per disease unless adding a new grant kind or infection source.

| Concern             | File                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| Contract on eat     | `resolvingWorldPlazaInventoryFoodEatEffects.ts`                                                  |
| Scheduler tick      | `applyingWorldPlazaEntityDisease.ts`                                                             |
| Grant dispatch      | `applyingWorldPlazaEntityDiseaseStageGrant.ts`                                                   |
| Health tick hook    | `advancingWorldPlazaEntityHealthTick.ts`                                                         |
| Runtime state shape | `definingWorldPlazaEntityHealthTypes.ts` (`diseaseEffects`)                                      |
| HUD badge rows      | `listingWorldPlazaEntityActiveBuffHudEntries.ts`                                                 |
| Save serialize      | `serializingWorldPlazaPlayerConditions.ts`                                                       |
| Save hydrate hook   | `usingWorldPlazaPersistingPlayerConditions.ts`                                                   |
| Mechanics guide     | `resolvingPlazaMechanicsDiseaseBadgeGuideEntries.ts`                                             |
| Stage guide copy    | `resolvingPlazaMechanicsDiseaseStageGuideEntries.ts`                                             |
| Predicate helpers   | `checkingWorldPlazaEntityActionLocked.ts` (hide grant buffs from HUD)                            |
| Unit tests          | `applyingWorldPlazaEntityDisease.test.ts`, `listingWorldPlazaEntityActiveBuffHudEntries.test.ts` |

## Checklist: add disease `#11`

1. [ ] Add id to `DefiningWorldPlazaEntityDiseaseId` union
2. [ ] Add descriptor (severity, incubation, duration, grants) in registry
3. [ ] Wire meat row or other trigger source
4. [ ] Add any new `disease-*` buff in buff registry
5. [ ] Register new Iconify icon if needed
6. [ ] Add item flavor copy if meat-linked
7. [ ] Run `npm run test -- definingWorldPlazaEntityDiseaseRegistry`
8. [ ] Update this catalog and [glossary.md](./glossary.md) if new terms appear
