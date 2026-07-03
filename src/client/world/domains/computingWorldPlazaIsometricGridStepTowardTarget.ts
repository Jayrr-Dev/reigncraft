import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import { DEFINING_WORLD_PLAZA_CLICK_MOVEMENT_ARRIVAL_THRESHOLD_PX } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";
import { computingWorldPlazaIsometricGridDeltaFromScreenDirection } from "@/components/world/domains/computingWorldPlazaIsometricGridDeltaFromScreenDirection";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";

/** Result of one click-walk simulation step. */
export interface ComputingWorldPlazaIsometricGridStepTowardTargetResult {
  nextPosition: DefiningWorldPlazaWorldPoint;
  arrived: boolean;
}

/**
 * Advances the avatar one frame toward a click target with uniform screen speed.
 *
 * @param currentPosition - Avatar grid position.
 * @param targetPosition - Click destination in grid space.
 * @param screenSpeedPerSecond - Walk speed in screen pixels per second.
 * @param deltaSeconds - Frame delta in seconds.
 */
export function computingWorldPlazaIsometricGridStepTowardTarget(
  currentPosition: DefiningWorldPlazaWorldPoint,
  targetPosition: DefiningWorldPlazaWorldPoint,
  screenSpeedPerSecond: number,
  deltaSeconds: number,
): ComputingWorldPlazaIsometricGridStepTowardTargetResult {
  const currentScreenPoint =
    convertingWorldPlazaGridPointToIsometricScreenPoint(currentPosition);
  const targetScreenPoint =
    convertingWorldPlazaGridPointToIsometricScreenPoint(targetPosition);

  const screenDeltaX = targetScreenPoint.x - currentScreenPoint.x;
  const screenDeltaY = targetScreenPoint.y - currentScreenPoint.y;
  const remainingScreenDistance = Math.hypot(screenDeltaX, screenDeltaY);
  const maxScreenStep = screenSpeedPerSecond * deltaSeconds;

  if (
    remainingScreenDistance <= maxScreenStep ||
    remainingScreenDistance <=
      DEFINING_WORLD_PLAZA_CLICK_MOVEMENT_ARRIVAL_THRESHOLD_PX
  ) {
    return {
      nextPosition: {
        x: targetPosition.x,
        y: targetPosition.y,
      },
      arrived: true,
    };
  }

  const screenDirection = {
    x: screenDeltaX / remainingScreenDistance,
    y: screenDeltaY / remainingScreenDistance,
  };
  const gridDelta = computingWorldPlazaIsometricGridDeltaFromScreenDirection(
    screenDirection,
    screenSpeedPerSecond,
    deltaSeconds,
  );

  return {
    nextPosition: {
      x: currentPosition.x + gridDelta.x,
      y: currentPosition.y + gridDelta.y,
    },
    arrived: false,
  };
}
