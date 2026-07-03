import {
  DEFINING_WORLD_PLAZA_OCEAN_SHORE_MAX_WIDTH_BLOCKS,
  DEFINING_WORLD_PLAZA_OCEAN_SHORE_MIN_WIDTH_BLOCKS,
  DEFINING_WORLD_PLAZA_OCEAN_SHORE_SEARCH_RADIUS_BLOCKS,
  DEFINING_WORLD_PLAZA_OCEAN_SHORE_WIDTH_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_OCEAN_SHORE_WIDTH_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_OCEAN_SHORE_WIDTH_NOISE_SEED,
} from "@/components/world/domains/definingWorldPlazaOceanShoreConstants";
import { checkingWorldPlazaOceanBiomeAtTileIndex } from "@/components/world/domains/checkingWorldPlazaOceanBiomeAtTileIndex";
import { samplingWorldPlazaFractalNoise } from "@/components/world/domains/generatingWorldPlazaValueNoise";
import { mappingWorldPlazaGrassSeededUnitToIntegerRange } from "@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex";

/**
 * Resolves sandy beach depth for land tiles bordering open ocean.
 *
 * @module components/world/domains/resolvingWorldPlazaOceanShoreDepthAtTileIndex
 */

/**
 * Returns the Chebyshev distance from a land tile to the nearest ocean tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function findingWorldPlazaNearestOceanChebyshevDistanceAtTileIndex(
  tileX: number,
  tileY: number,
): number | null {
  if (checkingWorldPlazaOceanBiomeAtTileIndex(tileX, tileY)) {
    return null;
  }

  let nearestOceanDistanceBlocks: number | null = null;
  const searchRadius = DEFINING_WORLD_PLAZA_OCEAN_SHORE_SEARCH_RADIUS_BLOCKS;

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
        !checkingWorldPlazaOceanBiomeAtTileIndex(
          tileX + deltaX,
          tileY + deltaY,
        )
      ) {
        continue;
      }

      if (
        nearestOceanDistanceBlocks === null ||
        chebyshevDistanceBlocks < nearestOceanDistanceBlocks
      ) {
        nearestOceanDistanceBlocks = chebyshevDistanceBlocks;
      }
    }
  }

  return nearestOceanDistanceBlocks;
}

/**
 * Returns the local beach ring width for one tile in blocks.
 *
 * Low-frequency noise varies the sandy border between four and twelve tiles deep.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaOceanShoreMaxWidthBlocksAtTileIndex(
  tileX: number,
  tileY: number,
): number {
  const shoreWidthNoise = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_OCEAN_SHORE_WIDTH_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_OCEAN_SHORE_WIDTH_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_OCEAN_SHORE_WIDTH_NOISE_OCTAVES,
    },
  );

  return mappingWorldPlazaGrassSeededUnitToIntegerRange(
    shoreWidthNoise,
    DEFINING_WORLD_PLAZA_OCEAN_SHORE_MIN_WIDTH_BLOCKS,
    DEFINING_WORLD_PLAZA_OCEAN_SHORE_MAX_WIDTH_BLOCKS,
  );
}

/** Hard cap on memoized tile columns before the whole cache is reset. */
const RESOLVING_WORLD_PLAZA_OCEAN_SHORE_DEPTH_CACHE_MAX_COLUMNS = 4000;

/**
 * Memoized beach depth in a nested column→row map. Each resolution scans a
 * block ring of ocean checks, and both the floor fill-color path and the
 * decoration path re-resolve the same tile every chunk build.
 */
const resolvingWorldPlazaOceanShoreDepthCacheByColumn = new Map<
  number,
  Map<number, number | null>
>();

/**
 * Clears the ocean beach depth memoization cache after generation rule changes.
 */
export function invalidatingWorldPlazaOceanShoreDepthCache(): void {
  resolvingWorldPlazaOceanShoreDepthCacheByColumn.clear();
}

/**
 * Returns beach depth in blocks when the tile is part of an ocean sand ring.
 *
 * Depth 1 is the tile directly touching the ocean. Returns null on ocean tiles
 * or when the tile is outside the noisy 4..12 block beach band.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaOceanShoreDepthAtTileIndex(
  tileX: number,
  tileY: number,
): number | null {
  let columnCache = resolvingWorldPlazaOceanShoreDepthCacheByColumn.get(tileX);

  if (columnCache) {
    const cachedDepth = columnCache.get(tileY);

    if (cachedDepth !== undefined) {
      return cachedDepth;
    }
  } else {
    if (
      resolvingWorldPlazaOceanShoreDepthCacheByColumn.size >=
      RESOLVING_WORLD_PLAZA_OCEAN_SHORE_DEPTH_CACHE_MAX_COLUMNS
    ) {
      resolvingWorldPlazaOceanShoreDepthCacheByColumn.clear();
    }

    columnCache = new Map();
    resolvingWorldPlazaOceanShoreDepthCacheByColumn.set(tileX, columnCache);
  }

  const computedDepth = computingWorldPlazaOceanShoreDepthAtTileIndex(
    tileX,
    tileY,
  );
  columnCache.set(tileY, computedDepth);

  return computedDepth;
}

/**
 * Computes ocean beach depth for a tile without memoization.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function computingWorldPlazaOceanShoreDepthAtTileIndex(
  tileX: number,
  tileY: number,
): number | null {
  const nearestOceanDistanceBlocks =
    findingWorldPlazaNearestOceanChebyshevDistanceAtTileIndex(tileX, tileY);

  if (nearestOceanDistanceBlocks === null) {
    return null;
  }

  const maxShoreWidthBlocks = resolvingWorldPlazaOceanShoreMaxWidthBlocksAtTileIndex(
    tileX,
    tileY,
  );

  if (nearestOceanDistanceBlocks > maxShoreWidthBlocks) {
    return null;
  }

  return nearestOceanDistanceBlocks;
}

/**
 * Returns true when the tile should render as sandy ocean beach.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaOceanShoreBlockAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  return resolvingWorldPlazaOceanShoreDepthAtTileIndex(tileX, tileY) !== null;
}
