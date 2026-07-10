/**
 * Wildlife footstep SFX tuning for FilmCow locomotion clips.
 *
 * @module components/world/wildlife/domains/definingWildlifeFootstepSfxConstants
 */

/** When false, only the player avatar emits footstep one-shots. */
export const DEFINING_WILDLIFE_FOOTSTEP_SFX_ENABLED = true;

/** How often wildlife footstep SFX scans moving instances (ms). */
export const DEFINING_WILDLIFE_FOOTSTEP_POLL_INTERVAL_MS = 80;

/** Grid distance where wildlife footstep SFX play at full event volume. */
export const DEFINING_WILDLIFE_FOOTSTEP_FULL_VOLUME_DISTANCE_GRID = 3;

/** Grid distance where wildlife footstep SFX are inaudible. */
export const DEFINING_WILDLIFE_FOOTSTEP_MAX_AUDIBLE_DISTANCE_GRID = 14;

/**
 * Wildlife falloff exponent. Squared keeps distant herds readable without
 * matching the tighter player footstep curve.
 */
export const DEFINING_WILDLIFE_FOOTSTEP_DISTANCE_FALLOFF_EXPONENT = 2;

/** Base walk cadence before size and speed scaling (ms). */
export const DEFINING_WILDLIFE_FOOTSTEP_BASE_WALK_INTERVAL_MS = 680;

/** Base run cadence before size and speed scaling (ms). */
export const DEFINING_WILDLIFE_FOOTSTEP_BASE_RUN_INTERVAL_MS = 390;

/** Larger animals take longer between steps. */
export const DEFINING_WILDLIFE_FOOTSTEP_INTERVAL_VISUAL_SIZE_EXPONENT = 0.38;

/** Reference walk speed used to scale cadence (grid/s). */
export const DEFINING_WILDLIFE_FOOTSTEP_REFERENCE_WALK_SPEED_GRID_PER_SECOND = 1.5;

/** Cap simultaneous wildlife footstep one-shots per poll tick. */
export const DEFINING_WILDLIFE_FOOTSTEP_MAX_STEPS_PER_TICK = 4;

/** Minimum interval between two steps from the same instance (ms). */
export const DEFINING_WILDLIFE_FOOTSTEP_MIN_INSTANCE_INTERVAL_MS = 220;

/** Minimum body speed to count as walking for SFX (grid/s). */
export const DEFINING_WILDLIFE_FOOTSTEP_MIN_MOVEMENT_SPEED_GRID_PER_SECOND = 0.25;
