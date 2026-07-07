/**
 * Shadowing follow bands for alpha-led stalk packs.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeStalkPackFollowDistances
 */

import {
  DEFINING_WILDLIFE_PACK_ALPHA_STALK_FOLLOW_DISTANCE_GRID,
  DEFINING_WILDLIFE_PACK_ALPHA_STALK_FOLLOW_MAX_DISTANCE_GRID,
  DEFINING_WILDLIFE_PACK_ALPHA_STALK_FOLLOW_MIN_DISTANCE_GRID,
  DEFINING_WILDLIFE_PACK_FOLLOWER_STALK_DISTANCE_OFFSET_GRID,
} from '@/components/world/wildlife/domains/definingWildlifePackConstants';
import {
  DEFINING_WILDLIFE_STALK_FOLLOW_DISTANCE_GRID,
  DEFINING_WILDLIFE_STALK_FOLLOW_MAX_DISTANCE_GRID,
  DEFINING_WILDLIFE_STALK_FOLLOW_MIN_DISTANCE_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import type { ResolvingWildlifeStalkSpawnPackFormation } from '@/components/world/wildlife/domains/resolvingWildlifeStalkSpawnPackFormation';

export type ResolvingWildlifeStalkPackFollowDistances = {
  followDistanceGrid: number;
  followMinDistanceGrid: number;
  followMaxDistanceGrid: number;
};

/**
 * Alpha hunts closest; each follower rank trails farther behind.
 */
export function resolvingWildlifeStalkPackFollowDistances({
  isAlpha,
  followerRank,
}: ResolvingWildlifeStalkSpawnPackFormation): ResolvingWildlifeStalkPackFollowDistances {
  if (isAlpha) {
    return {
      followDistanceGrid:
        DEFINING_WILDLIFE_PACK_ALPHA_STALK_FOLLOW_DISTANCE_GRID,
      followMinDistanceGrid:
        DEFINING_WILDLIFE_PACK_ALPHA_STALK_FOLLOW_MIN_DISTANCE_GRID,
      followMaxDistanceGrid:
        DEFINING_WILDLIFE_PACK_ALPHA_STALK_FOLLOW_MAX_DISTANCE_GRID,
    };
  }

  const trailingOffset =
    followerRank * DEFINING_WILDLIFE_PACK_FOLLOWER_STALK_DISTANCE_OFFSET_GRID;

  return {
    followDistanceGrid:
      DEFINING_WILDLIFE_STALK_FOLLOW_DISTANCE_GRID + trailingOffset,
    followMinDistanceGrid:
      DEFINING_WILDLIFE_STALK_FOLLOW_MIN_DISTANCE_GRID + trailingOffset,
    followMaxDistanceGrid:
      DEFINING_WILDLIFE_STALK_FOLLOW_MAX_DISTANCE_GRID + trailingOffset,
  };
}
