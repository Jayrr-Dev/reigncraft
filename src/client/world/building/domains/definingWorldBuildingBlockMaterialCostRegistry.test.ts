import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import {
  DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_DECORATIVE,
  DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_FLOORS,
  DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_ORES,
  DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_REFINED,
} from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import {
  checkingWorldBuildingBlockMaterialAffordable,
  DEFINING_WORLD_BUILDING_BLOCK_DYE_FLOWER_QUANTITY_PER_LAYER,
  DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_QUANTITY_PER_LAYER,
  formattingWorldBuildingBlockMaterialCostReadout,
  listingWorldBuildingBlockMaterialCostDefinitionIds,
  resolvingWorldBuildingBlockMaterialCost,
} from '@/components/world/building/domains/definingWorldBuildingBlockMaterialCostRegistry';
import {
  checkingWorldBuildingBlockDefinitionIsPaletteVisible,
  listingWorldBuildingPaletteBlockDefinitionsByCategory,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_ROSE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { describe, expect, it } from 'vitest';

function creatingInventoryStateWithSlots(
  slots: readonly {
    readonly itemTypeId: string;
    readonly quantity: number;
  }[]
): DefiningInventoryState {
  return {
    capacity: 36,
    slots: slots.map((slot, index) => ({
      id: `test-slot-${index}`,
      itemTypeId: slot.itemTypeId,
      quantity: slot.quantity,
      slotIndex: index,
    })),
  };
}

describe('definingWorldBuildingBlockMaterialCostRegistry', () => {
  it('registers a cost for every visible wood, ore, refined, and flower palette block', () => {
    const visibleMaterialBlocks = [
      ...listingWorldBuildingPaletteBlockDefinitionsByCategory(
        DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_FLOORS
      ),
      ...listingWorldBuildingPaletteBlockDefinitionsByCategory(
        DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_ORES
      ),
      ...listingWorldBuildingPaletteBlockDefinitionsByCategory(
        DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_REFINED
      ),
      ...listingWorldBuildingPaletteBlockDefinitionsByCategory(
        DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_DECORATIVE
      ),
    ].filter(checkingWorldBuildingBlockDefinitionIsPaletteVisible);

    expect(visibleMaterialBlocks.length).toBeGreaterThan(0);

    for (const definition of visibleMaterialBlocks) {
      const cost = resolvingWorldBuildingBlockMaterialCost(definition.id);

      expect(cost).not.toBeNull();
      expect(cost?.requirements.length).toBeGreaterThan(0);

      for (const requirement of cost?.requirements ?? []) {
        expect(requirement.itemTypeId.length).toBeGreaterThan(0);
        expect(requirement.quantityPerLayer).toBeGreaterThan(0);
      }
    }
  });

  it('lists tree floors, dyed wood, stone, ore, ingot, and flower blocks in the cost registry', () => {
    const costIds = listingWorldBuildingBlockMaterialCostDefinitionIds();

    expect(costIds).toContain('basic:floor:tree-oak');
    expect(costIds).toContain('basic:floor:dyed-rose');
    expect(costIds).toContain('basic:wall:stone');
    expect(costIds).toContain('basic:wall:ore-iron');
    expect(costIds).toContain('basic:wall:ingot-iron');
    expect(costIds).toContain('decorative:flower:rose');
  });

  it('formats flower block palette cost as wood plus flower', () => {
    expect(
      formattingWorldBuildingBlockMaterialCostReadout(
        'decorative:flower:foxglove'
      )
    ).toBe(
      `${DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_QUANTITY_PER_LAYER} Wood + ${DEFINING_WORLD_BUILDING_BLOCK_DYE_FLOWER_QUANTITY_PER_LAYER} Foxglove`
    );
  });

  it('requires three wood for a tree floor placement', () => {
    const definitionId = 'basic:floor:tree-oak';
    const cost = resolvingWorldBuildingBlockMaterialCost(definitionId);

    expect(cost?.requirements).toEqual([
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantityPerLayer:
          DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_QUANTITY_PER_LAYER,
        itemLabel: 'Wood',
      },
    ]);

    expect(
      checkingWorldBuildingBlockMaterialAffordable(
        creatingInventoryStateWithSlots([
          {
            itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
            quantity: 2,
          },
        ]),
        definitionId
      )
    ).toBe(false);

    expect(
      checkingWorldBuildingBlockMaterialAffordable(
        creatingInventoryStateWithSlots([
          {
            itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
            quantity: 3,
          },
        ]),
        definitionId
      )
    ).toBe(true);
  });

  it('requires wood plus flower dye for stained wood floors', () => {
    const definitionId = 'basic:floor:dyed-rose';
    const cost = resolvingWorldBuildingBlockMaterialCost(definitionId);

    expect(cost?.requirements).toEqual([
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantityPerLayer:
          DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_QUANTITY_PER_LAYER,
        itemLabel: 'Wood',
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_ROSE,
        quantityPerLayer:
          DEFINING_WORLD_BUILDING_BLOCK_DYE_FLOWER_QUANTITY_PER_LAYER,
        itemLabel: 'Rose',
      },
    ]);

    expect(
      checkingWorldBuildingBlockMaterialAffordable(
        creatingInventoryStateWithSlots([
          {
            itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
            quantity: 3,
          },
        ]),
        definitionId
      )
    ).toBe(false);

    expect(
      checkingWorldBuildingBlockMaterialAffordable(
        creatingInventoryStateWithSlots([
          {
            itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
            quantity: 3,
          },
          {
            itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_ROSE,
            quantity: 1,
          },
        ]),
        definitionId
      )
    ).toBe(true);
  });

  it('requires three wood plus one flower for solid flower dye blocks', () => {
    const definitionId = 'decorative:flower:rose';
    const cost = resolvingWorldBuildingBlockMaterialCost(definitionId);

    expect(cost?.requirements).toEqual([
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantityPerLayer:
          DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_QUANTITY_PER_LAYER,
        itemLabel: 'Wood',
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_ROSE,
        quantityPerLayer:
          DEFINING_WORLD_BUILDING_BLOCK_DYE_FLOWER_QUANTITY_PER_LAYER,
        itemLabel: 'Rose',
      },
    ]);

    expect(
      checkingWorldBuildingBlockMaterialAffordable(
        creatingInventoryStateWithSlots([
          {
            itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
            quantity: 3,
          },
        ]),
        definitionId
      )
    ).toBe(false);

    expect(
      checkingWorldBuildingBlockMaterialAffordable(
        creatingInventoryStateWithSlots([
          {
            itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
            quantity: 3,
          },
          {
            itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_ROSE,
            quantity: 1,
          },
        ]),
        definitionId
      )
    ).toBe(true);
  });
});
