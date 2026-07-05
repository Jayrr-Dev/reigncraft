/**
 * Tree chopping balance and interaction constants.
 *
 * @module components/world/harvest/domains/definingWorldPlazaTreeChopConstants
 */

/** Wood granted per world layer removed from a tree. */
export const DEFINING_WORLD_PLAZA_TREE_CHOP_WOOD_PER_LAYER = 5;

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
