/**
 * Shared grid-navigation domain types for pathfinding utilities.
 *
 * @module lib/navigation/definingNavigationGridTypes
 */

/** Integer tile coordinate on a navigation grid. Layer is optional for 2.5D maps. */
export type DefiningNavigationGridNode = {
  readonly x: number;
  readonly y: number;
  readonly layer?: number;
};

/** Declarative movement topology ids consumed by the A* registry. */
export type DefiningNavigationMovementModeId =
  | 'four_direction'
  | 'eight_direction';

/** Declarative heuristic ids consumed by the A* registry. */
export type DefiningNavigationHeuristicId = 'manhattan' | 'octile';

/**
 * Returns move cost from `from` to adjacent `to`, or null when impassable.
 * Terrain weighting and hazard rules live in the caller.
 */
export type DefiningNavigationMoveCostResolver = (
  from: DefiningNavigationGridNode,
  to: DefiningNavigationGridNode
) => number | null;

/** Pure request object for {@link computingNavigationAStarPath}. */
export type DefiningNavigationAStarRequest = {
  readonly start: DefiningNavigationGridNode;
  readonly goal: DefiningNavigationGridNode;
  readonly resolveMoveCost: DefiningNavigationMoveCostResolver;
  readonly movementModeId?: DefiningNavigationMovementModeId;
  readonly heuristicId?: DefiningNavigationHeuristicId;
  readonly maxNodeExpansions?: number;
  readonly preventCornerCutting?: boolean;
};

/** Outcome status for a single A* search. */
export type DefiningNavigationAStarStatus =
  | 'found'
  | 'unreachable'
  | 'expansion_limit'
  | 'same_node';

/** Result of {@link computingNavigationAStarPath}. Path includes start and goal when found. */
export type DefiningNavigationAStarResult = {
  readonly status: DefiningNavigationAStarStatus;
  readonly path: readonly DefiningNavigationGridNode[];
  readonly totalCost: number;
  readonly nodesExpanded: number;
};
