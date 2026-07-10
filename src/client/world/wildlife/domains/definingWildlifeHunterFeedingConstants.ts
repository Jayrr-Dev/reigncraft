/**
 * Hunter post-kill feeding duration and tuning.
 *
 * @module components/world/wildlife/domains/definingWildlifeHunterFeedingConstants
 */

/** How long a predator stays locked on a kill-meat meal (ms). */
export const DEFINING_WILDLIFE_HUNTER_KILL_FEEDING_DURATION_MS = 10_000;

/**
 * Chance the hunter locks onto the kill meal instead of hunting again.
 * Fail = meat still drops; hunter clears the dead target and seeks new prey.
 */
export const DEFINING_WILDLIFE_HUNTER_KILL_FEED_CHANCE = 0.5;
