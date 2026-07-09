# Wildlife catalog

Every registered species, combat profile, prey rules, on-hit procs, sleep schedule, and stalk eligibility.

**Source of truth for species:** `src/client/world/wildlife/domains/definingWildlifeSpeciesRegistry.ts`

**Source of truth for on-hit procs:** `src/client/world/wildlife/domains/definingWildlifeSpeciesOnHitEffectRegistry.ts`

**Player-facing bestiary copy:** `src/client/components/home/domains/definingPlazaBestiaryGuideConstants.ts` (43 entries; sight + studied summaries, optional Apostle flavor on studied detail only).

## Summary table

| speciesId  | Display    | Temperament | Diet      | Activity    | Aggro radius | Pack share | Stalk eligible |
| ---------- | ---------- | ----------- | --------- | ----------- | ------------ | ---------- | -------------- |
| cow        | Cow        | passive     | herbivore | diurnal     | 2            | 8          | No             |
| sheep      | Sheep      | passive     | herbivore | diurnal     | 2            | 8          | No             |
| chicken    | Chicken    | passive     | herbivore | diurnal     | 2            | 8          | No             |
| deer       | Deer       | skittish    | herbivore | crepuscular | 6            | 8          | No             |
| zebra      | Zebra      | skittish    | herbivore | diurnal     | 7            | 8          | No             |
| boar       | Boar       | retaliator  | omnivore  | crepuscular | 5            | 0          | No             |
| grey-wolf  | Grey Wolf  | stalker     | carnivore | nocturnal   | 8            | 10         | **Yes**        |
| brown-bear | Brown Bear | retaliator  | omnivore  | cathemeral  | 6            | 8          | No             |
| lion       | Lion       | predator    | carnivore | crepuscular | 9            | 12         | No             |
| lioness    | Lioness    | predator    | carnivore | crepuscular | 9            | 12         | No             |
| crocodile  | Crocodile  | ambusher    | carnivore | cathemeral  | 3.5          | 8          | No             |

Default aggro fields unless overridden: threat/damage **2.5**, decay **0.4/s**, leash **18** grid, target switch margin **1.25**, starving proximity **0.5**.

---

## passive (livestock)

### `cow`: Cow

| Field              | Value                                                         |
| ------------------ | ------------------------------------------------------------- |
| **Temperament**    | passive                                                       |
| **Diet / tier**    | herbivore, tier 1                                             |
| **Aggro radius**   | 2 grid                                                        |
| **Prey**           | None (herbivore)                                              |
| **On-hit procs**   | None                                                          |
| **Sleep**          | diurnal; bell-curve window (0σ species shift)                 |
| **Stalk eligible** | No                                                            |
| **Loot**           | Raw Beef → [cooking-campfire](../cooking-campfire/catalog.md) |

**Where added**

| Layer         | File                                                  |
| ------------- | ----------------------------------------------------- |
| Species       | `definingWildlifeSpeciesRegistry.ts`                  |
| Meat          | `definingWildlifeMeatRegistry.ts`                     |
| Behavior tree | `definingWildlifeBehaviorTreeRegistry.ts` (`passive`) |

### `sheep`: Sheep

| Field              | Value                             |
| ------------------ | --------------------------------- |
| **Temperament**    | passive                           |
| **Diet / tier**    | herbivore, tier 1                 |
| **Aggro radius**   | 2 grid                            |
| **Prey**           | None; **grey-wolf favorite prey** |
| **On-hit procs**   | None                              |
| **Sleep**          | diurnal                           |
| **Stalk eligible** | No (prey for wolf stalk AI)       |
| **Loot**           | Raw Mutton                        |

### `chicken`: Chicken

| Field                | Value                                       |
| -------------------- | ------------------------------------------- |
| **Temperament**      | passive                                     |
| **Diet / tier**      | herbivore, tier 1                           |
| **Aggro radius**     | 2 grid                                      |
| **Aggression spawn** | `aggressiveAttacksOnSight: true`            |
| **Prey**             | None                                        |
| **On-hit procs**     | None                                        |
| **Sleep**            | diurnal                                     |
| **Stalk eligible**   | No                                          |
| **Loot**             | Raw Chicken Meat                            |
| **Note**             | Aggressive spawn may attack player on sight |

---

## skittish (prey)

### `deer`: Deer

