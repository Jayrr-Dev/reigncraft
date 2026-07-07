/**
 * Trailing follow bands for alpha-led calm pack roam.
 *
 * @module components/world/wildlife/domains/resolvingWildlifePackRoamFollowDistances
 */

import {
  DEFINING_WILDLIFE_PACK_ALPHA_ROAM_FOLLOW_DISTANCE_GRID,
  DEFINING_WILDLIFE_PACK_ALPHA_ROAM_FOLLOW_MAX_DISTANCE_GRID,
  DEFINING_WILDLIFE_PACK_ALPHA_ROAM_FOLLOW_MIN_DISTANCE_GRID,
  DEFINING_WILDLIFE_PACK_FOLLOWER_ROAM_DISTANCE_OFFSET_GRID,
} from '@/components/world/wildlife/domains/definingWildlifePackConstants';
import type { ResolvingWildlifeStalkPackFollowDistances } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPackFollowDistances';
import type { ResolvingWildlifeStalkSpawnPackFormation } from '@/components/world/wildlife/domains/resolvingWildlifeStalkSpawnPackFormation';

/** Alpha stays tight; each follower rank trails a little farther back. */
export function resolvingWildlifePackRoamFollowDistances({
  isAlpha,
  followerRank,
}: ResolvingWildlifeStalkSpawnPackFormation): ResolvingWildlifeStalkPackFollowDistances {
  if (isAlpha) {
    return {
      followDistanceGrid:
        DEFINING_WILDLIFE_PACK_ALPHA_ROAM_FOLLOW_DISTANCE_GRID,
      followMinDistanceGrid:
        DEFINING_WILDLIFE_PACK_ALPHA_ROAM_FOLLOW_MIN_DISTANCE_GRID,
      followMaxDistanceGrid:
        DEFINING_WILDLIFE_PACK_ALPHA_ROAM_FOLLOW_MAX_DISTANCE_GRID,
    };
  }

  const trailingOffset =
    followerRank * DEFINING_WILDLIFE_PACK_FOLLOWER_ROAM_DISTANCE_OFFSET_GRID;

  return {
    followDistanceGrid:
      DEFINING_WILDLIFE_PACK_ALPHA_ROAM_FOLLOW_DISTANCE_GRID + trailingOffset,
    followMinDistanceGrid:
      DEFINING_WILDLIFE_PACK_ALPHA_ROAM_FOLLOW_MIN_DISTANCE_GRID +
      trailingOffset,
    followMaxDistanceGrid:
      DEFINING_WILDLIFE_PACK_ALPHA_ROAM_FOLLOW_MAX_DISTANCE_GRID +
      trailingOffset,
  };
}
