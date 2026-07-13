/**
 * Resolves live owned/required ingredient rows for cookbook UI.
 *
 * @module components/world/crafting/domains/resolvingWorldPlazaCraftRecipeIngredientRows
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { countingWorldPlazaInventoryItemTypeQuantity } from '@/components/world/crafting/domains/countingWorldPlazaInventoryItemTypeQuantity';
import type {
  DefiningWorldPlazaCraftModeRecipeDefinition,
  DefiningWorldPlazaCraftModeRecipeIngredientRow,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';

/**
 * Builds display rows with owned/required counts for one recipe.
 *
 * @param inventoryState - Current inventory state
 * @param recipeDefinition - Recipe to render
 */
export function resolvingWorldPlazaCraftRecipeIngredientRows(
  inventoryState: DefiningInventoryState,
  recipeDefinition: DefiningWorldPlazaCraftModeRecipeDefinition
): readonly DefiningWorldPlazaCraftModeRecipeIngredientRow[] {
  return recipeDefinition.ingredients.map((ingredient) => {
    const ownedQuantity = countingWorldPlazaInventoryItemTypeQuantity(
      inventoryState,
      ingredient.itemTypeId
    );
    const itemDefinition =
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY[ingredient.itemTypeId];

    return {
      itemTypeId: ingredient.itemTypeId,
      displayName: itemDefinition?.name ?? ingredient.itemTypeId,
      ownedQuantity,
      requiredQuantity: ingredient.quantity,
      isShort: ownedQuantity < ingredient.quantity,
    };
  });
}
