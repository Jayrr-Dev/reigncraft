/**
 * Grants Bestiary sighted recipe pages once species sight totals are met.
 *
 * @module components/world/inventory/domains/ensuringWorldPlazaInventoryBestiarySightedRecipeRewards
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { countingWorldPlazaInventoryItemTypeQuantity } from '@/components/world/crafting/domains/countingWorldPlazaInventoryItemTypeQuantity';
import {
  type DefiningWorldPlazaCraftModeRecipeId,
  resolvingWorldPlazaCraftRecipePageItemTypeId,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import {
  DEFINING_WORLD_PLAZA_BESTIARY_SIGHTED_RECIPE_REWARD_REGISTRY,
  type DefiningWorldPlazaBestiarySightedRecipeReward,
} from '@/components/world/domains/definingWorldPlazaBestiarySightedRecipeRewardRegistry';
import { gettingWorldPlazaBestiarySightedSpeciesSnapshot } from '@/components/world/domains/managingWorldPlazaBestiaryDiscoveryStore';
import { checkingWorldPlazaRecipePageAttachedInStore } from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';
import { readingWorldPlazaRecipeDiscoveryFromStorage } from '@/components/world/domains/readingWorldPlazaRecipeDiscoveryFromStorage';
import { addingWorldPlazaInventoryItemWithStacking } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';

export type EnsuringWorldPlazaInventoryBestiarySightedRecipeRewardsOptions = {
  /** Persistence owner used when the in-memory attach store is not hydrated yet. */
  readonly storageOwnerId?: string | null;
  /** Optional sighted species count override (tests). */
  readonly sightedSpeciesCount?: number;
};

export type EnsuringWorldPlazaInventoryBestiarySightedRecipeRewardsResult = {
  readonly state: DefiningInventoryState;
  readonly grantedRecipeIds: readonly DefiningWorldPlazaCraftModeRecipeId[];
  readonly rewardToasts: readonly string[];
};

function checkingRecipeAlreadyAttached(
  recipeId: DefiningWorldPlazaCraftModeRecipeId,
  storageOwnerId: string | null | undefined
): boolean {
  if (checkingWorldPlazaRecipePageAttachedInStore(recipeId)) {
    return true;
  }

  if (!storageOwnerId) {
    return false;
  }

  return readingWorldPlazaRecipeDiscoveryFromStorage(
    storageOwnerId
  ).attachedRecipeIds.has(recipeId);
}

function grantingOneBestiarySightedRecipeReward(
  state: DefiningInventoryState,
  reward: DefiningWorldPlazaBestiarySightedRecipeReward,
  sightedSpeciesCount: number,
  storageOwnerId: string | null | undefined
): {
  readonly state: DefiningInventoryState;
  readonly didGrant: boolean;
} {
  if (sightedSpeciesCount < reward.sightedSpeciesTotal) {
    return { state, didGrant: false };
  }

  if (checkingRecipeAlreadyAttached(reward.recipeId, storageOwnerId)) {
    return { state, didGrant: false };
  }

  const recipePageItemTypeId = resolvingWorldPlazaCraftRecipePageItemTypeId(
    reward.recipeId
  );

  if (
    countingWorldPlazaInventoryItemTypeQuantity(state, recipePageItemTypeId) > 0
  ) {
    return { state, didGrant: false };
  }

  const addResult = addingWorldPlazaInventoryItemWithStacking(
    state,
    {
      id: crypto.randomUUID(),
      itemTypeId: recipePageItemTypeId,
      quantity: 1,
    },
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
  );

  if (addResult.quantityAccepted < 1) {
    return { state, didGrant: false };
  }

  return { state: addResult.state, didGrant: true };
}

/**
 * Adds every earned Bestiary sighted recipe page the player still needs.
 */
export function ensuringWorldPlazaInventoryBestiarySightedRecipeRewards(
  state: DefiningInventoryState,
  options: EnsuringWorldPlazaInventoryBestiarySightedRecipeRewardsOptions = {}
): EnsuringWorldPlazaInventoryBestiarySightedRecipeRewardsResult {
  const sightedSpeciesCount =
    options.sightedSpeciesCount ??
    gettingWorldPlazaBestiarySightedSpeciesSnapshot().length;

  let nextState = state;
  const grantedRecipeIds: DefiningWorldPlazaCraftModeRecipeId[] = [];
  const rewardToasts: string[] = [];

  for (const reward of DEFINING_WORLD_PLAZA_BESTIARY_SIGHTED_RECIPE_REWARD_REGISTRY) {
    const grant = grantingOneBestiarySightedRecipeReward(
      nextState,
      reward,
      sightedSpeciesCount,
      options.storageOwnerId
    );

    if (!grant.didGrant) {
      continue;
    }

    nextState = grant.state;
    grantedRecipeIds.push(reward.recipeId);
    rewardToasts.push(reward.rewardToast);
  }

  return {
    state: nextState,
    grantedRecipeIds,
    rewardToasts,
  };
}
