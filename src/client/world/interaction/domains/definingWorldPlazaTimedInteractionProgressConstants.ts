/**
 * Shared timed interaction progress UI and timing.
 *
 * @module components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressConstants
 */

/** Progress ratio where the mid-action milestone fires. */
export const DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_MID_RATIO = 0.5;

/** Diameter of the inline progress ring beside an action label (px). */
export const DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_RING_SIZE_PX = 22;

/** Gap between the progress ring and action label (px). */
export const DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_LABEL_GAP_PX = 5;

/** Stroke width for the inline progress ring (px). */
export const DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_RING_STROKE_PX = 2;

/** Fade-out duration when a timed interaction is cancelled (ms). */
export const DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_CANCEL_FADE_MS = 200;

/** Delay before clearing the ring after a successful completion (ms). */
export const DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_COMPLETION_RESET_MS = 120;
