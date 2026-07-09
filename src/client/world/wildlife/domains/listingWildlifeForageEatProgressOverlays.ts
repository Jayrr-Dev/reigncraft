/**
 * Lists live wildlife instances that should show a head forage-eat progress ring.
 *
 * @module components/world/wildlife/domains/listingWildlifeForageEatProgressOverlays
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  checkingWildlifeInstanceIsForageEating,
  computingWildlifeForageEatProgressRatio,
} from '@/components/world/wildlife/domains/computingWildlifeForageEatProgressRatio';
import {
  listingWildlifeInstances,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

export type ListingWildlifeForageEatProgressOverlay = {
  readonly instanceId: string;
  readonly instance: DefiningWildlifeInstance;
  /** 0 at last bite, 1 when the next bite is ready. */
  readonly progressRatio: number;
};

/**
 * Returns every alive forageEat animal with bite-cooldown progress for overlays.
 */
export function listingWildlifeForageEatProgressOverlays(
  store: ManagingWildlifeInstanceStore | null | undefined,
  nowMs: number
): readonly ListingWildlifeForageEatProgressOverlay[] {
  if (!store) {
    return [];
  }

  const overlays: ListingWildlifeForageEatProgressOverlay[] = [];

  for (const instance of listingWildlifeInstances(store)) {
    if (!checkingWildlifeInstanceIsForageEating(instance)) {
      continue;
    }

    overlays.push({
      instanceId: instance.instanceId,
      instance,
      progressRatio: computingWildlifeForageEatProgressRatio(instance, nowMs),
    });
  }

  return overlays;
}
