import { computingWorldPlazaEntityHealthDamage } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamage';
import { applyingWorldPlazaEntitySleepWakeFromDamage } from '@/components/world/health/domains/applyingWorldPlazaEntitySleepWakeFromDamage';
import type {
  DefiningWorldPlazaEntityHealthAppliedDamage,
  DefiningWorldPlazaEntityHealthDamageOptions,
  DefiningWorldPlazaEntityHealthState,
  DefiningWorldPlazaEntityDamageKind,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

export type ComputingWorldPlazaEntityHealthDamageWithSleepWakeParams = {
  state: DefiningWorldPlazaEntityHealthState;
  rawAmount: number;
  kind: DefiningWorldPlazaEntityDamageKind;
  nowMs: number;
  options?: DefiningWorldPlazaEntityHealthDamageOptions;
};

export type ComputingWorldPlazaEntityHealthDamageWithSleepWakeResult = {
  state: DefiningWorldPlazaEntityHealthState;
  appliedDamage: DefiningWorldPlazaEntityHealthAppliedDamage;
  wasAsleep: boolean;
  wakeBonusDamage: number;
};

/**
 * Applies incoming damage, waking the player from sleep and adding wake bonus damage.
 */
export function computingWorldPlazaEntityHealthDamageWithSleepWake({
  state,
  rawAmount,
  kind,
  nowMs,
  options,
}: ComputingWorldPlazaEntityHealthDamageWithSleepWakeParams): ComputingWorldPlazaEntityHealthDamageWithSleepWakeResult {
  const sleepWake = applyingWorldPlazaEntitySleepWakeFromDamage({
    state,
    nowMs,
    rawAmount,
  });

  const damageResult = computingWorldPlazaEntityHealthDamage({
    state: sleepWake.state,
    rawAmount: rawAmount + sleepWake.wakeBonusDamage,
    kind,
    nowMs,
    options,
  });

  return {
    state: damageResult.state,
    appliedDamage: damageResult.appliedDamage,
    wasAsleep: sleepWake.wasAsleep,
    wakeBonusDamage: sleepWake.wakeBonusDamage,
  };
}
