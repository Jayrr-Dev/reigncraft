/**
 * Terrain obstacle kinds for plaza movement and collision.
 *
 * @module components/world/domains/definingWorldPlazaTerrainObstacleConstants
 */

/** No movement restriction. */
export const DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_PASSABLE = "passable" as const;

/** Blocks walking; avatars can clear it with a jump. */
export const DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER =
  "jumpOver" as const;

/** Blocks walking and jumping through. */
export const DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK = "block" as const;

/** Movement rule applied to one terrain feature. */
export type DefiningWorldPlazaTerrainObstacleKind =
  | typeof DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_PASSABLE
  | typeof DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER
  | typeof DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK;

/** Stone size tier index for medium rocks that require a jump. */
export const DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_SIZE_TIER_INDEX = 2;

/** Stone size tier index for large boulders that fully block movement. */
export const DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_SIZE_TIER_INDEX = 3;

/** Circular collision radius for medium rocks (grid tiles). */
export const DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_COLLISION_RADIUS_GRID = 0.42;

/** Circular collision radius for large rocks (grid tiles). */
export const DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_COLLISION_RADIUS_GRID = 0.58;

/** Tile rings scanned around the avatar for terrain collision. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_SEARCH_TILE_RADIUS = 1;

/** Jump progress below which landing collision still applies. */
export const DEFINING_WORLD_PLAZA_TERRAIN_JUMP_BLOCK_COLLISION_START_PROGRESS = 0.12;

/** Jump progress above which landing collision applies again before touch-down. */
export const DEFINING_WORLD_PLAZA_TERRAIN_JUMP_BLOCK_COLLISION_END_PROGRESS = 0.88;

/** Grid offset past a tile edge when ejecting an avatar from a blocked cell. */
export const DEFINING_WORLD_PLAZA_TERRAIN_TILE_EDGE_EXIT_EPSILON = 0.04;

/** Max tile-cell ejections per frame when chaining through narrow water strips. */
export const DEFINING_WORLD_PLAZA_TERRAIN_TILE_OCCUPANCY_MAX_EJECTIONS = 8;

/**
 * Binary-search steps used to clamp movement at a blocked tile's visible edge.
 * 24 steps resolve the stop point to well below one screen pixel.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_TILE_CLAMP_BINARY_SEARCH_STEPS = 24;
