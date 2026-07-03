import {
  DEFINING_WORLD_PLAZA_ICE_SLIDE_ACCELERATION_PER_SECOND,
  DEFINING_WORLD_PLAZA_ICE_SLIDE_FRICTION_PER_SECOND,
  DEFINING_WORLD_PLAZA_ICE_SLIDE_MIN_SPEED_GRID_PER_SECOND,
  DEFINING_WORLD_PLAZA_ICE_SLIDE_RUN_ANIMATION_MIN_SCALE,
} from "@/components/world/domains/definingWorldPlazaIceSlideConstants";

/**
 * Ice run momentum and post-stop slide integration.
 *
 * @module components/world/domains/computingWorldPlazaIceSlideVelocity
 */

/** Grid-space velocity in grid units per second. */
export interface DefiningWorldPlazaIceSlideVelocity {
  x: number;
  y: number;
}

/**
 * Updates ice velocity toward input while running, or decays it while sliding.
 *
 * Pass a target velocity while the player is running on ice. Pass `null` after
 * input stops so friction carries them forward a short distance.
 *
 * @param currentVelocity - Velocity carried into this tick.
 * @param targetVelocity - Commanded run velocity, or null when coasting.
 * @param deltaSeconds - Elapsed time for this tick (seconds).
 */
export function computingWorldPlazaIceSlideVelocity(
  currentVelocity: DefiningWorldPlazaIceSlideVelocity,
  targetVelocity: DefiningWorldPlazaIceSlideVelocity | null,
  deltaSeconds: number,
): DefiningWorldPlazaIceSlideVelocity {
  if (targetVelocity) {
    const blend = Math.min(
      1,
      DEFINING_WORLD_PLAZA_ICE_SLIDE_ACCELERATION_PER_SECOND * deltaSeconds,
    );

    return {
      x: currentVelocity.x + (targetVelocity.x - currentVelocity.x) * blend,
      y: currentVelocity.y + (targetVelocity.y - currentVelocity.y) * blend,
    };
  }

  const decay = Math.max(
    0,
    1 - DEFINING_WORLD_PLAZA_ICE_SLIDE_FRICTION_PER_SECOND * deltaSeconds,
  );

  return {
    x: currentVelocity.x * decay,
    y: currentVelocity.y * decay,
  };
}

/**
 * Returns the slide speed magnitude (grid units per second).
 *
 * @param velocity - Grid-space slide velocity.
 */
export function resolvingWorldPlazaIceSlideSpeedGridPerSecond(
  velocity: DefiningWorldPlazaIceSlideVelocity,
): number {
  return Math.hypot(velocity.x, velocity.y);
}

/**
 * Returns true when the slide has decayed below the settle threshold.
 *
 * @param velocity - Grid-space slide velocity.
 */
export function checkingWorldPlazaIceSlideVelocityIsNegligible(
  velocity: DefiningWorldPlazaIceSlideVelocity,
): boolean {
  return (
    resolvingWorldPlazaIceSlideSpeedGridPerSecond(velocity) <
    DEFINING_WORLD_PLAZA_ICE_SLIDE_MIN_SPEED_GRID_PER_SECOND
  );
}

/**
 * Scales run animation speed to match actual ice momentum so feet do not outrun movement.
 *
 * @param currentVelocity - Live ice velocity this tick.
 * @param targetVelocity - Commanded run velocity from input.
 */
export function resolvingWorldPlazaIceRunAnimationSpeedScale(
  currentVelocity: DefiningWorldPlazaIceSlideVelocity,
  targetVelocity: DefiningWorldPlazaIceSlideVelocity,
): number {
  const currentSpeed = resolvingWorldPlazaIceSlideSpeedGridPerSecond(currentVelocity);
  const targetSpeed = resolvingWorldPlazaIceSlideSpeedGridPerSecond(targetVelocity);

  if (targetSpeed <= 0) {
    return 1;
  }

  return Math.max(
    DEFINING_WORLD_PLAZA_ICE_SLIDE_RUN_ANIMATION_MIN_SCALE,
    Math.min(1, currentSpeed / targetSpeed),
  );
}
