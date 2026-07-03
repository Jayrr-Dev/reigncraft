import {
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CHASM_MIN_PLATEAU_LAYER,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CHASM_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CHASM_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CHASM_NOISE_SEED,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CHASM_NOISE_THRESHOLD,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_INTERIOR_NOISE_MIN,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_INTERIOR_SURFACE_LAYER,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_NOISE_SEED,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_NOISE_THRESHOLD,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_RIM_NOISE_MIN,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_RIM_SURFACE_LAYER,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_MAX_BASE_LAYER,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_NOISE_SEED,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_NOISE_THRESHOLD,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_SURFACE_LAYERS,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BREACH_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BREACH_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BREACH_NOISE_SEED,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BREACH_NOISE_THRESHOLD,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BREACH_SURFACE_LAYER,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_JUMP_FOUR_BLOCK_SURFACE_LAYER,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_JUMP_TWO_BLOCK_SURFACE_LAYER,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_LEDGE_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_LEDGE_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_LEDGE_NOISE_SEED,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_LEDGE_NOISE_THRESHOLD,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MIN_LAYER,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PLAY_TIER_SURFACE_LAYERS,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_STEP_BUMP_MAX_BASE_LAYER,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_STEP_BUMP_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_STEP_BUMP_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_STEP_BUMP_NOISE_SEED,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_STEP_BUMP_NOISE_THRESHOLD,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SCULPT_OBSTACLE_THRESHOLD_ALTITUDE_DAMPING,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_HIGH_TIER_SURFACE_LAYERS,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_MIN_BASE_LAYER,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_NOISE_SEED,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_NOISE_THRESHOLD,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SCULPT_BARRIER_MIN_ALTITUDE_FACTOR,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SCULPT_OBSTACLE_MIN_ALTITUDE_FACTOR,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SCULPT_SUMMIT_MIN_ALTITUDE_FACTOR,
} from "@/components/world/domains/definingWorldPlazaTerrainElevationConstants";
import { samplingWorldPlazaFractalNoise } from "@/components/world/domains/generatingWorldPlazaValueNoise";

/**
 * Snaps smooth elevation into walk/jump play tiers and adds local obstacles.
 *
 * @module components/world/domains/sculptingWorldPlazaTerrainElevationSurfaceLayerForPlayAtTileIndex
 */

/**
 * Snaps a raw surface layer to the nearest play tier height.
 *
 * Tiers are chosen so adjacent flat ground creates deliberate gaps:
 * layer 2 = 1H walk step, layer 3 = 2H jump, layer 5 = 4H max jump.
 *
 * @param rawSurfaceLayer - Layer from continuous noise before sculpting.
 */
export function quantizingWorldPlazaTerrainElevationSurfaceLayerToPlayTier(
  rawSurfaceLayer: number,
): number {
  let nearestTier: number =
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PLAY_TIER_SURFACE_LAYERS[0];
  let nearestDistance = Math.abs(rawSurfaceLayer - nearestTier);

  for (const tier of DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PLAY_TIER_SURFACE_LAYERS) {
    const distance = Math.abs(rawSurfaceLayer - tier);

    if (distance < nearestDistance) {
      nearestTier = tier;
      nearestDistance = distance;
    }
  }

  return nearestTier;
}

/**
 * Raises sculpt obstacle thresholds in low-altitude biomes so flat ground stays
 * mostly layer 1 and fewer elevation columns need to be built.
 *
 * @param baseThreshold - Base noise gate for the sculpt feature.
 * @param altitudeFactor - Biome altitude factor in [0, 1].
 */
function computingWorldPlazaTerrainElevationSculptNoiseThresholdFromAltitudeFactor(
  baseThreshold: number,
  altitudeFactor: number,
): number {
  return Math.min(
    0.97,
    baseThreshold +
      (1 - altitudeFactor) *
        DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SCULPT_OBSTACLE_THRESHOLD_ALTITUDE_DAMPING,
  );
}

/**
 * Raises select low tiles into 2H jump blocks (surface layer 3 from flat ground).
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param surfaceLayer - Quantized surface layer.
 * @param altitudeFactor - Biome altitude factor in [0, 1].
 */
