# Combat catalog

Every damage tier, damage kind, incapacitation constant, and roll dodge parameter with exact code touchpoints.

**Source of truth for tiers:** `src/client/world/health/domains/definingWorldPlazaDamageOutcomeTierRegistry.ts`

**Source of truth for kinds:** `src/client/world/health/domains/definingWorldPlazaEntityDamageKindRegistry.ts`

**Source of truth for health tuning:** `src/client/world/health/domains/definingWorldPlazaEntityHealthConstants.ts`

---

## Damage outcome tiers

Deviation score (σ) classification. High tiers checked first; low tiers after the normal band.

| Tier          | Label       | Threshold (σ) | Comparison         | Forced dev σ | Float kind            |
| ------------- | ----------- | ------------- | ------------------ | ------------ | --------------------- |
| `fatal`       | Fatal       | **3**         | ≥                  | **3.5**      | `damage_fatal`        |
| `lethal`      | Lethal      | **2**         | ≥                  | **2.25**     | `damage_lethal`       |
| `critical`    | Critical    | **1**         | ≥                  | **1.25**     | `damage_critical`     |
| `normal`      | Normal      | —             | default band       | **0**        | `damage`              |
| `true_strike` | True Strike | —             | forced (`lock_in`) | **0**        | `damage_true_strike`  |
| `softened`    | Softened    | **−1**        | ≤                  | **−1.25**    | `damage_softened`     |
| `blocked`     | Blocked     | **−2**        | ≤                  | **−2.25**    | `damage_roll_blocked` |
| `dodged`      | Dodged      | **−3**        | ≤                  | **−3.5**     | `damage_dodged`       |

### Roll engine parameters

| Constant      | Value                          | File                               |
| ------------- | ------------------------------ | ---------------------------------- |
| Base SD ratio | **0.2** (20% of EV)            | `rollingWorldPlazaDamageEngine.ts` |
| Min SD        | **1**                          | `rollingWorldPlazaDamageEngine.ts` |
| Roll formula  | `max(0, EV + σ × SD)`          | `rollingWorldPlazaDamageEngine.ts` |
| Roll modes    | `normal`, `lock_in`, `chaotic` | `rollingWorldPlazaDamageEngine.ts` |
| Connected-hit floor | `minimumOutcomeTier: 'normal'` on player wildlife hits | `resolvingWildlifePlayerOutgoingPhysicalDamageOptions.ts` + `applyingWorldPlazaDamageRollMinimumOutcomeTier.ts` |
| Spatial Miss float | gray `Miss` text, amount 0 | `definingWorldPlazaEntityHealthFloatTextTypes.ts` (`miss`) |

**Where to edit tiers**

| Layer            | File                                             | What to edit                                         |
| ---------------- | ------------------------------------------------ | ---------------------------------------------------- |
| Tier descriptors | `definingWorldPlazaDamageOutcomeTierRegistry.ts` | `thresholdSd`, float styling, dev button order       |
| Classifier       | same file                                        | `classifyingWorldPlazaDamageOutcomeTierFromRegistry` |
| Roll spread      | `rollingWorldPlazaDamageEngine.ts`               | `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_*`   |
| Hit floor        | `applyingWorldPlazaDamageRollMinimumOutcomeTier.ts` | Rank map + EV floor when raising tier             |
| Player outgoing  | `resolvingWildlifePlayerOutgoingPhysicalDamageOptions.ts` | `minimumOutcomeTier` for melee/projectile connects |
| Melee OOR Miss   | `enqueueingWildlifeMissFloatFeedback.ts` + Pixi scene swing start | Wildlife gray Miss when reach check fails |
| Jump-dodge Miss  | `resolvingWorldPlazaProjectileMissReason.ts` + projectile step `missEvents` | Player gray Miss when jump-dodgeable shot misses |
| Tests            | `rollingWorldPlazaDamageEngine.test.ts`, `applyingWorldPlazaDamageRollMinimumOutcomeTier.test.ts`, `resolvingWorldPlazaProjectileMissReason.test.ts` | forced σ + floor + miss reason |

---

## Damage kinds

