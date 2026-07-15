/**
 * Ground shadow styling for extruded placed blocks.
 *
 * The key light follows the day/night sun, so blocks cast a footprint shadow
 * that sweeps across the screen as the sun moves. The shadow is the block
 * footprint plus a projected "tongue" whose length scales with column height
 * and the sun's altitude.
 *
 * @module components/world/building/domains/definingWorldBuildingPlacedBlockGroundShadowConstants
 */

import { computingWorldPlazaDayNightSunState } from "@/components/world/domains/computingWorldPlazaDayNightSunState";

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

/** Blur quality (pass count). 2 keeps soft edges without the old 4-pass cost. */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_BLUR_QUALITY = 2;

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
 * Kept to the higher-alpha offsets; tiny fringe passes were mostly invisible
 * and dominated redraw cost on dense plots.
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
      offsetXPx: 0,
      offsetYPx: 3,
      alphaScale: 0.08,
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
 * Resolves the projected shadow offset for a column of the given world-layer span.
 *
 * Direction and length now follow the day/night sun: the tongue sweeps from
 * screen-left at sunrise, under the block at noon, to screen-right at sunset,
 * stretching as the light drops toward the horizon.
 *
 * @param columnSpanLayers - Vertical span of the column in world layers.
 */
export function resolvingWorldBuildingPlacedBlockGroundShadowProjectionOffset(
  columnSpanLayers: number,
): { readonly offsetX: number; readonly offsetY: number } {
  const sunState = computingWorldPlazaDayNightSunState();
  const tongueLengthPx =
    Math.min(
      Math.max(
        columnSpanLayers *
          DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_LENGTH_PER_LAYER_PX,
        DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_MIN_LENGTH_PX,
      ),
      DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_MAX_LENGTH_PX,
    ) * sunState.shadowLengthScale;

  return {
    offsetX: sunState.shadowDirectionX * tongueLengthPx,
    offsetY: sunState.shadowDirectionY * tongueLengthPx,
  };
}
