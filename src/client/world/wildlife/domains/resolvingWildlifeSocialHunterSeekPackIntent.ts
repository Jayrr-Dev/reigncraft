/**
 * Chase intent that runs a social hunter toward a packmate.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSocialHunterSeekPackIntent
 */

import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeSocialHunterSeekPackmate } from '@/components/world/wildlife/domains/resolvingWildlifeSocialHunterSeekPackmate';

/** Returns a run-chase toward the nearest under-strength packmate. */
export function resolvingWildlifeSocialHunterSeekPackIntent(
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWildlifeBehaviorIntent {
  const seekResult = resolvingWildlifeSocialHunterSeekPackmate({
    instance: blackboard.instance,
    nearbyInstances: blackboard.nearbyInstances,
  });

  if (!seekResult) {
    return { mode: 'idle' };
  }

  return {
    mode: 'seekPackmate',
    targetInstanceId: seekResult.packmate.instanceId,
    targetPoint: seekResult.packmate.position,
  };
}
