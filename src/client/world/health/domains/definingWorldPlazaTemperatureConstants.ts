/**
 * Temperature comfort bands and damage scaling (canonical °C).
 *
 * @module components/world/health/domains/definingWorldPlazaTemperatureConstants
 */

import type { DefiningWorldPlazaEntityTemperatureResistance } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';

/** Default UI readout unit. */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_DISPLAY_UNIT = 'celsius' as const;

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

/** Extra ambient cooling applied at night (°C). */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_NIGHT_COOLING_CELSIUS = 8;

/** Lava tile local temperature (°C). */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS = 920;

/** Campfire standing-tile temperature (°C). */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_CAMPFIRE_CELSIUS = 72;

/** Frozen water tile temperature at night (°C). */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_FROZEN_WATER_CELSIUS = -14;

/**
 * Exponential smoothing rate (per second) for player local temperature.
 *
 * Frame-rate independent: each frame blends toward the sampled target so the
 * readout and environmental damage ease between tiles instead of snapping.
 */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_SMOOTHING_RATE_PER_SECOND = 3;

/** Default player temperature resistance. */
export const DEFINING_WORLD_PLAZA_ENTITY_TEMPERATURE_RESISTANCE_DEFAULT: DefiningWorldPlazaEntityTemperatureResistance =
  {
    heatResistance: 0,
    coldResistance: 0,
    isHeatImmune: false,
    isColdImmune: false,
  };
