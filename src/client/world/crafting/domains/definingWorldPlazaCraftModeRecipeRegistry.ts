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

import {
  DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT,
  DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
} from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_STOVE,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID } from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import {
  DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND,
  resolvingWorldPlazaBlacksmithUtilitySpriteSheetIcon,
} from '@/components/world/building/domains/definingWorldPlazaBlacksmithUtilitySpriteConstants';
import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID,
  type DefiningWorldPlazaCraftModeRecipeDefinition,
  type DefiningWorldPlazaCraftModeRecipeId,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BEAR_TRAP,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CALTROPS,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CUP,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_COLUMN_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_ROW_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_URL,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryCeramicsSpriteSheetConstants';
import {
  DEFINING_WORLD_PLAZA_BEAR_TRAP_SPRITE_SHEET_COLUMN_COUNT,
  DEFINING_WORLD_PLAZA_BEAR_TRAP_SPRITE_SHEET_ROW_COUNT,
  DEFINING_WORLD_PLAZA_BEAR_TRAP_SPRITE_SHEET_URL,
} from '@/components/world/trap/domains/definingWorldPlazaBearTrapConstants';
import {
  DEFINING_WORLD_PLAZA_CALTROP_SPRITE_SHEET_COLUMN_COUNT,
  DEFINING_WORLD_PLAZA_CALTROP_SPRITE_SHEET_ROW_COUNT,
  DEFINING_WORLD_PLAZA_CALTROP_SPRITE_SHEET_URL,
} from '@/components/world/trap/domains/definingWorldPlazaCaltropConstants';
import { DEFINING_WORLD_PLAZA_CRAFT_RECIPE_NEARBY_STATION_RANGE_TILES } from '@/components/world/crafting/domains/definingWorldPlazaCraftRecipeNearbyStationConstants';

