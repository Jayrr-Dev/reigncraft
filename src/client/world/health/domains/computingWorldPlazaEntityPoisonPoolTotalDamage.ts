import { computingWorldPlazaEntityHealthEffectiveMax } from '@/components/world/health/domains/computingWorldPlazaEntityHealthEffectiveMax';
import { computingWorldPlazaEntityHealthRolledExpectedAmount } from '@/components/world/health/domains/computingWorldPlazaEntityHealthRolledExpectedAmount';
import type { DefiningWorldPlazaEntityPoisonPotency } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';
import { resolvingWorldPlazaEntityPoisonPotencyDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';
import type {
  DefiningWorldPlazaEntityHealthDamageRollModifier,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

export type ComputingWorldPlazaEntityPoisonPoolTotalDamageParams = {
  state: DefiningWorldPlazaEntityHealthState;
  potency: DefiningWorldPlazaEntityPoisonPotency;
  flatExpectedDamage: number;
  attackerModifiers?: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[];
  nowMs: number;
  random?: () => number;
};

export type ComputingWorldPlazaEntityPoisonPoolTotalDamageResult = {
  totalPoisonDamage: number;
  flatRolledDamage: number;
  percentRolledDamage: number;
  percentExpectedDamage: number;
};

/**
 * Poison pool = rolled flat hard damage + rolled percent-of-max-health damage.
 */
export function computingWorldPlazaEntityPoisonPoolTotalDamage({
  state,
  potency,
  flatExpectedDamage,
  attackerModifiers = [],
  nowMs,
  random,
}: ComputingWorldPlazaEntityPoisonPoolTotalDamageParams): ComputingWorldPlazaEntityPoisonPoolTotalDamageResult {
  const descriptor = resolvingWorldPlazaEntityPoisonPotencyDescriptor(potency);
  const effectiveMaxHealth = computingWorldPlazaEntityHealthEffectiveMax(
    state,
    nowMs
  );
  const percentExpectedDamage =
    effectiveMaxHealth * descriptor.healthPercentExpected;

  const flatRoll = computingWorldPlazaEntityHealthRolledExpectedAmount({
    state,
    baseExpectedAmount: flatExpectedDamage,
    attackerModifiers,
    nowMs,
    random,
  });
  const percentRoll = computingWorldPlazaEntityHealthRolledExpectedAmount({
    state,
    baseExpectedAmount: percentExpectedDamage,
    attackerModifiers,
    nowMs,
    random,
  });

  return {
    totalPoisonDamage: flatRoll.rolledDamage + percentRoll.rolledDamage,
    flatRolledDamage: flatRoll.rolledDamage,
    percentRolledDamage: percentRoll.rolledDamage,
    percentExpectedDamage,
  };
}
