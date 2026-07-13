/**
 * Linear frostbite stamina regen penalty from stack count.
 *
 * @module components/world/health/domains/computingWorldPlazaFrostbiteStaminaRegenMovementMultiplier
 */

import {
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_STACKS,
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_STAMINA_REGEN_SLOW_FRACTION,
} from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteConstants';

/**
 * Stamina regen multiplier from stacks: 1 at 0 stacks, 0.5 at 1000 (50% slower).
 */
export function computingWorldPlazaFrostbiteStaminaRegenMovementMultiplier(
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
    DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_STAMINA_REGEN_SLOW_FRACTION *
      (clampedStacks / DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_STACKS)
  );
}

/** Player-facing HUD line for the linear stamina regen slow at this stack count. */
export function formattingWorldPlazaFrostbiteStaminaRegenSlowHudEffectLine(
  stackCount: number
): string | null {
  const slowPercent = Math.round(
    (1 -
      computingWorldPlazaFrostbiteStaminaRegenMovementMultiplier(stackCount)) *
      100
  );

  if (slowPercent <= 0) {
    return null;
  }

  return `${slowPercent}% slower stamina regen`;
}
