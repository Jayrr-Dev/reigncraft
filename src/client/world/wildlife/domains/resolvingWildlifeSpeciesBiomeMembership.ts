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
