/**
 * Biome filter chips for the wildlife dev spawner.
 *
 * @module components/world/wildlife/domains/listingWildlifeDevSpawnBiomeFilters
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { DEFINING_WILDLIFE_BIOME_SPAWN_TABLE } from '@/components/world/wildlife/domains/definingWildlifeBiomeSpawnTable';

export type DefiningWildlifeDevSpawnBiomeFilterId =
  | 'all'
  | DefiningWorldPlazaBiomeKind;

export type DefiningWildlifeDevSpawnBiomeFilter = {
  readonly id: DefiningWildlifeDevSpawnBiomeFilterId;
  readonly label: string;
};

const DEFINING_WILDLIFE_DEV_SPAWN_BIOME_LABELS: Record<
  DefiningWorldPlazaBiomeKind,
  string
> = {
  plains: 'Plains',
  forest: 'Forest',
  flower_forest: 'Flower forest',
  jungle: 'Jungle',
  desert: 'Desert',
  snowy_plains: 'Snowy plains',
  swamp: 'Swamp',
  savanna: 'Savanna',
  badlands: 'Badlands',
  beach: 'Beach',
  ocean: 'Ocean',
  rocky: 'Rocky',
  firelands: 'Firelands',
};

/** Ordered biome chips that have at least one spawn-table entry. */
export function listingWildlifeDevSpawnBiomeFilters(): readonly DefiningWildlifeDevSpawnBiomeFilter[] {
  const biomeFilters = (
    Object.keys(
      DEFINING_WILDLIFE_BIOME_SPAWN_TABLE
    ) as DefiningWorldPlazaBiomeKind[]
  )
    .filter((biomeKind) => {
      const config = DEFINING_WILDLIFE_BIOME_SPAWN_TABLE[biomeKind];
      return Boolean(config && config.entries.length > 0);
    })
    .map((biomeKind) => ({
      id: biomeKind,
      label: DEFINING_WILDLIFE_DEV_SPAWN_BIOME_LABELS[biomeKind],
    }))
    .sort((left, right) => left.label.localeCompare(right.label));

  return [{ id: 'all', label: 'All' }, ...biomeFilters];
}
