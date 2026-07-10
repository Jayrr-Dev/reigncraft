/**
 * Settings preference for plaza temperature HUD readout (°C vs °F).
 *
 * Simulation stays in Celsius. This only changes display formatting.
 *
 * @module components/world/health/domains/definingWorldPlazaTemperatureDisplayUnitPreferenceConstants
 */

import { DEFINING_WORLD_PLAZA_TEMPERATURE_DISPLAY_UNIT } from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import type { DefiningWorldPlazaTemperatureDisplayUnit } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';

/** localStorage key for the temperature display-unit preference. */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_DISPLAY_UNIT_STORAGE_KEY =
  'world-plaza-temperature-display-unit' as const;

/** Default HUD readout when no preference is saved. */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_DISPLAY_UNIT_DEFAULT: DefiningWorldPlazaTemperatureDisplayUnit =
  DEFINING_WORLD_PLAZA_TEMPERATURE_DISPLAY_UNIT;

/** Settings row label in the action-bar mixer panel. */
export const LABELING_WORLD_PLAZA_TEMPERATURE_DISPLAY_FAHRENHEIT_TOGGLE =
  'Fahrenheit (°F)' as const;
