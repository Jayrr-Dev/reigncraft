/**
 * Whether the active sleep effect allows wake-from-damage.
 *
 * @module components/world/health/domains/checkingWorldPlazaEntityHealthSleepCanWakeFromDamage
 */

import { resolvingWorldPlazaEntityHealthActiveSleepEffect } from '@/components/world/health/domains/checkingWorldPlazaEntityPlayerSleepIsActive';
import type { DefiningWorldPlazaEntityHealthSleepEffect } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/**
 * Returns false when the active sleep is deep sleep (`canWakeFromDamage === false`).
 * No active sleep effect → true (schedule sleep / awake callers decide separately).
 */
export function checkingWorldPlazaEntityHealthSleepCanWakeFromDamage(
  state: {
    sleepEffects: readonly DefiningWorldPlazaEntityHealthSleepEffect[];
  } | null,
  nowMs: number
): boolean {
  const activeSleep = resolvingWorldPlazaEntityHealthActiveSleepEffect(
    state,
    nowMs
  );

  if (activeSleep === null) {
    return true;
  }

  return activeSleep.canWakeFromDamage !== false;
}
