import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID } from '@/components/world/domains/definingWorldPlazaPlayerCollisionConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import { checkingWorldPlazaPlayerCircleOverlapsTileSquare } from '@/components/world/domains/resolvingWorldPlazaPlayerCircleTileSquareCollision';
import { mergingWorldPlazaEnvironmentalTemperatureLevels } from '@/components/world/health/domains/combiningWorldPlazaEnvironmentalTemperatureLevel';
import {
  buildingWorldPlazaEnvironmentalTemperatureSample,
  checkingWorldPlazaEnvironmentalTemperatureSampleHasDamage,
  computingWorldPlazaEnvironmentalTemperatureTotalDamagePerSecond,
} from '@/components/world/health/domains/computingWorldPlazaTemperatureDamagePerSecond';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX } from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import type { DefiningWorldPlazaEnvironmentalHazard } from '@/components/world/health/domains/definingWorldPlazaEnvironmentalHazardTypes';
import type { DefiningWorldPlazaEnvironmentalTemperatureLevel } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';
import {
  resolvingWorldPlazaEnvironmentalHazardAtTileIndex,
  resolvingWorldPlazaEnvironmentalTemperatureAtTileIndex,
} from '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardAtTileIndex';

const RESOLVING_WORLD_PLAZA_ENVIRONMENTAL_HAZARD_PLAYER_SCAN_RING = 1;

type AveragingWorldPlazaEnvironmentalTemperatureAtPlayerOverlappingTilesParams =
  {
    center: DefiningWorldPlazaWorldPoint;
    isDaytime: boolean;
    playerRadiusGrid: number;
    placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
  };

/**
 * Averages effective local temperature across tiles under the player footprint.
 */
function averagingWorldPlazaEnvironmentalTemperatureAtPlayerOverlappingTiles({
  center,
  isDaytime,
  playerRadiusGrid,
  placedBlocksByTile,
}: AveragingWorldPlazaEnvironmentalTemperatureAtPlayerOverlappingTilesParams): number {
  const centerTile = resolvingWorldPlazaIsometricTileIndexAtGridPoint(center);
  let temperatureSumCelsius = 0;
  let overlappingTileCount = 0;

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

      temperatureSumCelsius +=
        resolvingWorldPlazaEnvironmentalTemperatureAtTileIndex({
          tileX,
          tileY,
          isDaytime,
          placedBlocksByTile,
        });
      overlappingTileCount += 1;
    }
  }

  if (overlappingTileCount === 0) {
    return resolvingWorldPlazaEnvironmentalTemperatureAtTileIndex({
      tileX: centerTile.tileX,
      tileY: centerTile.tileY,
      isDaytime,
      placedBlocksByTile,
    });
  }

  return temperatureSumCelsius / overlappingTileCount;
}

export type ResolvingWorldPlazaEnvironmentalHazardForPlayerAtWorldPointParams =
  {
    center: DefiningWorldPlazaWorldPoint;
    isDaytime: boolean;
    playerRadiusGrid?: number;
    placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
    /** Optional mob aura levels near the player (for future NPC systems). */
    nearbyMobTemperatureLevels?: readonly DefiningWorldPlazaEnvironmentalTemperatureLevel[];
  };

function resolvingWorldPlazaEnvironmentalHazardTotalDamagePerSecond(
  hazard: DefiningWorldPlazaEnvironmentalHazard
): number {
  return computingWorldPlazaEnvironmentalTemperatureTotalDamagePerSecond(
    hazard.damagePerSecond,
    hazard.maxHealthPercentPerSecond,
    DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX
  );
}

function mappingTemperatureSampleToHazard(
  celsius: number
): DefiningWorldPlazaEnvironmentalHazard | null {
  const sample = buildingWorldPlazaEnvironmentalTemperatureSample(celsius);

  if (!checkingWorldPlazaEnvironmentalTemperatureSampleHasDamage(sample)) {
    return null;
  }

  if (!sample.exposureKind) {
    return null;
  }

  return {
    kind: sample.exposureKind,
    damagePerSecond: sample.damagePerSecond,
    maxHealthPercentPerSecond: sample.maxHealthPercentPerSecond,
    temperatureCelsius: celsius,
  };
}

/**
 * Returns the strongest environmental hazard overlapping the player footprint.
 */
export function resolvingWorldPlazaEnvironmentalHazardForPlayerAtWorldPoint({
  center,
  isDaytime,
  playerRadiusGrid = DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID,
  placedBlocksByTile,
  nearbyMobTemperatureLevels = [],
}: ResolvingWorldPlazaEnvironmentalHazardForPlayerAtWorldPointParams): DefiningWorldPlazaEnvironmentalHazard | null {
  const centerTile = resolvingWorldPlazaIsometricTileIndexAtGridPoint(center);
  let strongestHazard: DefiningWorldPlazaEnvironmentalHazard | null = null;
  let hottestCelsius = Number.NEGATIVE_INFINITY;

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

      const tileCelsius =
        resolvingWorldPlazaEnvironmentalTemperatureAtTileIndex({
          tileX,
          tileY,
          isDaytime,
          placedBlocksByTile,
        });
      hottestCelsius = Math.max(hottestCelsius, tileCelsius);

      const hazard = resolvingWorldPlazaEnvironmentalHazardAtTileIndex(
        tileX,
        tileY,
        isDaytime,
        placedBlocksByTile
      );

      if (
        hazard &&
        (!strongestHazard ||
          resolvingWorldPlazaEnvironmentalHazardTotalDamagePerSecond(hazard) >
            resolvingWorldPlazaEnvironmentalHazardTotalDamagePerSecond(
              strongestHazard
            ))
      ) {
        strongestHazard = hazard;
      }
    }
  }

  if (
    nearbyMobTemperatureLevels.length > 0 &&
    hottestCelsius > Number.NEGATIVE_INFINITY
  ) {
    const mobAdjustedCelsius = mergingWorldPlazaEnvironmentalTemperatureLevels(
      hottestCelsius,
      nearbyMobTemperatureLevels
    );
    const mobHazard = mappingTemperatureSampleToHazard(mobAdjustedCelsius);

    if (
      mobHazard &&
      (!strongestHazard ||
        resolvingWorldPlazaEnvironmentalHazardTotalDamagePerSecond(mobHazard) >
          resolvingWorldPlazaEnvironmentalHazardTotalDamagePerSecond(
            strongestHazard
          ))
    ) {
      return mobHazard;
    }
  }

  return strongestHazard;
}

/**
 * Returns the effective local temperature averaged across tiles under the
 * player footprint (°C).
 */
export function resolvingWorldPlazaEnvironmentalTemperatureForPlayerAtWorldPoint({
  center,
  isDaytime,
  playerRadiusGrid = DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID,
  placedBlocksByTile,
  nearbyMobTemperatureLevels = [],
}: ResolvingWorldPlazaEnvironmentalHazardForPlayerAtWorldPointParams): number {
  const averagedTileCelsius =
    averagingWorldPlazaEnvironmentalTemperatureAtPlayerOverlappingTiles({
      center,
      isDaytime,
      playerRadiusGrid,
      placedBlocksByTile,
    });

  return mergingWorldPlazaEnvironmentalTemperatureLevels(
    averagedTileCelsius,
    nearbyMobTemperatureLevels
  );
}
