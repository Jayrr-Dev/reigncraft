import {
  DEFINING_WORLD_PLAZA_WATER_CHANNEL_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_WATER_CHANNEL_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_WATER_CHANNEL_NOISE_SEED,
  DEFINING_WORLD_PLAZA_WATER_STREAM_BRANCH_CHANNEL_HALF_WIDTH_TILES,
  DEFINING_WORLD_PLAZA_WATER_STREAM_BRANCH_CHANNEL_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_WATER_STREAM_BRANCH_CHANNEL_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_WATER_STREAM_BRANCH_CHANNEL_NOISE_SEED,
  DEFINING_WORLD_PLAZA_WATER_STREAM_CHANNEL_GRADIENT_EPSILON,
  DEFINING_WORLD_PLAZA_WATER_STREAM_CHANNEL_HALF_WIDTH_TILES,
  DEFINING_WORLD_PLAZA_WATER_STREAM_CHANNEL_MAX_HALF_WIDTH_TILES,
  DEFINING_WORLD_PLAZA_WATER_STREAM_CONNECTOR_CHANNEL_HALF_WIDTH_TILES,
  DEFINING_WORLD_PLAZA_WATER_STREAM_CONNECTOR_CHANNEL_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_WATER_STREAM_CONNECTOR_CHANNEL_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_WATER_STREAM_CONNECTOR_CHANNEL_NOISE_SEED,
  DEFINING_WORLD_PLAZA_WATER_STREAM_NETWORK_BRIDGE_RADIUS_BLOCKS,
  DEFINING_WORLD_PLAZA_WATER_STREAM_REGION_MASK_MIN,
  DEFINING_WORLD_PLAZA_WATER_STREAM_REGION_MASK_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_WATER_STREAM_REGION_MASK_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_WATER_STREAM_REGION_MASK_NOISE_SEED,
} from "@/components/world/domains/definingWorldPlazaWaterConstants";
import { samplingWorldPlazaFractalNoise } from "@/components/world/domains/generatingWorldPlazaValueNoise";

/**
 * Stream channel placement from layered noise fields.
 *
 * Primary, branch, and connector channels union for long paths. Gap and
 * network bridges link nearby trickles so separate runs connect into one web.
 *
 * @module components/world/domains/checkingWorldPlazaStreamChannelPlacesStreamAtTileIndex
 */

/** Cardinal grid steps checked for stream connectivity. */
const CHECKING_WORLD_PLAZA_STREAM_CHANNEL_CARDINAL_NEIGHBOR_STEPS: ReadonlyArray<{
  deltaX: number;
  deltaY: number;
}> = [
  { deltaX: 1, deltaY: 0 },
  { deltaX: -1, deltaY: 0 },
  { deltaX: 0, deltaY: 1 },
  { deltaX: 0, deltaY: -1 },
];

/**
 * Samples the coarse mask that decides which regions are allowed to host streams.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function samplingWorldPlazaWaterStreamRegionMaskNoiseAtTile(
  tileX: number,
  tileY: number,
): number {
  return samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_WATER_STREAM_REGION_MASK_NOISE_SEED,
    {
      frequency:
        DEFINING_WORLD_PLAZA_WATER_STREAM_REGION_MASK_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_WATER_STREAM_REGION_MASK_NOISE_OCTAVES,
    },
  );
}

/**
 * Returns true when the tile sits inside a stream valley region mask.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function checkingWorldPlazaStreamRegionMaskPassesAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  return (
    samplingWorldPlazaWaterStreamRegionMaskNoiseAtTile(tileX, tileY) >=
    DEFINING_WORLD_PLAZA_WATER_STREAM_REGION_MASK_MIN
  );
}

/**
 * Samples the primary stream channel field that forms long meandering paths.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function samplingWorldPlazaWaterStreamPrimaryChannelNoiseAtTile(
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
 * Samples the branch stream channel field that crosses the primary path.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function samplingWorldPlazaWaterStreamBranchChannelNoiseAtTile(
  tileX: number,
  tileY: number,
): number {
  return samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_WATER_STREAM_BRANCH_CHANNEL_NOISE_SEED,
    {
      frequency:
        DEFINING_WORLD_PLAZA_WATER_STREAM_BRANCH_CHANNEL_NOISE_FREQUENCY,
      octaves:
        DEFINING_WORLD_PLAZA_WATER_STREAM_BRANCH_CHANNEL_NOISE_OCTAVES,
    },
  );
}

/**
 * Samples the connector stream channel that links nearby trickle networks.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function samplingWorldPlazaWaterStreamConnectorChannelNoiseAtTile(
  tileX: number,
  tileY: number,
): number {
  return samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_WATER_STREAM_CONNECTOR_CHANNEL_NOISE_SEED,
    {
      frequency:
        DEFINING_WORLD_PLAZA_WATER_STREAM_CONNECTOR_CHANNEL_NOISE_FREQUENCY,
      octaves:
        DEFINING_WORLD_PLAZA_WATER_STREAM_CONNECTOR_CHANNEL_NOISE_OCTAVES,
    },
  );
}

/**
 * Returns the tile distance from a tile to a noise channel centerline.
 *
 * Divides the offset from 0.5 by the field gradient so the result is a real
 * distance in tiles. Flat noise regions yield a tiny gradient and a large
 * distance, which keeps streams from blobbing into pond shapes.
 *
 * @param noiseValue - Sampled channel noise at the tile.
 * @param gradientMagnitude - Per-tile gradient magnitude of the same field.
 */
