import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import { buildingWorldPlazaTreeCanopyLobeCluster } from "@/components/world/domains/buildingWorldPlazaTreeCanopyLobeCluster";
import { DEFINING_WORLD_PLAZA_TREE_SEED_TRUNK_SALT } from "@/components/world/domains/computingWorldPlazaTreeSeedFromTileIndex";
import { DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX } from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import { DEFINING_WORLD_PLAZA_TREE_CANOPY_MIN_DEPTH_SORT_SOUTH_EXTENT_PX } from "@/components/world/domains/definingWorldPlazaTreeConstants";
import {
  DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_BASE_ALPHA,
  DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_CORE_RADIUS_X_PX,
  DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_CORE_RADIUS_Y_PX,
  DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_FILL_COLOR,
  DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_SOFT_LAYERS,
} from "@/components/world/domains/definingWorldPlazaTreeGroundShadowConstants";
import {
  computingWorldPlazaTreeLayerFoliageDensityFromSurfaceLayer,
  computingWorldPlazaTreeLayerGrowthScaleFromSurfaceLayer,
} from "@/components/world/domains/definingWorldPlazaTreeLayerGrowthConstants";
import {
  DEFINING_WORLD_PLAZA_TREE_ACACIA_HIGHLIGHT_SWAY,
  DEFINING_WORLD_PLAZA_TREE_BIRCH_DOWNWARD_SPREAD,
  DEFINING_WORLD_PLAZA_TREE_BIRCH_HORIZONTAL_SPREAD,
  DEFINING_WORLD_PLAZA_TREE_BIRCH_LOBE_MAX,
  DEFINING_WORLD_PLAZA_TREE_BIRCH_LOBE_MAX_RADIUS_FRACTION,
  DEFINING_WORLD_PLAZA_TREE_BIRCH_LOBE_MIN,
  DEFINING_WORLD_PLAZA_TREE_BIRCH_LOBE_MIN_RADIUS_FRACTION,
  DEFINING_WORLD_PLAZA_TREE_BIRCH_UPWARD_SPREAD,
  DEFINING_WORLD_PLAZA_TREE_BLOSSOM_SPECK_MAX,
  DEFINING_WORLD_PLAZA_TREE_BLOSSOM_SPECK_MIN,
  DEFINING_WORLD_PLAZA_TREE_BROADLEAF_ACCENT_LOBE_MAX,
  DEFINING_WORLD_PLAZA_TREE_BROADLEAF_ACCENT_LOBE_MIN,
  DEFINING_WORLD_PLAZA_TREE_BROADLEAF_DOWNWARD_SPREAD,
  DEFINING_WORLD_PLAZA_TREE_BROADLEAF_HORIZONTAL_SPREAD,
  DEFINING_WORLD_PLAZA_TREE_BROADLEAF_LOBE_MAX,
  DEFINING_WORLD_PLAZA_TREE_BROADLEAF_LOBE_MAX_RADIUS_FRACTION,
  DEFINING_WORLD_PLAZA_TREE_BROADLEAF_LOBE_MIN,
  DEFINING_WORLD_PLAZA_TREE_BROADLEAF_LOBE_MIN_RADIUS_FRACTION,
  DEFINING_WORLD_PLAZA_TREE_BROADLEAF_UPWARD_SPREAD,
  DEFINING_WORLD_PLAZA_TREE_CACTUS_ARM_MAX,
  DEFINING_WORLD_PLAZA_TREE_CACTUS_ARM_MIN,
  DEFINING_WORLD_PLAZA_TREE_CANOPY_BRIGHTNESS_JITTER,
  DEFINING_WORLD_PLAZA_TREE_CANOPY_CHANNEL_JITTER,
  DEFINING_WORLD_PLAZA_TREE_CANOPY_SHADE_DROP_FRACTION,
  DEFINING_WORLD_PLAZA_TREE_DEADWOOD_BRANCH_LENGTH_MAX,
  DEFINING_WORLD_PLAZA_TREE_DEADWOOD_BRANCH_LENGTH_MIN,
  DEFINING_WORLD_PLAZA_TREE_DEADWOOD_BRANCH_MAX,
  DEFINING_WORLD_PLAZA_TREE_DEADWOOD_BRANCH_MIN,
  DEFINING_WORLD_PLAZA_TREE_ELLIPSE_RADIUS_JITTER,
  DEFINING_WORLD_PLAZA_TREE_PALM_FROND_LENGTH_MAX,
  DEFINING_WORLD_PLAZA_TREE_PALM_FROND_LENGTH_MIN,
  DEFINING_WORLD_PLAZA_TREE_PALM_FROND_MAX,
  DEFINING_WORLD_PLAZA_TREE_PALM_FROND_MIN,
  DEFINING_WORLD_PLAZA_TREE_PINE_TIER_MAX,
  DEFINING_WORLD_PLAZA_TREE_PINE_TIER_MIN,
  DEFINING_WORLD_PLAZA_TREE_PINE_TIER_WIDTH_JITTER,
  DEFINING_WORLD_PLAZA_TREE_SPRUCE_SNOW_JITTER,
  DEFINING_WORLD_PLAZA_TREE_SPRUCE_TIER_MAX,
  DEFINING_WORLD_PLAZA_TREE_SPRUCE_TIER_MIN,
  DEFINING_WORLD_PLAZA_TREE_SPRUCE_TIER_WIDTH_JITTER,
  DEFINING_WORLD_PLAZA_TREE_TRUNK_BRIGHTNESS_JITTER,
  DEFINING_WORLD_PLAZA_TREE_TRUNK_CHANNEL_JITTER,
  DEFINING_WORLD_PLAZA_TREE_TRUNK_HIGHLIGHT_BAND_END,
  DEFINING_WORLD_PLAZA_TREE_TRUNK_HIGHLIGHT_BAND_START,
  DEFINING_WORLD_PLAZA_TREE_TRUNK_HIGHLIGHT_LIGHTEN,
  DEFINING_WORLD_PLAZA_TREE_TRUNK_SHADOW_BAND_START,
  DEFINING_WORLD_PLAZA_TREE_TRUNK_SHADOW_DARKEN,
  DEFINING_WORLD_PLAZA_TREE_TRUNK_TAPER_TOP_FRACTION,
  DEFINING_WORLD_PLAZA_TREE_TRUNK_WIDTH_JITTER,
  DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_LENGTH_MAX,
  DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_LENGTH_MIN,
  DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_MAX,
  DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_MIN,
  DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_OFFSET_JITTER,
} from "@/components/world/domains/definingWorldPlazaTreeVariationConstants";
import {
  jitteringWorldPlazaTreeColor,
  scalingWorldPlazaTreeColorBrightness,
} from "@/components/world/domains/jitteringWorldPlazaTreeColor";
import type { DefiningWorldPlazaTreeInstance } from "@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex";
import { creatingSeededRandomNumberGenerator } from "@/lib/probability/creatingSeededRandomNumberGenerator";
import type { Graphics } from "pixi.js";

/**
 * Draws stylized, per-tree-unique trees at absolute screen coordinates.
 *
 * Every silhouette is jittered from a stable per-tree seed (see
 * {@link DefiningWorldPlazaTreeInstance.seed}) so neighbours of the same biome
 * differ in crown shape, lobe count, and tint while staying deterministic.
 *
 * @module components/world/domains/drawingWorldPlazaTreeOnGraphics
 */

/** Multiplier applied to every tree dimension (taller / wider silhouettes). */
export const DEFINING_WORLD_PLAZA_TREE_GLOBAL_SIZE_MULTIPLIER = 1.85;

/** Full circle in radians, used to scatter specks around a crown. */
const DEFINING_WORLD_PLAZA_TREE_TWO_PI = Math.PI * 2;

/** Broadleaf (oak / blossom) trunk width (px). */
const DEFINING_WORLD_PLAZA_TREE_BROADLEAF_TRUNK_WIDTH_PX = 10;

/** Broadleaf trunk height (px). */
const DEFINING_WORLD_PLAZA_TREE_BROADLEAF_TRUNK_HEIGHT_PX = 32;

/** Broadleaf canopy lobe radius (px). */
const DEFINING_WORLD_PLAZA_TREE_BROADLEAF_CANOPY_RADIUS_PX = 22;

/** Blossom speck radius on a blossom canopy (px). */
const DEFINING_WORLD_PLAZA_TREE_BLOSSOM_SPECK_RADIUS_PX = 3.2;

/** Willow trunk width (px). */
const DEFINING_WORLD_PLAZA_TREE_WILLOW_TRUNK_WIDTH_PX = 10;

/** Willow trunk height (px). */
const DEFINING_WORLD_PLAZA_TREE_WILLOW_TRUNK_HEIGHT_PX = 36;

/** Willow canopy half-width (px). */
const DEFINING_WORLD_PLAZA_TREE_WILLOW_CANOPY_RADIUS_X_PX = 26;

/** Willow canopy half-height (px). */
const DEFINING_WORLD_PLAZA_TREE_WILLOW_CANOPY_RADIUS_Y_PX = 18;

/** Willow drooping strand width (px). */
const DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_WIDTH_PX = 3;

/** Willow strand horizontal spread as a fraction of the canopy half-width. */
const DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_SPREAD = 0.78;

