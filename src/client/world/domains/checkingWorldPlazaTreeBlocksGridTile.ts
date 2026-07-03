import { resolvingWorldPlazaTreeAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex";

/**
 * Whether a grid tile is occupied by a tree trunk (walk blocked).
 *
 * @module components/world/domains/checkingWorldPlazaTreeBlocksGridTile
 */

/**
 * Returns true when a tree stands on the tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaTreeBlocksGridTile(
  tileX: number,
  tileY: number,
): boolean {
  return resolvingWorldPlazaTreeAtTileIndex(tileX, tileY) !== null;
}
