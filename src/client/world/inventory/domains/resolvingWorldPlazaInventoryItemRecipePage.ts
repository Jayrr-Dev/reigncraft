/**
 * Resolves whether an inventory item is a craft cookbook recipe page.
 *
 * @module components/world/inventory/domains/resolvingWorldPlazaInventoryItemRecipePage
 */

import type { DefiningWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEFINITIONS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';

/**
 * Returns the linked recipe id when this item is a recipe page, else null.
 *
 * @param itemTypeId - Inventory item type id
 */
export function resolvingWorldPlazaInventoryItemRecipePageRecipeId(
  itemTypeId: string
): DefiningWorldPlazaCraftModeRecipeId | null {
  const definition = DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEFINITIONS.find(
    (entry) => entry.typeId === itemTypeId
  );

  return definition?.recipePage?.recipeId ?? null;
}

/**
 * True when the item is a cookbook recipe page.
 *
 * @param itemTypeId - Inventory item type id
 */
export function checkingWorldPlazaInventoryItemIsRecipePage(
  itemTypeId: string
): boolean {
  return (
    resolvingWorldPlazaInventoryItemRecipePageRecipeId(itemTypeId) !== null
  );
}
