import {
  checkingWorldPlazaOreSmeltingFuelItemTypeId,
  DEFINING_WORLD_PLAZA_ORE_SMELTING_RECIPE_REGISTRY,
  resolvingWorldPlazaOreSmeltingFuelUnitsCost,
  resolvingWorldPlazaOreSmeltingRecipe,
} from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingRegistry';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_MERCURY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SCARLET,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { describe, expect, it } from 'vitest';

describe('ore smelting registry', () => {
  it('maps metal ores to their refined outputs', () => {
    expect(
      resolvingWorldPlazaOreSmeltingRecipe(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON
      )?.outputItemTypeId
    ).toBe(DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON);
    expect(
      resolvingWorldPlazaOreSmeltingRecipe(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SCARLET
      )?.outputItemTypeId
    ).toBe(DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_MERCURY);
    expect(DEFINING_WORLD_PLAZA_ORE_SMELTING_RECIPE_REGISTRY).toHaveLength(6);
  });

  it('accepts wood or coal as fuel and rejects clay as ore', () => {
    expect(
      checkingWorldPlazaOreSmeltingFuelItemTypeId(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD
      )
    ).toBe(true);
    expect(
      checkingWorldPlazaOreSmeltingFuelItemTypeId(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL
      )
    ).toBe(true);
    expect(
      resolvingWorldPlazaOreSmeltingRecipe(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY
      )
    ).toBeNull();
  });

  it('makes wood 3× less efficient than coal as fuel', () => {
    expect(
      resolvingWorldPlazaOreSmeltingFuelUnitsCost(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL
      )
    ).toBe(1);
    expect(
      resolvingWorldPlazaOreSmeltingFuelUnitsCost(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD
      )
    ).toBe(3);
    expect(
      resolvingWorldPlazaOreSmeltingFuelUnitsCost(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON
      )
    ).toBeNull();
  });
});
