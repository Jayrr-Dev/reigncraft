/**
 * AI and steering level-of-detail distance thresholds and intervals.
 *
 * @module components/world/wildlife/domains/definingWildlifeAiLodConstants
 */

/** Think interval for animals near the player (ms). */
export const DEFINING_WILDLIFE_AI_THINK_INTERVAL_NEAR_MS = 200;

/** Think interval for animals at mid range from the player (ms). */
export const DEFINING_WILDLIFE_AI_THINK_INTERVAL_MID_MS = 400;

/** Think interval for animals at the outer sim ring (ms). */
export const DEFINING_WILDLIFE_AI_THINK_INTERVAL_FAR_MS = 800;

/** Distance below which animals use the near think interval (grid units). */
export const DEFINING_WILDLIFE_AI_LOD_NEAR_RADIUS_GRID = 10;

/** Distance below which animals use the mid think interval (grid units). */
export const DEFINING_WILDLIFE_AI_LOD_MID_RADIUS_GRID = 20;

/** Distance below which animals use full context steering (grid units). */
export const DEFINING_WILDLIFE_STEERING_LOD_NEAR_RADIUS_GRID = 10;

/** Re-score steering direction at most this often (ms). */
export const DEFINING_WILDLIFE_STEERING_CACHE_MS = 100;

/** Spatial hash cell size for wildlife neighbor queries (grid units). */
export const DEFINING_WILDLIFE_SPATIAL_CELL_SIZE_GRID = 4;

/** Salt for seeding per-instance think offsets from spawn anchors. */
export const DEFINING_WILDLIFE_THINK_OFFSET_SALT = 881;

/**
 * Max full AI thinks (aggro scan, behavior tree, prey selection) per
 * simulation step.
 *
 * Think offsets stagger instances, but drift still lands several thinks on
 * the same frame, spiking wildlife-ai to 8ms+. Instances over budget keep
 * steering on their current intent and retry next step, since their
 * `lastThinkAtMs` stays stale. Proximity prey interrupts bypass the budget so
 * combat stays responsive.
 */
export const DEFINING_WILDLIFE_AI_THINK_BUDGET_PER_STEP = 3;

/**
 * Resolves the AI think interval from distance to the player.
 */
export function resolvingWildlifeThinkIntervalMs(
  distanceToPlayerGrid: number
): number {
  if (distanceToPlayerGrid < DEFINING_WILDLIFE_AI_LOD_NEAR_RADIUS_GRID) {
    return DEFINING_WILDLIFE_AI_THINK_INTERVAL_NEAR_MS;
  }

  if (distanceToPlayerGrid <= DEFINING_WILDLIFE_AI_LOD_MID_RADIUS_GRID) {
    return DEFINING_WILDLIFE_AI_THINK_INTERVAL_MID_MS;
  }

  return DEFINING_WILDLIFE_AI_THINK_INTERVAL_FAR_MS;
}
