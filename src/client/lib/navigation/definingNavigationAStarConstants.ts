/**
 * Default tuning for grid A* searches.
 *
 * @module lib/navigation/definingNavigationAStarConstants
 */

/** Default neighbor topology for plaza-style agents. */
export const DEFINING_NAVIGATION_ASTAR_DEFAULT_MOVEMENT_MODE_ID =
  'eight_direction' as const;

/** Default heuristic for eight-direction grids. */
export const DEFINING_NAVIGATION_ASTAR_DEFAULT_HEURISTIC_ID = 'octile' as const;

/** Safety cap on explored nodes per request. */
export const DEFINING_NAVIGATION_ASTAR_DEFAULT_MAX_NODE_EXPANSIONS = 4096;

/** Cardinal edge cost in uniform grids. */
export const DEFINING_NAVIGATION_CARDINAL_MOVE_COST = 1;

/** Diagonal edge cost in uniform grids (octile-compatible). */
export const DEFINING_NAVIGATION_DIAGONAL_MOVE_COST = Math.SQRT2;
