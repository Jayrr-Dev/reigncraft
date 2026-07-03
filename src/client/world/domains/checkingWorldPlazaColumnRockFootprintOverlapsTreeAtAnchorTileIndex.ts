import { checkingWorldPlazaTreeBlocksGridTile } from "@/components/world/domains/checkingWorldPlazaTreeBlocksGridTile";

/**
 * Tree overlap checks for multi-tile column-rock footprints.
 *
 * @module components/world/domains/checkingWorldPlazaColumnRockFootprintOverlapsTreeAtAnchorTileIndex
 */

/**
 * Returns true when any tile in a column-rock footprint hosts a tree trunk.
 *
 * @param anchorTileX - Spacing anchor column index.
 * @param anchorTileY - Spacing anchor row index.
 * @param footprintTileWidth - Footprint width in tiles.
 * @param footprintTileHeight - Footprint height in tiles.
 */
export function checkingWorldPlazaColumnRockFootprintOverlapsTreeAtAnchorTileIndex(
  anchorTileX: number,
  anchorTileY: number,
  footprintTileWidth: number,
  footprintTileHeight: number,
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
        checkingWorldPlazaTreeBlocksGridTile(
          anchorTileX + footprintOffsetX,
          anchorTileY + footprintOffsetY,
        )
      ) {
        return true;
      }
    }
  }

  return false;
}
