/**
 * Finds the prey lock followers must inherit from their pack alpha.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeStalkPackJoinPreyTargetId
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeNearbyPackmates } from '@/components/world/wildlife/domains/listingWildlifeNearbyPackmates';
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
 * Falls back to any nearby packmate already hunting if the alpha is not yet locked.
 */
export function resolvingWildlifeStalkPackJoinPreyTargetId({
  instance,
  nearbyInstances,
  resolveSpecies,
}: ResolvingWildlifeStalkPackJoinPreyTargetIdParams): string | null {
  const allInstances = listingWildlifeNearbyAndSelf(instance, nearbyInstances);
  const packmates = listingWildlifeNearbyPackmates({
    instance,
    instances: allInstances,
    includeDead: false,
  });
  const alphaInstanceId = resolvingWildlifePackAlphaInstanceId({
    packmates,
    resolveSpecies,
  });

  if (alphaInstanceId && alphaInstanceId === instance.instanceId) {
    return null;
  }

  if (alphaInstanceId) {
    const alpha = allInstances.find(
      (candidate) => candidate.instanceId === alphaInstanceId
    );
    const alphaPreyTargetId =
      alpha?.aggroState.stalkLockedPreyTargetId ??
      alpha?.aggroState.activeTargetId ??
      null;

    if (alphaPreyTargetId) {
      return alphaPreyTargetId;
    }
  }

  // Alpha not hunting yet: join any nearby packmate that already locked prey.
  let inheritedPreyTargetId: string | null = null;

  for (const packmate of packmates) {
    if (packmate.instanceId === instance.instanceId) {
      continue;
    }

    const preyTargetId =
      packmate.aggroState.stalkLockedPreyTargetId ??
      packmate.aggroState.activeTargetId ??
      null;

    if (!preyTargetId) {
      continue;
    }

    if (
      inheritedPreyTargetId === null ||
      preyTargetId.localeCompare(inheritedPreyTargetId) < 0
    ) {
      inheritedPreyTargetId = preyTargetId;
    }
  }

  return inheritedPreyTargetId;
}
