/**
 * Builds player-facing claim dialog content from a milestone reward definition.
 *
 * @module components/home/domains/resolvingPlazaCodexMilestoneRewardClaimDialogModel
 */

import type { PlazaCodexMilestoneRewardDefinition } from '@/components/home/domains/definingPlazaCodexMilestoneRewardRegistry';
import { resolvingWorldPlazaCraftModeRecipeDefinition } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import type { DefiningWorldPlazaCraftModeRecipeVisual } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { resolvingWorldPlazaInventoryStorageExpansionPageSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryStorageExpansionPageSpriteSheetConstants';
import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

export type PlazaCodexMilestoneRewardClaimDialogModel = {
  readonly title: string;
  readonly description: string;
  readonly recipeVisual: DefiningWorldPlazaCraftModeRecipeVisual | null;
  readonly itemSpriteSheet: DefiningWorldPlazaInventorySpriteSheetIcon | null;
};

/**
 * Resolves title, short description, and art for the claim dialog.
 * Prefers registry claim copy; falls back to craft recipe description when blank.
 */
export function resolvingPlazaCodexMilestoneRewardClaimDialogModel(
  definition: PlazaCodexMilestoneRewardDefinition
): PlazaCodexMilestoneRewardClaimDialogModel {
  if (definition.reward.kind === 'attach-recipe') {
    const recipe = resolvingWorldPlazaCraftModeRecipeDefinition(
      definition.reward.recipeId
    );

    return {
      title: definition.reward.label,
      description:
        definition.reward.description || (recipe?.description ?? ''),
      recipeVisual: recipe?.recipeVisual ?? null,
      itemSpriteSheet: null,
    };
  }

  return {
    title: definition.reward.label,
    description: definition.reward.description,
    recipeVisual: null,
    itemSpriteSheet: resolvingWorldPlazaInventoryStorageExpansionPageSpriteSheetIcon(
      definition.reward.pageTier
    ),
  };
}
