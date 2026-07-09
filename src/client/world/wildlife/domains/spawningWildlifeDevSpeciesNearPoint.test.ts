import { listingWildlifeDevSpawnBiomeFilters } from '@/components/world/wildlife/domains/listingWildlifeDevSpawnBiomeFilters';
import { filteringWildlifeDevSpawnSpeciesCatalog } from '@/components/world/wildlife/domains/listingWildlifeDevSpawnSpeciesCatalog';
import {
  creatingWildlifeInstanceStore,
  listingWildlifeInstances,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { spawningWildlifeDevSpeciesNearPoint } from '@/components/world/wildlife/domains/spawningWildlifeDevSpeciesNearPoint';
import { describe, expect, it } from 'vitest';

describe('wildlife dev spawn catalog', () => {
  it('lists All plus biomes that have spawn entries', () => {
    const filters = listingWildlifeDevSpawnBiomeFilters();

    expect(filters[0]?.id).toBe('all');
    expect(filters.some((filter) => filter.id === 'savanna')).toBe(true);
    expect(filters.some((filter) => filter.id === 'ocean')).toBe(false);
  });

  it('filters species by biome and search text', () => {
    const savannaLions = filteringWildlifeDevSpawnSpeciesCatalog({
      biomeFilterId: 'savanna',
      searchQuery: 'lion',
    });

    expect(savannaLions.map((entry) => entry.speciesId)).toEqual(
      expect.arrayContaining(['lion', 'lioness'])
    );
    expect(
      savannaLions.every((entry) => entry.biomeKinds.includes('savanna'))
    ).toBe(true);
  });
});

describe('spawningWildlifeDevSpeciesNearPoint', () => {
  it('spawns the chosen species with the forced aggression level', () => {
    const store = creatingWildlifeInstanceStore();
    const spawned = spawningWildlifeDevSpeciesNearPoint({
      store,
      center: { x: 10, y: 10, layer: 1 },
      speciesId: 'deer',
      aggressionLevel: 'tame',
      nowMs: 4_200,
    });

    expect(spawned).toBe(true);

    const instances = listingWildlifeInstances(store);
    expect(instances).toHaveLength(1);
    expect(instances[0]?.speciesId).toBe('deer');
    expect(instances[0]?.aggressionLevel).toBe('tame');
  });
});
