import type {
  DefiningWorldPlazaEntityHealthDamageRollModifier,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { resolvingWorldPlazaEntityHealthDamageRollParams } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthDamageRollParams';
import {
  rollingWorldPlazaDamageEngine,
  type RollingWorldPlazaDamageEngineResult,
} from '@/components/world/health/domains/rollingWorldPlazaDamageEngine';

export type ComputingWorldPlazaEntityHealthRolledExpectedAmountParams = {
  state: DefiningWorldPlazaEntityHealthState;
  baseExpectedAmount: number;
  attackerModifiers?: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[];
  nowMs: number;
  random?: () => number;
};

/**
 * Rolls a beneficial amount (heal, shield, etc.) around an expected value using
 * the same statistical engine as direct damage hits.
 */
export function computingWorldPlazaEntityHealthRolledExpectedAmount({
  state,
  baseExpectedAmount,
  attackerModifiers = [],
  nowMs,
  random,
}: ComputingWorldPlazaEntityHealthRolledExpectedAmountParams): RollingWorldPlazaDamageEngineResult {
  const rollParams = resolvingWorldPlazaEntityHealthDamageRollParams({
    baseExpectedDamage: baseExpectedAmount,
    defenderModifiers: state.damageRollModifiers,
    attackerModifiers,
    nowMs,
  });

  return rollingWorldPlazaDamageEngine({
    expectedDamage: rollParams.expectedDamage,
    standardDeviation: rollParams.standardDeviation,
    luck: rollParams.luck,
    deviationBiasShift: rollParams.deviationBiasShift,
    rollMode: rollParams.isLockInActive
      ? 'lock_in'
      : rollParams.isChaoticActive
        ? 'chaotic'
        : 'normal',
    random,
  });
}
