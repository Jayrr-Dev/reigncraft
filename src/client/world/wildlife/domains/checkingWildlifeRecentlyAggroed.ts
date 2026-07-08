/**
 * Whether a wildlife instance is still within the post-aggro sleep block window.
 *
 * @module components/world/wildlife/domains/checkingWildlifeRecentlyAggroed
 */

import { DEFINING_WILDLIFE_POST_AGGRO_SLEEP_BLOCK_MS } from '@/components/world/wildlife/domains/definingWildlifeSleepConstants';

/** True while schedule sleep should stay blocked after recent combat. */
export function checkingWildlifeRecentlyAggroed(
  lastAggroedAtMs: number | null | undefined,
  nowMs: number
): boolean {
  if (lastAggroedAtMs === null || lastAggroedAtMs === undefined) {
    return false;
  }

  return nowMs - lastAggroedAtMs < DEFINING_WILDLIFE_POST_AGGRO_SLEEP_BLOCK_MS;
}
