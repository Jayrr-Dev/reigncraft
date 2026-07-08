/**
 * Snaps plaza world points to navigation grid nodes.
 *
 * @module components/world/navigation/domains/resolvingWorldPlazaNavigationGridNodeFromWorldPoint
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import type { DefiningNavigationGridNode } from '@/lib/navigation/definingNavigationGridTypes';

/**
 * Maps a continuous world point to an integer tile navigation node.
 */
export function resolvingWorldPlazaNavigationGridNodeFromWorldPoint(
  worldPoint: DefiningWorldPlazaWorldPoint
): DefiningNavigationGridNode {
  const tileIndex = resolvingWorldPlazaIsometricTileIndexAtGridPoint(worldPoint);

  return {
    x: tileIndex.tileX,
    y: tileIndex.tileY,
    layer: resolvingWorldPlazaPlayerWorldLayer(worldPoint),
  };
}
