import { resolvingWorldPlazaBiomeAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex";

/**
 * Per-tile biome altitude factor for procedural terrain elevation.
 *
 * @module components/world/domains/resolvingWorldPlazaBiomeAltitudeFactorAtTileIndex
 */

/**
 * Returns the altitude factor in [0, 1] for the biome at one tile.
 *
 * Uses per-tile climate (not region blending) so elevation matches the biome
 * underfoot instead of being diluted by neighboring low regions.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaBiomeAltitudeFactorAtTileIndex(
  tileX: number,
  tileY: number,
): number {
  return resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY).altitudeFactor;
}
