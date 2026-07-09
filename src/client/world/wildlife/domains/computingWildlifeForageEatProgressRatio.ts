/**
 * Bite-cooldown progress while a wildlife instance is in forageEat.
 *
 * @module components/world/wildlife/domains/computingWildlifeForageEatProgressRatio
 */

import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
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
 * Progress toward the next wildlife bite (0 at last bite, 1 when ready).
 */
export function computingWildlifeForageEatProgressRatio(
  instance: DefiningWildlifeInstance,
  nowMs: number
): number {
  const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);
  const attackIntervalMs = species?.vitals.attackIntervalMs;

  if (!attackIntervalMs || attackIntervalMs <= 0) {
    return 1;
  }

  const lastAttackAtMs = instance.aiState.lastAttackAtMs;

  if (lastAttackAtMs === null) {
    return 1;
  }

  return Math.max(0, Math.min(1, (nowMs - lastAttackAtMs) / attackIntervalMs));
}
