/**
 * Clamp bounds for player run-clip fps scaling vs body speed.
 *
 * @module components/world/domains/definingWorldPlazaRunAnimationSpeedScaleConstants
 */

/** Floor so near-walk burst / exhaustion still shows a readable stride. */
export const DEFINING_WORLD_PLAZA_RUN_ANIMATION_SPEED_SCALE_MIN = 0.35;

/** Cap so buffs / ice overshoot do not smear the run strip. */
export const DEFINING_WORLD_PLAZA_RUN_ANIMATION_SPEED_SCALE_MAX = 1.25;
