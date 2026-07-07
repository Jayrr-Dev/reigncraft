/**
 * Flee target sampling constants for walkable destination resolution.
 *
 * @module components/world/wildlife/domains/definingWildlifeFleeConstants
 */

/** Number of directions sampled when picking a walkable flee destination. */
export const DEFINING_WILDLIFE_FLEE_WALKABLE_CANDIDATE_DIRECTION_COUNT = 16;

/** Weight for aligning a flee leg with the away-from-threat heading. */
export const DEFINING_WILDLIFE_FLEE_WALKABLE_DESIRE_ALIGNMENT_WEIGHT = 2;

/** Weight for maximizing distance from the threat at the flee destination. */
export const DEFINING_WILDLIFE_FLEE_WALKABLE_THREAT_DISTANCE_WEIGHT = 0.15;

/** Shortest flee leg considered when the full distance has no walkable tile. */
export const DEFINING_WILDLIFE_FLEE_WALKABLE_MIN_DISTANCE_GRID = 1;

/** Step size when shortening an unreachable flee leg. */
export const DEFINING_WILDLIFE_FLEE_WALKABLE_DISTANCE_STEP_GRID = 1;

/** One-step probe for whether a locked flee heading is still walkable. */
export const DEFINING_WILDLIFE_FLEE_REACHABILITY_STEP_GRID = 0.5;
