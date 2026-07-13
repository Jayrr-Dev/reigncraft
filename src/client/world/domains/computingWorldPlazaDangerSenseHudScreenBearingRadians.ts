/**
 * Projects a grid delta into continuous isometric screen bearing radians.
 *
 * @module components/world/domains/computingWorldPlazaDangerSenseHudScreenBearingRadians
 */

import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_FACING_CHANGE_EPSILON } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';

/**
 * Screen bearing from player toward a world point.
 *
 * Uses the same iso projection as walk strips. 0 = screen east; positive angles
 * increase clockwise (Y-down). Returns null when the delta is negligible.
 */
export function computingWorldPlazaDangerSenseHudScreenBearingRadians(
  gridDeltaX: number,
  gridDeltaY: number
): number | null {
  if (
    Math.hypot(gridDeltaX, gridDeltaY) <=
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_FACING_CHANGE_EPSILON
  ) {
    return null;
  }

  const screenDeltaX =
    (gridDeltaX - gridDeltaY) *
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const screenDeltaY =
    (gridDeltaX + gridDeltaY) *
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  if (
    Math.hypot(screenDeltaX, screenDeltaY) <=
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_FACING_CHANGE_EPSILON
  ) {
    return null;
  }

  return Math.atan2(screenDeltaY, screenDeltaX);
}