| Kind                 | Roll engine | EV input    | Shield absorbs | Temp exposure | Death title       |
| -------------------- | ----------- | ----------- | -------------- | ------------- | ----------------- |
| `physical`           | yes         | flat EV     | yes            | —             | YOU DIED          |
| `environmental_lava` | no          | flat EV     | no             | heat          | YOU BURNED        |
| `environmental_heat` | no          | flat EV     | no             | heat          | YOU BURNED        |
| `environmental_cold` | no          | flat EV     | no             | cold          | YOU FROZE         |
| `fall`               | yes         | flat EV     | no             | —             | YOU FELL          |
| `toxic`              | no          | flat EV     | no             | —             | YOU WERE POISONED |
| `venomous`           | no          | flat EV     | no             | —             | VENOM KILLED YOU  |
| `lethal`             | no          | flat EV     | no             | —             | LETHAL POISON     |
| `bleeding`           | no          | flat EV     | no             | —             | YOU BLED OUT      |
| `hemorrhaging`       | no          | flat EV     | no             | —             | YOU HEMORRHAGED   |
| `exsanguinating`     | no          | flat EV     | no             | —             | YOU EXSANGUINATED |
| `potential_damage`   | yes         | flat EV     | no             | —             | FATED DEATH       |
| `soulbreak`          | yes         | max HP % EV | no             | —             | SOUL SHATTERED    |
| `healing`            | no          | flat EV     | no             | —             | YOU DIED          |
| `starvation`         | no          | flat EV     | no             | —             | YOU STARVED       |

**Where to edit kinds**

| Layer           | File                                                   | What to edit                                   |
| --------------- | ------------------------------------------------------ | ---------------------------------------------- |
| Kind registry   | `definingWorldPlazaEntityDamageKindRegistry.ts`        | descriptor block per kind                      |
| Shield rule     | same file                                              | `shouldWorldPlazaEntityDamageKindAbsorbShield` |
| Pipeline wiring | health engine `computingWorldPlazaEntityHealthDamage*` | dispatches by kind                             |

---

## Player health constants

| Constant                                                                   | Value     |
| -------------------------------------------------------------------------- | --------- |
| `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX`                              | **1000**  |
| `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_RESPAWN_INVINCIBILITY_MS`              | **10000** |
| `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_RESPAWN_INVINCIBILITY_BLINK_PERIOD_MS` | **180**   |
| `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_RESPAWN_INVINCIBILITY_BLINK_DIM_ALPHA` | **0.2**   |
| `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LOW_RATIO_THRESHOLD`                   | **0.5**   |
| `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LOW_RATIO_DAMAGE_MULTIPLIER`           | **0.75**  |
| `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_REGEN_PER_SECOND`                      | **2**     |
| `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_REGEN_DELAY_AFTER_DAMAGE_MS`           | **5000**  |
| `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DOT_TICK_INTERVAL_MS`                  | **1000**  |
| `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_DAMAGE_PER_SECOND`                | **25**    |
| `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HEAT_DAMAGE_PER_SECOND`                | **8**     |
| `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_COLD_DAMAGE_PER_SECOND`                | **6**     |
| `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_INSTANT_DAMAGE`                   | **15**    |
| `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FALL_SAFE_LAYER_DELTA`                 | **5**     |
| `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FALL_DAMAGE_PER_LAYER`                 | **15**    |
| `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HEAT_CLIMATE_TEMPERATURE_MIN`          | **0.72**  |
| `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_CLIMATE_TEMPERATURE_MIN`          | **0.88**  |
| `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_COLD_CLIMATE_TEMPERATURE_MAX`          | **0.3**   |
| `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_TILE_NOISE_THRESHOLD`             | **0.82**  |
| `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HUD_PUSH_INTERVAL_MS`                  | **100**   |
| `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HUD_EPSILON`                           | **0.005** |

File: `definingWorldPlazaEntityHealthConstants.ts`

### Initial health state fields (spawn defaults)

| Field | Spawn value | Notes |
| ----- | ----------- | ----- |
| `healBlockModifiers` | `[]` | Filled when a buff/stage blocks heals (e.g. Necrotic frostbite) |
| `frostbite` | `null` | Set when cold ticks start stacking; see [frostbite](../frostbite/) |

