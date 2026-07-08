import { DEFINING_WORLD_PLAZA_INVENTORY_BAG_ITEM_DESCRIPTION_ENTRIES } from '@/components/world/inventory/domains/definingWorldPlazaInventoryBagItemDescriptionCorpus';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EXPEDITION_BAG,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUCKSACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { describe, expect, it } from 'vitest';

const DEFINING_WORLD_PLAZA_INVENTORY_BAG_ITEM_TYPE_IDS = [
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUCKSACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EXPEDITION_BAG,
] as const;

describe('definingWorldPlazaInventoryBagItemDescriptionCorpus', () => {
  it('covers every bag item type', () => {
    expect(
      DEFINING_WORLD_PLAZA_INVENTORY_BAG_ITEM_DESCRIPTION_ENTRIES
    ).toHaveLength(DEFINING_WORLD_PLAZA_INVENTORY_BAG_ITEM_TYPE_IDS.length);

    for (const typeId of DEFINING_WORLD_PLAZA_INVENTORY_BAG_ITEM_TYPE_IDS) {
      const entry =
        DEFINING_WORLD_PLAZA_INVENTORY_BAG_ITEM_DESCRIPTION_ENTRIES.find(
          (candidate) => candidate.typeId === typeId
        );

      expect(
        entry?.description,
        `missing description for ${typeId}`
      ).toBeTruthy();
    }
  });
});
