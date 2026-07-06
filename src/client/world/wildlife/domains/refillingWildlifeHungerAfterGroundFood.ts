/**
 * Hunger refill after one ground-food bite.
 *
 * @module components/world/wildlife/domains/refillingWildlifeHungerAfterGroundFood
 */

import { resolvingWorldPlazaInventoryFoodDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemFood';
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

/** Applies one bite of ground food to hunger state. */
export function refillingWildlifeHungerAfterGroundFood(
  state: DefiningWildlifeHungerState,
  species: DefiningWildlifeSpeciesDefinition,
  itemTypeId: string,
  nowMs: number
): DefiningWildlifeHungerState | null {
  const foodDefinition = resolvingWorldPlazaInventoryFoodDefinition(itemTypeId);

  if (!foodDefinition) {
    return null;
  }

  const nextRatio = clampingHungerRatio(
    state.hungerRatio + foodDefinition.hungerRestoreRatio
  );

  return {
    hungerRatio: nextRatio,
    driveLevel: resolvingWildlifeHungerDriveLevel(nextRatio, species),
    lastFedAtMs: nowMs,
  };
}
