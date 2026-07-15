/**
 * Chase intent that trails the local player at a comfort distance.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeDocileFollowPlayerIntent
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWildlifeFollowPlayerIntentParams = {
  readonly playerUserId: string | null | undefined;
  readonly playerPosition:
    | Pick<DefiningWorldPlazaWorldPoint, 'x' | 'y' | 'layer'>
    | null
    | undefined;
};

/** Builds a followPlayer intent from explicit player ids/position. */
export function resolvingWildlifeFollowPlayerIntentFromPlayer({
  playerUserId,
  playerPosition,
}: ResolvingWildlifeFollowPlayerIntentParams): DefiningWildlifeBehaviorIntent {
  if (!playerPosition || !playerUserId) {
    return { mode: 'idle' };
  }

  return {
    mode: 'followPlayer',
    targetInstanceId: playerUserId,
    targetPoint: {
      x: playerPosition.x,
      y: playerPosition.y,
      layer: playerPosition.layer,
    },
  };
}

/** Returns a walk-trail toward the player, or idle when no player is present. */
export function resolvingWildlifeDocileFollowPlayerIntent(
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWildlifeBehaviorIntent {
  return resolvingWildlifeFollowPlayerIntentFromPlayer({
    playerUserId: blackboard.playerUserId,
    playerPosition: blackboard.playerPosition,
  });
}
