/**
 * Claims a Codex milestone reward (idempotent cookbook attach).
 *
 * @module components/home/domains/claimingPlazaCodexMilestoneReward
 */

import type { PlazaCodexMilestoneRewardDefinition } from '@/components/home/domains/definingPlazaCodexMilestoneRewardRegistry';
import {
  attachingWorldPlazaRecipePage,
  type AttachingWorldPlazaRecipePageResult,
} from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';

export type ClaimingPlazaCodexMilestoneRewardResult =
  | AttachingWorldPlazaRecipePageResult
  | 'not-ready';

/**
 * Grants the milestone reward when the chest is reached.
 * Attach-recipe rewards unlock the cookbook page immediately.
 *
 * @param definition - Registry row for the chest
 * @param isReached - Whether the meter has hit this chest threshold
 */
export function claimingPlazaCodexMilestoneReward(
  definition: PlazaCodexMilestoneRewardDefinition,
  isReached: boolean
): ClaimingPlazaCodexMilestoneRewardResult {
  if (!isReached) {
    return 'not-ready';
  }

  if (definition.reward.kind === 'attach-recipe') {
    return attachingWorldPlazaRecipePage(definition.reward.recipeId);
  }

  return 'not-ready';
}

/**
 * True when an attach-recipe reward is already in the cookbook.
 */
export function checkingPlazaCodexMilestoneRewardClaimed(
  definition: PlazaCodexMilestoneRewardDefinition,
  attachedRecipeIds: ReadonlySet<string>
): boolean {
  if (definition.reward.kind === 'attach-recipe') {
    return attachedRecipeIds.has(definition.reward.recipeId);
  }

  return false;
}
