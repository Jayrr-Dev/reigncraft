/**
 * Shows inventory-glyph floating +amount numbers for craft refunds.
 *
 * Uses each ingredient's item-type art from the inventory registry
 * (sprite sheet / image / iconify / emoji), so new recipe materials pick up
 * their icons automatically.
 *
 * @module components/world/crafting/domains/showingWorldPlazaCraftRecipeRefundFloatFeedback
 */

import type { DefiningWorldPlazaCraftModeRecipeDefinition } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';

/**
 * Enqueues one item-gain float per ingredient row (stacked above the player).
 *
 * @param enqueueItemGainFloat - Player HUD float hook (registry glyph + quantity)
 * @param recipeDefinition - Recipe whose ingredients to display
 */
export function showingWorldPlazaCraftRecipeRefundFloatFeedback(
  enqueueItemGainFloat: (itemTypeId: string, amount: number) => void,
  recipeDefinition: DefiningWorldPlazaCraftModeRecipeDefinition
): void {
  for (const ingredient of recipeDefinition.ingredients) {
    enqueueItemGainFloat(ingredient.itemTypeId, ingredient.quantity);
  }
}
