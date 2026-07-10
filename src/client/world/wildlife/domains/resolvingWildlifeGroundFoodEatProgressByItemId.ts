/**
 * Resolves wildlife bite-cooldown progress for a ground food stack.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeGroundFoodEatProgressByItemId
 */

import {
  checkingWildlifeInstanceIsForageEating,
  computingWildlifeForageEatProgressRatio,
} from '@/components/world/wildlife/domains/computingWildlifeForageEatProgressRatio';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  listingWildlifeInstances,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

/** Progress toward the next wildlife bite on one ground stack. */
export type ResolvingWildlifeGroundFoodEatProgress = {
  readonly isActive: boolean;
  /** 0 at last bite, 1 when the next bite is ready. */
  readonly progressRatio: number;
};

const RESOLVING_WILDLIFE_GROUND_FOOD_EAT_PROGRESS_INACTIVE: ResolvingWildlifeGroundFoodEatProgress =
  {
    isActive: false,
    progressRatio: 0,
  };

function checkingWildlifeInstanceIsEatingGroundItem(
  instance: DefiningWildlifeInstance,
  groundItemId: string
): boolean {
  const intent = instance.aiState.intent;

  return (
    checkingWildlifeInstanceIsForageEating(instance) &&
    intent.mode === 'forageEat' &&
    intent.targetGroundItemId === groundItemId
  );
}

/**
 * Finds an animal eating `groundItemId` and returns bite-cooldown progress.
 *
 * When several animals share one stack, the highest progress ratio wins so the
 * ring stays smooth for the nearest bite.
 */
export function resolvingWildlifeGroundFoodEatProgressByItemId(
  store: ManagingWildlifeInstanceStore | null | undefined,
  groundItemId: string,
  nowMs: number
): ResolvingWildlifeGroundFoodEatProgress {
  if (!store) {
    return RESOLVING_WILDLIFE_GROUND_FOOD_EAT_PROGRESS_INACTIVE;
  }

  let bestProgressRatio = -1;

  for (const instance of listingWildlifeInstances(store)) {
    if (!checkingWildlifeInstanceIsEatingGroundItem(instance, groundItemId)) {
      continue;
    }

    const progressRatio = computingWildlifeForageEatProgressRatio(
      instance,
      nowMs
    );

    if (progressRatio > bestProgressRatio) {
      bestProgressRatio = progressRatio;
    }
  }

  if (bestProgressRatio < 0) {
    return RESOLVING_WILDLIFE_GROUND_FOOD_EAT_PROGRESS_INACTIVE;
  }

  return {
    isActive: true,
    progressRatio: bestProgressRatio,
  };
}
