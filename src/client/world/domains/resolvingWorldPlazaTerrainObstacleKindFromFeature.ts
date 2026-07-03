import {
  DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_COLLISION_RADIUS_GRID,
  DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_SIZE_TIER_INDEX,
  DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_COLLISION_RADIUS_GRID,
  DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_SIZE_TIER_INDEX,
  DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK,
  DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER,
  DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_PASSABLE,
  type DefiningWorldPlazaTerrainObstacleKind,
} from "@/components/world/domains/definingWorldPlazaTerrainObstacleConstants";
import { checkingWorldPlazaWaterIsFrozenAtTileIndex } from "@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex";
import {
  DEFINING_WORLD_PLAZA_WATER_KIND_STREAM,
  type DefiningWorldPlazaWaterKind,
} from "@/components/world/domains/definingWorldPlazaWaterKind";
import {
  resolvingWorldPlazaIsometricTileIndexAtGridPoint,
  type ResolvingWorldPlazaIsometricTileIndex,
} from "@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint";
import { resolvingWorldPlazaColumnRockMetadataAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex";
import { checkingWorldPlazaColumnRockFootprintTileBypassesTileGridCollisionAtTileIndex } from "@/components/world/domains/checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex";
import { resolvingWorldPlazaStoneDecorationAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaStoneDecorationAtTileIndex";
import { resolvingWorldPlazaWaterAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex";

/**
 * Maps plaza terrain features to movement obstacle rules.
 *
 * @module components/world/domains/resolvingWorldPlazaTerrainObstacleKindFromFeature
 */

/**
 * Maps a surface-water kind to a movement rule.
 *
 * @param waterKind - Lake, river, or stream variant.
 */
export function resolvingWorldPlazaTerrainObstacleKindFromWaterKind(
  waterKind: DefiningWorldPlazaWaterKind,
): DefiningWorldPlazaTerrainObstacleKind {
  if (waterKind === DEFINING_WORLD_PLAZA_WATER_KIND_STREAM) {
    return DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER;
  }

  return DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK;
}

/**
 * Maps a decorative stone size tier to a movement rule.
 *
 * @param sizeTierIndex - Stone size tier index from placement.
 */
export function resolvingWorldPlazaTerrainObstacleKindFromStoneSizeTierIndex(
  sizeTierIndex: number,
): DefiningWorldPlazaTerrainObstacleKind {
  if (
    sizeTierIndex >= DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_SIZE_TIER_INDEX
  ) {
    return DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK;
  }

  if (
    sizeTierIndex >= DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_SIZE_TIER_INDEX
  ) {
    return DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER;
  }

  return DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_PASSABLE;
}

/**
 * Resolves the dominant movement rule for one tile.
 *
 * Water takes priority over decorative stones. Small pebbles remain passable.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaTerrainObstacleKindAtTileIndex(
  tileX: number,
  tileY: number,
): DefiningWorldPlazaTerrainObstacleKind {
  if (
    checkingWorldPlazaColumnRockFootprintTileBypassesTileGridCollisionAtTileIndex(
      tileX,
      tileY,
    )
  ) {
    return DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_PASSABLE;
  }

  const waterTile = resolvingWorldPlazaWaterAtTileIndex(tileX, tileY);

  if (waterTile) {
    if (checkingWorldPlazaWaterIsFrozenAtTileIndex(tileX, tileY)) {
      return DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_PASSABLE;
    }

    return resolvingWorldPlazaTerrainObstacleKindFromWaterKind(waterTile.kind);
  }

  const stoneDecoration = resolvingWorldPlazaStoneDecorationAtTileIndex(
    tileX,
    tileY,
  );

  if (!stoneDecoration) {
    return DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_PASSABLE;
  }

  return resolvingWorldPlazaTerrainObstacleKindFromStoneSizeTierIndex(
    stoneDecoration.sizeTierIndex,
  );
}

/**
 * Resolves a circular collision radius for a medium or large pebble rock on a tile.
 *
 * Column-rock mega-boulders use base-diamond footprint collision instead of this
 * radius, sized via {@link resolvingWorldPlazaColumnRockBaseDiamondFromMetadata}.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaRockCollisionRadiusGridAtTileIndex(
  tileX: number,
  tileY: number,
): number | null {
  if (resolvingWorldPlazaColumnRockMetadataAtTileIndex(tileX, tileY)) {
    return null;
  }

  const stoneDecoration = resolvingWorldPlazaStoneDecorationAtTileIndex(
    tileX,
    tileY,
  );

  if (!stoneDecoration || stoneDecoration.surfaceWorldLayer !== null) {
    return null;
  }

  if (
    stoneDecoration.sizeTierIndex >=
    DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_SIZE_TIER_INDEX
  ) {
    return DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_COLLISION_RADIUS_GRID;
  }

  if (
    stoneDecoration.sizeTierIndex >=
    DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_SIZE_TIER_INDEX
  ) {
    return DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_COLLISION_RADIUS_GRID;
  }

  return null;
}

/**
 * Returns true when walking movement is blocked on the tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaTerrainBlocksWalkingAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  if (
    checkingWorldPlazaColumnRockFootprintTileBypassesTileGridCollisionAtTileIndex(
      tileX,
      tileY,
    )
  ) {
    return false;
  }

  const obstacleKind = resolvingWorldPlazaTerrainObstacleKindAtTileIndex(
    tileX,
    tileY,
  );

  return (
    obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK ||
    obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER
  );
}

/**
 * Returns true when the tile fully blocks both walking and jumping.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaTerrainBlocksAllMovementAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  if (
    checkingWorldPlazaColumnRockFootprintTileBypassesTileGridCollisionAtTileIndex(
      tileX,
      tileY,
    )
  ) {
    return false;
  }

  return (
    resolvingWorldPlazaTerrainObstacleKindAtTileIndex(tileX, tileY) ===
    DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK
  );
}

/**
 * Returns true when procedural surface water occupies the tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaTerrainOccupiesWaterAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  if (checkingWorldPlazaWaterIsFrozenAtTileIndex(tileX, tileY)) {
    return false;
  }

  return resolvingWorldPlazaWaterAtTileIndex(tileX, tileY) !== null;
}

/**
 * Returns true when jumping onto the tile should be rejected by terrain.
 *
 * Only surface water rejects a landing. Column rocks (medium and large) are
 * standable boulder tops, so they are valid landing targets; their reachable
 * height is enforced by the unified surface-layer jump-reach check.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaTerrainBlocksJumpLandingAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  return checkingWorldPlazaTerrainOccupiesWaterAtTileIndex(tileX, tileY);
}

/**
 * Returns the blocked tile under a grid point, if any.
 *
 * Uses the single tile whose drawn diamond contains the point.
 *
 * @param gridPoint - Position in grid space.
 * @param applyBlockCollision - Whether full block collision is active.
 * @param isJumping - True while a jump animation is active.
 */
export function findingWorldPlazaWalkingBlockedIsometricTileAtGridPoint(
  gridPoint: { x: number; y: number },
  applyBlockCollision = true,
  isJumping = false,
): ResolvingWorldPlazaIsometricTileIndex | null {
  const standingTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(gridPoint);

  if (
    checkingWorldPlazaColumnRockFootprintTileBypassesTileGridCollisionAtTileIndex(
      standingTile.tileX,
      standingTile.tileY,
    )
  ) {
    return null;
  }

  const obstacleKind = resolvingWorldPlazaTerrainObstacleKindAtTileIndex(
    standingTile.tileX,
    standingTile.tileY,
  );
  const isBlocked =
    (obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK &&
      applyBlockCollision) ||
    (obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER &&
      !isJumping);

  if (!isBlocked) {
    return null;
  }

  return standingTile;
}

/**
 * Returns true when a grid point occupies a tile that blocks walking.
 *
 * @param gridPoint - Candidate avatar position in grid space.
 * @param isJumping - True while a jump animation is active.
 */
export function checkingWorldPlazaGridPointOccupiesWalkingBlockedTile(
  gridPoint: { x: number; y: number },
  isJumping = false,
): boolean {
  return (
    findingWorldPlazaWalkingBlockedIsometricTileAtGridPoint(
      gridPoint,
      true,
      isJumping,
    ) !== null
  );
}
