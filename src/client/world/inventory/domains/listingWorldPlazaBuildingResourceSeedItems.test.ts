import {
  listingWorldBuildingBlockMaterialCostDefinitionIds,
  resolvingWorldBuildingBlockMaterialCost,
} from '@/components/world/building/domains/definingWorldBuildingBlockMaterialCostRegistry';
import { DEFINING_WORLD_PLAZA_DEV_QA_CRAFT_INGREDIENT_SEED_QUANTITY } from '@/components/world/domains/definingWorldPlazaDevQaLoadConstants';
import { listingWorldPlazaBuildingResourceSeedItems } from '@/components/world/inventory/domains/listingWorldPlazaBuildingResourceSeedItems';
import { describe, expect, it } from 'vitest';

describe('listingWorldPlazaBuildingResourceSeedItems', () => {
  it('returns unique rows in group order at the Creative seed quantity', () => {
    const seedItems = listingWorldPlazaBuildingResourceSeedItems();
    const itemTypeIds = seedItems.map((item) => item.itemTypeId);

    expect(new Set(itemTypeIds).size).toBe(itemTypeIds.length);
    expect(
      seedItems.every(
        (item) =>
          item.quantity ===
          DEFINING_WORLD_PLAZA_DEV_QA_CRAFT_INGREDIENT_SEED_QUANTITY
      )
    ).toBe(true);
  });

  it('covers every Materials palette material cost item type', () => {
    const seededItemTypeIds = new Set(
      listingWorldPlazaBuildingResourceSeedItems().map(
        (item) => item.itemTypeId
      )
    );

    for (const definitionId of listingWorldBuildingBlockMaterialCostDefinitionIds()) {
      const cost = resolvingWorldBuildingBlockMaterialCost(definitionId);
      expect(cost).not.toBeNull();

      for (const requirement of cost!.requirements) {
        expect(seededItemTypeIds.has(requirement.itemTypeId)).toBe(true);
      }
    }
  });
});
