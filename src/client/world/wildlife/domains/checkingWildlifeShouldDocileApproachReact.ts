/**
 * True when a docile animal may roll follow vs flee on player approach.
 *
 * @module components/world/wildlife/domains/checkingWildlifeShouldDocileApproachReact
 */

import { checkingWildlifeDocileFollowIsActive } from '@/components/world/wildlife/domains/checkingWildlifeDocileFollowIsActive';
import { checkingWildlifeSpeciesIsDocile } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsDocile';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import {
  DEFINING_WILDLIFE_DOCILE_APPROACH_REACT_COOLDOWN_MS,
  DEFINING_WILDLIFE_DOCILE_APPROACH_REACT_RADIUS_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeDocileConstants';

export function checkingWildlifeShouldDocileApproachReact(
  blackboard: DefiningWildlifeBehaviorBlackboard
): boolean {
  if (!checkingWildlifeSpeciesIsDocile(blackboard.species)) {
    return false;
  }

  if (!blackboard.playerPosition || !blackboard.playerUserId) {
    return false;
  }

  if (
    checkingWildlifeDocileFollowIsActive(blackboard.instance, blackboard.nowMs)
  ) {
    return false;
  }

  const lastReactAtMs = blackboard.instance.aiState.docileLastReactAtMs;

  if (
    lastReactAtMs !== null &&
    blackboard.nowMs - lastReactAtMs <
      DEFINING_WILDLIFE_DOCILE_APPROACH_REACT_COOLDOWN_MS
  ) {
    return false;
  }

  const distanceGrid = Math.hypot(
    blackboard.playerPosition.x - blackboard.instance.position.x,
    blackboard.playerPosition.y - blackboard.instance.position.y
  );

  return distanceGrid <= DEFINING_WILDLIFE_DOCILE_APPROACH_REACT_RADIUS_GRID;
}
