/**
 * Maps local temperature (°C) to a 0..1 thermometer fill ratio.
 *
 * @module components/world/health/domains/computingWorldPlazaTemperatureIndicatorFillRatio
 */

import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MAX_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureIndicatorConstants';

/**
 * Converts Celsius into a clamped fill ratio for the temperature orb.
 *
 * @param temperatureCelsius - Local ambient temperature in °C
 */
export function computingWorldPlazaTemperatureIndicatorFillRatio(
  temperatureCelsius: number
): number {
  if (!Number.isFinite(temperatureCelsius)) {
    return 0;
  }

  const span =
    DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MAX_CELSIUS -
    DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS;

  if (span <= 0) {
    return 0;
  }

  const ratio =
    (temperatureCelsius -
      DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS) /
    span;

  return Math.min(1, Math.max(0, ratio));
}
