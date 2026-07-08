/**
 * Converts navigation grid nodes back to plaza world points.
 *
 * @module components/world/navigation/domains/resolvingWorldPlazaNavigationWorldPointFromGridNode
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningNavigationGridNode } from '@/lib/navigation/definingNavigationGridTypes';

/**
 * Returns the tile-center world point for one navigation node.
 */
export function resolvingWorldPlazaNavigationWorldPointFromGridNode(
  node: DefiningNavigationGridNode
): DefiningWorldPlazaWorldPoint {
  return {
    x: node.x,
    y: node.y,
    layer: node.layer,
  };
}
