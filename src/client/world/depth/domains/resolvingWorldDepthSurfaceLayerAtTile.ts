import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import type { DefiningWorldDepthProviderContext } from '@/components/world/depth/domains/definingWorldDepthProvider';
import { DEFINING_WORLD_DEPTH_SURFACE_LAYER_PROVIDERS } from '@/components/world/depth/domains/definingWorldDepthProviderRegistry';

/**
 * Unified walkable surface layer from registered depth providers.
 *
 * @module components/world/depth/domains/resolvingWorldDepthSurfaceLayerAtTile
 */

/**
 * Returns the highest walkable surface from terrain, rocks, placed blocks, and
 * flat-canopy trees at a tile.
 */
export function resolvingWorldDepthSurfaceLayerAtTileIndex(
  tileX: number,
  tileY: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[] = [],
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): number {
  const context: DefiningWorldDepthProviderContext = {
    placedBlocks,
    placedBlocksByTile,
  };
  let surfaceLayer = DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND;

  for (const provider of DEFINING_WORLD_DEPTH_SURFACE_LAYER_PROVIDERS) {
    surfaceLayer = Math.max(
      surfaceLayer,
      provider.resolvingSurfaceLayerAtTileIndex(tileX, tileY, context)
    );
  }

  return surfaceLayer;
}

/**
 * Returns the highest walkable surface without flat-canopy tree tops.
 */
export function resolvingWorldDepthBaseSurfaceLayerAtTileIndex(
  tileX: number,
  tileY: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[] = [],
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): number {
  const context: DefiningWorldDepthProviderContext = {
    placedBlocks,
    placedBlocksByTile,
  };
  let surfaceLayer = DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND;

  for (const provider of DEFINING_WORLD_DEPTH_SURFACE_LAYER_PROVIDERS) {
    if (provider.id === 'treeFlatCanopy') {
      continue;
    }

    surfaceLayer = Math.max(
      surfaceLayer,
      provider.resolvingSurfaceLayerAtTileIndex(tileX, tileY, context)
    );
  }

  return surfaceLayer;
}
