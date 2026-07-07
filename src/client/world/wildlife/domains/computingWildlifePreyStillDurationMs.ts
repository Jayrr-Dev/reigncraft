/**
 * Stillness duration for wildlife prey during stalk weakness checks.
 *
 * @module components/world/wildlife/domains/computingWildlifePreyStillDurationMs
 */

import { DEFINING_WILDLIFE_STALK_PREY_STILL_COMMIT_MS } from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Stationary wildlife prey counts as still enough to trigger a stalk rush.
 */
export function computingWildlifePreyStillDurationMs(
  prey: DefiningWildlifeInstance
): number {
  if (prey.aiState.isMoving) {
    return 0;
  }

  return DEFINING_WILDLIFE_STALK_PREY_STILL_COMMIT_MS;
}