/** Baseline willow strand length before scaling (px). */
const DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_BASE_EXTRA_PX = 10;

/** Acacia trunk width (px). */
const DEFINING_WORLD_PLAZA_TREE_ACACIA_TRUNK_WIDTH_PX = 7;

/** Acacia trunk height (px). */
const DEFINING_WORLD_PLAZA_TREE_ACACIA_TRUNK_HEIGHT_PX = 44;

/** Acacia umbrella canopy half-width (px). */
const DEFINING_WORLD_PLAZA_TREE_ACACIA_CANOPY_RADIUS_X_PX = 34;

/** Acacia umbrella canopy half-height (px). */
const DEFINING_WORLD_PLAZA_TREE_ACACIA_CANOPY_RADIUS_Y_PX = 11;

/** Spruce trunk width (px). */
const DEFINING_WORLD_PLAZA_TREE_SPRUCE_TRUNK_WIDTH_PX = 7;

/** Spruce trunk height (px). */
const DEFINING_WORLD_PLAZA_TREE_SPRUCE_TRUNK_HEIGHT_PX = 14;

/** Spruce bottom tier half-width (px). */
const DEFINING_WORLD_PLAZA_TREE_SPRUCE_TIER_RADIUS_PX = 22;

/** Spruce tier height (px). */
const DEFINING_WORLD_PLAZA_TREE_SPRUCE_TIER_HEIGHT_PX = 24;

/** Birch trunk width (px). */
const DEFINING_WORLD_PLAZA_TREE_BIRCH_TRUNK_WIDTH_PX = 6;

/** Birch trunk height (px). */
const DEFINING_WORLD_PLAZA_TREE_BIRCH_TRUNK_HEIGHT_PX = 40;

/** Birch canopy lobe radius (px). */
const DEFINING_WORLD_PLAZA_TREE_BIRCH_CANOPY_RADIUS_PX = 16;

/** Vertical offset of the birch crown center above the trunk top (fraction of radius). */
const DEFINING_WORLD_PLAZA_TREE_BIRCH_CANOPY_RISE_FRACTION = 0.55;

/** Pine trunk width (px). */
const DEFINING_WORLD_PLAZA_TREE_PINE_TRUNK_WIDTH_PX = 7;

/** Pine trunk height (px). */
const DEFINING_WORLD_PLAZA_TREE_PINE_TRUNK_HEIGHT_PX = 16;

/** Pine bottom tier half-width (px). */
const DEFINING_WORLD_PLAZA_TREE_PINE_TIER_RADIUS_PX = 20;

/** Pine tier height (px). */
const DEFINING_WORLD_PLAZA_TREE_PINE_TIER_HEIGHT_PX = 22;

/** Palm trunk width (px). */
const DEFINING_WORLD_PLAZA_TREE_PALM_TRUNK_WIDTH_PX = 7;

/** Palm trunk height (px). */
const DEFINING_WORLD_PLAZA_TREE_PALM_TRUNK_HEIGHT_PX = 48;

/** Palm frond length before per-frond scaling (px). */
const DEFINING_WORLD_PLAZA_TREE_PALM_FROND_LENGTH_PX = 34;

/** Palm frond base half-width (px). */
const DEFINING_WORLD_PLAZA_TREE_PALM_FROND_HALF_WIDTH_PX = 4.5;

/** Palm coconut radius (px). */
const DEFINING_WORLD_PLAZA_TREE_PALM_COCONUT_RADIUS_PX = 3.4;

/** Leftmost palm frond angle in radians (screen space, up = negative Y). */
const DEFINING_WORLD_PLAZA_TREE_PALM_ARC_START = -Math.PI * 0.94;

/** Rightmost palm frond angle in radians. */
const DEFINING_WORLD_PLAZA_TREE_PALM_ARC_END = -Math.PI * 0.06;

/** Maximum +/- angular jitter per palm frond (radians). */
const DEFINING_WORLD_PLAZA_TREE_PALM_ANGLE_JITTER = 0.2;

/** Downward droop of a palm frond tip (fraction of frond length). */
const DEFINING_WORLD_PLAZA_TREE_PALM_FROND_DROOP = 0.22;

/** Deadwood trunk width (px). */
const DEFINING_WORLD_PLAZA_TREE_DEADWOOD_TRUNK_WIDTH_PX = 9;

/** Deadwood trunk height (px). */
const DEFINING_WORLD_PLAZA_TREE_DEADWOOD_TRUNK_HEIGHT_PX = 40;

/** Deadwood branch length before per-branch scaling (px). */
const DEFINING_WORLD_PLAZA_TREE_DEADWOOD_BRANCH_LENGTH_PX = 24;

/** Deadwood branch base half-width (px). */
const DEFINING_WORLD_PLAZA_TREE_DEADWOOD_BRANCH_HALF_WIDTH_PX = 2.4;

/** Leftmost deadwood branch angle in radians. */
const DEFINING_WORLD_PLAZA_TREE_DEADWOOD_ARC_START = -Math.PI * 0.86;

/** Rightmost deadwood branch angle in radians. */
const DEFINING_WORLD_PLAZA_TREE_DEADWOOD_ARC_END = -Math.PI * 0.14;

/** Maximum +/- angular jitter per deadwood branch (radians). */
const DEFINING_WORLD_PLAZA_TREE_DEADWOOD_ANGLE_JITTER = 0.38;

/** Cactus column width (px). */
const DEFINING_WORLD_PLAZA_TREE_CACTUS_COLUMN_WIDTH_PX = 16;

/** Cactus floor (trunk) column height (px). */
const DEFINING_WORLD_PLAZA_TREE_CACTUS_TRUNK_HEIGHT_PX = 26;

/** Cactus upper (canopy) column height (px). */
const DEFINING_WORLD_PLAZA_TREE_CACTUS_UPPER_HEIGHT_PX = 34;

/** Cactus arm thickness (px). */
const DEFINING_WORLD_PLAZA_TREE_CACTUS_ARM_WIDTH_PX = 9;

/** Cactus arm horizontal reach beyond the column (px). */
const DEFINING_WORLD_PLAZA_TREE_CACTUS_ARM_REACH_PX = 13;

/** Cactus flower radius (px). */
const DEFINING_WORLD_PLAZA_TREE_CACTUS_FLOWER_RADIUS_PX = 3.6;

/** Drawn-once draw helper signature. */
type DrawingWorldPlazaTreeVariant = (
  graphics: Graphics,
  instance: DefiningWorldPlazaTreeInstance,
  baseScreenX: number,
  baseScreenY: number,
  scale: number,
) => void;

/** Canopy-only draw helper signature. */
type DrawingWorldPlazaTreeCanopyVariant = DrawingWorldPlazaTreeVariant;

/** Resolves the visual layer used for tree height and foliage scaling. */
function resolvingWorldPlazaTreeVisualSurfaceLayer(
  instance: DefiningWorldPlazaTreeInstance,
): number {
  return (
    instance.visualSurfaceLayer ??
    instance.standingSurfaceLayer ??
    DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND
  );
}

/** Resolves the final visual scale for one tree instance. */
export function resolvingWorldPlazaTreeVisualScale(
  instance: DefiningWorldPlazaTreeInstance,
): number {
  const visualSurfaceLayer =
    resolvingWorldPlazaTreeVisualSurfaceLayer(instance);
  const layerGrowthScale =
    computingWorldPlazaTreeLayerGrowthScaleFromSurfaceLayer(visualSurfaceLayer);

  return (
    instance.scale *
    DEFINING_WORLD_PLAZA_TREE_GLOBAL_SIZE_MULTIPLIER *
    layerGrowthScale
  );
}

/** Picks an integer in [min, max] from a seeded generator. */
function pickingWorldPlazaTreeIntInRange(
  random: () => number,
  min: number,
  max: number,
): number {
  return min + Math.floor(random() * (max - min + 1));
}

/**
 * Picks a foliage count scaled by the tree standing surface layer and growth stage.
 *
 * @param random - Seeded random generator.
 * @param min - Base minimum count at mature size.
 * @param max - Base maximum count at mature size.
 * @param instance - Tree instance with standing layer metadata.
 */
function pickingWorldPlazaTreeFoliageIntInRange(
  random: () => number,
  min: number,
  max: number,
  instance: DefiningWorldPlazaTreeInstance,
): number {
  const visualSurfaceLayer =
    resolvingWorldPlazaTreeVisualSurfaceLayer(instance);
  const foliageDensity =
    computingWorldPlazaTreeLayerFoliageDensityFromSurfaceLayer(
      visualSurfaceLayer,
    );
  const adjustedMin = Math.max(1, Math.round(min * foliageDensity));
  const adjustedMax = Math.max(adjustedMin, Math.round(max * foliageDensity));

  return pickingWorldPlazaTreeIntInRange(random, adjustedMin, adjustedMax);
}

/** Converts a unit float to a signed multiplier centered on one. */
function resolvingWorldPlazaTreeSignedJitter(
  unitFloat: number,
  amount: number,
): number {
  return 1 + (unitFloat * 2 - 1) * amount;
}

/** Linearly interpolates between two bounds. */
function interpolatingWorldPlazaTreeValue(
  from: number,
  to: number,
  mix: number,
): number {
  return from + (to - from) * mix;
}

