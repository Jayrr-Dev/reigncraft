import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { ResolvingWorldPlazaIsometricTileIndex } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';

/**
 * Resolves the grid-space center of an isometric tile diamond.
 *
 * Plaza tile anchors sit at integer `(tileX, tileY)` (same convention as
 * wildlife spawn and teleport helpers).
 *
 * @module components/world/domains/resolvingWorldPlazaTileGravityWellAttractorPoint
 */

/**
 * Returns the attractor world point for a tile index.
 *
 * @param tileIndex - Tile column/row.
 * @param layer - Optional standing layer copied onto the point.
 */
export function resolvingWorldPlazaTileGravityWellAttractorPoint(
  tileIndex: ResolvingWorldPlazaIsometricTileIndex,
  layer?: number
): DefiningWorldPlazaWorldPoint {
  return {
    x: tileIndex.tileX,
    y: tileIndex.tileY,
    ...(layer === undefined ? {} : { layer }),
  };
}
