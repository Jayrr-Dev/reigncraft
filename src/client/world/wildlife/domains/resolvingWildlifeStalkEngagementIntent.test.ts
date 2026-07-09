import {
  DEFINING_WILDLIFE_STALK_FOLLOW_DISTANCE_GRID,
  DEFINING_WILDLIFE_STALK_FOLLOW_MAX_DISTANCE_GRID,
  DEFINING_WILDLIFE_STALK_FOLLOW_MIN_DISTANCE_GRID,
  DEFINING_WILDLIFE_STALK_SHADOW_WANDER_BUCKET_MS,
  DEFINING_WILDLIFE_STALK_TOO_CLOSE_RETREAT_STEP_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import { resolvingWildlifeStalkEngagementIntent } from '@/components/world/wildlife/domains/resolvingWildlifeStalkEngagementIntent';
import { describe, expect, it } from 'vitest';

const preyPosition = { x: 10, y: 10, layer: 1 };
const followDistances = {
  followDistanceGrid: DEFINING_WILDLIFE_STALK_FOLLOW_DISTANCE_GRID,
  followMinDistanceGrid: DEFINING_WILDLIFE_STALK_FOLLOW_MIN_DISTANCE_GRID,
  followMaxDistanceGrid: DEFINING_WILDLIFE_STALK_FOLLOW_MAX_DISTANCE_GRID,
};

describe('resolvingWildlifeStalkEngagementIntent', () => {
  it('walks backward while facing prey when the player is too close', () => {
    const position = { x: 5, y: 10, layer: 1 };
    const intent = resolvingWildlifeStalkEngagementIntent({
      instanceId: 'wolf-1',
      nowMs: 12_000,
      position,
      preyTargetId: 'player-1',
      preyPosition,
      preyStillDurationMs: 0,
      followDistances,
      formation: { isAlpha: true, followerRank: 0 },
      alphaPosition: null,
    });

    expect(intent.mode).toBe('stalk');
    if (intent.mode !== 'stalk') {
      return;
    }

    const retreatDistance = Math.hypot(
      intent.targetPoint.x - position.x,
      intent.targetPoint.y - position.y
    );

    expect(retreatDistance).toBeCloseTo(
      DEFINING_WILDLIFE_STALK_TOO_CLOSE_RETREAT_STEP_GRID,
      5
    );
    expect(intent.pace).toBe('walk');
    expect(intent.facingPoint).toEqual(preyPosition);
  });

  it('keeps stalking with a shadow wander or hold while facing prey', () => {
    const position = {
      x: preyPosition.x - DEFINING_WILDLIFE_STALK_FOLLOW_DISTANCE_GRID,
      y: preyPosition.y,
      layer: 1,
    };
    const intent = resolvingWildlifeStalkEngagementIntent({
      instanceId: 'wolf-2',
      nowMs: 20_000,
      position,
      preyTargetId: 'player-1',
      preyPosition,
      preyStillDurationMs: 5_000,
      followDistances,
      formation: { isAlpha: true, followerRank: 0 },
      alphaPosition: null,
    });

    expect(intent.mode).toBe('stalk');
    if (intent.mode !== 'stalk') {
      return;
    }

    expect(intent.facingPoint).toEqual(preyPosition);
    expect(intent.pace).toBe('walk');

    const distanceToPrey = Math.hypot(
      intent.targetPoint.x - preyPosition.x,
      intent.targetPoint.y - preyPosition.y
    );

    expect(distanceToPrey).toBeGreaterThanOrEqual(
      DEFINING_WILDLIFE_STALK_FOLLOW_MIN_DISTANCE_GRID - 0.01
    );
    expect(distanceToPrey).toBeLessThanOrEqual(
      DEFINING_WILDLIFE_STALK_FOLLOW_MAX_DISTANCE_GRID + 0.01
    );
  });

  it('re-rolls comfort-band shadow wander on a stable time bucket', () => {
    const position = {
      x: preyPosition.x - DEFINING_WILDLIFE_STALK_FOLLOW_DISTANCE_GRID,
      y: preyPosition.y + 0.5,
      layer: 1,
    };
    const bucketMs = DEFINING_WILDLIFE_STALK_SHADOW_WANDER_BUCKET_MS;
    const firstIntent = resolvingWildlifeStalkEngagementIntent({
      instanceId: 'wolf-3',
      nowMs: bucketMs + 100,
      position,
      preyTargetId: 'player-1',
      preyPosition,
      preyStillDurationMs: 0,
      followDistances,
      formation: { isAlpha: true, followerRank: 0 },
      alphaPosition: null,
    });
    const sameBucketIntent = resolvingWildlifeStalkEngagementIntent({
      instanceId: 'wolf-3',
      nowMs: bucketMs + 900,
      position,
      preyTargetId: 'player-1',
      preyPosition,
      preyStillDurationMs: 0,
      followDistances,
      formation: { isAlpha: true, followerRank: 0 },
      alphaPosition: null,
    });

    expect(firstIntent).toEqual(sameBucketIntent);
  });

  it('pulls followers toward the pack alpha when they drift past ideal trail gap', () => {
    const alphaPosition = { x: 4, y: 10, layer: 1 };
    const position = { x: -5, y: 10, layer: 1 };
    const intent = resolvingWildlifeStalkEngagementIntent({
      instanceId: 'wolf-follower',
      nowMs: 36_000,
      position,
      preyTargetId: 'player-1',
      preyPosition,
      preyStillDurationMs: 0,
      followDistances,
      formation: { isAlpha: false, followerRank: 1 },
      alphaPosition,
    });

    expect(intent.mode).toBe('stalk');
    if (intent.mode !== 'stalk') {
      return;
    }

    expect(intent.facingPoint).toEqual(preyPosition);
    expect(intent.targetPoint.x).toBeGreaterThan(position.x);
  });
});
