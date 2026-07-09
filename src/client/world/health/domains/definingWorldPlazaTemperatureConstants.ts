/**
 * Temperature comfort bands and damage scaling (canonical °C).
 *
 * @module components/world/health/domains/definingWorldPlazaTemperatureConstants
 */

import type { DefiningWorldPlazaEntityTemperatureResistance } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';

/** Default UI readout unit. */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_DISPLAY_UNIT = 'celsius' as const;

/** Absolute zero (°C). Movement stops entirely at this temperature. */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_ABSOLUTE_ZERO_CELSIUS = -273.15;

/** At or above this temperature, frost does not slow movement (°C). */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_FROST_MOVEMENT_FULL_SPEED_CELSIUS = 0;

/** Climate noise 0 maps to this ambient temperature (°C). */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_CLIMATE_MIN_CELSIUS = -25;

/** Climate noise 1 maps to this ambient temperature (°C). */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_CLIMATE_MAX_CELSIUS = 48;

/** No heat damage at or below this comfort high (°C). */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS = 50;

/** No cold damage at or above this comfort low (°C). */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS = -10;

/** Heat DoT per degree above {@link DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS}. */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_HEAT_DAMAGE_PER_DEGREE_PER_SECOND = 0.35;

/** Cold DoT per degree below {@link DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS}. */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_COLD_DAMAGE_PER_DEGREE_PER_SECOND = 0.3;

/**
 * Max-health percent DoT per degree above comfort high, per second.
 * 0.00005 → 5% max HP/s at 1000°C excess (e.g. full lava).
 */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_HEAT_MAX_HEALTH_PERCENT_PER_DEGREE_PER_SECOND = 0.00005;

/**
 * Max-health percent DoT per degree below comfort low, per second.
 * 0.00004 → 4% max HP/s at 1000°C deficit.
 */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_COLD_MAX_HEALTH_PERCENT_PER_DEGREE_PER_SECOND = 0.00004;

/** Extra ambient cooling applied at night (°C). */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_NIGHT_COOLING_CELSIUS = 8;

/** Lava tile local temperature (°C). */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS = 920;

/** Campfire standing-tile temperature (°C). */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_CAMPFIRE_CELSIUS = 72;

/** Frozen water tile temperature at night (°C). */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_FROZEN_WATER_CELSIUS = -14;

/** Climate-frozen surface water melts when effective local temperature reaches this (°C). */
export const DEFINING_WORLD_PLAZA_WATER_MELTING_POINT_CELSIUS = 0;

/**
 * Exponential smoothing rate (per second) for player local temperature.
 *
 * Frame-rate independent: each frame blends toward the sampled target so the
 * readout and environmental damage ease between tiles instead of snapping.
 */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_SMOOTHING_RATE_PER_SECOND = 3;

/**
 * Tile radius used when averaging raw local temperature from neighboring tiles.
 *
 * Lava, campfires, and painted heat zones keep their source temperature; other
 * tiles blend toward the average of the surrounding neighborhood (ring 2 → 5×5).
 */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_NEIGHBOR_AVERAGING_RING = 2;

/** Default heat-tolerance buff: raise comfort high by this many °C. */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_HEAT_TOLERANCE_BONUS_CELSIUS = 15;

/** Default cold-tolerance buff: lower comfort low by this many °C. */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_COLD_TOLERANCE_BONUS_CELSIUS = 15;

/** Default player temperature resistance and weakness. */
export const DEFINING_WORLD_PLAZA_ENTITY_TEMPERATURE_RESISTANCE_DEFAULT: DefiningWorldPlazaEntityTemperatureResistance =
  {
    heatResistance: 0,
    coldResistance: 0,
    heatWeakness: 0,
    coldWeakness: 0,
    heatComfortBonusCelsius: 0,
    coldComfortBonusCelsius: 0,
    isHeatImmune: false,
    isColdImmune: false,
  };
