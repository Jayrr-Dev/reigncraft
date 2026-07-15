/**
 * Blacksmith craft recipes for craftable plate armour tiers.
 *
 * @module components/world/crafting/domains/registeringWorldPlazaCraftablePlateArmorCraftModeRecipes
 */

import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID } from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import type {
  DefiningWorldPlazaCraftModeItemRecipeDefinition,
  DefiningWorldPlazaCraftModeRecipeId,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { DEFINING_WORLD_PLAZA_CRAFT_RECIPE_NEARBY_STATION_RANGE_TILES } from '@/components/world/crafting/domains/definingWorldPlazaCraftRecipeNearbyStationConstants';
import { DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_PIECE_REGISTRY } from '@/components/world/equipment/domains/definingWorldPlazaCraftablePlateArmorSetRegistry';
import { formattingWorldPlazaCraftablePlateArmorRecipeId } from '@/components/world/equipment/domains/definingWorldPlazaCraftablePlateArmorTierRegistry';
import { resolvingWorldPlazaInventoryCraftablePlateArmorSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCraftablePlateArmorSpriteSheetConstants';

export function registeringWorldPlazaCraftablePlateArmorCraftModeRecipes(): readonly DefiningWorldPlazaCraftModeItemRecipeDefinition[] {
  return DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_PIECE_REGISTRY.map(
    (piece) => {
      const spriteSheetIcon =
        resolvingWorldPlazaInventoryCraftablePlateArmorSpriteSheetIcon(
          piece.itemTypeId
        );

      if (!spriteSheetIcon) {
        throw new Error(
          `Missing craftable plate armor sprite: ${piece.itemTypeId}`
        );
      }

      const primaryCost = piece.tier.primaryCostByPiece[piece.pieceKey];
      const strapLeatherCost =
        piece.tier.strapLeatherCostByPiece[piece.pieceKey];

      const ingredients: {
        readonly itemTypeId: string;
        readonly quantity: number;
      }[] = [
        {
          itemTypeId: piece.tier.primaryIngredientItemTypeId,
          quantity: primaryCost,
        },
      ];

      if (strapLeatherCost > 0) {
        ingredients.push({
          itemTypeId: 'world-plaza-wildlife-hide',
          quantity: strapLeatherCost,
        });
      }

      return {
        id: formattingWorldPlazaCraftablePlateArmorRecipeId(
          piece.setId,
          piece.pieceKey
        ) as DefiningWorldPlazaCraftModeRecipeId,
        cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.BLACKSMITH,
        title: piece.displayName,
        description: piece.tooltip,
        recipeVisual: {
          visualKind: 'sprite-sheet',
          spriteSheetIcon,
        },
        ingredients,
        recipeType: 'item',
        complexity: piece.tier.complexityByPiece[piece.pieceKey],
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
    }
  );
}
