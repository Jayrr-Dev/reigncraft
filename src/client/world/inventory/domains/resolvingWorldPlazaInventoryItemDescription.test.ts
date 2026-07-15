import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_CORPUS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDescriptionCorpus';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEFINITIONS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { DEFINING_WORLD_PLAZA_TALL_GRASS_INVENTORY_ITEM_SEEDS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryTallGrassItemCatalog';
import { resolvingWorldPlazaInventoryItemDescription } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDescription';
import { DEFINING_WILDLIFE_SPECIALTY_LOOT_ITEM_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeSpecialtyLootItemCatalog';
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

  it('returns specialty loot and tall-grass copy from source catalogs', () => {
    const milk = DEFINING_WILDLIFE_SPECIALTY_LOOT_ITEM_CATALOG.find(
      (entry) => entry.itemTypeId === 'world-plaza-wildlife-milk'
    );
    const burrowFluff = DEFINING_WORLD_PLAZA_TALL_GRASS_INVENTORY_ITEM_SEEDS.find(
      (seed) => seed.typeId === 'world-plaza-burrow-fluff'
    );

    expect(milk).toBeDefined();
    expect(burrowFluff).toBeDefined();
    expect(
      resolvingWorldPlazaInventoryItemDescription('world-plaza-wildlife-milk')
    ).toBe(milk!.description);
    expect(
      resolvingWorldPlazaInventoryItemDescription('world-plaza-burrow-fluff')
    ).toBe(burrowFluff!.description);
  });

  it('falls back to the item name when the corpus has no entry', () => {
    expect(
      resolvingWorldPlazaInventoryItemDescription('unknown-item', {
        fallbackName: 'Mystery Relic',
      })
    ).toBe('Mystery Relic');
  });
});
