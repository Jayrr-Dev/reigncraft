/**
 * Whether a social hunter should run toward packmates instead of hunting.
 *
 * @module components/world/wildlife/domains/checkingWildlifeHasSeekPack
 */

import { checkingWildlifeInstanceIsSocialHunter } from '@/components/world/wildlife/domains/checkingWildlifeInstanceIsSocialHunter';
import { checkingWildlifeSocialHunterMayHunt } from '@/components/world/wildlife/domains/checkingWildlifeSocialHunterMayHunt';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import { resolvingWildlifeSocialHunterSeekPackmate } from '@/components/world/wildlife/domains/resolvingWildlifeSocialHunterSeekPackmate';

/**
 * True when the instance is a social hunter under min pack size, not already in
 * an active hunt, and a packmate exists within seek radius.
 */
export function checkingWildlifeHasSeekPack(
  blackboard: DefiningWildlifeBehaviorBlackboard
): boolean {
  if (
    !checkingWildlifeInstanceIsSocialHunter(
      blackboard.instance,
      blackboard.species
    )
  ) {
    return false;
  }

  if (blackboard.instance.aiState.isSleeping) {
    return false;
  }

  if (blackboard.instance.aggroState.activeTargetId !== null) {
    return false;
  }

  if (
    checkingWildlifeSocialHunterMayHunt({
      instance: blackboard.instance,
      species: blackboard.species,
      nearbyInstances: blackboard.nearbyInstances,
    })
  ) {
    return false;
  }

  return (
    resolvingWildlifeSocialHunterSeekPackmate({
      instance: blackboard.instance,
      nearbyInstances: blackboard.nearbyInstances,
    }) !== null
  );
}
