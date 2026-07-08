/**
 * Whether schedule-driven sleep should stay blocked after combat.
 *
 * @module components/world/wildlife/domains/checkingWildlifeScheduleSleepBlocked
 */

import { checkingWildlifeRecentlyAggroed } from '@/components/world/wildlife/domains/checkingWildlifeRecentlyAggroed';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * True while the animal is actively hunting or still inside the post-aggro
 * cooldown. Re-aggro refreshes the timestamp each combat tick.
 */
export function checkingWildlifeScheduleSleepBlocked(
  instance: DefiningWildlifeInstance,
  nowMs: number
): boolean {
  if (instance.aggroState.activeTargetId !== null) {
    return true;
  }

  return checkingWildlifeRecentlyAggroed(
    instance.aggroState.lastAggroedAtMs,
    nowMs
  );
}
