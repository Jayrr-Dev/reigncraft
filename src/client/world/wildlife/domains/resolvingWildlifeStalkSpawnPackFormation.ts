/**
 * Area-pack formation rank for PackHunter hunts (alpha leads, followers trail).
 *
 * @module components/world/wildlife/domains/resolvingWildlifeStalkSpawnPackFormation
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeNearbyPackmates } from '@/components/world/wildlife/domains/listingWildlifeNearbyPackmates';
import { parsingWildlifeProceduralAnchorId } from '@/components/world/wildlife/domains/parsingWildlifeProceduralAnchorId';
import { resolvingWildlifePackAlphaInstanceId } from '@/components/world/wildlife/domains/resolvingWildlifePackAlphaInstanceId';

export type ResolvingWildlifeStalkSpawnPackFormation = {
  isAlpha: boolean;
  followerRank: number;
};

export type ResolvingWildlifeStalkSpawnPackFormationParams = {
  instance: DefiningWildlifeInstance;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  packmatesTargetingPrey: readonly DefiningWildlifeInstance[];
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

/**
 * Returns whether this hunter is the area-pack alpha and how far back it trails.
 */
export function resolvingWildlifeStalkSpawnPackFormation({
  instance,
  nearbyInstances,
  packmatesTargetingPrey,
  resolveSpecies,
}: ResolvingWildlifeStalkSpawnPackFormationParams): ResolvingWildlifeStalkSpawnPackFormation {
  const packmates = listingWildlifeNearbyPackmates({
    instance,
    instances: listingWildlifeBehaviorNearbyAndSelf(instance, nearbyInstances),
    includeDead: false,
  });
  const huntingPack = packmates.filter((packmate) =>
    packmatesTargetingPrey.some(
      (hunter) => hunter.instanceId === packmate.instanceId
    )
  );

  if (huntingPack.length <= 1) {
    return { isAlpha: true, followerRank: 0 };
  }

  const alphaInstanceId = resolvingWildlifePackAlphaInstanceId({
    packmates,
    resolveSpecies,
  });

  if (!alphaInstanceId || alphaInstanceId === instance.instanceId) {
    return { isAlpha: true, followerRank: 0 };
  }

  const nonAlphas = huntingPack
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
