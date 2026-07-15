/**
 * Builds blacksmith item recipes for every tiered tool.
 *
 * @module components/world/crafting/domains/registeringWorldPlazaCraftModeToolRecipes
 */

import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID } from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import type { DefiningWorldPlazaCraftModeItemRecipeDefinition } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_FAMILIES,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_FAMILY_DELTA,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_FAMILY_SPECS,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_INGOT_BY_TIER,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_TIER_COST,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_TIERS,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeToolRecipeConstants';
import { resolvingWorldPlazaCraftModeToolRecipeSpriteSheetIcon } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeToolRecipeIconConstants';
import { DEFINING_WORLD_PLAZA_CRAFT_RECIPE_NEARBY_STATION_RANGE_TILES } from '@/components/world/crafting/domains/definingWorldPlazaCraftRecipeNearbyStationConstants';
import { DEFINING_WORLD_PLAZA_TOOL_TIER_STATS } from '@/components/world/equipment/domains/definingWorldPlazaToolTierConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

/**
 * Expands family × tier specs into blacksmith cookbook item recipes.
 */
export function registeringWorldPlazaCraftModeToolRecipes(): readonly DefiningWorldPlazaCraftModeItemRecipeDefinition[] {
  const recipes: DefiningWorldPlazaCraftModeItemRecipeDefinition[] = [];

  for (const family of DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_FAMILIES) {
    const familySpec =
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_FAMILY_SPECS.find(
        (spec) => spec.family === family
      );

    if (!familySpec) {
      continue;
    }

    const familyDelta =
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_FAMILY_DELTA[family];

    for (const tier of DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_TIERS) {
      const tierCost =
        DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_TIER_COST[tier];
      const woodQuantity = Math.max(
        0,
        tierCost.woodQuantity + familyDelta.woodDelta
      );
      const stoneQuantity = Math.max(
        0,
        tierCost.stoneQuantity + familyDelta.stoneDelta
      );
      const ingotQuantity = Math.max(
        0,
        tierCost.ingotQuantity + familyDelta.ingotDelta
      );
      const ingotItemTypeId =
        DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_INGOT_BY_TIER[tier];
      const ingredients = [
        ...(woodQuantity > 0
          ? [
              {
                itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
                quantity: woodQuantity,
              },
            ]
          : []),
        ...(stoneQuantity > 0
          ? [
              {
                itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
                quantity: stoneQuantity,
              },
            ]
          : []),
        ...(ingotQuantity > 0 && ingotItemTypeId
          ? [
              {
                itemTypeId: ingotItemTypeId,
                quantity: Math.max(1, ingotQuantity),
              },
            ]
          : []),
      ];

      recipes.push({
        id: familySpec.recipeIdByTier[tier],
        cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.BLACKSMITH,
        title: `${DEFINING_WORLD_PLAZA_TOOL_TIER_STATS[tier].displayNameSuffix} ${familySpec.displayBaseName}`,
        description: familySpec.descriptionByTier[tier],
        recipeVisual: {
          visualKind: 'sprite-sheet',
          spriteSheetIcon:
            resolvingWorldPlazaCraftModeToolRecipeSpriteSheetIcon(family, tier),
        },
        ingredients,
        recipeType: 'item',
        complexity: tierCost.complexity,
        ...(tierCost.requiresAnvil
          ? {
              requiredNearbyBlockDefinitionId:
                DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL,
              requiredNearbyBlockRangeTiles:
                DEFINING_WORLD_PLAZA_CRAFT_RECIPE_NEARBY_STATION_RANGE_TILES,
            }
          : {}),
        outcome: {
          kind: 'item',
          itemTypeId: familySpec.typeIdByTier[tier],
          quantity: 1,
        },
      });
    }
  }

  return recipes;
}
