/**
 * Plaza navigation tuning constants.
 *
 * @module components/world/navigation/domains/definingWorldPlazaNavigationConstants
 */

/** Max tile radius around start/goal for one A* search box. */
export const DEFINING_WORLD_PLAZA_NAVIGATION_SEARCH_RADIUS_GRID = 32;

/** Direct line counts as blocked when clamped target is this far from click goal. */
export const DEFINING_WORLD_PLAZA_NAVIGATION_DIRECT_PATH_BLOCKED_EPSILON_GRID = 0.35;

/** Line-of-sight raycast sample step on the navigation grid. */
export const DEFINING_WORLD_PLAZA_NAVIGATION_PATH_SMOOTHER_SAMPLE_STEP_GRID = 0.5;

/** Frames pushing into obstacle before replan triggers. */
export const DEFINING_WORLD_PLAZA_NAVIGATION_REPLAN_STUCK_FRAME_COUNT = 12;

/** Chebyshev tile radius around remaining path checked for placed-block changes. */
export const DEFINING_WORLD_PLAZA_NAVIGATION_REPLAN_BLOCK_CHANGE_RADIUS_TILES = 2;
