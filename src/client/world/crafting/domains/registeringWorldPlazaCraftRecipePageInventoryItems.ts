/**
 * Builds inventory item definitions for craft recipe pages (one per registry recipe).
 *
 * Double-click attaches the page to the matching cookbook. Already-attached pages
 * stay in inventory and refuse a second attach.
 *
 * @module components/world/crafting/domains/registeringWorldPlazaCraftRecipePageInventoryItems
 */

import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import {
  resolvingWorldPlazaCraftRecipePageItemTypeId,
  type DefiningWorldPlazaCraftModeRecipeId,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { resolvingWorldPlazaCraftRecipePageSpriteSheetIcon } from '@/components/world/crafting/domains/definingWorldPlazaCraftRecipePageSpriteSheetConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

/**
 * Item type rows for every craft recipe page, registry order.
 */
export function registeringWorldPlazaCraftRecipePageInventoryItems(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY.map(
    (recipeDefinition) => ({
      typeId: resolvingWorldPlazaCraftRecipePageItemTypeId(recipeDefinition.id),
      name: `${recipeDefinition.title} Recipe Page`,
      tooltip: `Double-click to attach ${recipeDefinition.title} to your cookbook. Already attached pages stay put.`,
      rarity: 'uncommon' as const,
      iconSpriteSheet: resolvingWorldPlazaCraftRecipePageSpriteSheetIcon(
        recipeDefinition.cookbookId
      ),
      iconifyIcon: 'mdi:book-open-page-variant',
      maxStack: 1,
      isDroppable: true,
      isStackable: false,
      recipePage: {
        recipeId: recipeDefinition.id,
      },
    })
  );
}

/**
 * Resolves the craft recipe id linked to a recipe-page inventory item, or null.
 *
 * @param itemTypeId - Inventory item type id
 */
export function resolvingWorldPlazaCraftRecipeIdFromPageItemTypeId(
  itemTypeId: string
): DefiningWorldPlazaCraftModeRecipeId | null {
  const prefix = 'world-plaza-recipe-page:';
  if (!itemTypeId.startsWith(prefix)) {
    return null;
  }

  const recipeId = itemTypeId.slice(prefix.length);
  const recipeDefinition = DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY.find(
    (entry) => entry.id === recipeId
  );

  return recipeDefinition?.id ?? null;
}