/** Applies the shared canopy color jitter for one tree. */
function jitteringWorldPlazaTreeCanopyColor(
  color: number,
  random: () => number,
): number {
  return jitteringWorldPlazaTreeColor(
    color,
    random,
    DEFINING_WORLD_PLAZA_TREE_CANOPY_BRIGHTNESS_JITTER,
    DEFINING_WORLD_PLAZA_TREE_CANOPY_CHANNEL_JITTER,
  );
}

/**
 * Draws the soft circular ground shadow shared by every tree.
 *
 * Uses layered ellipses (same approach as avatar ground shadows) scaled by tree
 * size so larger trees cast a wider contact patch.
 */
function drawingWorldPlazaTreeGroundShadow(
  graphics: Graphics,
  baseScreenX: number,
  baseScreenY: number,
  scale: number,
): void {
  graphics.clear();

  const coreRadiusXPx =
    DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_CORE_RADIUS_X_PX * scale;
  const coreRadiusYPx =
    DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_CORE_RADIUS_Y_PX * scale;

  for (const softLayer of DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_SOFT_LAYERS) {
    graphics.ellipse(
      baseScreenX,
      baseScreenY,
      coreRadiusXPx * softLayer.radiusScale,
      coreRadiusYPx * softLayer.radiusScale,
    );
    graphics.fill({
      color: DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_FILL_COLOR,
      alpha:
        DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_BASE_ALPHA *
        softLayer.alphaScale,
    });
  }
}

/**
 * Draws a tapered, cylindrically shaded trunk from the base upward.
 *
 * A shadowed band on the left and a lit band on the right read the flat trunk as
 * a rounded log lit from the upper-right.
 *
 * @param graphics - Target Pixi Graphics.
 * @param trunkColor - Mid-tone trunk fill.
 * @param baseScreenX - Trunk base center X.
 * @param baseScreenY - Trunk base Y.
 * @param bottomWidth - Trunk width at the base (px).
 * @param heightPx - Trunk height (px).
 * @param topWidthFraction - Top width as a fraction of the base width.
 */
function drawingWorldPlazaTreeShadedTrunk(
  graphics: Graphics,
  trunkColor: number,
  baseScreenX: number,
  baseScreenY: number,
  bottomWidth: number,
  heightPx: number,
  topWidthFraction: number,
): void {
  const topWidth = bottomWidth * topWidthFraction;
  const bottomLeft = baseScreenX - bottomWidth / 2;
  const topLeft = baseScreenX - topWidth / 2;
  const topY = baseScreenY - heightPx;
  const bottomXAtFraction = (fraction: number): number =>
    bottomLeft + fraction * bottomWidth;
  const topXAtFraction = (fraction: number): number =>
    topLeft + fraction * topWidth;

  graphics
    .poly([
      bottomXAtFraction(0),
      baseScreenY,
      bottomXAtFraction(1),
      baseScreenY,
      topXAtFraction(1),
      topY,
      topXAtFraction(0),
      topY,
    ])
    .fill({ color: trunkColor });

  graphics
    .poly([
      bottomXAtFraction(0),
      baseScreenY,
      bottomXAtFraction(DEFINING_WORLD_PLAZA_TREE_TRUNK_SHADOW_BAND_START),
      baseScreenY,
      topXAtFraction(DEFINING_WORLD_PLAZA_TREE_TRUNK_SHADOW_BAND_START),
      topY,
      topXAtFraction(0),
      topY,
    ])
    .fill({
      color: scalingWorldPlazaTreeColorBrightness(
        trunkColor,
        DEFINING_WORLD_PLAZA_TREE_TRUNK_SHADOW_DARKEN,
      ),
    });

  graphics
    .poly([
      bottomXAtFraction(DEFINING_WORLD_PLAZA_TREE_TRUNK_HIGHLIGHT_BAND_START),
      baseScreenY,
      bottomXAtFraction(DEFINING_WORLD_PLAZA_TREE_TRUNK_HIGHLIGHT_BAND_END),
      baseScreenY,
      topXAtFraction(DEFINING_WORLD_PLAZA_TREE_TRUNK_HIGHLIGHT_BAND_END),
      topY,
      topXAtFraction(DEFINING_WORLD_PLAZA_TREE_TRUNK_HIGHLIGHT_BAND_START),
      topY,
    ])
    .fill({
      color: scalingWorldPlazaTreeColorBrightness(
        trunkColor,
        DEFINING_WORLD_PLAZA_TREE_TRUNK_HIGHLIGHT_LIGHTEN,
      ),
    });
}

/** Draws the trunk for a variant with seeded color, thickness, and taper. */
function drawingWorldPlazaTreeVariantTrunk(
  graphics: Graphics,
  instance: DefiningWorldPlazaTreeInstance,
  baseScreenX: number,
  baseScreenY: number,
  scale: number,
): void {
  const random = creatingSeededRandomNumberGenerator(
    instance.seed ^ DEFINING_WORLD_PLAZA_TREE_SEED_TRUNK_SALT,
  );
  const trunkColor = jitteringWorldPlazaTreeColor(
    instance.trunkColor,
    random,
    DEFINING_WORLD_PLAZA_TREE_TRUNK_BRIGHTNESS_JITTER,
    DEFINING_WORLD_PLAZA_TREE_TRUNK_CHANNEL_JITTER,
  );
  const bottomWidth =
    resolvingWorldPlazaTreeTrunkWidthPx(instance, scale) *
    resolvingWorldPlazaTreeSignedJitter(
      random(),
      DEFINING_WORLD_PLAZA_TREE_TRUNK_WIDTH_JITTER,
    );
  const heightPx = resolvingWorldPlazaTreeTrunkHeightPx(instance, scale);
  const topWidthFraction =
    instance.variant === "cactus"
      ? 1
      : DEFINING_WORLD_PLAZA_TREE_TRUNK_TAPER_TOP_FRACTION;

  drawingWorldPlazaTreeShadedTrunk(
    graphics,
    trunkColor,
    baseScreenX,
    baseScreenY,
    bottomWidth,
    heightPx,
    topWidthFraction,
  );
}

/** Draws shade, base, and accent passes for a broadleaf-style lobe cluster. */
function drawingWorldPlazaTreeLobeClusterPasses(
  graphics: Graphics,
  lobes: ReturnType<typeof buildingWorldPlazaTreeCanopyLobeCluster>,
  colors: readonly [number, number, number],
  lobeRadius: number,
  random: () => number,
  instance: DefiningWorldPlazaTreeInstance,
): void {
  const [baseColor, shadeColor, accentColor] = colors;
  const shadeDrop =
    lobeRadius * DEFINING_WORLD_PLAZA_TREE_CANOPY_SHADE_DROP_FRACTION;

  for (const lobe of lobes) {
    graphics.circle(lobe.x, lobe.y + shadeDrop, lobe.radius);
  }
  graphics.fill({
    color: jitteringWorldPlazaTreeCanopyColor(shadeColor, random),
  });

  for (const lobe of lobes) {
    graphics.circle(lobe.x, lobe.y, lobe.radius);
  }
  graphics.fill({
    color: jitteringWorldPlazaTreeCanopyColor(baseColor, random),
  });

  const accentCount = pickingWorldPlazaTreeFoliageIntInRange(
    random,
    DEFINING_WORLD_PLAZA_TREE_BROADLEAF_ACCENT_LOBE_MIN,
    DEFINING_WORLD_PLAZA_TREE_BROADLEAF_ACCENT_LOBE_MAX,
    instance,
  );
  const accentLobes = [...lobes]
    .sort((lobeA, lobeB) => lobeA.y - lobeB.y)
    .slice(0, accentCount);

  for (const lobe of accentLobes) {
    graphics.circle(
      lobe.x + (random() - 0.5) * lobe.radius * 0.4,
      lobe.y - lobe.radius * 0.25,
      lobe.radius * 0.5,
    );
  }
  graphics.fill({
    color: jitteringWorldPlazaTreeCanopyColor(accentColor, random),
  });
}

/**
 * Queues a tapered spoke polygon (wide at origin, pointed at the tip).
 *
 * Shared by palm fronds and dead-tree branches. Caller fills afterward.
 */
function drawingWorldPlazaTreeTaperedSpoke(
  graphics: Graphics,
  originX: number,
  originY: number,
  tipX: number,
  tipY: number,
  baseHalfWidth: number,
): void {
  const deltaX = tipX - originX;
  const deltaY = tipY - originY;
  const length = Math.hypot(deltaX, deltaY) || 1;
  const perpX = (-deltaY / length) * baseHalfWidth;
  const perpY = (deltaX / length) * baseHalfWidth;

  graphics.poly([
    originX + perpX,
    originY + perpY,
    originX - perpX,
    originY - perpY,
    tipX,
    tipY,
  ]);
}

