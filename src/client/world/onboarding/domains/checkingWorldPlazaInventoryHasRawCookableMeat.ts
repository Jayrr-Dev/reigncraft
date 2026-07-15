import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { resolvingFirstWildlifeMeatCookRecipeInInventory } from '@/components/world/wildlife/domains/definingWildlifeMeatCookRecipes';

/**
 * Returns true when the hotbar holds at least one raw item with a campfire cook recipe.
 */
export function checkingWorldPlazaInventoryHasRawCookableMeat(
  inventoryState: DefiningInventoryState
): boolean {
  const slots = inventoryState.slots.map((slot) => ({
    itemTypeId: slot?.itemTypeId ?? '',
    quantity: slot?.quantity ?? 0,
  }));

  return resolvingFirstWildlifeMeatCookRecipeInInventory(slots) !== null;
}
