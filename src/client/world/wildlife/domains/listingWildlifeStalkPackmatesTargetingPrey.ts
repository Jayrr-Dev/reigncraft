/**
 * Counts same-species stalkers currently focused on one prey target.
 *
 * @module components/world/wildlife/domains/listingWildlifeStalkPackmatesTargetingPrey
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ListingWildlifeStalkPackmatesTargetingPreyParams = {
  instance: DefiningWildlifeInstance;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  preyTargetId: string | null;
};

/**
 * Returns live same-species instances (including self) hunting the same prey.
 */
export function listingWildlifeStalkPackmatesTargetingPrey({
  instance,
  nearbyInstances,
  preyTargetId,
}: ListingWildlifeStalkPackmatesTargetingPreyParams): DefiningWildlifeInstance[] {
  if (!preyTargetId) {
    return [];
  }

  const packmates: DefiningWildlifeInstance[] = [];

  if (!instance.isDead && instance.aggroState.activeTargetId === preyTargetId) {
    packmates.push(instance);
  }

  for (const neighbor of nearbyInstances) {
    if (neighbor.isDead || neighbor.speciesId !== instance.speciesId) {
      continue;
    }

    if (neighbor.aggroState.activeTargetId !== preyTargetId) {
      continue;
    }

    if (neighbor.instanceId === instance.instanceId) {
      continue;
    }

    packmates.push(neighbor);
  }

  return packmates.sort((left, right) =>
    left.instanceId.localeCompare(right.instanceId)
  );
}

export function countingWildlifeStalkPackmatesTargetingPrey(
  params: ListingWildlifeStalkPackmatesTargetingPreyParams
): number {
  return listingWildlifeStalkPackmatesTargetingPrey(params).length;
}
