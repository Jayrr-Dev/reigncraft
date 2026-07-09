/**
 * Probes whether the local player should auto-jump a water gap ahead.
 *
 * Used on mobile when the auto-jump setting is on. Scans forward for
 * procedural or placed water, then confirms a run-jump landing would clear it.
 *
 * @module components/world/domains/checkingWorldPlazaPlayerMobileAutoJumpWaterGapAhead
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  checkingWorldBuildingPlacedNaturalWaterStreamAtTileIndex,
  resolvingWorldBuildingJumpForwardGridDistanceClampedToWall,
} from '@/components/world/building/domains/resolvingWorldBuildingCollision';
import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_JUMP_FORWARD_GRID_DISTANCE } from '@/components/world/domains/definingWorldPlazaGirlSampleJumpConstants';
import {
  DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_DETECT_MAX_GRID,
  DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_MIN_GAP_GRID,
  DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_SCAN_STEP_GRID,
} from '@/components/world/domains/definingWorldPlazaMobileAutoJumpConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import { resolvingWorldPlazaJumpLandingGridPointAlongPath } from '@/components/world/domains/resolvingWorldPlazaJumpLandingGridPointAlongPath';
import { resolvingWorldPlazaSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import { checkingWorldPlazaTerrainOccupiesWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainObstacleKindFromFeature';

export type CheckingWorldPlazaPlayerMobileAutoJumpWaterGapAheadParams = {
  /** Current player position in grid space. */
  playerPosition: DefiningWorldPlazaWorldPoint;
  /** Unit grid direction the avatar is moving. */
  gridDirection: DefiningWorldPlazaWorldPoint;
  /** Nearby placed blocks for stream and landing checks. */
  placedBlocks: DefiningWorldBuildingPlacedBlock[];
  /** Layer the player stands on at takeoff. */
  jumpStartLayer: number;
  /** Max upward layer reach for this jump. */
  jumpLayerReachMax: number;
  /** Multiplier on run-jump forward distance (buffs / character scale). */
  jumpDistanceMultiplier: number;
};

/**
 * Returns true when water occupies a tile (procedural or placed stream).
 */
function checkingWorldPlazaTileOccupiesAutoJumpWaterAtTileIndex(
  tileX: number,
  tileY: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[]
): boolean {
  return (
    checkingWorldPlazaTerrainOccupiesWaterAtTileIndex(tileX, tileY) ||
    checkingWorldBuildingPlacedNaturalWaterStreamAtTileIndex(
      tileX,
      tileY,
      placedBlocks
    )
  );
}

/**
 * Returns true when a water gap ahead is within detect range and a run jump
 * can land on the far bank.
 */
export function checkingWorldPlazaPlayerMobileAutoJumpWaterGapAhead({
  playerPosition,
  gridDirection,
  placedBlocks,
  jumpStartLayer,
  jumpLayerReachMax,
  jumpDistanceMultiplier,
}: CheckingWorldPlazaPlayerMobileAutoJumpWaterGapAheadParams): boolean {
  const directionLength = Math.hypot(gridDirection.x, gridDirection.y);

  if (directionLength <= 0.0001) {
    return false;
  }

  const direction = {
    x: gridDirection.x / directionLength,
    y: gridDirection.y / directionLength,
  };

  let gapStartDistance: number | null = null;
  let gapEndDistance: number | null = null;

  for (
    let sampleDistance = DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_SCAN_STEP_GRID;
    sampleDistance <=
    DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_DETECT_MAX_GRID +
      DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_SCAN_STEP_GRID;
    sampleDistance += DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_SCAN_STEP_GRID
  ) {
    const samplePoint = {
      x: playerPosition.x + direction.x * sampleDistance,
      y: playerPosition.y + direction.y * sampleDistance,
      layer: jumpStartLayer,
    };
    const sampleTile =
      resolvingWorldPlazaIsometricTileIndexAtGridPoint(samplePoint);
    const isWater = checkingWorldPlazaTileOccupiesAutoJumpWaterAtTileIndex(
      sampleTile.tileX,
      sampleTile.tileY,
      placedBlocks
    );

    if (isWater) {
      if (gapStartDistance === null) {
        if (
          sampleDistance > DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_DETECT_MAX_GRID
        ) {
          break;
        }

        gapStartDistance = sampleDistance;
      }

      gapEndDistance = sampleDistance;
      continue;
    }

    if (gapStartDistance !== null) {
      break;
    }
  }

  if (gapStartDistance === null || gapEndDistance === null) {
    return false;
  }

  if (
    gapEndDistance - gapStartDistance <
    DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_MIN_GAP_GRID
  ) {
    return false;
  }

  const requestedForwardGridDistance =
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_JUMP_FORWARD_GRID_DISTANCE *
    jumpDistanceMultiplier;
  const fullDistanceLandingGridPoint = {
    x: playerPosition.x + direction.x * requestedForwardGridDistance,
    y: playerPosition.y + direction.y * requestedForwardGridDistance,
  };
  const fullDistanceLandingTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(
      fullDistanceLandingGridPoint
    );
  const fullDistanceLandingSurfaceLayer =
    resolvingWorldPlazaSurfaceLayerAtTileIndex(
      fullDistanceLandingTile.tileX,
      fullDistanceLandingTile.tileY,
      placedBlocks
    );
  const forwardGridDistance =
    resolvingWorldBuildingJumpForwardGridDistanceClampedToWall(
      playerPosition,
      direction,
      requestedForwardGridDistance,
      placedBlocks,
      jumpStartLayer,
      fullDistanceLandingSurfaceLayer,
      jumpLayerReachMax
    );
  const resolvedJumpLanding = resolvingWorldPlazaJumpLandingGridPointAlongPath(
    playerPosition,
    direction,
    forwardGridDistance,
    placedBlocks,
    jumpStartLayer,
    jumpLayerReachMax
  );

  if (!resolvedJumpLanding) {
    return false;
  }

  // Require the landing to clear past the water gap, not land on the near bank.
  return (
    resolvedJumpLanding.forwardGridDistance >
    gapEndDistance + DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_SCAN_STEP_GRID
  );
}
