import {
  DEFINING_WILDLIFE_MEAT_ITEM_DESCRIPTION_ENTRIES,
  resolvingWildlifeMeatItemDescriptionEntry,
} from '@/components/world/wildlife/domains/definingWildlifeMeatItemDescriptionCorpus';
import { DEFINING_WILDLIFE_MEAT_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';
import { describe, expect, it } from 'vitest';

describe('definingWildlifeMeatItemDescriptionCorpus', () => {
  it('covers every wildlife meat catalog species', () => {
    expect(DEFINING_WILDLIFE_MEAT_ITEM_DESCRIPTION_ENTRIES).toHaveLength(
      DEFINING_WILDLIFE_MEAT_CATALOG.length
    );

    for (const meatEntry of DEFINING_WILDLIFE_MEAT_CATALOG) {
      const description = resolvingWildlifeMeatItemDescriptionEntry(
        meatEntry.speciesId
      );

      expect(
        description?.rawDescription,
        `missing raw description for ${meatEntry.speciesId}`
      ).toBeTruthy();
      expect(
        description?.cookedDescription,
        `missing cooked description for ${meatEntry.speciesId}`
      ).toBeTruthy();
    }
  });
});
