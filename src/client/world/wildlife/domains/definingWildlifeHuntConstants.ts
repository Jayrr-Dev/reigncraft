/**
 * Hunting and ground-food foraging distance constants.
 *
 * @module components/world/wildlife/domains/definingWildlifeHuntConstants
 */

import { DEFINING_WILDLIFE_DIFFICULTY_LEVERS } from '@/components/world/wildlife/domains/definingWildlifeDifficultyLevers';

const DEFINING_WILDLIFE_PREY_HUNT_RADIUS_GRID_BASE = 14;

/** Max grid distance to notice huntable wildlife prey. */
export const DEFINING_WILDLIFE_PREY_HUNT_RADIUS_GRID =
  DEFINING_WILDLIFE_PREY_HUNT_RADIUS_GRID_BASE *
  DEFINING_WILDLIFE_DIFFICULTY_LEVERS.preyHuntRadiusMultiplier;

/** Grid distance at which predators immediately engage nearby prey. */
export const DEFINING_WILDLIFE_PREY_PROXIMITY_ATTACK_RADIUS_GRID = 6;

/** Max grid distance to smell edible ground food. */
export const DEFINING_WILDLIFE_GROUND_FOOD_SCENT_RADIUS_GRID = 12;

/** Threat per second applied when prey is spotted while motivated to hunt. */
export const DEFINING_WILDLIFE_PREY_SCENT_THREAT_PER_SECOND = 0.75;

/** Minimum time an animal chews before one ground-food unit is consumed. */
export const DEFINING_WILDLIFE_GROUND_FOOD_BITE_DELAY_MIN_MS = 5_000;

/** Maximum time an animal chews before one ground-food unit is consumed. */
export const DEFINING_WILDLIFE_GROUND_FOOD_BITE_DELAY_MAX_MS = 10_000;
