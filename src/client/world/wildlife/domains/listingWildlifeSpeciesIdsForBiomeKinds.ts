/**
 * Lists wildlife species ids spawnable in one or more biomes.
 *
 * @module components/world/wildlife/domains/listingWildlifeSpeciesIdsForBiomeKinds
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { DEFINING_WILDLIFE_BIOME_SPAWN_TABLE } from '@/components/world/wildlife/domains/definingWildlifeBiomeSpawnTable';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

function recordingWildlifeSpeciesSpawnWeight(
  weightBySpeciesId: Map<DefiningWildlifeSpeciesId, number>,
  speciesId: DefiningWildlifeSpeciesId,
  weight: number
): void {
  const previousWeight = weightBySpeciesId.get(speciesId) ?? 0;
  weightBySpeciesId.set(speciesId, Math.max(previousWeight, weight));
}

/**
 * Returns spawn-table species for the given biomes, highest weight first.
 *
 * @param maxSpecies - When set, keeps only the top N entries by spawn weight.
 */
export function listingWildlifeSpeciesIdsForBiomeKinds(
  biomeKinds: readonly DefiningWorldPlazaBiomeKind[],
  maxSpecies: number | null = null
): readonly DefiningWildlifeSpeciesId[] {
  const weightBySpeciesId = new Map<DefiningWildlifeSpeciesId, number>();

  for (const biomeKind of biomeKinds) {
    const spawnConfig = DEFINING_WILDLIFE_BIOME_SPAWN_TABLE[biomeKind];

    if (!spawnConfig) {
      continue;
    }

    for (const entry of spawnConfig.entries) {
      recordingWildlifeSpeciesSpawnWeight(
        weightBySpeciesId,
        entry.speciesId,
        entry.weight
      );

      for (const member of entry.packComposition ?? []) {
        recordingWildlifeSpeciesSpawnWeight(
          weightBySpeciesId,
          member.speciesId,
          entry.weight
        );
      }
    }
  }

  const sortedSpeciesIds = [...weightBySpeciesId.entries()]
    .sort((leftEntry, rightEntry) => rightEntry[1] - leftEntry[1])
    .map(([speciesId]) => speciesId);

  if (maxSpecies === null) {
    return sortedSpeciesIds;
  }

  return sortedSpeciesIds.slice(0, Math.max(0, maxSpecies));
}
