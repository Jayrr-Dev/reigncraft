/**
 * Declarative defaults for random-walk sampling.
 *
 * A fair walk uses equal forward/back (or cardinal) probabilities. Over n
 * steps the expected displacement is 0 while typical spread grows like sqrt(n).
 *
 * @module lib/probability/definingRandomWalkConstants
 */

/** Probability of a +1 axis step in a fair one-dimensional walk. */
export const DEFINING_RANDOM_WALK_FAIR_FORWARD_PROBABILITY = 0.5;

/** Default distance traveled per step on the plaza grid. */
export const DEFINING_RANDOM_WALK_DEFAULT_STEP_LENGTH_GRID = 1;

/** Typical spread scales with stepCount raised to this exponent (0.5 = sqrt). */
export const DEFINING_RANDOM_WALK_SPREAD_SCALING_EXPONENT = 0.5;

export type DefiningRandomWalkAxisStep = -1 | 1;

export type DefiningRandomWalkPoint2d = {
  readonly x: number;
  readonly y: number;
};

export type DefiningRandomWalkCardinalDirection =
  | 'north'
  | 'east'
  | 'south'
  | 'west';

/** Unit grid deltas for each cardinal direction. */
export const DEFINING_RANDOM_WALK_CARDINAL_STEP_DELTAS: Record<
  DefiningRandomWalkCardinalDirection,
  DefiningRandomWalkPoint2d
> = {
  north: { x: 0, y: -1 },
  east: { x: 1, y: 0 },
  south: { x: 0, y: 1 },
  west: { x: -1, y: 0 },
};

/** Ordered list consumed when rolling a cardinal step. */
export const DEFINING_RANDOM_WALK_CARDINAL_DIRECTIONS: readonly DefiningRandomWalkCardinalDirection[] =
  ['north', 'east', 'south', 'west'];