Other arrays on `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_INITIAL_STATE` (DoT, bleed, poison, sleep, stun, disease, damage modifiers, etc.) also start empty.

---

## Bleed stack escalation

| Constant                                                                | Value                         |
| ----------------------------------------------------------------------- | ----------------------------- |
| `DEFINING_WORLD_PLAZA_ENTITY_BLEED_STACK_ESCALATION_BLEEDING_COUNT`     | **10** stacks → hemorrhaging  |
| `DEFINING_WORLD_PLAZA_ENTITY_BLEED_STACK_ESCALATION_HEMORRHAGING_COUNT` | **5** stacks → exsanguinating |

### Bleed severity descriptors

| Severity         | Duration | Pool % max HP | Damage kind      |
| ---------------- | -------- | ------------- | ---------------- |
| `bleeding`       | **60s**  | **5%**        | `bleeding`       |
| `hemorrhaging`   | **30s**  | **10%**       | `hemorrhaging`   |
| `exsanguinating` | **10s**  | **25%**       | `exsanguinating` |

Files: `definingWorldPlazaEntityBleedStackConstants.ts`, `definingWorldPlazaEntityBleedSeverityRegistry.ts`

---

## Poison ramp segments

| Segment | Time share     | Damage share   |
| ------- | -------------- | -------------- |
| 1       | **0.5** (50%)  | **0.15** (15%) |
| 2       | **0.35** (35%) | **0.35** (35%) |
| 3       | **0.15** (15%) | **0.5** (50%)  |

| Constant                                               | Value |
| ------------------------------------------------------ | ----- |
| `DEFINING_WORLD_PLAZA_ENTITY_POISON_MIN_DAMAGE_AMOUNT` | **1** |

File: `definingWorldPlazaEntityPoisonRampConstants.ts`

---

## Incapacitation constants

### Sleep

| Constant                                               | Value                          |
| ------------------------------------------------------ | ------------------------------ |
| `DEFINING_WORLD_PLAZA_SLEEP_DEFAULT_DURATION_MS`       | **8000** (8s)                  |
| `DEFINING_WORLD_PLAZA_SLEEP_WAKE_BONUS_DAMAGE`         | **30**                         |
| `DEFINING_WORLD_PLAZA_SLEEP_FALL_ANIMATION_FPS`        | **6** (reuses death strip)     |
| `DEFINING_WORLD_PLAZA_SLEEP_FALL_DURATION_MS`          | **~4500** (27 death-strip frames at 6 fps) |
| `DEFINING_WORLD_PLAZA_SLEEP_SPEECH_BUBBLE_DURATION_MS` | **3200**                       |
| `DEFINING_WORLD_PLAZA_DEEP_SLEEP_DEFAULT_DURATION_MS`  | **12000** (12s)                |

Buff ids: `sleep-debuff`, `deep-sleep-debuff` in `definingWorldPlazaEntityBuffRegistry.ts`

File: `definingWorldPlazaEntitySleepConstants.ts`

Wake gate: `checkingWorldPlazaEntityHealthSleepCanWakeFromDamage.ts`, `applyingWorldPlazaEntitySleepWakeFromDamage.ts`

Presentation: `advancingWorldPlazaGirlSampleCombatPresentation.ts` (slow death clip), `renderingWorldPlazaEntityWorldAnchoredSleepSpeechBubble.tsx` (Zzz)

### Stun

| Constant                                                        | Value         |
| --------------------------------------------------------------- | ------------- |
| `DEFINING_WORLD_PLAZA_STUN_DEFAULT_DURATION_MS`                 | **4000** (4s) |
| `DEFINING_WORLD_PLAZA_STUN_AVATAR_MAX_WOBBLE_RAD`               | **0.12**      |
| `DEFINING_WORLD_PLAZA_STUN_AVATAR_WOBBLE_FREQUENCY_RAD_PER_SEC` | **7**         |
| `DEFINING_WORLD_PLAZA_STUN_DOT_COUNT`                           | **4**         |
| `DEFINING_WORLD_PLAZA_STUN_DOT_ORBIT_RADIUS_PX`                 | **14**        |
| `DEFINING_WORLD_PLAZA_STUN_DOT_SIZE_PX`                         | **5**         |
| `DEFINING_WORLD_PLAZA_STUN_DOT_ORBIT_ROTATIONS_PER_SEC`         | **0.9**       |
| `DEFINING_WORLD_PLAZA_STUN_DOT_OFFSET_ABOVE_AVATAR_PX`          | **42**        |

