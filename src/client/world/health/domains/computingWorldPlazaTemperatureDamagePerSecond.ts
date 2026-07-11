import type { DefiningWorldPlazaEnvironmentalHazard } from '@/components/world/health/domains/definingWorldPlazaEnvironmentalHazardTypes';
import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_COLD_DAMAGE_PER_DEGREE_PER_SECOND,
  DEFINING_WORLD_PLAZA_TEMPERATURE_COLD_MAX_HEALTH_PERCENT_PER_DEGREE_PER_SECOND,
  DEFINING_WORLD_PLAZA_TEMPERATURE_HEAT_DAMAGE_PER_DEGREE_PER_SECOND,
  DEFINING_WORLD_PLAZA_TEMPERATURE_HEAT_MAX_HEALTH_PERCENT_PER_DEGREE_PER_SECOND,
  DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import type {
  DefiningWorldPlazaEntityTemperatureResistance,
  DefiningWorldPlazaEnvironmentalTemperatureSample,
  DefiningWorldPlazaTemperatureExposureKind,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';
import { resolvingWorldPlazaEntityTemperatureComfortBand } from '@/components/world/health/domains/resolvingWorldPlazaEntityTemperatureComfortBand';

export type ComputingWorldPlazaTemperatureDamagePerSecondResult = {
  exposureKind: DefiningWorldPlazaTemperatureExposureKind | null;
  damagePerSecond: number;
  maxHealthPercentPerSecond: number;
};

/**
 * Returns whether a temperature sample deals any environmental damage.
 */
export function checkingWorldPlazaEnvironmentalTemperatureSampleHasDamage(
  sample: Pick<
    DefiningWorldPlazaEnvironmentalTemperatureSample,
    'exposureKind' | 'damagePerSecond' | 'maxHealthPercentPerSecond'
  >
): boolean {
  return (
    sample.exposureKind !== null &&
    (sample.damagePerSecond > 0 || sample.maxHealthPercentPerSecond > 0)
  );
}

/**
 * Combines flat and max-health-percent DoT into total HP per second.
 */
export function computingWorldPlazaEnvironmentalTemperatureTotalDamagePerSecond(
  damagePerSecond: number,
  maxHealthPercentPerSecond: number,
  effectiveMaxHealth: number
): number {
  return damagePerSecond + effectiveMaxHealth * maxHealthPercentPerSecond;
}

/**
 * Maps an effective local temperature to heat or cold DoT.
 *
 * Higher heat or lower cold increases flat damage and max-health percent loss.
 * Optional resistance widens the comfort band via heat/cold tolerance bonuses.
 */
export function computingWorldPlazaTemperatureDamagePerSecond(
  celsius: number,
  resistance?: Pick<
    DefiningWorldPlazaEntityTemperatureResistance,
    'heatComfortBonusCelsius' | 'coldComfortBonusCelsius'
  > | null
): ComputingWorldPlazaTemperatureDamagePerSecondResult {
  const comfortBand =
    resolvingWorldPlazaEntityTemperatureComfortBand(resistance);
  const heatExcess = Math.max(0, celsius - comfortBand.comfortHighCelsius);
  const coldDeficit = Math.max(0, comfortBand.comfortLowCelsius - celsius);
  const heatDamage =
    heatExcess *
    DEFINING_WORLD_PLAZA_TEMPERATURE_HEAT_DAMAGE_PER_DEGREE_PER_SECOND;
  const heatPercent =
    heatExcess *
    DEFINING_WORLD_PLAZA_TEMPERATURE_HEAT_MAX_HEALTH_PERCENT_PER_DEGREE_PER_SECOND;
  const coldDamage =
    coldDeficit *
    DEFINING_WORLD_PLAZA_TEMPERATURE_COLD_DAMAGE_PER_DEGREE_PER_SECOND;
  const coldPercent =
    coldDeficit *
    DEFINING_WORLD_PLAZA_TEMPERATURE_COLD_MAX_HEALTH_PERCENT_PER_DEGREE_PER_SECOND;

  if (
    heatDamage <= 0 &&
    heatPercent <= 0 &&
    coldDamage <= 0 &&
    coldPercent <= 0
  ) {
    return {
      exposureKind: null,
      damagePerSecond: 0,
      maxHealthPercentPerSecond: 0,
    };
  }

  if (heatDamage + heatPercent >= coldDamage + coldPercent) {
    return {
      exposureKind: 'heat',
      damagePerSecond: heatDamage,
      maxHealthPercentPerSecond: heatPercent,
    };
  }

  return {
    exposureKind: 'cold',
    damagePerSecond: coldDamage,
    maxHealthPercentPerSecond: coldPercent,
  };
}

/**
 * Builds a resolved temperature sample with exposure kind and DoT.
 */
export function buildingWorldPlazaEnvironmentalTemperatureSample(
  celsius: number,
  resistance?: Pick<
    DefiningWorldPlazaEntityTemperatureResistance,
    'heatComfortBonusCelsius' | 'coldComfortBonusCelsius'
  > | null
): DefiningWorldPlazaEnvironmentalTemperatureSample {
  const damage = computingWorldPlazaTemperatureDamagePerSecond(
    celsius,
    resistance
  );

  return {
    celsius,
    exposureKind: damage.exposureKind,
    damagePerSecond: damage.damagePerSecond,
    maxHealthPercentPerSecond: damage.maxHealthPercentPerSecond,
  };
}

/**
 * Builds an environmental hazard from an eased local temperature (°C).
 *
 * Used for player damage so heat, cold, and lava ramp with the smoothed
 * temperature readout instead of snapping on tile contact.
 */
export function buildingWorldPlazaEnvironmentalHazardFromTemperatureCelsius(
  celsius: number,
  resistance?: Pick<
    DefiningWorldPlazaEntityTemperatureResistance,
    'heatComfortBonusCelsius' | 'coldComfortBonusCelsius'
  > | null
): DefiningWorldPlazaEnvironmentalHazard | null {
  const temperatureSample = buildingWorldPlazaEnvironmentalTemperatureSample(
    celsius,
    resistance
  );

  if (
    !checkingWorldPlazaEnvironmentalTemperatureSampleHasDamage(
      temperatureSample
    )
  ) {
    return null;
  }

  const kind =
    celsius >= DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS - 1
      ? 'lava'
      : temperatureSample.exposureKind;

  if (!kind) {
    return null;
  }

  return {
    kind,
    damagePerSecond: temperatureSample.damagePerSecond,
    maxHealthPercentPerSecond: temperatureSample.maxHealthPercentPerSecond,
    temperatureCelsius: celsius,
  };
}
