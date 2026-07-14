/**
 * True when land sits within Chebyshev radius of surface water.
 *
 * @module components/world/domains/checkingWorldPlazaLandNearSurfaceWaterAtTileIndex
 */

import { DEFINING_WORLD_PLAZA_ORE_NEAR_WATER_RADIUS_TILES } from '@/components/world/domains/definingWorldPlazaOreBiomeRarityConstants';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';

/**
 * Returns true when any tile within radius holds lake / river / stream / pond water.
 */
export function checkingWorldPlazaLandNearSurfaceWaterAtTileIndex(
  tileX: number,
  tileY: number,
  radiusTiles: number = DEFINING_WORLD_PLAZA_ORE_NEAR_WATER_RADIUS_TILES
): boolean {
  if (radiusTiles < 0) {
    return false;
  }

  for (let deltaY = -radiusTiles; deltaY <= radiusTiles; deltaY += 1) {
    for (let deltaX = -radiusTiles; deltaX <= radiusTiles; deltaX += 1) {
      if (deltaX === 0 && deltaY === 0) {
        continue;
      }

      if (
        resolvingWorldPlazaWaterAtTileIndex(tileX + deltaX, tileY + deltaY)
      ) {
        return true;
      }
    }
  }

  return false;
}
