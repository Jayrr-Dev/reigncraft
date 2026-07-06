/**
 * Wildlife circle collision constants.
 *
 * @module components/world/wildlife/domains/definingWildlifeCollisionConstants
 */

/** Extra gap between animal body circles so sprites do not visually overlap. */
export const DEFINING_WILDLIFE_INSTANCE_SEPARATION_GAP_GRID = 0.06;

/** Push-out passes per tick to resolve clusters of overlapping animals. */
export const DEFINING_WILDLIFE_INSTANCE_SEPARATION_PASS_COUNT = 2;

/** Max combined collision radius used for neighbor queries during separation. */
export const DEFINING_WILDLIFE_INSTANCE_SEPARATION_QUERY_RADIUS_GRID = 1.5;

/** How long player contact keeps prey animals fleeing (ms). */
export const DEFINING_WILDLIFE_PLAYER_COLLISION_STARTLE_DURATION_MS = 2_000;

/** Flee target distance away from the player after a bump (grid units). */
export const DEFINING_WILDLIFE_PLAYER_COLLISION_FLEE_DISTANCE_GRID = 6;
