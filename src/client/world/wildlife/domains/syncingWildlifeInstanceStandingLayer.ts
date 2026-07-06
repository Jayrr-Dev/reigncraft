import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_WALK_STEP_LAYER_DELTA } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { findingWorldBuildingPlacedBlockAtTileLayerIndex } from '@/components/world/building/domains/resolvingWorldBuildingSurfaceLayerAtTileIndex';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import {
  resolvingWorldPlazaBaseSurfaceLayerAtTileIndex,
  resolvingWorldPlazaSurfaceLayerAtTileIndex,
} from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  listingWildlifeInstances,
  replacingWildlifeInstance,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

/**
 * Keeps wildlife standing layers aligned with terrain and placed blocks.
 *
 * Wildlife snaps up to solid procedural terrain unconditionally when desynced
 * below a hill or column rock, then steps up one layer at a time onto placed
 * blocks and canopies. Step-down keeps the player platform-edge guard.
 *
 * @module components/world/wildlife/domains/syncingWildlifeInstanceStandingLayer
 */

/**
 * Resolves the standing layer for one wildlife foot point.
 */
export function resolvingWildlifeInstanceStandingLayerAtPoint(
  worldPoint: DefiningWorldPlazaWorldPoint,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): number {
  const standingTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(worldPoint);
  const surfaceLayer = resolvingWorldPlazaSurfaceLayerAtTileIndex(
    standingTile.tileX,
    standingTile.tileY,
    placedBlocks,
    placedBlocksByTile
  );
  let currentLayer = resolvingWorldPlazaPlayerWorldLayer(worldPoint);
  const solidTerrainSurfaceLayer =
    resolvingWorldPlazaBaseSurfaceLayerAtTileIndex(
      standingTile.tileX,
      standingTile.tileY,
      []
    );

  if (currentLayer < solidTerrainSurfaceLayer) {
    currentLayer = solidTerrainSurfaceLayer;
  }

  if (surfaceLayer < currentLayer) {
    const blockAtCurrentLayer = findingWorldBuildingPlacedBlockAtTileLayerIndex(
      standingTile.tileX,
      standingTile.tileY,
      currentLayer,
      placedBlocks,
      placedBlocksByTile
    );

    if (blockAtCurrentLayer !== null) {
      return currentLayer;
    }

    return surfaceLayer;
  }

  if (
    surfaceLayer > currentLayer &&
    surfaceLayer - currentLayer <=
      DEFINING_WORLD_BUILDING_WORLD_LAYER_WALK_STEP_LAYER_DELTA
  ) {
    return surfaceLayer;
  }

  return currentLayer;
}

/**
 * Updates one wildlife instance layer from the surface under its tile.
 */
export function syncingWildlifeInstanceStandingLayer(
  instance: DefiningWildlifeInstance,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): DefiningWildlifeInstance {
  if (instance.isDead || instance.aiState.jumpState) {
    return instance;
  }

  const nextLayer = resolvingWildlifeInstanceStandingLayerAtPoint(
    instance.position,
    placedBlocks,
    placedBlocksByTile
  );

  if (nextLayer === instance.position.layer) {
    return instance;
  }

  return {
    ...instance,
    position: {
      ...instance.position,
      layer: nextLayer,
    },
  };
}

/**
 * Syncs standing layers for every live wildlife instance in the store.
 */
export function syncingAllWildlifeInstanceStandingLayers(
  store: ManagingWildlifeInstanceStore,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): void {
  for (const instance of listingWildlifeInstances(store)) {
    const synced = syncingWildlifeInstanceStandingLayer(
      instance,
      placedBlocks,
      placedBlocksByTile
    );

    if (synced !== instance) {
      replacingWildlifeInstance(store, synced);
    }
  }
}
