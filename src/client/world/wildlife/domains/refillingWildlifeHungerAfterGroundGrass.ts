import { DEFINING_WILDLIFE_GROUND_GRASS_HUNGER_REFILL_RATIO } from '@/components/world/wildlife/domains/definingWildlifeHuntConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeHungerState } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Hunger refill after wildlife eats one long-grass tile.
 *
 * @module components/world/wildlife/domains/refillingWildlifeHungerAfterGroundGrass
 */

function clampingHungerRatio(ratio: number): number {
  if (ratio < 0) {
    return 0;
  }

  if (ratio > 1) {
    return 1;
  }

  return ratio;
}

function resolvingWildlifeHungerDriveLevel(
  hungerRatio: number,
  species: DefiningWildlifeSpeciesDefinition
): DefiningWildlifeHungerState['driveLevel'] {
  if (hungerRatio <= species.hunger.starvingThreshold) {
    return 'starving';
  }

  if (hungerRatio <= species.hunger.hungryThreshold) {
    return 'hungry';
  }

  if (hungerRatio <= species.hunger.peckishThreshold) {
    return 'peckish';
  }

  return 'sated';
}

export function refillingWildlifeHungerAfterGroundGrass(
  hungerState: DefiningWildlifeHungerState,
  species: DefiningWildlifeSpeciesDefinition,
  nowMs: number
): DefiningWildlifeHungerState {
  if (species.diet !== 'herbivore' && species.diet !== 'omnivore') {
    return hungerState;
  }

  const nextRatio = clampingHungerRatio(
    hungerState.hungerRatio + DEFINING_WILDLIFE_GROUND_GRASS_HUNGER_REFILL_RATIO
  );

  return {
    hungerRatio: nextRatio,
    driveLevel: resolvingWildlifeHungerDriveLevel(nextRatio, species),
    lastFedAtMs: nowMs,
  };
}
