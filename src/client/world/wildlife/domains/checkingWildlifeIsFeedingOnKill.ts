/**
 * Whether a wildlife instance is in the post-kill feeding lock window.
 *
 * @module components/world/wildlife/domains/checkingWildlifeIsFeedingOnKill
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Returns true while the hunter must stay focused on its kill meal. */
export function checkingWildlifeIsFeedingOnKill(
  instance: DefiningWildlifeInstance,
  nowMs: number
): boolean {
  const feedingUntilMs = instance.aiState.feedingOnKillUntilMs;

  return feedingUntilMs !== null && nowMs < feedingUntilMs;
}
