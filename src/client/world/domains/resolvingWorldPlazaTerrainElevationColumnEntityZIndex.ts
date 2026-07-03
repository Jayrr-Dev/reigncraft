import { DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_RENDER_DEPTH_BIAS } from "@/components/world/domains/definingWorldPlazaTerrainElevationConstants";
import { resolvingWorldPlazaIsometricEntityZIndex } from "@/components/world/domains/resolvingWorldPlazaIsometricEntityZIndex";

/**
 * Entity-layer depth sort key for one procedural terrain column.
 *
 * @module components/world/domains/resolvingWorldPlazaTerrainElevationColumnEntityZIndex
 */

/**
 * Returns the canonical z-index for a terrain column so it interleaves with avatars.
 *
 * Uses the tile ground position, matching placed block columns. This is the pure
 * sort key read by both the column graphics layer and the avatar ground-shadow
 * occluder query, so it must stay free of render-only tuning biases.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaTerrainElevationColumnEntityZIndex(
  tileX: number,
  tileY: number,
): number {
  return resolvingWorldPlazaIsometricEntityZIndex({
    x: tileX,
    y: tileY,
  });
}

/**
 * Returns the render-layer z-index for a terrain column's drawn graphics.
 *
 * Applies {@link DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_RENDER_DEPTH_BIAS}
 * on top of the canonical sort key. Use this only for the visible column graphics
 * so the shadow occluder logic keeps reading the unbiased value.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaTerrainElevationColumnRenderEntityZIndex(
  tileX: number,
  tileY: number,
): number {
  return (
    resolvingWorldPlazaTerrainElevationColumnEntityZIndex(tileX, tileY) +
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_RENDER_DEPTH_BIAS
  );
}
