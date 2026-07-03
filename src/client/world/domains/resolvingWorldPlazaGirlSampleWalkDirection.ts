import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DIRECTION_COUNT,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DIRECTIONS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_FACING_CHANGE_EPSILON,
  type DefiningWorldPlazaGirlSampleWalkDirection,
} from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";

/** Radians in one octant slice for 8-direction facing. */
const RESOLVING_WORLD_PLAZA_GIRL_SAMPLE_WALK_OCTANT_RADIANS = Math.PI / 4;

/** Offset so Right sits in the center of the first octant. */
const RESOLVING_WORLD_PLAZA_GIRL_SAMPLE_WALK_OCTANT_OFFSET_RADIANS =
  Math.PI / 8;

/**
 * Maps grid movement to one of eight GirlSample screen-space walk strips.
 *
 * Grid deltas are projected to isometric screen space first so cardinals such
 * as Right and Down pick the correct strip while moving on the plaza grid.
 *
 * @param gridDeltaX - Grid movement on the X axis this frame.
 * @param gridDeltaY - Grid movement on the Y axis this frame.
 * @param fallbackDirection - Direction to keep when movement is negligible.
 */
export function resolvingWorldPlazaGirlSampleWalkDirection(
  gridDeltaX: number,
  gridDeltaY: number,
  fallbackDirection: DefiningWorldPlazaGirlSampleWalkDirection,
): DefiningWorldPlazaGirlSampleWalkDirection {
  const movementMagnitude = Math.hypot(gridDeltaX, gridDeltaY);

  if (movementMagnitude <= DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_FACING_CHANGE_EPSILON) {
    return fallbackDirection;
  }

  const screenDeltaX =
    (gridDeltaX - gridDeltaY) *
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const screenDeltaY =
    (gridDeltaX + gridDeltaY) *
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;
  const screenAngleRadians = Math.atan2(screenDeltaY, screenDeltaX);
  const normalizedScreenAngle =
    (screenAngleRadians + Math.PI * 2) % (Math.PI * 2);
  const octantIndex =
    Math.floor(
      (normalizedScreenAngle +
        RESOLVING_WORLD_PLAZA_GIRL_SAMPLE_WALK_OCTANT_OFFSET_RADIANS) /
        RESOLVING_WORLD_PLAZA_GIRL_SAMPLE_WALK_OCTANT_RADIANS,
    ) % DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DIRECTION_COUNT;

  return DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DIRECTIONS[octantIndex];
}
