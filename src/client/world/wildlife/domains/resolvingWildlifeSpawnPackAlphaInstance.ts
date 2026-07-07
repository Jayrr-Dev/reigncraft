/**
 * Resolves the live spawn-pack alpha instance near one hunter.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSpawnPackAlphaInstance
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeSpawnPackmates } from '@/components/world/wildlife/domains/listingWildlifeSpawnPackmates';
import { resolvingWildlifePackAlphaInstanceId } from '@/components/world/wildlife/domains/resolvingWildlifePackAlphaInstanceId';

export type ResolvingWildlifeSpawnPackAlphaInstanceParams = {
  instance: DefiningWildlifeInstance;
  instances: readonly DefiningWildlifeInstance[];
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

/** Returns the pack alpha instance, or null for a solo spawn. */
export function resolvingWildlifeSpawnPackAlphaInstance({
  instance,
  instances,
  resolveSpecies,
}: ResolvingWildlifeSpawnPackAlphaInstanceParams): DefiningWildlifeInstance | null {
  const spawnPack = listingWildlifeSpawnPackmates({
    instance,
    instances,
    includeDead: false,
  });
  const alphaInstanceId = resolvingWildlifePackAlphaInstanceId({
    packmates: spawnPack,
    resolveSpecies,
  });

  if (!alphaInstanceId) {
    return null;
  }

  return (
    instances.find((candidate) => candidate.instanceId === alphaInstanceId) ??
    null
  );
}
