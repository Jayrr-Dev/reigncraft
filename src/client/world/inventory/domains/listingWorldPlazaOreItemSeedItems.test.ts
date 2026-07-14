import { DEFINING_WORLD_PLAZA_DEV_QA_CRAFT_INGREDIENT_SEED_QUANTITY } from '@/components/world/domains/definingWorldPlazaDevQaLoadConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ORE_ITEM_TYPE_IDS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { listingWorldPlazaOreItemSeedItems } from '@/components/world/inventory/domains/listingWorldPlazaOreItemSeedItems';
import { describe, expect, it } from 'vitest';

describe('listingWorldPlazaOreItemSeedItems', () => {
  it('returns one row per ore item type at the Dev QA seed quantity', () => {
    const seedItems = listingWorldPlazaOreItemSeedItems();

    expect(seedItems).toHaveLength(
      DEFINING_WORLD_PLAZA_INVENTORY_ORE_ITEM_TYPE_IDS.length
    );
    expect(seedItems.map((item) => item.itemTypeId)).toEqual([
      ...DEFINING_WORLD_PLAZA_INVENTORY_ORE_ITEM_TYPE_IDS,
    ]);
    expect(
      seedItems.every(
        (item) =>
          item.quantity === DEFINING_WORLD_PLAZA_DEV_QA_CRAFT_INGREDIENT_SEED_QUANTITY
      )
    ).toBe(true);
  });
});
