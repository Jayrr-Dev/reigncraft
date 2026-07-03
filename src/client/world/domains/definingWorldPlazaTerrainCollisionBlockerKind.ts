/**
 * Blocker kinds reported by plaza movement collision debug.
 *
 * @module components/world/domains/definingWorldPlazaTerrainCollisionBlockerKind
 */

/** Identifies which collision system stopped movement. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND = {
  PLACED_BLOCK: "placed_block",
  COLUMN_ROCK_DIAMOND: "column_rock_diamond",
  TERRAIN_ELEVATION: "terrain_elevation",
  TERRAIN_TILE_BLOCK: "terrain_tile_block",
  TERRAIN_TILE_JUMP_OVER: "terrain_tile_jump_over",
  TREE_CIRCLE: "tree_circle",
  PEBBLE_ROCK_CIRCLE: "pebble_rock_circle",
} as const;

/** One entry from {@link DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND}. */
export type DefiningWorldPlazaTerrainCollisionBlockerKind =
  (typeof DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND)[keyof typeof DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND];

/** Human-readable label for each blocker kind. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND_LABEL: Readonly<
  Record<DefiningWorldPlazaTerrainCollisionBlockerKind, string>
> = {
  [DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.PLACED_BLOCK]:
    "Placed block",
  [DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.COLUMN_ROCK_DIAMOND]:
    "Column rock diamond",
  [DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.TERRAIN_ELEVATION]:
    "Terrain elevation",
  [DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.TERRAIN_TILE_BLOCK]:
    "Tile block",
  [DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.TERRAIN_TILE_JUMP_OVER]:
    "Jump-over tile",
  [DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.TREE_CIRCLE]:
    "Tree collider",
  [DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.PEBBLE_ROCK_CIRCLE]:
    "Pebble rock circle",
};
