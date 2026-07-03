import {
  DEFINING_WORLD_PLAZA_POND_SHORE_COVERAGE_SEED_SALT,
  DEFINING_WORLD_PLAZA_POND_SHORE_COVERAGE_THRESHOLD,
  DEFINING_WORLD_PLAZA_POND_SHORE_ENABLED,
  DEFINING_WORLD_PLAZA_POND_SHORE_SAND_FILL_COLOR,
  DEFINING_WORLD_PLAZA_POND_SHORE_SEARCH_RADIUS_BLOCKS,
  DEFINING_WORLD_PLAZA_SWAMP_POND_SHORE_MUD_FILL_COLOR,
} from "@/components/world/domains/definingWorldPlazaLakeShoreConstants";
import {
  DEFINING_WORLD_PLAZA_WATER_KIND_POND,
  DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND,
} from "@/components/world/domains/definingWorldPlazaWaterKind";
import { resolvingWorldPlazaWaterAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex";
import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from "@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex";

/**
 * Thin 0-1 block sand or dirt ring around ponds and swamp pools.
 *
 * Ponds get a much smaller border than lakes. A seeded coverage gate leaves
 * many edge tiles bare so the ring averages under one block deep.
 *
 * @module components/world/domains/resolvingWorldPlazaPondShoreFillColorAtTileIndex
 */

/**
 * Returns the adjacent pond water kind for a land tile, or null when none.
 *
 * Swamp pools win over normal ponds so a shared corner reads as mud.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function resolvingWorldPlazaAdjacentPondWaterKindAtTileIndex(
  tileX: number,
  tileY: number,
):
  | typeof DEFINING_WORLD_PLAZA_WATER_KIND_POND
  | typeof DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND
  | null {
  const searchRadius = DEFINING_WORLD_PLAZA_POND_SHORE_SEARCH_RADIUS_BLOCKS;
  let adjacentPondKind:
    | typeof DEFINING_WORLD_PLAZA_WATER_KIND_POND
    | typeof DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND
    | null = null;

  for (let deltaY = -searchRadius; deltaY <= searchRadius; deltaY += 1) {
    for (let deltaX = -searchRadius; deltaX <= searchRadius; deltaX += 1) {
      if (deltaX === 0 && deltaY === 0) {
        continue;
      }

      const neighborWater = resolvingWorldPlazaWaterAtTileIndex(
        tileX + deltaX,
        tileY + deltaY,
      );

      if (!neighborWater) {
        continue;
      }

      if (neighborWater.kind === DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND) {
        return DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND;
      }

      if (neighborWater.kind === DEFINING_WORLD_PLAZA_WATER_KIND_POND) {
        adjacentPondKind = DEFINING_WORLD_PLAZA_WATER_KIND_POND;
      }
    }
  }

  return adjacentPondKind;
}

/** Hard cap on memoized tile columns before the whole cache is reset. */
const RESOLVING_WORLD_PLAZA_POND_SHORE_FILL_COLOR_CACHE_MAX_COLUMNS = 4000;

/**
 * Memoized pond shore fill in a nested column→row map. Each resolution scans a
 * block ring of (cached) water lookups, and both the floor fill-color path and
 * the decoration path re-resolve the same tile every chunk build, so caching
 * collapses the repeated neighborhood scans into cheap numeric lookups.
 */
const resolvingWorldPlazaPondShoreFillColorCacheByColumn = new Map<
  number,
  Map<number, number | null>
>();

/**
 * Clears the pond shore fill color memoization cache after generation rule changes.
 */
export function invalidatingWorldPlazaPondShoreFillColorCache(): void {
  resolvingWorldPlazaPondShoreFillColorCacheByColumn.clear();
}

/**
 * Resolves the floor diamond fill for one pond shore block, or null.
 *
 * Returns null on water tiles, on edges the coverage gate leaves bare, and on
 * tiles that do not touch a pond or swamp pool. Results are memoized per tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaPondShoreFillColorAtTileIndex(
  tileX: number,
  tileY: number,
): number | null {
  let columnCache =
    resolvingWorldPlazaPondShoreFillColorCacheByColumn.get(tileX);

  if (columnCache) {
    const cachedFillColor = columnCache.get(tileY);

    if (cachedFillColor !== undefined) {
      return cachedFillColor;
    }
  } else {
    if (
      resolvingWorldPlazaPondShoreFillColorCacheByColumn.size >=
      RESOLVING_WORLD_PLAZA_POND_SHORE_FILL_COLOR_CACHE_MAX_COLUMNS
    ) {
      resolvingWorldPlazaPondShoreFillColorCacheByColumn.clear();
    }

    columnCache = new Map();
    resolvingWorldPlazaPondShoreFillColorCacheByColumn.set(tileX, columnCache);
  }

  const computedFillColor = computingWorldPlazaPondShoreFillColorAtTileIndex(
    tileX,
    tileY,
  );
  columnCache.set(tileY, computedFillColor);

  return computedFillColor;
}

/**
 * Computes the pond shore fill color for a tile without memoization.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function computingWorldPlazaPondShoreFillColorAtTileIndex(
  tileX: number,
  tileY: number,
): number | null {
  if (!DEFINING_WORLD_PLAZA_POND_SHORE_ENABLED) {
    return null;
  }

  if (resolvingWorldPlazaWaterAtTileIndex(tileX, tileY)) {
    return null;
  }

  const adjacentPondKind = resolvingWorldPlazaAdjacentPondWaterKindAtTileIndex(
    tileX,
    tileY,
  );

  if (adjacentPondKind === null) {
    return null;
  }

  const coverageSeed = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_POND_SHORE_COVERAGE_SEED_SALT,
  );

  if (coverageSeed < DEFINING_WORLD_PLAZA_POND_SHORE_COVERAGE_THRESHOLD) {
    return null;
  }

  return adjacentPondKind === DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND
    ? DEFINING_WORLD_PLAZA_SWAMP_POND_SHORE_MUD_FILL_COLOR
    : DEFINING_WORLD_PLAZA_POND_SHORE_SAND_FILL_COLOR;
}

/**
 * Returns true when the tile should render as a thin pond shore block.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaPondShoreBlockAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  return resolvingWorldPlazaPondShoreFillColorAtTileIndex(tileX, tileY) !== null;
}
