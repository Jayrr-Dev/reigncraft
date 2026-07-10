import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import {
  DEFINING_WORLD_DEPTH_TERRAIN_ELEVATION_COLUMN_RENDER_DEPTH_BIAS,
  DEFINING_WORLD_DEPTH_TERRAIN_ELEVATION_COLUMN_SURFACE_LAYER_DEPTH_BIAS,
} from '@/components/world/depth/domains/definingWorldDepthBiasLadder';
import { computingWorldDepthSortKey } from '@/components/world/depth/domains/computingWorldDepthSortKey';
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';

/**
 * Entity-layer depth sort key for one procedural terrain column.
 *
 * @module components/world/domains/resolvingWorldPlazaTerrainElevationColumnEntityZIndex
 */

/**
 * Returns the canonical z-index for a terrain column so it interleaves with avatars.
 *
 * Uses the tile ground position plus a height-scaled bias so taller columns sort
 * strictly above lower caps that share the same grid row. This is the sort key
 * read by both the column graphics layer and avatar occlusion queries, so it
 * must stay free of render-only tuning biases.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaTerrainElevationColumnEntityZIndex(
  tileX: number,
  tileY: number,
): number {
  const surfaceLayer =
    resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(tileX, tileY);
  const surfaceLayerBias =
    Math.max(0, surfaceLayer - DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) *
    DEFINING_WORLD_DEPTH_TERRAIN_ELEVATION_COLUMN_SURFACE_LAYER_DEPTH_BIAS;

  return (
    computingWorldDepthSortKey({
      x: tileX,
      y: tileY,
    }) + surfaceLayerBias
  );
}

/**
 * Returns the render-layer z-index for a terrain column's drawn graphics.
 *
 * Applies {@link DEFINING_WORLD_DEPTH_TERRAIN_ELEVATION_COLUMN_RENDER_DEPTH_BIAS}
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
    DEFINING_WORLD_DEPTH_TERRAIN_ELEVATION_COLUMN_RENDER_DEPTH_BIAS
  );
}
