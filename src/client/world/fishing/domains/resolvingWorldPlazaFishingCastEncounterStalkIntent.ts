/**
 * Shadowing stalk intent for fishing cast predators (keeps off the player's hip).
 *
 * @module components/world/fishing/domains/resolvingWorldPlazaFishingCastEncounterStalkIntent
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_STALK_FOLLOW_DISTANCE_GRID,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_STALK_FOLLOW_MAX_DISTANCE_GRID,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_STALK_FOLLOW_MIN_DISTANCE_GRID,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingCastEncounterConstants';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeStalkFollowTargetPoint } from '@/components/world/wildlife/domains/resolvingWildlifeStalkFollowTargetPoint';

export type ResolvingWorldPlazaFishingCastEncounterStalkIntentParams = {
  readonly instancePosition: DefiningWorldPlazaWorldPoint;
  readonly playerUserId: string | null | undefined;
  readonly playerPosition: DefiningWorldPlazaWorldPoint | null | undefined;
};

/**
 * Returns a stalk intent that shadows the player at fishing-cast follow range.
 */
export function resolvingWorldPlazaFishingCastEncounterStalkIntent({
  instancePosition,
  playerUserId,
  playerPosition,
}: ResolvingWorldPlazaFishingCastEncounterStalkIntentParams): DefiningWildlifeBehaviorIntent {
  if (!playerPosition || !playerUserId) {
    return { mode: 'idle' };
  }

  return {
    mode: 'stalk',
    targetInstanceId: playerUserId,
    targetPoint: resolvingWildlifeStalkFollowTargetPoint({
      position: instancePosition,
      playerPosition,
      followDistanceGrid:
        DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_STALK_FOLLOW_DISTANCE_GRID,
      followMinDistanceGrid:
        DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_STALK_FOLLOW_MIN_DISTANCE_GRID,
      followMaxDistanceGrid:
        DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_STALK_FOLLOW_MAX_DISTANCE_GRID,
    }),
    pace: 'walk',
  };
}
