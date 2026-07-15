import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_BASIC } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import {
  checkingWorldBuildingBlockMaterialAffordable,
  DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_QUANTITY_PER_LAYER,
  listingWorldBuildingBlockMaterialCostDefinitionIds,
  resolvingWorldBuildingBlockMaterialCost,
} from '@/components/world/building/domains/definingWorldBuildingBlockMaterialCostRegistry';
import {
  checkingWorldBuildingBlockDefinitionIsPaletteVisible,
  listingWorldBuildingPaletteBlockDefinitionsByCategory,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { describe, expect, it } from 'vitest';

function creatingInventoryStateWithQuantity(
  itemTypeId: string,
  quantity: number
): DefiningInventoryState {
  return {
    capacity: 36,
    slots: [
      {
        id: 'test-slot-item',
        itemTypeId,
        quantity,
        slotIndex: 0,
      },
    ],
  };
}

describe('definingWorldBuildingBlockMaterialCostRegistry', () => {
  it('registers a cost for every visible basic palette block', () => {
    const visibleBasicBlocks =
      listingWorldBuildingPaletteBlockDefinitionsByCategory(
        DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_BASIC
      ).filter(checkingWorldBuildingBlockDefinitionIsPaletteVisible);

    expect(visibleBasicBlocks.length).toBeGreaterThan(0);

    for (const definition of visibleBasicBlocks) {
      const cost = resolvingWorldBuildingBlockMaterialCost(definition.id);

      expect(cost).not.toBeNull();
      expect(cost?.quantityPerLayer).toBe(
        DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_QUANTITY_PER_LAYER
      );
      expect(cost?.itemTypeId.length).toBeGreaterThan(0);
    }
  });

  it('lists tree floors, stone, and ore walls in the cost registry', () => {
    const costIds = listingWorldBuildingBlockMaterialCostDefinitionIds();

    expect(costIds).toContain('basic:floor:tree-oak');
    expect(costIds).toContain('basic:wall:stone');
    expect(costIds).toContain('basic:wall:ore-iron');
  });

  it('requires three wood for a tree floor placement', () => {
    const definitionId = 'basic:floor:tree-oak';
    const cost = resolvingWorldBuildingBlockMaterialCost(definitionId);

    expect(cost?.itemTypeId).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD
    );
    expect(cost?.quantityPerLayer).toBe(3);

    expect(
      checkingWorldBuildingBlockMaterialAffordable(
        creatingInventoryStateWithQuantity(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
          2
        ),
        definitionId
      )
    ).toBe(false);

    expect(
      checkingWorldBuildingBlockMaterialAffordable(
        creatingInventoryStateWithQuantity(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
          3
        ),
        definitionId
      )
    ).toBe(true);
  });
});
