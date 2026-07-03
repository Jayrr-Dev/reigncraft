import {
  DEFINING_WORLD_PLAZA_WATER_RIVER_BRANCH_CHANNEL_BAND_MAX_MULTIPLIER,
  DEFINING_WORLD_PLAZA_WATER_RIVER_BRANCH_CHANNEL_BAND_MIN_MULTIPLIER,
  DEFINING_WORLD_PLAZA_WATER_RIVER_BRANCH_CHANNEL_HALF_WIDTH_TILES,
  DEFINING_WORLD_PLAZA_WATER_RIVER_BRANCH_CHANNEL_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_WATER_RIVER_BRANCH_CHANNEL_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_WATER_RIVER_BRANCH_CHANNEL_NOISE_SEED,
  DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_BAND_MAX_MULTIPLIER,
  DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_BAND_MIN_MULTIPLIER,
  DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_GRADIENT_EPSILON,
  DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_HALF_WIDTH_TILES,
  DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_MAX_HALF_WIDTH_TILES,
  DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_NOISE_SEED,
  DEFINING_WORLD_PLAZA_WATER_RIVER_REGION_MASK_MIN,
  DEFINING_WORLD_PLAZA_WATER_RIVER_REGION_MASK_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_WATER_RIVER_REGION_MASK_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_WATER_RIVER_REGION_MASK_NOISE_SEED,
  DEFINING_WORLD_PLAZA_WATER_RIVER_WIDTH_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_WATER_RIVER_WIDTH_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_WATER_RIVER_WIDTH_NOISE_SEED,
} from "@/components/world/domains/definingWorldPlazaWaterConstants";
import { samplingWorldPlazaFractalNoise } from "@/components/world/domains/generatingWorldPlazaValueNoise";
import { mappingWorldPlazaWaterUnitFloatToRange } from "@/components/world/domains/mixingWorldPlazaWaterRgbColors";

/**
 * River channel placement from layered noise fields.
 *
 * Primary and branch channels union for long main stems and tributary forks.
 * A connectivity gate drops isolated pond-like river tiles.
 *
 * @module components/world/domains/checkingWorldPlazaRiverChannelPlacesRiverAtTileIndex
 */

/** Cardinal grid steps checked for river connectivity. */
const CHECKING_WORLD_PLAZA_RIVER_CHANNEL_CARDINAL_NEIGHBOR_STEPS: ReadonlyArray<{
  deltaX: number;
  deltaY: number;
}> = [
  { deltaX: 1, deltaY: 0 },
  { deltaX: -1, deltaY: 0 },
  { deltaX: 0, deltaY: 1 },
  { deltaX: 0, deltaY: -1 },
];

/**
 * Samples the coarse mask that decides which regions are allowed to host rivers.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function samplingWorldPlazaWaterRiverRegionMaskNoiseAtTile(
  tileX: number,
  tileY: number,
): number {
  return samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_WATER_RIVER_REGION_MASK_NOISE_SEED,
    {
      frequency:
        DEFINING_WORLD_PLAZA_WATER_RIVER_REGION_MASK_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_WATER_RIVER_REGION_MASK_NOISE_OCTAVES,
    },
  );
}

/**
 * Samples the primary river channel field that forms long main stems.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function samplingWorldPlazaWaterRiverPrimaryChannelNoiseAtTile(
  tileX: number,
  tileY: number,
): number {
  return samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_NOISE_OCTAVES,
    },
  );
}

/**
 * Samples the branch river channel field that crosses the primary path.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function samplingWorldPlazaWaterRiverBranchChannelNoiseAtTile(
  tileX: number,
  tileY: number,
): number {
  return samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_WATER_RIVER_BRANCH_CHANNEL_NOISE_SEED,
    {
      frequency:
        DEFINING_WORLD_PLAZA_WATER_RIVER_BRANCH_CHANNEL_NOISE_FREQUENCY,
      octaves:
        DEFINING_WORLD_PLAZA_WATER_RIVER_BRANCH_CHANNEL_NOISE_OCTAVES,
    },
  );
}

/**
 * Samples the primary river channel field (legacy alias).
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function samplingWorldPlazaWaterRiverChannelNoiseAtTile(
  tileX: number,
  tileY: number,
): number {
  return samplingWorldPlazaWaterRiverPrimaryChannelNoiseAtTile(tileX, tileY);
}

/**
 * Samples low-frequency noise that widens and narrows rivers along their length.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function samplingWorldPlazaWaterRiverWidthNoiseAtTile(
  tileX: number,
  tileY: number,
): number {
  return samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_WATER_RIVER_WIDTH_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_WATER_RIVER_WIDTH_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_WATER_RIVER_WIDTH_NOISE_OCTAVES,
    },
  );
}

/**
 * Returns the per-tile gradient magnitude of the primary channel noise field.
 *
 * Central differences over one tile in each axis. The magnitude is how fast the
 * field changes per tile, used to convert a noise offset into a tile distance.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function samplingWorldPlazaWaterRiverPrimaryChannelGradientMagnitudeAtTile(
  tileX: number,
  tileY: number,
): number {
  const east = samplingWorldPlazaWaterRiverPrimaryChannelNoiseAtTile(
    tileX + 1,
    tileY,
  );
  const west = samplingWorldPlazaWaterRiverPrimaryChannelNoiseAtTile(
    tileX - 1,
    tileY,
  );
  const south = samplingWorldPlazaWaterRiverPrimaryChannelNoiseAtTile(
    tileX,
    tileY + 1,
  );
  const north = samplingWorldPlazaWaterRiverPrimaryChannelNoiseAtTile(
    tileX,
    tileY - 1,
  );

  return Math.hypot((east - west) / 2, (south - north) / 2);
}

/**
 * Returns the per-tile gradient magnitude of the branch channel noise field.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function samplingWorldPlazaWaterRiverBranchChannelGradientMagnitudeAtTile(
  tileX: number,
  tileY: number,
): number {
  const east = samplingWorldPlazaWaterRiverBranchChannelNoiseAtTile(
    tileX + 1,
    tileY,
  );
  const west = samplingWorldPlazaWaterRiverBranchChannelNoiseAtTile(
    tileX - 1,
    tileY,
  );
  const south = samplingWorldPlazaWaterRiverBranchChannelNoiseAtTile(
    tileX,
    tileY + 1,
  );
  const north = samplingWorldPlazaWaterRiverBranchChannelNoiseAtTile(
    tileX,
    tileY - 1,
  );

  return Math.hypot((east - west) / 2, (south - north) / 2);
}

/**
 * Returns the primary river ribbon half-width for one tile, in tiles.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function resolvingWorldPlazaRiverPrimaryChannelHalfWidthTilesAtTileIndex(
  tileX: number,
  tileY: number,
): number {
  const widthMultiplier = mappingWorldPlazaWaterUnitFloatToRange(
    samplingWorldPlazaWaterRiverWidthNoiseAtTile(tileX, tileY),
    DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_BAND_MIN_MULTIPLIER,
    DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_BAND_MAX_MULTIPLIER,
  );

  return Math.min(
    DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_HALF_WIDTH_TILES * widthMultiplier,
    DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_MAX_HALF_WIDTH_TILES,
  );
}

/**
 * Returns the branch tributary ribbon half-width for one tile, in tiles.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function resolvingWorldPlazaRiverBranchChannelHalfWidthTilesAtTileIndex(
  tileX: number,
  tileY: number,
): number {
  const widthMultiplier = mappingWorldPlazaWaterUnitFloatToRange(
    samplingWorldPlazaWaterRiverWidthNoiseAtTile(tileX, tileY),
    DEFINING_WORLD_PLAZA_WATER_RIVER_BRANCH_CHANNEL_BAND_MIN_MULTIPLIER,
    DEFINING_WORLD_PLAZA_WATER_RIVER_BRANCH_CHANNEL_BAND_MAX_MULTIPLIER,
  );

  return Math.min(
    DEFINING_WORLD_PLAZA_WATER_RIVER_BRANCH_CHANNEL_HALF_WIDTH_TILES *
      widthMultiplier,
    DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_MAX_HALF_WIDTH_TILES,
  );
}

/**
 * Returns the tile distance from a tile to a noise channel centerline.
 *
 * Divides the offset from 0.5 by the field gradient so the result is a real
 * distance in tiles. In flat noise regions the gradient is tiny and the
 * distance grows large, which keeps channels from blobbing into lake shapes.
 *
 * @param noiseValue - Sampled channel noise at the tile.
 * @param gradientMagnitude - Per-tile gradient magnitude of the same field.
 */
