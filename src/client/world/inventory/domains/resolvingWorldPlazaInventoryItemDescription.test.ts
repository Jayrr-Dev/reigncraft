import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_CORPUS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDescriptionCorpus';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEFINITIONS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { resolvingWorldPlazaInventoryItemDescription } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDescription';
import { describe, expect, it } from 'vitest';

describe('definingWorldPlazaInventoryItemDescriptionCorpus', () => {
  it('covers every registered world plaza item type', () => {
    for (const definition of DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEFINITIONS) {
      expect(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_CORPUS[
          definition.typeId
        ],
        `missing description for ${definition.typeId}`
      ).toBeTruthy();
    }
  });
});

describe('resolvingWorldPlazaInventoryItemDescription', () => {
  it('returns per-species meat copy for known items', () => {
    expect(
      resolvingWorldPlazaInventoryItemDescription('world-plaza-raw-wolf-meat')
    ).toBe(
      'Meat from the hunter that was stalking you. Raw wolf risks wolf fever: no jump or roll, then confusion.'
    );
    expect(
      resolvingWorldPlazaInventoryItemDescription(
        'world-plaza-cooked-omega-wolf-meat'
      )
    ).toBe(
      'Slow-cooked until the iron smell fades. Richer than grey wolf and more filling. May sharpen strikes, skew rolls toward crits, and siphon life from physical hits.'
    );
  });

  it('falls back to the item name when the corpus has no entry', () => {
    expect(
      resolvingWorldPlazaInventoryItemDescription('unknown-item', {
        fallbackName: 'Mystery Relic',
      })
    ).toBe('Mystery Relic');
  });
});
