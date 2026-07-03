import type { DefiningWorldPlazaBiomeKind } from "@/components/world/domains/definingWorldPlazaBiomeKind";
import {
  DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
  DEFINING_WORLD_PLAZA_WATER_KIND_POND,
  DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
  DEFINING_WORLD_PLAZA_WATER_KIND_STREAM,
  DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND,
  type DefiningWorldPlazaWaterKind,
} from "@/components/world/domains/definingWorldPlazaWaterKind";

/**
 * Bed and surface colors for biome-specific surface water.
 *
 * @module components/world/domains/definingWorldPlazaBiomeWaterPaletteConstants
 */

/** Colors and opacity for one water kind inside one biome. */
export interface DefiningWorldPlazaBiomeWaterPalette {
  /** Floor diamond bed color under the water surface. */
  bedFillColor: number;
  /** Translucent surface tint drawn above the bed. */
  surfaceLayerColor: number;
  /** Surface tint opacity in [0, 1]. */
  surfaceLayerAlpha: number;
  /** Lake shore bed tone; only used for lake depth lerping. */
  lakeShallowBedFillColor?: number;
  /** Lake shore surface tint; only used for lake depth lerping. */
  lakeShallowSurfaceColor?: number;
}

type DefiningWorldPlazaBiomeWaterPaletteMap = Partial<
  Record<DefiningWorldPlazaWaterKind, DefiningWorldPlazaBiomeWaterPalette>
>;

/**
 * Builds a lake palette with a subtle shore-to-deep color ramp.
 *
 * @param deepBedFillColor - Deep lake bed tone.
 * @param deepSurfaceLayerColor - Deep lake surface tint.
 * @param shallowBedFillColor - Shallow shore bed tone.
 * @param shallowSurfaceColor - Shallow shore surface tint.
 * @param surfaceLayerAlpha - Deep surface opacity.
 */
function definingWorldPlazaBiomeLakeWaterPalette(
  deepBedFillColor: number,
  deepSurfaceLayerColor: number,
  shallowBedFillColor: number,
  shallowSurfaceColor: number,
  surfaceLayerAlpha = 0.72,
): DefiningWorldPlazaBiomeWaterPalette {
  return {
    bedFillColor: deepBedFillColor,
    surfaceLayerColor: deepSurfaceLayerColor,
    surfaceLayerAlpha,
    lakeShallowBedFillColor: shallowBedFillColor,
    lakeShallowSurfaceColor: shallowSurfaceColor,
  };
}

/**
 * Builds a still or flowing water palette without lake depth tones.
 *
 * @param bedFillColor - Floor diamond bed color.
 * @param surfaceLayerColor - Translucent surface tint.
 * @param surfaceLayerAlpha - Surface tint opacity.
 */
function definingWorldPlazaBiomeStillWaterPalette(
  bedFillColor: number,
  surfaceLayerColor: number,
  surfaceLayerAlpha: number,
): DefiningWorldPlazaBiomeWaterPalette {
  return {
    bedFillColor,
    surfaceLayerColor,
    surfaceLayerAlpha,
  };
}

/** Bed and surface palettes keyed by biome and water kind. */
export const DEFINING_WORLD_PLAZA_BIOME_WATER_PALETTES: Record<
  DefiningWorldPlazaBiomeKind,
  DefiningWorldPlazaBiomeWaterPaletteMap
