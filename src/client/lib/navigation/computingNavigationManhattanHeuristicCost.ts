/**
 * Manhattan heuristic for four-direction grid A*.
 *
 * @module lib/navigation/computingNavigationManhattanHeuristicCost
 */

import { DEFINING_NAVIGATION_CARDINAL_MOVE_COST } from '@/lib/navigation/definingNavigationAStarConstants';
import type { DefiningNavigationGridNode } from '@/lib/navigation/definingNavigationGridTypes';

/**
 * Admissible Manhattan distance scaled by cardinal move cost.
 */
export function computingNavigationManhattanHeuristicCost(
  from: DefiningNavigationGridNode,
  to: DefiningNavigationGridNode
): number {
  const deltaX = Math.abs(to.x - from.x);
  const deltaY = Math.abs(to.y - from.y);

  return (
    (deltaX + deltaY) * DEFINING_NAVIGATION_CARDINAL_MOVE_COST
  );
}