Buff id: `stun-debuff` in `definingWorldPlazaEntityBuffRegistry.ts`

File: `definingWorldPlazaEntityStunConstants.ts`

---

## Roll dodge parameters (Girl Sample)

Cross-context detail also documented in [movement-stamina/catalog.md](../movement-stamina/catalog.md).

| Constant                                                                 | Value                             |
| ------------------------------------------------------------------------ | --------------------------------- |
| `DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_ANIMATION_FPS`                    | **18**                            |
| Roll frame count                                                         | **9**                             |
| `DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DURATION_MS`                      | **500** (9 ÷ 18 × 1000)           |
| `DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_FORWARD_GRID_DISTANCE`            | **2.25** grid units               |
| `DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_START_RATIO`                | **0.15** (15% progress)           |
| `DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_END_RATIO`                  | **0.75** (75% progress)           |
| Active dodge window                                                      | **75ms–375ms** of 500ms roll      |
| `DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_MIN_DAMAGE_REDUCTION_RATIO` | **0.75** (75% reduction at edges) |
| `DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_MAX_DAMAGE_REDUCTION_RATIO` | **0.95** (95% reduction at peak)  |
| Mitigated kinds                                                          | `physical` only                   |
| `DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_CHAIN_START_RATIO`                | **1** (full roll must finish)     |
| `DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_CHAIN_EXTRA_DELAY_MS`             | **150**                           |

Files: `definingWorldPlazaGirlSampleCombatMotionConstants.ts`, `computingWorldPlazaGirlSampleRollDodgeIncomingDamageMultiplier.ts`

---

## Example projectile

| Field          | `arrow-straight` value |
| -------------- | ---------------------- |
| EV damage      | **12** physical        |
| Speed          | **9** grid/s           |
| Hitbox radius  | **0.12** grid          |
| Jump dodgeable | yes                    |
| Lifetime       | **4000** ms            |

File: `definingWorldPlazaProjectileArchetypeRegistry.ts`

---

## Equipped attack / defense EV

Outgoing player melee EV is character `attackPower` plus equipment modifiers on the selected hotbar item.

| Concern | Behavior | File |
| ------- | -------- | ---- |
| Modifier shape | `{ mode: 'additive' \| 'multiplicative', value }` | `definingWorldPlazaEquipmentEvModifier.ts` |
| Apply math | additive: `base + value`; multiplicative: `base * value`; missing → base | `computingWorldPlazaEquipmentModifiedEv.ts` |
| Resolve attack EV | Prefers `attackEvModifier`; else maps legacy `meleeDamageMultiplier` to multiplicative | `resolvingWorldPlazaEquippedAttackEv.ts` |
| Swing wiring | `damageAmount = round(resolvingWorldPlazaEquippedAttackEv(attackPower, …))` | `renderingWorldPlazaPixiScene.tsx` |
| Multiplier-only helper | Multiplicative value, or **1** for additive / none | `resolvingWorldPlazaEquippedMeleeDamageMultiplier.ts` |
| Defense modifier | Declared on capabilities; item info only (not in damage pipeline yet) | `definingWorldPlazaEquipmentToolKind.ts` |
| Tier sword values | wood **1.0**, iron **1.15**, steel **1.3**, gold **1.45** (also written as `attackEvModifier`) | `definingWorldPlazaToolTierConstants.ts` + `registeringWorldPlazaTieredToolInventoryItems.ts` |

**Where to edit equipment EV**

