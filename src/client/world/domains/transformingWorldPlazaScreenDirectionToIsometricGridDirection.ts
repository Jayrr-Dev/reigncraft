import {
  DEFINING_WORLD_PLAZA_MOVEMENT_DIRECTION_IDLE,
  type DefiningWorldPlazaMovementDirection,
} from "@/components/world/domains/definingWorldPlazaMovementDirection";

/**
 * Maps screen-space keyboard direction to a normalized isometric grid direction.
 *
 * For movement, prefer {@link computingWorldPlazaIsometricGridDeltaFromScreenDirection}
 * so screen speed stays uniform on all axes (2:1 iso otherwise makes up/down half speed).
 *
 * Screen up moves northwest on the grid; screen right moves northeast, etc.
 *
 * @param screenDirection - Normalized direction from arrow/WASD input.
 */
export function transformingWorldPlazaScreenDirectionToIsometricGridDirection(
  screenDirection: DefiningWorldPlazaMovementDirection,
): DefiningWorldPlazaMovementDirection {
  const { x: screenX, y: screenY } = screenDirection;

  if (screenX === 0 && screenY === 0) {
    return { ...DEFINING_WORLD_PLAZA_MOVEMENT_DIRECTION_IDLE };
  }

  const gridX = screenX + screenY;
  const gridY = screenY - screenX;
  const length = Math.hypot(gridX, gridY);

  if (length === 0) {
    return { ...DEFINING_WORLD_PLAZA_MOVEMENT_DIRECTION_IDLE };
  }

  return {
    x: gridX / length,
    y: gridY / length,
  };
}
