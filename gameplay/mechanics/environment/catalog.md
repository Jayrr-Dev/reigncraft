# Environment catalog

Comfort bands, local heat sources, frost constants, and code touchpoints.

**Source of truth:** `src/client/world/health/domains/definingWorldPlazaTemperatureConstants.ts`

## Comfort bands

| Constant | Value (°C) | Gameplay |
| -------- | ---------- | -------- |
| `COMFORT_LOW_CELSIUS` | **−10** | No cold DoT at or above |
| `COMFORT_HIGH_CELSIUS` | **50** | No heat DoT at or below |
| `FROST_MOVEMENT_FULL_SPEED_CELSIUS` | **0** | Full walk/run speed at or above |
| `ABSOLUTE_ZERO_CELSIUS` | **−273.15** | Movement stops |
| `WATER_MELTING_POINT_CELSIUS` | **0** | Frozen water thaws at or above |

## Climate and night

| Constant | Value | Gameplay |
| -------- | ----- | -------- |
| `CLIMATE_MIN_CELSIUS` | **−25** | Noise 0 |
| `CLIMATE_MAX_CELSIUS` | **48** | Noise 1 |
| `NIGHT_COOLING_CELSIUS` | **8** | Subtracted when not daytime |
| `DISPLAY_UNIT` | `celsius` | HUD readout |

## Damage rates

| Constant | Value | At 100°C excess/deficit |
| -------- | ----- | ------------------------- |
| `HEAT_DAMAGE_PER_DEGREE_PER_SECOND` | **0.35** | 35 HP/s flat at 100°C over comfort |
| `COLD_DAMAGE_PER_DEGREE_PER_SECOND` | **0.3** | 30 HP/s flat at 100°C under comfort |
| `HEAT_MAX_HEALTH_PERCENT_PER_DEGREE_PER_SECOND` | **0.00005** | 0.5% max HP/s per excess °C |
| `COLD_MAX_HEALTH_PERCENT_PER_DEGREE_PER_SECOND` | **0.00004** | 0.4% max HP/s per deficit °C |
| `HEAT_TOLERANCE_BONUS_CELSIUS` | **15** | Default `heat-tolerance-buff` comfort raise |
| `COLD_TOLERANCE_BONUS_CELSIUS` | **15** | Default `cold-tolerance-buff` comfort lower |

## Local heat and cold sources

| Source | Constant | °C | Code path |
| ------ | -------- | --- | --------- |
| Lava tile | `TEMPERATURE_LAVA_CELSIUS` | **920** | `checkingWorldPlazaLavaAtTileIndex` |
| Campfire standing tile | `TEMPERATURE_CAMPFIRE_CELSIUS` | **72** | Block/cell + neighbor blend |
| Frozen water (night) | `TEMPERATURE_FROZEN_WATER_CELSIUS` | **−14** | `computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex` |
| Firelands ambient floor | `FIRELANDS_AMBIENT_TEMPERATURE_CELSIUS` | **62** | `definingWorldPlazaFirelandsBiomeConstants.ts` |
| Climate freeze threshold | `WATER_FROZEN_CLIMATE_TEMPERATURE_MAX` | **0.3** (noise) | `definingWorldPlazaWaterConstants.ts` |

## Sampling and smoothing

| Constant | Value | Effect |
| -------- | ----- | ------ |
| `NEIGHBOR_AVERAGING_RING` | **2** | 5×5 neighborhood mean |
| `SMOOTHING_RATE_PER_SECOND` | **3** | Player temp ease |

## Default entity resistance

```typescript
{
  heatResistance: 0,
  coldResistance: 0,
  heatWeakness: 0,
  coldWeakness: 0,
  heatComfortBonusCelsius: 0,
  coldComfortBonusCelsius: 0,
  isHeatImmune: false,
  isColdImmune: false,
}
```

Per-character overrides: `definingWorldPlazaMobTemperatureProfiles.ts`, character registry.

| Field | Cap | Gameplay |
| ----- | --- | -------- |
| `heatResistance` / `coldResistance` | 0..1 | Prevents that fraction of matching DoT |
| `heatWeakness` / `coldWeakness` | 0..1 | Adds that fraction as extra matching DoT |
| `heatComfortBonusCelsius` | ≥0 | Raises comfort high (°C) before heat DoT |
| `coldComfortBonusCelsius` | ≥0 | Lowers comfort low (°C) before cold DoT |
| Combined multiplier | — | `(1 − resist) × (1 + weakness)`; immunity → 0 |

Instant apply: `heat-resistance-buff`, `cold-resistance-buff`, `heat-weakness-debuff`, `cold-weakness-debuff` (+0.25 each).

Toggle comfort: `heat-tolerance-buff` / `cold-tolerance-buff` (**+15°C** each via `DEFINING_WORLD_PLAZA_TEMPERATURE_*_TOLERANCE_BONUS_CELSIUS`).

## Frost curve (computed)

| Effective °C | Speed multiplier |
| ------------ | ---------------- |
| ≥ 0 | **1.0** |
| −50 | **~0.82** |
| −136.575 | **~0.5** |
| −200 | **~0.27** |
| −273.15 | **0.0** |

Formula: `(celsius − (−273.15)) / 273.15`, clamped 0..1.

File: `computingWorldPlazaEnvironmentalFrostMovementSpeedMultiplier.ts`

## Pipeline files

| Layer | File | Edit when |
| ----- | ---- | --------- |
| Constants | `definingWorldPlazaTemperatureConstants.ts` | Comfort, DoT, source temps |
| Raw tile | `computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex.ts` | Ambient override logic |
| Neighbor blend | `averagingWorldPlazaNeighborEnvironmentalTemperatureAtTileIndex.ts` | Averaging rules |
| Damage | `computingWorldPlazaTemperatureDamagePerSecond.ts` | DoT math |
| Frost | `computingWorldPlazaEnvironmentalFrostMovementSpeedMultiplier.ts` | Speed curve |
| Entity frost | `resolvingWorldPlazaEnvironmentalFrostMovementSpeedMultiplierForEntity.ts` | Immunity gate |
| Hazard | `buildingWorldPlazaEnvironmentalHazardFromTemperatureCelsius.ts` | Lava kind threshold |
| Block levels | `resolvingWorldPlazaBlockEnvironmentalTemperatureLevel.ts` | Per-block heat |
| Area profiles | `definingWorldPlazaTemperatureAreaProfiles.ts` | Painted zones |
| Frozen water | `checkingWorldPlazaWaterIsFrozenAtTileIndex.ts` | Freeze/thaw |

## Tests

| File | Coverage |
| ---- | -------- |
| `computingWorldPlazaTemperatureDamagePerSecond.test.ts` | DoT at comfort edges |
| `averagingWorldPlazaNeighborEnvironmentalTemperatureAtTileIndex.test.ts` | Neighbor blend |

## Checklist: add a new heat source

1. [ ] Add constant or block `environmentalTemperature` in registry
2. [ ] Wire into `computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex` or block level resolver
3. [ ] If point source: add to `checkingWorldPlazaTileHasAssignableEnvironmentalTemperatureSourceAtTileIndex`
4. [ ] Update this catalog and [glossary.md](./glossary.md)
5. [ ] Cross-link [fire](../fire/) or [building](../building/) if placeable
