/**
 * Zelda-style cucco buffs for aggressive chicken spawns.
 *
 * @module components/world/wildlife/domains/definingWildlifeAggressiveChickenConstants
 */

/** Species id that can roll the cucco treatment. */
export const DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_SPECIES_ID = 'chicken';

/** Render scale multiplier vs a normal chicken of the same species. */
export const DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_SIZE_SCALE_MULTIPLIER = 2;

/** Multiplier on max/current health at spawn. */
export const DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_HEALTH_MULTIPLIER = 10;

/** Multiplier on melee damage after species tuning and charge bonuses. */
export const DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_ATTACK_POWER_MULTIPLIER = 100;

/** Multiplier on walk/run speed. */
export const DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_SPEED_MULTIPLIER = 2;

/**
 * Stamina endurance multiplier.
 * Drain is divided and regen is multiplied so the bird can chase longer.
 */
export const DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_STAMINA_MULTIPLIER = 4;
