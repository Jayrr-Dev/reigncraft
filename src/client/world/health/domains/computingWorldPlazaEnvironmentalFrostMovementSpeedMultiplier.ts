import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_ABSOLUTE_ZERO_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_FROST_MOVEMENT_FULL_SPEED_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import type { DefiningWorldPlazaEntityTemperatureResistance } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';

const COMPUTING_WORLD_PLAZA_ENVIRONMENTAL_FROST_MOVEMENT_SPEED_RANGE_CELSIUS =
  DEFINING_WORLD_PLAZA_TEMPERATURE_FROST_MOVEMENT_FULL_SPEED_CELSIUS -
  DEFINING_WORLD_PLAZA_TEMPERATURE_ABSOLUTE_ZERO_CELSIUS;

/**
 * Maps local temperature to a walk/run speed multiplier.
 *
 * Above freezing, movement is unaffected. Between 0°C and absolute zero,
 * speed scales linearly down to zero.
 */
export function computingWorldPlazaEnvironmentalFrostMovementSpeedMultiplier(
  celsius: number | null
): number {
  if (celsius === null) {
    return 1;
  }

  if (
    celsius >=
    DEFINING_WORLD_PLAZA_TEMPERATURE_FROST_MOVEMENT_FULL_SPEED_CELSIUS
  ) {
    return 1;
  }

  const multiplier =
    (celsius - DEFINING_WORLD_PLAZA_TEMPERATURE_ABSOLUTE_ZERO_CELSIUS) /
    COMPUTING_WORLD_PLAZA_ENVIRONMENTAL_FROST_MOVEMENT_SPEED_RANGE_CELSIUS;

  return Math.max(0, Math.min(1, multiplier));
}

/**
 * Frost movement multiplier for any entity, respecting cold immunity.
 */
export function resolvingWorldPlazaEnvironmentalFrostMovementSpeedMultiplierForEntity({
  localTemperatureCelsius,
  temperatureResistance,
}: {
  localTemperatureCelsius: number | null;
  temperatureResistance: DefiningWorldPlazaEntityTemperatureResistance;
}): number {
  if (temperatureResistance.isColdImmune) {
    return 1;
  }

  return computingWorldPlazaEnvironmentalFrostMovementSpeedMultiplier(
    localTemperatureCelsius
  );
}
