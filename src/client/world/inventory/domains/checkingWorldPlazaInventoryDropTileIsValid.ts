import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { checkingWorldBuildingGridPointBlockedByPlacedBlocks } from "@/components/world/building/domains/resolvingWorldBuildingCollision";
import { resolvingWorldPlazaPlayerWorldLayer } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK } from "@/components/world/domains/definingWorldPlazaTerrainObstacleConstants";
import { resolvingWorldPlazaTerrainObstacleKindAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainObstacleKindFromFeature";

/**
 * Returns true when an inventory item may be dropped on the given tile.
 *
 * Uses tile-center rules only. Ground items are small markers and should not
 * inherit the full player footprint collision used for avatar movement.
 *
 * @param tileX - Target tile column.
 * @param tileY - Target tile row.
 * @param placedBlocks - Nearby player-placed blocks for collision.
 */
export function checkingWorldPlazaInventoryDropTileIsValid(
  tileX: number,
  tileY: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[] = [],
): boolean {
  const obstacleKind = resolvingWorldPlazaTerrainObstacleKindAtTileIndex(
    tileX,
    tileY,
  );

  if (obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK) {
    return false;
  }

  const samplePoint = {
    x: tileX + 0.5,
    y: tileY + 0.5,
    layer: resolvingWorldPlazaPlayerWorldLayer({ x: tileX, y: tileY }),
  };

  return !checkingWorldBuildingGridPointBlockedByPlacedBlocks(
    samplePoint,
    placedBlocks,
    true,
    false,
    samplePoint.layer,
  );
}
