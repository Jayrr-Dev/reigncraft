import { checkingWorldPlazaTerrainRockColumnSpacingAnchorAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTerrainRockColumnSpacingAnchorAtTileIndex';
import { checkingWorldPlazaTileIsRockyBiomeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileIsRockyBiomeAtTileIndex';
import { resolvingWorldPlazaRockyBiomeStoneClusterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaRockyBiomeStoneClusterAtTileIndex';

/**
 * Spawn-anchor gate for column rocks, including rocky 1-3 cluster slots.
 *
 * @module components/world/domains/checkingWorldPlazaColumnRockSpawnAnchorAtTileIndex
 */

/**
 * Returns true when this tile may attempt a column-rock spawn.
 *
 * Standard worlds use the mega spacing grid. Rocky biome also allows tighter
 * cluster spacing anchors when the tile wins one of the cell's 1-3 slots.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaColumnRockSpawnAnchorAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  if (
    checkingWorldPlazaTerrainRockColumnSpacingAnchorAtTileIndex(tileX, tileY)
  ) {
    return true;
  }

  if (!checkingWorldPlazaTileIsRockyBiomeAtTileIndex(tileX, tileY)) {
    return false;
  }

  return resolvingWorldPlazaRockyBiomeStoneClusterAtTileIndex(tileX, tileY)
    .isClusterMemberSlot;
}
