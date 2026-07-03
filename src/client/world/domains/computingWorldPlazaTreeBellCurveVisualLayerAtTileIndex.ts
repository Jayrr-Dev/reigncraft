import { clampingWorldBuildingWorldLayer } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import {
  DEFINING_WORLD_PLAZA_TREE_BELL_CURVE_LAYER_MAX,
  DEFINING_WORLD_PLAZA_TREE_BELL_CURVE_LAYER_MEAN,
  DEFINING_WORLD_PLAZA_TREE_BELL_CURVE_LAYER_MIN,
  DEFINING_WORLD_PLAZA_TREE_BELL_CURVE_LAYER_STD_DEV,
  DEFINING_WORLD_PLAZA_TREE_BELL_CURVE_SEED_SALT_U1,
  DEFINING_WORLD_PLAZA_TREE_BELL_CURVE_SEED_SALT_U2,
  DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MATURE,
  DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_TALL,
  DEFINING_WORLD_PLAZA_TREE_GROWTH_TALL_LAYER_BONUS,
} from "@/components/world/domains/definingWorldPlazaTreeLayerGrowthConstants";
import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from "@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex";

/**
 * Deterministic bell-curve visual layer sampling for tree height and foliage.
 *
 * @module components/world/domains/computingWorldPlazaTreeBellCurveVisualLayerAtTileIndex
 */

/** Minimum uniform draw before log transform in Box-Muller. */
const COMPUTING_WORLD_PLAZA_TREE_BELL_CURVE_MIN_UNIFORM = 1e-6;

/** Full circle in radians for Box-Muller. */
const COMPUTING_WORLD_PLAZA_TREE_BELL_CURVE_TWO_PI = Math.PI * 2;

/**
 * Samples a tree visual layer from a Gaussian bell curve centered on layer 16.
 *
 * Uses the Box-Muller transform on two independent seeded uniforms so each tile
 * gets a stable, normally distributed height layer. Most trees cluster near the
 * mean; a few stay small or grow very tall.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function computingWorldPlazaTreeBellCurveVisualLayerAtTileIndex(
  tileX: number,
  tileY: number,
): number {
  const uniformU1 = Math.max(
    COMPUTING_WORLD_PLAZA_TREE_BELL_CURVE_MIN_UNIFORM,
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_TREE_BELL_CURVE_SEED_SALT_U1,
    ),
  );
  const uniformU2 = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_TREE_BELL_CURVE_SEED_SALT_U2,
  );
  const standardNormal =
    Math.sqrt(-2 * Math.log(uniformU1)) *
    Math.cos(COMPUTING_WORLD_PLAZA_TREE_BELL_CURVE_TWO_PI * uniformU2);
  const sampledLayer =
    DEFINING_WORLD_PLAZA_TREE_BELL_CURVE_LAYER_MEAN +
    standardNormal * DEFINING_WORLD_PLAZA_TREE_BELL_CURVE_LAYER_STD_DEV;

  return clampingWorldBuildingWorldLayer(
    Math.round(
      Math.min(
        DEFINING_WORLD_PLAZA_TREE_BELL_CURVE_LAYER_MAX,
        Math.max(DEFINING_WORLD_PLAZA_TREE_BELL_CURVE_LAYER_MIN, sampledLayer),
      ),
    ),
  );
}

/**
 * Interpolates a placed tree visual layer from sapling through mature to tall.
 *
 * Stages 0–3 lerp from layer 1 to the tile bell-curve sample. Stage 4 adds
 * bonus layers above that target for the tallest placed trees.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param growthStage - Persisted growth stage (0 = sapling, 3 = mature, 4 = tall).
 */
export function computingWorldPlazaTreePlacedVisualLayerFromGrowthStage(
  tileX: number,
  tileY: number,
  growthStage: number,
): number {
  const targetLayer = computingWorldPlazaTreeBellCurveVisualLayerAtTileIndex(
    tileX,
    tileY,
  );
  const clampedStage = Math.max(
    0,
    Math.min(DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_TALL, growthStage),
  );

  if (clampedStage <= DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MATURE) {
    const growthProgress =
      DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MATURE <= 0
        ? 1
        : clampedStage / DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MATURE;

    return clampingWorldBuildingWorldLayer(
      Math.round(
        DEFINING_WORLD_PLAZA_TREE_BELL_CURVE_LAYER_MIN +
          (targetLayer - DEFINING_WORLD_PLAZA_TREE_BELL_CURVE_LAYER_MIN) *
            growthProgress,
      ),
    );
  }

  const tallTargetLayer = Math.min(
    DEFINING_WORLD_PLAZA_TREE_BELL_CURVE_LAYER_MAX,
    targetLayer + DEFINING_WORLD_PLAZA_TREE_GROWTH_TALL_LAYER_BONUS,
  );
  const tallProgress =
    (clampedStage - DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MATURE) /
    (DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_TALL -
      DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MATURE);

  return clampingWorldBuildingWorldLayer(
    Math.round(targetLayer + (tallTargetLayer - targetLayer) * tallProgress),
  );
}
