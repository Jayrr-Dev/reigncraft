# Hunger catalog

Thresholds, restore constants, and per-avatar metabolism multipliers.

**Tier and drain source of truth:** `src/client/world/hunger/domains/definingWorldPlazaHungerConstants.ts`

**Metabolism source of truth:** `src/client/world/character/domains/registeringWorldPlazaCharacterEngineDefinitions.ts`

## Tier thresholds

| Tier | Constant key | Inclusive lower bound (ratio) | Inclusive lower bound (%) |
| ---- | ------------ | ----------------------------- | ------------------------- |
| Well fed | `WELL_FED` | 0.75 | 75% |
| Content | `CONTENT` | 0.40 | 40% |
| Peckish | `PECKISH` | 0.20 | 20% |
| Hungry | `HUNGRY` | 0.05 | 5% |
| Starving | `STARVING` | 0 (below 5%) | &lt;5% |

Resolver: `resolvingWorldPlazaHungerTier(hungerRatio)`.

## Tier effect multipliers

| Tier | Constant | Value | Applies to |
| ---- | -------- | ----- | ---------- |
| Well fed | `HUNGER_WELL_FED_STAMINA_REGEN_MULTIPLIER` | 1.1 (+10%) | Stamina regen |
| Peckish | `HUNGER_PECKISH_STAMINA_DRAIN_MULTIPLIER` | 1.25 (+25%) | Stamina drain while running |
| Peckish | `HUNGER_PECKISH_JUMP_COST_MULTIPLIER` | 1.25 (+25%) | Jump hunger cost |
| Hungry | `HUNGER_HUNGRY_SPEED_MULTIPLIER` | 0.9 (−10%) | Walk speed |
| Hungry | `HUNGER_HUNGRY_JUMP_COST_MULTIPLIER` | 1.5 (+50%) | Jump hunger cost |
| Starving | `HUNGER_STARVING_SPEED_MULTIPLIER` | 0.8 (−20%) | Walk speed |

Hard disables (not constants): sprint off at hungry and starving; jump off at starving only.

## Drain and starvation constants

| Constant | Value | Notes |
| -------- | ----- | ----- |
| `HUNGER_IDLE_DRAIN_DURATION_MS` | 3,600,000 ms | 1.5 in-game days |
| `HUNGER_IDLE_DRAIN_PER_SECOND` | 1/3600 | Derived |
| `HUNGER_WALK_DRAIN_MULTIPLIER` | 1.15 | |
| `HUNGER_SPRINT_DRAIN_MULTIPLIER` | 2.0 | |
| `HUNGER_JUMP_COST_RATIO` | 0.004 | 0.4% per walk jump |
| `HUNGER_RUN_JUMP_COST_RATIO` | 0.006 | 0.6% per run jump |
| `HUNGER_HEALTH_REGEN_MIN_RATIO` | 0.3 | Regen gate |
| `HUNGER_STARVATION_TICK_INTERVAL_MS` | 2000 | |
| `HUNGER_STARVATION_TIME_TO_DEATH_MS` | 4,800,000 ms | 2 in-game days |
| `HUNGER_STARVATION_MAX_HEALTH_PERCENT_PER_TICK` | ~0.0417% | Derived from interval / time-to-death |
| `HUNGER_STARVATION_VARIANCE_MIN` | 0.7 | |
| `HUNGER_STARVATION_VARIANCE_MAX` | 1.4 | |
| `HUNGER_INITIAL_RATIO` | 1 | Session start / respawn |
| `HUNGER_DEFAULT_METABOLISM_MULTIPLIER` | 1 | Fallback when skin has no override |

## Food restore constants (generic items)

Defined in `definingWorldPlazaHungerConstants.ts`, referenced by inventory item types.

| Item | Constant | Restore ratio | Restore % |
| ---- | -------- | ------------- | --------- |
| Berries | `DEFINING_WORLD_PLAZA_HUNGER_RESTORE_BERRIES` | 0.15 | 15% |
| Apple | `DEFINING_WORLD_PLAZA_HUNGER_RESTORE_APPLE` | 0.25 | 25% |
| Cooked meat (legacy generic constant) | `DEFINING_WORLD_PLAZA_HUNGER_RESTORE_COOKED_MEAT` | 0.60 | 60% |

Species meat uses per-entry ratios in `definingWildlifeMeatRegistry.ts`. See [inventory-food catalog](../inventory-food/catalog.md).

**Sickness multiplier:** when eat effects mark the player sick, effective restore is `hungerRestoreRatio × 0.5` (`DEFINING_WILDLIFE_FOOD_SICKNESS_HUNGER_MULTIPLIER`).

## Metabolism multipliers by avatar

`hungerDrainMultiplier` scales **idle drain**, **activity drain**, and **jump hunger cost** for that skin.

| Avatar | `characterId` / skin | `hungerDrainMultiplier` | vs baseline |
| ------ | -------------------- | ----------------------- | ----------- |
| Girl | `GIRL_SAMPLE` | 1.0 | Baseline |
| Husky | `HUSKY` | 1.15 | +15% faster drain |
| Golden Retriever | `GOLDEN_RETRIEVER` | 1.0 | Baseline |
| Grizzly | `GRIZZLY` | 1.3 | +30% faster drain |
| Penguin | `PINGUIN` | 0.85 | −15% slower drain |
| Fox Peach | `FOX_PEACH` | 1.0 | Baseline |
| Orange Cat | `CAT_ORANGE` | 0.9 | −10% slower drain |

**Edit file:** `registeringWorldPlazaCharacterEngineDefinitions.ts` → `stats.hungerDrainMultiplier` on each definition.

Wired in scene: `renderingWorldPlazaPixiScene.tsx` passes `selectedCharacterEngineDefinition.stats.hungerDrainMultiplier` into `usingWorldPlazaPlayerHunger`.

## Where to edit (quick map)

| Change | File |
| ------ | ---- |
| Tier thresholds / drain / starvation | `definingWorldPlazaHungerConstants.ts` |
| Tier gameplay effects | `resolvingWorldPlazaHungerMovementEffects.ts` |
| Per-avatar metabolism | `registeringWorldPlazaCharacterEngineDefinitions.ts` |
| Berries / apple restore | `definingWorldPlazaHungerConstants.ts` + `definingWorldPlazaInventoryItemTypes.ts` |
| Species meat restore | `definingWildlifeMeatRegistry.ts` |
| Eat → hunger wiring | `renderingWorldPlazaPixiScene.tsx` |
