import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex";

/**
 * Detects cliff-foot tiles that need entity-layer claim overlays.
 *
 * @module components/world/domains/checkingWorldPlazaTerrainElevationTileHasHigherElevationNeighborAtTileIndex
 */

/** Cardinal neighbor offsets checked for uphill terrain steps. */
const CHECKING_WORLD_PLAZA_TERRAIN_ELEVATION_CARDINAL_NEIGHBOR_OFFSETS = [
  { deltaX: -1, deltaY: 0 },
  { deltaX: 1, deltaY: 0 },
  { deltaX: 0, deltaY: -1 },
  { deltaX: 0, deltaY: 1 },
] as const;

/**
 * Returns true when a cardinal neighbor sits on a higher terrain surface.
 *
 * Claim markers on the lower tile must render on the entity layer so uphill
 * cliff faces do not clip the diamond edge.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaTerrainElevationTileHasHigherElevationNeighborAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  const surfaceLayer =
    resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(tileX, tileY);

  return CHECKING_WORLD_PLAZA_TERRAIN_ELEVATION_CARDINAL_NEIGHBOR_OFFSETS.some(
    ({ deltaX, deltaY }) =>
      resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
        tileX + deltaX,
        tileY + deltaY,
      ) > surfaceLayer,
  );
}
