import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex";

/**
 * Checks whether a cardinal neighbor meets this tile at the same surface height.
 *
 * @module components/world/domains/checkingWorldPlazaTerrainElevationCardinalNeighborSurfaceConnectsAtTileIndex
 */

/** Cliff drops required at one cap vertex before a vertical corner line is drawn. */
const CHECKING_WORLD_PLAZA_TERRAIN_ELEVATION_EXPOSED_CLIFF_CORNER_VERTEX_MIN_CLIFF_DIRECTION_COUNT =
  2 as const;

/**
 * Returns true when a cardinal neighbor's surface is at or above this tile's surface.
 *
 * Lower neighbors leave the shared edge exposed (cliff drop).
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param deltaX - Neighbor column offset.
 * @param deltaY - Neighbor row offset.
 * @param surfaceLayer - This tile's surface world layer.
 */
export function checkingWorldPlazaTerrainElevationCardinalNeighborSurfaceConnectsAtTileIndex(
  tileX: number,
  tileY: number,
  deltaX: number,
  deltaY: number,
  surfaceLayer: number,
): boolean {
  const neighborSurfaceLayer =
    resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
      tileX + deltaX,
      tileY + deltaY,
    );

  return neighborSurfaceLayer >= surfaceLayer;
}

/**
 * Returns true when this tile exposes a cliff drop in a cardinal direction.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param cliffDeltaX - Cardinal offset toward the lower neighbor.
 * @param cliffDeltaY - Cardinal offset toward the lower neighbor.
 * @param surfaceLayer - This tile's surface world layer.
 */
export function checkingWorldPlazaTerrainElevationTileHasExposedCliffInDirectionAtTileIndex(
  tileX: number,
  tileY: number,
  cliffDeltaX: number,
  cliffDeltaY: number,
  surfaceLayer: number,
): boolean {
  return !checkingWorldPlazaTerrainElevationCardinalNeighborSurfaceConnectsAtTileIndex(
    tileX,
    tileY,
    cliffDeltaX,
    cliffDeltaY,
    surfaceLayer,
  );
}

/** Screen-side vertical cliff stroke keyed to cap vertex position. */
export type CheckingWorldPlazaTerrainElevationExposedCliffVerticalEdgeKind =
  | "east"
  | "west"
  | "south";

/**
 * Counts exposed cliff directions that meet on one front-facing cap vertex.
 *
 * A vertex belongs to the two cardinal faces that share it, so a vertical
 * corner line is warranted only when both drop away: `bottom` between the east
 * and south faces, `left` between the south and west faces, and `right` between
 * the east and north faces.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param surfaceLayer - This tile's surface world layer.
 * @param vertex - Cap vertex id (`bottom` SE, `left` SW, `right` NE).
 */
function countingWorldPlazaTerrainElevationExposedCliffDirectionsAtCapVertex(
  tileX: number,
  tileY: number,
  surfaceLayer: number,
  vertex: "bottom" | "left" | "right",
): number {
  const hasEastCliff =
    checkingWorldPlazaTerrainElevationTileHasExposedCliffInDirectionAtTileIndex(
      tileX,
      tileY,
      1,
      0,
      surfaceLayer,
    );
  const hasSouthCliff =
    checkingWorldPlazaTerrainElevationTileHasExposedCliffInDirectionAtTileIndex(
      tileX,
      tileY,
      0,
      1,
      surfaceLayer,
    );
  const hasWestCliff =
    checkingWorldPlazaTerrainElevationTileHasExposedCliffInDirectionAtTileIndex(
      tileX,
      tileY,
      -1,
      0,
      surfaceLayer,
    );
  const hasNorthCliff =
    checkingWorldPlazaTerrainElevationTileHasExposedCliffInDirectionAtTileIndex(
      tileX,
      tileY,
      0,
      -1,
      surfaceLayer,
    );

  if (vertex === "bottom") {
    return (hasEastCliff ? 1 : 0) + (hasSouthCliff ? 1 : 0);
  }

  if (vertex === "right") {
    return (hasEastCliff ? 1 : 0) + (hasNorthCliff ? 1 : 0);
  }

  return (hasSouthCliff ? 1 : 0) + (hasWestCliff ? 1 : 0);
}

/**
 * Returns true when a vertical cliff stroke should render on this tile.
 *
 * Rule: corners only on front-facing cliff faces. A vertical line is drawn when
 * two cliff drops meet on the same cap vertex (bottom, left, or SE corner).
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param edgeKind - Screen-side vertical edge to evaluate.
 * @param surfaceLayer - This tile's surface world layer.
 */
export function checkingWorldPlazaTerrainElevationExposedCliffVerticalEdgeShouldDrawAtTileIndex(
  tileX: number,
  tileY: number,
  edgeKind: CheckingWorldPlazaTerrainElevationExposedCliffVerticalEdgeKind,
  surfaceLayer: number,
): boolean {
  const minimumCornerCliffDirectionCount =
    CHECKING_WORLD_PLAZA_TERRAIN_ELEVATION_EXPOSED_CLIFF_CORNER_VERTEX_MIN_CLIFF_DIRECTION_COUNT;
  const vertexByEdgeKind = {
    east: "right",
    south: "bottom",
    west: "left",
  } as const;

  return (
    countingWorldPlazaTerrainElevationExposedCliffDirectionsAtCapVertex(
      tileX,
      tileY,
      surfaceLayer,
      vertexByEdgeKind[edgeKind],
    ) >= minimumCornerCliffDirectionCount
  );
}
