import {
  DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_DEFAULT_SETTLE_RADIUS_GRID,
  DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_MIN_DISTANCE_GRID,
} from '@/components/world/domains/definingWorldPlazaTileGravityWellConstants';
import type {
  ComputingWorldPlazaTileGravityWellAccelerationInput,
  ComputingWorldPlazaTileGravityWellAccelerationResult,
  DefiningWorldPlazaTileGravityWellFalloff,
} from '@/components/world/domains/definingWorldPlazaTileGravityWellTypes';

/**
 * Pure gravity-well acceleration toward an attractor in grid space.
 *
 * @module components/world/domains/computingWorldPlazaTileGravityWellAcceleration
 */

function resolvingWorldPlazaTileGravityWellFalloffRatio(
  distanceGrid: number,
  radiusGrid: number,
  falloff: DefiningWorldPlazaTileGravityWellFalloff
): number {
  if (radiusGrid <= 0 || distanceGrid > radiusGrid) {
    return 0;
  }

  if (falloff === 'none') {
    return 1;
  }

  if (falloff === 'inverseSquare') {
    return 1 / (1 + distanceGrid * distanceGrid);
  }

  // linear
  return 1 - distanceGrid / radiusGrid;
}

function resolvingWorldPlazaTileGravityWellSettleFade(
  distanceGrid: number,
  settleRadiusGrid: number
): number {
  if (settleRadiusGrid <= 0) {
    return 1;
  }

  if (distanceGrid >= settleRadiusGrid) {
    return 1;
  }

  return distanceGrid / settleRadiusGrid;
}

/**
 * Samples acceleration (grid / s²) from one gravity well at a position.
 *
 * Returns zero acceleration outside the radius or when already at the attractor.
 */
export function computingWorldPlazaTileGravityWellAcceleration({
  position,
  well,
}: ComputingWorldPlazaTileGravityWellAccelerationInput): ComputingWorldPlazaTileGravityWellAccelerationResult {
  const deltaX = well.attractor.x - position.x;
  const deltaY = well.attractor.y - position.y;
  const distanceGrid = Math.hypot(deltaX, deltaY);
  const radiusGrid = Math.max(0, well.radiusGrid);

  if (
    radiusGrid <= 0 ||
    distanceGrid > radiusGrid ||
    distanceGrid < DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_MIN_DISTANCE_GRID
  ) {
    return {
      accelerationX: 0,
      accelerationY: 0,
      isInsideWell: distanceGrid <= radiusGrid && radiusGrid > 0,
      distanceGrid,
      strengthRatio: 0,
    };
  }

  const falloff = well.falloff ?? 'linear';
  const settleRadiusGrid =
    well.settleRadiusGrid ??
    DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_DEFAULT_SETTLE_RADIUS_GRID;
  const falloffRatio = resolvingWorldPlazaTileGravityWellFalloffRatio(
    distanceGrid,
    radiusGrid,
    falloff
  );
  const settleFade = resolvingWorldPlazaTileGravityWellSettleFade(
    distanceGrid,
    settleRadiusGrid
  );
  const strengthRatio = Math.max(0, Math.min(1, falloffRatio * settleFade));
  const accelerationMagnitude = well.accelerationGridPerSec2 * strengthRatio;
  const invDistance = 1 / distanceGrid;

  return {
    accelerationX: deltaX * invDistance * accelerationMagnitude,
    accelerationY: deltaY * invDistance * accelerationMagnitude,
    isInsideWell: true,
    distanceGrid,
    strengthRatio,
  };
}
