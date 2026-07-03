import {
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SIDE_FILL_BRIGHTNESS_ADJUSTMENT_AT_MAX_ELEVATION,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SIDE_FILL_BRIGHTNESS_ADJUSTMENT_AT_MIN_ELEVATION,
} from "@/components/world/domains/definingWorldPlazaTerrainElevationConstants";

/**
 * Maps normalized elevation to a signed side-face brightness adjustment.
 *
 * @module components/world/domains/computingWorldPlazaTerrainElevationSideFillBrightnessAdjustmentFromNormalizedElevation
 */

/**
 * Returns a signed brightness delta for terrain column side faces.
 *
 * Lower normalized values darken cliff sides; higher values lighten them.
 *
 * @param normalizedElevation - Height in [0, 1] where 0 is lowest and 1 is tallest.
 */
export function computingWorldPlazaTerrainElevationSideFillBrightnessAdjustmentFromNormalizedElevation(
  normalizedElevation: number,
): number {
  const clampedNormalizedElevation = Math.min(1, Math.max(0, normalizedElevation));

  return (
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SIDE_FILL_BRIGHTNESS_ADJUSTMENT_AT_MIN_ELEVATION +
    clampedNormalizedElevation *
      (DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SIDE_FILL_BRIGHTNESS_ADJUSTMENT_AT_MAX_ELEVATION -
        DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SIDE_FILL_BRIGHTNESS_ADJUSTMENT_AT_MIN_ELEVATION)
  );
}
