/**
 * Hunger refill after one wildlife berry-shrub bite.
 *
 * @module components/world/wildlife/domains/refillingWildlifeHungerAfterGroundShrub
 */

import { DEFINING_WILDLIFE_GROUND_SHRUB_HUNGER_REFILL_RATIO } from '@/components/world/wildlife/domains/definingWildlifeHuntConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeHungerState } from '@/components/world/wildlife/domains/definingWildlifeTypes';

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

/** Applies one berry-shrub bite to hunger state. */
export function refillingWildlifeHungerAfterGroundShrub(
  state: DefiningWildlifeHungerState,
  species: DefiningWildlifeSpeciesDefinition,
  nowMs: number
): DefiningWildlifeHungerState {
  const nextRatio = clampingHungerRatio(
    state.hungerRatio + DEFINING_WILDLIFE_GROUND_SHRUB_HUNGER_REFILL_RATIO
  );

  return {
    hungerRatio: nextRatio,
    driveLevel: resolvingWildlifeHungerDriveLevel(nextRatio, species),
    lastFedAtMs: nowMs,
  };
}
