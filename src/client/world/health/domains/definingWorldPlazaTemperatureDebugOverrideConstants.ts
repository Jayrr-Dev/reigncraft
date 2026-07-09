/**
 * Tunables for the environmental temperature debug override.
 *
 * @module components/world/health/domains/definingWorldPlazaTemperatureDebugOverrideConstants
 */

import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_CLIMATE_MAX_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_CLIMATE_MIN_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';

/** Midpoint of the climate °C range (mild target when severity < 1). */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_DEBUG_CLIMATE_MIDPOINT_CELSIUS =
  (DEFINING_WORLD_PLAZA_TEMPERATURE_CLIMATE_MIN_CELSIUS +
    DEFINING_WORLD_PLAZA_TEMPERATURE_CLIMATE_MAX_CELSIUS) /
  2;

/** Preset ambient offsets (°C) for the Health debug panel. */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_DEBUG_AMBIENT_OFFSET_PRESETS_CELSIUS =
  [-40, -20, -10, 0, 10, 20, 40] as const;

/** Preset climate severity multipliers (1 = live, 0 = all climate at midpoint). */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_DEBUG_CLIMATE_SEVERITY_PRESETS = [
  1, 0.5, 0.25, 0,
] as const;

/** Clamp for ambient offset (°C). */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_DEBUG_AMBIENT_OFFSET_MIN_CELSIUS =
  -80;
export const DEFINING_WORLD_PLAZA_TEMPERATURE_DEBUG_AMBIENT_OFFSET_MAX_CELSIUS =
  80;
