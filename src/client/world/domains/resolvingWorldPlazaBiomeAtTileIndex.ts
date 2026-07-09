import { checkingWorldPlazaFirelandsSpawnClearingAtTileIndex } from '@/components/world/domains/checkingWorldPlazaFirelandsSpawnClearingAtTileIndex';
import { checkingWorldPlazaOceanBiomeSpawnClearingAtTileIndex } from '@/components/world/domains/checkingWorldPlazaOceanBiomeSpawnClearingAtTileIndex';
import type { DefiningWorldPlazaBiomeDefinition } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import {
  DEFINING_WORLD_PLAZA_BIOME_CATALOG,
  DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE,
} from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import {
  DEFINING_WORLD_PLAZA_BIOME_ROCKY_HUMIDITY_MAX,
  DEFINING_WORLD_PLAZA_BIOME_ROCKY_HUMIDITY_MIN,
  DEFINING_WORLD_PLAZA_BIOME_ROCKY_TEMPERATURE_MAX,
  DEFINING_WORLD_PLAZA_BIOME_ROCKY_TEMPERATURE_MIN,
} from '@/components/world/domains/definingWorldPlazaBiomeRockyClimateConstants';
import {
  DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_SEED,
  DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_THRESHOLD,
  DEFINING_WORLD_PLAZA_FIRELANDS_HUMIDITY_MAX,
  DEFINING_WORLD_PLAZA_FIRELANDS_TEMPERATURE_MIN,
} from '@/components/world/domains/definingWorldPlazaFirelandsBiomeConstants';
import {
  DEFINING_WORLD_PLAZA_JUNGLE_HUMIDITY_MIN,
  DEFINING_WORLD_PLAZA_JUNGLE_TEMPERATURE_MIN,
} from '@/components/world/domains/definingWorldPlazaJungleBiomeConstants';
import {
  DEFINING_WORLD_PLAZA_OCEAN_BIOME_BODY_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_OCEAN_BIOME_BODY_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_OCEAN_BIOME_BODY_NOISE_SEED,
  DEFINING_WORLD_PLAZA_OCEAN_BIOME_BODY_NOISE_THRESHOLD,
  DEFINING_WORLD_PLAZA_OCEAN_BIOME_HUMIDITY_MIN,
  DEFINING_WORLD_PLAZA_OCEAN_BIOME_TEMPERATURE_MAX,
  DEFINING_WORLD_PLAZA_OCEAN_BIOME_TEMPERATURE_MIN,
} from '@/components/world/domains/definingWorldPlazaOceanBiomeConstants';
import { samplingWorldPlazaFractalNoise } from '@/components/world/domains/generatingWorldPlazaValueNoise';
import {
  invalidatingWorldPlazaClimateAtTileCache,
  resolvingWorldPlazaClimateAtTile,
} from '@/components/world/domains/resolvingWorldPlazaClimateAtTileIndex';
import {
  checkingWorldPlazaIslandModeForcesOceanAtTileIndex,
  resolvingWorldPlazaIslandModeZoneAtTileIndex,
} from '@/components/world/domains/resolvingWorldPlazaIslandModeZoneAtTileIndex';

/** Hard cap on memoized columns before each cache is reset. */
const RESOLVING_WORLD_PLAZA_BIOME_CACHE_MAX_COLUMNS = 4000;

/** Memoized per-tile biome definition keyed by tile column→row. */
const resolvingWorldPlazaBiomeAtTileIndexCacheByColumn = new Map<
  number,
  Map<number, DefiningWorldPlazaBiomeDefinition>
>();

/** Memoized per-region biome definition keyed by region column→row. */
const resolvingWorldPlazaBiomeDefinitionAtRegionCacheByColumn = new Map<
  number,
  Map<number, DefiningWorldPlazaBiomeDefinition>
>();

/**
 * Clears the biome and climate memoization caches after generation rule changes.
 */
export function invalidatingWorldPlazaBiomeCaches(): void {
  invalidatingWorldPlazaClimateAtTileCache();
  resolvingWorldPlazaBiomeAtTileIndexCacheByColumn.clear();
  resolvingWorldPlazaBiomeDefinitionAtRegionCacheByColumn.clear();
}

/** Temperature threshold for snowy biomes. */
const DEFINING_WORLD_PLAZA_BIOME_SNOW_TEMPERATURE_MAX = 0.22;

/** Temperature threshold for hot dry biomes. */
const DEFINING_WORLD_PLAZA_BIOME_DESERT_TEMPERATURE_MIN = 0.78;

/** Humidity threshold for swamp biomes. */
const DEFINING_WORLD_PLAZA_BIOME_SWAMP_HUMIDITY_MIN = 0.82;

/** Humidity threshold for forest biomes. */
const DEFINING_WORLD_PLAZA_BIOME_FOREST_HUMIDITY_MIN = 0.62;

/** Humidity threshold for flower forest biomes. */
const DEFINING_WORLD_PLAZA_BIOME_FLOWER_FOREST_HUMIDITY_MIN = 0.48;

/** Humidity threshold for beach biomes. */
const DEFINING_WORLD_PLAZA_BIOME_BEACH_HUMIDITY_MIN = 0.72;