/** Oak / blossom canopy: an irregular, seeded lobe cluster. */
const drawingWorldPlazaOakTreeCanopyOnly: DrawingWorldPlazaTreeCanopyVariant = (
  graphics,
  instance,
  baseScreenX,
  baseScreenY,
  scale,
) => {
  const trunkHeight =
    DEFINING_WORLD_PLAZA_TREE_BROADLEAF_TRUNK_HEIGHT_PX * scale;
  const lobeRadius =
    DEFINING_WORLD_PLAZA_TREE_BROADLEAF_CANOPY_RADIUS_PX * scale;
  const canopyCenterY = baseScreenY - trunkHeight - lobeRadius * 0.7;
  const random = creatingSeededRandomNumberGenerator(instance.seed);

  const satelliteCount = pickingWorldPlazaTreeFoliageIntInRange(
    random,
    DEFINING_WORLD_PLAZA_TREE_BROADLEAF_LOBE_MIN,
    DEFINING_WORLD_PLAZA_TREE_BROADLEAF_LOBE_MAX,
    instance,
  );
  const lobes = buildingWorldPlazaTreeCanopyLobeCluster({
    centerX: baseScreenX,
    centerY: canopyCenterY,
    baseRadius: lobeRadius,
    random,
    satelliteCount,
    horizontalSpread: DEFINING_WORLD_PLAZA_TREE_BROADLEAF_HORIZONTAL_SPREAD,
    upwardSpread: DEFINING_WORLD_PLAZA_TREE_BROADLEAF_UPWARD_SPREAD,
    downwardSpread: DEFINING_WORLD_PLAZA_TREE_BROADLEAF_DOWNWARD_SPREAD,
    minRadiusFraction:
      DEFINING_WORLD_PLAZA_TREE_BROADLEAF_LOBE_MIN_RADIUS_FRACTION,
    maxRadiusFraction:
      DEFINING_WORLD_PLAZA_TREE_BROADLEAF_LOBE_MAX_RADIUS_FRACTION,
  });

  drawingWorldPlazaTreeLobeClusterPasses(
    graphics,
    lobes,
    instance.canopyColors,
    lobeRadius,
    random,
    instance,
  );

  if (instance.variant === "blossom") {
    const speckRadius =
      DEFINING_WORLD_PLAZA_TREE_BLOSSOM_SPECK_RADIUS_PX * scale;
    const speckCount = pickingWorldPlazaTreeFoliageIntInRange(
      random,
      DEFINING_WORLD_PLAZA_TREE_BLOSSOM_SPECK_MIN,
      DEFINING_WORLD_PLAZA_TREE_BLOSSOM_SPECK_MAX,
      instance,
    );

    for (let speck = 0; speck < speckCount; speck += 1) {
      const lobe = lobes[Math.floor(random() * lobes.length)];
      const speckAngle = random() * DEFINING_WORLD_PLAZA_TREE_TWO_PI;
      const speckDistance = random() * lobe.radius * 0.7;

      graphics.circle(
        lobe.x + Math.cos(speckAngle) * speckDistance,
        lobe.y + Math.sin(speckAngle) * speckDistance,
        speckRadius,
      );
    }
    graphics.fill({
      color: jitteringWorldPlazaTreeCanopyColor(
        instance.canopyColors[2],
        random,
      ),
    });
  }
};

/** Birch canopy: a slim, tall, airy lobe cluster. */
const drawingWorldPlazaBirchTreeCanopyOnly: DrawingWorldPlazaTreeCanopyVariant =
  (graphics, instance, baseScreenX, baseScreenY, scale) => {
    const trunkHeight = DEFINING_WORLD_PLAZA_TREE_BIRCH_TRUNK_HEIGHT_PX * scale;
    const lobeRadius = DEFINING_WORLD_PLAZA_TREE_BIRCH_CANOPY_RADIUS_PX * scale;
    const canopyCenterY =
      baseScreenY -
      trunkHeight -
      lobeRadius * DEFINING_WORLD_PLAZA_TREE_BIRCH_CANOPY_RISE_FRACTION;
    const random = creatingSeededRandomNumberGenerator(instance.seed);

    const satelliteCount = pickingWorldPlazaTreeFoliageIntInRange(
      random,
      DEFINING_WORLD_PLAZA_TREE_BIRCH_LOBE_MIN,
      DEFINING_WORLD_PLAZA_TREE_BIRCH_LOBE_MAX,
      instance,
    );
    const lobes = buildingWorldPlazaTreeCanopyLobeCluster({
      centerX: baseScreenX,
      centerY: canopyCenterY,
      baseRadius: lobeRadius,
      random,
      satelliteCount,
      horizontalSpread: DEFINING_WORLD_PLAZA_TREE_BIRCH_HORIZONTAL_SPREAD,
      upwardSpread: DEFINING_WORLD_PLAZA_TREE_BIRCH_UPWARD_SPREAD,
      downwardSpread: DEFINING_WORLD_PLAZA_TREE_BIRCH_DOWNWARD_SPREAD,
      minRadiusFraction:
        DEFINING_WORLD_PLAZA_TREE_BIRCH_LOBE_MIN_RADIUS_FRACTION,
      maxRadiusFraction:
        DEFINING_WORLD_PLAZA_TREE_BIRCH_LOBE_MAX_RADIUS_FRACTION,
    });

    drawingWorldPlazaTreeLobeClusterPasses(
      graphics,
      lobes,
      instance.canopyColors,
      lobeRadius,
      random,
      instance,
    );
  };

/** Willow canopy: a seeded droopy crown with a variable strand count. */
const drawingWorldPlazaWillowTreeCanopyOnly: DrawingWorldPlazaTreeCanopyVariant =
  (graphics, instance, baseScreenX, baseScreenY, scale) => {
    const trunkHeight =
      DEFINING_WORLD_PLAZA_TREE_WILLOW_TRUNK_HEIGHT_PX * scale;
    const canopyRadiusX =
      DEFINING_WORLD_PLAZA_TREE_WILLOW_CANOPY_RADIUS_X_PX * scale;
    const canopyRadiusY =
      DEFINING_WORLD_PLAZA_TREE_WILLOW_CANOPY_RADIUS_Y_PX * scale;
    const canopyCenterY = baseScreenY - trunkHeight - canopyRadiusY * 0.4;
    const [baseColor, shadeColor, accentColor] = instance.canopyColors;
    const random = creatingSeededRandomNumberGenerator(instance.seed);

    const radiusX =
      canopyRadiusX *
      resolvingWorldPlazaTreeSignedJitter(
        random(),
        DEFINING_WORLD_PLAZA_TREE_ELLIPSE_RADIUS_JITTER,
      );
    const radiusY =
      canopyRadiusY *
      resolvingWorldPlazaTreeSignedJitter(
        random(),
        DEFINING_WORLD_PLAZA_TREE_ELLIPSE_RADIUS_JITTER,
      );

    graphics
      .ellipse(baseScreenX, canopyCenterY + radiusY * 0.4, radiusX, radiusY)
      .fill({ color: jitteringWorldPlazaTreeCanopyColor(shadeColor, random) });
    graphics
      .ellipse(baseScreenX, canopyCenterY, radiusX * 0.95, radiusY * 0.95)
      .fill({ color: jitteringWorldPlazaTreeCanopyColor(baseColor, random) });

    const strandWidth =
      DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_WIDTH_PX * scale;
    const strandTopY = canopyCenterY + radiusY * 0.4;
    const strandCount = pickingWorldPlazaTreeFoliageIntInRange(
      random,
      DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_MIN,
      DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_MAX,
      instance,
    );

    for (let strand = 0; strand < strandCount; strand += 1) {
      const spacing = strandCount === 1 ? 0.5 : strand / (strandCount - 1);
      const evenOffset =
        (spacing * 2 - 1) * DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_SPREAD;
      const jitteredOffset =
        evenOffset +
        (random() - 0.5) *
          DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_OFFSET_JITTER *
          2;
      const strandX = baseScreenX + radiusX * jitteredOffset;
      const strandHeight =
        (radiusY +
          DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_BASE_EXTRA_PX * scale) *
        interpolatingWorldPlazaTreeValue(
          DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_LENGTH_MIN,
          DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_LENGTH_MAX,
          random(),
        );

      graphics.rect(
        strandX - strandWidth / 2,
        strandTopY,
        strandWidth,
        strandHeight,
      );
    }
    graphics.fill({
      color: jitteringWorldPlazaTreeCanopyColor(accentColor, random),
    });
  };

/** Acacia canopy: a seeded flat umbrella with a swaying highlight. */
const drawingWorldPlazaAcaciaTreeCanopyOnly: DrawingWorldPlazaTreeCanopyVariant =
  (graphics, instance, baseScreenX, baseScreenY, scale) => {
    const trunkHeight =
      DEFINING_WORLD_PLAZA_TREE_ACACIA_TRUNK_HEIGHT_PX * scale;
    const canopyRadiusX =
      DEFINING_WORLD_PLAZA_TREE_ACACIA_CANOPY_RADIUS_X_PX * scale;
    const canopyRadiusY =
      DEFINING_WORLD_PLAZA_TREE_ACACIA_CANOPY_RADIUS_Y_PX * scale;
    const canopyCenterY = baseScreenY - trunkHeight - canopyRadiusY * 0.4;
    const [baseColor, shadeColor, accentColor] = instance.canopyColors;
    const random = creatingSeededRandomNumberGenerator(instance.seed);

    const radiusX =
      canopyRadiusX *
      resolvingWorldPlazaTreeSignedJitter(
        random(),
        DEFINING_WORLD_PLAZA_TREE_ELLIPSE_RADIUS_JITTER,
      );
    const radiusY =
      canopyRadiusY *
      resolvingWorldPlazaTreeSignedJitter(
        random(),
        DEFINING_WORLD_PLAZA_TREE_ELLIPSE_RADIUS_JITTER,
      );

    graphics
      .ellipse(baseScreenX, canopyCenterY + radiusY * 0.5, radiusX, radiusY)
      .fill({ color: jitteringWorldPlazaTreeCanopyColor(shadeColor, random) });
    graphics
      .ellipse(baseScreenX, canopyCenterY, radiusX * 0.96, radiusY * 0.85)
      .fill({ color: jitteringWorldPlazaTreeCanopyColor(baseColor, random) });

    const highlightSway =
      (random() - 0.5) * 2 * DEFINING_WORLD_PLAZA_TREE_ACACIA_HIGHLIGHT_SWAY;

    graphics
      .ellipse(
        baseScreenX + radiusX * highlightSway,
        canopyCenterY - radiusY * 0.35,
        radiusX * 0.5,
        radiusY * 0.4,
      )
      .fill({ color: jitteringWorldPlazaTreeCanopyColor(accentColor, random) });
  };

