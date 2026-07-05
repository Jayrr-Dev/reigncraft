import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { clampingWorldCollisionWalkTargetToWalkableGridPoint } from '@/components/world/collision';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaInventoryDropTileIsValid } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryDropTileIsValid';
import { computingWorldPlazaInventoryDropChebyshevDistanceToTile } from '@/components/world/inventory/domains/computingWorldPlazaInventoryDropChebyshevDistanceToTile';
import { DEFINING_WORLD_PLAZA_INVENTORY_DROP_RADIUS_TILES } from '@/components/world/inventory/domains/definingWorldPlazaInventoryDropConstants';

/** Chebyshev tile distance between an avatar and a drop tile center. */
function computingWorldPlazaDropTileChebyshevDistance(
  playerX: number,
  playerY: number,
  tileX: number,
  tileY: number
): number {
  return computingWorldPlazaInventoryDropChebyshevDistanceToTile(
    playerX,
    playerY,
    tileX,
    tileY
  );
}

/**
 * Resolves a click-walk destination that ends within inventory drop range of the
 * target tile, instead of stopping at the path edge short of the drop cell.
 *
 * @param playerPosition - Current avatar position.
 * @param dropTileX - Target drop tile column.
 * @param dropTileY - Target drop tile row.
 * @param placedBlocks - Nearby placed blocks for collision.
 */
export function resolvingWorldPlazaInventoryDropWalkTargetGridPoint(
  playerPosition: DefiningWorldPlazaWorldPoint,
  dropTileX: number,
  dropTileY: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[] = []
): DefiningWorldPlazaWorldPoint {
  const dropRadius = DEFINING_WORLD_PLAZA_INVENTORY_DROP_RADIUS_TILES;
  const searchRadius = Math.ceil(dropRadius);
  let bestTarget: DefiningWorldPlazaWorldPoint | null = null;
  let bestDistanceSquared = Number.POSITIVE_INFINITY;

  for (let offsetY = -searchRadius; offsetY <= searchRadius; offsetY += 1) {
    for (let offsetX = -searchRadius; offsetX <= searchRadius; offsetX += 1) {
      const candidateTileX = dropTileX + offsetX;
      const candidateTileY = dropTileY + offsetY;
      const candidateCenter: DefiningWorldPlazaWorldPoint = {
        x: candidateTileX + 0.5,
        y: candidateTileY + 0.5,
        layer: playerPosition.layer,
      };

      if (
        computingWorldPlazaDropTileChebyshevDistance(
          candidateCenter.x,
          candidateCenter.y,
          dropTileX,
          dropTileY
        ) > dropRadius
      ) {
        continue;
      }

      if (
        !checkingWorldPlazaInventoryDropTileIsValid(
          candidateTileX,
          candidateTileY,
          placedBlocks
        )
      ) {
        continue;
      }

      const walkableTarget =
        clampingWorldCollisionWalkTargetToWalkableGridPoint(
          playerPosition,
          candidateCenter,
          false,
          [...placedBlocks]
        );

      if (
        computingWorldPlazaDropTileChebyshevDistance(
          walkableTarget.x,
          walkableTarget.y,
          dropTileX,
          dropTileY
        ) > dropRadius
      ) {
        continue;
      }

      const deltaX = walkableTarget.x - playerPosition.x;
      const deltaY = walkableTarget.y - playerPosition.y;
      const distanceSquared = deltaX * deltaX + deltaY * deltaY;

      if (distanceSquared < bestDistanceSquared) {
        bestDistanceSquared = distanceSquared;
        bestTarget = walkableTarget;
      }
    }
  }

  if (bestTarget) {
    return bestTarget;
  }

  return clampingWorldCollisionWalkTargetToWalkableGridPoint(
    playerPosition,
    {
      x: dropTileX + 0.5,
      y: dropTileY + 0.5,
      layer: playerPosition.layer,
    },
    false,
    [...placedBlocks]
  );
}
