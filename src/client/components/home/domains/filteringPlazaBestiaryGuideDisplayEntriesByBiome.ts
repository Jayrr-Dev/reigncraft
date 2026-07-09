import type { PlazaBestiaryGuideDisplayEntry } from '@/components/home/domains/resolvingPlazaBestiaryGuideDisplayEntries';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import type { DefiningWildlifeDevSpawnBiomeFilterId } from '@/components/world/wildlife/domains/listingWildlifeDevSpawnBiomeFilters';

/**
 * Filters bestiary display entries by biome spawn membership.
 */
export function filteringPlazaBestiaryGuideDisplayEntriesByBiome(
  entries: readonly PlazaBestiaryGuideDisplayEntry[],
  biomeFilterId: DefiningWildlifeDevSpawnBiomeFilterId
): PlazaBestiaryGuideDisplayEntry[] {
  if (biomeFilterId === 'all') {
    return [...entries];
  }

  return entries.filter((entry) => entry.biomeKinds.includes(biomeFilterId));
}
