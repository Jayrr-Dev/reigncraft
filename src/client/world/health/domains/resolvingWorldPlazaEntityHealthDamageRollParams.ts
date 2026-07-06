import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_TIER_BIAS_SD_SHIFT } from '@/components/world/health/domains/definingWorldPlazaEntityHealthDamageRollPresets';
import type { DefiningWorldPlazaEntityHealthDamageRollModifier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { resolvingWorldPlazaEntityHealthDamageRollForcedDeviationScoreFromModifiers } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthDamageRollForcedTier';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_BASE_SD_RATIO,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_MIN_STANDARD_DEVIATION,
} from '@/components/world/health/domains/rollingWorldPlazaDamageEngine';

export type ResolvingWorldPlazaEntityHealthDamageRollParamsResult = {
  expectedDamage: number;
  standardDeviation: number;
  luck: number;
  deviationBiasShift: number;
  expectedMultiplier: number;
  standardDeviationMultiplier: number;
  luckTotal: number;
  blockBiasTotal: number;
  dodgeBiasTotal: number;
  criticalBiasTotal: number;
  isLockInActive: boolean;
  isChaoticActive: boolean;
  forcedDeviationScore: number | null;
};

function filteringWorldPlazaActiveDamageRollModifiers(
  modifiers: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[],
  nowMs: number
): DefiningWorldPlazaEntityHealthDamageRollModifier[] {
  return modifiers.filter(
    (modifier) => modifier.expiresAtMs === null || modifier.expiresAtMs > nowMs
  );
}

function summingWorldPlazaDamageRollModifierValues(
  modifiers: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[],
  kind: DefiningWorldPlazaEntityHealthDamageRollModifier['kind']
): number {
  return modifiers
    .filter((modifier) => modifier.kind === kind)
    .reduce((sum, modifier) => sum + modifier.value, 0);
}

function resolvingWorldPlazaMergedDamageRollModifiers({
  defenderModifiers,
  attackerModifiers,
  nowMs,
}: {
  defenderModifiers: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[];
  attackerModifiers: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[];
  nowMs: number;
}): DefiningWorldPlazaEntityHealthDamageRollModifier[] {
  return [
    ...filteringWorldPlazaActiveDamageRollModifiers(defenderModifiers, nowMs),
    ...filteringWorldPlazaActiveDamageRollModifiers(attackerModifiers, nowMs),
  ];
}

/**
 * Resolves effective expected damage, standard deviation, luck skew, tier
 * bias, lock-in, and chaotic roll mode from defender + attacker modifiers.
 */
export function resolvingWorldPlazaEntityHealthDamageRollParams({
  baseExpectedDamage,
  defenderModifiers,
  attackerModifiers = [],
  nowMs,
}: {
  baseExpectedDamage: number;
  defenderModifiers: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[];
  attackerModifiers?: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[];
  nowMs: number;
}): ResolvingWorldPlazaEntityHealthDamageRollParamsResult {
  const activeModifiers = resolvingWorldPlazaMergedDamageRollModifiers({
    defenderModifiers,
    attackerModifiers,
    nowMs,
  });

  const expectedMultiplier = activeModifiers
    .filter((modifier) => modifier.kind === 'expected')
    .reduce((product, modifier) => product * modifier.value, 1);

  const varianceMultiplier = activeModifiers
    .filter(
      (modifier) =>
        modifier.kind === 'variance' || modifier.kind === 'stability'
    )
    .reduce((product, modifier) => product * modifier.value, 1);

  const luckTotal = summingWorldPlazaDamageRollModifierValues(
    activeModifiers,
    'luck'
  );
  const blockBiasTotal = summingWorldPlazaDamageRollModifierValues(
    activeModifiers,
    'block_bias'
  );
  const dodgeBiasTotal = summingWorldPlazaDamageRollModifierValues(
    activeModifiers,
    'dodge_bias'
  );
  const criticalBiasTotal = summingWorldPlazaDamageRollModifierValues(
    activeModifiers,
    'critical_bias'
  );
  const lockInTotal = summingWorldPlazaDamageRollModifierValues(
    activeModifiers,
    'lock_in'
  );
  const chaoticTotal = summingWorldPlazaDamageRollModifierValues(
    activeModifiers,
    'chaotic'
  );

  const tierBiasShift =
    (criticalBiasTotal - blockBiasTotal - dodgeBiasTotal) *
    DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_TIER_BIAS_SD_SHIFT;
  const forcedDeviationScore =
    resolvingWorldPlazaEntityHealthDamageRollForcedDeviationScoreFromModifiers(
      activeModifiers
    );

  const expectedDamage = Math.max(0, baseExpectedDamage * expectedMultiplier);
  const baseStandardDeviation = Math.max(
    expectedDamage *
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_BASE_SD_RATIO,
    DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_MIN_STANDARD_DEVIATION
  );
  const standardDeviation = baseStandardDeviation * varianceMultiplier;
  const luck = Math.min(1, Math.max(-1, luckTotal));

  return {
    expectedDamage,
    standardDeviation,
    luck,
    deviationBiasShift: tierBiasShift,
    expectedMultiplier,
    standardDeviationMultiplier: varianceMultiplier,
    luckTotal: luck,
    blockBiasTotal,
    dodgeBiasTotal,
    criticalBiasTotal,
    isLockInActive: lockInTotal > 0,
    isChaoticActive: chaoticTotal > 0,
    forcedDeviationScore,
  };
}
