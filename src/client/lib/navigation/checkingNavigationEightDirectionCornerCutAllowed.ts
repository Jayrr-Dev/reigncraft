/**
 * Corner-cutting guard for eight-direction grid moves.
 *
 * @module lib/navigation/checkingNavigationEightDirectionCornerCutAllowed
 */

import type {
  DefiningNavigationGridNode,
  DefiningNavigationMoveCostResolver,
} from '@/lib/navigation/definingNavigationGridTypes';
import { resolvingNavigationGridNeighborNode } from '@/lib/navigation/resolvingNavigationGridNodeKey';

/**
 * Returns false when a diagonal step would cut through a blocked corner.
 */
export function checkingNavigationEightDirectionCornerCutAllowed(
  from: DefiningNavigationGridNode,
  offset: { readonly dx: number; readonly dy: number },
  resolveMoveCost: DefiningNavigationMoveCostResolver
): boolean {
  if (offset.dx === 0 || offset.dy === 0) {
    return true;
  }

  const sideNodeA = resolvingNavigationGridNeighborNode(from, {
    dx: offset.dx,
    dy: 0,
  });
  const sideNodeB = resolvingNavigationGridNeighborNode(from, {
    dx: 0,
    dy: offset.dy,
  });

  return (
    resolveMoveCost(from, sideNodeA) !== null &&
    resolveMoveCost(from, sideNodeB) !== null
  );
}