| Field              | Value                                                            |
| ------------------ | ---------------------------------------------------------------- |
| **Temperament**    | skittish                                                         |
| **Diet / tier**    | herbivore, tier 1                                                |
| **Aggro radius**   | 6 grid                                                           |
| **Prey**           | Wolf/croc explicit allow list                                    |
| **On-hit procs**   | None                                                             |
| **Sleep**          | crepuscular (active dawn/dusk)                                   |
| **Stalk eligible** | No                                                               |
| **Loot**           | Raw Deer Meat (prion risk, see [disease](../disease/catalog.md)) |

### `zebra`: Zebra

| Field              | Value                         |
| ------------------ | ----------------------------- |
| **Temperament**    | skittish                      |
| **Diet / tier**    | herbivore, tier 1             |
| **Aggro radius**   | 7 grid                        |
| **Hazards**        | Heat immune                   |
| **Prey**           | Wolf/croc explicit allow list |
| **On-hit procs**   | None                          |
| **Sleep**          | diurnal                       |
| **Stalk eligible** | No                            |
| **Loot**           | Raw Zebra Meat                |

---

## retaliator

### `boar`: Boar

| Field              | Value                                        |
| ------------------ | -------------------------------------------- |
| **Temperament**    | retaliator                                   |
| **Diet / tier**    | omnivore, tier 2                             |
| **Aggro radius**   | 5 grid; **pack share 0** (solitary)          |
| **Territory**      | warn 5 / escalate 2.8 / linger 2.5s          |
| **Prey**           | Trophic/mass hunt when hungry                |
| **On-hit procs**   | bleed `bleeding` **40%** (0.3× damage scale) |
| **Sleep**          | crepuscular                                  |
| **Stalk eligible** | No                                           |
| **Loot**           | Raw Boar Meat                                |

### `brown-bear`: Brown Bear

| Field              | Value                                                   |
| ------------------ | ------------------------------------------------------- |
| **Temperament**    | retaliator                                              |
| **Diet / tier**    | omnivore, tier 3                                        |
| **Aggro radius**   | 6 grid                                                  |
| **Territory**      | warn 7 / escalate 3.5 / linger 3s                       |
| **Prey**           | Trophic tier 3 default (tier 1-2 by mass)               |
| **On-hit procs**   | bleed `hemorrhaging` **50%**; `sluggish-debuff` **22%** |
| **Sleep**          | cathemeral (night bucket rolls, 42% base at 0σ)         |
| **Hazards**        | Cold immune                                             |
| **Stalk eligible** | No                                                      |
| **Loot**           | Raw Bear Meat                                           |

---

## stalker

### `grey-wolf`: Grey Wolf

| Field              | Value                                                                                |
| ------------------ | ------------------------------------------------------------------------------------ |
| **Temperament**    | stalker                                                                              |
| **Diet / tier**    | carnivore, tier 2                                                                    |
| **Aggro radius**   | 8 grid; **pack share 10**                                                            |
| **Territory**      | warn 6 / escalate 3 / linger 3s                                                      |
| **Prey allow**     | deer, zebra, cow, sheep, chicken, boar                                               |
| **Prey deny**      | grey-wolf                                                                            |
| **Favorite prey**  | sheep (sight 14 grid)                                                                |
| **On-hit procs**   | bleed `bleeding` **35%** (0.25× damage scale)                                        |
| **Sleep**          | nocturnal (sleeps by day)                                                            |
| **Hazards**        | Heat and cold immune                                                                 |
| **Stalk eligible** | **Yes** (only species on stalk statechart today)                                     |
| **Stamina**        | Drain **0.28×**, regen **2.4×**, exhaust exit **22%** (~16s sprint, ~3s full refill) |
| **Loot**           | Raw Wolf Meat                                                                        |
| **Name tags**      | Pup (−2σ); locked pack alpha always **Alpha** (overrides other prefixes)             |

**Stalk tuning:** `definingWildlifeStalkConstants.ts`, `definingWildlifeStalkerBehaviourMachine.ts`
**Stamina:** `DEFINING_WILDLIFE_SPECIES_STAMINA` in `definingWildlifeSpeciesRegistry.ts`

---

## predator

### `lion`: Lion

| Field              | Value                                                    |
| ------------------ | -------------------------------------------------------- |
| **Temperament**    | predator                                                 |
| **Diet / tier**    | carnivore, tier 3                                        |
| **Aggro radius**   | 9 grid; **pack share 12**                                |
| **Territory**      | warn 8 / escalate 3.2 / linger 2.5s                      |
| **Prey**           | Trophic tier 3 default                                   |
| **On-hit procs**   | bleed `hemorrhaging` **45%**; `exhausted-debuff` **20%** |
| **Sleep**          | crepuscular                                              |
| **Hazards**        | Heat immune                                              |
| **Stalk eligible** | No                                                       |
| **Loot**           | Raw Lion Meat                                            |

