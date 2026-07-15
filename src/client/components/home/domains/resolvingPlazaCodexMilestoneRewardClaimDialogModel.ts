/**
 * Builds player-facing claim dialog content from a milestone reward definition.
 *
 * @module components/home/domains/resolvingPlazaCodexMilestoneRewardClaimDialogModel
 */

import type { PlazaCodexMilestoneRewardDefinition } from '@/components/home/domains/definingPlazaCodexMilestoneRewardRegistry';
import { resolvingWorldPlazaCraftModeRecipeDefinition } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import type { DefiningWorldPlazaCraftModeRecipeVisual } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';

export type PlazaCodexMilestoneRewardClaimDialogModel = {
  readonly title: string;
  readonly description: string;
  readonly recipeVisual: DefiningWorldPlazaCraftModeRecipeVisual | null;
};

/**
 * Resolves title, short description, and recipe art for the claim dialog.
 * Prefers registry claim copy; falls back to craft recipe description when blank.
 */
export function resolvingPlazaCodexMilestoneRewardClaimDialogModel(
  definition: PlazaCodexMilestoneRewardDefinition
): PlazaCodexMilestoneRewardClaimDialogModel {
  const recipe =
    definition.reward.kind === 'attach-recipe'
      ? resolvingWorldPlazaCraftModeRecipeDefinition(definition.reward.recipeId)
      : null;

  return {
    title: definition.reward.label,
    description: definition.reward.description || (recipe?.description ?? ''),
    recipeVisual: recipe?.recipeVisual ?? null,
  };
}
