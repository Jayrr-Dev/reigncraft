/**
 * Warm recovery stack loss — mirror of cold deficit gain with inverted linear stacks.
 *
 * @module components/world/health/domains/computingWorldPlazaFrostbiteStacksLostFromWarmSurplus
 */

import {
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_SPEED_SLOW_FRACTION,
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_STACKS,
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_STACKS_PER_DEFICIT_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteConstants';

/**
 * Inverted linear stack factor for warm decay.
 * Walk speed uses `1 - fraction × (stacks / MAX)`; decay uses the penalty portion only.
 */
export function computingWorldPlazaFrostbiteStackWarmDecayMultiplier(
  stackCount: number
): number {
  if (stackCount <= 0) {
    return 0;
  }

  const clampedStacks = Math.min(
    DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_STACKS,
    stackCount
  );

  return (
    DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_SPEED_SLOW_FRACTION *
    (clampedStacks / DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_STACKS)
  );
}

/**
 * Stacks removed on one warm environmental tick.
 * Symmetric to {@link computingWorldPlazaFrostbiteStacksGainedFromColdDeficit}:
 * warmth °C above comfort low × stacks-per-°C × inverted linear stack factor.
 */
export function computingWorldPlazaFrostbiteStacksLostFromWarmSurplus({
  warmthAboveComfortCelsius,
  stackCount,
}: {
  warmthAboveComfortCelsius: number;
  stackCount: number;
}): number {
  if (warmthAboveComfortCelsius <= 0 || stackCount <= 0) {
    return 0;
  }

  return (
    warmthAboveComfortCelsius *
    DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_STACKS_PER_DEFICIT_CELSIUS *
    computingWorldPlazaFrostbiteStackWarmDecayMultiplier(stackCount)
  );
}