/** Spruce canopy: seeded stacked tiers with jittered width and snow caps. */
const drawingWorldPlazaSpruceTreeCanopyOnly: DrawingWorldPlazaTreeCanopyVariant =
  (graphics, instance, baseScreenX, baseScreenY, scale) => {
    const trunkHeight =
      DEFINING_WORLD_PLAZA_TREE_SPRUCE_TRUNK_HEIGHT_PX * scale;
    const tierRadius = DEFINING_WORLD_PLAZA_TREE_SPRUCE_TIER_RADIUS_PX * scale;
    const tierHeight = DEFINING_WORLD_PLAZA_TREE_SPRUCE_TIER_HEIGHT_PX * scale;
    const [baseColor, shadeColor, snowColor] = instance.canopyColors;
    const random = creatingSeededRandomNumberGenerator(instance.seed);

    const tierCount = pickingWorldPlazaTreeFoliageIntInRange(
      random,
      DEFINING_WORLD_PLAZA_TREE_SPRUCE_TIER_MIN,
      DEFINING_WORLD_PLAZA_TREE_SPRUCE_TIER_MAX,
      instance,
    );
    const baseFill = jitteringWorldPlazaTreeCanopyColor(baseColor, random);
    const shadeFill = jitteringWorldPlazaTreeCanopyColor(shadeColor, random);
    const snowFill = jitteringWorldPlazaTreeCanopyColor(snowColor, random);

    for (let tier = 0; tier < tierCount; tier += 1) {
      const tierFraction = tier / tierCount;
      const tierBaseY = baseScreenY - trunkHeight - tier * tierHeight * 0.75;
      const tierApexY = tierBaseY - tierHeight;
      const tierHalfWidth =
        tierRadius *
        (1 - tierFraction * 0.55) *
        resolvingWorldPlazaTreeSignedJitter(
          random(),
          DEFINING_WORLD_PLAZA_TREE_SPRUCE_TIER_WIDTH_JITTER,
        );
      const snowHalfWidth =
        tierHalfWidth *
        0.45 *
        resolvingWorldPlazaTreeSignedJitter(
          random(),
          DEFINING_WORLD_PLAZA_TREE_SPRUCE_SNOW_JITTER,
        );

      graphics
        .poly([
          baseScreenX - tierHalfWidth,
          tierBaseY,
          baseScreenX + tierHalfWidth,
          tierBaseY,
          baseScreenX,
          tierApexY,
        ])
        .fill({ color: tier === 0 ? shadeFill : baseFill });
      graphics
        .poly([
          baseScreenX - snowHalfWidth,
          tierApexY + tierHeight * 0.35,
          baseScreenX + snowHalfWidth,
          tierApexY + tierHeight * 0.35,
          baseScreenX,
          tierApexY,
        ])
        .fill({ color: snowFill });
    }
  };

/** Pine canopy: tall, narrow seeded conifer tiers with a lighter tip. */
const drawingWorldPlazaPineTreeCanopyOnly: DrawingWorldPlazaTreeCanopyVariant =
  (graphics, instance, baseScreenX, baseScreenY, scale) => {
    const trunkHeight = DEFINING_WORLD_PLAZA_TREE_PINE_TRUNK_HEIGHT_PX * scale;
    const tierRadius = DEFINING_WORLD_PLAZA_TREE_PINE_TIER_RADIUS_PX * scale;
    const tierHeight = DEFINING_WORLD_PLAZA_TREE_PINE_TIER_HEIGHT_PX * scale;
    const [baseColor, shadeColor, accentColor] = instance.canopyColors;
    const random = creatingSeededRandomNumberGenerator(instance.seed);

    const tierCount = pickingWorldPlazaTreeFoliageIntInRange(
      random,
      DEFINING_WORLD_PLAZA_TREE_PINE_TIER_MIN,
      DEFINING_WORLD_PLAZA_TREE_PINE_TIER_MAX,
      instance,
    );
    const baseFill = jitteringWorldPlazaTreeCanopyColor(baseColor, random);
    const shadeFill = jitteringWorldPlazaTreeCanopyColor(shadeColor, random);
    const accentFill = jitteringWorldPlazaTreeCanopyColor(accentColor, random);
    let topApexY = baseScreenY;

    for (let tier = 0; tier < tierCount; tier += 1) {
      const tierFraction = tier / tierCount;
      const tierBaseY = baseScreenY - trunkHeight - tier * tierHeight * 0.7;
      const tierApexY = tierBaseY - tierHeight;
      const tierHalfWidth =
        tierRadius *
        (1 - tierFraction * 0.62) *
        resolvingWorldPlazaTreeSignedJitter(
          random(),
          DEFINING_WORLD_PLAZA_TREE_PINE_TIER_WIDTH_JITTER,
        );

      graphics
        .poly([
          baseScreenX - tierHalfWidth,
          tierBaseY,
          baseScreenX + tierHalfWidth,
          tierBaseY,
          baseScreenX,
          tierApexY,
        ])
        .fill({ color: tier === 0 ? shadeFill : baseFill });
      topApexY = tierApexY;
    }

    graphics
      .poly([
        baseScreenX - tierRadius * 0.16,
        topApexY + tierHeight * 0.5,
        baseScreenX + tierRadius * 0.16,
        topApexY + tierHeight * 0.5,
        baseScreenX,
        topApexY,
      ])
      .fill({ color: accentFill });
  };

/** Palm canopy: a fan of seeded drooping fronds with coconuts. */
const drawingWorldPlazaPalmTreeCanopyOnly: DrawingWorldPlazaTreeCanopyVariant =
  (graphics, instance, baseScreenX, baseScreenY, scale) => {
    const trunkHeight = DEFINING_WORLD_PLAZA_TREE_PALM_TRUNK_HEIGHT_PX * scale;
    const crownY = baseScreenY - trunkHeight;
    const frondHalfWidth =
      DEFINING_WORLD_PLAZA_TREE_PALM_FROND_HALF_WIDTH_PX * scale;
    const coconutRadius =
      DEFINING_WORLD_PLAZA_TREE_PALM_COCONUT_RADIUS_PX * scale;
    const [baseColor, shadeColor] = instance.canopyColors;
    const random = creatingSeededRandomNumberGenerator(instance.seed);

    const frondCount = pickingWorldPlazaTreeFoliageIntInRange(
      random,
      DEFINING_WORLD_PLAZA_TREE_PALM_FROND_MIN,
      DEFINING_WORLD_PLAZA_TREE_PALM_FROND_MAX,
      instance,
    );
    const fronds: { tipX: number; tipY: number }[] = [];

    for (let frond = 0; frond < frondCount; frond += 1) {
      const spacing = frondCount === 1 ? 0.5 : frond / (frondCount - 1);
      const baseAngle = interpolatingWorldPlazaTreeValue(
        DEFINING_WORLD_PLAZA_TREE_PALM_ARC_START,
        DEFINING_WORLD_PLAZA_TREE_PALM_ARC_END,
        spacing,
      );
      const angle =
        baseAngle +
        (random() - 0.5) * 2 * DEFINING_WORLD_PLAZA_TREE_PALM_ANGLE_JITTER;
      const length =
        DEFINING_WORLD_PLAZA_TREE_PALM_FROND_LENGTH_PX *
        scale *
        interpolatingWorldPlazaTreeValue(
          DEFINING_WORLD_PLAZA_TREE_PALM_FROND_LENGTH_MIN,
          DEFINING_WORLD_PLAZA_TREE_PALM_FROND_LENGTH_MAX,
          random(),
        );
      const droop =
        Math.abs(Math.cos(angle)) *
        length *
        DEFINING_WORLD_PLAZA_TREE_PALM_FROND_DROOP;

      fronds.push({
        tipX: baseScreenX + Math.cos(angle) * length,
        tipY: crownY + Math.sin(angle) * length + droop,
      });
    }

    const baseFill = jitteringWorldPlazaTreeCanopyColor(baseColor, random);
    const shadeFill = jitteringWorldPlazaTreeCanopyColor(shadeColor, random);

    for (const frond of fronds) {
      drawingWorldPlazaTreeTaperedSpoke(
        graphics,
        baseScreenX,
        crownY + frondHalfWidth,
        frond.tipX,
        frond.tipY + frondHalfWidth,
        frondHalfWidth,
      );
    }
    graphics.fill({ color: shadeFill });

    for (const frond of fronds) {
      drawingWorldPlazaTreeTaperedSpoke(
        graphics,
        baseScreenX,
        crownY,
        frond.tipX,
        frond.tipY,
        frondHalfWidth,
      );
    }
    graphics.circle(baseScreenX, crownY, frondHalfWidth * 1.1);
    graphics.fill({ color: baseFill });

    graphics.circle(
      baseScreenX - coconutRadius,
      crownY + coconutRadius,
      coconutRadius,
    );
    graphics.circle(
      baseScreenX + coconutRadius,
      crownY + coconutRadius * 0.6,
      coconutRadius,
    );
    graphics.fill({
      color: jitteringWorldPlazaTreeColor(
        instance.trunkColor,
        random,
        DEFINING_WORLD_PLAZA_TREE_TRUNK_BRIGHTNESS_JITTER,
        DEFINING_WORLD_PLAZA_TREE_TRUNK_CHANNEL_JITTER,
      ),
    });
  };

