/**
 * Searchable species catalog for the wildlife dev spawner.
 *
 * @module components/world/wildlife/domains/listingWildlifeDevSpawnSpeciesCatalog
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import {
  listingWildlifeSpeciesIds,
  resolvingWildlifeSpeciesDefinition,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { DefiningWildlifeDevSpawnBiomeFilterId } from '@/components/world/wildlife/domains/listingWildlifeDevSpawnBiomeFilters';
import {
  checkingWildlifeSpeciesSpawnsInBiome,
  resolvingWildlifeSpeciesBiomeMembership,
} from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesBiomeMembership';

export type DefiningWildlifeDevSpawnSpeciesCatalogEntry = {
  readonly speciesId: DefiningWildlifeSpeciesId;
  readonly displayName: string;
  readonly biomeKinds: readonly DefiningWorldPlazaBiomeKind[];
};

export type ListingWildlifeDevSpawnSpeciesCatalogParams = {
  readonly searchQuery?: string;
  readonly biomeFilterId?: DefiningWildlifeDevSpawnBiomeFilterId;
};

function normalizingWildlifeDevSpawnSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

/** Full species list sorted by display name. */
export function listingWildlifeDevSpawnSpeciesCatalog(): readonly DefiningWildlifeDevSpawnSpeciesCatalogEntry[] {
  return listingWildlifeSpeciesIds()
    .map((speciesId) => {
      const species = resolvingWildlifeSpeciesDefinition(speciesId);

      if (!species) {
        return null;
      }

      return {
        speciesId,
        displayName: species.displayName,
        biomeKinds: resolvingWildlifeSpeciesBiomeMembership(speciesId),
      };
    })
    .filter(
      (entry): entry is DefiningWildlifeDevSpawnSpeciesCatalogEntry =>
        entry !== null
    )
    .sort((left, right) => left.displayName.localeCompare(right.displayName));
}

/** Filters the catalog by optional search text and biome chip. */
export function filteringWildlifeDevSpawnSpeciesCatalog({
  searchQuery = '',
  biomeFilterId = 'all',
}: ListingWildlifeDevSpawnSpeciesCatalogParams = {}): readonly DefiningWildlifeDevSpawnSpeciesCatalogEntry[] {
  const normalizedQuery = normalizingWildlifeDevSpawnSearchQuery(searchQuery);

  return listingWildlifeDevSpawnSpeciesCatalog().filter((entry) => {
    if (
      biomeFilterId !== 'all' &&
      !checkingWildlifeSpeciesSpawnsInBiome(entry.speciesId, biomeFilterId)
    ) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return (
      entry.displayName.toLowerCase().includes(normalizedQuery) ||
      entry.speciesId.toLowerCase().includes(normalizedQuery)
    );
  });
}
