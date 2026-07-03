import { samplingWorldPlazaFractalNoise } from "@/components/world/domains/generatingWorldPlazaValueNoise";

/**
 * Domain-warped temperature and humidity sampling for one plaza tile.
 *
 * Kept separate from biome classification so climate lookups do not pull in
 * biome caches or rocky-centrality helpers during module initialization.
 *
 * @module components/world/domains/resolvingWorldPlazaClimateAtTileIndex
 */

/** Resolved temperature and humidity climate for one tile. */
export interface DefiningWorldPlazaClimateSample {
  readonly temperature: number;
  readonly humidity: number;
}

/** Hard cap on memoized climate columns before the cache is reset. */
const RESOLVING_WORLD_PLAZA_CLIMATE_CACHE_MAX_COLUMNS = 4000;

/**
 * Memoized per-tile climate in a nested column→row map. Each climate sample
 * runs several multi-octave, domain-warped fractal-noise lookups, and biome
 * resolution, water placement, and floor coloring all re-resolve the same tiles
 * many times per chunk build, so caching collapses thousands of noise
 * evaluations per frame into cheap numeric lookups.
 */
const resolvingWorldPlazaClimateAtTileCacheByColumn = new Map<
  number,
  Map<number, DefiningWorldPlazaClimateSample>
>();

/** Base frequency for the temperature field (smaller is broader biomes). */
const DEFINING_WORLD_PLAZA_BIOME_TEMPERATURE_FREQUENCY = 1 / 160;

/** Base frequency for the humidity field. */
const DEFINING_WORLD_PLAZA_BIOME_HUMIDITY_FREQUENCY = 1 / 190;

/** Base frequency for the domain-warp field that bends biome borders. */
const DEFINING_WORLD_PLAZA_BIOME_WARP_FREQUENCY = 1 / 70;

/** Warp strength in tiles; larger gives more organic, wavy borders. */
const DEFINING_WORLD_PLAZA_BIOME_WARP_STRENGTH_TILES = 26;

/** Octave count for the climate fields. */
const DEFINING_WORLD_PLAZA_BIOME_CLIMATE_OCTAVES = 4;

/** Contrast expansion so smooth fields still reach extreme biome thresholds. */
const DEFINING_WORLD_PLAZA_BIOME_CLIMATE_CONTRAST = 1.7;

/** Noise seeds for the independent climate fields. */
const DEFINING_WORLD_PLAZA_BIOME_TEMPERATURE_SEED = 1009;
const DEFINING_WORLD_PLAZA_BIOME_HUMIDITY_SEED = 7919;
const DEFINING_WORLD_PLAZA_BIOME_WARP_X_SEED = 3331;
const DEFINING_WORLD_PLAZA_BIOME_WARP_Y_SEED = 6151;

/**
 * Clears the climate memoization cache after generation rule changes.
 */
export function invalidatingWorldPlazaClimateAtTileCache(): void {
  resolvingWorldPlazaClimateAtTileCacheByColumn.clear();
}

/**
 * Samples smooth, domain-warped temperature and humidity at a tile.
 *
 * Warping displaces sample coordinates by a second noise field so biome
 * borders bend organically instead of forming round blobs or grid lines.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaClimateAtTile(
  tileX: number,
  tileY: number,
): DefiningWorldPlazaClimateSample {
  let columnCache = resolvingWorldPlazaClimateAtTileCacheByColumn.get(tileX);

  if (columnCache) {
    const cachedClimate = columnCache.get(tileY);

    if (cachedClimate !== undefined) {
      return cachedClimate;
    }
  } else {
    if (
      resolvingWorldPlazaClimateAtTileCacheByColumn.size >=
      RESOLVING_WORLD_PLAZA_CLIMATE_CACHE_MAX_COLUMNS
    ) {
      resolvingWorldPlazaClimateAtTileCacheByColumn.clear();
    }

    columnCache = new Map();
    resolvingWorldPlazaClimateAtTileCacheByColumn.set(tileX, columnCache);
  }

  const computedClimate = computingWorldPlazaClimateAtTile(tileX, tileY);
  columnCache.set(tileY, computedClimate);

  return computedClimate;
}

/**
 * Samples smooth, domain-warped temperature and humidity at a tile without
 * memoization.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function computingWorldPlazaClimateAtTile(
  tileX: number,
  tileY: number,
): DefiningWorldPlazaClimateSample {
  const warpX =
    (samplingWorldPlazaFractalNoise(tileX, tileY, DEFINING_WORLD_PLAZA_BIOME_WARP_X_SEED, {
      frequency: DEFINING_WORLD_PLAZA_BIOME_WARP_FREQUENCY,
      octaves: 2,
    }) -
      0.5) *
    2 *
    DEFINING_WORLD_PLAZA_BIOME_WARP_STRENGTH_TILES;
  const warpY =
    (samplingWorldPlazaFractalNoise(tileX, tileY, DEFINING_WORLD_PLAZA_BIOME_WARP_Y_SEED, {
      frequency: DEFINING_WORLD_PLAZA_BIOME_WARP_FREQUENCY,
      octaves: 2,
    }) -
      0.5) *
    2 *
    DEFINING_WORLD_PLAZA_BIOME_WARP_STRENGTH_TILES;
  const warpedTileX = tileX + warpX;
  const warpedTileY = tileY + warpY;

  return {
    temperature: expandingWorldPlazaClimateContrast(
      samplingWorldPlazaFractalNoise(
        warpedTileX,
        warpedTileY,
        DEFINING_WORLD_PLAZA_BIOME_TEMPERATURE_SEED,
        {
          frequency: DEFINING_WORLD_PLAZA_BIOME_TEMPERATURE_FREQUENCY,
          octaves: DEFINING_WORLD_PLAZA_BIOME_CLIMATE_OCTAVES,
        },
      ),
    ),
    humidity: expandingWorldPlazaClimateContrast(
      samplingWorldPlazaFractalNoise(
        warpedTileX,
        warpedTileY,
        DEFINING_WORLD_PLAZA_BIOME_HUMIDITY_SEED,
        {
          frequency: DEFINING_WORLD_PLAZA_BIOME_HUMIDITY_FREQUENCY,
          octaves: DEFINING_WORLD_PLAZA_BIOME_CLIMATE_OCTAVES,
        },
      ),
    ),
  };
}

/** Pushes a [0, 1) value away from the midpoint and clamps to [0, 1]. */
function expandingWorldPlazaClimateContrast(value: number): number {
  const expanded =
    (value - 0.5) * DEFINING_WORLD_PLAZA_BIOME_CLIMATE_CONTRAST + 0.5;

  return Math.min(1, Math.max(0, expanded));
}
