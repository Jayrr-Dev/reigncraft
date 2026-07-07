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

/**
 * Center distance below which threat and prey are treated as body-overlapping.
 * Used to trigger overlap escape nudges, not to discard the away vector.
 */
export const DEFINING_WILDLIFE_FLEE_THREAT_OVERLAP_EPSILON_GRID = 0.65;

/**
 * Center distance below which threat and prey are effectively coincident.
 * Only then do we fall back to a seeded escape bearing.
 */
export const DEFINING_WILDLIFE_FLEE_THREAT_COINCIDENT_EPSILON_GRID = 0.08;

/** Flee legs shorter than this are invalid (prevents flee-to-self freeze). */
export const DEFINING_WILDLIFE_FLEE_MIN_LEG_DISTANCE_GRID = 0.35;
