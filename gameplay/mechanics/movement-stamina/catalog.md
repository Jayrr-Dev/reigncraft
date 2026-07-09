# Movement / stamina catalog

Every fatigue tier, stamina cost, regen delay, and roll dodge parameter with exact code touchpoints.

**Source of truth for stamina:** `src/client/world/domains/definingWorldPlazaRunStaminaConstants.ts`

**Source of truth for fatigue:** `src/client/world/domains/definingWorldPlazaPlayerStaminaFatigueConstants.ts`

**Source of truth for roll dodge:** `src/client/world/domains/definingWorldPlazaGirlSampleCombatMotionConstants.ts`

**Source of truth for jump height:** `src/client/world/building/domains/definingWorldBuildingWorldLayerConstants.ts`

---

## Stamina economy constants

| Constant | Value |
| -------- | ----- |
| `DEFINING_WORLD_PLAZA_RUN_STAMINA_RUN_DURATION_SECONDS` | **12.8** (full drain) |
| `DEFINING_WORLD_PLAZA_RUN_STAMINA_FULL_REGEN_SECONDS` | **4.5** (full refill) |
| `DEFINING_WORLD_PLAZA_RUN_STAMINA_DRAIN_PER_SECOND` | **1 / 12.8** |
| `DEFINING_WORLD_PLAZA_RUN_STAMINA_REGEN_PER_SECOND` | **1 / 4.5** |
| `DEFINING_WORLD_PLAZA_RUN_STAMINA_DEPLETION_REGEN_DELAY_MS` | **2000** |
| `DEFINING_WORLD_PLAZA_RUN_STAMINA_ACTION_SPEND_REGEN_DELAY_MS` | **600** |
| `DEFINING_WORLD_PLAZA_RUN_STAMINA_HOLD_TO_RUN_MS` | **150** |
| `DEFINING_WORLD_PLAZA_RUN_STAMINA_LOW_RATIO` | **0.3** (HUD warning) |
| `DEFINING_WORLD_PLAZA_RUN_STAMINA_HUD_PUSH_INTERVAL_MS` | **80** |
| `DEFINING_WORLD_PLAZA_RUN_STAMINA_MAX_FRAME_DELTA_SECONDS` | **0.05** |

File: `definingWorldPlazaRunStaminaConstants.ts`

---

## Action stamina costs

| Constant | Value | As % |
| -------- | ----- | ---- |
| `DEFINING_WORLD_PLAZA_JUMP_STAMINA_COST_RATIO` | **0.0625** | **6.25%** |
| `DEFINING_WORLD_PLAZA_RUN_JUMP_STAMINA_COST_RATIO` | **0.0875** | **8.75%** |
| `DEFINING_WORLD_PLAZA_ROLL_STAMINA_JUMP_COST_MULTIPLIER` | **3** | — |
| `DEFINING_WORLD_PLAZA_ROLL_STAMINA_COST_RATIO` | **0.1875** | **18.75%** |

File: `definingWorldPlazaRunStaminaConstants.ts`

---

## Fatigue tiers

Ordered progression when the bar fully empties (**100% → 0%**). Resets to `fresh` when bar refills to **100%**.

| Tier | Order | `useUnlockRatio` | `regenMultiplier` | Must refill before run/jump/roll |
| ---- | ----- | ---------------- | ----------------- | -------------------------------- |
| `fresh` | 0 | **0** | **1** | No gate |
| `winded` | 1 | **0.85** | **1** | **85%** |
| `fatigued` | 2 | **0.6** | **1** | **60%** |
| `spent` | 3 | **0.4** | **1** | **40%** |
| `collapsed` | 4 | **0.15** | **0.5** | **15%** |

| Constant | Value |
| -------- | ----- |
| `DEFINING_WORLD_PLAZA_PLAYER_STAMINA_FATIGUE_INITIAL_TIER` | `fresh` |
| `DEFINING_WORLD_PLAZA_PLAYER_STAMINA_FATIGUE_TIER_ORDER` | fresh → winded → fatigued → spent → collapsed |

File: `definingWorldPlazaPlayerStaminaFatigueConstants.ts`

**Where to edit fatigue**

| Layer | File | What to edit |
| ----- | ---- | ------------ |
| Tier config | `definingWorldPlazaPlayerStaminaFatigueConstants.ts` | `useUnlockRatio`, `regenMultiplier` per tier |
| Advance on empty | run stamina rAF hook | tier index increment |
| Reset on full | same hook | tier → `fresh` |

---

## Regen delay summary

