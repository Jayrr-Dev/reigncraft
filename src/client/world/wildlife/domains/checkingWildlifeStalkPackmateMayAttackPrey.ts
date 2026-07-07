/**
 * Whether a stalk packmate may attack or rush the prey yet.
 *
 * @module components/world/wildlife/domains/checkingWildlifeStalkPackmateMayAttackPrey
 */

import { checkingWildlifePackAlphaHasCommittedPreyAttack } from '@/components/world/wildlife/domains/checkingWildlifePackAlphaHasCommittedPreyAttack';
import type { DefiningWildlifeStalkPreyContext } from '@/components/world/wildlife/domains/definingWildlifeStalkPreyTypes';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeSpawnPackAlphaInstance } from '@/components/world/wildlife/domains/resolvingWildlifeSpawnPackAlphaInstance';

export type CheckingWildlifeStalkPackmateMayAttackPreyParams = {
  instance: DefiningWildlifeInstance;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  prey: DefiningWildlifeStalkPreyContext;
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

/** Alphas and solo wolves attack first; followers wait for the alpha rush. */
export function checkingWildlifeStalkPackmateMayAttackPrey({
  instance,
  nearbyInstances,
  prey,
  resolveSpecies,
}: CheckingWildlifeStalkPackmateMayAttackPreyParams): boolean {
  const alpha = resolvingWildlifeSpawnPackAlphaInstance({
    instance,
    instances: listingWildlifeNearbyAndSelf(instance, nearbyInstances),
    resolveSpecies,
  });

  if (!alpha || alpha.instanceId === instance.instanceId) {
    return true;
  }

  return checkingWildlifePackAlphaHasCommittedPreyAttack({
    alpha,
    preyTargetId: prey.targetId,
    preyPosition: prey.position,
  });
}
