import { computingWorldPlazaWaterPatchNoiseThresholdFromBiomeTemperature } from "@/components/world/domains/computingWorldPlazaWaterPatchNoiseThresholdFromBiomeTemperature";
import { checkingWorldPlazaStillWaterPlacementAtTileIndex } from "@/components/world/domains/checkingWorldPlazaStillWaterPlacementAtTileIndex";
import { checkingWorldPlazaTileIsRockyBiomeAtTileIndex } from "@/components/world/domains/checkingWorldPlazaTileIsRockyBiomeAtTileIndex";
import {
  DEFINING_WORLD_PLAZA_WATER_LAKE_BASIN_NOISE_MIN,
  DEFINING_WORLD_PLAZA_WATER_LAKE_FLOWING_WATER_BASIN_EXCLUSION_NOISE_MIN,
  DEFINING_WORLD_PLAZA_WATER_LAKE_FLOWING_WATER_EXCLUSION_RADIUS_BLOCKS,
  DEFINING_WORLD_PLAZA_WATER_SPAWN_CLEARING_RADIUS_SQUARED,
} from "@/components/world/domains/definingWorldPlazaWaterConstants";
import { DEFINING_WORLD_PLAZA_WATER_KIND_LAKE } from "@/components/world/domains/definingWorldPlazaWaterKind";
import { DEFINING_WORLD_PLAZA_BIOME_CATALOG } from "@/components/world/domains/definingWorldPlazaBiomeConstants";
import {
  pickingWorldPlazaBiomeKindFromClimate,
} from "@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex";
import { resolvingWorldPlazaClimateAtTile } from "@/components/world/domains/resolvingWorldPlazaClimateAtTileIndex";
import {
  samplingWorldPlazaWaterLakeBasinNoiseAtTile,
  samplingWorldPlazaWaterPatchNoiseAtTile,
} from "@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex";

/**
 * Lake basin occupancy checks without calling the full water resolver.
 *
 * Used to gate rivers and streams so they terminate at lakes instead of
 * passing through them.
 *
 * @module components/world/domains/checkingWorldPlazaLakeBasinOccupiesTileAtTileIndex
 */

/** Grid coordinate pair for lake reference searches. */
export interface CheckingWorldPlazaLakeBasinTileCoordinate {
  /** Tile column index. */
  tileX: number;
  /** Tile row index. */
  tileY: number;
}

/**
 * Returns true when patch and climate gates would allow any surface water here.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function checkingWorldPlazaLakeBasinWetPatchAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  const climate = resolvingWorldPlazaClimateAtTile(tileX, tileY);
  const biomeKind = pickingWorldPlazaBiomeKindFromClimate(
    climate.temperature,
    climate.humidity,
    tileX,
    tileY,
  );

  if (biomeKind === "ocean") {
    return false;
  }

  const biomeTemperature =
    DEFINING_WORLD_PLAZA_BIOME_CATALOG[biomeKind].temperature;
  const patchNoise = samplingWorldPlazaWaterPatchNoiseAtTile(tileX, tileY);
  const temperatureAdjustedPatchNoiseMin =
    computingWorldPlazaWaterPatchNoiseThresholdFromBiomeTemperature(
      biomeTemperature,
    );

  return patchNoise >= temperatureAdjustedPatchNoiseMin;
}

/**
 * Returns true when lake basin noise meets the given minimum on a wet tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param basinNoiseMin - Minimum lake basin noise sample.
 */
function checkingWorldPlazaLakeBasinNoiseMeetsMinimumAtTileIndex(
  tileX: number,
  tileY: number,
  basinNoiseMin: number,
): boolean {
  if (checkingWorldPlazaTileIsRockyBiomeAtTileIndex(tileX, tileY)) {
    return false;
  }

  if (
    tileX * tileX + tileY * tileY <
    DEFINING_WORLD_PLAZA_WATER_SPAWN_CLEARING_RADIUS_SQUARED
  ) {
    return false;
  }

  if (!checkingWorldPlazaLakeBasinWetPatchAtTileIndex(tileX, tileY)) {
    return false;
  }

  return (
    samplingWorldPlazaWaterLakeBasinNoiseAtTile(tileX, tileY) >= basinNoiseMin
  );
}

/**
 * Returns true when noise and placement gates would place a lake on this tile.
 *
 * Does not call {@link resolvingWorldPlazaWaterAtTileIndex}, so flowing-water
 * gates can use it without import cycles.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaLakeBasinOccupiesTileAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  if (
    !checkingWorldPlazaLakeBasinNoiseMeetsMinimumAtTileIndex(
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_WATER_LAKE_BASIN_NOISE_MIN,
    )
  ) {
    return false;
  }

  return checkingWorldPlazaStillWaterPlacementAtTileIndex(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
  );
}

/**
 * Returns true when the tile sits in the lake basin fringe that influences
 * flowing water placement.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaLakeBasinFringeInfluencesTileAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  return checkingWorldPlazaLakeBasinNoiseMeetsMinimumAtTileIndex(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_WATER_LAKE_FLOWING_WATER_BASIN_EXCLUSION_NOISE_MIN,
  );
}

/**
 * Returns the nearest lake-occupying tile within the search radius, if any.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param searchRadiusBlocks - Chebyshev search radius in blocks.
 */
export function findingWorldPlazaNearestLakeBasinOccupyingTileNearTileIndex(
  tileX: number,
  tileY: number,
  searchRadiusBlocks: number = DEFINING_WORLD_PLAZA_WATER_LAKE_FLOWING_WATER_EXCLUSION_RADIUS_BLOCKS,
): CheckingWorldPlazaLakeBasinTileCoordinate | null {
  let nearestLakeTile: CheckingWorldPlazaLakeBasinTileCoordinate | null = null;
  let nearestDistanceBlocks: number | null = null;

  for (let deltaY = -searchRadiusBlocks; deltaY <= searchRadiusBlocks; deltaY += 1) {
    for (
      let deltaX = -searchRadiusBlocks;
      deltaX <= searchRadiusBlocks;
      deltaX += 1
    ) {
      const chebyshevDistanceBlocks = Math.max(
        Math.abs(deltaX),
        Math.abs(deltaY),
      );

      if (chebyshevDistanceBlocks > searchRadiusBlocks) {
        continue;
      }

      const neighborTileX = tileX + deltaX;
      const neighborTileY = tileY + deltaY;

      if (
        !checkingWorldPlazaLakeBasinOccupiesTileAtTileIndex(
          neighborTileX,
          neighborTileY,
        )
      ) {
        continue;
      }

      if (
        nearestDistanceBlocks === null ||
        chebyshevDistanceBlocks < nearestDistanceBlocks
      ) {
        nearestDistanceBlocks = chebyshevDistanceBlocks;
        nearestLakeTile = {
          tileX: neighborTileX,
          tileY: neighborTileY,
        };
      }
    }
  }

  return nearestLakeTile;
}
