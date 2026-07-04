import { classifyingWorldPlazaDamageOutcomeTierFromRegistry } from '@/components/world/health/domains/definingWorldPlazaDamageOutcomeTierRegistry';
import type { DefiningWorldPlazaDamageOutcomeTier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/** Default standard deviation as a fraction of expected damage. */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_BASE_SD_RATIO = 0.2;

/** Minimum standard deviation so tiny hits still produce meaningful spread. */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_MIN_STANDARD_DEVIATION = 1;

/** Mean correction factor for skew-normal samples: delta * sqrt(2/pi). */
const ROLLING_WORLD_PLAZA_DAMAGE_ENGINE_SKEW_MEAN_FACTOR = Math.sqrt(
  2 / Math.PI
);

export type RollingWorldPlazaDamageRollMode = 'normal' | 'lock_in' | 'chaotic';

export type RollingWorldPlazaDamageEngineParams = {
  expectedDamage: number;
  standardDeviation: number;
  /** Luck skew in [-1, 1]; positive skews rolls toward high tiers. */
  luck?: number;
  /**
   * Shifts the sampled deviation score in SD units before computing damage.
   * Negative values push toward blocked/dodged; positive toward critical.
   */
  deviationBiasShift?: number;
  rollMode?: RollingWorldPlazaDamageRollMode;
  /** Dev/tests: skip RNG and use this deviation score directly. */
  forcedDeviationScore?: number;
  /** Injectable RNG for tests; defaults to Math.random. */
  random?: () => number;
};

export type RollingWorldPlazaDamageEngineResult = {
  rolledDamage: number;
  deviationScore: number;
  tier: DefiningWorldPlazaDamageOutcomeTier;
  expectedDamage: number;
  standardDeviation: number;
  rollMode: RollingWorldPlazaDamageRollMode;
};

/**
 * Classifies a damage roll by how many standard deviations it sits from expected.
 */
export function classifyingWorldPlazaDamageOutcomeTier(
  deviationScore: number
): DefiningWorldPlazaDamageOutcomeTier {
  return classifyingWorldPlazaDamageOutcomeTierFromRegistry(deviationScore);
}

function samplingWorldPlazaStandardNormalPair(random: () => number): {
  z0: number;
  z1: number;
} {
  let u0 = 0;
  let u1 = 0;

  while (u0 === 0) {
    u0 = random();
  }

  while (u1 === 0) {
    u1 = random();
  }

  const magnitude = Math.sqrt(-2 * Math.log(u0));
  const angle = 2 * Math.PI * u1;

  return {
    z0: magnitude * Math.cos(angle),
    z1: magnitude * Math.sin(angle),
  };
}

function clampingWorldPlazaDamageLuck(luck: number): number {
  return Math.min(1, Math.max(-1, luck));
}

function samplingWorldPlazaSkewNormalZ(
  luck: number,
  random: () => number
): number {
  const delta = clampingWorldPlazaDamageLuck(luck);

  if (delta === 0) {
    return samplingWorldPlazaStandardNormalPair(random).z0;
  }

  const { z0, z1 } = samplingWorldPlazaStandardNormalPair(random);
  const deltaScale = Math.sqrt(Math.max(0, 1 - delta * delta));

  return delta * Math.abs(z0) + deltaScale * z1;
}

/**
 * Samples a deviation score that favours extreme high/low tiers over normal.
 * High buckets can rarely spike far beyond the usual chaotic band.
 */
function samplingWorldPlazaChaoticDeviationZ(random: () => number): number {
  const bucket = random();

  if (bucket < 0.4) {
    const coreDeviation = 1.2 + random() * 2.3;

    if (random() < 0.01) {
      const tailZ = Math.abs(samplingWorldPlazaStandardNormalPair(random).z0);
      return coreDeviation + tailZ;
    }

    return coreDeviation;
  }

  if (bucket < 0.8) {
    const coreDeviation = -(1.2 + random() * 2.3);

    if (random() < 0.01) {
      const tailZ = Math.abs(samplingWorldPlazaStandardNormalPair(random).z0);
      return coreDeviation - tailZ;
    }

    return coreDeviation;
  }

  const sign = random() < 0.5 ? -1 : 1;

  return sign * (0.25 + random() * 0.65);
}

/**
 * Rolls damage around an expected value using a (optionally skewed) normal
 * distribution. High rolls are unbounded above expected (vanishing tail
 * probability); only the lower bound is clamped at zero.
 */
export function rollingWorldPlazaDamageEngine({
  expectedDamage,
  standardDeviation,
  luck = 0,
  deviationBiasShift = 0,
  rollMode = 'normal',
  forcedDeviationScore,
  random = Math.random,
}: RollingWorldPlazaDamageEngineParams): RollingWorldPlazaDamageEngineResult {
  const clampedExpected = Math.max(0, expectedDamage);
  const clampedStandardDeviation = Math.max(
    DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_MIN_STANDARD_DEVIATION,
    standardDeviation
  );

  if (clampedExpected <= 0) {
    return {
      rolledDamage: 0,
      deviationScore: 0,
      tier: 'normal',
      expectedDamage: 0,
      standardDeviation: clampedStandardDeviation,
      rollMode,
    };
  }

  if (rollMode === 'lock_in') {
    return {
      rolledDamage: clampedExpected,
      deviationScore: 0,
      tier: 'true_strike',
      expectedDamage: clampedExpected,
      standardDeviation: clampedStandardDeviation,
      rollMode: 'lock_in',
    };
  }

  const clampedLuck = clampingWorldPlazaDamageLuck(luck);
  const sampledDeviationScore =
    forcedDeviationScore !== undefined
      ? forcedDeviationScore
      : rollMode === 'chaotic'
        ? samplingWorldPlazaChaoticDeviationZ(random)
        : (() => {
            const skewZ = samplingWorldPlazaSkewNormalZ(clampedLuck, random);
            const meanCorrection =
              clampedLuck * ROLLING_WORLD_PLAZA_DAMAGE_ENGINE_SKEW_MEAN_FACTOR;

            return skewZ - meanCorrection;
          })();

  const deviationScore = sampledDeviationScore + deviationBiasShift;
  const unclampedRoll =
    clampedExpected + deviationScore * clampedStandardDeviation;
  const rolledDamage = Math.max(0, unclampedRoll);
  const finalDeviationScore =
    (rolledDamage - clampedExpected) / clampedStandardDeviation;

  return {
    rolledDamage,
    deviationScore: finalDeviationScore,
    tier: classifyingWorldPlazaDamageOutcomeTier(finalDeviationScore),
    expectedDamage: clampedExpected,
    standardDeviation: clampedStandardDeviation,
    rollMode,
  };
}
