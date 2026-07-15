/**
 * Grants the Storage Chest recipe page after the player's first world chest open.
 *
 * @module components/world/chest/domains/ensuringWorldPlazaInventoryFirstWorldChestRecipeReward
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import {
  DEFINING_WORLD_PLAZA_FIRST_WORLD_CHEST_RECIPE_ID,
  LABELING_WORLD_PLAZA_FIRST_WORLD_CHEST_RECIPE_REWARD_TOAST,
} from '@/components/world/chest/domains/definingWorldPlazaFirstWorldChestRecipeRewardConstants';
import { countingWorldPlazaInventoryItemTypeQuantity } from '@/components/world/crafting/domains/countingWorldPlazaInventoryItemTypeQuantity';
import {
  type DefiningWorldPlazaCraftModeRecipeId,
  resolvingWorldPlazaCraftRecipePageItemTypeId,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { checkingWorldPlazaRecipePageAttachedInStore } from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';
import { readingWorldPlazaRecipeDiscoveryFromStorage } from '@/components/world/domains/readingWorldPlazaRecipeDiscoveryFromStorage';
import { addingWorldPlazaInventoryItemWithStacking } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';

export type EnsuringWorldPlazaInventoryFirstWorldChestRecipeRewardOptions = {
  readonly storageOwnerId?: string | null;
  /**
   * Opened world-chest count for this owner (including the chest just opened).
   * Reward only when this is exactly 1.
   */
  readonly openedWorldChestCount: number;
};

export type EnsuringWorldPlazaInventoryFirstWorldChestRecipeRewardResult = {
  readonly state: DefiningInventoryState;
  readonly grantedRecipeId: DefiningWorldPlazaCraftModeRecipeId | null;
  readonly rewardToast: string | null;
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

/**
 * Adds the Storage Chest recipe page once the player has opened their first
 * world loot chest (and does not already hold or attach that page).
 */
export function ensuringWorldPlazaInventoryFirstWorldChestRecipeReward(
  state: DefiningInventoryState,
  options: EnsuringWorldPlazaInventoryFirstWorldChestRecipeRewardOptions
): EnsuringWorldPlazaInventoryFirstWorldChestRecipeRewardResult {
  if (options.openedWorldChestCount !== 1) {
    return {
      state,
      grantedRecipeId: null,
      rewardToast: null,
    };
  }

  const recipeId = DEFINING_WORLD_PLAZA_FIRST_WORLD_CHEST_RECIPE_ID;

  if (checkingRecipeAlreadyAttached(recipeId, options.storageOwnerId)) {
    return {
      state,
      grantedRecipeId: null,
      rewardToast: null,
    };
  }

  const recipePageItemTypeId =
    resolvingWorldPlazaCraftRecipePageItemTypeId(recipeId);

  if (
    countingWorldPlazaInventoryItemTypeQuantity(state, recipePageItemTypeId) > 0
  ) {
    return {
      state,
      grantedRecipeId: null,
      rewardToast: null,
    };
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
    return {
      state,
      grantedRecipeId: null,
      rewardToast: null,
    };
  }

  return {
    state: addResult.state,
    grantedRecipeId: recipeId,
    rewardToast: LABELING_WORLD_PLAZA_FIRST_WORLD_CHEST_RECIPE_REWARD_TOAST,
  };
}
