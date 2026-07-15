/**
 * Grants Lapidary recipe pages once sighted / Study thresholds are met.
 *
 * @module components/world/inventory/domains/ensuringWorldPlazaInventoryLapidaryOreStudyRecipeRewards
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { countingWorldPlazaInventoryItemTypeQuantity } from '@/components/world/crafting/domains/countingWorldPlazaInventoryItemTypeQuantity';
import {
  type DefiningWorldPlazaCraftModeRecipeId,
  resolvingWorldPlazaCraftRecipePageItemTypeId,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { computingWorldPlazaLapidaryTotalOreStudyCount } from '@/components/world/domains/computingWorldPlazaLapidaryTotalOreStudyCount';
import {
  DEFINING_WORLD_PLAZA_LAPIDARY_ORE_STUDY_RECIPE_REWARD_REGISTRY,
  DEFINING_WORLD_PLAZA_LAPIDARY_RECIPE_REWARD_METRIC,
  type DefiningWorldPlazaLapidaryOreStudyRecipeReward,
} from '@/components/world/domains/definingWorldPlazaLapidaryOreStudyRecipeRewardRegistry';
import {
  gettingWorldPlazaLapidaryOreStudyCountsSnapshot,
  gettingWorldPlazaLapidarySightedOreSpeciesSnapshot,
} from '@/components/world/domains/managingWorldPlazaLapidaryDiscoveryStore';
import { checkingWorldPlazaRecipePageAttachedInStore } from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';
import { readingWorldPlazaRecipeDiscoveryFromStorage } from '@/components/world/domains/readingWorldPlazaRecipeDiscoveryFromStorage';
import { addingWorldPlazaInventoryItemWithStacking } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import type { WorldOreSpeciesId } from '../../../../shared/worldOreRarity';

export type EnsuringWorldPlazaInventoryLapidaryOreStudyRecipeRewardsOptions = {
  /** Persistence owner used when the in-memory attach store is not hydrated yet. */
  readonly storageOwnerId?: string | null;
  /**
   * Optional Study totals override (tests). Defaults to the live Lapidary store.
   */
  readonly oreStudyCountsBySpeciesId?: Readonly<
    Partial<Record<WorldOreSpeciesId, number>>
  >;
  /** Optional sighted species override (tests). */
  readonly sightedOreSpeciesIds?: readonly WorldOreSpeciesId[];
};

export type EnsuringWorldPlazaInventoryLapidaryOreStudyRecipeRewardsResult = {
  readonly state: DefiningInventoryState;
  /** Recipe ids granted during this call (may be multiple if several thresholds are met). */
  readonly grantedRecipeIds: readonly DefiningWorldPlazaCraftModeRecipeId[];
  /** Toast copy for each newly granted page, registry order. */
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

function resolvingLapidaryRecipeRewardProgress(
  reward: DefiningWorldPlazaLapidaryOreStudyRecipeReward,
  sightedOreSpeciesCount: number,
  totalOreStudyCount: number
): number {
  if (
    reward.metric === DEFINING_WORLD_PLAZA_LAPIDARY_RECIPE_REWARD_METRIC.ORE_SIGHTED
  ) {
    return sightedOreSpeciesCount;
  }

  return totalOreStudyCount;
}

function grantingOneLapidaryOreStudyRecipeReward(
  state: DefiningInventoryState,
  reward: DefiningWorldPlazaLapidaryOreStudyRecipeReward,
  sightedOreSpeciesCount: number,
  totalOreStudyCount: number,
  storageOwnerId: string | null | undefined
): {
  readonly state: DefiningInventoryState;
  readonly didGrant: boolean;
} {
  const progress = resolvingLapidaryRecipeRewardProgress(
    reward,
    sightedOreSpeciesCount,
    totalOreStudyCount
  );

  if (progress < reward.threshold) {
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
 * Adds every earned Lapidary recipe page the player still needs.
 *
 * @param state - Loaded inventory state
 * @param options - Optional storage owner and progress overrides
 */
export function ensuringWorldPlazaInventoryLapidaryOreStudyRecipeRewards(
  state: DefiningInventoryState,
  options: EnsuringWorldPlazaInventoryLapidaryOreStudyRecipeRewardsOptions = {}
): EnsuringWorldPlazaInventoryLapidaryOreStudyRecipeRewardsResult {
  const oreStudyCountsBySpeciesId =
    options.oreStudyCountsBySpeciesId ??
    gettingWorldPlazaLapidaryOreStudyCountsSnapshot();
  const totalOreStudyCount = computingWorldPlazaLapidaryTotalOreStudyCount(
    oreStudyCountsBySpeciesId
  );
  const sightedOreSpeciesCount = (
    options.sightedOreSpeciesIds ??
    gettingWorldPlazaLapidarySightedOreSpeciesSnapshot()
  ).length;

  let nextState = state;
  const grantedRecipeIds: DefiningWorldPlazaCraftModeRecipeId[] = [];
  const rewardToasts: string[] = [];

  for (const reward of DEFINING_WORLD_PLAZA_LAPIDARY_ORE_STUDY_RECIPE_REWARD_REGISTRY) {
    const grant = grantingOneLapidaryOreStudyRecipeReward(
      nextState,
      reward,
      sightedOreSpeciesCount,
      totalOreStudyCount,
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
