/**
 * Hysteresis tuning for behavior tree decisions.
 *
 * Entry and exit thresholds are deliberately different so animals commit to a
 * decision instead of flip-flopping at the boundary (flee/wander loops, leash
 * ping-pong).
 *
 * @module components/world/wildlife/domains/definingWildlifeBehaviorHysteresisConstants
 */

/** Fraction of the aggro radius at which a startled flee begins. */
export const DEFINING_WILDLIFE_FLEE_ENTRY_RADIUS_MULTIPLIER = 0.75;

/**
 * Multiplier on the flee entry radius that an in-progress flee must clear
 * before the animal calms down. Keeps fleeing committed even when the player
 * briefly stops sprinting.
 */
export const DEFINING_WILDLIFE_FLEE_EXIT_RADIUS_MULTIPLIER = 1.6;

/** Reaching within this distance of a locked flee target counts as arrived. */
export const DEFINING_WILDLIFE_FLEE_TARGET_ARRIVAL_RADIUS_GRID = 0.5;

/**
 * Once an animal starts returning to its leash anchor it keeps returning
 * until it is within this fraction of the leash distance, instead of
 * re-engaging the moment it steps back inside the boundary.
 */
export const DEFINING_WILDLIFE_LEASH_RETURN_EXIT_FRACTION = 0.5;
