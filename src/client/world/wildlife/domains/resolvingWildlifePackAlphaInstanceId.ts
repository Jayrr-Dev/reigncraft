/**
 * Picks the largest pack member as the alpha for scatter-on-death logic.
 *
 * @module components/world/wildlife/domains/resolvingWildlifePackAlphaInstanceId
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { parsingWildlifeProceduralAnchorId } from '@/components/world/wildlife/domains/parsingWildlifeProceduralAnchorId';
import { resolvingWildlifeInstanceSizeScale } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';

export type ResolvingWildlifePackAlphaInstanceIdParams = {
  packmates: readonly DefiningWildlifeInstance[];
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

/**
 * Returns the instance id of the pack alpha, or null for a solo spawn.
 */
export function resolvingWildlifePackAlphaInstanceId({
  packmates,
  resolveSpecies,
}: ResolvingWildlifePackAlphaInstanceIdParams): string | null {
  if (packmates.length <= 1) {
    return null;
  }

  let alphaInstanceId: string | null = null;
  let alphaSize = Number.NEGATIVE_INFINITY;
  let alphaPackIndex = Number.POSITIVE_INFINITY;

  for (const packmate of packmates) {
    const species = resolveSpecies(packmate.speciesId);

    if (!species) {
      continue;
    }

    const size = resolvingWildlifeInstanceSizeScale(species, packmate);
    const packIndex =
      parsingWildlifeProceduralAnchorId(packmate.anchorId)?.packIndex ??
      Number.POSITIVE_INFINITY;

    if (
      size > alphaSize ||
      (size === alphaSize && packIndex < alphaPackIndex) ||
      (size === alphaSize &&
        packIndex === alphaPackIndex &&
        alphaInstanceId !== null &&
        packmate.instanceId.localeCompare(alphaInstanceId) < 0)
    ) {
      alphaInstanceId = packmate.instanceId;
      alphaSize = size;
      alphaPackIndex = packIndex;
    }
  }

  return alphaInstanceId;
}
