/**
 * Declarative craft recipe registry.
 *
 * To add a recipe, append one object to
 * {@link DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY}:
 *
 * ```ts
 * {
 *   id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.MY_RECIPE,
 *   cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.SURVIVAL,
 *   title: 'My Recipe',
 *   description: 'What the player reads on the left page.',
 *   recipeVisual: { visualKind: 'iconify', recipeEmblemIconifyIcon: 'mdi:hammer' },
 *   ingredients: [
 *     { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE, quantity: 3 },
 *   ],
 *   recipeType: 'entity', // or 'item'
 *   outcome: {
 *     kind: 'entity',
 *     blockDefinitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_...,
 *     blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
 *   },
 *   // item example:
 *   // recipeType: 'item',
 *   // outcome: { kind: 'item', itemTypeId: '...', quantity: 1 },
 * }
 * ```
 *
 * Also add the id to {@link DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID}.
 * A recipe-page inventory item is registered automatically from this list.
 * The recipe only appears in its cookbook after that page is attached.
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
 * Append new recipes here — Guides, page items, and attach gating follow automatically.
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
    recipeType: 'entity',
    outcome: {
      kind: 'entity',
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
