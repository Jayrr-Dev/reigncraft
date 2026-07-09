/**
 * Random walks constrained to a caller-defined area.
 *
 * Position after n steps: S_n = Z + X_1 + ... + X_n, kept inside bounds.
 *
 * @module lib/probability/computingBoundedRandomWalk
 */

import {
  checkingRandomWalkPointWithinArea,
  checkingRandomWalkValueWithinAxisBounds,
} from '@/lib/probability/checkingRandomWalkPointWithinArea';
import {
  rollingRandomWalkAxisStep,
  type ComputingRandomWalkRandom,
} from '@/lib/probability/computingRandomWalk';
import { creatingSeededRandomNumberGenerator } from '@/lib/probability/creatingSeededRandomNumberGenerator';
import {
  DEFINING_RANDOM_WALK_CARDINAL_DIRECTIONS,
  DEFINING_RANDOM_WALK_CARDINAL_STEP_DELTAS,
  DEFINING_RANDOM_WALK_DEFAULT_STEP_LENGTH_GRID,
  DEFINING_RANDOM_WALK_FAIR_FORWARD_PROBABILITY,
  type DefiningRandomWalkPoint2d,
} from '@/lib/probability/definingRandomWalkConstants';
import type {
  DefiningRandomWalkArea,
  DefiningRandomWalkAxisBounds,
  DefiningRandomWalkBoundaryMode,
} from '@/lib/probability/definingRandomWalkArea';
import {
  resolvingRandomWalkPointWithinArea,
  resolvingRandomWalkScalarWithinAxisBounds,
} from '@/lib/probability/resolvingRandomWalkPointWithinArea';

export type ComputingBoundedRandomWalk1dParams = {
  readonly start: number;
  readonly stepCount: number;
  readonly bounds: DefiningRandomWalkAxisBounds;
  readonly boundaryMode?: DefiningRandomWalkBoundaryMode;
  readonly forwardProbability?: number;
  readonly stepLength?: number;
  readonly random: ComputingRandomWalkRandom;
};

export type ComputingBoundedRandomWalk2dParams = {
  readonly start: DefiningRandomWalkPoint2d;
  readonly stepCount: number;
  readonly area: DefiningRandomWalkArea;
  readonly boundaryMode?: DefiningRandomWalkBoundaryMode;
  readonly stepLength?: number;
  readonly random: ComputingRandomWalkRandom;
};

export type ComputingBoundedRandomWalkSeededParams = Omit<
  ComputingBoundedRandomWalk2dParams,
  'random'
> & {
  readonly seed: number;
};

function rollingRandomWalkCardinalDirectionCandidates(
  random: ComputingRandomWalkRandom
): readonly (typeof DEFINING_RANDOM_WALK_CARDINAL_DIRECTIONS)[number][] {
  const startIndex = Math.floor(
    random() * DEFINING_RANDOM_WALK_CARDINAL_DIRECTIONS.length
  );

  return Array.from(
    { length: DEFINING_RANDOM_WALK_CARDINAL_DIRECTIONS.length },
    (_, offset) =>
      DEFINING_RANDOM_WALK_CARDINAL_DIRECTIONS[
        (startIndex + offset) % DEFINING_RANDOM_WALK_CARDINAL_DIRECTIONS.length
      ]
  );
}

function advancingBoundedRandomWalk1dStep(
  position: number,
  bounds: DefiningRandomWalkAxisBounds,
  boundaryMode: DefiningRandomWalkBoundaryMode,
  forwardProbability: number,
  stepLength: number,
  random: ComputingRandomWalkRandom
): number {
  const axisStep = rollingRandomWalkAxisStep(random, forwardProbability);
  const candidate = position + axisStep * stepLength;

  if (checkingRandomWalkValueWithinAxisBounds(candidate, bounds)) {
    return candidate;
  }

  if (boundaryMode === 'rejectStep') {
    const oppositeCandidate = position - axisStep * stepLength;

    if (checkingRandomWalkValueWithinAxisBounds(oppositeCandidate, bounds)) {
      return oppositeCandidate;
    }

    return position;
  }

  return resolvingRandomWalkScalarWithinAxisBounds(
    candidate,
    bounds,
    boundaryMode
  );
}