| Layer | File | What to edit |
| ----- | ---- | ------------ |
| Modifier type | `definingWorldPlazaEquipmentEvModifier.ts` | mode union |
| Capabilities | `definingWorldPlazaEquipmentToolKind.ts` | `attackEvModifier` / `defenseEvModifier` / legacy multiplier |
| Pure apply | `computingWorldPlazaEquipmentModifiedEv.ts` | additive vs multiplicative |
| Attack resolve | `resolvingWorldPlazaEquippedAttackEv.ts` | fallback from `meleeDamageMultiplier` |
| Tier defaults | `definingWorldPlazaToolTierConstants.ts` | sword multipliers |
| Tests | `computingWorldPlazaEquipmentModifiedEv.test.ts`, `resolvingWorldPlazaEquippedAttackEv.test.ts` | EV math |

---

## Player combat lock-on

| Constant / concern                 | Value / role                                                      | File                                                   |
| ---------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------ |
| Melee reach                        | **1.8** grid (shared with click hit)                              | `managingWildlifeInstanceStore.ts`                     |
| Chase stop / replan                | replan **120** ms or **0.35** grid                                | `definingWorldPlazaPlayerCombatLockConstants.ts`       |
| Lock tick (clear/chase/hold/swing) | pure resolver; **hold** while melee busy or Betray?/Betraying.... | `resolvingWorldPlazaPlayerCombatLockTick.ts`           |
| Scene wiring                       | lock ref, chase rAF, click-away                                   | `renderingWorldPlazaPixiScene.tsx`                     |
| Lock crosshair marker              | follows locked instance                                           | `renderingWorldPlazaPlayerCombatLockCrosshair.tsx`     |
| Attack hover cursor                | native CSS `crosshair` (Devvit-safe)                              | `DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_HOVER_CURSOR` |
| Chase walk plan                    | `applyingWalkPlanToDestination`                                   | `trackingWorldPlazaClickMovementTarget.ts`             |

**Where to edit lock-on**

| Layer     | File                                             | What to edit                          |
| --------- | ------------------------------------------------ | ------------------------------------- |
| Constants | `definingWorldPlazaPlayerCombatLockConstants.ts` | reach, replan interval/distance       |
| Resolver  | `resolvingWorldPlazaPlayerCombatLockTick.ts`     | clear / hold / chase / swing rules    |
| Scene     | `renderingWorldPlazaPixiScene.tsx`               | start lock, cancel paths, swing start |

---

## Shared code paths (all combat hits)

| Concern                 | File                                             |
| ----------------------- | ------------------------------------------------ |
| Damage roll             | `rollingWorldPlazaDamageEngine.ts`               |
| Tier registry           | `definingWorldPlazaDamageOutcomeTierRegistry.ts` |
| Kind registry           | `definingWorldPlazaEntityDamageKindRegistry.ts`  |
| Health constants        | `definingWorldPlazaEntityHealthConstants.ts`     |
| Health tick             | `advancingWorldPlazaEntityHealthTick.ts`         |
| Frostbite tick / stages | frostbite modules under `health/domains/` + [frostbite](../frostbite/) |
| Poison apply            | `applyingWorldPlazaEntityHealthPoisonStack.ts`   |
| Bleed apply             | bleed stack modules under `health/domains/`      |
| Sleep/stun buffs        | `definingWorldPlazaEntityBuffRegistry.ts`        |
| Status HUD              | `listingWorldPlazaEntityStatusEffectHudRows.ts`  |
| Player death area clear | `clearingWildlifeAreaOnPlayerDeath.ts`           |
| Wildlife on-hit procs   | `resolvingWildlifeSpeciesOnHitPlayerProcs.ts`    |
| Combat lock-on          | `resolvingWorldPlazaPlayerCombatLockTick.ts`     |

## Checklist: add damage kind

1. [ ] Add id to `DefiningWorldPlazaEntityDamageKind` union
2. [ ] Add descriptor in `definingWorldPlazaEntityDamageKindRegistry.ts`
3. [ ] Wire caller to pass correct EV input mode
4. [ ] Add float icon override if needed
5. [ ] Register death screen copy
6. [ ] Update this catalog and [glossary.md](./glossary.md) if new terms appear
7. [ ] Run `npm run test -- definingWorldPlazaEntityDamageKindRegistry` (if tests exist)
