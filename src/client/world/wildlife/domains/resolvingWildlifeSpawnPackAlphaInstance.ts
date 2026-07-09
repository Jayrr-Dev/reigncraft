/**
 * Resolves the live area-pack alpha instance near one hunter.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSpawnPackAlphaInstance
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeNearbyPackmates } from '@/components/world/wildlife/domains/listingWildlifeNearbyPackmates';
import { resolvingWildlifePackAlphaInstanceId } from '@/components/world/wildlife/domains/resolvingWildlifePackAlphaInstanceId';

export type ResolvingWildlifeSpawnPackAlphaInstanceParams = {
  instance: DefiningWildlifeInstance;
  instances: readonly DefiningWildlifeInstance[];
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

/** Returns the pack alpha instance, or null for a solo hunter. */
export function resolvingWildlifeSpawnPackAlphaInstance({
  instance,
  instances,
  resolveSpecies,
}: ResolvingWildlifeSpawnPackAlphaInstanceParams): DefiningWildlifeInstance | null {
  const packmates = listingWildlifeNearbyPackmates({
    instance,
    instances,
    includeDead: false,
  });
  const alphaInstanceId = resolvingWildlifePackAlphaInstanceId({
    packmates,
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
