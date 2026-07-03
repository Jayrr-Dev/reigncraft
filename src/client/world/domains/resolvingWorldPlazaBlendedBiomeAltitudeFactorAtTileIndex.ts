import { DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE } from "@/components/world/domains/definingWorldPlazaBiomeConstants";
import { resolvingWorldPlazaBiomeDefinitionAtRegion } from "@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex";

/**
 * Blended biome altitude factor for procedural terrain elevation.
 *
 * @module components/world/domains/resolvingWorldPlazaBlendedBiomeAltitudeFactorAtTileIndex
 */

/**
 * Bilinearly blends four scalar samples.
 *
 * @param topLeft - Northwest corner sample.
 * @param topRight - Northeast corner sample.
 * @param bottomLeft - Southwest corner sample.
 * @param bottomRight - Southeast corner sample.
 * @param mixX - Horizontal blend in [0, 1].
 * @param mixY - Vertical blend in [0, 1].
 */
function blendingWorldPlazaScalarsBilinear(
  topLeft: number,
  topRight: number,
  bottomLeft: number,
  bottomRight: number,
  mixX: number,
  mixY: number,
): number {
  const topEdge = topLeft + (topRight - topLeft) * mixX;
  const bottomEdge = bottomLeft + (bottomRight - bottomLeft) * mixX;

  return topEdge + (bottomEdge - topEdge) * mixY;
}

/**
 * Returns a blended altitude factor in [0, 1] for one tile.
 *
 * Bilinear interpolation across biome region corners keeps elevation transitions
 * smooth at biome borders, matching how ground colors blend.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaBlendedBiomeAltitudeFactorAtTileIndex(
  tileX: number,
  tileY: number,
): number {
  const fractionalRegionX = tileX / DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE;
  const fractionalRegionY = tileY / DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE;
  const regionX0 = Math.floor(fractionalRegionX);
  const regionY0 = Math.floor(fractionalRegionY);
  const mixX = fractionalRegionX - regionX0;
  const mixY = fractionalRegionY - regionY0;

  return blendingWorldPlazaScalarsBilinear(
    resolvingWorldPlazaBiomeDefinitionAtRegion(regionX0, regionY0).altitudeFactor,
    resolvingWorldPlazaBiomeDefinitionAtRegion(regionX0 + 1, regionY0)
      .altitudeFactor,
    resolvingWorldPlazaBiomeDefinitionAtRegion(regionX0, regionY0 + 1)
      .altitudeFactor,
    resolvingWorldPlazaBiomeDefinitionAtRegion(regionX0 + 1, regionY0 + 1)
      .altitudeFactor,
    mixX,
    mixY,
  );
}
