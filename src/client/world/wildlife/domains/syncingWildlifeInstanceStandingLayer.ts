import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { syncingWorldPlazaPlayerStandingLayer } from '@/components/world/building/domains/syncingWorldPlazaPlayerStandingLayer';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  listingWildlifeInstances,
  replacingWildlifeInstance,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

/**
 * Keeps wildlife standing layers aligned with terrain and placed blocks.
 *
 * @module components/world/wildlife/domains/syncingWildlifeInstanceStandingLayer
 */

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

  const position = { ...instance.position };

  syncingWorldPlazaPlayerStandingLayer(
    position,
    [...placedBlocks],
    false,
    placedBlocksByTile
  );

  if (position.layer === instance.position.layer) {
    return instance;
  }

  return {
    ...instance,
    position,
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
