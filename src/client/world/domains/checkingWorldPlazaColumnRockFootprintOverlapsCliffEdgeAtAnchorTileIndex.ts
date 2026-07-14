import { checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex';

/**
 * Cliff-edge overlap checks for multi-tile column-rock footprints.
 *
 * @module components/world/domains/checkingWorldPlazaColumnRockFootprintOverlapsCliffEdgeAtAnchorTileIndex
 */

/**
 * Returns true when any tile in a column-rock footprint sits on a slope rim
 * (raised surface with a lower cardinal neighbor).
 *
 * @param anchorTileX - Spacing anchor column index.
 * @param anchorTileY - Spacing anchor row index.
 * @param footprintTileWidth - Footprint width in tiles.
 * @param footprintTileHeight - Footprint height in tiles.
 */
export function checkingWorldPlazaColumnRockFootprintOverlapsCliffEdgeAtAnchorTileIndex(
  anchorTileX: number,
  anchorTileY: number,
  footprintTileWidth: number,
  footprintTileHeight: number
): boolean {
  for (
    let footprintOffsetY = 0;
    footprintOffsetY < footprintTileHeight;
    footprintOffsetY += 1
  ) {
    for (
      let footprintOffsetX = 0;
      footprintOffsetX < footprintTileWidth;
      footprintOffsetX += 1
    ) {
      if (
        checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex(
          anchorTileX + footprintOffsetX,
          anchorTileY + footprintOffsetY
        )
      ) {
        return true;
      }
    }
  }

  return false;
}
