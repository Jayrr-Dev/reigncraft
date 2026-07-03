/**
 * Tuning for collision blocker-hit debug feedback.
 *
 * @module components/world/domains/definingWorldPlazaTerrainCollisionBlockerHitDebugConstants
 */

/** Minimum attempted movement before a hit is recorded (grid tiles). */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MIN_ATTEMPTED_GRID =
  1e-4;

/** Movement shorter than this fraction of the attempt counts as fully blocked. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MOVEMENT_REDUCTION_EPSILON_GRID =
  1e-4;

/** How long the on-screen hit marker and label stay visible (ms). */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_DISPLAY_DURATION_MS =
  4000;

/** Poll interval for the DOM blocker-hit label (ms). */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_LABEL_REFRESH_INTERVAL_MS =
  100;

/** Screen-space marker radius at the stop point (pixels). */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MARKER_RADIUS_PX = 10;

/** Marker outline color for the most recent blocker hit. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MARKER_STROKE_COLOR =
  0xff2244;

/** Marker fill color for the most recent blocker hit. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MARKER_FILL_COLOR =
  0xff2244;

/** Marker fill opacity. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MARKER_FILL_ALPHA = 0.35;

/** Marker stroke width (pixels). */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MARKER_STROKE_WIDTH_PX =
  2;

/** DOM label classes for the blocker-hit readout. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_LABEL_CLASS_NAME =
  "pointer-events-none rounded-md border border-rose-300/60 bg-black/70 px-2 py-1 text-[10px] font-semibold leading-snug text-rose-100" as const;

/** Prefix shown before the blocker kind in the DOM label. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_LABEL_PREFIX =
  "Blocker" as const;
