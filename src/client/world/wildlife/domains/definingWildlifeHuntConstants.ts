/**
 * Hunting and ground-food foraging distance constants.
 *
 * @module components/world/wildlife/domains/definingWildlifeHuntConstants
 */

/** Max grid distance to notice huntable wildlife prey. */
export const DEFINING_WILDLIFE_PREY_HUNT_RADIUS_GRID = 14;

/** Grid distance at which predators immediately engage nearby prey. */
export const DEFINING_WILDLIFE_PREY_PROXIMITY_ATTACK_RADIUS_GRID = 6;

/** Max grid distance to smell edible ground food. */
export const DEFINING_WILDLIFE_GROUND_FOOD_SCENT_RADIUS_GRID = 12;

/** Threat per second applied when prey is spotted while motivated to hunt. */
export const DEFINING_WILDLIFE_PREY_SCENT_THREAT_PER_SECOND = 0.75;
