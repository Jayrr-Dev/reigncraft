/**
 * Blacksmith craft recipes for specialty signature weapons.
 *
 * @module components/world/crafting/domains/registeringWorldPlazaSpecialtyWeaponCraftModeRecipes
 */

import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID } from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID,
  type DefiningWorldPlazaCraftModeItemRecipeDefinition,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { DEFINING_WORLD_PLAZA_CRAFT_RECIPE_NEARBY_STATION_RANGE_TILES } from '@/components/world/crafting/domains/definingWorldPlazaCraftRecipeNearbyStationConstants';
import { DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_REGISTRY } from '@/components/world/equipment/domains/definingWorldPlazaSpecialtyWeaponRegistry';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_STEEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { resolvingWorldPlazaInventoryLateWeaponSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryLateWeaponSpriteSheetConstants';

const DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_RECIPE_BY_ITEM_TYPE_ID: Record<
  string,
  {
    readonly recipeId: (typeof DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID)[keyof typeof DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID];
    readonly complexity: number;
    readonly ingredients: readonly {
      readonly itemTypeId: string;
      readonly quantity: number;
    }[];
  }
> = {
  'world-plaza-weapon-chaos-die': {
    recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WEAPON_CHAOS_DIE,
    complexity: 8,
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_STEEL,
        quantity: 6,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantity: 2,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE,
        quantity: 12,
      },
    ],
  },
  'world-plaza-weapon-quiet-hand': {
    recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WEAPON_QUIET_HAND,
    complexity: 8,
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_STEEL,
        quantity: 5,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantity: 2,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE,
        quantity: 10,
      },
    ],
  },
  'world-plaza-weapon-glass-needle': {
    recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WEAPON_GLASS_NEEDLE,
    complexity: 7,
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_GOLD,
        quantity: 4,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantity: 1,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE,
        quantity: 8,
      },
    ],
  },
  'world-plaza-weapon-siphon-fang': {
    recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WEAPON_SIPHON_FANG,
    complexity: 7,
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_STEEL,
        quantity: 4,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantity: 2,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE,
        quantity: 10,
      },
    ],
  },
  'world-plaza-weapon-fated-ledger': {
    recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WEAPON_FATED_LEDGER,
    complexity: 9,
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_GOLD,
        quantity: 5,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantity: 2,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE,
        quantity: 16,
      },
    ],
  },
  'world-plaza-weapon-soft-clay-cleaver': {
    recipeId:
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WEAPON_SOFT_CLAY_CLEAVER,
    complexity: 9,
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_STEEL,
        quantity: 4,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY,
        quantity: 8,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE,
        quantity: 14,
      },
    ],
  },
};

export function registeringWorldPlazaSpecialtyWeaponCraftModeRecipes(): readonly DefiningWorldPlazaCraftModeItemRecipeDefinition[] {
  return DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_REGISTRY.filter(
    (weapon) => weapon.obtainMethod === 'craft'
  ).map((weapon) => {
    const seed =
      DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_RECIPE_BY_ITEM_TYPE_ID[
        weapon.itemTypeId
      ];

    if (!seed) {
      throw new Error(`Missing specialty weapon recipe: ${weapon.itemTypeId}`);
    }

    const spriteSheetIcon =
      resolvingWorldPlazaInventoryLateWeaponSpriteSheetIcon(weapon.itemTypeId);

    if (!spriteSheetIcon) {
      throw new Error(`Missing specialty weapon sprite: ${weapon.itemTypeId}`);
    }

    return {
      id: seed.recipeId,
      cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.BLACKSMITH,
      title: weapon.displayName,
      description: weapon.tooltip,
      recipeVisual: {
        visualKind: 'sprite-sheet',
        spriteSheetIcon,
      },
      ingredients: seed.ingredients,
      recipeType: 'item',
      complexity: seed.complexity,
      requiredNearbyBlockDefinitionId:
        DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL,
      requiredNearbyBlockRangeTiles:
        DEFINING_WORLD_PLAZA_CRAFT_RECIPE_NEARBY_STATION_RANGE_TILES,
      outcome: {
        kind: 'item',
        itemTypeId: weapon.itemTypeId,
        quantity: 1,
      },
    };
  });
}
