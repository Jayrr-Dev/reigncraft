/**
 * Chase intent that trails the local player at a comfort distance.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeDocileFollowPlayerIntent
 */

import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Returns a walk-trail toward the player, or idle when no player is present. */
export function resolvingWildlifeDocileFollowPlayerIntent(
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWildlifeBehaviorIntent {
  if (!blackboard.playerPosition || !blackboard.playerUserId) {
    return { mode: 'idle' };
  }

  return {
    mode: 'followPlayer',
    targetInstanceId: blackboard.playerUserId,
    targetPoint: blackboard.playerPosition,
  };
}
