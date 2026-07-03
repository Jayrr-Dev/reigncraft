import { adjustingWorldPlazaRgbColorBrightness } from "@/components/world/domains/blendingWorldPlazaRgbColors";
import { DEFINING_WORLD_PLAZA_ISOMETRIC_LEFT_COLUMN_SIDE_FACE_BRIGHTNESS_ADJUSTMENT } from "@/components/world/domains/definingWorldPlazaIsometricConstants";

/**
 * Left and right isometric column side face fill colors.
 *
 * @module components/world/domains/computingWorldPlazaIsometricColumnSideFaceFillColorsFromBaseSideFillColor
 */

/** Fill colors for the west (left) and east (right) column side faces. */
export interface ComputingWorldPlazaIsometricColumnSideFaceFillColors {
  readonly leftSideFillColor: number;
  readonly rightSideFillColor: number;
}

/**
 * Splits one base side fill into darker left (west) and lighter right (east) colors.
 *
 * @param baseSideFillColor - Shared side face color before left/right shading.
 */
export function computingWorldPlazaIsometricColumnSideFaceFillColorsFromBaseSideFillColor(
  baseSideFillColor: number,
): ComputingWorldPlazaIsometricColumnSideFaceFillColors {
  return {
    leftSideFillColor: adjustingWorldPlazaRgbColorBrightness(
      baseSideFillColor,
      DEFINING_WORLD_PLAZA_ISOMETRIC_LEFT_COLUMN_SIDE_FACE_BRIGHTNESS_ADJUSTMENT,
    ),
    rightSideFillColor: baseSideFillColor,
  };
}