/** Campfire recipe ingredient counts. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_STONE_COST = 8;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_WOOD_COST = 5;

/** Anvil recipe ingredient counts. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ANVIL_STONE_COST = 12;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ANVIL_IRON_COST = 6;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ANVIL_WOOD_COST = 4;

/** Bloomery recipe ingredient counts. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BLOOMERY_CLAY_COST = 10;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BLOOMERY_STONE_COST = 8;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BLOOMERY_WOOD_COST = 4;

/** Clay kiln recipe ingredient counts (2x2 footprint). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_KILN_CLAY_COST = 16;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_KILN_STONE_COST = 8;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_KILN_WOOD_COST = 4;

/** Clay stove recipe ingredient counts. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_STOVE_CLAY_COST = 8;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_STOVE_STONE_COST = 4;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_STOVE_COAL_COST = 2;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_STOVE_IRON_INGOT_COST = 2;

/** Wet clay ware shaping costs (Ceramics cookbook). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_WET_CLAY_CUP_WET_CLAY_COST = 1;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_WET_CLAY_TEAPOT_WET_CLAY_COST = 2;

/** Bear trap smith recipe ingredient counts (requires nearby anvil). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BEAR_TRAP_IRON_INGOT_COST = 3;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BEAR_TRAP_WOOD_COST = 2;

/** Caltrops smith recipe ingredient counts (requires nearby anvil). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CALTROPS_IRON_INGOT_COST = 1;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CALTROPS_OUTPUT_QUANTITY = 3;

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
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.ANVIL,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.BLACKSMITH,
    title: 'Anvil',
    description:
      'A heavy iron face on a stone base. The first honest workbench of any forge.',
    recipeVisual: {
      visualKind: 'sprite-sheet',
      spriteSheetIcon: resolvingWorldPlazaBlacksmithUtilitySpriteSheetIcon(
        DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.ANVIL
      ),
    },
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ANVIL_STONE_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ANVIL_IRON_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ANVIL_WOOD_COST,
      },
    ],
    recipeType: 'entity',
    outcome: {
      kind: 'entity',
      blockDefinitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL,
      blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT,
    },
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.BLOOMERY,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.BLACKSMITH,
    title: 'Bloomery',
    description:
      'A clay shaft furnace that turns mined metal ore into workable ingots.',
    recipeVisual: {
      visualKind: 'sprite-sheet',
      spriteSheetIcon: resolvingWorldPlazaBlacksmithUtilitySpriteSheetIcon(
        DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.BLOOMERY
      ),
    },
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BLOOMERY_CLAY_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BLOOMERY_STONE_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BLOOMERY_WOOD_COST,
      },
    ],
    recipeType: 'entity',
    outcome: {
      kind: 'entity',
      blockDefinitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
      blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT,
    },
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.BEAR_TRAP,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.BLACKSMITH,
    title: 'Bear Trap',
    description:
      'A sprung iron jaw for ground snares. Hammer it at an anvil; it will not take shape in the open field.',
    recipeVisual: {
      visualKind: 'sprite-sheet',
      spriteSheetIcon: {
        spriteSheetUrl: DEFINING_WORLD_PLAZA_BEAR_TRAP_SPRITE_SHEET_URL,
        columnCount: DEFINING_WORLD_PLAZA_BEAR_TRAP_SPRITE_SHEET_COLUMN_COUNT,
        rowCount: DEFINING_WORLD_PLAZA_BEAR_TRAP_SPRITE_SHEET_ROW_COUNT,
        columnIndex: 0,
        rowIndex: 0,
      },
    },
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
        quantity:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BEAR_TRAP_IRON_INGOT_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BEAR_TRAP_WOOD_COST,
      },
    ],
    recipeType: 'item',
    requiredNearbyBlockDefinitionId:
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL,
    requiredNearbyBlockRangeTiles:
      DEFINING_WORLD_PLAZA_CRAFT_RECIPE_NEARBY_STATION_RANGE_TILES,
    outcome: {
      kind: 'item',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BEAR_TRAP,
      quantity: 1,
    },
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CALTROPS,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.BLACKSMITH,
    title: 'Caltrops',
    description:
      'Scattered iron spikes. Hammer a handful at an anvil; walking onto them slows and bleeds, then the cluster is spent.',
    recipeVisual: {
      visualKind: 'sprite-sheet',
      spriteSheetIcon: {
        spriteSheetUrl: DEFINING_WORLD_PLAZA_CALTROP_SPRITE_SHEET_URL,
        columnCount: DEFINING_WORLD_PLAZA_CALTROP_SPRITE_SHEET_COLUMN_COUNT,
        rowCount: DEFINING_WORLD_PLAZA_CALTROP_SPRITE_SHEET_ROW_COUNT,
        columnIndex: 0,
        rowIndex: 0,
      },
    },
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
        quantity:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CALTROPS_IRON_INGOT_COST,
      },
    ],
    recipeType: 'item',
    requiredNearbyBlockDefinitionId:
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL,
    requiredNearbyBlockRangeTiles:
      DEFINING_WORLD_PLAZA_CRAFT_RECIPE_NEARBY_STATION_RANGE_TILES,
    outcome: {
      kind: 'item',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CALTROPS,
      quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CALTROPS_OUTPUT_QUANTITY,
    },
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CLAY_KILN,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.CERAMICS,
    title: 'Clay Kiln',
    description:
      'A beehive of packed clay for firing ore, brick, and wet clay ware. Needs a full 2 by 2 pad of clear ground.',
    recipeVisual: {
      visualKind: 'sprite-sheet',
      spriteSheetIcon: resolvingWorldPlazaBlacksmithUtilitySpriteSheetIcon(
        DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.CLAY_KILN
      ),
    },
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_KILN_CLAY_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_KILN_STONE_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_KILN_WOOD_COST,
      },
    ],
    recipeType: 'entity',
    outcome: {
      kind: 'entity',
      blockDefinitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
      blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT,
    },
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CLAY_STOVE,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.CERAMICS,
    title: 'Clay Stove',
    description:
      'A short clay hearth with a dark cook plate. Smaller than a kiln, still hungry for coal.',
    recipeVisual: {
      visualKind: 'sprite-sheet',
      spriteSheetIcon: resolvingWorldPlazaBlacksmithUtilitySpriteSheetIcon(
        DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.CLAY_STOVE
      ),
    },
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_STOVE_CLAY_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_STOVE_STONE_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_STOVE_COAL_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
        quantity:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_STOVE_IRON_INGOT_COST,
      },
    ],
    recipeType: 'entity',
    outcome: {
      kind: 'entity',
      blockDefinitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_STOVE,
      blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT,
    },
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WET_CLAY_CUP,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.CERAMICS,
    title: 'Wet Clay Cup',
    description:
      'Press wet clay into a small cup. Soft until you fire it in a kiln with coal.',
    recipeVisual: {
      visualKind: 'sprite-sheet',
      spriteSheetIcon: {
        spriteSheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_URL,
        columnCount:
          DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_COLUMN_COUNT,
        rowCount:
          DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_ROW_COUNT,
        columnIndex: 0,
        rowIndex: 0,
      },
    },
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY,
        quantity:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_WET_CLAY_CUP_WET_CLAY_COST,
      },
    ],
    recipeType: 'item',
    outcome: {
      kind: 'item',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CUP,
      quantity: 1,
    },
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WET_CLAY_TEAPOT,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.CERAMICS,
    title: 'Wet Clay Tea Pot',
    description:
      'Shape wet clay into a teapot. Fire the greenware in a kiln with coal before it can brew.',
    recipeVisual: {
      visualKind: 'sprite-sheet',
      spriteSheetIcon: {
        spriteSheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_URL,
        columnCount:
          DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_COLUMN_COUNT,
        rowCount:
          DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_ROW_COUNT,
        columnIndex: 1,
        rowIndex: 0,
      },
    },
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY,
        quantity:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_WET_CLAY_TEAPOT_WET_CLAY_COST,
      },
    ],
    recipeType: 'item',
    outcome: {
      kind: 'item',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_TEAPOT,
      quantity: 1,
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
