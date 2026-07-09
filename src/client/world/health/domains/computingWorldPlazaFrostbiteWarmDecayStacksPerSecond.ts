/**
 * Warm recovery decay rate for frostbite stacks.
 *
 * @module components/world/health/domains/computingWorldPlazaFrostbiteWarmDecayStacksPerSecond
 */

import {
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_WARM_DECAY_BASE_STACKS_PER_SECOND,
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_WARM_DECAY_STACKS_PER_SECOND_MAX,
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_WARM_DECAY_STACKS_PER_SECOND_PER_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteConstants';

/**
 * Stacks lost per second while at or above comfort low.
 * Warmer above comfort = faster decay. Returns 0 when still cold (warmth <= 0).
 */
export function computingWorldPlazaFrostbiteWarmDecayStacksPerSecond(
  warmthAboveComfortCelsius: number
): number {
  if (warmthAboveComfortCelsius < 0) {
    return 0;
  }

  const rate =
    DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_WARM_DECAY_BASE_STACKS_PER_SECOND +
    warmthAboveComfortCelsius *
      DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_WARM_DECAY_STACKS_PER_SECOND_PER_CELSIUS;

  return Math.min(
    DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_WARM_DECAY_STACKS_PER_SECOND_MAX,
    rate
  );
}
