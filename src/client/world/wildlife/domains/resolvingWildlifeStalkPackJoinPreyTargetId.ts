/**
 * Finds the prey lock followers must inherit from their pack alpha.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeStalkPackJoinPreyTargetId
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { checkingWildlifeShareSpawnPack } from '@/components/world/wildlife/domains/checkingWildlifeShareSpawnPack';
import { DEFINING_WILDLIFE_STALK_PACK_JOIN_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import { listingWildlifeSpawnPackmates } from '@/components/world/wildlife/domains/listingWildlifeSpawnPackmates';
import { resolvingWildlifePackAlphaInstanceId } from '@/components/world/wildlife/domains/resolvingWildlifePackAlphaInstanceId';

export type ResolvingWildlifeStalkPackJoinPreyTargetIdParams = {
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

/**
 * Returns the prey id a follower should inherit from its nearby alpha.
 * Prefers the alpha's stalk lock, then its active target.
 */
export function resolvingWildlifeStalkPackJoinPreyTargetId({
  instance,
  nearbyInstances,
  resolveSpecies,
}: ResolvingWildlifeStalkPackJoinPreyTargetIdParams): string | null {
  const allInstances = listingWildlifeNearbyAndSelf(instance, nearbyInstances);
  const spawnPack = listingWildlifeSpawnPackmates({
    instance,
    instances: allInstances,
    includeDead: false,
  });
  const alphaInstanceId = resolvingWildlifePackAlphaInstanceId({
    packmates: spawnPack,
    resolveSpecies,
  });

  if (!alphaInstanceId || alphaInstanceId === instance.instanceId) {
    return null;
  }

  const alpha = allInstances.find(
    (candidate) => candidate.instanceId === alphaInstanceId
  );

  if (!alpha) {
    return null;
  }

  const preyTargetId =
    alpha.aggroState.stalkLockedPreyTargetId ??
    alpha.aggroState.activeTargetId ??
    null;

  if (!preyTargetId) {
    return null;
  }

  const distance = Math.hypot(
    instance.position.x - alpha.position.x,
    instance.position.y - alpha.position.y
  );

  if (distance > DEFINING_WILDLIFE_STALK_PACK_JOIN_RADIUS_GRID) {
    return null;
  }

  if (!checkingWildlifeShareSpawnPack(instance, alpha)) {
    return null;
  }

  return preyTargetId;
}
