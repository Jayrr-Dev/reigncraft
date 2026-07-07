import {
  DEFINING_WILDLIFE_PACK_ALPHA_STALK_FOLLOW_DISTANCE_GRID,
  DEFINING_WILDLIFE_PACK_FOLLOWER_STALK_DISTANCE_OFFSET_GRID,
} from '@/components/world/wildlife/domains/definingWildlifePackConstants';
import {
  DEFINING_WILDLIFE_STALK_FOLLOW_DISTANCE_GRID,
  DEFINING_WILDLIFE_STALK_TOO_CLOSE_RETREAT_STEP_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import { resolvingWildlifeStalkFollowTargetPoint } from '@/components/world/wildlife/domains/resolvingWildlifeStalkFollowTargetPoint';
import { resolvingWildlifeStalkPackFollowDistances } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPackFollowDistances';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeStalkPackFollowDistances', () => {
  it('keeps the alpha closer than followers', () => {
    const alpha = resolvingWildlifeStalkPackFollowDistances({
      isAlpha: true,
      followerRank: 0,
    });
    const follower = resolvingWildlifeStalkPackFollowDistances({
      isAlpha: false,
      followerRank: 1,
    });

    expect(alpha.followDistanceGrid).toBeLessThan(follower.followDistanceGrid);
    expect(follower.followDistanceGrid).toBe(
      DEFINING_WILDLIFE_STALK_FOLLOW_DISTANCE_GRID +
        DEFINING_WILDLIFE_PACK_FOLLOWER_STALK_DISTANCE_OFFSET_GRID
    );
  });
});

describe('resolvingWildlifeStalkFollowTargetPoint', () => {
  const playerPosition = { x: 10, y: 10, layer: 1 };

  it('steps backward a short distance when the player is too close', () => {
    const position = { x: 5, y: 10, layer: 1 };
    const targetPoint = resolvingWildlifeStalkFollowTargetPoint({
      position,
      playerPosition,
    });

    const retreatDeltaX = targetPoint.x - position.x;
    const retreatDeltaY = targetPoint.y - position.y;
    const retreatDistance = Math.hypot(retreatDeltaX, retreatDeltaY);

    expect(retreatDistance).toBeCloseTo(
      DEFINING_WILDLIFE_STALK_TOO_CLOSE_RETREAT_STEP_GRID,
      5
    );
    expect(retreatDeltaX).toBeLessThan(0);
    expect(retreatDeltaY).toBeCloseTo(0, 5);
  });

  it('does not snap all the way to the ideal follow distance in one step', () => {
    const position = { x: 4, y: 10, layer: 1 };
    const targetPoint = resolvingWildlifeStalkFollowTargetPoint({
      position,
      playerPosition,
    });
    const distanceAfterOneStep = Math.hypot(
      playerPosition.x - targetPoint.x,
      playerPosition.y - targetPoint.y
    );

    expect(distanceAfterOneStep).toBeLessThan(
      DEFINING_WILDLIFE_STALK_FOLLOW_DISTANCE_GRID
    );
    expect(distanceAfterOneStep).toBeGreaterThan(5);
  });

  it('lets the alpha close tighter than default followers', () => {
    const position = { x: -1, y: 10, layer: 1 };
    const alphaDistances = resolvingWildlifeStalkPackFollowDistances({
      isAlpha: true,
      followerRank: 0,
    });
    const followerDistances = resolvingWildlifeStalkPackFollowDistances({
      isAlpha: false,
      followerRank: 1,
    });
    const alphaTarget = resolvingWildlifeStalkFollowTargetPoint({
      position,
      playerPosition,
      ...alphaDistances,
    });
    const followerTarget = resolvingWildlifeStalkFollowTargetPoint({
      position,
      playerPosition,
      ...followerDistances,
    });
    const alphaDistance = Math.hypot(
      playerPosition.x - alphaTarget.x,
      playerPosition.y - alphaTarget.y
    );
    const followerDistance = Math.hypot(
      playerPosition.x - followerTarget.x,
      playerPosition.y - followerTarget.y
    );

    expect(alphaDistance).toBeLessThan(followerDistance);
    expect(alphaDistance).toBeCloseTo(
      DEFINING_WILDLIFE_PACK_ALPHA_STALK_FOLLOW_DISTANCE_GRID,
      1
    );
  });
});