function resolvingWorldPlazaRiverChannelCenterlineDistanceTiles(
  noiseValue: number,
  gradientMagnitude: number,
): number {
  return (
    Math.abs(noiseValue - 0.5) /
    (gradientMagnitude +
      DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_GRADIENT_EPSILON)
  );
}

/**
 * Returns true when primary or branch channel noise places a river channel here.
 *
 * Ignores the region mask and connectivity gate. Useful for neighbor checks.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaRiverChannelPassesNoiseAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  if (
    samplingWorldPlazaWaterRiverRegionMaskNoiseAtTile(tileX, tileY) <
    DEFINING_WORLD_PLAZA_WATER_RIVER_REGION_MASK_MIN
  ) {
    return false;
  }

  const primaryCenterlineDistanceTiles =
    resolvingWorldPlazaRiverChannelCenterlineDistanceTiles(
      samplingWorldPlazaWaterRiverPrimaryChannelNoiseAtTile(tileX, tileY),
      samplingWorldPlazaWaterRiverPrimaryChannelGradientMagnitudeAtTile(
        tileX,
        tileY,
      ),
    );

  if (
    primaryCenterlineDistanceTiles <=
    resolvingWorldPlazaRiverPrimaryChannelHalfWidthTilesAtTileIndex(
      tileX,
      tileY,
    )
  ) {
    return true;
  }

  const branchCenterlineDistanceTiles =
    resolvingWorldPlazaRiverChannelCenterlineDistanceTiles(
      samplingWorldPlazaWaterRiverBranchChannelNoiseAtTile(tileX, tileY),
      samplingWorldPlazaWaterRiverBranchChannelGradientMagnitudeAtTile(
        tileX,
        tileY,
      ),
    );

  return (
    branchCenterlineDistanceTiles <=
    resolvingWorldPlazaRiverBranchChannelHalfWidthTilesAtTileIndex(
      tileX,
      tileY,
    )
  );
}

/**
 * Returns true when a river channel tile has another channel tile beside it.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function checkingWorldPlazaRiverChannelHasConnectedNeighborAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  for (const neighborStep of CHECKING_WORLD_PLAZA_RIVER_CHANNEL_CARDINAL_NEIGHBOR_STEPS) {
    if (
      checkingWorldPlazaRiverChannelPassesNoiseAtTileIndex(
        tileX + neighborStep.deltaX,
        tileY + neighborStep.deltaY,
      )
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Returns true when river channel noise places a connected channel here.
 *
 * Requires at least one cardinal neighbor that also passes channel noise so
 * pond-like isolated river tiles are removed.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaRiverChannelPlacesRiverAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  if (!checkingWorldPlazaRiverChannelPassesNoiseAtTileIndex(tileX, tileY)) {
    return false;
  }

  return checkingWorldPlazaRiverChannelHasConnectedNeighborAtTileIndex(
    tileX,
    tileY,
  );
}
