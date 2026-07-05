import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import { computingWorldPlazaTreeLayerGrowthScaleFromSurfaceLayer } from '@/components/world/domains/definingWorldPlazaTreeLayerGrowthConstants';
import type { DefiningWorldPlazaTreeInstance } from '@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex';
import { DEFINING_WORLD_PLAZA_TREE_STUMP_WIDTH_MULTIPLIER } from '@/components/world/harvest/domains/definingWorldPlazaTreeChopConstants';

/**
 * Shared trunk width and collision metrics derived from tree instances.
 *
 * @module components/world/domains/computingWorldPlazaTreeTrunkMetricsFromInstance
 */

/** Multiplier applied to every tree dimension (matches tree drawing). */
export const COMPUTING_WORLD_PLAZA_TREE_GLOBAL_SIZE_MULTIPLIER = 1.85;

const COMPUTING_WORLD_PLAZA_TREE_BROADLEAF_TRUNK_WIDTH_PX = 10;
const COMPUTING_WORLD_PLAZA_TREE_WILLOW_TRUNK_WIDTH_PX = 10;
const COMPUTING_WORLD_PLAZA_TREE_ACACIA_TRUNK_WIDTH_PX = 7;
const COMPUTING_WORLD_PLAZA_TREE_SPRUCE_TRUNK_WIDTH_PX = 7;
const COMPUTING_WORLD_PLAZA_TREE_BIRCH_TRUNK_WIDTH_PX = 6;
const COMPUTING_WORLD_PLAZA_TREE_PINE_TRUNK_WIDTH_PX = 7;
const COMPUTING_WORLD_PLAZA_TREE_PALM_TRUNK_WIDTH_PX = 7;
const COMPUTING_WORLD_PLAZA_TREE_DEADWOOD_TRUNK_WIDTH_PX = 9;
const COMPUTING_WORLD_PLAZA_TREE_CACTUS_COLUMN_WIDTH_PX = 16;

const COMPUTING_WORLD_PLAZA_TREE_TRUNK_HALF_WIDTH_PX_TO_GRID_RADIUS =
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID /
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;

function computingWorldPlazaTreeVisualSurfaceLayer(
  instance: DefiningWorldPlazaTreeInstance
): number {
  return (
    instance.visualSurfaceLayer ??
    instance.standingSurfaceLayer ??
    DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND
  );
}

/** Resolves the final visual scale for one tree instance. */
export function computingWorldPlazaTreeVisualScaleFromInstance(
  instance: DefiningWorldPlazaTreeInstance
): number {
  const visualSurfaceLayer =
    computingWorldPlazaTreeVisualSurfaceLayer(instance);
  const layerGrowthScale =
    computingWorldPlazaTreeLayerGrowthScaleFromSurfaceLayer(visualSurfaceLayer);

  return (
    instance.scale *
    COMPUTING_WORLD_PLAZA_TREE_GLOBAL_SIZE_MULTIPLIER *
    layerGrowthScale
  );
}

/** Trunk width for a variant at the given visual scale (nominal, no draw jitter). */
export function computingWorldPlazaTreeTrunkWidthPxFromInstance(
  instance: DefiningWorldPlazaTreeInstance,
  scale: number
): number {
  switch (instance.variant) {
    case 'willow':
      return COMPUTING_WORLD_PLAZA_TREE_WILLOW_TRUNK_WIDTH_PX * scale;
    case 'acacia':
      return COMPUTING_WORLD_PLAZA_TREE_ACACIA_TRUNK_WIDTH_PX * scale;
    case 'spruce':
      return COMPUTING_WORLD_PLAZA_TREE_SPRUCE_TRUNK_WIDTH_PX * scale;
    case 'birch':
      return COMPUTING_WORLD_PLAZA_TREE_BIRCH_TRUNK_WIDTH_PX * scale;
    case 'pine':
      return COMPUTING_WORLD_PLAZA_TREE_PINE_TRUNK_WIDTH_PX * scale;
    case 'palm':
      return COMPUTING_WORLD_PLAZA_TREE_PALM_TRUNK_WIDTH_PX * scale;
    case 'deadwood':
      return COMPUTING_WORLD_PLAZA_TREE_DEADWOOD_TRUNK_WIDTH_PX * scale;
    case 'cactus':
      return COMPUTING_WORLD_PLAZA_TREE_CACTUS_COLUMN_WIDTH_PX * scale;
    default:
      return COMPUTING_WORLD_PLAZA_TREE_BROADLEAF_TRUNK_WIDTH_PX * scale;
  }
}

/** Returns the trunk collision radius in grid tiles for one tree instance. */
export function resolvingWorldPlazaTreeCollisionRadiusGridFromInstance(
  instance: DefiningWorldPlazaTreeInstance
): number {
  const scale = computingWorldPlazaTreeVisualScaleFromInstance(instance);
  let trunkWidthPx = computingWorldPlazaTreeTrunkWidthPxFromInstance(
    instance,
    scale
  );

  if (instance.isStump) {
    trunkWidthPx *= DEFINING_WORLD_PLAZA_TREE_STUMP_WIDTH_MULTIPLIER;
  }

  return (
    (trunkWidthPx / 2) *
    COMPUTING_WORLD_PLAZA_TREE_TRUNK_HALF_WIDTH_PX_TO_GRID_RADIUS
  );
}
