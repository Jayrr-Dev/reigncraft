/**
 * Merges the acting instance into a neighbor list for pack-radius queries.
 *
 * Simulation blackboards exclude self from `nearbyInstances`; pack predicates
 * that must count "including self" need this merge first.
 *
 * @module components/world/wildlife/domains/listingWildlifeNearbyInstancesAndSelf
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Returns nearby instances plus self, deduped by instance id. */
export function listingWildlifeNearbyInstancesAndSelf(
  instance: DefiningWildlifeInstance,
  nearbyInstances: readonly DefiningWildlifeInstance[]
): DefiningWildlifeInstance[] {
  const byId = new Map<string, DefiningWildlifeInstance>();
  byId.set(instance.instanceId, instance);

  for (const neighbor of nearbyInstances) {
    byId.set(neighbor.instanceId, neighbor);
  }

  return [...byId.values()];
}
