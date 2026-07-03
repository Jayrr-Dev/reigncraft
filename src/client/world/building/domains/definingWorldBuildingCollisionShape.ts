import {
  DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK,
  DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER,
  DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_PASSABLE,
  type DefiningWorldPlazaTerrainObstacleKind,
} from "@/components/world/domains/definingWorldPlazaTerrainObstacleConstants";

/**
 * Collision shapes for lightweight building blocks.
 *
 * @module components/world/building/domains/definingWorldBuildingCollisionShape
 */

/** No physical collider. */
export const DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_NONE = "none" as const;

/** Full isometric tile diamond occupancy. */
export const DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_TILE = "tile" as const;

/** Circular collider centered on the tile anchor. */
export const DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_CIRCLE =
  "circle" as const;

/** Supported collider geometry kinds. */
export type DefiningWorldBuildingCollisionShapeKind =
  | typeof DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_NONE
  | typeof DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_TILE
  | typeof DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_CIRCLE;

/** Serializable collider definition stored on block definitions. */
export interface DefiningWorldBuildingCollisionShape {
  readonly kind: DefiningWorldBuildingCollisionShapeKind;
  /** Grid-space radius when {@link kind} is circle. */
  readonly radiusGrid?: number;
  /** Movement rule when the collider is active. */
  readonly obstacleKind: DefiningWorldPlazaTerrainObstacleKind;
}

/** Pass-through collider with no movement restriction. */
export const DEFINING_WORLD_BUILDING_COLLISION_SHAPE_PASSABLE: DefiningWorldBuildingCollisionShape =
  {
    kind: DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_NONE,
    obstacleKind: DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_PASSABLE,
  };

/** Tile collider that fully blocks movement. */
export const DEFINING_WORLD_BUILDING_COLLISION_SHAPE_TILE_BLOCK: DefiningWorldBuildingCollisionShape =
  {
    kind: DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_TILE,
    obstacleKind: DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK,
  };

/** Tile collider that can be cleared with a jump. */
export const DEFINING_WORLD_BUILDING_COLLISION_SHAPE_TILE_JUMP_OVER: DefiningWorldBuildingCollisionShape =
  {
    kind: DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_TILE,
    obstacleKind: DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER,
  };

/**
 * Creates a circular collider centered on a tile.
 *
 * @param radiusGrid - Radius in grid tiles.
 * @param obstacleKind - Movement rule applied by the collider.
 */
export function creatingWorldBuildingCircleCollisionShape(
  radiusGrid: number,
  obstacleKind: DefiningWorldPlazaTerrainObstacleKind,
): DefiningWorldBuildingCollisionShape {
  return {
    kind: DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_CIRCLE,
    radiusGrid,
    obstacleKind,
  };
}