function advancingBoundedRandomWalk2dStep(
  position: DefiningRandomWalkPoint2d,
  area: DefiningRandomWalkArea,
  boundaryMode: DefiningRandomWalkBoundaryMode,
  stepLength: number,
  random: ComputingRandomWalkRandom
): DefiningRandomWalkPoint2d {
  const directionCandidates =
    rollingRandomWalkCardinalDirectionCandidates(random);

  if (boundaryMode === 'rejectStep') {
    for (const direction of directionCandidates) {
      const delta = DEFINING_RANDOM_WALK_CARDINAL_STEP_DELTAS[direction];
      const candidate = {
        x: position.x + delta.x * stepLength,
        y: position.y + delta.y * stepLength,
      };

      if (checkingRandomWalkPointWithinArea(candidate, area)) {
        return candidate;
      }
    }

    return position;
  }

  const direction = directionCandidates[0];
  const delta = DEFINING_RANDOM_WALK_CARDINAL_STEP_DELTAS[direction];
  const candidate = {
    x: position.x + delta.x * stepLength,
    y: position.y + delta.y * stepLength,
  };

  return resolvingRandomWalkPointWithinArea(candidate, area, boundaryMode);
}

/** Final 1D position after stepCount bounded steps. */
export function computingBoundedRandomWalk1dPositionAtStep(
  params: ComputingBoundedRandomWalk1dParams
): number {
  const {
    start,
    stepCount,
    bounds,
    boundaryMode = 'rejectStep',
    forwardProbability = DEFINING_RANDOM_WALK_FAIR_FORWARD_PROBABILITY,
    stepLength = DEFINING_RANDOM_WALK_DEFAULT_STEP_LENGTH_GRID,
    random,
  } = params;

  let position = start;

  for (let stepIndex = 0; stepIndex < stepCount; stepIndex += 1) {
    position = advancingBoundedRandomWalk1dStep(
      position,
      bounds,
      boundaryMode,
      forwardProbability,
      stepLength,
      random
    );
  }

  return position;
}

/** Final 2D position after stepCount bounded cardinal steps. */
export function computingBoundedRandomWalk2dPositionAtStep(
  params: ComputingBoundedRandomWalk2dParams
): DefiningRandomWalkPoint2d {
  const {
    start,
    stepCount,
    area,
    boundaryMode = 'rejectStep',
    stepLength = DEFINING_RANDOM_WALK_DEFAULT_STEP_LENGTH_GRID,
    random,
  } = params;

  let position = start;

  for (let stepIndex = 0; stepIndex < stepCount; stepIndex += 1) {
    position = advancingBoundedRandomWalk2dStep(
      position,
      area,
      boundaryMode,
      stepLength,
      random
    );
  }

  return position;
}

/** Positions along a bounded 1D walk, including the start. */
export function computingBoundedRandomWalk1dPath(
  params: ComputingBoundedRandomWalk1dParams
): readonly number[] {
  const {
    start,
    stepCount,
    bounds,
    boundaryMode = 'rejectStep',
    forwardProbability = DEFINING_RANDOM_WALK_FAIR_FORWARD_PROBABILITY,
    stepLength = DEFINING_RANDOM_WALK_DEFAULT_STEP_LENGTH_GRID,
    random,
  } = params;

  const path: number[] = [start];
  let position = start;

  for (let stepIndex = 0; stepIndex < stepCount; stepIndex += 1) {
    position = advancingBoundedRandomWalk1dStep(
      position,
      bounds,
      boundaryMode,
      forwardProbability,
      stepLength,
      random
    );
    path.push(position);
  }

  return path;
}

/** Positions along a bounded 2D walk, including the start. */
export function computingBoundedRandomWalk2dPath(
  params: ComputingBoundedRandomWalk2dParams
): readonly DefiningRandomWalkPoint2d[] {
  const {
    start,
    stepCount,
    area,
    boundaryMode = 'rejectStep',
    stepLength = DEFINING_RANDOM_WALK_DEFAULT_STEP_LENGTH_GRID,
    random,
  } = params;

  const path: DefiningRandomWalkPoint2d[] = [start];
  let position = start;

  for (let stepIndex = 0; stepIndex < stepCount; stepIndex += 1) {
    position = advancingBoundedRandomWalk2dStep(
      position,
      area,
      boundaryMode,
      stepLength,
      random
    );
    path.push(position);
  }

  return path;
}

/** Deterministic bounded 2D path from a numeric seed. */
export function computingBoundedRandomWalk2dPathFromSeed(
  params: ComputingBoundedRandomWalkSeededParams
): readonly DefiningRandomWalkPoint2d[] {
  const { seed, ...pathParams } = params;

  return computingBoundedRandomWalk2dPath({
    ...pathParams,
    random: creatingSeededRandomNumberGenerator(seed),
  });
}