function resolvingWorldPlazaStreamChannelCenterlineDistanceTiles(
  noiseValue: number,
  gradientMagnitude: number,
): number {
  return (
    Math.abs(noiseValue - 0.5) /
    (gradientMagnitude +
      DEFINING_WORLD_PLAZA_WATER_STREAM_CHANNEL_GRADIENT_EPSILON)
  );
}

/**
 * Returns the per-tile gradient magnitude of a stream noise field sampler.
 *
 * @param sampleNoiseAtTile - Channel noise sampler.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function samplingWorldPlazaStreamChannelGradientMagnitudeAtTile(
  sampleNoiseAtTile: (tileX: number, tileY: number) => number,
  tileX: number,
  tileY: number,
): number {
  const east = sampleNoiseAtTile(tileX + 1, tileY);
  const west = sampleNoiseAtTile(tileX - 1, tileY);
  const south = sampleNoiseAtTile(tileX, tileY + 1);
  const north = sampleNoiseAtTile(tileX, tileY - 1);

  return Math.hypot((east - west) / 2, (south - north) / 2);
}

/**
 * Returns true when a tile sits within the ribbon half-width of a noise field.
 *
 * @param sampleNoiseAtTile - Channel noise sampler.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param halfWidthTiles - Target ribbon half-width in tiles.
 */
function checkingWorldPlazaStreamChannelRibbonHitsAtTileIndex(
  sampleNoiseAtTile: (tileX: number, tileY: number) => number,
  tileX: number,
  tileY: number,
  halfWidthTiles: number,
): boolean {
  const centerlineDistanceTiles =
    resolvingWorldPlazaStreamChannelCenterlineDistanceTiles(
      sampleNoiseAtTile(tileX, tileY),
      samplingWorldPlazaStreamChannelGradientMagnitudeAtTile(
        sampleNoiseAtTile,
        tileX,
        tileY,
      ),
    );

  return (
    centerlineDistanceTiles <=
    Math.min(
      halfWidthTiles,
      DEFINING_WORLD_PLAZA_WATER_STREAM_CHANNEL_MAX_HALF_WIDTH_TILES,
    )
  );
}

