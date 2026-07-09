import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_DEFAULT_ACCELERATION_GRID_PER_SEC2,
  DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_DEFAULT_MAX_SPEED_GRID_PER_SEC,
  DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_DEFAULT_RADIUS_GRID,
  DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_DEFAULT_SETTLE_RADIUS_GRID,
} from '@/components/world/domains/definingWorldPlazaTileGravityWellConstants';
import type { DefiningWorldPlazaTileGravityWell } from '@/components/world/domains/definingWorldPlazaTileGravityWellTypes';
import type { ResolvingWorldPlazaIsometricTileIndex } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import { resolvingWorldPlazaTileGravityWellAttractorPoint } from '@/components/world/domains/resolvingWorldPlazaTileGravityWellAttractorPoint';

/**
 * Builds declarative gravity-well configs from tile indices or attractor points.
 *
 * @module components/world/domains/creatingWorldPlazaTileGravityWell
 */

export type CreatingWorldPlazaTileGravityWellFromTileInput = {
  readonly tileIndex: ResolvingWorldPlazaIsometricTileIndex;
  readonly layer?: number;
  readonly accelerationGridPerSec2?: number;
  readonly radiusGrid?: number;
  readonly falloff?: DefiningWorldPlazaTileGravityWell['falloff'];
  readonly settleRadiusGrid?: number;
  readonly maxSpeedGridPerSec?: number;
};

export type CreatingWorldPlazaTileGravityWellFromPointInput = {
  readonly attractor: DefiningWorldPlazaWorldPoint;
  readonly accelerationGridPerSec2?: number;
  readonly radiusGrid?: number;
  readonly falloff?: DefiningWorldPlazaTileGravityWell['falloff'];
  readonly settleRadiusGrid?: number;
  readonly maxSpeedGridPerSec?: number;
};

/**
 * Creates a gravity well centered on a tile diamond.
 */
export function creatingWorldPlazaTileGravityWellFromTile({
  tileIndex,
  layer,
  accelerationGridPerSec2 = DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_DEFAULT_ACCELERATION_GRID_PER_SEC2,
  radiusGrid = DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_DEFAULT_RADIUS_GRID,
  falloff = 'linear',
  settleRadiusGrid = DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_DEFAULT_SETTLE_RADIUS_GRID,
  maxSpeedGridPerSec = DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_DEFAULT_MAX_SPEED_GRID_PER_SEC,
}: CreatingWorldPlazaTileGravityWellFromTileInput): DefiningWorldPlazaTileGravityWell {
  return {
    attractor: resolvingWorldPlazaTileGravityWellAttractorPoint(
      tileIndex,
      layer
    ),
    accelerationGridPerSec2,
    radiusGrid,
    falloff,
    settleRadiusGrid,
    maxSpeedGridPerSec,
  };
}

/**
 * Creates a gravity well centered on an arbitrary grid point (projectile target, etc.).
 */
export function creatingWorldPlazaTileGravityWellFromPoint({
  attractor,
  accelerationGridPerSec2 = DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_DEFAULT_ACCELERATION_GRID_PER_SEC2,
  radiusGrid = DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_DEFAULT_RADIUS_GRID,
  falloff = 'linear',
  settleRadiusGrid = DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_DEFAULT_SETTLE_RADIUS_GRID,
  maxSpeedGridPerSec = DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_DEFAULT_MAX_SPEED_GRID_PER_SEC,
}: CreatingWorldPlazaTileGravityWellFromPointInput): DefiningWorldPlazaTileGravityWell {
  return {
    attractor,
    accelerationGridPerSec2,
    radiusGrid,
    falloff,
    settleRadiusGrid,
    maxSpeedGridPerSec,
  };
}
