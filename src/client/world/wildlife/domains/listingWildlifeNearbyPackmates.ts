/**
 * Lists same-species packmates within stalk join radius of one hunter.
 *
 * @module components/world/wildlife/domains/listingWildlifeNearbyPackmates
 */

import { DEFINING_WILDLIFE_STALK_PACK_JOIN_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ListingWildlifeNearbyPackmatesParams = {
  instance: DefiningWildlifeInstance;
  instances: readonly DefiningWildlifeInstance[];
  includeDead?: boolean;
  radiusGrid?: number;
};

/**
 * Returns living (or optionally dead) same-species instances within radius,
 * including self. Used for sticky alpha election and shared prey locks.
 */
export function listingWildlifeNearbyPackmates({
  instance,
  instances,
  includeDead = false,
  radiusGrid = DEFINING_WILDLIFE_STALK_PACK_JOIN_RADIUS_GRID,
}: ListingWildlifeNearbyPackmatesParams): DefiningWildlifeInstance[] {
  const packmates: DefiningWildlifeInstance[] = [];

  for (const candidate of instances) {
    if (!includeDead && candidate.isDead) {
      continue;
    }

    if (candidate.speciesId !== instance.speciesId) {
      continue;
    }

    const distance = Math.hypot(
      instance.position.x - candidate.position.x,
      instance.position.y - candidate.position.y
    );

    if (distance > radiusGrid) {
      continue;
    }

    packmates.push(candidate);
  }

  return packmates.sort((left, right) =>
    left.instanceId.localeCompare(right.instanceId)
  );
}
