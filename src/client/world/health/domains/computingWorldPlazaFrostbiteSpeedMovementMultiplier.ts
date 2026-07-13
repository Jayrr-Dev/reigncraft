/**
 * Linear frostbite speed penalty from stack count.
 *
 * @module components/world/health/domains/computingWorldPlazaFrostbiteSpeedMovementMultiplier
 */

import {
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_SPEED_SLOW_FRACTION,
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_STACKS,
} from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteConstants';

/**
 * Speed multiplier from stacks: 1 at 0 stacks, 0.5 at 1000 (50% slower).
 */
export function computingWorldPlazaFrostbiteSpeedMovementMultiplier(
  stackCount: number
): number {
  if (stackCount <= 0) {
    return 1;
  }

  const clampedStacks = Math.min(
    DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_STACKS,
    stackCount
  );

  return (
    1 -
    DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_SPEED_SLOW_FRACTION *
      (clampedStacks / DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_STACKS)
  );
}

/** Player-facing HUD line for the linear speed slow at this stack count. */
export function formattingWorldPlazaFrostbiteSpeedSlowHudEffectLine(
  stackCount: number
): string | null {
  const slowPercent = Math.round(
    (1 - computingWorldPlazaFrostbiteSpeedMovementMultiplier(stackCount)) * 100
  );

  if (slowPercent <= 0) {
    return null;
  }

  return `${slowPercent}% slower walking`;
}
