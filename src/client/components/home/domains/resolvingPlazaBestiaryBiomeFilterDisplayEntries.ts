import { LABELING_PLAZA_BIOMES_UNDISCOVERED_NAME } from '@/components/home/domains/definingPlazaBiomesGuideConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import type { DefiningWildlifeDevSpawnBiomeFilter } from '@/components/world/wildlife/domains/listingWildlifeDevSpawnBiomeFilters';

export type PlazaBestiaryBiomeFilterDisplayEntry = {
  id: DefiningWildlifeDevSpawnBiomeFilter['id'];
  label: string;
  isExplored: boolean;
};

/**
 * Resolves bestiary biome filter chips, masking names until that biome is explored.
 */
export function resolvingPlazaBestiaryBiomeFilterDisplayEntries(
  filters: readonly DefiningWildlifeDevSpawnBiomeFilter[],
  exploredBiomeKinds: ReadonlySet<DefiningWorldPlazaBiomeKind>
): PlazaBestiaryBiomeFilterDisplayEntry[] {
  return filters.map((filter) => {
    if (filter.id === 'all') {
      return {
        id: filter.id,
        label: filter.label,
        isExplored: true,
      };
    }

    const isExplored = exploredBiomeKinds.has(filter.id);

    return {
      id: filter.id,
      label: isExplored
        ? filter.label
        : LABELING_PLAZA_BIOMES_UNDISCOVERED_NAME,
      isExplored,
    };
  });
}