| Trigger | Delay | Constant |
| ------- | ----- | -------- |
| Bar hit zero | **2000ms** before regen starts | `DEFINING_WORLD_PLAZA_RUN_STAMINA_DEPLETION_REGEN_DELAY_MS` |
| Jump or roll spent | **600ms** regen pause | `DEFINING_WORLD_PLAZA_RUN_STAMINA_ACTION_SPEND_REGEN_DELAY_MS` |
| Collapsed tier | Regen at **0.5×** normal rate | `regenMultiplier: 0.5` in fatigue config |

---

## Default locomotion speeds

When a character omits speed overrides, derived stats use isometric defaults:

| Constant | Value |
| -------- | ----- |
| `DEFINING_WORLD_PLAZA_ISOMETRIC_GRID_WALK_SPEED_PER_SECOND` | **2** grid/s |
| `DEFINING_WORLD_PLAZA_ISOMETRIC_GRID_RUN_SPEED_PER_SECOND` | **3** grid/s |

File: `definingWorldPlazaIsometricConstants.ts`

Per-skin overrides: [characters/catalog.md](../characters/catalog.md)

---

## Jump and world layers

| Constant | Value |
| -------- | ----- |
| `DEFINING_WORLD_BUILDING_WORLD_LAYER_JUMP_HEIGHT_MAX` | **4** layers |
| `DEFINING_WORLD_BUILDING_WORLD_LAYER_WALK_STEP_LAYER_DELTA` | **1** layer |
| `DEFINING_WORLD_BUILDING_WORLD_LAYER_WALL_COLLISION_MIN_LAYER_DELTA` | **2** layers |
| `DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND` | **1** |
| `DEFINING_WORLD_BUILDING_WORLD_LAYER_MIN` | **1** |
| `DEFINING_WORLD_BUILDING_WORLD_LAYER_MAX` | **32** |
| `DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX` | **8** px per layer |

File: `definingWorldBuildingWorldLayerConstants.ts`

---

## Roll dodge parameters (Girl Sample)

| Constant | Value |
| -------- | ----- |
| `DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_ANIMATION_FPS` | **18** |
| Roll sheet frames | **9** |
| `DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DURATION_MS` | **500** |
| `DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_FORWARD_GRID_DISTANCE` | **2.25** |
| `DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_START_RATIO` | **0.15** |
| `DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_END_RATIO` | **0.75** |
| Dodge window (computed) | **75ms – 375ms** |
| `DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_MIN_DAMAGE_REDUCTION_RATIO` | **0.75** |
| `DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_MAX_DAMAGE_REDUCTION_RATIO` | **0.95** |
| Incoming damage multiplier range | **0.05 – 0.25** (25–5% of raw) |
| `DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_MITIGATED_DAMAGE_KINDS` | `physical` |
| `DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_CHAIN_START_RATIO` | **1** |
| `DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_CHAIN_EXTRA_DELAY_MS` | **150** |

Files:

- `definingWorldPlazaGirlSampleCombatMotionConstants.ts`
- `computingWorldPlazaGirlSampleRollDodgeIncomingDamageMultiplier.ts`
- `resolvingWorldPlazaGirlSampleRollDodgeDamageOptions.ts`

---

## Cross-context hunger modifiers

From `resolvingWorldPlazaHungerMovementEffects.ts` ([hunger](../hunger/)):

| Hunger tier | Stamina / movement effect |
| ----------- | ------------------------- |
| Well fed (≥75%) | **+10%** stamina regen |
| Peckish (20–40%) | **+25%** drain and jump cost |
| Hungry (5–20%) | **−10%** speed, **+50%** jump cost, no sprint |
| Starving (0–5%) | **−20%** speed, no sprint/jump |

---

## Shared code paths

| Concern | File |
| ------- | ---- |
| Stamina state shape | `definingWorldPlazaRunStaminaConstants.ts` (`DefiningWorldPlazaRunStaminaState`) |
| Fatigue tier order | `definingWorldPlazaPlayerStaminaFatigueConstants.ts` |
| Character walk/run resolve | `computingWorldPlazaCharacterEngineDerivedStats.ts` |
| Hunger movement gate | `resolvingWorldPlazaHungerMovementEffects.ts` |
| Frost speed multiplier | `computingWorldPlazaEnvironmentalFrostMovementSpeedMultiplier.ts` |
| Roll dodge in damage pipe | `computingWorldPlazaGirlSampleRollDodgeIncomingDamageMultiplier.ts` |

## Checklist: tune sprint lockout

1. [ ] Adjust `useUnlockRatio` for target tier in fatigue constants
2. [ ] Confirm `DEFINING_WORLD_PLAZA_RUN_STAMINA_DEPLETION_REGEN_DELAY_MS` feels fair with regen rate
3. [ ] Playtest collapsed (**15%** gate + **0.5×** regen)
4. [ ] Update this catalog and [glossary.md](./glossary.md)
5. [ ] Sync tutorial copy in `definingPlazaTutorialConstants.ts` if player-facing numbers changed
