/**
 * True when an Unnoticed animal recently attacked wildlife and is fair game.
 *
 * @module components/world/wildlife/domains/checkingWildlifeInstanceHasProvokedWildlifeAggro
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export function checkingWildlifeInstanceHasProvokedWildlifeAggro(
  instance: Pick<DefiningWildlifeInstance, 'aggroState'>,
  nowMs: number
): boolean {
  const provokedUntilMs = instance.aggroState.provokedWildlifeAggroUntilMs;

  return (
    provokedUntilMs !== null &&
    provokedUntilMs !== undefined &&
    provokedUntilMs > nowMs
  );
}
