import { DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID } from '@/components/world/domains/definingWorldPlazaPlayerCollisionConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import { checkingWorldPlazaPlayerCircleOverlapsTileSquare } from '@/components/world/domains/resolvingWorldPlazaPlayerCircleTileSquareCollision';
import type { DefiningWorldPlazaEnvironmentalHazard } from '@/components/world/health/domains/definingWorldPlazaEnvironmentalHazardTypes';
import { resolvingWorldPlazaEnvironmentalHazardAtTileIndex } from '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardAtTileIndex';

const RESOLVING_WORLD_PLAZA_ENVIRONMENTAL_HAZARD_PLAYER_SCAN_RING = 1;

export type ResolvingWorldPlazaEnvironmentalHazardForPlayerAtWorldPointParams =
  {
    center: DefiningWorldPlazaWorldPoint;
    isDaytime: boolean;
    playerRadiusGrid?: number;
  };

/**
 * Returns the strongest environmental hazard overlapping the player footprint.
 */
export function resolvingWorldPlazaEnvironmentalHazardForPlayerAtWorldPoint({
  center,
  isDaytime,
  playerRadiusGrid = DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID,
}: ResolvingWorldPlazaEnvironmentalHazardForPlayerAtWorldPointParams): DefiningWorldPlazaEnvironmentalHazard | null {
  const centerTile = resolvingWorldPlazaIsometricTileIndexAtGridPoint(center);
  let strongestHazard: DefiningWorldPlazaEnvironmentalHazard | null = null;

  for (
    let offsetTileY =
      -RESOLVING_WORLD_PLAZA_ENVIRONMENTAL_HAZARD_PLAYER_SCAN_RING;
    offsetTileY <= RESOLVING_WORLD_PLAZA_ENVIRONMENTAL_HAZARD_PLAYER_SCAN_RING;
    offsetTileY += 1
  ) {
    for (
      let offsetTileX =
        -RESOLVING_WORLD_PLAZA_ENVIRONMENTAL_HAZARD_PLAYER_SCAN_RING;
      offsetTileX <=
      RESOLVING_WORLD_PLAZA_ENVIRONMENTAL_HAZARD_PLAYER_SCAN_RING;
      offsetTileX += 1
    ) {
      const tileX = centerTile.tileX + offsetTileX;
      const tileY = centerTile.tileY + offsetTileY;

      if (
        !checkingWorldPlazaPlayerCircleOverlapsTileSquare(
          center,
          playerRadiusGrid,
          tileX,
          tileY
        )
      ) {
        continue;
      }

      const hazard = resolvingWorldPlazaEnvironmentalHazardAtTileIndex(
        tileX,
        tileY,
        isDaytime
      );

      if (
        hazard &&
        (!strongestHazard ||
          hazard.damagePerSecond > strongestHazard.damagePerSecond)
      ) {
        strongestHazard = hazard;
      }
    }
  }

  return strongestHazard;
}
