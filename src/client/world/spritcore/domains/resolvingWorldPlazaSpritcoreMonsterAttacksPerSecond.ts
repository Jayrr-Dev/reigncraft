/**
 * Resolves wildlife attack cadence into nominal attacks per second.
 *
 * @module components/world/spritcore/domains/resolvingWorldPlazaSpritcoreMonsterAttacksPerSecond
 */

import { resolvingWorldPlazaScaledAttackIntervalMs } from '@/components/world/domains/resolvingWorldPlazaGlobalAttackSpeedScale';

/**
 * Converts catalog attack interval ms into runtime APS using the global scale.
 */
export function resolvingWorldPlazaSpritcoreMonsterAttacksPerSecond(
  attackIntervalMs: number
): number {
  const scaledIntervalMs =
    resolvingWorldPlazaScaledAttackIntervalMs(attackIntervalMs);

  if (scaledIntervalMs <= 0) {
    return 0;
  }

  return 1000 / scaledIntervalMs;
}
