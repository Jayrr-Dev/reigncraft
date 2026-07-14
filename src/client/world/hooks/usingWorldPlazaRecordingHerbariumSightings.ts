'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import {
  DEFINING_WORLD_PLAZA_HERBARIUM_DISCOVERY_POLL_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_HERBARIUM_SIGHT_RADIUS_GRID,
} from '@/components/world/domains/definingWorldPlazaHerbariumDiscoveryConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { listingWorldPlazaTreesInTileBounds } from '@/components/world/domains/listingWorldPlazaTreesInTileBounds';
import {
  initializingWorldPlazaHerbariumDiscoveryStore,
  recordingWorldPlazaHerbariumTreeSighted,
} from '@/components/world/domains/managingWorldPlazaHerbariumDiscoveryStore';
import { syncingWorldPlazaHerbariumFlowersFromPicks } from '@/components/world/domains/syncingWorldPlazaHerbariumFlowersFromPicks';
import type { DefiningWorldPlazaPickedFlowerTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import type { RefObject } from 'react';
import { useEffect } from 'react';

export type UsingWorldPlazaRecordingHerbariumSightingsOptions = {
  isEnabled: boolean;
  storageOwnerId: string | null;
  playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint | null>;
  /** Inventory used to backfill already-held flower species. */
  inventoryState?: DefiningInventoryState | null;
  /** Picked flower tiles used to backfill historical picks. */
  pickedFlowerStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedFlowerTileState
  > | null;
};

/**
 * Tracks tree sightings near the player, and syncs flower discovery from picks.
 *
 * Flowers unlock only when picked (or when already held / previously picked).
 * Trees still unlock by proximity sighting; stump Study awards Herbarium progress.
 */
export function usingWorldPlazaRecordingHerbariumSightings({
  isEnabled,
  storageOwnerId,
  playerPositionRef,
  inventoryState = null,
  pickedFlowerStateByTileKey = null,
}: UsingWorldPlazaRecordingHerbariumSightingsOptions): void {
  useEffect(() => {
    initializingWorldPlazaHerbariumDiscoveryStore(storageOwnerId);
  }, [storageOwnerId]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    syncingWorldPlazaHerbariumFlowersFromPicks(
      inventoryState,
      pickedFlowerStateByTileKey
    );
  }, [isEnabled, inventoryState, pickedFlowerStateByTileKey]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const sightRadiusGrid = DEFINING_WORLD_PLAZA_HERBARIUM_SIGHT_RADIUS_GRID;
    const sightRadiusSquared = sightRadiusGrid * sightRadiusGrid;

    const recordingNearbyTreeSightings = (): void => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      const centerTileX = Math.floor(playerPosition.x);
      const centerTileY = Math.floor(playerPosition.y);

      const nearbyTrees = listingWorldPlazaTreesInTileBounds({
        minTileX: centerTileX - sightRadiusGrid,
        maxTileX: centerTileX + sightRadiusGrid,
        minTileY: centerTileY - sightRadiusGrid,
        maxTileY: centerTileY + sightRadiusGrid,
      });

      for (const tree of nearbyTrees) {
        if (tree.isStump) {
          continue;
        }

        const deltaX = tree.tileX - centerTileX;
        const deltaY = tree.tileY - centerTileY;

        if (deltaX * deltaX + deltaY * deltaY > sightRadiusSquared) {
          continue;
        }

        recordingWorldPlazaHerbariumTreeSighted(tree.variant);
      }
    };

    recordingNearbyTreeSightings();

    const intervalId = window.setInterval(
      recordingNearbyTreeSightings,
      DEFINING_WORLD_PLAZA_HERBARIUM_DISCOVERY_POLL_INTERVAL_MS
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isEnabled, playerPositionRef]);
}
