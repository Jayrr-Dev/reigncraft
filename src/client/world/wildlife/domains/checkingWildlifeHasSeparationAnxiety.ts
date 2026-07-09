/**
 * Whether a young animal should run toward a larger same-species guardian.
 *
 * @module components/world/wildlife/domains/checkingWildlifeHasSeparationAnxiety
 */

import { checkingWildlifeInstanceHasSeparationAnxiety } from '@/components/world/wildlife/domains/checkingWildlifeInstanceHasSeparationAnxiety';
import { checkingWildlifeIntentIsSeparationAnxietyFollow } from '@/components/world/wildlife/domains/checkingWildlifeIntentIsSeparationAnxietyFollow';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import { resolvingWildlifeSeparationAnxietyGuardian } from '@/components/world/wildlife/domains/resolvingWildlifeSeparationAnxietyGuardian';

/** True when the blackboard instance is young and too far from a larger ally. */
export function checkingWildlifeHasSeparationAnxiety(
  blackboard: DefiningWildlifeBehaviorBlackboard
): boolean {
  if (
    !checkingWildlifeInstanceHasSeparationAnxiety(
      blackboard.instance,
      blackboard.species
    )
  ) {
    return false;
  }

  if (blackboard.instance.aiState.isSleeping) {
    return false;
  }

  const isAlreadyFollowing = checkingWildlifeIntentIsSeparationAnxietyFollow(
    blackboard.instance.aiState.intent
  );

  return (
    resolvingWildlifeSeparationAnxietyGuardian({
      instance: blackboard.instance,
      species: blackboard.species,
      nearbyInstances: blackboard.nearbyInstances,
      resolveSpecies: blackboard.resolveSpecies,
      isAlreadyFollowing,
    }) !== null
  );
}
