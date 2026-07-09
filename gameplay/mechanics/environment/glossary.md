# Environment glossary (ubiquitous language)

Terms for Plaza climate temperature, comfort bands, and environmental hazards.

## Core concepts

| Term | Meaning |
| ---- | ------- |
| **Effective temperature** | Final °C after climate, night offset, local sources, neighbor blend, and player smoothing. |
| **Raw tile temperature** | Per-tile source °C before neighbor averaging (`computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex`). |
| **Climate noise** | Procedural `0..1` temperature per tile; maps to **−25°C..48°C**. |
| **Comfort band** | No climate DoT between base **−10°C** (low) and **50°C** (high), widened by heat/cold tolerance. |
| **Heat tolerance** | Extra °C added to comfort high (`heatComfortBonusCelsius`); buff `heat-tolerance-buff` = **+15°C**. |
| **Cold tolerance** | Extra °C subtracted from comfort low (`coldComfortBonusCelsius`); buff `cold-tolerance-buff` = **+15°C**. |
| **Exposure kind** | `heat`, `cold`, or `null` from comfort band breach. |
| **Environmental hazard** | Resolved DoT payload (flat HP/s + max-HP percent/s) for entity health tick. |
| **Display unit** | HUD preference for °C or °F. Simulation stays in Celsius. Settings gear → **Fahrenheit (°F)** under Auto jump. Default °C. |

## Damage terms

| Term | Meaning |
| ---- | ------- |
| **Heat DoT** | **0.35 HP/s** per °C above **50°C** comfort high. |
| **Cold DoT** | **0.3 HP/s** per °C below **−10°C** comfort low. |
| **Heat max-HP percent** | **0.00005** × excess °C per second (5% max HP/s at 1000°C excess). |
| **Cold max-HP percent** | **0.00004** × deficit °C per second (4% max HP/s at 1000°C deficit). |
| **Lava hazard kind** | Label `lava` when eased local temp ≥ **919°C** (within 1° of **920°C** source). |

## Local sources

| Term | Meaning |
| ---- | ------- |
| **Lava tile** | Fixed **920°C** on lava-painted tiles. |
| **Campfire standing tile** | **72°C** on lit campfire cell tile. |
| **Frozen water tile** | **−14°C** on climate-frozen surface water at night. |
| **Firelands ambient floor** | Biome clamps ambient to at least **62°C**. |
| **Block temperature level** | Optional `environmentalTemperature` on placed block definitions. |
| **Area temperature profile** | Painted heat/cold zones from `definingWorldPlazaTemperatureAreaProfiles.ts`. |

## Related

Cold DoT ticks also feed **frostbite stacks**. See [frostbite](../frostbite/).

## Frost movement

| Term | Meaning |
| ---- | ------- |
| **Frost slow** | Walk/run speed multiplier below **0°C** effective local temp. |
| **Full speed threshold** | At or above **0°C**: multiplier **1**. |
| **Absolute zero** | **−273.15°C**: multiplier **0** (movement stops). |
| **Cold immunity** | `isColdImmune` on entity resistance skips frost slow entirely. |

## Sampling terms

| Term | Meaning |
| ---- | ------- |
| **Night cooling** | **−8°C** subtracted from ambient when `isDaytime` is false. |
| **Neighbor averaging ring** | **2** (5×5 tiles). Grass blends toward neighborhood mean; source tiles keep peak. |
| **Smoothing rate** | **3**/second exponential ease on player readout (frame-rate independent). |
| **Melting point** | Climate-frozen water thaws when effective local temp reaches **0°C**. |

## Resistance and weakness

| Term | Meaning |
| ---- | ------- |
| **heatResistance / coldResistance** | Fraction of matching DoT prevented (0 = none, 1 = full). |
| **heatWeakness / coldWeakness** | Extra matching DoT taken as a fraction (0 = none, 1 = +100%). |
| **Damage multiplier** | `(1 − resistance) × (1 + weakness)`. Immunity hard-blocks to **0**. |
| **isHeatImmune / isColdImmune** | Skip corresponding damage or frost slow. |
| **Default resistance** | All zeros, no immunities (`DEFINING_WORLD_PLAZA_ENTITY_TEMPERATURE_RESISTANCE_DEFAULT`). |

## Code prefixes

| Prefix | Role |
| ------ | ---- |
| `defining*` | Constants, area/mob profiles |
| `computing*` | Raw temp, damage, frost multiplier |
| `averaging*` / `merging*` | Neighborhood blend |
| `resolving*` | Block levels, hazards at tile |
| `building*` | Temperature sample and hazard builders |
| `checking*` | Damage presence, heat source tiles |
| `converting*` | Climate noise → °C |

## Anti-patterns

| Don't say | Say instead |
| --------- | ----------- |
| "Freezing damage" | **Frost slow** (movement) vs **cold DoT** (HP loss below −10°C) |
| "Campfire heals cold" | Campfire **raises local °C** toward comfort; see [cooking-campfire](../cooking-campfire/) |
| "Biome temperature" | **Climate noise** (ambient) vs **Firelands floor** (62°C min) |
