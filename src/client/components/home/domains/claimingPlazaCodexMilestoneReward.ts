/**
 * Claims a Codex milestone reward (idempotent cookbook attach / storage unlock).
 *
 * @module components/home/domains/claimingPlazaCodexMilestoneReward
 */

import type { PlazaCodexMilestoneRewardDefinition } from '@/components/home/domains/definingPlazaCodexMilestoneRewardRegistry';
import {
  attachingWorldPlazaRecipePage,
  type AttachingWorldPlazaRecipePageResult,
} from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';
import {
  checkingWorldPlazaInventoryStorageExpansionCodexClaimed,
  claimingWorldPlazaInventoryStorageExpansionCodexReward,
  type ClaimingWorldPlazaInventoryStorageExpansionCodexResult,
} from '@/components/world/inventory/domains/managingWorldPlazaInventoryStorageExpansionStore';

export type ClaimingPlazaCodexMilestoneRewardResult =
  | AttachingWorldPlazaRecipePageResult
  | ClaimingWorldPlazaInventoryStorageExpansionCodexResult
  | 'not-ready';

/**
 * Grants the milestone reward when the chest is reached.
 * Attach-recipe rewards unlock the cookbook page immediately.
 * Unlock-storage-row rewards add one bonus pack page (cap 3).
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

  if (definition.reward.kind === 'unlock-storage-row') {
    return claimingWorldPlazaInventoryStorageExpansionCodexReward({
      sectionId: definition.sectionId,
      meterKind: definition.meterKind,
      percent: definition.percent,
    });
  }

  return 'not-ready';
}

/**
 * True when an attach-recipe reward is already in the cookbook, or a
 * storage-expansion Codex chest was already claimed.
 */
export function checkingPlazaCodexMilestoneRewardClaimed(
  definition: PlazaCodexMilestoneRewardDefinition,
  attachedRecipeIds: ReadonlySet<string>
): boolean {
  if (definition.reward.kind === 'attach-recipe') {
    return attachedRecipeIds.has(definition.reward.recipeId);
  }

  if (definition.reward.kind === 'unlock-storage-row') {
    return checkingWorldPlazaInventoryStorageExpansionCodexClaimed({
      sectionId: definition.sectionId,
      meterKind: definition.meterKind,
      percent: definition.percent,
    });
  }

  return false;
}
