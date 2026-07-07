/**
 * Spawn-pack formation rank for calm alpha-led roaming.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSpawnPackRoamFormation
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeSpawnPackmates } from '@/components/world/wildlife/domains/listingWildlifeSpawnPackmates';
import { parsingWildlifeProceduralAnchorId } from '@/components/world/wildlife/domains/parsingWildlifeProceduralAnchorId';
import { resolvingWildlifePackAlphaInstanceId } from '@/components/world/wildlife/domains/resolvingWildlifePackAlphaInstanceId';
import type { ResolvingWildlifeStalkSpawnPackFormation } from '@/components/world/wildlife/domains/resolvingWildlifeStalkSpawnPackFormation';

export type ResolvingWildlifeSpawnPackRoamFormationParams = {
  instance: DefiningWildlifeInstance;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

function listingWildlifeBehaviorNearbyAndSelf(
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

function resolvingWildlifeSpawnPackFollowerSortKey(
  packmate: DefiningWildlifeInstance
): number {
  return (
    parsingWildlifeProceduralAnchorId(packmate.anchorId)?.packIndex ??
    Number.POSITIVE_INFINITY
  );
}

/** Returns whether this pack member is the alpha and how far back it trails. */
export function resolvingWildlifeSpawnPackRoamFormation({
  instance,
  nearbyInstances,
  resolveSpecies,
}: ResolvingWildlifeSpawnPackRoamFormationParams): ResolvingWildlifeStalkSpawnPackFormation {
  const spawnPack = listingWildlifeSpawnPackmates({
    instance,
    instances: listingWildlifeBehaviorNearbyAndSelf(instance, nearbyInstances),
    includeDead: false,
  });

  if (spawnPack.length <= 1) {
    return { isAlpha: true, followerRank: 0 };
  }

  const alphaInstanceId = resolvingWildlifePackAlphaInstanceId({
    packmates: spawnPack,
    resolveSpecies,
  });

  if (!alphaInstanceId || alphaInstanceId === instance.instanceId) {
    return { isAlpha: true, followerRank: 0 };
  }

  const nonAlphas = spawnPack
    .filter((packmate) => packmate.instanceId !== alphaInstanceId)
    .sort(
      (left, right) =>
        resolvingWildlifeSpawnPackFollowerSortKey(left) -
          resolvingWildlifeSpawnPackFollowerSortKey(right) ||
        left.instanceId.localeCompare(right.instanceId)
    );
  const followerIndex = nonAlphas.findIndex(
    (packmate) => packmate.instanceId === instance.instanceId
  );

  if (followerIndex < 0) {
    return { isAlpha: true, followerRank: 0 };
  }

  return { isAlpha: false, followerRank: followerIndex + 1 };
}
