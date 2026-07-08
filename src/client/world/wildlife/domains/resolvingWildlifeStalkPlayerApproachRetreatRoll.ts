/**
 * Seeded delay and retreat distance for player approach reactions.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeStalkPlayerApproachRetreatRoll
 */

import { computingWildlifeInstanceSeedFraction } from '@/components/world/wildlife/domains/computingWildlifeInstanceSeedFraction';
import {
  DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_RUN_NOTICE_DELAY_MIN_MS,
  DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_RUN_NOTICE_DELAY_SPAN_MS,
  DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_RUN_RETREAT_MIN_GRID,
  DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_RUN_RETREAT_SPAN_GRID,
  DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_WALK_NOTICE_DELAY_MIN_MS,
  DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_WALK_NOTICE_DELAY_SPAN_MS,
  DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_WALK_RETREAT_MIN_GRID,
  DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_WALK_RETREAT_SPAN_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';

const RESOLVING_WILDLIFE_STALK_PLAYER_APPROACH_DELAY_SALT = 1303;
const RESOLVING_WILDLIFE_STALK_PLAYER_APPROACH_RETREAT_SALT = 1307;

export type ResolvingWildlifeStalkPlayerApproachRetreatRollParams = {
  packAnchorId: string;
  playerPace: 'walk' | 'run';
};

export type ResolvingWildlifeStalkPlayerApproachRetreatRoll = {
  noticeDelayMs: number;
  retreatDistanceGrid: number;
};

/** Rolls a per-pack hesitation and retreat distance for one approach leg. */
export function resolvingWildlifeStalkPlayerApproachRetreatRoll({
  packAnchorId,
  playerPace,
}: ResolvingWildlifeStalkPlayerApproachRetreatRollParams): ResolvingWildlifeStalkPlayerApproachRetreatRoll {
  const delayRoll = computingWildlifeInstanceSeedFraction(
    packAnchorId,
    RESOLVING_WILDLIFE_STALK_PLAYER_APPROACH_DELAY_SALT
  );
  const retreatRoll = computingWildlifeInstanceSeedFraction(
    packAnchorId,
    RESOLVING_WILDLIFE_STALK_PLAYER_APPROACH_RETREAT_SALT
  );

  if (playerPace === 'run') {
    return {
      noticeDelayMs:
        DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_RUN_NOTICE_DELAY_MIN_MS +
        delayRoll *
          DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_RUN_NOTICE_DELAY_SPAN_MS,
      retreatDistanceGrid:
        DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_RUN_RETREAT_MIN_GRID +
        retreatRoll *
          DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_RUN_RETREAT_SPAN_GRID,
    };
  }

  return {
    noticeDelayMs:
      DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_WALK_NOTICE_DELAY_MIN_MS +
      delayRoll *
        DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_WALK_NOTICE_DELAY_SPAN_MS,
    retreatDistanceGrid:
      DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_WALK_RETREAT_MIN_GRID +
      retreatRoll *
        DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_WALK_RETREAT_SPAN_GRID,
  };
}
