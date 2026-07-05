/**
 * Tree chopping balance and interaction constants.
 *
 * @module components/world/harvest/domains/definingWorldPlazaTreeChopConstants
 */

/** Wood granted per world layer removed from a tree. */
export const DEFINING_WORLD_PLAZA_TREE_CHOP_WOOD_PER_LAYER = 2;

/** Visual layers removed per completed chop swing. */
export const DEFINING_WORLD_PLAZA_TREE_CHOP_LAYERS_PER_SWING = 3;

/** Base swing duration before layer scaling (ms). */
export const DEFINING_WORLD_PLAZA_TREE_CHOP_BASE_DURATION_MS = 500;

/** Extra ms per remaining choppable layer (taller trees take longer). */
export const DEFINING_WORLD_PLAZA_TREE_CHOP_DURATION_PER_REMAINING_LAYER_MS = 75;

/** Max Chebyshev distance from player to tree tile center. */
export const DEFINING_WORLD_PLAZA_TREE_CHOP_PLAYER_RANGE_TILES = 2;

/** Forgiving pointer hit radius around tree trunk tile (tiles). */
export const DEFINING_WORLD_PLAZA_TREE_CHOP_POINTER_HIT_RADIUS_TILES = 0.85;

/** localStorage key prefix for chopped tree state. */
export const DEFINING_WORLD_PLAZA_CHOPPED_TREES_LOCAL_STORAGE_KEY_PREFIX =
  'world-plaza-chopped-trees' as const;

/** Stump trunk height in screen pixels before tree scale. */
export const DEFINING_WORLD_PLAZA_TREE_STUMP_HEIGHT_PX = 14;

/** Stump trunk width multiplier relative to the variant trunk width. */
export const DEFINING_WORLD_PLAZA_TREE_STUMP_WIDTH_MULTIPLIER = 1.35;
