import { resolvingWorldPlazaEntityHealthActiveSleepEffect } from '@/components/world/health/domains/checkingWorldPlazaEntityPlayerSleepIsActive';
import type {
  DefiningWorldPlazaEntityDamageKind,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { removingWorldPlazaEntityHealthSleepEffect } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';

/** Only physical hits can wake normal (non-deep) sleep. */
const APPLYING_WORLD_PLAZA_ENTITY_SLEEP_WAKE_DAMAGE_KIND: DefiningWorldPlazaEntityDamageKind =
  'physical';

export type ApplyingWorldPlazaEntitySleepWakeFromDamageResult = {
  state: DefiningWorldPlazaEntityHealthState;
  wakeBonusDamage: number;
  wasAsleep: boolean;
};

/**
 * Wakes from normal sleep on physical damage and adds wake bonus damage.
 * Non-physical damage (DoT, cold, fall, etc.) does not wake.
 * Deep sleep (`canWakeFromDamage: false`) never wakes from damage.
 */
export function applyingWorldPlazaEntitySleepWakeFromDamage({
  state,
  nowMs,
  rawAmount,
  kind,
}: {
  state: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
  rawAmount: number;
  kind: DefiningWorldPlazaEntityDamageKind;
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

  if (activeSleep.canWakeFromDamage === false) {
    return {
      state,
      wakeBonusDamage: 0,
      wasAsleep: true,
    };
  }

  if (kind !== APPLYING_WORLD_PLAZA_ENTITY_SLEEP_WAKE_DAMAGE_KIND) {
    return {
      state,
      wakeBonusDamage: 0,
      wasAsleep: true,
    };
  }

  return {
    state: removingWorldPlazaEntityHealthSleepEffect(state, activeSleep.id),
    wakeBonusDamage: activeSleep.wakeBonusDamage,
    wasAsleep: true,
  };
}
