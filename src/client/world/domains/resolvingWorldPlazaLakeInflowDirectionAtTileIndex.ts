import {
  DEFINING_WORLD_PLAZA_WATER_LAKE_INFLOW_CLUSTER_STRIDE_BLOCKS,
  DEFINING_WORLD_PLAZA_WATER_LAKE_INFLOW_DIRECTION_SALT,
} from "@/components/world/domains/definingWorldPlazaWaterConstants";
import {
  mappingWorldPlazaGrassSeededUnitToIntegerRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from "@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex";

/**
 * Deterministic inflow-side selection for lake clusters.
 *
 * Each lake cluster allows rivers and streams to approach from one cardinal
 * side only so channels terminate at the lake instead of passing through it.
 *
 * @module components/world/domains/resolvingWorldPlazaLakeInflowDirectionAtTileIndex
 */

/** Cardinal step from a lake toward the allowed river approach side. */
export interface ResolvingWorldPlazaLakeInflowSourceCardinalDelta {
  /** Column delta toward the inflow source side. */
  deltaX: number;
  /** Row delta toward the inflow source side. */
  deltaY: number;
}

/** Cardinal deltas indexed by seeded direction id. */
const RESOLVING_WORLD_PLAZA_LAKE_INFLOW_SOURCE_CARDINAL_DELTAS: ReadonlyArray<ResolvingWorldPlazaLakeInflowSourceCardinalDelta> =
  [
    { deltaX: 0, deltaY: -1 },
    { deltaX: 1, deltaY: 0 },
    { deltaX: 0, deltaY: 1 },
    { deltaX: -1, deltaY: 0 },
  ];

/**
 * Returns the coarse cluster anchor used to pick one inflow side per lake.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaLakeClusterAnchorTileIndexAtTileIndex(
  tileX: number,
  tileY: number,
): { tileX: number; tileY: number } {
  const stride = DEFINING_WORLD_PLAZA_WATER_LAKE_INFLOW_CLUSTER_STRIDE_BLOCKS;
  const halfStride = Math.floor(stride / 2);

  return {
    tileX: Math.floor(tileX / stride) * stride + halfStride,
    tileY: Math.floor(tileY / stride) * stride + halfStride,
  };
}

/**
 * Returns the cardinal direction from a lake toward its allowed inflow source.
 *
 * @param lakeReferenceTileX - Lake tile or cluster anchor column index.
 * @param lakeReferenceTileY - Lake tile or cluster anchor row index.
 */
export function resolvingWorldPlazaLakeInflowSourceCardinalDeltaAtTileIndex(
  lakeReferenceTileX: number,
  lakeReferenceTileY: number,
): ResolvingWorldPlazaLakeInflowSourceCardinalDelta {
  const clusterAnchor = resolvingWorldPlazaLakeClusterAnchorTileIndexAtTileIndex(
    lakeReferenceTileX,
    lakeReferenceTileY,
  );
  const directionIndex = mappingWorldPlazaGrassSeededUnitToIntegerRange(
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      clusterAnchor.tileX,
      clusterAnchor.tileY,
      DEFINING_WORLD_PLAZA_WATER_LAKE_INFLOW_DIRECTION_SALT,
    ),
    0,
    RESOLVING_WORLD_PLAZA_LAKE_INFLOW_SOURCE_CARDINAL_DELTAS.length - 1,
  );

  return RESOLVING_WORLD_PLAZA_LAKE_INFLOW_SOURCE_CARDINAL_DELTAS[
    directionIndex
  ];
}

/**
 * Returns true when a tile sits on the allowed inflow side of a lake reference.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param lakeReferenceTileX - Lake tile or cluster anchor column index.
 * @param lakeReferenceTileY - Lake tile or cluster anchor row index.
 */
export function checkingWorldPlazaFlowingWaterIsOnLakeInflowSideAtTileIndex(
  tileX: number,
  tileY: number,
  lakeReferenceTileX: number,
  lakeReferenceTileY: number,
): boolean {
  const sourceDelta = resolvingWorldPlazaLakeInflowSourceCardinalDeltaAtTileIndex(
    lakeReferenceTileX,
    lakeReferenceTileY,
  );
  const offsetX = tileX - lakeReferenceTileX;
  const offsetY = tileY - lakeReferenceTileY;

  return offsetX * sourceDelta.deltaX + offsetY * sourceDelta.deltaY >= 0;
}
