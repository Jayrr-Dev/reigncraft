/**
 * Rolls follow vs flee and returns the matching behavior intent.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeDocileApproachReactIntent
 */

import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import { DEFINING_WILDLIFE_DOCILE_APPROACH_REACT_SEED_SALT } from '@/components/world/wildlife/domains/definingWildlifeDocileConstants';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeDocileApproachReaction } from '@/components/world/wildlife/domains/resolvingWildlifeDocileApproachReaction';
import { resolvingWildlifeDocileFollowPlayerIntent } from '@/components/world/wildlife/domains/resolvingWildlifeDocileFollowPlayerIntent';
import { resolvingWildlifeFleeFromThreatPointIntent } from '@/components/world/wildlife/domains/resolvingWildlifePlayerCollisionStartle';

function resolvingWildlifeDocileApproachReactRoll(
  blackboard: DefiningWildlifeBehaviorBlackboard
): number {
  const tileX = Math.floor(blackboard.instance.position.x);
  const tileY = Math.floor(blackboard.instance.position.y);

  return seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DEFINING_WILDLIFE_DOCILE_APPROACH_REACT_SEED_SALT +
      Math.floor(blackboard.nowMs / 1000)
  );
}

/**
 * Picks follow or flee from aggressionLevel; caller applies timer side effects.
 */
export function resolvingWildlifeDocileApproachReactIntent(
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWildlifeBehaviorIntent {
  const reaction = resolvingWildlifeDocileApproachReaction({
    aggressionLevel: blackboard.instance.aggressionLevel,
    roll: resolvingWildlifeDocileApproachReactRoll(blackboard),
  });

  if (reaction === 'follow') {
    return resolvingWildlifeDocileFollowPlayerIntent(blackboard);
  }

  if (!blackboard.playerPosition) {
    return { mode: 'idle' };
  }

  return resolvingWildlifeFleeFromThreatPointIntent({
    position: blackboard.instance.position,
    threatPoint: blackboard.playerPosition,
    species: blackboard.species,
    hazardSampling: blackboard.hazardSampling,
  });
}
