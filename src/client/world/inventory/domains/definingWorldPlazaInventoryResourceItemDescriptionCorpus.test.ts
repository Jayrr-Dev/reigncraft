import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_RESOURCE_ITEM_DESCRIPTION_ENTRIES } from '@/components/world/inventory/domains/definingWorldPlazaInventoryResourceItemDescriptionCorpus';
import { describe, expect, it } from 'vitest';

const DEFINING_WORLD_PLAZA_INVENTORY_RESOURCE_ITEM_TYPE_IDS = [
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT,
] as const;

describe('definingWorldPlazaInventoryResourceItemDescriptionCorpus', () => {
  it('covers every resource item type', () => {
    expect(
      DEFINING_WORLD_PLAZA_INVENTORY_RESOURCE_ITEM_DESCRIPTION_ENTRIES
    ).toHaveLength(
      DEFINING_WORLD_PLAZA_INVENTORY_RESOURCE_ITEM_TYPE_IDS.length
    );

    for (const typeId of DEFINING_WORLD_PLAZA_INVENTORY_RESOURCE_ITEM_TYPE_IDS) {
      const entry =
        DEFINING_WORLD_PLAZA_INVENTORY_RESOURCE_ITEM_DESCRIPTION_ENTRIES.find(
          (candidate) => candidate.typeId === typeId
        );

      expect(
        entry?.description,
        `missing description for ${typeId}`
      ).toBeTruthy();
    }
  });
});
