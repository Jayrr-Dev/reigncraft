# Day / night catalog

Every cycle constant, sky keyframe, and code touchpoint for the Plaza day/night bounded context.

**Source of truth:** `src/client/world/domains/definingWorldPlazaDayNightCycleConstants.ts`

## Timing constants

| Constant | Value | Player / engine effect |
| -------- | ----- | ---------------------- |
| `DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS` | `2_400_000` (40 min) | One in-game day; scales all in-game duration helpers |
| `DEFINING_WORLD_PLAZA_DAY_NIGHT_EPOCH_ANCHOR_MS` | `1_735_689_600_000` | HUD day counter origin |
| `DEFINING_WORLD_PLAZA_DAY_NIGHT_DISPLAY_DAY_WRAP` | `30` | HUD shows Day 1–30 then wraps |
| `DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNRISE_PHASE` | `0.2` | Day begins (~8 min into cycle) |
| `DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE` | `0.82` | Day ends (~33 min into cycle) |
| `DEFINING_WORLD_PLAZA_DAY_NIGHT_SUN_STATE_BUCKET_COUNT` | `240` | ~10s shadow redraw quantization |
| `DEFINING_WORLD_PLAZA_DAY_NIGHT_SUN_STATE_POLL_INTERVAL_MS` | `1000` | React consumer poll rate |

## Moon and shadow constants

| Constant | Value | Effect |
| -------- | ----- | ------ |
| `MOON_ALTITUDE_SCALE` | `0.6` | Moon rides lower than sun at zenith |
| `SHADOW_DIRECTION_DOWN_COMPONENT` | `0.55` | Downward shadow bias |
| `SHADOW_DIRECTION_SIDE_COMPONENT` | `0.95` | Max sideways sweep at sunrise/sunset |
| `SHADOW_LENGTH_SCALE_MIN` | `0.75` | Shortest shadows (noon) |
| `SHADOW_LENGTH_SCALE_MAX` | `2.1` | Longest shadows (horizon) |
| `SHADOW_ALPHA_SCALE_NOON` | `1` | Full shadow opacity midday |
| `SHADOW_ALPHA_SCALE_TWILIGHT` | `0.3` | Diffuse twilight shadows |
| `SHADOW_ALPHA_SCALE_MOONLIT` | `0.42` | Moonlit shadow cap |
| `SHADOW_ALPHA_SCALE_NIGHT_FLOOR` | `0.16` | Moonless deep-night floor |

## Darkness and vignette constants

| Constant | Value | Effect |
| -------- | ----- | ------ |
| `EDGE_VIGNETTE_ALPHA_NOON` | `0.02` | Barely visible at noon |
| `EDGE_VIGNETTE_ALPHA_TWILIGHT` | `0.1` | Golden-hour edge fade |
| `EDGE_VIGNETTE_ALPHA_MIDNIGHT` | `0.48` | Peak screen-edge darkness |
| `MIDNIGHT_DARKNESS_CURVE_EXPONENT` | `2.4` | Concentrates peak darkness around midnight |

## Sky tint keyframes

Linear interpolation between sorted phases (list wraps midnight → first keyframe).

| Phase | RGB | Alpha | Band |
| ----- | --- | ----- | ---- |
| 0.00 | (2, 3, 16) | 0.64 | Deep night blue |
| 0.16 | (4, 6, 24) | 0.56 | Pre-dawn |
| 0.20 | (120, 70, 90) | 0.30 | Sunrise rose |
| 0.25 | (255, 140, 66) | 0.18 | Golden hour |
| 0.32 | (255, 214, 130) | 0.05 | Morning haze |
| 0.41 | (255, 255, 255) | 0.00 | Midday clear |
| 0.61 | (255, 255, 255) | 0.00 | Afternoon clear |
| 0.73 | (255, 196, 110) | 0.08 | Late warm |
| 0.82 | (255, 120, 60) | 0.34 | Sunset orange |
| 0.86 | (18, 14, 40) | 0.62 | Twilight purple |
| 0.90 | (2, 3, 16) | 0.78 | Deep night return |

## Emissive night boost (related)

`src/client/world/domains/definingWorldPlazaEmissiveNightBoostConstants.ts`

| Constant | Value |
| -------- | ----- |
| `EMISSIVE_LAVA_LIGHT_BRIGHTNESS` | `1` |
| `EMISSIVE_LAVA_LIGHT_BASE_RADIUS_SCALE` | `1.7` |
| `EMISSIVE_LAVA_LIGHT_MAX_RADIUS_SCALE` | `4.5` |
| `EMISSIVE_LAVA_SPRITE_ALPHA_BOOST_AT_MIDNIGHT` | `1.4` |
| `EMISSIVE_CAMPFIRE_FLAME_ALPHA_BOOST_AT_MIDNIGHT` | `1.45` |

## Resolver and compute files

| Concern | File | What to edit |
| ------- | ---- | ------------ |
| Cycle constants | `definingWorldPlazaDayNightCycleConstants.ts` | Duration, phases, keyframes, shadow tuning |
| Phase resolver | `resolvingWorldPlazaDayNightCyclePhase.ts` | Rarely; math only |
| Sample builder | `resolvingWorldPlazaDayNightCycleSample.ts` | Sample shape |
| Epoch override | `resolvingWorldPlazaDayNightSampleEpochMs.ts` | Debug hook |
| Sun state | `computingWorldPlazaDayNightSunState.ts` | Lighting math |
| HUD day number | `formattingWorldPlazaDayNightDayNumber.ts` | Display wrap |
| React poll | `usingWorldPlazaDayNightSunState.ts` | Consumer wiring |
| In-game ms helpers | `computingWorldPlazaInGameDurationMs.ts` | Hour/day converters |

## Downstream consumers (do not edit for cycle tuning)

| System | File | Uses |
| ------ | ---- | ---- |
| Night cooling | `computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex.ts` | `isDaytime` → −8°C |
| Frozen water | `checkingWorldPlazaWaterIsFrozenAtTileIndex.ts` | `isDaytime` + climate |
| Wildlife sleep | `resolvingWildlifeShouldSleepAtCyclePhase.ts` | `cyclePhase` |
| Sleep schedules | `definingWildlifeSleepScheduleConstants.ts` | Per-species windows |
| Pixi scene | `renderingWorldPlazaPixiScene.tsx` | Sun state + emissive boost |

## Tests

| File | Coverage |
| ---- | -------- |
| `formattingWorldPlazaDayNightDayNumber.test.ts` | HUD wrap at day 30 |

## Checklist: change day length

1. [ ] Edit `DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS`
2. [ ] Re-check wildlife sleep feel (phase windows unchanged but real minutes shift)
3. [ ] Re-check disease/hunger real-time durations (in-game authoring unchanged)
4. [ ] Update [in-game-time.md](../../shared/in-game-time.md) if display table changes
5. [ ] Update this catalog and [mechanics.md](./mechanics.md) phase time column
6. [ ] Visual pass at sunrise (0.2), noon (0.5), sunset (0.82), midnight (0.0)