### `lioness`: Lioness

| Field              | Value                                             |
| ------------------ | ------------------------------------------------- |
| **Temperament**    | predator                                          |
| **Diet / tier**    | carnivore, tier 3                                 |
| **Aggro radius**   | 9 grid; **pack share 12**                         |
| **Territory**      | Same pride config as lion                         |
| **Prey**           | Trophic tier 3 default                            |
| **On-hit procs**   | bleed `bleeding` **40%**; `winded-debuff` **18%** |
| **Sleep**          | crepuscular                                       |
| **Stalk eligible** | No                                                |
| **Loot**           | Raw Lioness Meat                                  |

---

## ambusher

### `crocodile`: Crocodile

| Field              | Value                                                                             |
| ------------------ | --------------------------------------------------------------------------------- |
| **Temperament**    | ambusher                                                                          |
| **Diet / tier**    | carnivore, tier 3                                                                 |
| **Aggro radius**   | 3.5 grid; **leash 10** grid                                                       |
| **Prey allow**     | deer, zebra, cow, sheep, chicken, boar                                            |
| **On-hit procs**   | bleed `hemorrhaging` **55%**; poison `toxic` **35%**; `heavy-legs-debuff` **30%** |
| **Sleep**          | cathemeral                                                                        |
| **Hazards**        | Swamp water safe; heat immune                                                     |
| **Stalk eligible** | No                                                                                |
| **Loot**           | Raw Crocodile Meat                                                                |
| **Note**           | `idleNearWater` behavior branch when adjacent to water                            |

---

## Stalk phase reference (grey-wolf only)

| Phase       | Player-visible behavior                                                                 |
| ----------- | --------------------------------------------------------------------------------------- |
| idle        | Pack not committed to a hunt                                                            |
| shadowing   | Trail prey at 6-9.5 grid with calm random-walk legs; **15s** minimum before pack commit |
| retreating  | Back away when player closes on shadowing wolf                                          |
| regrouping  | Pack widens distance after cautious retreat                                             |
| formingUp   | **≥5** wolves line up (**10-15s**) before surround                                      |
| surrounding | **≥3** wolves move to flank slots (2.4-4.4 grid ring)                                   |
| attacking   | Committed melee burst (**4s**); then re-surround / re-flank if prey lives               |
| fleeing     | Hunt abandoned, alpha dead, or damage flee roll                                         |

---

## Shared code paths (all species)

| Concern            | File                                           |
| ------------------ | ---------------------------------------------- |
| Simulation tick    | `advancingWildlifeSimulationTick.ts`           |
| Aggro / threat     | `advancingWildlifeAggroTick.ts`                |
| Behavior tree      | `advancingWildlifeBehaviorTick.ts`             |
| Conditions         | `definingWildlifeBehaviorConditionRegistry.ts` |
| Actions            | `definingWildlifeBehaviorActionRegistry.ts`    |
| Player melee procs | `resolvingWildlifeSpeciesOnHitPlayerProcs.ts`  |
| Sleep tick         | `advancingWildlifeSleepTick.ts`                |
| Wake nearby        | `wakingWildlifeNearbySleepersFromHit.ts`       |
| Herd flee          | `applyingWildlifeHerbivoreHerdFleeResponse.ts` |
| Alpha death        | `applyingWildlifePackAlphaDeathScatter.ts`     |
| Meat loot ids      | `definingWildlifeMeatRegistry.ts`              |

## Checklist: add species `#12`

1. [ ] Add id to `DefiningWildlifeSpeciesId` union
2. [ ] Add descriptor in `definingWildlifeSpeciesRegistry.ts`
3. [ ] Confirm temperament tree exists (or add new tree)
4. [ ] Add on-hit row if the species hurts the player
5. [ ] Add meat row in `definingWildlifeMeatRegistry.ts` if lootable
6. [ ] Wire biome spawn in `definingWildlifeBiomeSpawnTable.ts`
7. [ ] Register animation clips
8. [ ] Update this catalog, [cooking-campfire catalog](../cooking-campfire/catalog.md), and [disease catalog](../disease/catalog.md) if meat-linked
9. [ ] Run `npm run test -- definingWildlifeMeatRegistry`
