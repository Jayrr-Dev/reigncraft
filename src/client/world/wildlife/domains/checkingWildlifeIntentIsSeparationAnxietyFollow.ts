/**
 * Whether the current intent is a separation-anxiety guardian follow.
 *
 * @module components/world/wildlife/domains/checkingWildlifeIntentIsSeparationAnxietyFollow
 */

import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** True while a young animal is running back to a larger ally. */
export function checkingWildlifeIntentIsSeparationAnxietyFollow(
  intent: DefiningWildlifeBehaviorIntent
): boolean {
  return intent.mode === 'followGuardian';
}
