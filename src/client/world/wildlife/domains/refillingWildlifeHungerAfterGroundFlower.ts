/**
 * Hunger refill after one wildlife biome-flower bite.
 *
 * Inventory flowers restore 0 hunger for players; wildlife uses a dedicated ratio.
 *
 * @module components/world/wildlife/domains/refillingWildlifeHungerAfterGroundFlower
 */

import { DEFINING_WILDLIFE_GROUND_FLOWER_HUNGER_REFILL_RATIO } from '@/components/world/wildlife/domains/definingWildlifeHuntConstants';
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

/** Applies one biome-flower bite to hunger state. */
export function refillingWildlifeHungerAfterGroundFlower(
  state: DefiningWildlifeHungerState,
  species: DefiningWildlifeSpeciesDefinition,
  nowMs: number
): DefiningWildlifeHungerState {
  const nextRatio = clampingHungerRatio(
    state.hungerRatio + DEFINING_WILDLIFE_GROUND_FLOWER_HUNGER_REFILL_RATIO
  );

  return {
    hungerRatio: nextRatio,
    driveLevel: resolvingWildlifeHungerDriveLevel(nextRatio, species),
    lastFedAtMs: nowMs,
  };
}
