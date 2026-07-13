import { resolvingWorldPlazaCraftModeRecipeDefinition } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { showingWorldPlazaCraftRecipeRefundFloatFeedback } from '@/components/world/crafting/domains/showingWorldPlazaCraftRecipeRefundFloatFeedback';
import { describe, expect, it, vi } from 'vitest';

describe('showingWorldPlazaCraftRecipeRefundFloatFeedback', () => {
  it('enqueues one item-gain float per ingredient with item type and quantity', () => {
    const campfireRecipe = resolvingWorldPlazaCraftModeRecipeDefinition(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CAMPFIRE
    );
    expect(campfireRecipe).not.toBeNull();
    if (!campfireRecipe) {
      return;
    }

    const enqueueItemGainFloat = vi.fn();
    showingWorldPlazaCraftRecipeRefundFloatFeedback(
      enqueueItemGainFloat,
      campfireRecipe
    );

    expect(enqueueItemGainFloat).toHaveBeenCalledTimes(
      campfireRecipe.ingredients.length
    );
    for (const ingredient of campfireRecipe.ingredients) {
      expect(enqueueItemGainFloat).toHaveBeenCalledWith(
        ingredient.itemTypeId,
        ingredient.quantity
      );
    }
  });
});
