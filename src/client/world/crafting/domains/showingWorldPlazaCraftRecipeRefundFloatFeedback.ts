/**
 * Shows heal-style floating +amount numbers for craft refunds.
 *
 * @module components/world/crafting/domains/showingWorldPlazaCraftRecipeRefundFloatFeedback
 */

import type { DefiningWorldPlazaCraftModeRecipeDefinition } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';

/**
 * Enqueues one green +amount float per ingredient row (stacked above the player).
 *
 * @param enqueueHealAmountFloat - Player HUD float hook (no health change)
 * @param recipeDefinition - Recipe whose ingredient quantities to display
 */
export function showingWorldPlazaCraftRecipeRefundFloatFeedback(
  enqueueHealAmountFloat: (amount: number) => void,
  recipeDefinition: DefiningWorldPlazaCraftModeRecipeDefinition
): void {
  for (const ingredient of recipeDefinition.ingredients) {
    enqueueHealAmountFloat(ingredient.quantity);
  }
}
