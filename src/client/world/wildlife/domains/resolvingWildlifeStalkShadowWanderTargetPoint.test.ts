import {
  DEFINING_WILDLIFE_STALK_FOLLOW_MAX_DISTANCE_GRID,
  DEFINING_WILDLIFE_STALK_FOLLOW_MIN_DISTANCE_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import { resolvingWildlifeStalkShadowWanderTargetPoint } from '@/components/world/wildlife/domains/resolvingWildlifeStalkShadowWanderTargetPoint';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeStalkShadowWanderTargetPoint', () => {
  const preyPosition = { x: 10, y: 10, layer: 1 };
  const position = { x: 10 - 7.5, y: 10, layer: 1 };

  it('stays inside the follow ring and outside the too-close band', () => {
    const target = resolvingWildlifeStalkShadowWanderTargetPoint({
      instanceId: 'wolf-shadow-1',
      position,
      preyPosition,
      followMinDistanceGrid: DEFINING_WILDLIFE_STALK_FOLLOW_MIN_DISTANCE_GRID,
      followMaxDistanceGrid: DEFINING_WILDLIFE_STALK_FOLLOW_MAX_DISTANCE_GRID,
      timeBucket: 3,
    });
    const distance = Math.hypot(
      target.x - preyPosition.x,
      target.y - preyPosition.y
    );

    expect(distance).toBeGreaterThanOrEqual(
      DEFINING_WILDLIFE_STALK_FOLLOW_MIN_DISTANCE_GRID - 0.001
    );
    expect(distance).toBeLessThanOrEqual(
      DEFINING_WILDLIFE_STALK_FOLLOW_MAX_DISTANCE_GRID + 0.001
    );
  });

  it('is stable for the same instance and time bucket', () => {
    const first = resolvingWildlifeStalkShadowWanderTargetPoint({
      instanceId: 'wolf-shadow-2',
      position,
      preyPosition,
      followMinDistanceGrid: DEFINING_WILDLIFE_STALK_FOLLOW_MIN_DISTANCE_GRID,
      followMaxDistanceGrid: DEFINING_WILDLIFE_STALK_FOLLOW_MAX_DISTANCE_GRID,
      timeBucket: 5,
    });
    const second = resolvingWildlifeStalkShadowWanderTargetPoint({
      instanceId: 'wolf-shadow-2',
      position,
      preyPosition,
      followMinDistanceGrid: DEFINING_WILDLIFE_STALK_FOLLOW_MIN_DISTANCE_GRID,
      followMaxDistanceGrid: DEFINING_WILDLIFE_STALK_FOLLOW_MAX_DISTANCE_GRID,
      timeBucket: 5,
    });

    expect(first).toEqual(second);
  });
});
