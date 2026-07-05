/**
 * Resolves movement/stamina modifiers driven by the current hunger tier.
 *
 * @module components/world/hunger/domains/resolvingWorldPlazaHungerMovementEffects
 */

import {
  DEFINING_WORLD_PLAZA_HUNGER_HUNGRY_JUMP_COST_MULTIPLIER,
  DEFINING_WORLD_PLAZA_HUNGER_HUNGRY_SPEED_MULTIPLIER,
  DEFINING_WORLD_PLAZA_HUNGER_PECKISH_JUMP_COST_MULTIPLIER,
  DEFINING_WORLD_PLAZA_HUNGER_PECKISH_STAMINA_DRAIN_MULTIPLIER,
  DEFINING_WORLD_PLAZA_HUNGER_STARVING_SPEED_MULTIPLIER,
  DEFINING_WORLD_PLAZA_HUNGER_WELL_FED_STAMINA_REGEN_MULTIPLIER,
  resolvingWorldPlazaHungerTier,
} from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';

/** Movement/stamina multipliers derived from the current hunger tier. */
export type ResolvingWorldPlazaHungerMovementEffects = {
  /** Walk speed multiplier (1 = normal). */
  speedMultiplier: number;
  /** Stamina drain multiplier while running (1 = normal). */
  staminaDrainMultiplier: number;
  /** Stamina regen multiplier while resting (1 = normal). */
  staminaRegenMultiplier: number;
  /** Jump stamina cost multiplier (1 = normal). */
  jumpCostMultiplier: number;
  /** True when sprinting is disabled outright. */
  isSprintDisabled: boolean;
  /** True when jumping is disabled outright. */
  isJumpDisabled: boolean;
  /** True when hunger is actively draining health (0-5% tier). */
  isHealthDraining: boolean;
};

/**
 * Resolves the movement/stamina tier effects for the given hunger ratio.
 *
 * Tiers (see plan): >=75% well fed bonus, 40-75% none, 20-40% peckish,
 * 5-20% hungry, 0-5% starving.
 *
 * @param hungerRatio - Current hunger as a 0..1 ratio.
 */
export function resolvingWorldPlazaHungerMovementEffects(
  hungerRatio: number
): ResolvingWorldPlazaHungerMovementEffects {
  const tier = resolvingWorldPlazaHungerTier(hungerRatio);

  switch (tier) {
    case 'well_fed':
      return {
        speedMultiplier: 1,
        staminaDrainMultiplier: 1,
        staminaRegenMultiplier:
          DEFINING_WORLD_PLAZA_HUNGER_WELL_FED_STAMINA_REGEN_MULTIPLIER,
        jumpCostMultiplier: 1,
        isSprintDisabled: false,
        isJumpDisabled: false,
        isHealthDraining: false,
      };
    case 'content':
      return {
        speedMultiplier: 1,
        staminaDrainMultiplier: 1,
        staminaRegenMultiplier: 1,
        jumpCostMultiplier: 1,
        isSprintDisabled: false,
        isJumpDisabled: false,
        isHealthDraining: false,
      };
    case 'peckish':
      return {
        speedMultiplier: 1,
        staminaDrainMultiplier:
          DEFINING_WORLD_PLAZA_HUNGER_PECKISH_STAMINA_DRAIN_MULTIPLIER,
        staminaRegenMultiplier: 1,
        jumpCostMultiplier:
          DEFINING_WORLD_PLAZA_HUNGER_PECKISH_JUMP_COST_MULTIPLIER,
        isSprintDisabled: false,
        isJumpDisabled: false,
        isHealthDraining: false,
      };
    case 'hungry':
      return {
        speedMultiplier: DEFINING_WORLD_PLAZA_HUNGER_HUNGRY_SPEED_MULTIPLIER,
        staminaDrainMultiplier: 1,
        staminaRegenMultiplier: 1,
        jumpCostMultiplier:
          DEFINING_WORLD_PLAZA_HUNGER_HUNGRY_JUMP_COST_MULTIPLIER,
        isSprintDisabled: true,
        isJumpDisabled: false,
        isHealthDraining: false,
      };
    case 'starving':
      return {
        speedMultiplier: DEFINING_WORLD_PLAZA_HUNGER_STARVING_SPEED_MULTIPLIER,
        staminaDrainMultiplier: 1,
        staminaRegenMultiplier: 1,
        jumpCostMultiplier: 1,
        isSprintDisabled: true,
        isJumpDisabled: true,
        isHealthDraining: true,
      };
  }
}
