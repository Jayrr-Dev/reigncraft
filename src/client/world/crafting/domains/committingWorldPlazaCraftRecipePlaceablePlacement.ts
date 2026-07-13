/**
 * Post-placement ingredient commit for placeable craft recipes.
 *
 * @module components/world/crafting/domains/committingWorldPlazaCraftRecipePlaceablePlacement
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { consumingWorldPlazaCraftRecipeIngredients } from '@/components/world/crafting/domains/consumingWorldPlazaCraftRecipeIngredients';
import type { DefiningWorldPlazaCraftModeRecipeDefinition } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';

export type CommittingWorldPlazaCraftRecipePlaceablePlacementResult =
  | {
      readonly outcome: 'committed';
      readonly nextState: DefiningInventoryState;
    }
  | {
      readonly outcome: 'missing-materials';
    }
  | {
      readonly outcome: 'not-placeable-recipe';
    };

/**
 * Consumes recipe ingredients after a validated placement succeeds.
 *
 * @param inventoryState - Fresh inventory state at commit time
 * @param recipeDefinition - Armed placeable recipe
 */
export function committingWorldPlazaCraftRecipePlaceablePlacement(
  inventoryState: DefiningInventoryState,
  recipeDefinition: DefiningWorldPlazaCraftModeRecipeDefinition
): CommittingWorldPlazaCraftRecipePlaceablePlacementResult {
  if (recipeDefinition.outcome.kind !== 'entity') {
    return { outcome: 'not-placeable-recipe' };
  }

  const consumeResult = consumingWorldPlazaCraftRecipeIngredients(
    inventoryState,
    recipeDefinition
  );

  if (consumeResult.outcome !== 'consumed') {
    return { outcome: 'missing-materials' };
  }

  return {
    outcome: 'committed',
    nextState: consumeResult.nextState,
  };
}
