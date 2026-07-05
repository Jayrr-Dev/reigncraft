import { computingWorldPlazaEntityHealthDamage } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamage';
import type {
  DefiningWorldPlazaEntityDamageKind,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWorldPlazaEnvironmentalHazard } from '@/components/world/health/domains/definingWorldPlazaEnvironmentalHazardTypes';
import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_COLD_DAMAGE_PER_DEGREE_PER_SECOND,
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_HEAT_DAMAGE_PER_DEGREE_PER_SECOND,
  DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS,
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

/**
 * Builds an environmental hazard from an eased local temperature (°C).
 *
 * Used for player damage so heat, cold, and lava ramp with the smoothed
 * temperature readout instead of snapping on tile contact.
 */
export function buildingWorldPlazaEnvironmentalHazardFromTemperatureCelsius(
  celsius: number
): DefiningWorldPlazaEnvironmentalHazard | null {
  const temperatureSample =
    buildingWorldPlazaEnvironmentalTemperatureSample(celsius);

  if (
    !temperatureSample.exposureKind ||
    temperatureSample.damagePerSecond <= 0
  ) {
    return null;
  }

  const kind =
    celsius >= DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS - 1
      ? 'lava'
      : temperatureSample.exposureKind;

  return {
    kind,
    damagePerSecond: temperatureSample.damagePerSecond,
    temperatureCelsius: celsius,
  };
}

export type ApplyingWorldPlazaEnvironmentalTemperatureDamageForFrameParams = {
  state: DefiningWorldPlazaEntityHealthState;
  damageKind: DefiningWorldPlazaEntityDamageKind;
  damagePerSecond: number;
  deltaMs: number;
  nowMs: number;
};

/**
 * Applies eased environmental temperature damage for one frame.
 *
 * Bypasses post-hit invincibility frames and does not grant new ones so heat,
 * cold, and lava can tick continuously while temperature ramps.
 */
export function applyingWorldPlazaEnvironmentalTemperatureDamageForFrame({
  state,
  damageKind,
  damagePerSecond,
  deltaMs,
  nowMs,
}: ApplyingWorldPlazaEnvironmentalTemperatureDamageForFrameParams): DefiningWorldPlazaEntityHealthState {
  const frameDamage = damagePerSecond * (deltaMs / 1000);

  if (frameDamage <= 0) {
    return state;
  }

  return computingWorldPlazaEntityHealthDamage({
    state,
    rawAmount: frameDamage,
    kind: damageKind,
    nowMs,
    options: {
      bypassInvincibilityFrames: true,
      grantInvincibilityFrames: false,
      skipDamageRoll: true,
    },
  }).state;
}
