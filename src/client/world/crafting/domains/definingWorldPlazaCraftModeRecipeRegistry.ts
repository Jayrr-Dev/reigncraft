/**
 * Declarative craft recipe registry.
 *
 * @module components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry
 */

import { DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE } from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID } from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID,
  type DefiningWorldPlazaCraftModeRecipeDefinition,
  type DefiningWorldPlazaCraftModeRecipeId,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

/** Campfire recipe ingredient counts. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_STONE_COST = 8;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_WOOD_COST = 5;

/**
 * All registered craft recipes in cookbook pager order.
 */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY = [
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CAMPFIRE,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.SURVIVAL,
    title: 'Campfire',
    description:
      'A stone ring and dry wood for warmth, cooking, and light on claimed ground.',
    recipeVisual: { visualKind: 'world-plaza-campfire' },
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_STONE_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_WOOD_COST,
      },
    ],
    outcome: {
      kind: 'placeable',
      blockDefinitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
      blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
    },
  },
] as const satisfies readonly DefiningWorldPlazaCraftModeRecipeDefinition[];

/**
 * Resolves one recipe definition by id, or null when unknown.
 *
 * @param recipeId - Craft recipe id
 */
export function resolvingWorldPlazaCraftModeRecipeDefinition(
  recipeId: string
): DefiningWorldPlazaCraftModeRecipeDefinition | null {
  return (
    DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY.find(
      (recipeDefinition) => recipeDefinition.id === recipeId
    ) ?? null
  );
}

/**
 * Type guard for a known craft recipe id.
 *
 * @param recipeId - Candidate recipe id
 */
export function checkingWorldPlazaCraftModeRecipeId(
  recipeId: string
): recipeId is DefiningWorldPlazaCraftModeRecipeId {
  return resolvingWorldPlazaCraftModeRecipeDefinition(recipeId) !== null;
}
