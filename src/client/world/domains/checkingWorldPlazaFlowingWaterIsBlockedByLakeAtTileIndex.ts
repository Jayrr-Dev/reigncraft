import {
  checkingWorldPlazaLakeBasinFringeInfluencesTileAtTileIndex,
  findingWorldPlazaNearestLakeBasinOccupyingTileNearTileIndex,
} from "@/components/world/domains/checkingWorldPlazaLakeBasinOccupiesTileAtTileIndex";
import {
  checkingWorldPlazaFlowingWaterIsOnLakeInflowSideAtTileIndex,
  resolvingWorldPlazaLakeClusterAnchorTileIndexAtTileIndex,
} from "@/components/world/domains/resolvingWorldPlazaLakeInflowDirectionAtTileIndex";

/**
 * Blocks rivers and streams that would cut through or exit the far side of lakes.
 *
 * @module components/world/domains/checkingWorldPlazaFlowingWaterIsBlockedByLakeAtTileIndex
 */

/**
 * Returns true when a flowing-water tile should be rejected because it sits on
 * the outflow side of a nearby lake or inside its basin fringe.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaFlowingWaterIsBlockedByLakeAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  const nearestLakeTile =
    findingWorldPlazaNearestLakeBasinOccupyingTileNearTileIndex(tileX, tileY);

  if (nearestLakeTile) {
    return !checkingWorldPlazaFlowingWaterIsOnLakeInflowSideAtTileIndex(
      tileX,
      tileY,
      nearestLakeTile.tileX,
      nearestLakeTile.tileY,
    );
  }

  if (!checkingWorldPlazaLakeBasinFringeInfluencesTileAtTileIndex(tileX, tileY)) {
    return false;
  }

  const clusterAnchor = resolvingWorldPlazaLakeClusterAnchorTileIndexAtTileIndex(
    tileX,
    tileY,
  );

  return !checkingWorldPlazaFlowingWaterIsOnLakeInflowSideAtTileIndex(
    tileX,
    tileY,
    clusterAnchor.tileX,
    clusterAnchor.tileY,
  );
}
