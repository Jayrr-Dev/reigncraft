/**
 * Mushroom forage balance: pick channel, hit range, spawn density.
 *
 * @module components/world/mushrooms/domains/definingWorldPlazaMushroomConstants
 */

/** Shortest mushroom pick channel (ms). */
export const DEFINING_WORLD_PLAZA_MUSHROOM_PICK_DURATION_MIN_MS = 700;

/** Longest mushroom pick channel (ms). */
export const DEFINING_WORLD_PLAZA_MUSHROOM_PICK_DURATION_MAX_MS = 950;

/** Max Chebyshev distance from player to mushroom tile center. */
export const DEFINING_WORLD_PLAZA_MUSHROOM_PICK_PLAYER_RANGE_TILES = 2;

/** Minimum pointer hit radius around the mushroom tile center (tiles). */
export const DEFINING_WORLD_PLAZA_MUSHROOM_PICK_POINTER_HIT_RADIUS_TILES = 0.55;

/** Tile radius scanned around the pointer when resolving a mushroom pick click. */
export const DEFINING_WORLD_PLAZA_MUSHROOM_PICK_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES = 2;

/** localStorage key prefix for picked mushroom state. */
export const DEFINING_WORLD_PLAZA_PICKED_MUSHROOMS_LOCAL_STORAGE_KEY_PREFIX =
  'world-plaza-picked-mushrooms' as const;

/** Seed salt for placement density. */
export const DEFINING_WORLD_PLAZA_MUSHROOM_PLACEMENT_SEED_SALT = 2711;

/** Seed salt for species pick among eligible. */
export const DEFINING_WORLD_PLAZA_MUSHROOM_SPECIES_SEED_SALT = 2712;

/**
 * Higher = rarer. One in N hash buckets may host a mushroom when biome+schedule match.
 */
export const DEFINING_WORLD_PLAZA_MUSHROOM_TILE_MODULUS = 47;

/** World sprite display scale vs isometric tile width. */
export const DEFINING_WORLD_PLAZA_MUSHROOM_DISPLAY_SCALE = 0.42;

/** Default campfire cook duration for mushrooms (ms). */
export const DEFINING_WORLD_PLAZA_MUSHROOM_COOK_DURATION_MS = 2_200;

/** Quantity granted per successful pick. */
export const DEFINING_WORLD_PLAZA_MUSHROOM_PICK_QUANTITY = 1;

/** Dawn band around sunrise (cycle phase 0..1). */
export const DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAWN_MIN = 0.14;
export const DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAWN_MAX = 0.3;

/** Day band (sun up). */
export const DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAY_MIN = 0.2;
export const DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAY_MAX = 0.82;

/** Mid-day heat band for Devil’s Bolete. */
export const DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_MIDDAY_MIN = 0.38;
export const DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_MIDDAY_MAX = 0.62;

/** Dawn through mid-day (morels). */
export const DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAWN_TO_MIDDAY_MIN = 0.14;
export const DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAWN_TO_MIDDAY_MAX = 0.52;

/** Dusk band around sunset. */
export const DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DUSK_MIN = 0.74;
export const DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DUSK_MAX = 0.9;

/** Dawn or dusk (angel button). */
export const DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_TWILIGHT_MIN_A = 0.14;
export const DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_TWILIGHT_MAX_A = 0.3;
export const DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_TWILIGHT_MIN_B = 0.74;
export const DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_TWILIGHT_MAX_B = 0.9;

/** Night / dawn for ghost wing (after sunset through dawn). */
export const DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_NIGHT_DAWN_MIN = 0.82;
export const DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_NIGHT_DAWN_MAX = 0.3;
