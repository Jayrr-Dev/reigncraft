# Day / night glossary (ubiquitous language)

Terms used consistently across code, docs, and player-facing copy for the Plaza day/night bounded context.

## Core concepts

| Term | Meaning |
| ---- | ------- |
| **Cycle phase** | Normalized position in the 40-minute day: `0` = midnight, `0.5` = noon, `1` = next midnight. From `resolvingWorldPlazaDayNightCyclePhase`. |
| **Cycle sample** | `ResolvingWorldPlazaDayNightCycleSample`: `sharedEpochMs`, `cyclePhase`, `isDaytime` for one UTC instant. |
| **UTC epoch anchor** | `DEFINING_WORLD_PLAZA_DAY_NIGHT_EPOCH_ANCHOR_MS` (`1_735_689_600_000`). HUD day counter counts 40-minute days since this anchor. |
| **Shared epoch** | `Date.now()` sampled through `resolvingWorldPlazaDayNightSampleEpochMs`. Timezone-independent; all clients in a post agree without server clock sync. |
| **isDaytime** | `true` when `cyclePhase >= 0.2` (sunrise) and `< 0.82` (sunset). |
| **Sun state** | `ComputingWorldPlazaDayNightSunState`: shadows, sky tint CSS color, edge vignette alpha, light altitude. |

## Lighting terms

| Term | Meaning |
| ---- | ------- |
| **Sunrise phase** | `0.2` — day begins; warm orange sky tint band. |
| **Sunset phase** | `0.82` — day ends; twilight ramps into night. |
| **Sun state bucket** | One of **240** quantized slices per cycle (~**10s** at 40 min/day). Shadow layers redraw only when the bucket advances. |
| **Sky tint keyframe** | RGBA overlay sample at a cycle phase; linearly interpolated around the loop. |
| **Edge vignette** | Soft screen-edge darkness. Noon **0.02**, twilight **0.1**, deepest midnight **0.48**. |
| **Midnight darkness curve** | Exponent **2.4** on the night arc. Keeps twilight soft while concentrating peak darkness around true midnight. |
| **Moon altitude scale** | **0.6** — moon rides lower on the night arc than the sun at noon. |
| **Shadow length scale** | **0.75** at zenith (short) to **2.1** at horizon (long). |
| **Shadow alpha scale** | Noon **1.0**, twilight **0.3**, moonlit **0.42**, moonless night floor **0.16**. |

## Downstream effects

| Term | Meaning |
| ---- | ------- |
| **Night cooling** | **−8°C** subtracted from ambient climate at night. See [environment](../environment/). |
| **Frozen surface water** | Climate-frozen lakes/rivers become walkable ice at night when effective local temp stays below **0°C**. See `checkingWorldPlazaWaterIsFrozenAtTileIndex`. |
| **Emissive night boost** | Campfire flame alpha ×**1.45** and lava sprite alpha ×**1.4** at deepest midnight so heat sources stay readable. |
| **Wildlife sleep window** | Per-species cycle-phase bands; diurnal animals sleep through night arc. See [wildlife](../wildlife/). |
| **HUD day number** | Display counter **Day 1–30** wrapping; not used for disease timers (those use world epoch). |

## Time scale (shared kernel)

| In-game | Real time |
| ------- | --------- |
| 1 hour | ~2.5 minutes |
| 1 day | 40 minutes |

Source: `DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS`. Full table: [in-game-time](../../shared/in-game-time.md).

## Code prefixes (project convention)

| Prefix | Role in this context |
| ------ | -------------------- |
| `defining*` | Cycle constants, emissive boost, sky keyframes |
| `resolving*` | Phase, sample, arc progress |
| `computing*` | Sun state, vignette, sky tint interpolation |
| `formatting*` | HUD day number string |
| `checking*` | Frozen water (consumes `isDaytime`) |
| `using*` | React poll hook for sun state |

## Anti-patterns (words to avoid)

| Don't say | Say instead |
| --------- | ----------- |
| "Local timezone day/night" | **UTC epoch** cycle phase |
| "Server-synced sun" | **Shared epoch** (no server clock needed) |
| "Real-time day counter" | **HUD day wrap** (display only) vs **world epoch** for diseases |
