import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  DEFINING_WILDLIFE_CLICK_HITBOX_PADDING_GRID,
  listingWildlifeInstances,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

/**
 * Finds the closest dead corpse whose hitbox contains the grid point.
 */
export function findingWildlifeCorpseAtGridPoint(
  store: ManagingWildlifeInstanceStore,
  gridPoint: { x: number; y: number },
  resolveCollisionRadiusGrid: (instance: DefiningWildlifeInstance) => number
): DefiningWildlifeInstance | null {
  const corpses = listingWildlifeInstances(store).filter(
    (instance) => instance.isDead && !instance.hasBeenStudied
  );

  let closest: DefiningWildlifeInstance | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const instance of corpses) {
    const hitRadius =
      resolveCollisionRadiusGrid(instance) +
      DEFINING_WILDLIFE_CLICK_HITBOX_PADDING_GRID;
    const distance = Math.hypot(
      instance.position.x - gridPoint.x,
      instance.position.y - gridPoint.y
    );

    if (distance <= hitRadius && distance < closestDistance) {
      closest = instance;
      closestDistance = distance;
    }
  }

  return closest;
}
