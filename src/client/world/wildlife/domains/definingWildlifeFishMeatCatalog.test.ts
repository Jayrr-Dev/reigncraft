/**
 * Fish meat wildlife bridge tests.
 *
 * @module components/world/wildlife/domains/definingWildlifeFishMeatCatalog.test
 */

import { listingWorldPlazaFishingCatchCreatures } from '@/components/world/fishing/domains/definingWorldPlazaFishingCatchRegistry';
import {
  checkingWildlifeFishMeatSpeciesId,
  DEFINING_WILDLIFE_FISH_MEAT_CATALOG,
  parsingWildlifeFishMeatSpeciesIdFromItemTypeId,
} from '@/components/world/wildlife/domains/definingWildlifeFishMeatCatalog';
import { resolvingWildlifeFishMeatItemDescriptionEntry } from '@/components/world/wildlife/domains/definingWildlifeFishMeatItemDescriptionCorpus';
import { resolvingWildlifeMeatCookRecipeByRawItemTypeId } from '@/components/world/wildlife/domains/definingWildlifeMeatCookRecipes';
import { resolvingWildlifeMeatCatalogEntry } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';
import { describe, expect, it } from 'vitest';

describe('definingWildlifeFishMeatCatalog', () => {
  it('mirrors every fishing catch creature', () => {
    const creatures = listingWorldPlazaFishingCatchCreatures();

    expect(DEFINING_WILDLIFE_FISH_MEAT_CATALOG).toHaveLength(creatures.length);

    for (const creature of creatures) {
      expect(checkingWildlifeFishMeatSpeciesId(creature.catchId)).toBe(true);
      expect(
        parsingWildlifeFishMeatSpeciesIdFromItemTypeId(creature.rawItemTypeId)
      ).toBe(creature.catchId);
      expect(
        parsingWildlifeFishMeatSpeciesIdFromItemTypeId(
          creature.cookedItemTypeId
        )
      ).toBe(creature.catchId);

      const meat = resolvingWildlifeMeatCatalogEntry(creature.catchId);
      expect(meat?.rawItemTypeId).toBe(creature.rawItemTypeId);
      expect(meat?.cookedItemTypeId).toBe(creature.cookedItemTypeId);
      expect(
        resolvingWildlifeMeatCookRecipeByRawItemTypeId(creature.rawItemTypeId)
      ).not.toBeNull();
      expect(
        resolvingWildlifeFishMeatItemDescriptionEntry(creature.catchId)
          ?.rawDescription
      ).toBeTruthy();
    }
  });

  it('ignores non-fish item types', () => {
    expect(
      parsingWildlifeFishMeatSpeciesIdFromItemTypeId('world-plaza-raw-boar-meat')
    ).toBeNull();
  });
});
