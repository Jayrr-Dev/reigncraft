/**
 * Shared distance falloff tuning for plaza footstep one-shots.
 *
 * @module components/world/footsteps/domains/definingPlazaFootstepFalloffConstants
 */

/** Grid distance where footstep SFX plays at full event volume. */
export const DEFINING_PLAZA_FOOTSTEP_DISTANCE_FULL_VOLUME_GRID = 1.5;

/** Grid distance where footstep SFX is inaudible. */
export const DEFINING_PLAZA_FOOTSTEP_DISTANCE_MAX_AUDIBLE_GRID = 10;

/**
 * Exponent applied after linear falloff normalization.
 * Cubic keeps nearby steps readable while distant steps drop off faster.
 */
export const DEFINING_PLAZA_FOOTSTEP_DISTANCE_FALLOFF_EXPONENT = 3;
