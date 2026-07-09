/**
 * Chase intent that runs a young animal back to a larger guardian.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSeparationAnxietyFollowIntent
 */

import { checkingWildlifeIntentIsSeparationAnxietyFollow } from '@/components/world/wildlife/domains/checkingWildlifeIntentIsSeparationAnxietyFollow';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeSeparationAnxietyGuardian } from '@/components/world/wildlife/domains/resolvingWildlifeSeparationAnxietyGuardian';

/** Returns a run-chase toward the nearest larger same-species guardian. */
export function resolvingWildlifeSeparationAnxietyFollowIntent(
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWildlifeBehaviorIntent {
  const isAlreadyFollowing = checkingWildlifeIntentIsSeparationAnxietyFollow(
    blackboard.instance.aiState.intent
  );

  const guardianResult = resolvingWildlifeSeparationAnxietyGuardian({
    instance: blackboard.instance,
    species: blackboard.species,
    nearbyInstances: blackboard.nearbyInstances,
    resolveSpecies: blackboard.resolveSpecies,
    isAlreadyFollowing,
  });

  if (!guardianResult) {
    return { mode: 'idle' };
  }

  return {
    mode: 'followGuardian',
    targetInstanceId: guardianResult.guardian.instanceId,
    targetPoint: guardianResult.guardian.position,
  };
}
