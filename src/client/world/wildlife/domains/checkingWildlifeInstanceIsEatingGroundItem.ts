/**
 * Whether a wildlife instance is currently eating a specific ground stack.
 *
 * @module components/world/wildlife/domains/checkingWildlifeInstanceIsEatingGroundItem
 */

import { checkingWildlifeInstanceIsForageEating } from '@/components/world/wildlife/domains/computingWildlifeForageEatProgressRatio';
import { checkingWildlifeIsFeedingOnKill } from '@/components/world/wildlife/domains/checkingWildlifeIsFeedingOnKill';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** True while the animal is chewing or feed-locked on `groundItemId`. */
export function checkingWildlifeInstanceIsEatingGroundItem(
  instance: DefiningWildlifeInstance,
  groundItemId: string,
  nowMs: number
): boolean {
  if (instance.isDead) {
    return false;
  }

  const pendingBite = instance.aiState.pendingGroundFoodBite;

  if (pendingBite?.groundItemId === groundItemId) {
    return true;
  }

  if (
    checkingWildlifeIsFeedingOnKill(instance, nowMs) &&
    instance.aiState.feedingOnKillGroundItemId === groundItemId
  ) {
    return true;
  }

  const intent = instance.aiState.intent;

  return (
    checkingWildlifeInstanceIsForageEating(instance) &&
    intent.mode === 'forageEat' &&
    intent.targetGroundItemId === groundItemId
  );
}
