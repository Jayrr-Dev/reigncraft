import { DEFINING_WILDLIFE_MEAT_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';
import {
  DEFINING_WILDLIFE_SPECIES_REGISTRY,
  listingWildlifeSpeciesIds,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it } from 'vitest';

describe('definingWildlifeMeatRegistry', () => {
  it('covers every starter species with a raw and cooked meat pair', () => {
    const speciesIds = listingWildlifeSpeciesIds();

    expect(speciesIds.length).toBeGreaterThan(0);

    for (const speciesId of speciesIds) {
      const catalogEntry = DEFINING_WILDLIFE_MEAT_CATALOG.find(
        (entry) => entry.speciesId === speciesId
      );

      expect(
        catalogEntry,
        `missing meat catalog for ${speciesId}`
      ).toBeTruthy();
      expect(catalogEntry?.rawItemTypeId).toMatch(/^world-plaza-raw-/);
      expect(catalogEntry?.cookedItemTypeId).toMatch(/^world-plaza-cooked-/);
      expect(catalogEntry?.rawItemTypeId).not.toBe(
        catalogEntry?.cookedItemTypeId
      );

      const species = DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId];

      expect(species.loot.rawMeatItemTypeId).toBe(catalogEntry?.rawItemTypeId);
      expect(species.loot.quantity).toBeGreaterThan(0);
      expect(catalogEntry?.cookDurationMs).toBeGreaterThan(0);
    }

    const chickenEntry = DEFINING_WILDLIFE_MEAT_CATALOG.find(
      (entry) => entry.speciesId === 'chicken'
    );
    const bearEntry = DEFINING_WILDLIFE_MEAT_CATALOG.find(
      (entry) => entry.speciesId === 'brown-bear'
    );

    expect(chickenEntry?.cookDurationMs).toBeLessThan(
      bearEntry?.cookDurationMs ?? Number.POSITIVE_INFINITY
    );
  });
});