function applyingWorldPlazaTerrainElevationStepBumpAtTileIndex(
  tileX: number,
  tileY: number,
  surfaceLayer: number,
  altitudeFactor: number,
): number {
  if (surfaceLayer > DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_STEP_BUMP_MAX_BASE_LAYER) {
    return surfaceLayer;
  }

  const stepBumpSample = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_STEP_BUMP_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_STEP_BUMP_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_STEP_BUMP_NOISE_OCTAVES,
    },
  );

  if (
    stepBumpSample <
    computingWorldPlazaTerrainElevationSculptNoiseThresholdFromAltitudeFactor(
      DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_STEP_BUMP_NOISE_THRESHOLD,
      altitudeFactor,
    )
  ) {
    return surfaceLayer;
  }

  return DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_JUMP_TWO_BLOCK_SURFACE_LAYER;
}

/**
 * Snaps mid-height tiles to 4H max-jump ledges (surface layer 5 from flat ground).
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param surfaceLayer - Surface layer after step bumps.
 * @param altitudeFactor - Biome altitude factor in [0, 1].
 */
function applyingWorldPlazaTerrainElevationJumpLedgeAtTileIndex(
  tileX: number,
  tileY: number,
  surfaceLayer: number,
  altitudeFactor: number,
): number {
  if (
    surfaceLayer >= DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_JUMP_FOUR_BLOCK_SURFACE_LAYER
  ) {
    return surfaceLayer;
  }

  const ledgeSample = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_LEDGE_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_LEDGE_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_LEDGE_NOISE_OCTAVES,
    },
  );

  if (
    ledgeSample <
    computingWorldPlazaTerrainElevationSculptNoiseThresholdFromAltitudeFactor(
      DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_LEDGE_NOISE_THRESHOLD,
      altitudeFactor,
    )
  ) {
    return surfaceLayer;
  }

  return DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_JUMP_FOUR_BLOCK_SURFACE_LAYER;
}

/**
 * Resolves an impassable barrier height (L5–L8) from a noise band.
 *
 * @param barrierBand - Normalized sample above the barrier threshold.
 */
function resolvingWorldPlazaTerrainElevationImpasseBarrierSurfaceLayerFromBand(
  barrierBand: number,
): number {
  const barrierTierIndex = Math.min(
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_SURFACE_LAYERS.length - 1,
    Math.floor(
      barrierBand *
        DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_SURFACE_LAYERS.length,
    ),
  );

  return DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_SURFACE_LAYERS[
    barrierTierIndex
  ];
}

/**
 * Sculpts walled enclave pockets: impassable ring (L6–L8), optional L5 rim, L3 interior.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param surfaceLayer - Surface layer before enclave sculpting.
 */
function applyingWorldPlazaTerrainElevationEnclavePocketAtTileIndex(
  tileX: number,
  tileY: number,
  surfaceLayer: number,
): number {
  if (
    surfaceLayer >
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_MAX_BASE_LAYER
  ) {
    return surfaceLayer;
  }

  const enclaveSample = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_NOISE_OCTAVES,
    },
  );

  if (enclaveSample < DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_NOISE_THRESHOLD) {
    return surfaceLayer;
  }

  if (
    enclaveSample >= DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_INTERIOR_NOISE_MIN
  ) {
    return DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_INTERIOR_SURFACE_LAYER;
  }

  if (enclaveSample >= DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_RIM_NOISE_MIN) {
    return DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_RIM_SURFACE_LAYER;
  }

  const breachSample = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BREACH_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BREACH_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BREACH_NOISE_OCTAVES,
    },
  );

  if (
    breachSample >= DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BREACH_NOISE_THRESHOLD
  ) {
    return DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BREACH_SURFACE_LAYER;
  }

  const enclaveWallBand =
    (enclaveSample - DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_NOISE_THRESHOLD) /
    (DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_RIM_NOISE_MIN -
      DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_NOISE_THRESHOLD);

  return resolvingWorldPlazaTerrainElevationImpasseBarrierSurfaceLayerFromBand(
    enclaveWallBand,
  );
}

/**
 * Raises low tiles into L5–L8 cliff bands the player cannot jump over from flat ground.
 *
 * Breach noise carves rare L2 doorways so every wall line has a discoverable way through.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param surfaceLayer - Surface layer after enclave sculpting.
 */
function applyingWorldPlazaTerrainElevationImpasseBarrierAtTileIndex(
  tileX: number,
  tileY: number,
  surfaceLayer: number,
): number {
  if (
    surfaceLayer >
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_MAX_BASE_LAYER
  ) {
    return surfaceLayer;
  }

  const barrierSample = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_NOISE_OCTAVES,
    },
  );

  if (
    barrierSample < DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_NOISE_THRESHOLD
  ) {
    return surfaceLayer;
  }

  const breachSample = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BREACH_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BREACH_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BREACH_NOISE_OCTAVES,
    },
  );

  if (
    breachSample >= DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BREACH_NOISE_THRESHOLD
  ) {
    return DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BREACH_SURFACE_LAYER;
  }

  const barrierBand =
    (barrierSample - DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_NOISE_THRESHOLD) /
    (1 - DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_NOISE_THRESHOLD);

  return resolvingWorldPlazaTerrainElevationImpasseBarrierSurfaceLayerFromBand(
    barrierBand,
  );
}

