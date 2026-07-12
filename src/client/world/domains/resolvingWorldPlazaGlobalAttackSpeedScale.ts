/**
 * Applies the global attack-speed scale to player multipliers and wildlife intervals.
 *
 * @module components/world/domains/resolvingWorldPlazaGlobalAttackSpeedScale
 */

import {
  DEFINING_WORLD_PLAZA_GLOBAL_ATTACK_SPEED_SCALE,
  DEFINING_WORLD_PLAZA_GLOBAL_ATTACK_SPEED_SCALE_MIN,
} from '@/components/world/domains/definingWorldPlazaGlobalCombatAttackSpeedConstants';

/**
 * Normalized global scale used by all combat cadence paths.
 */
export function resolvingWorldPlazaGlobalAttackSpeedScale(): number {
  return Math.max(
    DEFINING_WORLD_PLAZA_GLOBAL_ATTACK_SPEED_SCALE_MIN,
    DEFINING_WORLD_PLAZA_GLOBAL_ATTACK_SPEED_SCALE
  );
}

/**
 * Scales a character-engine attack-speed multiplier (higher = faster).
 */
export function resolvingWorldPlazaScaledAttackSpeed(
  attackSpeed: number
): number {
  return attackSpeed * resolvingWorldPlazaGlobalAttackSpeedScale();
}

/**
 * Scales a wildlife (or any) attack interval in ms (higher = slower).
 * Half speed doubles the interval.
 */
export function resolvingWorldPlazaScaledAttackIntervalMs(
  attackIntervalMs: number
): number {
  return attackIntervalMs / resolvingWorldPlazaGlobalAttackSpeedScale();
}
