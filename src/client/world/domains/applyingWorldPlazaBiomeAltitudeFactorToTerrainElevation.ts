/**
 * Scales procedural elevation noise by biome altitude factor.
 *
 * @module components/world/domains/applyingWorldPlazaBiomeAltitudeFactorToTerrainElevation
 */

/**
 * Scales normalized elevation noise by a biome altitude factor.
 *
 * Ground is world layer 1. A factor of 0 always yields flat ground; 1 passes
 * the full noise sample through unchanged. Scaling is linear so moderate factors
 * can still produce occasional low hills.
 *
 * @param normalizedHeight - Blended elevation noise in [0, 1].
 * @param altitudeFactor - Biome altitude factor in [0, 1].
 */
export function applyingWorldPlazaBiomeAltitudeFactorToTerrainElevationNormalizedHeight(
  normalizedHeight: number,
  altitudeFactor: number,
): number {
  if (altitudeFactor <= 0) {
    return 0;
  }

  if (altitudeFactor >= 1) {
    return normalizedHeight;
  }

  return Math.min(1, normalizedHeight * altitudeFactor);
}
