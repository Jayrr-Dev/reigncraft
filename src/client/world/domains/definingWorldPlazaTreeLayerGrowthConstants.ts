import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";

/**
 * Layer-driven tree height and foliage scaling for procedural and placed trees.
 *
 * Visual height uses a bell-curve layer sample centered on layer 16 (most trees
 * are mid-height; a few stay small or grow very tall). Terrain surface layer
 * still anchors the trunk base on the ground.
 *
 * @module components/world/domains/definingWorldPlazaTreeLayerGrowthConstants
 */

/** Metadata key for placed-tree growth stage (0 = sapling). */
export const DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_METADATA_KEY = "growthStage";

/** Minimum growth stage index on a placed tree. */
export const DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MIN = 0;

/** Mature growth stage index (reaches the tile bell-curve target height). */
export const DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MATURE = 3;

/** Tall growth stage index (exceeds bell-curve target for extra height). */
export const DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_TALL = 4;

/** Extra visual layers added at the tall growth stage above the bell-curve sample. */
export const DEFINING_WORLD_PLAZA_TREE_GROWTH_TALL_LAYER_BONUS = 8;

/** Minimum layers between trunk foot and flat canopy before the top is standable. */
export const DEFINING_WORLD_PLAZA_TREE_FLAT_CANOPY_MIN_LAYERS_ABOVE_STANDING = 2;

/** Visual scale at ground layer (sapling-sized). */
export const DEFINING_WORLD_PLAZA_TREE_LAYER_GROWTH_MIN_SCALE = 0.52;

/** Visual scale at the reference mature surface layer. */
export const DEFINING_WORLD_PLAZA_TREE_LAYER_GROWTH_MATURE_SCALE = 1;

/** Maximum visual scale on very high bell-curve outliers. */
export const DEFINING_WORLD_PLAZA_TREE_LAYER_GROWTH_MAX_SCALE = 1.22;

/** Mean of the bell-curve visual layer distribution (average tree height layer). */
export const DEFINING_WORLD_PLAZA_TREE_BELL_CURVE_LAYER_MEAN = 16;

/** Standard deviation of the bell-curve visual layer distribution. */
export const DEFINING_WORLD_PLAZA_TREE_BELL_CURVE_LAYER_STD_DEV = 4.5;

/** Minimum sampled bell-curve visual layer. */
export const DEFINING_WORLD_PLAZA_TREE_BELL_CURVE_LAYER_MIN = 1;

/** Maximum sampled bell-curve visual layer. */
export const DEFINING_WORLD_PLAZA_TREE_BELL_CURVE_LAYER_MAX = 32;

/** Seed salt for the first Box-Muller uniform draw. */
export const DEFINING_WORLD_PLAZA_TREE_BELL_CURVE_SEED_SALT_U1 = 419;

/** Seed salt for the second Box-Muller uniform draw. */
export const DEFINING_WORLD_PLAZA_TREE_BELL_CURVE_SEED_SALT_U2 = 431;

/** Seed salt for procedural tree growth-stage (age) sampling. */
export const DEFINING_WORLD_PLAZA_TREE_PROCEDURAL_GROWTH_STAGE_SEED_SALT = 457;

/**
 * Cumulative weights for procedural tree age mix (stages 0–4).
 *
 * Most trees are mature; a smaller share are saplings, adolescents, or tall veterans.
 */
export const DEFINING_WORLD_PLAZA_TREE_PROCEDURAL_GROWTH_STAGE_CUMULATIVE_WEIGHTS: readonly [
  number,
  number,
  number,
  number,
  number,
] = [0.06, 0.2, 0.42, 0.82, 1];

/** Surface layer treated as fully mature height (matches bell-curve mean). */
export const DEFINING_WORLD_PLAZA_TREE_LAYER_GROWTH_MATURE_SURFACE_LAYER =
  DEFINING_WORLD_PLAZA_TREE_BELL_CURVE_LAYER_MEAN;

/** Foliage density at ground layer as a fraction of mature counts. */
export const DEFINING_WORLD_PLAZA_TREE_LAYER_GROWTH_MIN_FOLIAGE_DENSITY = 0.45;

/** Foliage density multiplier at the mature reference layer. */
export const DEFINING_WORLD_PLAZA_TREE_LAYER_GROWTH_MATURE_FOLIAGE_DENSITY = 1;

/** Visual scale multiplier for growth stage 0 (newly planted sapling). */
export const DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MIN_SCALE = 0.55;

