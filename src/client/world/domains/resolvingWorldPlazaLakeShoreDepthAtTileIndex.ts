import { DEFINING_WORLD_PLAZA_WATER_KIND_LAKE } from "@/components/world/domains/definingWorldPlazaWaterKind";
import {
  DEFINING_WORLD_PLAZA_LAKE_SHORE_ENABLED,
  DEFINING_WORLD_PLAZA_LAKE_SHORE_MAX_WIDTH_BLOCKS,
  DEFINING_WORLD_PLAZA_LAKE_SHORE_MIN_WIDTH_BLOCKS,
  DEFINING_WORLD_PLAZA_LAKE_SHORE_SEARCH_RADIUS_BLOCKS,
  DEFINING_WORLD_PLAZA_LAKE_SHORE_WIDTH_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_LAKE_SHORE_WIDTH_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_LAKE_SHORE_WIDTH_NOISE_SEED,
} from "@/components/world/domains/definingWorldPlazaLakeShoreConstants";
import { samplingWorldPlazaFractalNoise } from "@/components/world/domains/generatingWorldPlazaValueNoise";
import { mappingWorldPlazaGrassSeededUnitToIntegerRange } from "@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex";
import { resolvingWorldPlazaWaterAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex";

/**
 * Resolves sandy/clay shore depth for land tiles bordering lakes.
 *
 * @module components/world/domains/resolvingWorldPlazaLakeShoreDepthAtTileIndex
 */

/**
 * Returns true when the tile contains lake surface water.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaLakeWaterAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  const waterTile = resolvingWorldPlazaWaterAtTileIndex(tileX, tileY);

  return waterTile?.kind === DEFINING_WORLD_PLAZA_WATER_KIND_LAKE;
}

/**
 * Returns the Chebyshev distance from a land tile to the nearest lake tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function findingWorldPlazaNearestLakeChebyshevDistanceAtTileIndex(
  tileX: number,
  tileY: number,
): number | null {
  if (checkingWorldPlazaLakeWaterAtTileIndex(tileX, tileY)) {
    return null;
  }

  let nearestLakeDistanceBlocks: number | null = null;
  const searchRadius =
    DEFINING_WORLD_PLAZA_LAKE_SHORE_SEARCH_RADIUS_BLOCKS;

  for (let deltaY = -searchRadius; deltaY <= searchRadius; deltaY += 1) {
    for (let deltaX = -searchRadius; deltaX <= searchRadius; deltaX += 1) {
      if (deltaX === 0 && deltaY === 0) {
        continue;
      }

      const chebyshevDistanceBlocks = Math.max(
        Math.abs(deltaX),
        Math.abs(deltaY),
      );

      if (
        !checkingWorldPlazaLakeWaterAtTileIndex(
          tileX + deltaX,
          tileY + deltaY,
        )
      ) {
        continue;
      }

      if (
        nearestLakeDistanceBlocks === null ||
        chebyshevDistanceBlocks < nearestLakeDistanceBlocks
      ) {
        nearestLakeDistanceBlocks = chebyshevDistanceBlocks;
      }
    }
  }

  return nearestLakeDistanceBlocks;
}

/**
 * Returns the local shore ring width for one tile in blocks.
 *
 * Low-frequency noise varies the sandy border between one and five tiles deep.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaLakeShoreMaxWidthBlocksAtTileIndex(
  tileX: number,
  tileY: number,
): number {
  const shoreWidthNoise = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_LAKE_SHORE_WIDTH_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_LAKE_SHORE_WIDTH_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_LAKE_SHORE_WIDTH_NOISE_OCTAVES,
    },
  );

  return mappingWorldPlazaGrassSeededUnitToIntegerRange(
    shoreWidthNoise,
    DEFINING_WORLD_PLAZA_LAKE_SHORE_MIN_WIDTH_BLOCKS,
    DEFINING_WORLD_PLAZA_LAKE_SHORE_MAX_WIDTH_BLOCKS,
  );
}

/** Hard cap on memoized tile columns before the whole cache is reset. */
const RESOLVING_WORLD_PLAZA_LAKE_SHORE_DEPTH_CACHE_MAX_COLUMNS = 4000;

/**
 * Memoized shore depth in a nested column→row map. Each resolution scans a
 * block ring of (cached) water lookups, and both the floor fill-color path and
 * the decoration path re-resolve the same tile every chunk build, so caching
 * collapses the repeated neighborhood scans into cheap numeric lookups.
 */
const resolvingWorldPlazaLakeShoreDepthCacheByColumn = new Map<
  number,
  Map<number, number | null>
>();

/**
 * Clears the lake shore depth memoization cache after generation rule changes.
 */
export function invalidatingWorldPlazaLakeShoreDepthCache(): void {
  resolvingWorldPlazaLakeShoreDepthCacheByColumn.clear();
}

/**
 * Returns shore depth in blocks when the tile is part of a lake beach ring.
 *
 * Depth 1 is the tile directly touching the lake. Returns null on water or
 * when the tile is outside the noisy 1..5 block shore band. Results are
 * memoized per tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaLakeShoreDepthAtTileIndex(
  tileX: number,
  tileY: number,
): number | null {
  let columnCache = resolvingWorldPlazaLakeShoreDepthCacheByColumn.get(tileX);

  if (columnCache) {
    const cachedDepth = columnCache.get(tileY);

    if (cachedDepth !== undefined) {
      return cachedDepth;
    }
  } else {
    if (
      resolvingWorldPlazaLakeShoreDepthCacheByColumn.size >=
      RESOLVING_WORLD_PLAZA_LAKE_SHORE_DEPTH_CACHE_MAX_COLUMNS
    ) {
      resolvingWorldPlazaLakeShoreDepthCacheByColumn.clear();
    }

    columnCache = new Map();
    resolvingWorldPlazaLakeShoreDepthCacheByColumn.set(tileX, columnCache);
  }

  const computedDepth = computingWorldPlazaLakeShoreDepthAtTileIndex(
    tileX,
    tileY,
  );
  columnCache.set(tileY, computedDepth);

  return computedDepth;
}

/**
 * Computes lake shore depth for a tile without memoization.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function computingWorldPlazaLakeShoreDepthAtTileIndex(
  tileX: number,
  tileY: number,
): number | null {
  const nearestLakeDistanceBlocks =
    findingWorldPlazaNearestLakeChebyshevDistanceAtTileIndex(tileX, tileY);

  if (nearestLakeDistanceBlocks === null) {
    return null;
  }

  const maxShoreWidthBlocks = resolvingWorldPlazaLakeShoreMaxWidthBlocksAtTileIndex(
    tileX,
    tileY,
  );

  if (nearestLakeDistanceBlocks > maxShoreWidthBlocks) {
    return null;
  }

  return nearestLakeDistanceBlocks;
}

/**
 * Returns true when the tile should render as sandy/clay lake shore.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaLakeShoreBlockAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  if (!DEFINING_WORLD_PLAZA_LAKE_SHORE_ENABLED) {
    return false;
  }

  return resolvingWorldPlazaLakeShoreDepthAtTileIndex(tileX, tileY) !== null;
}