/**
 * Carves ground-level trenches through high plateaus for run-jump crossings.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param surfaceLayer - Surface layer before chasm carving.
 */
function applyingWorldPlazaTerrainElevationChasmCarvingAtTileIndex(
  tileX: number,
  tileY: number,
  surfaceLayer: number,
): number {
  if (surfaceLayer < DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CHASM_MIN_PLATEAU_LAYER) {
    return surfaceLayer;
  }

  const chasmSample = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CHASM_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CHASM_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CHASM_NOISE_OCTAVES,
    },
  );

  if (chasmSample < DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CHASM_NOISE_THRESHOLD) {
    return surfaceLayer;
  }

  return DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MIN_LAYER;
}

/**
 * Pushes high plateaus into 16H–32H summit tiers for dramatic vertical landmarks.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param surfaceLayer - Surface layer before summit sculpting.
 */
function applyingWorldPlazaTerrainElevationSummitPeakAtTileIndex(
  tileX: number,
  tileY: number,
  surfaceLayer: number,
): number {
  if (surfaceLayer < DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_MIN_BASE_LAYER) {
    return surfaceLayer;
  }

  const summitSample = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_NOISE_OCTAVES,
    },
  );

  if (summitSample < DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_NOISE_THRESHOLD) {
    return surfaceLayer;
  }

  const summitBand =
    (summitSample - DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_NOISE_THRESHOLD) /
    (1 - DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_NOISE_THRESHOLD);
  const summitTierIndex = Math.min(
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_HIGH_TIER_SURFACE_LAYERS.length - 1,
    Math.floor(
      summitBand * DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_HIGH_TIER_SURFACE_LAYERS.length,
    ),
  );
  const summitLayer =
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_HIGH_TIER_SURFACE_LAYERS[summitTierIndex];

  return Math.max(surfaceLayer, summitLayer);
}

/**
 * Sculpts a raw elevation layer into discrete gameplay tiers and features.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param rawSurfaceLayer - Layer from continuous noise (after altitude scaling).
 * @param altitudeFactor - Blended biome altitude factor in [0, 1].
 */
export function sculptingWorldPlazaTerrainElevationSurfaceLayerForPlayAtTileIndex(
  tileX: number,
  tileY: number,
  rawSurfaceLayer: number,
  altitudeFactor: number,
): number {
  if (altitudeFactor <= 0) {
    return DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MIN_LAYER;
  }

  let surfaceLayer = quantizingWorldPlazaTerrainElevationSurfaceLayerToPlayTier(
    rawSurfaceLayer,
  );

  if (
    altitudeFactor >=
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SCULPT_OBSTACLE_MIN_ALTITUDE_FACTOR
  ) {
    surfaceLayer = applyingWorldPlazaTerrainElevationStepBumpAtTileIndex(
      tileX,
      tileY,
      surfaceLayer,
      altitudeFactor,
    );
    surfaceLayer = applyingWorldPlazaTerrainElevationJumpLedgeAtTileIndex(
      tileX,
      tileY,
      surfaceLayer,
      altitudeFactor,
    );
  }

  if (
    altitudeFactor >=
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SCULPT_BARRIER_MIN_ALTITUDE_FACTOR
  ) {
    surfaceLayer = applyingWorldPlazaTerrainElevationEnclavePocketAtTileIndex(
      tileX,
      tileY,
      surfaceLayer,
    );
    surfaceLayer = applyingWorldPlazaTerrainElevationImpasseBarrierAtTileIndex(
      tileX,
      tileY,
      surfaceLayer,
    );
  }

  if (
    altitudeFactor >=
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SCULPT_SUMMIT_MIN_ALTITUDE_FACTOR
  ) {
    surfaceLayer = applyingWorldPlazaTerrainElevationSummitPeakAtTileIndex(
      tileX,
      tileY,
      surfaceLayer,
    );
  }

  surfaceLayer = applyingWorldPlazaTerrainElevationChasmCarvingAtTileIndex(
    tileX,
    tileY,
    surfaceLayer,
  );

  return surfaceLayer;
}
