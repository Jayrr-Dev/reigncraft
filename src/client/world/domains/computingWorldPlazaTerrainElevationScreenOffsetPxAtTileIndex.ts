import { computingWorldBuildingWorldLayerScreenOffsetPx } from "@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx";
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex";

/**
 * Screen-space lift for procedural terrain above the ground grid projection.
 *
 * @module components/world/domains/computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex
 */

/**
 * Returns the upward screen offset (negative Y) for a tile's terrain surface.
 *
 * Flat ground tiles return 0. Raised tiles return the same lift used by avatars
 * and terrain column caps so trees, rocks, and shadows align with the walkable
 * surface.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex(
  tileX: number,
  tileY: number,
): number {
  return computingWorldBuildingWorldLayerScreenOffsetPx(
    resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(tileX, tileY),
  );
}
