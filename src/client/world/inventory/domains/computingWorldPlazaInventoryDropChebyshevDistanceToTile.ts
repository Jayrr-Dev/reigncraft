/**
 * Chebyshev distance from an avatar position to the center of a drop tile.
 *
 * @module components/world/inventory/domains/computingWorldPlazaInventoryDropChebyshevDistanceToTile
 */

/**
 * Returns Chebyshev distance from a world point to the center of a grid tile.
 *
 * @param playerX - Avatar X in tile units.
 * @param playerY - Avatar Y in tile units.
 * @param tileX - Drop tile column index.
 * @param tileY - Drop tile row index.
 */
export function computingWorldPlazaInventoryDropChebyshevDistanceToTile(
  playerX: number,
  playerY: number,
  tileX: number,
  tileY: number,
): number {
  return Math.max(
    Math.abs(playerX - (tileX + 0.5)),
    Math.abs(playerY - (tileY + 0.5)),
  );
}
