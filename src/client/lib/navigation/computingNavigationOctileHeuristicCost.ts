/**
 * Octile heuristic for eight-direction grid A*.
 *
 * @module lib/navigation/computingNavigationOctileHeuristicCost
 */

import {
  DEFINING_NAVIGATION_CARDINAL_MOVE_COST,
  DEFINING_NAVIGATION_DIAGONAL_MOVE_COST,
} from '@/lib/navigation/definingNavigationAStarConstants';
import type { DefiningNavigationGridNode } from '@/lib/navigation/definingNavigationGridTypes';

/**
 * Admissible octile distance for uniform cardinal/diagonal costs.
 */
export function computingNavigationOctileHeuristicCost(
  from: DefiningNavigationGridNode,
  to: DefiningNavigationGridNode
): number {
  const deltaX = Math.abs(to.x - from.x);
  const deltaY = Math.abs(to.y - from.y);
  const minAxis = Math.min(deltaX, deltaY);
  const maxAxis = Math.max(deltaX, deltaY);

  return (
    minAxis * DEFINING_NAVIGATION_DIAGONAL_MOVE_COST +
    (maxAxis - minAxis) * DEFINING_NAVIGATION_CARDINAL_MOVE_COST
  );
}