/** Temperature band for beach biomes. */
const DEFINING_WORLD_PLAZA_BIOME_BEACH_TEMPERATURE_MIN = 0.42;

/** Temperature band for beach biomes. */
const DEFINING_WORLD_PLAZA_BIOME_BEACH_TEMPERATURE_MAX = 0.68;

/** Temperature threshold for badlands. */
const DEFINING_WORLD_PLAZA_BIOME_BADLANDS_TEMPERATURE_MIN = 0.68;

/** Humidity threshold for badlands. */
const DEFINING_WORLD_PLAZA_BIOME_BADLANDS_HUMIDITY_MAX = 0.28;

/** Humidity threshold for savanna. */
const DEFINING_WORLD_PLAZA_BIOME_SAVANNA_HUMIDITY_MAX = 0.38;

/** Temperature threshold for savanna. */
const DEFINING_WORLD_PLAZA_BIOME_SAVANNA_TEMPERATURE_MIN = 0.58;

/**
 * Resolves climate at the center of a biome region cell.
 *
 * @param regionX - Region column index.
 * @param regionY - Region row index.
 */
export function resolvingWorldPlazaBiomeClimateAtRegion(
  regionX: number,
  regionY: number
): { temperature: number; humidity: number } {
  const halfRegion = DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE / 2;

  return resolvingWorldPlazaClimateAtTile(
    regionX * DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE + halfRegion,
    regionY * DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE + halfRegion
  );
}

/**
 * Picks a Minecraft-style biome from temperature and humidity noise.
 *
 * When tile indices are provided, open ocean regions can be resolved from the
 * low-frequency ocean body field before inland sandy coast picks run.
 *
 * @param temperature - Normalized value in [0, 1).
 * @param humidity - Normalized value in [0, 1).
 * @param tileX - Optional tile column for ocean body noise.
 * @param tileY - Optional tile row for ocean body noise.
 */
export function pickingWorldPlazaBiomeKindFromClimate(
  temperature: number,
  humidity: number,
  tileX?: number,
  tileY?: number
): DefiningWorldPlazaBiomeKind {
  if (temperature < DEFINING_WORLD_PLAZA_BIOME_SNOW_TEMPERATURE_MAX) {
    return 'snowy_plains';
  }

  const canPickOceanBiome =
    tileX !== undefined &&
    tileY !== undefined &&
    !checkingWorldPlazaOceanBiomeSpawnClearingAtTileIndex(tileX, tileY);

  if (
    canPickOceanBiome &&
    checkingWorldPlazaIslandModeForcesOceanAtTileIndex(tileX, tileY)
  ) {
    return 'ocean';
  }

  if (
    canPickOceanBiome &&
    resolvingWorldPlazaIslandModeZoneAtTileIndex(tileX, tileY) !==
      'core_land' &&
    humidity >= DEFINING_WORLD_PLAZA_OCEAN_BIOME_HUMIDITY_MIN &&
    temperature >= DEFINING_WORLD_PLAZA_OCEAN_BIOME_TEMPERATURE_MIN &&
    temperature <= DEFINING_WORLD_PLAZA_OCEAN_BIOME_TEMPERATURE_MAX &&
    samplingWorldPlazaFractalNoise(
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_OCEAN_BIOME_BODY_NOISE_SEED,
      {
        frequency: DEFINING_WORLD_PLAZA_OCEAN_BIOME_BODY_NOISE_FREQUENCY,
        octaves: DEFINING_WORLD_PLAZA_OCEAN_BIOME_BODY_NOISE_OCTAVES,
      }
    ) >= DEFINING_WORLD_PLAZA_OCEAN_BIOME_BODY_NOISE_THRESHOLD
  ) {
    return 'ocean';
  }

  if (
    temperature >= DEFINING_WORLD_PLAZA_BIOME_BEACH_TEMPERATURE_MIN &&
    temperature <= DEFINING_WORLD_PLAZA_BIOME_BEACH_TEMPERATURE_MAX &&
    humidity >= DEFINING_WORLD_PLAZA_BIOME_BEACH_HUMIDITY_MIN
  ) {
    return 'beach';
  }

  const canPickFirelandsBiome =
    tileX !== undefined &&
    tileY !== undefined &&
    !checkingWorldPlazaFirelandsSpawnClearingAtTileIndex(tileX, tileY);

  if (
    canPickFirelandsBiome &&
    temperature >= DEFINING_WORLD_PLAZA_FIRELANDS_TEMPERATURE_MIN &&
    humidity < DEFINING_WORLD_PLAZA_FIRELANDS_HUMIDITY_MAX &&
    samplingWorldPlazaFractalNoise(
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_SEED,
      {
        frequency: DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_FREQUENCY,
        octaves: DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_OCTAVES,
      }
    ) >= DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_THRESHOLD
  ) {
    return 'firelands';
  }

  if (
    temperature >= DEFINING_WORLD_PLAZA_BIOME_DESERT_TEMPERATURE_MIN &&
    humidity < DEFINING_WORLD_PLAZA_BIOME_BADLANDS_HUMIDITY_MAX
  ) {
    return 'desert';
  }

  if (
    temperature >= DEFINING_WORLD_PLAZA_BIOME_BADLANDS_TEMPERATURE_MIN &&
    humidity < DEFINING_WORLD_PLAZA_BIOME_BADLANDS_HUMIDITY_MAX
  ) {
    return 'badlands';
  }

  if (
    temperature >= DEFINING_WORLD_PLAZA_BIOME_ROCKY_TEMPERATURE_MIN &&
    temperature <= DEFINING_WORLD_PLAZA_BIOME_ROCKY_TEMPERATURE_MAX &&
    humidity >= DEFINING_WORLD_PLAZA_BIOME_ROCKY_HUMIDITY_MIN &&
    humidity <= DEFINING_WORLD_PLAZA_BIOME_ROCKY_HUMIDITY_MAX
  ) {
    return 'rocky';
  }

  if (
    temperature >= DEFINING_WORLD_PLAZA_BIOME_SAVANNA_TEMPERATURE_MIN &&
    humidity < DEFINING_WORLD_PLAZA_BIOME_SAVANNA_HUMIDITY_MAX
  ) {
    return 'savanna';
  }

  if (
    temperature >= DEFINING_WORLD_PLAZA_JUNGLE_TEMPERATURE_MIN &&
    humidity >= DEFINING_WORLD_PLAZA_JUNGLE_HUMIDITY_MIN
  ) {
    return 'jungle';
  }

  if (humidity >= DEFINING_WORLD_PLAZA_BIOME_SWAMP_HUMIDITY_MIN) {
    return 'swamp';
  }

  if (humidity >= DEFINING_WORLD_PLAZA_BIOME_FOREST_HUMIDITY_MIN) {
    return 'forest';
  }

  if (humidity >= DEFINING_WORLD_PLAZA_BIOME_FLOWER_FOREST_HUMIDITY_MIN) {
    return 'flower_forest';
  }

  return 'plains';
}

