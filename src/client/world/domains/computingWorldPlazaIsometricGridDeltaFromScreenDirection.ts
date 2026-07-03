import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import {
  DEFINING_WORLD_PLAZA_MOVEMENT_DIRECTION_IDLE,
  type DefiningWorldPlazaMovementDirection,
} from "@/components/world/domains/definingWorldPlazaMovementDirection";

/**
 * Converts a normalized screen direction and elapsed time into grid-space displacement
 * with uniform speed on screen (not grid) axes.
 *
 * Inverse of {@link convertingWorldPlazaGridPointToIsometricScreenPoint} for velocity:
 * `gridX = (screenX / hw + screenY / hh) / 2`, `gridY = (screenY / hh - screenX / hw) / 2`.
 *
 * @param screenDirection - Normalized direction from arrow/WASD input.
 * @param screenSpeedPerSecond - Target speed in screen pixels per second.
 * @param deltaSeconds - Elapsed time for this frame.
 */
export function computingWorldPlazaIsometricGridDeltaFromScreenDirection(
  screenDirection: DefiningWorldPlazaMovementDirection,
  screenSpeedPerSecond: number,
  deltaSeconds: number,
): DefiningWorldPlazaMovementDirection {
  const { x: screenX, y: screenY } = screenDirection;

  if (screenX === 0 && screenY === 0) {
    return { ...DEFINING_WORLD_PLAZA_MOVEMENT_DIRECTION_IDLE };
  }

  const halfTileWidthPx = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfTileHeightPx = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;
  const screenDisplacementX = screenX * screenSpeedPerSecond * deltaSeconds;
  const screenDisplacementY = screenY * screenSpeedPerSecond * deltaSeconds;

  return {
    x: (screenDisplacementX / halfTileWidthPx + screenDisplacementY / halfTileHeightPx) / 2,
    y: (screenDisplacementY / halfTileHeightPx - screenDisplacementX / halfTileWidthPx) / 2,
  };
}