/** Deadwood canopy: bare seeded branches forking off the upper trunk. */
const drawingWorldPlazaDeadwoodTreeCanopyOnly: DrawingWorldPlazaTreeCanopyVariant =
  (graphics, instance, baseScreenX, baseScreenY, scale) => {
    const trunkHeight =
      DEFINING_WORLD_PLAZA_TREE_DEADWOOD_TRUNK_HEIGHT_PX * scale;
    const topY = baseScreenY - trunkHeight;
    const branchHalfWidth =
      DEFINING_WORLD_PLAZA_TREE_DEADWOOD_BRANCH_HALF_WIDTH_PX * scale;
    const random = creatingSeededRandomNumberGenerator(instance.seed);

    const branchCount = pickingWorldPlazaTreeFoliageIntInRange(
      random,
      DEFINING_WORLD_PLAZA_TREE_DEADWOOD_BRANCH_MIN,
      DEFINING_WORLD_PLAZA_TREE_DEADWOOD_BRANCH_MAX,
      instance,
    );
    const branchFill = jitteringWorldPlazaTreeCanopyColor(
      instance.canopyColors[0],
      random,
    );
    const accentFill = jitteringWorldPlazaTreeCanopyColor(
      instance.canopyColors[2],
      random,
    );

    for (let branch = 0; branch < branchCount; branch += 1) {
      const spacing = branchCount === 1 ? 0.5 : branch / (branchCount - 1);
      const baseAngle = interpolatingWorldPlazaTreeValue(
        DEFINING_WORLD_PLAZA_TREE_DEADWOOD_ARC_START,
        DEFINING_WORLD_PLAZA_TREE_DEADWOOD_ARC_END,
        spacing,
      );
      const angle =
        baseAngle +
        (random() - 0.5) * 2 * DEFINING_WORLD_PLAZA_TREE_DEADWOOD_ANGLE_JITTER;
      const length =
        DEFINING_WORLD_PLAZA_TREE_DEADWOOD_BRANCH_LENGTH_PX *
        scale *
        interpolatingWorldPlazaTreeValue(
          DEFINING_WORLD_PLAZA_TREE_DEADWOOD_BRANCH_LENGTH_MIN,
          DEFINING_WORLD_PLAZA_TREE_DEADWOOD_BRANCH_LENGTH_MAX,
          random(),
        );
      const originY = topY + random() * trunkHeight * 0.22;
      const tipX = baseScreenX + Math.cos(angle) * length;
      const tipY = originY + Math.sin(angle) * length;

      drawingWorldPlazaTreeTaperedSpoke(
        graphics,
        baseScreenX,
        originY,
        tipX,
        tipY,
        branchHalfWidth,
      );

      const forkTipX = tipX + Math.cos(angle - 0.5) * length * 0.4;
      const forkTipY = tipY + Math.sin(angle - 0.5) * length * 0.4;

      drawingWorldPlazaTreeTaperedSpoke(
        graphics,
        tipX,
        tipY,
        forkTipX,
        forkTipY,
        branchHalfWidth * 0.65,
      );
    }
    graphics.fill({ color: branchFill });

    graphics.circle(baseScreenX, topY, branchHalfWidth * 1.4);
    graphics.fill({ color: accentFill });
  };

/** Cactus canopy: the upper saguaro column, arms, and crown flowers. */
const drawingWorldPlazaCactusTreeCanopyOnly: DrawingWorldPlazaTreeCanopyVariant =
  (graphics, instance, baseScreenX, baseScreenY, scale) => {
    const trunkHeight =
      DEFINING_WORLD_PLAZA_TREE_CACTUS_TRUNK_HEIGHT_PX * scale;
    const columnHalfWidth =
      (DEFINING_WORLD_PLAZA_TREE_CACTUS_COLUMN_WIDTH_PX * scale) / 2;
    const upperHeight =
      DEFINING_WORLD_PLAZA_TREE_CACTUS_UPPER_HEIGHT_PX * scale;
    const armWidth = DEFINING_WORLD_PLAZA_TREE_CACTUS_ARM_WIDTH_PX * scale;
    const armReach = DEFINING_WORLD_PLAZA_TREE_CACTUS_ARM_REACH_PX * scale;
    const flowerRadius =
      DEFINING_WORLD_PLAZA_TREE_CACTUS_FLOWER_RADIUS_PX * scale;
    const baseY = baseScreenY - trunkHeight;
    const columnTopY = baseY - upperHeight;
    const [baseColor, shadeColor, accentColor] = instance.canopyColors;
    const random = creatingSeededRandomNumberGenerator(instance.seed);

    const armCount = pickingWorldPlazaTreeFoliageIntInRange(
      random,
      DEFINING_WORLD_PLAZA_TREE_CACTUS_ARM_MIN,
      DEFINING_WORLD_PLAZA_TREE_CACTUS_ARM_MAX,
      instance,
    );
    const baseFill = jitteringWorldPlazaTreeCanopyColor(baseColor, random);
    const shadeFill = jitteringWorldPlazaTreeCanopyColor(shadeColor, random);
    const flowerFill = jitteringWorldPlazaTreeCanopyColor(accentColor, random);
    const armTips: { x: number; y: number }[] = [];

    graphics.rect(
      baseScreenX - columnHalfWidth,
      columnTopY,
      columnHalfWidth * 2,
      baseY - columnTopY + 2 * scale,
    );
    graphics.circle(baseScreenX, columnTopY, columnHalfWidth);

    for (let arm = 0; arm < armCount; arm += 1) {
      const side = arm % 2 === 0 ? -1 : 1;
      const elbowY =
        baseY -
        upperHeight * interpolatingWorldPlazaTreeValue(0.32, 0.55, random());
      const riserTopY =
        elbowY -
        upperHeight * interpolatingWorldPlazaTreeValue(0.3, 0.5, random());
      const riserOuterX =
        side < 0
          ? baseScreenX - columnHalfWidth - armReach
          : baseScreenX + columnHalfWidth + armReach - armWidth;
      const stubX =
        side < 0 ? riserOuterX : baseScreenX + columnHalfWidth - armWidth * 0.5;
      const stubWidth =
        side < 0
          ? baseScreenX - columnHalfWidth + armWidth * 0.5 - riserOuterX
          : riserOuterX +
            armWidth -
            (baseScreenX + columnHalfWidth - armWidth * 0.5);

      graphics.rect(stubX, elbowY, stubWidth, armWidth);
      graphics.rect(
        riserOuterX,
        riserTopY,
        armWidth,
        elbowY - riserTopY + armWidth,
      );
      graphics.circle(riserOuterX + armWidth / 2, riserTopY, armWidth / 2);

      armTips.push({ x: riserOuterX + armWidth / 2, y: riserTopY });
    }
    graphics.fill({ color: baseFill });

    graphics.rect(
      baseScreenX + columnHalfWidth * 0.55,
      columnTopY,
      columnHalfWidth * 0.45,
      baseY - columnTopY,
    );
    graphics.fill({ color: shadeFill });

    graphics.circle(baseScreenX, columnTopY - flowerRadius * 0.3, flowerRadius);
    for (const armTip of armTips) {
      graphics.circle(
        armTip.x,
        armTip.y - flowerRadius * 0.3,
        flowerRadius * 0.85,
      );
    }
    graphics.fill({ color: flowerFill });
  };

/** Canopy-only draw dispatch keyed by silhouette. */
const DEFINING_WORLD_PLAZA_TREE_CANOPY_VARIANT_DRAWERS: Record<
  DefiningWorldPlazaTreeInstance["variant"],
  DrawingWorldPlazaTreeCanopyVariant
> = {
  oak: drawingWorldPlazaOakTreeCanopyOnly,
  blossom: drawingWorldPlazaOakTreeCanopyOnly,
  willow: drawingWorldPlazaWillowTreeCanopyOnly,
  acacia: drawingWorldPlazaAcaciaTreeCanopyOnly,
  spruce: drawingWorldPlazaSpruceTreeCanopyOnly,
  birch: drawingWorldPlazaBirchTreeCanopyOnly,
  pine: drawingWorldPlazaPineTreeCanopyOnly,
  palm: drawingWorldPlazaPalmTreeCanopyOnly,
  deadwood: drawingWorldPlazaDeadwoodTreeCanopyOnly,
  cactus: drawingWorldPlazaCactusTreeCanopyOnly,
};

