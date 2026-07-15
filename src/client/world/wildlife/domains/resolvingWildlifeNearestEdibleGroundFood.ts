/**
 * Nearest edible ground-food lookup for wildlife foraging.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeNearestEdibleGroundFood
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import { checkingWorldPlazaInventoryItemIsSpritcore } from '@/components/world/spritcore/domains/checkingWorldPlazaInventoryItemIsSpritcore';
import { checkingWildlifeSpeciesMayEatGroundFood } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesMayEatGroundFood';
import { DEFINING_WILDLIFE_GROUND_FOOD_SCENT_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeHuntConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

/** Resolves the closest edible ground stack within scent range. */
export function resolvingWildlifeNearestEdibleGroundFood(
  position: DefiningWorldPlazaWorldPoint,
  species: DefiningWildlifeSpeciesDefinition,
  groundItems: readonly DefiningWorldPlazaGroundItem[]
): DefiningWorldPlazaGroundItem | null {
  let nearestSpritcore: DefiningWorldPlazaGroundItem | null = null;
  let nearestSpritcoreDistance = Number.POSITIVE_INFINITY;
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

    const targetX = groundItem.gridX + 0.5;
    const targetY = groundItem.gridY + 0.5;
    const distance = Math.hypot(position.x - targetX, position.y - targetY);

    if (distance > DEFINING_WILDLIFE_GROUND_FOOD_SCENT_RADIUS_GRID) {
      continue;
    }

    if (checkingWorldPlazaInventoryItemIsSpritcore(groundItem.itemTypeId)) {
      if (distance < nearestSpritcoreDistance) {
        nearestSpritcore = groundItem;
        nearestSpritcoreDistance = distance;
      }

      continue;
    }

    if (distance >= nearestDistance) {
      continue;
    }

    nearest = groundItem;
    nearestDistance = distance;
  }

  // Spritcore always wins over other stacks when any SC is in scent range.
  return nearestSpritcore ?? nearest;
}
