import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { creatingWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { checkingWorldPlazaCraftRecipeNearbyStationSatisfied } from '@/components/world/crafting/domains/checkingWorldPlazaCraftRecipeNearbyStationSatisfied';
import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BEAR_TRAP_IRON_INGOT_COST,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BEAR_TRAP_WOOD_COST,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CALTROPS_IRON_INGOT_COST,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CALTROPS_OUTPUT_QUANTITY,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_IRON_TUBE_IRON_INGOT_COST,
  resolvingWorldPlazaCraftModeRecipeDefinition,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { describe, expect, it } from 'vitest';

function creatingPlacedAnvil(
  tileX: number,
  tileY: number
): DefiningWorldBuildingPlacedBlock {
  return {
    blockId: `anvil-${tileX}-${tileY}`,
    plotId: 'plot-1',
    definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL,
    tilePosition: creatingWorldBuildingTilePosition(tileX, tileY),
    worldLayer: 0,
    blockHeight: 1,
    ownerId: 'owner',
    placedAt: '2026-01-01T00:00:00.000Z',
    metadata: {},
  };
}

describe('checkingWorldPlazaCraftRecipeNearbyStationSatisfied', () => {
  const bearTrapRecipe = resolvingWorldPlazaCraftModeRecipeDefinition(
    DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.BEAR_TRAP
  );
  const campfireRecipe = resolvingWorldPlazaCraftModeRecipeDefinition(
    DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CAMPFIRE
  );

  it('requires an anvil within range for the bear trap recipe', () => {
    expect(bearTrapRecipe).not.toBeNull();
    if (!bearTrapRecipe) {
      return;
    }

    expect(
      checkingWorldPlazaCraftRecipeNearbyStationSatisfied({
        recipeDefinition: bearTrapRecipe,
        playerWorldPoint: { x: 10.5, y: 10.5 },
        placedBlocks: [],
      })
    ).toBe(false);

    expect(
      checkingWorldPlazaCraftRecipeNearbyStationSatisfied({
        recipeDefinition: bearTrapRecipe,
        playerWorldPoint: { x: 10.5, y: 10.5 },
        placedBlocks: [creatingPlacedAnvil(10, 10)],
      })
    ).toBe(true);

    expect(
      checkingWorldPlazaCraftRecipeNearbyStationSatisfied({
        recipeDefinition: bearTrapRecipe,
        playerWorldPoint: { x: 10.5, y: 10.5 },
        placedBlocks: [creatingPlacedAnvil(20, 20)],
      })
    ).toBe(false);
  });

  it('allows recipes without a nearby-station requirement', () => {
    expect(campfireRecipe).not.toBeNull();
    if (!campfireRecipe) {
      return;
    }

    expect(
      checkingWorldPlazaCraftRecipeNearbyStationSatisfied({
        recipeDefinition: campfireRecipe,
        playerWorldPoint: { x: 0, y: 0 },
        placedBlocks: [],
      })
    ).toBe(true);
  });

  it('registers bear trap as an anvil-gated item craft', () => {
    expect(bearTrapRecipe?.recipeType).toBe('item');
    expect(bearTrapRecipe?.requiredNearbyBlockDefinitionId).toBe(
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL
    );
    expect(bearTrapRecipe?.ingredients).toEqual([
      {
        itemTypeId: 'world-plaza-ingot-iron',
        quantity:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BEAR_TRAP_IRON_INGOT_COST,
      },
      {
        itemTypeId: 'world-plaza-wood',
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BEAR_TRAP_WOOD_COST,
      },
    ]);
  });

  it('registers caltrops as an anvil-gated item craft', () => {
    const caltropsRecipe = resolvingWorldPlazaCraftModeRecipeDefinition(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CALTROPS
    );

    expect(caltropsRecipe?.recipeType).toBe('item');
    expect(caltropsRecipe?.requiredNearbyBlockDefinitionId).toBe(
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL
    );
    expect(caltropsRecipe?.ingredients).toEqual([
      {
        itemTypeId: 'world-plaza-ingot-iron',
        quantity:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CALTROPS_IRON_INGOT_COST,
      },
    ]);
    expect(caltropsRecipe?.outcome).toEqual({
      kind: 'item',
      itemTypeId: 'world-plaza-caltrops',
      quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CALTROPS_OUTPUT_QUANTITY,
    });
  });

  it('registers iron tube as an anvil-gated item craft', () => {
    const ironTubeRecipe = resolvingWorldPlazaCraftModeRecipeDefinition(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.IRON_TUBE
    );

    expect(ironTubeRecipe?.recipeType).toBe('item');
    expect(ironTubeRecipe?.requiredNearbyBlockDefinitionId).toBe(
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL
    );
    expect(ironTubeRecipe?.ingredients).toEqual([
      {
        itemTypeId: 'world-plaza-ingot-iron',
        quantity:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_IRON_TUBE_IRON_INGOT_COST,
      },
    ]);
    expect(ironTubeRecipe?.outcome).toEqual({
      kind: 'item',
      itemTypeId: 'world-plaza-iron-tube',
      quantity: 1,
    });
  });
});
