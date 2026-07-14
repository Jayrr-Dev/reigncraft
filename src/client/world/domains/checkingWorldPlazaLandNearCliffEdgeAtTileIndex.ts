/**
 * True when a tile sits on or within Chebyshev radius of a cliff-edge tile.
 *
 * @module components/world/domains/checkingWorldPlazaLandNearCliffEdgeAtTileIndex
 */

import { checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex';

/**
 * Returns true when any tile within radius (including the center) is a cliff edge.
 */
export function checkingWorldPlazaLandNearCliffEdgeAtTileIndex(
  tileX: number,
  tileY: number,
  radiusTiles: number
): boolean {
  if (radiusTiles < 0) {
    return false;
  }

  for (let deltaY = -radiusTiles; deltaY <= radiusTiles; deltaY += 1) {
    for (let deltaX = -radiusTiles; deltaX <= radiusTiles; deltaX += 1) {
      if (
        checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex(
          tileX + deltaX,
          tileY + deltaY
        )
      ) {
        return true;
      }
    }
  }

  return false;
}
