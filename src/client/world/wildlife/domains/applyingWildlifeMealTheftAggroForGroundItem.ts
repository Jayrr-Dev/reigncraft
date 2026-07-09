/**
 * Aggros every animal currently eating a ground stack the player is stealing.
 *
 * @module components/world/wildlife/domains/applyingWildlifeMealTheftAggroForGroundItem
 */

import { applyingWildlifeMealTheftPlayerAggro } from '@/components/world/wildlife/domains/applyingWildlifeMealTheftPlayerAggro';
import { checkingWildlifeInstanceIsEatingGroundItem } from '@/components/world/wildlife/domains/checkingWildlifeInstanceIsEatingGroundItem';
import {
  listingWildlifeInstances,
  replacingWildlifeInstance,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

export type ApplyingWildlifeMealTheftAggroForGroundItemParams = {
  store: ManagingWildlifeInstanceStore;
  groundItemId: string;
  playerTargetId: string;
  nowMs: number;
};

/** Returns how many eaters were flipped onto the player. */
export function applyingWildlifeMealTheftAggroForGroundItem({
  store,
  groundItemId,
  playerTargetId,
  nowMs,
}: ApplyingWildlifeMealTheftAggroForGroundItemParams): number {
  let aggroedCount = 0;

  for (const instance of listingWildlifeInstances(store)) {
    if (
      !checkingWildlifeInstanceIsEatingGroundItem(
        instance,
        groundItemId,
        nowMs
      )
    ) {
      continue;
    }

    replacingWildlifeInstance(
      store,
      applyingWildlifeMealTheftPlayerAggro({
        instance,
        playerTargetId,
        nowMs,
      })
    );
    aggroedCount += 1;
  }

  return aggroedCount;
}

/** True when any living animal is eating `groundItemId` right now. */
export function checkingWildlifeGroundItemIsContestedByEater(
  store: ManagingWildlifeInstanceStore | null | undefined,
  groundItemId: string,
  nowMs: number
): boolean {
  if (!store) {
    return false;
  }

  for (const instance of listingWildlifeInstances(store)) {
    if (
      checkingWildlifeInstanceIsEatingGroundItem(
        instance,
        groundItemId,
        nowMs
      )
    ) {
      return true;
    }
  }

  return false;
}
