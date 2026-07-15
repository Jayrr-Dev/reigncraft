/**
 * Blocks mushroom spawn on water and within one tile of water.
 *
 * @module components/world/mushrooms/domains/checkingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndex
 */

import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { DEFINING_WORLD_PLAZA_MUSHROOM_WATER_BUFFER_TILES } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomConstants';

export type CheckingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndexParams = {
  readonly tileX: number;
  readonly tileY: number;
  readonly checkingWaterAtTile?: (tileX: number, tileY: number) => boolean;
  readonly bufferTiles?: number;
};

/**
 * True when the tile is water or any Chebyshev neighbor within the buffer has water.
 */
export function checkingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndex({
  tileX,
  tileY,
  checkingWaterAtTile = (tileX, tileY) =>
    resolvingWorldPlazaWaterAtTileIndex(tileX, tileY) != null,
  bufferTiles = DEFINING_WORLD_PLAZA_MUSHROOM_WATER_BUFFER_TILES,
}: CheckingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndexParams): boolean {
  if (checkingWaterAtTile(tileX, tileY)) {
    return true;
  }

  if (bufferTiles < 1) {
    return false;
  }

  for (let deltaY = -bufferTiles; deltaY <= bufferTiles; deltaY += 1) {
    for (let deltaX = -bufferTiles; deltaX <= bufferTiles; deltaX += 1) {
      if (deltaX === 0 && deltaY === 0) {
        continue;
      }

      if (checkingWaterAtTile(tileX + deltaX, tileY + deltaY)) {
        return true;
      }
    }
  }

  return false;
}
