/**
 * Dev-only wildlife spawn tuning.
 *
 * @module components/world/wildlife/domains/definingWildlifeDevSpawnConstants
 */

/** Grid radius around the player where dev chickens appear. */
export const DEFINING_WILDLIFE_DEV_AGGRESSIVE_CHICKEN_SPAWN_RADIUS_GRID = 2.5;

/** Default count for the single-chicken dev spawn button. */
export const DEFINING_WILDLIFE_DEV_AGGRESSIVE_CHICKEN_SINGLE_SPAWN_COUNT = 1;

/** Swarm size for the cucco-style dev spawn button. */
export const DEFINING_WILDLIFE_DEV_AGGRESSIVE_CHICKEN_SWARM_SPAWN_COUNT = 5;

/** Species id for dev grey wolf spawns. */
export const DEFINING_WILDLIFE_GREY_WOLF_SPECIES_ID = 'grey-wolf' as const;

/** Minimum grid distance from the player for a random dev wolf spawn. */
export const DEFINING_WILDLIFE_DEV_GREY_WOLF_SPAWN_RADIUS_MIN_GRID = 4;

/** Maximum grid distance from the player for a random dev wolf spawn. */
export const DEFINING_WILDLIFE_DEV_GREY_WOLF_SPAWN_RADIUS_MAX_GRID = 14;

/** Salt for seeded random wolf placement around the player. */
export const DEFINING_WILDLIFE_DEV_GREY_WOLF_RANDOM_PLACEMENT_SALT = 0x7a3f;
