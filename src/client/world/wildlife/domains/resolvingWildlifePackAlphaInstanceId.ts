/**
 * Picks the sticky spawn-pack alpha: largest living member at first lock.
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

function resolvingWildlifePackmateSizeForAlpha(
  packmate: DefiningWildlifeInstance,
  resolveSpecies: ResolvingWildlifePackAlphaInstanceIdParams['resolveSpecies']
): number | null {
  const species = resolveSpecies(packmate.speciesId);

  if (!species) {
    return null;
  }

  return resolvingWildlifeInstanceSizeScale(species, packmate);
}

function resolvingWildlifeLargestPackmateInstanceId({
  packmates,
  resolveSpecies,
}: ResolvingWildlifePackAlphaInstanceIdParams): string | null {
  let alphaInstanceId: string | null = null;
  let alphaSize = Number.NEGATIVE_INFINITY;
  let alphaPackIndex = Number.POSITIVE_INFINITY;

  for (const packmate of packmates) {
    if (packmate.isDead) {
      continue;
    }

    const size = resolvingWildlifePackmateSizeForAlpha(packmate, resolveSpecies);

    if (size === null) {
      continue;
    }

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

/**
 * Returns the instance id of the pack alpha, or null for a solo spawn.
 *
 * Prefer a sticky `packAlphaInstanceId` already shared by living packmates.
 * Only elect the largest living wolf when no locked alpha is still alive.
 */
export function resolvingWildlifePackAlphaInstanceId({
  packmates,
  resolveSpecies,
}: ResolvingWildlifePackAlphaInstanceIdParams): string | null {
  const livingPackmates = packmates.filter((packmate) => !packmate.isDead);

  if (livingPackmates.length <= 1) {
    return null;
  }

  const livingById = new Map(
    livingPackmates.map((packmate) => [packmate.instanceId, packmate])
  );

  for (const packmate of livingPackmates) {
    const lockedAlphaId = packmate.packAlphaInstanceId ?? null;

    if (lockedAlphaId && livingById.has(lockedAlphaId)) {
      return lockedAlphaId;
    }
  }

  return resolvingWildlifeLargestPackmateInstanceId({
    packmates: livingPackmates,
    resolveSpecies,
  });
}
