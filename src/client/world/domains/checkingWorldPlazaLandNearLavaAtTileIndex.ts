/**
 * True when a tile sits on or within Chebyshev radius of molten lava.
 *
 * @module components/world/domains/checkingWorldPlazaLandNearLavaAtTileIndex
 */

import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';

/**
 * Returns true when any tile within radius (including the center) is lava.
 */
export function checkingWorldPlazaLandNearLavaAtTileIndex(
  tileX: number,
  tileY: number,
  radiusTiles: number
): boolean {
  if (radiusTiles < 0) {
    return false;
  }

  for (let deltaY = -radiusTiles; deltaY <= radiusTiles; deltaY += 1) {
    for (let deltaX = -radiusTiles; deltaX <= radiusTiles; deltaX += 1) {
      if (checkingWorldPlazaLavaAtTileIndex(tileX + deltaX, tileY + deltaY)) {
        return true;
      }
    }
  }

  return false;
}
