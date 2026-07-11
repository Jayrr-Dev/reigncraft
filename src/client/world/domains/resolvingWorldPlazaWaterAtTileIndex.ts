import { computingWorldPlazaWaterPatchNoiseThresholdFromBiomeTemperature } from "@/components/world/domains/computingWorldPlazaWaterPatchNoiseThresholdFromBiomeTemperature";
import { checkingWorldPlazaBiomeAllowsWaterKindAtTileIndex } from "@/components/world/domains/checkingWorldPlazaBiomeAllowsWaterKindAtTileIndex";
import { checkingWorldPlazaFlowingWaterIsBlockedByLakeAtTileIndex } from "@/components/world/domains/checkingWorldPlazaFlowingWaterIsBlockedByLakeAtTileIndex";
import { checkingWorldPlazaRiverChannelPlacesRiverAtTileIndex } from "@/components/world/domains/checkingWorldPlazaRiverChannelPlacesRiverAtTileIndex";
import { checkingWorldPlazaStillWaterPlacementAtTileIndex } from "@/components/world/domains/checkingWorldPlazaStillWaterPlacementAtTileIndex";
import { checkingWorldPlazaStreamChannelPlacesStreamAtTileIndex } from "@/components/world/domains/checkingWorldPlazaStreamChannelPlacesStreamAtTileIndex";
import {
  DEFINING_WORLD_PLAZA_WATER_CHANNEL_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_WATER_CHANNEL_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_WATER_CHANNEL_NOISE_SEED,
  DEFINING_WORLD_PLAZA_WATER_LAKE_BASIN_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_WATER_LAKE_BASIN_NOISE_MIN,
  DEFINING_WORLD_PLAZA_WATER_LAKE_BASIN_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_WATER_LAKE_BASIN_NOISE_SEED,
  DEFINING_WORLD_PLAZA_WATER_PATCH_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_WATER_PATCH_NOISE_MIN,
  DEFINING_WORLD_PLAZA_WATER_PATCH_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_WATER_PATCH_NOISE_SEED,
  DEFINING_WORLD_PLAZA_WATER_POND_BASIN_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_WATER_POND_BASIN_NOISE_MIN,
  DEFINING_WORLD_PLAZA_WATER_POND_BASIN_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_WATER_POND_BASIN_NOISE_SEED,
  DEFINING_WORLD_PLAZA_WATER_RIVER_MAX_BIOME_TEMPERATURE,
  DEFINING_WORLD_PLAZA_WATER_SPAWN_CLEARING_RADIUS_SQUARED,
  DEFINING_WORLD_PLAZA_WATER_STREAM_MIN_RUN_LENGTH_TILES,
  DEFINING_WORLD_PLAZA_WATER_SWAMP_POND_BASIN_NOISE_MIN,
} from "@/components/world/domains/definingWorldPlazaWaterConstants";
import {
  DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
  DEFINING_WORLD_PLAZA_WATER_KIND_POND,
  DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
  DEFINING_WORLD_PLAZA_WATER_KIND_STREAM,
  DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND,
  type DefiningWorldPlazaWaterKind,
} from "@/components/world/domains/definingWorldPlazaWaterKind";
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from "@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry";
import { DEFINING_WORLD_PLAZA_BIOME_CATALOG } from "@/components/world/domains/definingWorldPlazaBiomeConstants";
import { checkingWorldPlazaIslandModeForcesOceanAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaIslandModeZoneAtTileIndex";
import { samplingWorldPlazaFractalNoise } from "@/components/world/domains/generatingWorldPlazaValueNoise";
import { checkingWorldPlazaTileIsRockyBiomeAtTileIndex } from "@/components/world/domains/checkingWorldPlazaTileIsRockyBiomeAtTileIndex";
import { checkingWorldPlazaGenerationFeatureEnabled } from "@/components/world/domains/managingWorldPlazaGenerationFeatureStore";
import {
  pickingWorldPlazaBiomeKindFromClimate,
} from "@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex";
import { resolvingWorldPlazaClimateAtTile } from "@/components/world/domains/resolvingWorldPlazaClimateAtTileIndex";

/**
 * Deterministic surface-water placement for one tile.
 *
 * Water comes in five flavors. Lakes are broad still basins. Rivers are long,
 * fast, sparse channels. Streams are longer branching trickles. Ponds are small still
 * pools, and swamp ponds are larger murky pools inside humid swamp regions.
 *
 * Exact connected lengths (for example "rivers 32-1000 blocks") cannot be
 * guaranteed per-tile in an infinite, streamed world without flood-filling
 * unbounded regions. Noise frequency sets the characteristic feature length and
 * channel band width sets thickness; both are tunable constants.
 *
 * @module components/world/domains/resolvingWorldPlazaWaterAtTileIndex
 */

/** Surface water on one tile. */
export interface DefiningWorldPlazaWaterTile {
  /** Tile column index. */
  tileX: number;
  /** Tile row index. */
  tileY: number;
  /** Lake, river, stream, pond, or swamp pond variant. */
  kind: DefiningWorldPlazaWaterKind;
}

/** Hard cap on memoized tile columns before the whole cache is reset. */
const RESOLVING_WORLD_PLAZA_WATER_AT_TILE_INDEX_CACHE_MAX_COLUMNS = 4000;

/**
 * Memoized water results in a nested column→row map. Placement is deterministic
 * and the shore, depth-band, and surface scans re-resolve the same tiles many
 * times per frame, so caching turns repeated fractal-noise sampling into cheap
 * lookups.
 */
const resolvingWorldPlazaWaterAtTileIndexCacheByColumn = new Map<
  number,
  Map<number, DefiningWorldPlazaWaterTile | null>
>();

/**
 * Clears the water placement memoization cache after generation rule changes.
 */
export function invalidatingWorldPlazaWaterAtTileIndexCache(): void {
  resolvingWorldPlazaWaterAtTileIndexCacheByColumn.clear();
}

/**
 * Samples the broad wet-region field that gates lakes, ponds, and streams.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function samplingWorldPlazaWaterPatchNoiseAtTile(
  tileX: number,
  tileY: number,
): number {
  return samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_WATER_PATCH_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_WATER_PATCH_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_WATER_PATCH_NOISE_OCTAVES,
    },
  );
}

/**
 * Samples the low-frequency field that defines large lake bodies.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function samplingWorldPlazaWaterLakeBasinNoiseAtTile(
  tileX: number,
  tileY: number,
): number {
  return samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_WATER_LAKE_BASIN_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_WATER_LAKE_BASIN_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_WATER_LAKE_BASIN_NOISE_OCTAVES,
    },
  );
}

/**
 * Samples the mid-frequency field that defines small pond and swamp pool basins.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function samplingWorldPlazaWaterPondBasinNoiseAtTile(
  tileX: number,
  tileY: number,
): number {
  return samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_WATER_POND_BASIN_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_WATER_POND_BASIN_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_WATER_POND_BASIN_NOISE_OCTAVES,
    },
  );
}

/**
 * Samples the primary stream channel field (alias for stream placement).
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function samplingWorldPlazaWaterChannelNoiseAtTile(
  tileX: number,
  tileY: number,
): number {
  return samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_WATER_CHANNEL_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_WATER_CHANNEL_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_WATER_CHANNEL_NOISE_OCTAVES,
    },
  );
}

/**
 * Returns true when the river channel places a connected channel here.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function checkingWorldPlazaRiverChannelPlacesRiverAtTile(
  tileX: number,
  tileY: number,
): boolean {
  return checkingWorldPlazaRiverChannelPlacesRiverAtTileIndex(tileX, tileY);
}

/**
 * Returns true when the stream channel places a connected trickle here.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function checkingWorldPlazaStreamChannelPlacesStreamAtTile(
  tileX: number,
  tileY: number,
): boolean {
  return checkingWorldPlazaStreamChannelPlacesStreamAtTileIndex(tileX, tileY);
}

/**
 * Returns true when noise would place surface water, ignoring biome climate.
 *
 * Terrain elevation flattens beds under water. It uses this climate-free check
 * to avoid import cycles and to carve flat ground under every potential water
 * body regardless of how hot or humid the biome is.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaSurfaceWaterNoiseWouldPlaceWaterAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  return computingWorldPlazaWaterAtTileIndex(tileX, tileY) !== null;
}

/**
 * Resolves lake, river, stream, pond, or swamp pond water for a tile.
 *
 * Priority is lake, then river, then swamp pond, then pond, then stream, so the
 * largest and most distinctive bodies win when fields overlap. Biome
 * temperature raises the wet-patch threshold so hot regions rarely spawn water,
 * and rivers dry up entirely above a temperature cap.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaWaterAtTileIndex(
  tileX: number,
  tileY: number,
): DefiningWorldPlazaWaterTile | null {
  let columnCache = resolvingWorldPlazaWaterAtTileIndexCacheByColumn.get(tileX);

  if (columnCache) {
    const cached = columnCache.get(tileY);

    if (cached !== undefined) {
      return cached;
    }
  } else {
    if (
      resolvingWorldPlazaWaterAtTileIndexCacheByColumn.size >=
      RESOLVING_WORLD_PLAZA_WATER_AT_TILE_INDEX_CACHE_MAX_COLUMNS
    ) {
      resolvingWorldPlazaWaterAtTileIndexCacheByColumn.clear();
    }

    columnCache = new Map();
    resolvingWorldPlazaWaterAtTileIndexCacheByColumn.set(tileX, columnCache);
  }

  const waterTile = computingWorldPlazaWaterAtTileIndex(tileX, tileY);
  columnCache.set(tileY, waterTile);

  return waterTile;
}

/** Cardinal grid steps used for stream run connectivity. */
const COMPUTING_WORLD_PLAZA_WATER_CARDINAL_NEIGHBOR_STEPS: ReadonlyArray<{
  deltaX: number;
  deltaY: number;
}> = [
  { deltaX: 1, deltaY: 0 },
  { deltaX: -1, deltaY: 0 },
  { deltaX: 0, deltaY: 1 },
  { deltaX: 0, deltaY: -1 },
];

/**
 * Returns true when noise and gates would place any water kind on the tile,
 * ignoring the stream minimum-run requirement.
 *
 * Used by the stream run scan so connectivity reflects the lake and biome gates
 * without recursing back into the run check.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function checkingWorldPlazaTileWouldHoldWaterIgnoringStreamRunAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  return (
    resolvingWorldPlazaWaterKindIgnoringStreamRunAtTileIndex(tileX, tileY) !==
    null
  );
}

/**
 * Returns true when the stream tile belongs to a connected water run of at least
 * the minimum length.
 *
 * Bounded flood fill over cardinally connected tiles that would hold water. The
 * scan stops as soon as the minimum is reached, so cost stays small.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function checkingWorldPlazaStreamRunMeetsMinimumLengthAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  const minimumRunLengthTiles =
    DEFINING_WORLD_PLAZA_WATER_STREAM_MIN_RUN_LENGTH_TILES;

  if (minimumRunLengthTiles <= 1) {
    return true;
  }

  const visitedTileKeys = new Set<string>([`${tileX},${tileY}`]);
  const frontier: Array<{ tileX: number; tileY: number }> = [{ tileX, tileY }];
  let connectedWaterTileCount = 1;

  while (frontier.length > 0) {
    const currentTile = frontier.pop();

    if (!currentTile) {
      break;
    }

    for (const neighborStep of COMPUTING_WORLD_PLAZA_WATER_CARDINAL_NEIGHBOR_STEPS) {
      const neighborTileX = currentTile.tileX + neighborStep.deltaX;
      const neighborTileY = currentTile.tileY + neighborStep.deltaY;
      const neighborTileKey = `${neighborTileX},${neighborTileY}`;

      if (visitedTileKeys.has(neighborTileKey)) {
        continue;
      }

      visitedTileKeys.add(neighborTileKey);

      if (
        !checkingWorldPlazaTileWouldHoldWaterIgnoringStreamRunAtTileIndex(
          neighborTileX,
          neighborTileY,
        )
      ) {
        continue;
      }

      connectedWaterTileCount += 1;

      if (connectedWaterTileCount >= minimumRunLengthTiles) {
        return true;
      }

      frontier.push({ tileX: neighborTileX, tileY: neighborTileY });
    }
  }

  return false;
}

/**
 * Computes surface water for a tile without memoization.
 *
 * Streams additionally require a connected run of the minimum length so a single
 * isolated block can never render as a stream.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function computingWorldPlazaWaterAtTileIndex(
  tileX: number,
  tileY: number,
): DefiningWorldPlazaWaterTile | null {
  const waterTile = resolvingWorldPlazaWaterKindIgnoringStreamRunAtTileIndex(
    tileX,
    tileY,
  );

  if (!waterTile) {
    return null;
  }

  if (
    waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_STREAM &&
    !checkingWorldPlazaStreamRunMeetsMinimumLengthAtTileIndex(tileX, tileY)
  ) {
    return null;
  }

  return waterTile;
}

/**
 * Computes the water kind for a tile from noise and gates, ignoring the stream
 * minimum-run requirement.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function resolvingWorldPlazaWaterKindIgnoringStreamRunAtTileIndex(
  tileX: number,
  tileY: number,
): DefiningWorldPlazaWaterTile | null {
  const areLakesEnabled = checkingWorldPlazaGenerationFeatureEnabled(
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.LAKES,
  );
  const areRiversEnabled = checkingWorldPlazaGenerationFeatureEnabled(
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.RIVERS,
  );
  const areStreamsEnabled = checkingWorldPlazaGenerationFeatureEnabled(
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.STREAMS,
  );
  const arePondsEnabled = checkingWorldPlazaGenerationFeatureEnabled(
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.PONDS,
  );
  const areSwampPondsEnabled = checkingWorldPlazaGenerationFeatureEnabled(
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.SWAMP_PONDS,
  );

  if (checkingWorldPlazaTileIsRockyBiomeAtTileIndex(tileX, tileY)) {
    return null;
  }

  if (
    tileX * tileX + tileY * tileY <
    DEFINING_WORLD_PLAZA_WATER_SPAWN_CLEARING_RADIUS_SQUARED
  ) {
    return null;
  }

  if (checkingWorldPlazaIslandModeForcesOceanAtTileIndex(tileX, tileY)) {
    return { tileX, tileY, kind: DEFINING_WORLD_PLAZA_WATER_KIND_LAKE };
  }

  const climate = resolvingWorldPlazaClimateAtTile(tileX, tileY);
  const biomeKind = pickingWorldPlazaBiomeKindFromClimate(
    climate.temperature,
    climate.humidity,
    tileX,
    tileY,
  );

  if (biomeKind === "ocean") {
    return { tileX, tileY, kind: DEFINING_WORLD_PLAZA_WATER_KIND_LAKE };
  }

  if (
    !areLakesEnabled &&
    !areRiversEnabled &&
    !areStreamsEnabled &&
    !arePondsEnabled &&
    !areSwampPondsEnabled
  ) {
    return null;
  }

  const biomeTemperature =
    DEFINING_WORLD_PLAZA_BIOME_CATALOG[biomeKind].temperature;
  const patchNoise =
    areLakesEnabled || areStreamsEnabled || arePondsEnabled
      ? samplingWorldPlazaWaterPatchNoiseAtTile(tileX, tileY)
      : 0;
  const temperatureAdjustedPatchNoiseMin =
    computingWorldPlazaWaterPatchNoiseThresholdFromBiomeTemperature(
      biomeTemperature,
    );
  const isWetPatch = patchNoise >= temperatureAdjustedPatchNoiseMin;

  if (
    areLakesEnabled &&
    isWetPatch &&
    samplingWorldPlazaWaterLakeBasinNoiseAtTile(tileX, tileY) >=
      DEFINING_WORLD_PLAZA_WATER_LAKE_BASIN_NOISE_MIN &&
    checkingWorldPlazaStillWaterPlacementAtTileIndex(
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
    )
  ) {
    return { tileX, tileY, kind: DEFINING_WORLD_PLAZA_WATER_KIND_LAKE };
  }

  if (
    areRiversEnabled &&
    biomeTemperature <= DEFINING_WORLD_PLAZA_WATER_RIVER_MAX_BIOME_TEMPERATURE &&
    checkingWorldPlazaRiverChannelPlacesRiverAtTile(tileX, tileY) &&
    (!areLakesEnabled ||
      !checkingWorldPlazaFlowingWaterIsBlockedByLakeAtTileIndex(tileX, tileY)) &&
    checkingWorldPlazaBiomeAllowsWaterKindAtTileIndex(
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
    )
  ) {
    return { tileX, tileY, kind: DEFINING_WORLD_PLAZA_WATER_KIND_RIVER };
  }

  const pondBasinNoise =
    arePondsEnabled || areSwampPondsEnabled
      ? samplingWorldPlazaWaterPondBasinNoiseAtTile(tileX, tileY)
      : 0;

  if (
    areSwampPondsEnabled &&
    pondBasinNoise >= DEFINING_WORLD_PLAZA_WATER_SWAMP_POND_BASIN_NOISE_MIN &&
    checkingWorldPlazaStillWaterPlacementAtTileIndex(
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND,
    )
  ) {
    return { tileX, tileY, kind: DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND };
  }

  if (
    arePondsEnabled &&
    isWetPatch &&
    pondBasinNoise >= DEFINING_WORLD_PLAZA_WATER_POND_BASIN_NOISE_MIN &&
    checkingWorldPlazaStillWaterPlacementAtTileIndex(
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_WATER_KIND_POND,
    )
  ) {
    return { tileX, tileY, kind: DEFINING_WORLD_PLAZA_WATER_KIND_POND };
  }

  if (
    areStreamsEnabled &&
    isWetPatch &&
    checkingWorldPlazaStreamChannelPlacesStreamAtTile(tileX, tileY) &&
    (!areLakesEnabled ||
      !checkingWorldPlazaFlowingWaterIsBlockedByLakeAtTileIndex(tileX, tileY)) &&
    checkingWorldPlazaBiomeAllowsWaterKindAtTileIndex(
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_WATER_KIND_STREAM,
    )
  ) {
    return { tileX, tileY, kind: DEFINING_WORLD_PLAZA_WATER_KIND_STREAM };
  }

  return null;
}
