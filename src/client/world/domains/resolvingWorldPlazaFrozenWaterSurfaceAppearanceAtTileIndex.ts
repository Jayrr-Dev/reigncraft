import {
  DEFINING_WORLD_PLAZA_WATER_FROZEN_SURFACE_LAYER_ALPHA,
  DEFINING_WORLD_PLAZA_WATER_FROZEN_SURFACE_LAYER_COLOR,
  DEFINING_WORLD_PLAZA_WATER_FROZEN_SURFACE_LAYER_HIGHLIGHT_COLOR,
} from "@/components/world/domains/definingWorldPlazaWaterConstants";
import { samplingWorldPlazaFractalNoise } from "@/components/world/domains/generatingWorldPlazaValueNoise";
import { mixingWorldPlazaWaterRgbColors } from "@/components/world/domains/mixingWorldPlazaWaterRgbColors";

/**
 * Frozen water surface tint with quantized slab highlights for cheap batching.
 *
 * @module components/world/domains/resolvingWorldPlazaFrozenWaterSurfaceAppearanceAtTileIndex
 */

/** Frequency for frozen surface highlight noise. */
const RESOLVING_WORLD_PLAZA_FROZEN_WATER_SURFACE_HIGHLIGHT_FREQUENCY = 1 / 8;

/** Seed for frozen surface highlight noise. */
const RESOLVING_WORLD_PLAZA_FROZEN_WATER_SURFACE_HIGHLIGHT_SEED = 11237;

/** Number of discrete surface shades; keeps frozen batches small. */
const RESOLVING_WORLD_PLAZA_FROZEN_WATER_SURFACE_SHADE_COUNT = 4;

/** Frozen surface tint and opacity for one draw pass. */
export interface ResolvingWorldPlazaFrozenWaterSurfaceAppearance {
  /** Surface tint color. */
  color: number;
  /** Surface tint opacity. */
  alpha: number;
}

/**
 * Resolves the translucent frozen surface tint for one tile.
 *
 * Highlight noise is quantized into a handful of shades so the overlay stays
 * batched instead of issuing one fill per tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaFrozenWaterSurfaceAppearanceAtTileIndex(
  tileX: number,
  tileY: number,
): ResolvingWorldPlazaFrozenWaterSurfaceAppearance {
  const highlightNoise = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    RESOLVING_WORLD_PLAZA_FROZEN_WATER_SURFACE_HIGHLIGHT_SEED,
    {
      frequency: RESOLVING_WORLD_PLAZA_FROZEN_WATER_SURFACE_HIGHLIGHT_FREQUENCY,
      octaves: 2,
    },
  );
  const shadeIndex = Math.min(
    RESOLVING_WORLD_PLAZA_FROZEN_WATER_SURFACE_SHADE_COUNT - 1,
    Math.floor(
      highlightNoise * RESOLVING_WORLD_PLAZA_FROZEN_WATER_SURFACE_SHADE_COUNT,
    ),
  );
  const highlightMix =
    shadeIndex /
    (RESOLVING_WORLD_PLAZA_FROZEN_WATER_SURFACE_SHADE_COUNT - 1);

  return {
    color: mixingWorldPlazaWaterRgbColors(
      DEFINING_WORLD_PLAZA_WATER_FROZEN_SURFACE_LAYER_COLOR,
      DEFINING_WORLD_PLAZA_WATER_FROZEN_SURFACE_LAYER_HIGHLIGHT_COLOR,
      highlightMix,
    ),
    alpha: DEFINING_WORLD_PLAZA_WATER_FROZEN_SURFACE_LAYER_ALPHA,
  };
}
