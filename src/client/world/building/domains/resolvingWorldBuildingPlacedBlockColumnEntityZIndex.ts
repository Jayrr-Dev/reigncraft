import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import { resolvingWorldPlazaIsometricEntityZIndex } from "@/components/world/domains/resolvingWorldPlazaIsometricEntityZIndex";
import { resolvingWorldPlazaTerrainElevationColumnEntityZIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainElevationColumnEntityZIndex";
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex";

/**
 * Entity-layer depth sort key for one player-placed block column.
 *
 * @module components/world/building/domains/resolvingWorldBuildingPlacedBlockColumnEntityZIndex
 */

/** Footprint radius (in tiles) scanned for terrain columns that clip the stack. */
const DEFINING_WORLD_BUILDING_PLACED_BLOCK_COLUMN_TERRAIN_CLEARANCE_FOOTPRINT_TILE_RADIUS = 1;

/**
 * Smallest sort nudge that lifts a placed block clear of a neighbor terrain
 * column. The block only needs to win the integer z comparison to render its
 * whole silhouette in front, so this stays minimal to avoid disturbing how the
 * stack interleaves with avatars.
 */
const DEFINING_WORLD_BUILDING_PLACED_BLOCK_COLUMN_TERRAIN_CLEARANCE_DEPTH_BIAS = 1;

/**
 * Returns the highest terrain-column entity z-index in the block footprint that
 * the block stack is at-or-above.
 *
 * Scans the immediate neighborhood (and the block's own tile) so a coplanar or
 * shorter terrain column cannot clip the stack. Terrain taller than the stack's
 * top layer is skipped so real cliffs still occlude correctly.
 *
 * @param tileX - Block column index.
 * @param tileY - Block row index.
 * @param topWorldLayer - Highest occupied world layer in the stack.
 */
function resolvingWorldBuildingPlacedBlockColumnMaxClearableTerrainEntityZIndex(
  tileX: number,
  tileY: number,
  topWorldLayer: number,
): number {
  let maxTerrainEntityZ = Number.NEGATIVE_INFINITY;

  for (
    let tileOffsetY =
      -DEFINING_WORLD_BUILDING_PLACED_BLOCK_COLUMN_TERRAIN_CLEARANCE_FOOTPRINT_TILE_RADIUS;
    tileOffsetY <=
    DEFINING_WORLD_BUILDING_PLACED_BLOCK_COLUMN_TERRAIN_CLEARANCE_FOOTPRINT_TILE_RADIUS;
    tileOffsetY += 1
  ) {
    for (
      let tileOffsetX =
        -DEFINING_WORLD_BUILDING_PLACED_BLOCK_COLUMN_TERRAIN_CLEARANCE_FOOTPRINT_TILE_RADIUS;
      tileOffsetX <=
      DEFINING_WORLD_BUILDING_PLACED_BLOCK_COLUMN_TERRAIN_CLEARANCE_FOOTPRINT_TILE_RADIUS;
      tileOffsetX += 1
    ) {
      const neighborTileX = tileX + tileOffsetX;
      const neighborTileY = tileY + tileOffsetY;
      const terrainSurfaceLayer =
        resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
          neighborTileX,
          neighborTileY,
        );

      if (
        terrainSurfaceLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND ||
        terrainSurfaceLayer > topWorldLayer
      ) {
        continue;
      }

      maxTerrainEntityZ = Math.max(
        maxTerrainEntityZ,
        resolvingWorldPlazaTerrainElevationColumnEntityZIndex(
          neighborTileX,
          neighborTileY,
        ),
      );
    }
  }

  return maxTerrainEntityZ;
}

/**
 * Returns the z-index for a placed block column so terrain it is at-or-above
 * never clips it, while taller cliffs still sort in front.
 *
 * Falls back to the plain tile depth on flat ground so the existing avatar and
 * block interleaving is unchanged away from terrain.
 *
 * @param tileX - Block column index.
 * @param tileY - Block row index.
 * @param topWorldLayer - Highest occupied world layer in the stack.
 */
export function resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
  tileX: number,
  tileY: number,
  topWorldLayer: number,
): number {
  const baseEntityZIndex = resolvingWorldPlazaIsometricEntityZIndex({
    x: tileX,
    y: tileY,
  });
  const maxClearableTerrainEntityZIndex =
    resolvingWorldBuildingPlacedBlockColumnMaxClearableTerrainEntityZIndex(
      tileX,
      tileY,
      topWorldLayer,
    );

  return Math.max(
    baseEntityZIndex,
    maxClearableTerrainEntityZIndex +
      DEFINING_WORLD_BUILDING_PLACED_BLOCK_COLUMN_TERRAIN_CLEARANCE_DEPTH_BIAS,
  );
}
