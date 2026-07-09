import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

export type ResolvingWorldPlazaEntityHealthMovementMultipliers = {
  speedMultiplier: number;
  jumpDistanceMultiplier: number;
  jumpArcMultiplier: number;
  jumpLayerReachMultiplier: number;
  staminaDrainMultiplier: number;
  staminaRegenMultiplier: number;
  staminaJumpCostMultiplier: number;
  staminaMaxMultiplier: number;
};

/**
 * Multiplies all active movement modifiers for walk/run speed and jump reach/height.
 */
export function resolvingWorldPlazaEntityHealthMovementMultipliers(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number
): ResolvingWorldPlazaEntityHealthMovementMultipliers {
  const activeModifiers = state.movementModifiers.filter(
    (modifier) => modifier.expiresAtMs === null || modifier.expiresAtMs > nowMs
  );

  let speedMultiplier = 1;
  let jumpDistanceMultiplier = 1;
  let jumpArcMultiplier = 1;
  let jumpLayerReachMultiplier = 1;
  let staminaDrainMultiplier = 1;
  let staminaRegenMultiplier = 1;
  let staminaJumpCostMultiplier = 1;
  let staminaMaxMultiplier = 1;

  for (const modifier of activeModifiers) {
    if (modifier.kind === 'speed') {
      speedMultiplier *= modifier.multiplier;
    } else if (modifier.kind === 'jump_distance') {
      jumpDistanceMultiplier *= modifier.multiplier;
    } else if (modifier.kind === 'jump_arc') {
      jumpArcMultiplier *= modifier.multiplier;
    } else if (modifier.kind === 'jump_layer_reach') {
      jumpLayerReachMultiplier *= modifier.multiplier;
    } else if (modifier.kind === 'stamina_drain') {
      staminaDrainMultiplier *= modifier.multiplier;
    } else if (modifier.kind === 'stamina_regen') {
      staminaRegenMultiplier *= modifier.multiplier;
    } else if (modifier.kind === 'stamina_jump_cost') {
      staminaJumpCostMultiplier *= modifier.multiplier;
    } else if (modifier.kind === 'stamina_max') {
      staminaMaxMultiplier *= modifier.multiplier;
    }
  }

  return {
    speedMultiplier,
    jumpDistanceMultiplier,
    jumpArcMultiplier,
    jumpLayerReachMultiplier,
    staminaDrainMultiplier,
    staminaRegenMultiplier,
    staminaJumpCostMultiplier,
    staminaMaxMultiplier,
  };
}
