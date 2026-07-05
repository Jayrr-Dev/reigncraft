import { computingWorldPlazaEntityHealthEffectiveMax } from '@/components/world/health/domains/computingWorldPlazaEntityHealthEffectiveMax';
import { computingWorldPlazaEntityHealthRolledExpectedAmount } from '@/components/world/health/domains/computingWorldPlazaEntityHealthRolledExpectedAmount';
import type { DefiningWorldPlazaEntityBleedSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import { resolvingWorldPlazaEntityBleedSeverityDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import type {
  DefiningWorldPlazaEntityHealthDamageRollModifier,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

export type ComputingWorldPlazaEntityBleedPoolTotalDamageParams = {
  state: DefiningWorldPlazaEntityHealthState;
  severity: DefiningWorldPlazaEntityBleedSeverity;
  /** Flat hard-damage expected value from the hit that caused the bleed. */
  flatExpectedDamage: number;
  attackerModifiers?: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[];
  nowMs: number;
  random?: () => number;
};

export type ComputingWorldPlazaEntityBleedPoolTotalDamageResult = {
  totalBleedDamage: number;
  flatRolledDamage: number;
  percentRolledDamage: number;
  percentExpectedDamage: number;
};

/**
 * Bleed pool = rolled flat hard damage + rolled percent-of-max-health damage.
 */
export function computingWorldPlazaEntityBleedPoolTotalDamage({
  state,
  severity,
  flatExpectedDamage,
  attackerModifiers = [],
  nowMs,
  random,
}: ComputingWorldPlazaEntityBleedPoolTotalDamageParams): ComputingWorldPlazaEntityBleedPoolTotalDamageResult {
  const descriptor = resolvingWorldPlazaEntityBleedSeverityDescriptor(severity);
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

  const flatRolledDamage = flatRoll.rolledDamage;
  const percentRolledDamage = percentRoll.rolledDamage;

  return {
    totalBleedDamage: flatRolledDamage + percentRolledDamage,
    flatRolledDamage,
    percentRolledDamage,
    percentExpectedDamage,
  };
}
