import {
  computingRandomWalk1dPath,
  computingRandomWalk1dPositionAtStep,
  computingRandomWalk2dPath,
  computingRandomWalk2dPathFromSeed,
  computingRandomWalk2dPositionAtStep,
  computingRandomWalkSpreadRadiusGrid,
  rollingRandomWalkAxisStep,
  rollingRandomWalkCardinalDirection,
} from '@/lib/probability/computingRandomWalk';
import { creatingSeededRandomNumberGenerator } from '@/lib/probability/creatingSeededRandomNumberGenerator';
import { describe, expect, it } from 'vitest';

function creatingDeterministicRandom(values: readonly number[]): () => number {
  let index = 0;

  return () => {
    const value = values[index] ?? 0.5;
    index += 1;
    return value;
  };
}

describe('computingRandomWalk', () => {
  it('rolls axis steps from forward probability', () => {
    expect(rollingRandomWalkAxisStep(() => 0.1)).toBe(1);
    expect(rollingRandomWalkAxisStep(() => 0.9)).toBe(-1);
    expect(rollingRandomWalkAxisStep(() => 0.5, 0.75)).toBe(1);
    expect(rollingRandomWalkAxisStep(() => 0.74, 0.75)).toBe(1);
    expect(rollingRandomWalkAxisStep(() => 0.76, 0.75)).toBe(-1);
  });

  it('rolls cardinal directions from uniform draws', () => {
    expect(rollingRandomWalkCardinalDirection(() => 0)).toBe('north');
    expect(rollingRandomWalkCardinalDirection(() => 0.24)).toBe('north');
    expect(rollingRandomWalkCardinalDirection(() => 0.25)).toBe('east');
    expect(rollingRandomWalkCardinalDirection(() => 0.99)).toBe('west');
  });

  it('computes 1D position as start plus signed steps', () => {
    const position = computingRandomWalk1dPositionAtStep({
      start: 4,
      stepCount: 3,
      stepLength: 2,
      random: creatingDeterministicRandom([0.1, 0.9, 0.1]),
    });

    expect(position).toBe(6);
  });

  it('computes 2D position from cardinal deltas', () => {
    const position = computingRandomWalk2dPositionAtStep({
      start: { x: 0, y: 0 },
      stepCount: 2,
      random: creatingDeterministicRandom([0.25, 0.75]),
    });

    expect(position).toEqual({ x: 0, y: 0 });
  });

  it('builds paths that include the start and each step position', () => {
    const path1d = computingRandomWalk1dPath({
      start: 0,
      stepCount: 2,
      random: creatingDeterministicRandom([0.1, 0.9]),
    });
    const path2d = computingRandomWalk2dPath({
      start: { x: 5, y: 5 },
      stepCount: 2,
      random: creatingDeterministicRandom([0, 0.5]),
    });

    expect(path1d).toEqual([0, 1, 0]);
    expect(path2d).toEqual([
      { x: 5, y: 5 },
      { x: 5, y: 4 },
      { x: 5, y: 5 },
    ]);
  });

  it('scales spread radius with sqrt(stepCount)', () => {
    expect(computingRandomWalkSpreadRadiusGrid(0)).toBe(0);
    expect(computingRandomWalkSpreadRadiusGrid(9, 2)).toBe(6);
    expect(computingRandomWalkSpreadRadiusGrid(16)).toBe(4);
  });

  it('produces stable seeded 2D paths', () => {
    const firstPath = computingRandomWalk2dPathFromSeed({
      seed: 42,
      start: { x: 10, y: 10 },
      stepCount: 5,
    });
    const secondPath = computingRandomWalk2dPathFromSeed({
      seed: 42,
      start: { x: 10, y: 10 },
      stepCount: 5,
    });

    expect(firstPath).toEqual(secondPath);
    expect(firstPath).toHaveLength(6);
  });

  it('centers fair 1D walks near the start over many seeded trials', () => {
    const trialCount = 500;
    const stepCount = 64;
    let totalDisplacement = 0;

    for (let trialIndex = 0; trialIndex < trialCount; trialIndex += 1) {
      totalDisplacement += computingRandomWalk1dPositionAtStep({
        start: 0,
        stepCount,
        random: creatingSeededRandomNumberGenerator(trialIndex + 1),
      });
    }

    expect(Math.abs(totalDisplacement / trialCount)).toBeLessThan(2);
  });
});