/** Visual scale multiplier at the mature growth stage. */
export const DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MATURE_SCALE = 1;

/** Visual scale multiplier at the tall growth stage. */
export const DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_TALL_SCALE = 1.08;

/**
 * Returns a height scale from a tree visual surface layer.
 *
 * @param surfaceLayer - Bell-curve or growth-interpolated visual layer.
 */
export function computingWorldPlazaTreeLayerGrowthScaleFromSurfaceLayer(
  surfaceLayer: number,
): number {
  const layersAboveGround = Math.max(
    0,
    surfaceLayer - DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
  );
  const matureLayersAboveGround =
    DEFINING_WORLD_PLAZA_TREE_LAYER_GROWTH_MATURE_SURFACE_LAYER -
    DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND;

  if (matureLayersAboveGround <= 0) {
    return DEFINING_WORLD_PLAZA_TREE_LAYER_GROWTH_MATURE_SCALE;
  }

  const progress = Math.min(1, layersAboveGround / matureLayersAboveGround);
  const scale =
    DEFINING_WORLD_PLAZA_TREE_LAYER_GROWTH_MIN_SCALE +
    progress *
      (DEFINING_WORLD_PLAZA_TREE_LAYER_GROWTH_MATURE_SCALE -
        DEFINING_WORLD_PLAZA_TREE_LAYER_GROWTH_MIN_SCALE);

  if (layersAboveGround > matureLayersAboveGround) {
    const extraLayers = layersAboveGround - matureLayersAboveGround;

    return Math.min(
      DEFINING_WORLD_PLAZA_TREE_LAYER_GROWTH_MAX_SCALE,
      scale + extraLayers * 0.04,
    );
  }

  return scale;
}

/**
 * Returns a foliage density multiplier from a tree visual surface layer.
 *
 * @param surfaceLayer - Bell-curve or growth-interpolated visual layer.
 */
export function computingWorldPlazaTreeLayerFoliageDensityFromSurfaceLayer(
  surfaceLayer: number,
): number {
  const layersAboveGround = Math.max(
    0,
    surfaceLayer - DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
  );
  const matureLayersAboveGround =
    DEFINING_WORLD_PLAZA_TREE_LAYER_GROWTH_MATURE_SURFACE_LAYER -
    DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND;

  if (matureLayersAboveGround <= 0) {
    return DEFINING_WORLD_PLAZA_TREE_LAYER_GROWTH_MATURE_FOLIAGE_DENSITY;
  }

  const progress = Math.min(1, layersAboveGround / matureLayersAboveGround);

  return (
    DEFINING_WORLD_PLAZA_TREE_LAYER_GROWTH_MIN_FOLIAGE_DENSITY +
    progress *
      (DEFINING_WORLD_PLAZA_TREE_LAYER_GROWTH_MATURE_FOLIAGE_DENSITY -
        DEFINING_WORLD_PLAZA_TREE_LAYER_GROWTH_MIN_FOLIAGE_DENSITY)
  );
}

/**
 * Returns a visual scale multiplier from a placed-tree growth stage.
 *
 * @param growthStage - Persisted growth stage index (0 = sapling, 4 = tall).
 */
export function computingWorldPlazaTreeGrowthStageScaleFromStageIndex(
  growthStage: number,
): number {
  const clampedStage = Math.max(
    DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MIN,
    Math.min(
      DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_TALL,
      Math.floor(growthStage),
    ),
  );

  if (clampedStage <= DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MATURE) {
    const matureProgress =
      DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MATURE <= 0
        ? 1
        : clampedStage / DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MATURE;

    return (
      DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MIN_SCALE +
      matureProgress *
        (DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MATURE_SCALE -
          DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MIN_SCALE)
    );
  }

  const tallProgress =
    (clampedStage - DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MATURE) /
    (DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_TALL -
      DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MATURE);

  return (
    DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MATURE_SCALE +
    tallProgress *
      (DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_TALL_SCALE -
        DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MATURE_SCALE)
  );
}

/**
 * Parses a growth stage from placed-block metadata.
 *
 * @param metadata - Placed block metadata record.
 */
export function resolvingWorldPlazaTreeGrowthStageFromPlacedBlockMetadata(
  metadata: Record<string, string | number | boolean | null>,
): number {
  const rawStage = metadata[DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_METADATA_KEY];

  if (typeof rawStage !== "number") {
    return DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MIN;
  }

  return Math.max(
    DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_MIN,
    Math.min(
      DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_TALL,
      Math.floor(rawStage),
    ),
  );
}
