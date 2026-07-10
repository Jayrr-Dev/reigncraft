/**
 * Applies debug climate severity + ambient offset to a raw tile temperature.
 *
 * @module components/world/health/domains/applyingWorldPlazaTemperatureDebugOverride
 */

import { DEFINING_WORLD_PLAZA_TEMPERATURE_DEBUG_CLIMATE_MIDPOINT_CELSIUS } from '@/components/world/health/domains/definingWorldPlazaTemperatureDebugOverrideConstants';
import {
  gettingWorldPlazaTemperatureDebugAmbientOffsetCelsius,
  gettingWorldPlazaTemperatureDebugClimateSeverity,
} from '@/components/world/health/domains/managingWorldPlazaTemperatureDebugOverrideStore';

/**
 * Pulls climate ambient toward the midpoint by severity, then adds ambient offset.
 * Severity 1 / offset 0 leaves the value unchanged.
 */
export function applyingWorldPlazaTemperatureDebugOverrideToCelsius(
  celsius: number,
  options?: {
    ambientOffsetCelsius?: number;
    climateSeverity?: number;
    climateMidpointCelsius?: number;
  }
): number {
  const climateSeverity =
    options?.climateSeverity ??
    gettingWorldPlazaTemperatureDebugClimateSeverity();
  const ambientOffsetCelsius =
    options?.ambientOffsetCelsius ??
    gettingWorldPlazaTemperatureDebugAmbientOffsetCelsius();
  const climateMidpointCelsius =
    options?.climateMidpointCelsius ??
    DEFINING_WORLD_PLAZA_TEMPERATURE_DEBUG_CLIMATE_MIDPOINT_CELSIUS;

  if (climateSeverity === 1 && ambientOffsetCelsius === 0) {
    return celsius;
  }

  const towardMid =
    climateMidpointCelsius +
    (celsius - climateMidpointCelsius) * climateSeverity;

  return towardMid + ambientOffsetCelsius;
}
