import type { DefiningWorldPlazaColumnRockMetadata } from "@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex";
import { resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex } from "@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex";
import { resolvingWorldPlazaColumnRockMetadataAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex";
import { resolvingWorldPlazaColumnRockSpacingAnchorTileIndex } from "@/components/world/domains/resolvingWorldPlazaColumnRockSpacingAnchorTileIndex";
import { resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex";

/**
 * Column-rock footprint membership checks for multi-tile mega-boulders.
 *
 * @module components/world/domains/checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex
 */

/**
 * Returns true when a tile lies inside a column-rock footprint rectangle.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param metadata - Anchor boulder metadata.
 */
export function checkingWorldPlazaTileIsWithinColumnRockFootprintFromMetadata(
  tileX: number,
  tileY: number,
  metadata: DefiningWorldPlazaColumnRockMetadata,
): boolean {
  return (
    tileX >= metadata.anchorTileX &&
    tileX < metadata.anchorTileX + metadata.footprintTileWidth &&
    tileY >= metadata.anchorTileY &&
    tileY < metadata.anchorTileY + metadata.footprintTileHeight
  );
}

/**
 * Returns true when a tile is occupied by a mega-boulder footprint (anchor or interior).
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  const { anchorTileX, anchorTileY } =
    resolvingWorldPlazaColumnRockSpacingAnchorTileIndex(tileX, tileY);
  const metadata = resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex(
    anchorTileX,
    anchorTileY,
  );

  if (!metadata) {
    return false;
  }

  return checkingWorldPlazaTileIsWithinColumnRockFootprintFromMetadata(
    tileX,
    tileY,
    metadata,
  );
}

/**
 * Returns true when a tile is part of a column-rock footprint and must skip
 * tile-grid collision (water/stone tier diamonds). Gold footprint tiles stay
 * walkable; the orange rock-face diamond still blocks movement from the side.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaColumnRockFootprintTileBypassesTileGridCollisionAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  return resolvingWorldPlazaColumnRockMetadataAtTileIndex(tileX, tileY) !== null;
}

/**
 * Returns true when a footprint tile is open ground for the player's layer.
 *
 * Below the boulder top the footprint is walkable even though the unified
 * surface layer includes the rock height for standing and jump targeting.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param playerLayer - Current player standing layer.
 */
export function checkingWorldPlazaColumnRockFootprintTileIsWalkableGroundForPlayerLayer(
  tileX: number,
  tileY: number,
  playerLayer: number,
): boolean {
  return (
    checkingWorldPlazaColumnRockFootprintTileBypassesTileGridCollisionAtTileIndex(
      tileX,
      tileY,
    ) &&
    playerLayer <
      resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex(tileX, tileY)
  );
}
