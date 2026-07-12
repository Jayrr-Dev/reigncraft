/**
 * Boulder cover tuning for wildlife sight and chase break.
 *
 * Hiding behind a mega-boulder (column rock) cuts on-sight threat build. When
 * already chased, the same cover plus enough distance drops player aggro so the
 * animal gives up instead of pathing forever around the rock.
 *
 * @module components/world/wildlife/domains/definingWildlifeBoulderCoverConstants
 */

/**
 * Multiplier on proximity threat while the player is occluded by a boulder.
 *
 * Values below 1 slow detection; 0 would fully hide until the animal walks
 * around and clears the sight line.
 */
export const DEFINING_WILDLIFE_BOULDER_COVER_DETECTION_THREAT_MULTIPLIER = 0.2;

/**
 * Minimum animal-to-player distance (grid) before cover breaks an active chase.
 *
 * Close-range ducking around a rock does not instantly clear threat; the player
 * must put space between themselves and the hunter while staying occluded.
 */
export const DEFINING_WILDLIFE_BOULDER_COVER_CHASE_BREAK_DISTANCE_GRID = 7;

/** Grid step when sampling the sight line through boulder diamonds. */
export const DEFINING_WILDLIFE_BOULDER_COVER_SIGHT_SAMPLE_STEP_GRID = 0.35;
