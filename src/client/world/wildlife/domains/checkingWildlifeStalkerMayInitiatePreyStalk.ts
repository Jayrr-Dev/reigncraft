/**
 * Whether a stalker may open the hunt on sight instead of waiting for the alpha.
 *
 * @module components/world/wildlife/domains/checkingWildlifeStalkerMayInitiatePreyStalk
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeSpawnPackmates } from '@/components/world/wildlife/domains/listingWildlifeSpawnPackmates';
import { resolvingWildlifePackAlphaInstanceId } from '@/components/world/wildlife/domains/resolvingWildlifePackAlphaInstanceId';

export type CheckingWildlifeStalkerMayInitiatePreyStalkParams = {
  instance: DefiningWildlifeInstance;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

function listingWildlifeNearbyAndSelf(
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

/** Only the spawn-pack alpha (or a solo wolf) may start stalking on sight. */
export function checkingWildlifeStalkerMayInitiatePreyStalk({
  instance,
  nearbyInstances,
  resolveSpecies,
}: CheckingWildlifeStalkerMayInitiatePreyStalkParams): boolean {
  const spawnPack = listingWildlifeSpawnPackmates({
    instance,
    instances: listingWildlifeNearbyAndSelf(instance, nearbyInstances),
    includeDead: false,
  });
  const alphaInstanceId = resolvingWildlifePackAlphaInstanceId({
    packmates: spawnPack,
    resolveSpecies,
  });

  if (!alphaInstanceId) {
    return true;
  }

  return instance.instanceId === alphaInstanceId;
}
