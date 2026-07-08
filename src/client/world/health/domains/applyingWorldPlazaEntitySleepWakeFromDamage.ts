import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { resolvingWorldPlazaEntityHealthActiveSleepEffect } from '@/components/world/health/domains/checkingWorldPlazaEntityPlayerSleepIsActive';
import { removingWorldPlazaEntityHealthSleepEffect } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';

export type ApplyingWorldPlazaEntitySleepWakeFromDamageResult = {
  state: DefiningWorldPlazaEntityHealthState;
  wakeBonusDamage: number;
  wasAsleep: boolean;
};

/**
 * Adds wake bonus damage when asleep and removes the sleep effect after a damaging hit.
 */
export function applyingWorldPlazaEntitySleepWakeFromDamage({
  state,
  nowMs,
  rawAmount,
}: {
  state: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
  rawAmount: number;
}): ApplyingWorldPlazaEntitySleepWakeFromDamageResult {
  const activeSleep = resolvingWorldPlazaEntityHealthActiveSleepEffect(
    state,
    nowMs
  );

  if (!activeSleep || rawAmount <= 0) {
    return {
      state,
      wakeBonusDamage: 0,
      wasAsleep: false,
    };
  }

  return {
    state: removingWorldPlazaEntityHealthSleepEffect(state, activeSleep.id),
    wakeBonusDamage: activeSleep.wakeBonusDamage,
    wasAsleep: true,
  };
}