> = {
  plains: {
    [DEFINING_WORLD_PLAZA_WATER_KIND_LAKE]: definingWorldPlazaBiomeLakeWaterPalette(
      0x0e3d5c,
      0x0f3450,
      0x114456,
      0x123a58,
    ),
    [DEFINING_WORLD_PLAZA_WATER_KIND_RIVER]: definingWorldPlazaBiomeStillWaterPalette(
      0x2f84a8,
      0x2b8cb3,
      0.55,
    ),
    [DEFINING_WORLD_PLAZA_WATER_KIND_STREAM]: definingWorldPlazaBiomeStillWaterPalette(
      0x52b0cf,
      0x2b8cb3,
      0.55,
    ),
    [DEFINING_WORLD_PLAZA_WATER_KIND_POND]: definingWorldPlazaBiomeStillWaterPalette(
      0x357a78,
      0x4a8f8a,
      0.52,
    ),
  },
  forest: {
    [DEFINING_WORLD_PLAZA_WATER_KIND_LAKE]: definingWorldPlazaBiomeLakeWaterPalette(
      0x0c364f,
      0x0d2f48,
      0x103d56,
      0x123650,
    ),
    [DEFINING_WORLD_PLAZA_WATER_KIND_RIVER]: definingWorldPlazaBiomeStillWaterPalette(
      0x2a7a98,
      0x267f9e,
      0.54,
    ),
    [DEFINING_WORLD_PLAZA_WATER_KIND_STREAM]: definingWorldPlazaBiomeStillWaterPalette(
      0x4aa8c4,
      0x267f9e,
      0.54,
    ),
    [DEFINING_WORLD_PLAZA_WATER_KIND_POND]: definingWorldPlazaBiomeStillWaterPalette(
      0x2f6e62,
      0x3f8578,
      0.5,
    ),
  },
  flower_forest: {
    [DEFINING_WORLD_PLAZA_WATER_KIND_LAKE]: definingWorldPlazaBiomeLakeWaterPalette(
      0x0d3a56,
      0x0e314c,
      0x114254,
      0x133854,
    ),
    [DEFINING_WORLD_PLAZA_WATER_KIND_RIVER]: definingWorldPlazaBiomeStillWaterPalette(
      0x3188a6,
      0x2d8eae,
      0.55,
    ),
    [DEFINING_WORLD_PLAZA_WATER_KIND_STREAM]: definingWorldPlazaBiomeStillWaterPalette(
      0x55b4d0,
      0x2d8eae,
      0.55,
    ),
    [DEFINING_WORLD_PLAZA_WATER_KIND_POND]: definingWorldPlazaBiomeStillWaterPalette(
      0x3a8078,
      0x4f968e,
      0.52,
    ),
  },
  desert: {},
  snowy_plains: {
    [DEFINING_WORLD_PLAZA_WATER_KIND_LAKE]: definingWorldPlazaBiomeLakeWaterPalette(
      0x4a6d82,
      0x425c70,
      0x527488,
      0x4a6478,
      0.68,
    ),
    [DEFINING_WORLD_PLAZA_WATER_KIND_RIVER]: definingWorldPlazaBiomeStillWaterPalette(
      0x5a8aa4,
      0x6a9cb4,
      0.5,
    ),
    [DEFINING_WORLD_PLAZA_WATER_KIND_STREAM]: definingWorldPlazaBiomeStillWaterPalette(
      0x7ab4cc,
      0x6a9cb4,
      0.5,
    ),
  },
  swamp: {
    [DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND]: definingWorldPlazaBiomeStillWaterPalette(
      0x35472f,
      0x3c4a30,
      0.66,
    ),
    [DEFINING_WORLD_PLAZA_WATER_KIND_RIVER]: definingWorldPlazaBiomeStillWaterPalette(
      0x3a5240,
      0x425848,
      0.58,
    ),
    [DEFINING_WORLD_PLAZA_WATER_KIND_STREAM]: definingWorldPlazaBiomeStillWaterPalette(
      0x4a6450,
      0x425848,
      0.58,
    ),
  },
  savanna: {
    [DEFINING_WORLD_PLAZA_WATER_KIND_RIVER]: definingWorldPlazaBiomeStillWaterPalette(
      0x4a8a9a,
      0x4e92a2,
      0.52,
    ),
    [DEFINING_WORLD_PLAZA_WATER_KIND_STREAM]: definingWorldPlazaBiomeStillWaterPalette(
      0x68a8b8,
      0x4e92a2,
      0.52,
    ),
    [DEFINING_WORLD_PLAZA_WATER_KIND_POND]: definingWorldPlazaBiomeStillWaterPalette(
      0x6a7a48,
      0x7a8a58,
      0.48,
    ),
  },
  badlands: {},
  beach: {
    [DEFINING_WORLD_PLAZA_WATER_KIND_LAKE]: definingWorldPlazaBiomeLakeWaterPalette(
      0x1a6a88,
      0x1c6280,
      0x207490,
      0x226a88,
      0.7,
    ),
    [DEFINING_WORLD_PLAZA_WATER_KIND_RIVER]: definingWorldPlazaBiomeStillWaterPalette(
      0x3a9cb8,
      0x42a8c4,
      0.56,
    ),
    [DEFINING_WORLD_PLAZA_WATER_KIND_STREAM]: definingWorldPlazaBiomeStillWaterPalette(
      0x5ec0d8,
      0x42a8c4,
      0.56,
    ),
    [DEFINING_WORLD_PLAZA_WATER_KIND_POND]: definingWorldPlazaBiomeStillWaterPalette(
      0x4a9898,
      0x5aa8a8,
      0.54,
    ),
  },
  ocean: {
    [DEFINING_WORLD_PLAZA_WATER_KIND_LAKE]: definingWorldPlazaBiomeLakeWaterPalette(
      0x061e38,
      0x082840,
      0x0c3048,
      0x0e3850,
      0.78,
    ),
  },
  rocky: {},
};