/** Full tree (trunk + canopy) dispatch keyed by silhouette. */
const DEFINING_WORLD_PLAZA_TREE_VARIANT_DRAWERS: Record<
  DefiningWorldPlazaTreeInstance["variant"],
  DrawingWorldPlazaTreeVariant
> = {
  oak: drawingWorldPlazaTreeWithTrunkAndCanopy,
  blossom: drawingWorldPlazaTreeWithTrunkAndCanopy,
  willow: drawingWorldPlazaTreeWithTrunkAndCanopy,
  acacia: drawingWorldPlazaTreeWithTrunkAndCanopy,
  spruce: drawingWorldPlazaTreeWithTrunkAndCanopy,
  birch: drawingWorldPlazaTreeWithTrunkAndCanopy,
  pine: drawingWorldPlazaTreeWithTrunkAndCanopy,
  palm: drawingWorldPlazaTreeWithTrunkAndCanopy,
  deadwood: drawingWorldPlazaTreeWithTrunkAndCanopy,
  cactus: drawingWorldPlazaTreeWithTrunkAndCanopy,
};

/** Draws trunk then delegates the canopy so split / full paths never diverge. */
function drawingWorldPlazaTreeWithTrunkAndCanopy(
  graphics: Graphics,
  instance: DefiningWorldPlazaTreeInstance,
  baseScreenX: number,
  baseScreenY: number,
  scale: number,
): void {
  drawingWorldPlazaTreeVariantTrunk(
    graphics,
    instance,
    baseScreenX,
    baseScreenY,
    scale,
  );
  DEFINING_WORLD_PLAZA_TREE_CANOPY_VARIANT_DRAWERS[instance.variant](
    graphics,
    instance,
    baseScreenX,
    baseScreenY,
    scale,
  );
}

/**
 * Draws the soft ground shadow for one tree on the floor layer.
 *
 * @param graphics - Target Pixi Graphics.
 * @param instance - Tree instance for visual scale.
 * @param baseScreenX - Shadow center X in world screen space.
 * @param baseScreenY - Shadow center Y on the ground tile plane.
 */
export function drawingWorldPlazaTreeGroundShadowOnGraphicsAtScreenPoint(
  graphics: Graphics,
  instance: DefiningWorldPlazaTreeInstance,
  baseScreenX: number,
  baseScreenY: number,
): void {
  drawingWorldPlazaTreeGroundShadow(
    graphics,
    baseScreenX,
    baseScreenY,
    resolvingWorldPlazaTreeVisualScale(instance),
  );
}

/**
 * Draws one tree at an absolute screen position onto a shared Graphics.
 *
 * @param graphics - Target Pixi Graphics (caller manages clear / batching).
 * @param instance - Tree to draw.
 * @param baseScreenX - Trunk base X in world screen space.
 * @param baseScreenY - Trunk base Y in world screen space.
 */
export function drawingWorldPlazaTreeOnGraphicsAtScreenPoint(
  graphics: Graphics,
  instance: DefiningWorldPlazaTreeInstance,
  baseScreenX: number,
  baseScreenY: number,
): void {
  const scale = resolvingWorldPlazaTreeVisualScale(instance);

  drawingWorldPlazaTreeGroundShadow(graphics, baseScreenX, baseScreenY, scale);
  DEFINING_WORLD_PLAZA_TREE_VARIANT_DRAWERS[instance.variant](
    graphics,
    instance,
    baseScreenX,
    baseScreenY,
    scale,
  );
}

/**
 * Draws trunk only (entity layer, depth sorted with avatars).
 *
 * @param graphics - Target Pixi Graphics.
 * @param instance - Tree to draw.
 * @param baseScreenX - Trunk base X in world screen space.
 * @param baseScreenY - Trunk base Y in world screen space.
 */
export function drawingWorldPlazaTreeTrunkOnGraphicsAtScreenPoint(
  graphics: Graphics,
  instance: DefiningWorldPlazaTreeInstance,
  baseScreenX: number,
  baseScreenY: number,
): void {
  const scale = resolvingWorldPlazaTreeVisualScale(instance);

  drawingWorldPlazaTreeVariantTrunk(
    graphics,
    instance,
    baseScreenX,
    baseScreenY,
    scale,
  );
}

/**
 * Draws canopy foliage only (entity layer, depth sorted).
 *
 * @param graphics - Target Pixi Graphics.
 * @param instance - Tree to draw.
 * @param baseScreenX - Trunk base X in world screen space.
 * @param baseScreenY - Trunk base Y in world screen space.
 */
export function drawingWorldPlazaTreeCanopyOnGraphicsAtScreenPoint(
  graphics: Graphics,
  instance: DefiningWorldPlazaTreeInstance,
  baseScreenX: number,
  baseScreenY: number,
): void {
  const scale = resolvingWorldPlazaTreeVisualScale(instance);

  DEFINING_WORLD_PLAZA_TREE_CANOPY_VARIANT_DRAWERS[instance.variant](
    graphics,
    instance,
    baseScreenX,
    baseScreenY,
    scale,
  );
}

/** Trunk width for a variant at the given visual scale. */
function resolvingWorldPlazaTreeTrunkWidthPx(
  instance: DefiningWorldPlazaTreeInstance,
  scale: number,
): number {
  switch (instance.variant) {
    case "willow":
      return DEFINING_WORLD_PLAZA_TREE_WILLOW_TRUNK_WIDTH_PX * scale;
    case "acacia":
      return DEFINING_WORLD_PLAZA_TREE_ACACIA_TRUNK_WIDTH_PX * scale;
    case "spruce":
      return DEFINING_WORLD_PLAZA_TREE_SPRUCE_TRUNK_WIDTH_PX * scale;
    case "birch":
      return DEFINING_WORLD_PLAZA_TREE_BIRCH_TRUNK_WIDTH_PX * scale;
    case "pine":
      return DEFINING_WORLD_PLAZA_TREE_PINE_TRUNK_WIDTH_PX * scale;
    case "palm":
      return DEFINING_WORLD_PLAZA_TREE_PALM_TRUNK_WIDTH_PX * scale;
    case "deadwood":
      return DEFINING_WORLD_PLAZA_TREE_DEADWOOD_TRUNK_WIDTH_PX * scale;
    case "cactus":
      return DEFINING_WORLD_PLAZA_TREE_CACTUS_COLUMN_WIDTH_PX * scale;
    default:
      return DEFINING_WORLD_PLAZA_TREE_BROADLEAF_TRUNK_WIDTH_PX * scale;
  }
}

/** Trunk height for a variant at the given visual scale. */
function resolvingWorldPlazaTreeTrunkHeightPx(
  instance: DefiningWorldPlazaTreeInstance,
  scale: number,
): number {
  switch (instance.variant) {
    case "willow":
      return DEFINING_WORLD_PLAZA_TREE_WILLOW_TRUNK_HEIGHT_PX * scale;
    case "acacia":
      return DEFINING_WORLD_PLAZA_TREE_ACACIA_TRUNK_HEIGHT_PX * scale;
    case "spruce":
      return DEFINING_WORLD_PLAZA_TREE_SPRUCE_TRUNK_HEIGHT_PX * scale;
    case "birch":
      return DEFINING_WORLD_PLAZA_TREE_BIRCH_TRUNK_HEIGHT_PX * scale;
    case "pine":
      return DEFINING_WORLD_PLAZA_TREE_PINE_TRUNK_HEIGHT_PX * scale;
    case "palm":
      return DEFINING_WORLD_PLAZA_TREE_PALM_TRUNK_HEIGHT_PX * scale;
    case "deadwood":
      return DEFINING_WORLD_PLAZA_TREE_DEADWOOD_TRUNK_HEIGHT_PX * scale;
    case "cactus":
      return DEFINING_WORLD_PLAZA_TREE_CACTUS_TRUNK_HEIGHT_PX * scale;
    default:
      return DEFINING_WORLD_PLAZA_TREE_BROADLEAF_TRUNK_HEIGHT_PX * scale;
  }
}

/**
 * Southernmost painted foliage offset from the trunk base (+Y = south on screen).
 *
 * Uses the worst-case jittered silhouette so depth sorting stays a correct upper
 * bound for every random crown the variant can produce.
 *
 * @param instance - Tree variant and placement scale.
 * @param scale - Final visual scale including the global size multiplier.
 */
