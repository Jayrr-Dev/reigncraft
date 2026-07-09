/**
 * Display tuning for the world boot loading screen progress visuals.
 *
 * @module components/world/loading/domains/definingWorldPlazaWorldLoadingProgressDisplayConstants
 */

/**
 * Exponential smoothing rate (per second) for the displayed load percent.
 *
 * Pipeline progress arrives in discrete step jumps; the map marker and bar
 * ease toward each target so the expedition trail never snaps.
 */
export const DEFINING_WORLD_PLAZA_WORLD_LOADING_PROGRESS_SMOOTHING_RATE_PER_SECOND = 4.5;

/**
 * When the smoothed percent is this close to the target, snap the rest of the
 * way so the bar can settle on exact step boundaries.
 */
export const DEFINING_WORLD_PLAZA_WORLD_LOADING_PROGRESS_SMOOTHING_SNAP_EPSILON = 0.08;
