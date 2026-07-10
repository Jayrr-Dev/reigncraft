import { describe, expect, it } from 'vitest';

import { listingWildlifeSpeciesIdsForBiomeKinds } from '@/components/world/wildlife/domains/listingWildlifeSpeciesIdsForBiomeKinds';

describe('listingWildlifeSpeciesIdsForBiomeKinds', () => {
  it('returns plains species ordered by spawn weight', () => {
    const speciesIds = listingWildlifeSpeciesIdsForBiomeKinds(['plains']);

    expect(speciesIds[0]).toBe('cow');
    expect(speciesIds).toContain('sheep');
    expect(speciesIds).not.toContain('giraffe');
  });

  it('caps the roster to the highest-weight species', () => {
    const speciesIds = listingWildlifeSpeciesIdsForBiomeKinds(['plains'], 4);

    expect(speciesIds).toEqual(['cow', 'sheep', 'chicken', 'pig']);
  });

  it('unions species across multiple biomes', () => {
    const speciesIds = listingWildlifeSpeciesIdsForBiomeKinds([
      'plains',
      'savanna',
    ]);

    expect(speciesIds).toContain('cow');
    expect(speciesIds).toContain('zebra');
    expect(speciesIds).not.toContain('polar-bear');
  });
});
