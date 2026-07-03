/**
 * Ground shadow styling for extruded placed blocks.
 *
 * Models a fixed key light from straight above-front, so blocks cast a
 * footprint shadow straight down the screen. Both bottom footprint edges trail
 * the light, so the shadow fans toward the lower-left and lower-right. The
 * shadow is the block footprint plus a projected "tongue" whose length scales
 * with column height.
 *
 * @module components/world/building/domains/definingWorldBuildingPlacedBlockGroundShadowConstants
 */

import { DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX } from "@/components/world/domains/definingWorldPlazaIsometricConstants";

/** Warm dark tint that reads on grass tiles. */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_FILL_COLOR = 0x121808;

/** Shadow opacity for the combined blurred ground shadow layer. */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_ALPHA = 0.28;

/**
 * Vertical lift applied to every shadow vertex (negative is up on screen).
 *
 * Hacky offset that pulls the footprint up to overlap the block's rendered base
 * edge, closing the light gap between the object and its shadow.
 */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_VERTICAL_LIFT_PX =
  -9;

/** Uniform scale applied to the footprint and cast from each tile center. */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_SCALE = 1.03;

/** Gaussian blur strength softening shadow edges (pixels). */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_BLUR_STRENGTH_PX = 6;

/** Blur quality (pass count). Lower is faster; 4 gives a smoother haze. */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_BLUR_QUALITY = 4;

/** Projected tongue length added per world layer of column height (pixels). */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_LENGTH_PER_LAYER_PX = 2.4;

/** Minimum tongue length so short blocks still cast a visible shadow (pixels). */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_MIN_LENGTH_PX = 13;

/** Maximum tongue length for tall towers (pixels). */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_MAX_LENGTH_PX = 25;

/**
 * Soft passes for the footprint under the block (no Gaussian blur).
 *
 * Multi-pass offsets stack density at the object contact edge.
 */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CONTACT_SOFT_PASSES =
  [
    {
      offsetXPx: 0,
      offsetYPx: -3,
      alphaScale: 0.24,
      drawFootprint: true,
      drawTongues: false,
    },
    {
      offsetXPx: 0,
      offsetYPx: -2,
      alphaScale: 0.28,
      drawFootprint: true,
      drawTongues: false,
    },
    {
      offsetXPx: 0,
      offsetYPx: -1,
      alphaScale: 0.22,
      drawFootprint: true,
      drawTongues: false,
    },
    {
      offsetXPx: 0,
      offsetYPx: 0,
      alphaScale: 0.48,
      drawFootprint: true,
      drawTongues: false,
    },
  ] as const;

/**
 * Soft passes for cast tongues projected away from the block (Gaussian blur).
 *
 * Only this layer is filtered so the edge touching the object stays dark.
 */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CAST_SOFT_PASSES =
  [
    {
      offsetXPx: 0,
      offsetYPx: 0,
      alphaScale: 0.36,
      drawFootprint: false,
      drawTongues: true,
    },
    {
      offsetXPx: 0,
      offsetYPx: 1,
      alphaScale: 0.24,
      drawFootprint: false,
      drawTongues: true,
    },
    {
      offsetXPx: 1,
      offsetYPx: 1,
      alphaScale: 0.18,
      drawFootprint: false,
      drawTongues: true,
    },
    {
      offsetXPx: -1,
      offsetYPx: 1,
      alphaScale: 0.18,
      drawFootprint: false,
      drawTongues: true,
    },
    {
      offsetXPx: 0,
      offsetYPx: 2,
      alphaScale: 0.13,
      drawFootprint: false,
      drawTongues: true,
    },
    {
      offsetXPx: 2,
      offsetYPx: 2,
      alphaScale: 0.09,
      drawFootprint: false,
      drawTongues: true,
    },
    {
      offsetXPx: -2,
      offsetYPx: 2,
      alphaScale: 0.09,
      drawFootprint: false,
      drawTongues: true,
    },
    {
      offsetXPx: 0,
      offsetYPx: 3,
      alphaScale: 0.07,
      drawFootprint: false,
      drawTongues: true,
    },
    {
      offsetXPx: 1,
      offsetYPx: 3,
      alphaScale: 0.05,
      drawFootprint: false,
      drawTongues: true,
    },
    {
      offsetXPx: -1,
      offsetYPx: 3,
      alphaScale: 0.05,
      drawFootprint: false,
      drawTongues: true,
    },
    {
      offsetXPx: 0,
      offsetYPx: 4,
      alphaScale: 0.04,
      drawFootprint: false,
      drawTongues: true,
    },
    {
      offsetXPx: 0,
      offsetYPx: 5,
      alphaScale: 0.03,
      drawFootprint: false,
      drawTongues: true,
    },
    {
      offsetXPx: 0,
      offsetYPx: 6,
      alphaScale: 0.025,
      drawFootprint: false,
      drawTongues: true,
    },
    {
      offsetXPx: 0,
      offsetYPx: 7,
      alphaScale: 0.02,
      drawFootprint: false,
      drawTongues: true,
    },
  ] as const;

/** @deprecated Use contact or cast soft pass lists. */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_SOFT_PASSES = [
  ...DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CONTACT_SOFT_PASSES,
  ...DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CAST_SOFT_PASSES,
] as const;

/** Minimum column span in world layers before a shadow is drawn. */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_MIN_COLUMN_SPAN_LAYERS = 2;

/**
 * Unnormalized screen-space cast direction (light above-front, shadow straight
 * down). Casting straight down makes both bottom footprint edges trail the
 * light, so the shadow fans symmetrically to the lower-left and lower-right.
 */
const DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CAST_VECTOR_X = 0;
const DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CAST_VECTOR_Y =
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

/** Cached normalized cast direction. */
const DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CAST_VECTOR_LENGTH =
  Math.hypot(
    DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CAST_VECTOR_X,
    DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CAST_VECTOR_Y,
  );

/** Normalized cast direction X. */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CAST_DIRECTION_X =
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CAST_VECTOR_X /
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CAST_VECTOR_LENGTH;

/** Normalized cast direction Y. */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CAST_DIRECTION_Y =
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CAST_VECTOR_Y /
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CAST_VECTOR_LENGTH;

/**
 * Resolves the projected shadow offset for a column of the given world-layer span.
 *
 * @param columnSpanLayers - Vertical span of the column in world layers.
 */
export function resolvingWorldBuildingPlacedBlockGroundShadowProjectionOffset(
  columnSpanLayers: number,
): { readonly offsetX: number; readonly offsetY: number } {
  const tongueLengthPx = Math.min(
    Math.max(
      columnSpanLayers *
        DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_LENGTH_PER_LAYER_PX,
      DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_MIN_LENGTH_PX,
    ),
    DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_MAX_LENGTH_PX,
  );

  return {
    offsetX:
      DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CAST_DIRECTION_X *
      tongueLengthPx,
    offsetY:
      DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CAST_DIRECTION_Y *
      tongueLengthPx,
  };
}
