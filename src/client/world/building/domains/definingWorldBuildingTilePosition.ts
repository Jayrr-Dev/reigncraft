import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from "@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint";

/**
 * Grid tile coordinate for player-placed building blocks.
 *
 * @module components/world/building/domains/definingWorldBuildingTilePosition
 */

/** Immutable tile position on the isometric grid. */
export interface DefiningWorldBuildingTilePosition {
  readonly tileX: number;
  readonly tileY: number;
}

/** Separator used when indexing blocks in a plot map. */
export const DEFINING_WORLD_BUILDING_TILE_POSITION_KEY_SEPARATOR = ":" as const;

/**
 * Creates a tile position value object.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function creatingWorldBuildingTilePosition(
  tileX: number,
  tileY: number,
): DefiningWorldBuildingTilePosition {
  return { tileX, tileY };
}

/**
 * Builds a stable map key for a tile position.
 *
 * @param position - Tile coordinates.
 */
export function formattingWorldBuildingTilePositionKey(
  position: DefiningWorldBuildingTilePosition,
): string {
  return `${position.tileX}${DEFINING_WORLD_BUILDING_TILE_POSITION_KEY_SEPARATOR}${position.tileY}`;
}

/**
 * Returns true when two tile positions refer to the same cell.
 *
 * @param left - First tile position.
 * @param right - Second tile position.
 */
export function checkingWorldBuildingTilePositionEquals(
  left: DefiningWorldBuildingTilePosition,
  right: DefiningWorldBuildingTilePosition,
): boolean {
  return left.tileX === right.tileX && left.tileY === right.tileY;
}

/**
 * Snaps a floating grid point to the tile diamond that contains it.
 *
 * @param gridPoint - Continuous grid coordinates from pointer projection.
 */
export function snappingWorldBuildingTilePositionFromGridPoint(
  gridPoint: DefiningWorldPlazaWorldPoint,
): DefiningWorldBuildingTilePosition {
  const tileIndex = resolvingWorldPlazaIsometricTileIndexAtGridPoint(gridPoint);

  return creatingWorldBuildingTilePosition(tileIndex.tileX, tileIndex.tileY);
}
