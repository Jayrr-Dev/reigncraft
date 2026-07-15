/**
 * Blacksmith craft recipes for basic Iron Plate armour.
 *
 * @module components/world/crafting/domains/registeringWorldPlazaIronPlateArmorCraftModeRecipes
 */

import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID } from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID,
  type DefiningWorldPlazaCraftModeItemRecipeDefinition,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { DEFINING_WORLD_PLAZA_CRAFT_RECIPE_NEARBY_STATION_RANGE_TILES } from '@/components/world/crafting/domains/definingWorldPlazaCraftRecipeNearbyStationConstants';
import { DEFINING_WORLD_PLAZA_IRON_PLATE_ARMOR_PIECE_REGISTRY } from '@/components/world/equipment/domains/definingWorldPlazaIronPlateArmorSetRegistry';
import { resolvingWorldPlazaInventoryIronPlateArmorSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryIronPlateArmorSpriteSheetConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

const DEFINING_WORLD_PLAZA_IRON_PLATE_ARMOR_RECIPE_BY_ITEM_TYPE_ID: Record<
  string,
  {
    readonly recipeId: (typeof DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID)[keyof typeof DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID];
    readonly complexity: number;
    readonly ironIngotCost: number;
    readonly leatherCost: number;
  }
> = {
  'world-plaza-iron-plate-casque': {
    recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.IRON_PLATE_CASQUE,
    complexity: 3,
    ironIngotCost: 3,
    leatherCost: 0,
  },
  'world-plaza-iron-plate-gauntlets': {
    recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.IRON_PLATE_GAUNTLETS,
    complexity: 3,
    ironIngotCost: 2,
    leatherCost: 1,
  },
  'world-plaza-iron-plate-breastplate': {
    recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.IRON_PLATE_BREASTPLATE,
    complexity: 4,
    ironIngotCost: 5,
    leatherCost: 1,
  },
  'world-plaza-iron-plate-greaves': {
    recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.IRON_PLATE_GREAVES,
    complexity: 3,
    ironIngotCost: 3,
    leatherCost: 0,
  },
  'world-plaza-iron-plate-sabatons': {
    recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.IRON_PLATE_SABATONS,
    complexity: 3,
    ironIngotCost: 2,
    leatherCost: 1,
  },
};

export function registeringWorldPlazaIronPlateArmorCraftModeRecipes(): readonly DefiningWorldPlazaCraftModeItemRecipeDefinition[] {
  return DEFINING_WORLD_PLAZA_IRON_PLATE_ARMOR_PIECE_REGISTRY.map((piece) => {
    const seed =
      DEFINING_WORLD_PLAZA_IRON_PLATE_ARMOR_RECIPE_BY_ITEM_TYPE_ID[
        piece.itemTypeId
      ];

    if (!seed) {
      throw new Error(`Missing Iron Plate armor recipe: ${piece.itemTypeId}`);
    }

    const spriteSheetIcon =
      resolvingWorldPlazaInventoryIronPlateArmorSpriteSheetIcon(
        piece.itemTypeId
      );

    if (!spriteSheetIcon) {
      throw new Error(`Missing Iron Plate armor sprite: ${piece.itemTypeId}`);
    }

    const ingredients: {
      readonly itemTypeId: string;
      readonly quantity: number;
    }[] = [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
        quantity: seed.ironIngotCost,
      },
    ];

    if (seed.leatherCost > 0) {
      ingredients.push({
        itemTypeId: 'world-plaza-wildlife-leather',
        quantity: seed.leatherCost,
      });
    }

    return {
      id: seed.recipeId,
      cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.BLACKSMITH,
      title: piece.displayName,
      description: piece.tooltip,
      recipeVisual: {
        visualKind: 'sprite-sheet',
        spriteSheetIcon,
      },
      ingredients,
      recipeType: 'item',
      complexity: seed.complexity,
      requiredNearbyBlockDefinitionId:
        DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL,
      requiredNearbyBlockRangeTiles:
        DEFINING_WORLD_PLAZA_CRAFT_RECIPE_NEARBY_STATION_RANGE_TILES,
      outcome: {
        kind: 'item',
        itemTypeId: piece.itemTypeId,
        quantity: 1,
      },
    };
  });
}
