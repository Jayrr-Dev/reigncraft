import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_COLD_DAMAGE_PER_DEGREE_PER_SECOND,
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_HEAT_DAMAGE_PER_DEGREE_PER_SECOND,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import type {
  DefiningWorldPlazaEnvironmentalTemperatureSample,
  DefiningWorldPlazaTemperatureExposureKind,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';

export type ComputingWorldPlazaTemperatureDamagePerSecondResult = {
  exposureKind: DefiningWorldPlazaTemperatureExposureKind | null;
  damagePerSecond: number;
};

/**
 * Maps an effective local temperature to heat or cold DoT.
 *
 * Higher heat or lower cold increases damage per second.
 */
export function computingWorldPlazaTemperatureDamagePerSecond(
  celsius: number
): ComputingWorldPlazaTemperatureDamagePerSecondResult {
  const heatExcess = Math.max(
    0,
    celsius - DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS
  );
  const coldDeficit = Math.max(
    0,
    DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS - celsius
  );
  const heatDamage =
    heatExcess *
    DEFINING_WORLD_PLAZA_TEMPERATURE_HEAT_DAMAGE_PER_DEGREE_PER_SECOND;
  const coldDamage =
    coldDeficit *
    DEFINING_WORLD_PLAZA_TEMPERATURE_COLD_DAMAGE_PER_DEGREE_PER_SECOND;

  if (heatDamage <= 0 && coldDamage <= 0) {
    return { exposureKind: null, damagePerSecond: 0 };
  }

  if (heatDamage >= coldDamage) {
    return { exposureKind: 'heat', damagePerSecond: heatDamage };
  }

  return { exposureKind: 'cold', damagePerSecond: coldDamage };
}

/**
 * Builds a resolved temperature sample with exposure kind and DoT.
 */
export function buildingWorldPlazaEnvironmentalTemperatureSample(
  celsius: number
): DefiningWorldPlazaEnvironmentalTemperatureSample {
  const damage = computingWorldPlazaTemperatureDamagePerSecond(celsius);

  return {
    celsius,
    exposureKind: damage.exposureKind,
    damagePerSecond: damage.damagePerSecond,
  };
}
