import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BESSEMER_FORGE,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_STOVE,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BESSEMER_FORGE_COPPER_INGOT_COST,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BESSEMER_FORGE_IRON_INGOT_COST,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BESSEMER_FORGE_IRON_TUBE_COST,
  resolvingWorldPlazaCraftModeRecipeDefinition,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import {
  checkingWorldPlazaOreSmeltingFuelItemTypeId,
  checkingWorldPlazaOreSmeltingStationBlockDefinitionId,
  DEFINING_WORLD_PLAZA_ORE_SMELTING_RECIPE_REGISTRY,
  resolvingWorldPlazaOreSmeltingFuelUnitsCost,
  resolvingWorldPlazaOreSmeltingFuelUnitsCostForRecipe,
  resolvingWorldPlazaOreSmeltingRecipe,
} from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingRegistry';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOWL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CROCK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CUP,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_STEEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_IRON_TUBE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_MERCURY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SCARLET,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_BOWL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CROCK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CUP,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_TEAPOT,
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
    expect(DEFINING_WORLD_PLAZA_ORE_SMELTING_RECIPE_REGISTRY).toHaveLength(12);
  });

  it('fires wet clay ware into empty cups, teapots, bowls, and crocks', () => {
    expect(
      resolvingWorldPlazaOreSmeltingRecipe(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CUP
      )?.outputItemTypeId
    ).toBe(DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CUP);
    expect(
      resolvingWorldPlazaOreSmeltingRecipe(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_TEAPOT
      )?.outputItemTypeId
    ).toBe(DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT);
    expect(
      resolvingWorldPlazaOreSmeltingRecipe(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_BOWL
      )?.outputItemTypeId
    ).toBe(DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOWL);
    expect(
      resolvingWorldPlazaOreSmeltingRecipe(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CROCK
      )?.outputItemTypeId
    ).toBe(DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CROCK);
  });

  it('only allows wet clay ware at a clay kiln', () => {
    expect(
      resolvingWorldPlazaOreSmeltingRecipe(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CUP,
        DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN
      )
    ).not.toBeNull();
    expect(
      resolvingWorldPlazaOreSmeltingRecipe(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CUP,
        DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY
      )
    ).toBeNull();
    expect(
      resolvingWorldPlazaOreSmeltingRecipe(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_TEAPOT,
        DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_STOVE
      )
    ).toBeNull();
    expect(
      resolvingWorldPlazaOreSmeltingRecipe(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
        DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY
      )
    ).not.toBeNull();
  });

  it('refines iron ingots into steel only at a Bessemer forge', () => {
    expect(
      resolvingWorldPlazaOreSmeltingRecipe(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
        DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BESSEMER_FORGE
      )?.outputItemTypeId
    ).toBe(DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_STEEL);
    expect(
      resolvingWorldPlazaOreSmeltingRecipe(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
        DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY
      )
    ).toBeNull();
    expect(
      resolvingWorldPlazaOreSmeltingRecipe(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
        DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BESSEMER_FORGE
      )
    ).toBeNull();
  });

  it('registers the Bessemer forge as a smelting station', () => {
    expect(
      checkingWorldPlazaOreSmeltingStationBlockDefinitionId(
        DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BESSEMER_FORGE
      )
    ).toBe(true);
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

  it('gives each recipe a fixed duration and fuel multiplier', () => {
    const iron = resolvingWorldPlazaOreSmeltingRecipe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON
    );
    const scarlet = resolvingWorldPlazaOreSmeltingRecipe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SCARLET
    );
    const steel = resolvingWorldPlazaOreSmeltingRecipe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON
    );

    expect(iron?.durationMs).toBe(6_000);
    expect(iron?.fuelCostMultiplier).toBe(2);
    expect(scarlet?.durationMs).toBe(10_000);
    expect(scarlet?.fuelCostMultiplier).toBe(3);
    expect(steel?.durationMs).toBe(9_000);
    expect(steel?.fuelCostMultiplier).toBe(3);
    expect(
      resolvingWorldPlazaOreSmeltingFuelUnitsCostForRecipe(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
        iron!
      )
    ).toBe(2);
    expect(
      resolvingWorldPlazaOreSmeltingFuelUnitsCostForRecipe(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        scarlet!
      )
    ).toBe(9);
  });
});

describe('Bessemer forge craft recipe', () => {
  it('costs iron tubes, copper ingots, and iron ingots', () => {
    const recipe = resolvingWorldPlazaCraftModeRecipeDefinition(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.BESSEMER_FORGE
    );

    expect(recipe?.recipeType).toBe('entity');
    expect(recipe?.ingredients).toEqual([
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_IRON_TUBE,
        quantity:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BESSEMER_FORGE_IRON_TUBE_COST,
      },
      {
        itemTypeId: 'world-plaza-ingot-copper',
        quantity:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BESSEMER_FORGE_COPPER_INGOT_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
        quantity:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BESSEMER_FORGE_IRON_INGOT_COST,
      },
    ]);
    expect(recipe?.outcome).toEqual({
      kind: 'entity',
      blockDefinitionId:
        DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BESSEMER_FORGE,
      blockHeight: 1,
    });
  });
});
