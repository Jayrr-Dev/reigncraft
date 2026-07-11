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

/** Minimum pointer hit radius around the trunk foot (tiles). */
export const DEFINING_WORLD_PLAZA_TREE_CHOP_POINTER_HIT_RADIUS_TILES = 0.85;

/** Extra screen pixels padded around the drawn trunk silhouette before tree scale. */
export const DEFINING_WORLD_PLAZA_TREE_CHOP_TRUNK_POINTER_HIT_PADDING_PX = 8;

/**
 * Scales the painted canopy footprint for chop clicks so the whole crown is
 * tappable, with a little padding beyond the drawn foliage edge.
 */
export const DEFINING_WORLD_PLAZA_TREE_CHOP_CANOPY_POINTER_HIT_RADIUS_MULTIPLIER = 1.08;

/** Tile radius scanned around the pointer when resolving a tree chop click. */
export const DEFINING_WORLD_PLAZA_TREE_CHOP_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES = 3;

/** Extra tiles scanned around the player so trunk clicks still resolve nearby trees. */
export const DEFINING_WORLD_PLAZA_TREE_CHOP_PLAYER_CANDIDATE_TILE_SEARCH_EXTRA_TILES = 2;

/** localStorage key prefix for chopped tree state. */
export const DEFINING_WORLD_PLAZA_CHOPPED_TREES_LOCAL_STORAGE_KEY_PREFIX =
  'world-plaza-chopped-trees' as const;

/** Stump trunk height in screen pixels before tree scale. */
export const DEFINING_WORLD_PLAZA_TREE_STUMP_HEIGHT_PX = 14;

/** Stump trunk width multiplier relative to the variant trunk width. */
export const DEFINING_WORLD_PLAZA_TREE_STUMP_WIDTH_MULTIPLIER = 0.85;
