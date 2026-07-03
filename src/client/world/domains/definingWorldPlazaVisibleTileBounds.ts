/**
 * Tile index bounds for visible infinite map drawing.
 *
 * @module components/world/domains/definingWorldPlazaVisibleTileBounds
 */

/** Inclusive tile index range to draw for the current viewport. */
export interface DefiningWorldPlazaVisibleTileBounds {
  minTileX: number;
  maxTileX: number;
  minTileY: number;
  maxTileY: number;
}

/**
 * Builds a stable cache key for {@link DefiningWorldPlazaVisibleTileBounds}.
 *
 * @param bounds - Visible tile bounds.
 */
export function buildingWorldPlazaVisibleTileBoundsCacheKey(
  bounds: DefiningWorldPlazaVisibleTileBounds,
): string {
  return `${bounds.minTileX}:${bounds.maxTileX}:${bounds.minTileY}:${bounds.maxTileY}`;
}