/**
 * Resolves the biome definition for a region cell.
 *
 * @param regionX - Region column index.
 * @param regionY - Region row index.
 */
export function resolvingWorldPlazaBiomeDefinitionAtRegion(
  regionX: number,
  regionY: number
): DefiningWorldPlazaBiomeDefinition {
  let columnCache =
    resolvingWorldPlazaBiomeDefinitionAtRegionCacheByColumn.get(regionX);

  if (columnCache) {
    const cachedDefinition = columnCache.get(regionY);

    if (cachedDefinition !== undefined) {
      return cachedDefinition;
    }
  } else {
    if (
      resolvingWorldPlazaBiomeDefinitionAtRegionCacheByColumn.size >=
      RESOLVING_WORLD_PLAZA_BIOME_CACHE_MAX_COLUMNS
    ) {
      resolvingWorldPlazaBiomeDefinitionAtRegionCacheByColumn.clear();
    }

    columnCache = new Map();
    resolvingWorldPlazaBiomeDefinitionAtRegionCacheByColumn.set(
      regionX,
      columnCache
    );
  }

  const climate = resolvingWorldPlazaBiomeClimateAtRegion(regionX, regionY);
  const halfRegion = DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE / 2;
  const biomeKind = pickingWorldPlazaBiomeKindFromClimate(
    climate.temperature,
    climate.humidity,
    regionX * DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE + halfRegion,
    regionY * DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE + halfRegion
  );
  const biomeDefinition = DEFINING_WORLD_PLAZA_BIOME_CATALOG[biomeKind];
  columnCache.set(regionY, biomeDefinition);

  return biomeDefinition;
}

/**
 * Resolves the biome definition for a tile using per-tile climate.
 *
 * Sampling per tile (instead of snapping to a region) gives crisp, organic
 * biome borders for decorations, accents, and the HUD label.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaBiomeAtTileIndex(
  tileX: number,
  tileY: number
): DefiningWorldPlazaBiomeDefinition {
  let columnCache = resolvingWorldPlazaBiomeAtTileIndexCacheByColumn.get(tileX);

  if (columnCache) {
    const cachedDefinition = columnCache.get(tileY);

    if (cachedDefinition !== undefined) {
      return cachedDefinition;
    }
  } else {
    if (
      resolvingWorldPlazaBiomeAtTileIndexCacheByColumn.size >=
      RESOLVING_WORLD_PLAZA_BIOME_CACHE_MAX_COLUMNS
    ) {
      resolvingWorldPlazaBiomeAtTileIndexCacheByColumn.clear();
    }

    columnCache = new Map();
    resolvingWorldPlazaBiomeAtTileIndexCacheByColumn.set(tileX, columnCache);
  }

  const climate = resolvingWorldPlazaClimateAtTile(tileX, tileY);
  const biomeKind = pickingWorldPlazaBiomeKindFromClimate(
    climate.temperature,
    climate.humidity,
    tileX,
    tileY
  );
  const biomeDefinition = DEFINING_WORLD_PLAZA_BIOME_CATALOG[biomeKind];
  columnCache.set(tileY, biomeDefinition);

  return biomeDefinition;
}
