/**
 * Normalized movement direction for plaza avatar input.
 *
 * @module components/world/domains/definingWorldPlazaMovementDirection
 */

/** Axis input for avatar movement (-1, 0, or 1 per axis before normalization). */
export interface DefiningWorldPlazaMovementDirection {
  x: number;
  y: number;
}

/** Idle movement direction (no input). */
export const DEFINING_WORLD_PLAZA_MOVEMENT_DIRECTION_IDLE: DefiningWorldPlazaMovementDirection =
  {
    x: 0,
    y: 0,
  };

/**
 * Returns true when the direction vector has any non-zero component.
 *
 * @param direction - Normalized or raw direction.
 */
export function checkingWorldPlazaMovementDirectionIsActive(
  direction: DefiningWorldPlazaMovementDirection,
): boolean {
  return direction.x !== 0 || direction.y !== 0;
}
