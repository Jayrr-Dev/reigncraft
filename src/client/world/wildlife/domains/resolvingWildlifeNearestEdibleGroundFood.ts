/**
 * Nearest edible ground-food lookup for wildlife foraging.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeNearestEdibleGroundFood
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import {
  checkingWildlifeGroundFoodItemTypeIsMeat,
  checkingWildlifeSpeciesMayEatGroundFood,
} from '@/components/world/wildlife/domains/checkingWildlifeSpeciesMayEatGroundFood';
import { DEFINING_WILDLIFE_GROUND_FOOD_SCENT_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeHuntConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

export type ResolvingWildlifeNearestEdibleGroundFoodOptions = {
  /** When true, only meat stacks qualify (opportunistic scavenging). */
  meatOnly?: boolean;
};

/** Resolves the closest edible ground stack within scent range. */
export function resolvingWildlifeNearestEdibleGroundFood(
  position: DefiningWorldPlazaWorldPoint,
  species: DefiningWildlifeSpeciesDefinition,
  groundItems: readonly DefiningWorldPlazaGroundItem[],
  options: ResolvingWildlifeNearestEdibleGroundFoodOptions = {}
): DefiningWorldPlazaGroundItem | null {
  let nearest: DefiningWorldPlazaGroundItem | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const groundItem of groundItems) {
    if (groundItem.quantity <= 0) {
      continue;
    }

    if (
      !checkingWildlifeSpeciesMayEatGroundFood(species, groundItem.itemTypeId)
    ) {
      continue;
    }

    if (
      options.meatOnly &&
      !checkingWildlifeGroundFoodItemTypeIsMeat(groundItem.itemTypeId)
    ) {
      continue;
    }

    const targetX = groundItem.gridX + 0.5;
    const targetY = groundItem.gridY + 0.5;
    const distance = Math.hypot(position.x - targetX, position.y - targetY);

    if (
      distance > DEFINING_WILDLIFE_GROUND_FOOD_SCENT_RADIUS_GRID ||
      distance >= nearestDistance
    ) {
      continue;
    }

    nearest = groundItem;
    nearestDistance = distance;
  }

  return nearest;
}
