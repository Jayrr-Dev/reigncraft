/**
 * Shows item-gain floating +amount numbers for craft refunds.
 *
 * @module components/world/crafting/domains/showingWorldPlazaCraftRecipeRefundFloatFeedback
 */

import type { DefiningWorldPlazaCraftModeRecipeDefinition } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';

/**
 * Enqueues one gold material float per ingredient row (stacked above the player).
 *
 * @param enqueueItemGainFloat - Player HUD float hook (glyph + quantity, no health change)
 * @param recipeDefinition - Recipe whose ingredient quantities to display
 */
export function showingWorldPlazaCraftRecipeRefundFloatFeedback(
  enqueueItemGainFloat: (itemTypeId: string, amount: number) => void,
  recipeDefinition: DefiningWorldPlazaCraftModeRecipeDefinition
): void {
  for (const ingredient of recipeDefinition.ingredients) {
    enqueueItemGainFloat(ingredient.itemTypeId, ingredient.quantity);
  }
}
