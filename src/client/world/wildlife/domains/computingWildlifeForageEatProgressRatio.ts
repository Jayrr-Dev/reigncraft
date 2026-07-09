/**
 * Chew-timer progress while a wildlife instance is in forageEat.
 *
 * @module components/world/wildlife/domains/computingWildlifeForageEatProgressRatio
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Whether the instance is alive and currently eating a ground food stack.
 */
export function checkingWildlifeInstanceIsForageEating(
  instance: DefiningWildlifeInstance
): boolean {
  return !instance.isDead && instance.aiState.intent.mode === 'forageEat';
}

/**
 * Progress through the current chew (0 at chew start, 1 when the unit is
 * consumed). Returns 0 when no chew timer is running yet.
 */
export function computingWildlifeForageEatProgressRatio(
  instance: DefiningWildlifeInstance,
  nowMs: number
): number {
  const pendingBite = instance.aiState.pendingGroundFoodBite;

  if (pendingBite === null) {
    return 0;
  }

  const chewDurationMs = pendingBite.readyAtMs - pendingBite.startedAtMs;

  if (chewDurationMs <= 0) {
    return 1;
  }

  return Math.max(
    0,
    Math.min(1, (nowMs - pendingBite.startedAtMs) / chewDurationMs)
  );
}
