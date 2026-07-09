import {
  WORLD_ROCK_MINE_LAYERS_PER_SWING,
  WORLD_ROCK_MINE_PLAYER_RANGE_TILES,
  WORLD_ROCK_MINE_STONE_PER_LAYER,
} from '../../../../../shared/worldRockMine';

/**
 * Rock mining balance and interaction constants.
 *
 * @module components/world/harvest/domains/definingWorldPlazaRockMineConstants
 */

/** Stone granted per world layer removed from a boulder. */
export const DEFINING_WORLD_PLAZA_ROCK_MINE_STONE_PER_LAYER =
  WORLD_ROCK_MINE_STONE_PER_LAYER;

/** Visual layers removed per completed mine swing. */
export const DEFINING_WORLD_PLAZA_ROCK_MINE_LAYERS_PER_SWING =
  WORLD_ROCK_MINE_LAYERS_PER_SWING;

/** Max Chebyshev distance from player to boulder footprint center. */
export const DEFINING_WORLD_PLAZA_ROCK_MINE_PLAYER_RANGE_TILES =
  WORLD_ROCK_MINE_PLAYER_RANGE_TILES;

/** Minimum pointer hit radius around the boulder footprint center (tiles). */
export const DEFINING_WORLD_PLAZA_ROCK_MINE_POINTER_HIT_RADIUS_TILES = 0.85;

/** Tile radius scanned around the pointer when resolving a rock mine click. */
export const DEFINING_WORLD_PLAZA_ROCK_MINE_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES = 4;

/** Extra tiles scanned around the player so nearby boulder clicks still resolve. */
export const DEFINING_WORLD_PLAZA_ROCK_MINE_PLAYER_CANDIDATE_TILE_SEARCH_EXTRA_TILES = 2;

/** localStorage key prefix for mined rock state. */
export const DEFINING_WORLD_PLAZA_MINED_ROCKS_LOCAL_STORAGE_KEY_PREFIX =
  'world-plaza-mined-rocks' as const;
