/**
 * Resolves stacked attack-speed multipliers from active health modifiers.
 *
 * @module components/world/health/domains/resolvingWorldPlazaEntityHealthAttackSpeedMultiplier
 */

import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/** Floor so stacked debuffs cannot freeze attack cadence forever. */
export const RESOLVING_WORLD_PLAZA_ENTITY_HEALTH_ATTACK_SPEED_MULTIPLIER_MIN = 0.05;

/**
 * Multiplies all active `attack_speed` modifiers on an entity health state.
 * Returns 1 when none are active. Higher = faster swings.
 */
export function resolvingWorldPlazaEntityHealthAttackSpeedMultiplier(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number
): number {
  let attackSpeedMultiplier = 1;

  for (const modifier of state.movementModifiers) {
    if (modifier.kind !== 'attack_speed') {
      continue;
    }

    if (modifier.expiresAtMs !== null && modifier.expiresAtMs <= nowMs) {
      continue;
    }

    attackSpeedMultiplier *= modifier.multiplier;
  }

  return Math.max(
    RESOLVING_WORLD_PLAZA_ENTITY_HEALTH_ATTACK_SPEED_MULTIPLIER_MIN,
    attackSpeedMultiplier
  );
}
