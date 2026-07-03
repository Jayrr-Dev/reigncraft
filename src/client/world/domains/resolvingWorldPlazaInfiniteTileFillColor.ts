import { resolvingWorldPlazaBlendedBiomeTileFillColor } from "@/components/world/domains/resolvingWorldPlazaBlendedBiomeTileFillColor";

/**
 * Deterministic fill color for an infinite-map tile with blended biomes and block texture.
 *
 * @param tileX - Tile column index (world space).
 * @param tileY - Tile row index (world space).
 */
export function resolvingWorldPlazaInfiniteTileFillColor(
  tileX: number,
  tileY: number,
): number {
  return resolvingWorldPlazaBlendedBiomeTileFillColor(tileX, tileY);
}
