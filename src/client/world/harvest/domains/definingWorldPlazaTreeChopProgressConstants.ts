/**
 * Chop progress UI and feedback timing.
 *
 * @module components/world/harvest/domains/definingWorldPlazaTreeChopProgressConstants
 */

/** Progress ratio where the mid-chop milestone fires. */
export const DEFINING_WORLD_PLAZA_TREE_CHOP_PROGRESS_MID_RATIO = 0.5;

/** How long a tree shake lasts after a chop milestone (ms). */
export const DEFINING_WORLD_PLAZA_TREE_CHOP_SHAKE_DURATION_MS = 280;

/** Peak horizontal shake amplitude in screen pixels. */
export const DEFINING_WORLD_PLAZA_TREE_CHOP_SHAKE_AMPLITUDE_PX = 5;

/** Diameter of the inline chop progress ring beside the Chop label (px). */
export const DEFINING_WORLD_PLAZA_TREE_CHOP_PROGRESS_RING_SIZE_PX = 22;

/** Gap between the progress ring and Chop label (px). */
export const DEFINING_WORLD_PLAZA_TREE_CHOP_PROGRESS_LABEL_GAP_PX = 5;

/** Stroke width for the inline chop progress ring (px). */
export const DEFINING_WORLD_PLAZA_TREE_CHOP_PROGRESS_RING_STROKE_PX = 2;

/** Fade-out duration when a chop is cancelled (ms). */
export const DEFINING_WORLD_PLAZA_TREE_CHOP_PROGRESS_CANCEL_FADE_MS = 200;
