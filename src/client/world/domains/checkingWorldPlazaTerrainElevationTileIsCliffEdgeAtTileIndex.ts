import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';

/**
 * Splits raised terrain into cliff-edge tiles and flat plateau interiors.
 *
 * Only cliff-edge tiles need extruded block columns (side faces, rim strokes,
 * entity-layer depth sorting). Interior tiles are drawn as flat lifted floor
 * diamonds inside batched floor chunks, exactly like ground-level tiles.
 *
 * @module components/world/domains/checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex
 */

/** Cardinal neighbor offsets checked for downhill terrain drops. */
const CHECKING_WORLD_PLAZA_TERRAIN_ELEVATION_CLIFF_EDGE_NEIGHBOR_OFFSETS = [
  { deltaX: -1, deltaY: 0 },
  { deltaX: 1, deltaY: 0 },
  { deltaX: 0, deltaY: -1 },
  { deltaX: 0, deltaY: 1 },
] as const;

/**
 * Returns true when at least one cardinal neighbor sits on a lower terrain
 * surface, meaning this raised tile exposes a cliff face or rim.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  const surfaceLayer =
    resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(tileX, tileY);

  return CHECKING_WORLD_PLAZA_TERRAIN_ELEVATION_CLIFF_EDGE_NEIGHBOR_OFFSETS.some(
    ({ deltaX, deltaY }) =>
      resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
        tileX + deltaX,
        tileY + deltaY
      ) < surfaceLayer
  );
}
