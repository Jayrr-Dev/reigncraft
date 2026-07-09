/**
 * Which biomes list a species in the spawn table.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSpeciesBiomeMembership
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { DEFINING_WILDLIFE_BIOME_SPAWN_TABLE } from '@/components/world/wildlife/domains/definingWildlifeBiomeSpawnTable';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

const wildlifeSpeciesBiomeMembershipCache = new Map<
  DefiningWildlifeSpeciesId,
  readonly DefiningWorldPlazaBiomeKind[]
>();

/** Returns biome kinds that can spawn this species (may be empty). */
export function resolvingWildlifeSpeciesBiomeMembership(
  speciesId: DefiningWildlifeSpeciesId
): readonly DefiningWorldPlazaBiomeKind[] {
  const cached = wildlifeSpeciesBiomeMembershipCache.get(speciesId);

  if (cached) {
    return cached;
  }

  const biomes: DefiningWorldPlazaBiomeKind[] = [];

  for (const [biomeKind, config] of Object.entries(
    DEFINING_WILDLIFE_BIOME_SPAWN_TABLE
  ) as Array<
    [
      DefiningWorldPlazaBiomeKind,
      (typeof DEFINING_WILDLIFE_BIOME_SPAWN_TABLE)[DefiningWorldPlazaBiomeKind],
    ]
  >) {
    if (!config) {
      continue;
    }

    if (config.entries.some((entry) => entry.speciesId === speciesId)) {
      biomes.push(biomeKind);
    }
  }

  wildlifeSpeciesBiomeMembershipCache.set(speciesId, biomes);
  return biomes;
}

/** True when the species appears in the given biome spawn pool. */
export function checkingWildlifeSpeciesSpawnsInBiome(
  speciesId: DefiningWildlifeSpeciesId,
  biomeKind: DefiningWorldPlazaBiomeKind
): boolean {
  return resolvingWildlifeSpeciesBiomeMembership(speciesId).includes(biomeKind);
}

const wildlifeBiomeSpeciesIdsCache = new Map<
  DefiningWorldPlazaBiomeKind,
  readonly DefiningWildlifeSpeciesId[]
>();

/**
 * Species ids that can spawn in a biome, in spawn-table entry order (deduped).
 * Pack-composition extras are omitted; only top-level entry species ids count.
 */
export function resolvingWildlifeSpeciesIdsForBiome(
  biomeKind: DefiningWorldPlazaBiomeKind
): readonly DefiningWildlifeSpeciesId[] {
  const cached = wildlifeBiomeSpeciesIdsCache.get(biomeKind);

  if (cached) {
    return cached;
  }

  const config = DEFINING_WILDLIFE_BIOME_SPAWN_TABLE[biomeKind];
  const speciesIds: DefiningWildlifeSpeciesId[] = [];
  const seen = new Set<DefiningWildlifeSpeciesId>();

  if (config) {
    for (const entry of config.entries) {
      if (seen.has(entry.speciesId)) {
        continue;
      }

      seen.add(entry.speciesId);
      speciesIds.push(entry.speciesId);
    }
  }

  wildlifeBiomeSpeciesIdsCache.set(biomeKind, speciesIds);
  return speciesIds;
}
