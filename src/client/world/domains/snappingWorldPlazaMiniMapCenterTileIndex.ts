/**
 * Snaps minimap terrain rebuilds to a coarse tile grid.
 *
 * @module components/world/domains/snappingWorldPlazaMiniMapCenterTileIndex
 */

/**
 * Snaps a grid coordinate to the nearest lower boundary on a tile grid.
 *
 * @param gridCoordinate - Player grid x or y.
 * @param snapTiles - Snap size in tiles (minimum 1).
 */
export function snappingWorldPlazaMiniMapCenterTileIndex(
  gridCoordinate: number,
  snapTiles: number,
): number {
  const resolvedSnapTiles = Math.max(1, Math.floor(snapTiles));

  return (
    Math.floor(gridCoordinate / resolvedSnapTiles) * resolvedSnapTiles
  );
}