function resolvingWorldPlazaTreeCanopyPaintedSouthExtentPxFromBase(
  instance: DefiningWorldPlazaTreeInstance,
  scale: number,
): number {
  switch (instance.variant) {
    case "willow": {
      const trunkHeight =
        DEFINING_WORLD_PLAZA_TREE_WILLOW_TRUNK_HEIGHT_PX * scale;
      const canopyRadiusY =
        DEFINING_WORLD_PLAZA_TREE_WILLOW_CANOPY_RADIUS_Y_PX * scale;
      const maxRadiusY =
        canopyRadiusY * (1 + DEFINING_WORLD_PLAZA_TREE_ELLIPSE_RADIUS_JITTER);
      const strandTopOffsetFromBase =
        -trunkHeight - canopyRadiusY * 0.4 + maxRadiusY * 0.4;
      const maxStrandHeight =
        (maxRadiusY +
          DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_BASE_EXTRA_PX * scale) *
        DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_LENGTH_MAX;
      const strandBottomOffsetFromBase =
        strandTopOffsetFromBase + maxStrandHeight;
      const ellipseBottomOffsetFromBase =
        -trunkHeight - canopyRadiusY * 0.4 + maxRadiusY * 1.4;

      return Math.max(strandBottomOffsetFromBase, ellipseBottomOffsetFromBase);
    }
    case "acacia": {
      const trunkHeight =
        DEFINING_WORLD_PLAZA_TREE_ACACIA_TRUNK_HEIGHT_PX * scale;
      const canopyRadiusY =
        DEFINING_WORLD_PLAZA_TREE_ACACIA_CANOPY_RADIUS_Y_PX * scale;
      const maxRadiusY =
        canopyRadiusY * (1 + DEFINING_WORLD_PLAZA_TREE_ELLIPSE_RADIUS_JITTER);

      return -trunkHeight - canopyRadiusY * 0.4 + maxRadiusY * 1.5;
    }
    case "spruce": {
      const trunkHeight =
        DEFINING_WORLD_PLAZA_TREE_SPRUCE_TRUNK_HEIGHT_PX * scale;

      return -trunkHeight;
    }
    case "pine": {
      const trunkHeight =
        DEFINING_WORLD_PLAZA_TREE_PINE_TRUNK_HEIGHT_PX * scale;

      return -trunkHeight;
    }
    case "palm": {
      const trunkHeight =
        DEFINING_WORLD_PLAZA_TREE_PALM_TRUNK_HEIGHT_PX * scale;
      const maxFrondLength =
        DEFINING_WORLD_PLAZA_TREE_PALM_FROND_LENGTH_PX *
        scale *
        DEFINING_WORLD_PLAZA_TREE_PALM_FROND_LENGTH_MAX;

      return (
        -trunkHeight +
        maxFrondLength * DEFINING_WORLD_PLAZA_TREE_PALM_FROND_DROOP
      );
    }
    case "deadwood": {
      const trunkHeight =
        DEFINING_WORLD_PLAZA_TREE_DEADWOOD_TRUNK_HEIGHT_PX * scale;

      return -trunkHeight + trunkHeight * 0.22;
    }
    case "cactus": {
      const trunkHeight =
        DEFINING_WORLD_PLAZA_TREE_CACTUS_TRUNK_HEIGHT_PX * scale;

      return -trunkHeight + 2 * scale;
    }
    case "birch": {
      const trunkHeight =
        DEFINING_WORLD_PLAZA_TREE_BIRCH_TRUNK_HEIGHT_PX * scale;
      const lobeRadius =
        DEFINING_WORLD_PLAZA_TREE_BIRCH_CANOPY_RADIUS_PX * scale;
      const southFromCenter =
        lobeRadius *
        (DEFINING_WORLD_PLAZA_TREE_BIRCH_DOWNWARD_SPREAD +
          DEFINING_WORLD_PLAZA_TREE_CANOPY_SHADE_DROP_FRACTION +
          DEFINING_WORLD_PLAZA_TREE_BIRCH_LOBE_MAX_RADIUS_FRACTION);

      return (
        -trunkHeight -
        lobeRadius * DEFINING_WORLD_PLAZA_TREE_BIRCH_CANOPY_RISE_FRACTION +
        southFromCenter
      );
    }
    default: {
      const trunkHeight =
        DEFINING_WORLD_PLAZA_TREE_BROADLEAF_TRUNK_HEIGHT_PX * scale;
      const lobeRadius =
        DEFINING_WORLD_PLAZA_TREE_BROADLEAF_CANOPY_RADIUS_PX * scale;
      const southFromCenter =
        lobeRadius *
        (DEFINING_WORLD_PLAZA_TREE_BROADLEAF_DOWNWARD_SPREAD +
          DEFINING_WORLD_PLAZA_TREE_CANOPY_SHADE_DROP_FRACTION +
          DEFINING_WORLD_PLAZA_TREE_BROADLEAF_LOBE_MAX_RADIUS_FRACTION);

      return -trunkHeight - lobeRadius * 0.7 + southFromCenter;
    }
  }
}

/**
 * Screen-Y sort key for a canopy so foliage occludes avatars under the crown.
 *
 * @param baseScreenY - Trunk base Y in world screen space.
 * @param instance - Tree variant and placement scale.
 */
export function resolvingWorldPlazaTreeCanopyDepthSortScreenY(
  baseScreenY: number,
  instance: DefiningWorldPlazaTreeInstance,
): number {
  const scale = resolvingWorldPlazaTreeVisualScale(instance);
  const paintedSouthExtentPx =
    resolvingWorldPlazaTreeCanopyPaintedSouthExtentPxFromBase(instance, scale);
  const trunkCoverageExtentPx =
    resolvingWorldPlazaTreeTrunkHeightPx(instance, scale) * 0.35;
  const minimumSouthExtentPx =
    DEFINING_WORLD_PLAZA_TREE_CANOPY_MIN_DEPTH_SORT_SOUTH_EXTENT_PX * scale;

  return (
    baseScreenY +
    Math.max(paintedSouthExtentPx, trunkCoverageExtentPx, minimumSouthExtentPx)
  );
}

/** Approximate screen pixels per grid unit along the isometric diagonal. */
const DEFINING_WORLD_PLAZA_TREE_CANOPY_FOOTPRINT_PX_PER_GRID_UNIT =
  Math.SQRT2 * DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;

/**
 * Grid-space radius of the overhead canopy footprint used for player occlusion.
 *
 * Uses the worst-case jittered crown width so fade triggers wherever foliage can
 * cover the avatar.
 *
 * @param instance - Tree variant and placement scale.
 */
export function resolvingWorldPlazaTreeCanopyFootprintRadiusGrid(
  instance: DefiningWorldPlazaTreeInstance,
): number {
  const scale = resolvingWorldPlazaTreeVisualScale(instance);
  let canopyRadiusPx: number;

  switch (instance.variant) {
    case "willow":
      canopyRadiusPx =
        DEFINING_WORLD_PLAZA_TREE_WILLOW_CANOPY_RADIUS_X_PX *
        scale *
        (1 + DEFINING_WORLD_PLAZA_TREE_ELLIPSE_RADIUS_JITTER);
      break;
    case "acacia":
      canopyRadiusPx =
        DEFINING_WORLD_PLAZA_TREE_ACACIA_CANOPY_RADIUS_X_PX *
        scale *
        (1 + DEFINING_WORLD_PLAZA_TREE_ELLIPSE_RADIUS_JITTER);
      break;
    case "spruce":
      canopyRadiusPx =
        DEFINING_WORLD_PLAZA_TREE_SPRUCE_TIER_RADIUS_PX *
        scale *
        (1 + DEFINING_WORLD_PLAZA_TREE_SPRUCE_TIER_WIDTH_JITTER);
      break;
    case "pine":
      canopyRadiusPx =
        DEFINING_WORLD_PLAZA_TREE_PINE_TIER_RADIUS_PX *
        scale *
        (1 + DEFINING_WORLD_PLAZA_TREE_PINE_TIER_WIDTH_JITTER);
      break;
    case "palm":
      canopyRadiusPx =
        DEFINING_WORLD_PLAZA_TREE_PALM_FROND_LENGTH_PX *
        scale *
        DEFINING_WORLD_PLAZA_TREE_PALM_FROND_LENGTH_MAX;
      break;
    case "deadwood":
      canopyRadiusPx =
        DEFINING_WORLD_PLAZA_TREE_DEADWOOD_BRANCH_LENGTH_PX *
        scale *
        DEFINING_WORLD_PLAZA_TREE_DEADWOOD_BRANCH_LENGTH_MAX;
      break;
    case "cactus":
      canopyRadiusPx =
        (DEFINING_WORLD_PLAZA_TREE_CACTUS_COLUMN_WIDTH_PX / 2 +
          DEFINING_WORLD_PLAZA_TREE_CACTUS_ARM_REACH_PX) *
        scale;
      break;
    case "birch":
      canopyRadiusPx =
        DEFINING_WORLD_PLAZA_TREE_BIRCH_CANOPY_RADIUS_PX *
        scale *
        (DEFINING_WORLD_PLAZA_TREE_BIRCH_HORIZONTAL_SPREAD +
          DEFINING_WORLD_PLAZA_TREE_BIRCH_LOBE_MAX_RADIUS_FRACTION);
      break;
    default:
      canopyRadiusPx =
        DEFINING_WORLD_PLAZA_TREE_BROADLEAF_CANOPY_RADIUS_PX *
        scale *
        (DEFINING_WORLD_PLAZA_TREE_BROADLEAF_HORIZONTAL_SPREAD +
          DEFINING_WORLD_PLAZA_TREE_BROADLEAF_LOBE_MAX_RADIUS_FRACTION);
      break;
  }

  const southExtentPx =
    DEFINING_WORLD_PLAZA_TREE_CANOPY_MIN_DEPTH_SORT_SOUTH_EXTENT_PX * scale;
  const effectiveRadiusPx = Math.max(canopyRadiusPx, southExtentPx * 0.85);

  return (
    effectiveRadiusPx /
    DEFINING_WORLD_PLAZA_TREE_CANOPY_FOOTPRINT_PX_PER_GRID_UNIT
  );
}
