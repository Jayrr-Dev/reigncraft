import type { PlazaBiomesRarityFilterId } from '@/components/home/domains/definingPlazaBiomesGuideConstants';
import type { PlazaBiomesGuideDisplayEntry } from '@/components/home/domains/resolvingPlazaBiomesGuideDisplayEntries';

/**
 * Keeps every biome or only those matching the active rarity tab.
 *
 * @param entries - Resolved biomes guide rows.
 * @param filterId - Active rarity filter tab.
 */
export function filteringPlazaBiomesGuideDisplayEntriesByRarity(
  entries: readonly PlazaBiomesGuideDisplayEntry[],
  filterId: PlazaBiomesRarityFilterId
): PlazaBiomesGuideDisplayEntry[] {
  if (filterId === 'all') {
    return [...entries];
  }

  return entries.filter((entry) => entry.rarity === filterId);
}
