/**
 * Stable cache keys for plaza tile-indexed graphics layers.
 *
 * @module components/world/domains/formattingWorldPlazaTileIndexCacheKey
 */

/**
 * Builds a stable map key for one grid tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function formattingWorldPlazaTileIndexCacheKey(
  tileX: number,
  tileY: number,
): string {
  return `${tileX}:${tileY}`;
}
