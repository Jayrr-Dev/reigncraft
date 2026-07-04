import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_CLIMATE_MAX_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_CLIMATE_MIN_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';

/**
 * Maps procedural climate noise [0, 1] to ambient Celsius.
 */
export function convertingWorldPlazaClimateNormalizedToCelsius(
  normalizedTemperature: number
): number {
  const clamped = Math.min(1, Math.max(0, normalizedTemperature));

  return (
    DEFINING_WORLD_PLAZA_TEMPERATURE_CLIMATE_MIN_CELSIUS +
    clamped *
      (DEFINING_WORLD_PLAZA_TEMPERATURE_CLIMATE_MAX_CELSIUS -
        DEFINING_WORLD_PLAZA_TEMPERATURE_CLIMATE_MIN_CELSIUS)
  );
}
