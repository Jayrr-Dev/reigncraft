import { DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID } from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import {
  DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_COLLISION_RADIUS_GRID,
  DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_SIZE_TIER_INDEX,
  DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_COLLISION_RADIUS_GRID,
  DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_SIZE_TIER_INDEX,
} from "@/components/world/domains/definingWorldPlazaTerrainObstacleConstants";
import {
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_COLLISION_BASE_CHUNK_HALF_HEIGHT_SCALE,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_COLLISION_BASE_CHUNK_HALF_WIDTH_SCALE,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_COLLISION_RADIUS_PADDING_GRID,
  resolvingWorldPlazaTerrainRockColumnFootprintScaleFromSurfaceLayer,
  resolvingWorldPlazaTerrainRockColumnFootprintVisualScaleFromTileSpan,
} from "@/components/world/domains/definingWorldPlazaTerrainRockConstants";
import type { DefiningWorldPlazaColumnRockMetadata } from "@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex";

/**
 * Circular collision sizing for procedural column-rock mega-boulders.
 *
 * @module components/world/domains/resolvingWorldPlazaColumnRockCollisionRadiusGridFromMetadata
 */

/**
 * Returns the tier-based minimum collider radius for one column rock.
 *
 * @param sizeTierIndex - Stone size tier index from column rock metadata.
 */
export function resolvingWorldPlazaColumnRockCollisionTierRadiusGrid(
  sizeTierIndex: number,
): number {
  if (sizeTierIndex >= DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_SIZE_TIER_INDEX) {
    return DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_COLLISION_RADIUS_GRID;
  }

  if (sizeTierIndex >= DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_SIZE_TIER_INDEX) {
    return DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_COLLISION_RADIUS_GRID;
  }

  return DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_COLLISION_RADIUS_GRID;
}

/**
 * Returns the grid-space center for a column-rock circular collider.
 *
 * Matches the footprint center used when drawing the boulder mesh.
 *
 * @param metadata - Anchor column-rock metadata.
 */
export function resolvingWorldPlazaColumnRockCollisionCenterGridPointFromMetadata(
  metadata: DefiningWorldPlazaColumnRockMetadata,
): DefiningWorldPlazaWorldPoint {
  return {
    x: metadata.anchorTileX + (metadata.footprintTileWidth - 1) / 2,
    y: metadata.anchorTileY + (metadata.footprintTileHeight - 1) / 2,
  };
}

/**
 * Returns a grid-space collision radius proportional to the drawn boulder size.
 *
 * Uses the same footprint and height scale multipliers as the rendered chunk so
 * the debug circle and gameplay collider track the visible rock instead of the
 * full spacing footprint rectangle.
 *
 * @param metadata - Anchor column-rock metadata.
 */
export function resolvingWorldPlazaColumnRockCollisionRadiusGridFromMetadata(
  metadata: DefiningWorldPlazaColumnRockMetadata,
): number {
  const heightFootprintScale =
    resolvingWorldPlazaTerrainRockColumnFootprintScaleFromSurfaceLayer(
      metadata.surfaceWorldLayer,
    );
  const tileFootprintScale =
    resolvingWorldPlazaTerrainRockColumnFootprintVisualScaleFromTileSpan(
      metadata.footprintTileWidth,
      metadata.footprintTileHeight,
    );
  const visualHalfWidthGrid =
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_COLLISION_BASE_CHUNK_HALF_WIDTH_SCALE *
    heightFootprintScale *
    tileFootprintScale.widthScale *
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID;
  const visualHalfHeightGrid =
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_COLLISION_BASE_CHUNK_HALF_HEIGHT_SCALE *
    heightFootprintScale *
    tileFootprintScale.heightScale *
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID;
  const visualRadiusGrid =
    Math.max(visualHalfWidthGrid, visualHalfHeightGrid) +
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_COLLISION_RADIUS_PADDING_GRID;

  return Math.max(
    resolvingWorldPlazaColumnRockCollisionTierRadiusGrid(metadata.sizeTierIndex),
    visualRadiusGrid,
  );
}
