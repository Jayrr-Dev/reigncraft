/**
 * Forces Dodged damage-roll samples to 0 damage when the test flag is on.
 *
 * @module components/world/health/domains/applyingWorldPlazaDamageRollDodgedAsZeroDamage
 */

import type { RollingWorldPlazaDamageEngineResult } from '@/components/world/health/domains/rollingWorldPlazaDamageEngine';

/**
 * When enabled, replaces rolled damage with 0 for `dodged` tiers.
 * Keeps tier / deviation so Dodged floats still resolve correctly.
 */
export function applyingWorldPlazaDamageRollDodgedAsZeroDamage(
  rollResult: RollingWorldPlazaDamageEngineResult,
  shouldZeroDodgedDamage: boolean
): RollingWorldPlazaDamageEngineResult {
  if (!shouldZeroDodgedDamage || rollResult.tier !== 'dodged') {
    return rollResult;
  }

  return {
    ...rollResult,
    rolledDamage: 0,
  };
}
