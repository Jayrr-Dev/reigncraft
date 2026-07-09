/**
 * True when intent is a docile follow-player trail.
 *
 * @module components/world/wildlife/domains/checkingWildlifeIntentIsDocileFollowPlayer
 */

import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export function checkingWildlifeIntentIsDocileFollowPlayer(
  intent: DefiningWildlifeBehaviorIntent
): boolean {
  return intent.mode === 'followPlayer';
}
