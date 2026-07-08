/**
 * Pure random-walk helpers for pathing and wander sampling.
 *
 * Position after n steps: S_n = Z + X_1 + ... + X_n
 *
 * @module lib/probability/computingRandomWalk
 */

import { creatingSeededRandomNumberGenerator } from '@/lib/probability/creatingSeededRandomNumberGenerator';
import {
  DEFINING_RANDOM_WALK_CARDINAL_DIRECTIONS,
  DEFINING_RANDOM_WALK_CARDINAL_STEP_DELTAS,
  DEFINING_RANDOM_WALK_DEFAULT_STEP_LENGTH_GRID,
  DEFINING_RANDOM_WALK_FAIR_FORWARD_PROBABILITY,
  DEFINING_RANDOM_WALK_SPREAD_SCALING_EXPONENT,
  type DefiningRandomWalkAxisStep,
  type DefiningRandomWalkCardinalDirection,
  type DefiningRandomWalkPoint2d,
} from '@/lib/probability/definingRandomWalkConstants';

export type ComputingRandomWalkRandom = () => number;

export type ComputingRandomWalk1dParams = {
  readonly start: number;
  readonly stepCount: number;
  readonly forwardProbability?: number;
  readonly stepLength?: number;
  readonly random: ComputingRandomWalkRandom;
};

export type ComputingRandomWalk2dParams = {
  readonly start: DefiningRandomWalkPoint2d;
  readonly stepCount: number;
  readonly stepLength?: number;
  readonly random: ComputingRandomWalkRandom;
};

export type ComputingRandomWalkSeededParams = Omit<
  ComputingRandomWalk2dParams,
  'random'
> & {
  readonly seed: number;
};

/** Rolls a single fair or biased axis step (+1 or -1). */
export function rollingRandomWalkAxisStep(
  random: ComputingRandomWalkRandom,
  forwardProbability = DEFINING_RANDOM_WALK_FAIR_FORWARD_PROBABILITY
): DefiningRandomWalkAxisStep {
  return random() < forwardProbability ? 1 : -1;
}

/** Rolls one of the four cardinal directions with equal probability. */
export function rollingRandomWalkCardinalDirection(
  random: ComputingRandomWalkRandom
): DefiningRandomWalkCardinalDirection {
  const directionIndex = Math.floor(
    random() * DEFINING_RANDOM_WALK_CARDINAL_DIRECTIONS.length
  );

  return DEFINING_RANDOM_WALK_CARDINAL_DIRECTIONS[
    Math.min(
      directionIndex,
      DEFINING_RANDOM_WALK_CARDINAL_DIRECTIONS.length - 1
    )
  ];
}

/**
 * Typical displacement radius for a fair walk: stepLength * sqrt(stepCount).
 */
export function computingRandomWalkSpreadRadiusGrid(
  stepCount: number,
  stepLength = DEFINING_RANDOM_WALK_DEFAULT_STEP_LENGTH_GRID
): number {
  if (stepCount <= 0) {
    return 0;
  }

  return (
    stepLength * stepCount ** DEFINING_RANDOM_WALK_SPREAD_SCALING_EXPONENT
  );
}

/** Final position S_n on one axis after stepCount independent steps. */
export function computingRandomWalk1dPositionAtStep({
  start,
  stepCount,
  forwardProbability = DEFINING_RANDOM_WALK_FAIR_FORWARD_PROBABILITY,
  stepLength = DEFINING_RANDOM_WALK_DEFAULT_STEP_LENGTH_GRID,
  random,
}: ComputingRandomWalk1dParams): number {
  let position = start;

  for (let stepIndex = 0; stepIndex < stepCount; stepIndex += 1) {
    position +=
      rollingRandomWalkAxisStep(random, forwardProbability) * stepLength;
  }

  return position;
}

/** Final position S_n in the plane after stepCount cardinal steps. */
export function computingRandomWalk2dPositionAtStep({
  start,
  stepCount,
  stepLength = DEFINING_RANDOM_WALK_DEFAULT_STEP_LENGTH_GRID,
  random,
}: ComputingRandomWalk2dParams): DefiningRandomWalkPoint2d {
  let x = start.x;
  let y = start.y;

  for (let stepIndex = 0; stepIndex < stepCount; stepIndex += 1) {
    const direction = rollingRandomWalkCardinalDirection(random);
    const delta = DEFINING_RANDOM_WALK_CARDINAL_STEP_DELTAS[direction];

    x += delta.x * stepLength;
    y += delta.y * stepLength;
  }

  return { x, y };
}

/**
 * Positions along a 1D walk, including the start (length stepCount + 1).
 */
export function computingRandomWalk1dPath(
  params: ComputingRandomWalk1dParams
): readonly number[] {
  const {
    start,
    stepCount,
    forwardProbability = DEFINING_RANDOM_WALK_FAIR_FORWARD_PROBABILITY,
    stepLength = DEFINING_RANDOM_WALK_DEFAULT_STEP_LENGTH_GRID,
    random,
  } = params;

  const path: number[] = [start];
  let position = start;

  for (let stepIndex = 0; stepIndex < stepCount; stepIndex += 1) {
    position +=
      rollingRandomWalkAxisStep(random, forwardProbability) * stepLength;
    path.push(position);
  }

  return path;
}

/**
 * Positions along a 2D cardinal walk, including the start (length stepCount + 1).
 */
export function computingRandomWalk2dPath(
  params: ComputingRandomWalk2dParams
): readonly DefiningRandomWalkPoint2d[] {
  const {
    start,
    stepCount,
    stepLength = DEFINING_RANDOM_WALK_DEFAULT_STEP_LENGTH_GRID,
    random,
  } = params;

  const path: DefiningRandomWalkPoint2d[] = [start];
  let x = start.x;
  let y = start.y;

  for (let stepIndex = 0; stepIndex < stepCount; stepIndex += 1) {
    const direction = rollingRandomWalkCardinalDirection(random);
    const delta = DEFINING_RANDOM_WALK_CARDINAL_STEP_DELTAS[direction];

    x += delta.x * stepLength;
    y += delta.y * stepLength;
    path.push({ x, y });
  }

  return path;
}

/** Deterministic 2D path from a numeric seed (stable across sessions). */
export function computingRandomWalk2dPathFromSeed(
  params: ComputingRandomWalkSeededParams
): readonly DefiningRandomWalkPoint2d[] {
  const { seed, ...pathParams } = params;

  return computingRandomWalk2dPath({
    ...pathParams,
    random: creatingSeededRandomNumberGenerator(seed),
  });
}
