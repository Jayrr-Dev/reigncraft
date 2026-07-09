import {
  computingBoundedRandomWalk1dPath,
  computingBoundedRandomWalk2dPath,
  computingBoundedRandomWalk2dPathFromSeed,
} from '@/lib/probability/computingBoundedRandomWalk';
import { checkingRandomWalkPointWithinArea } from '@/lib/probability/checkingRandomWalkPointWithinArea';
import {
  definingRandomWalkCircleAreaFromCenter,
  definingRandomWalkRectAreaFromCenter,
} from '@/lib/probability/definingRandomWalkArea';
import { describe, expect, it } from 'vitest';

function creatingDeterministicRandom(values: readonly number[]): () => number {
  let index = 0;

  return () => {
    const value = values[index] ?? 0.5;
    index += 1;
    return value;
  };
}

describe('computingBoundedRandomWalk', () => {
  it('keeps a 1D reject-step walk inside axis bounds', () => {
    const path = computingBoundedRandomWalk1dPath({
      start: 0,
      stepCount: 6,
      bounds: { min: -2, max: 2 },
      boundaryMode: 'rejectStep',
      random: creatingDeterministicRandom([0.1, 0.1, 0.1, 0.1, 0.1, 0.1]),
    });

    for (const position of path) {
      expect(position).toBeGreaterThanOrEqual(-2);
      expect(position).toBeLessThanOrEqual(2);
    }
  });

  it('reflects a 1D walk at the boundary', () => {
    const path = computingBoundedRandomWalk1dPath({
      start: 1,
      stepCount: 2,
      bounds: { min: 0, max: 2 },
      boundaryMode: 'reflect',
      random: creatingDeterministicRandom([0.1, 0.1]),
    });

    expect(path).toEqual([1, 2, 1]);
  });

  it('keeps a rectangular reject-step walk inside the area', () => {
    const area = definingRandomWalkRectAreaFromCenter({ x: 10, y: 10 }, 2, 2);
    const path = computingBoundedRandomWalk2dPath({
      start: { x: 11, y: 10 },
      stepCount: 8,
      area,
      boundaryMode: 'rejectStep',
      random: creatingDeterministicRandom([
        0, 0.25, 0.5, 0.75, 0, 0.25, 0.5, 0.75,
      ]),
    });

    for (const point of path) {
      expect(checkingRandomWalkPointWithinArea(point, area)).toBe(true);
    }
  });

  it('clamps a circular walk to the roam disc', () => {
    const area = definingRandomWalkCircleAreaFromCenter({ x: 0, y: 0 }, 2);
    const path = computingBoundedRandomWalk2dPath({
      start: { x: 1.5, y: 0 },
      stepCount: 4,
      area,
      boundaryMode: 'clamp',
      random: creatingDeterministicRandom([0, 0, 0, 0]),
    });

    for (const point of path) {
      expect(Math.hypot(point.x, point.y)).toBeLessThanOrEqual(2.000001);
    }
  });

  it('produces stable seeded bounded paths', () => {
    const area = definingRandomWalkRectAreaFromCenter({ x: 5, y: 5 }, 3, 3);
    const firstPath = computingBoundedRandomWalk2dPathFromSeed({
      seed: 99,
      start: { x: 5, y: 5 },
      stepCount: 6,
      area,
    });
    const secondPath = computingBoundedRandomWalk2dPathFromSeed({
      seed: 99,
      start: { x: 5, y: 5 },
      stepCount: 6,
      area,
    });

    expect(firstPath).toEqual(secondPath);
  });
});