/**
 * Returns true when primary, branch, or connector channel noise hits here.
 *
 * Ignores the region mask and connectivity gate. Useful for neighbor checks.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaStreamChannelPassesNoiseAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  if (!checkingWorldPlazaStreamRegionMaskPassesAtTileIndex(tileX, tileY)) {
    return false;
  }

  return (
    checkingWorldPlazaStreamChannelRibbonHitsAtTileIndex(
      samplingWorldPlazaWaterStreamPrimaryChannelNoiseAtTile,
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_WATER_STREAM_CHANNEL_HALF_WIDTH_TILES,
    ) ||
    checkingWorldPlazaStreamChannelRibbonHitsAtTileIndex(
      samplingWorldPlazaWaterStreamBranchChannelNoiseAtTile,
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_WATER_STREAM_BRANCH_CHANNEL_HALF_WIDTH_TILES,
    ) ||
    checkingWorldPlazaStreamChannelRibbonHitsAtTileIndex(
      samplingWorldPlazaWaterStreamConnectorChannelNoiseAtTile,
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_WATER_STREAM_CONNECTOR_CHANNEL_HALF_WIDTH_TILES,
    )
  );
}

/**
 * Returns true when a stream channel tile has another channel tile beside it.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function checkingWorldPlazaStreamChannelHasConnectedNeighborAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  for (const neighborStep of CHECKING_WORLD_PLAZA_STREAM_CHANNEL_CARDINAL_NEIGHBOR_STEPS) {
    if (
      checkingWorldPlazaStreamChannelPassesNoiseAtTileIndex(
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
 * Returns true when two cardinal channel neighbors bridge a one-tile gap.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function checkingWorldPlazaStreamChannelCardinalGapBridgeAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  let channelNeighborCount = 0;

  for (const neighborStep of CHECKING_WORLD_PLAZA_STREAM_CHANNEL_CARDINAL_NEIGHBOR_STEPS) {
    if (
      checkingWorldPlazaStreamChannelPassesNoiseAtTileIndex(
        tileX + neighborStep.deltaX,
        tileY + neighborStep.deltaY,
      )
    ) {
      channelNeighborCount += 1;
    }
  }

  return channelNeighborCount >= 2;
}

/**
 * Returns true for a connected stream channel tile on the noise field.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function checkingWorldPlazaStreamChannelIsCoreAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  if (!checkingWorldPlazaStreamChannelPassesNoiseAtTileIndex(tileX, tileY)) {
    return false;
  }

  return (
    checkingWorldPlazaStreamChannelHasConnectedNeighborAtTileIndex(tileX, tileY) ||
    checkingWorldPlazaStreamChannelCardinalGapBridgeAtTileIndex(tileX, tileY)
  );
}

/**
 * Returns true when a stream core sits within range along one direction.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param stepX - Per-step column delta (-1, 0, or 1).
 * @param stepY - Per-step row delta (-1, 0, or 1).
 */
function checkingWorldPlazaStreamCoreWithinRangeAlongDirection(
  tileX: number,
  tileY: number,
  stepX: number,
  stepY: number,
): boolean {
  const bridgeRadiusBlocks =
    DEFINING_WORLD_PLAZA_WATER_STREAM_NETWORK_BRIDGE_RADIUS_BLOCKS;

  for (let step = 1; step <= bridgeRadiusBlocks; step += 1) {
    if (
      checkingWorldPlazaStreamChannelIsCoreAtTileIndex(
        tileX + stepX * step,
        tileY + stepY * step,
      )
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Returns true when a dry tile spans a one-line gap between two stream cores.
 *
 * Only bridges when cores sit on opposite sides along the same axis (east and
 * west, or north and south), so a bridge fills a real gap in a run instead of
 * flooding a 2D pocket into a blob.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function checkingWorldPlazaStreamNetworkBridgeAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  if (!checkingWorldPlazaStreamRegionMaskPassesAtTileIndex(tileX, tileY)) {
    return false;
  }

  if (checkingWorldPlazaStreamChannelPassesNoiseAtTileIndex(tileX, tileY)) {
    return false;
  }

  const bridgesHorizontalGap =
    checkingWorldPlazaStreamCoreWithinRangeAlongDirection(tileX, tileY, 1, 0) &&
    checkingWorldPlazaStreamCoreWithinRangeAlongDirection(tileX, tileY, -1, 0);

  if (bridgesHorizontalGap) {
    return true;
  }

  return (
    checkingWorldPlazaStreamCoreWithinRangeAlongDirection(tileX, tileY, 0, 1) &&
    checkingWorldPlazaStreamCoreWithinRangeAlongDirection(tileX, tileY, 0, -1)
  );
}

/**
 * Returns true when stream channel noise places a connected trickle here.
 *
 * Cores follow channel noise with neighbor connectivity. Gap and network
 * bridges fill holes and link separate trickles that sit near each other.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaStreamChannelPlacesStreamAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  if (checkingWorldPlazaStreamChannelIsCoreAtTileIndex(tileX, tileY)) {
    return true;
  }

  return checkingWorldPlazaStreamNetworkBridgeAtTileIndex(tileX, tileY);
}
