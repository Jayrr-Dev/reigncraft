'use client';

import {
  DEFINING_WORLD_PLAZA_HERBARIUM_DISCOVERY_POLL_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_HERBARIUM_SIGHT_RADIUS_GRID,
} from '@/components/world/domains/definingWorldPlazaHerbariumDiscoveryConstants';
import { checkingWorldPlazaFlowerDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaFlowerDecorationAtTileIndex';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  initializingWorldPlazaHerbariumDiscoveryStore,
  recordingWorldPlazaHerbariumFlowerSighted,
  recordingWorldPlazaHerbariumTreeSighted,
} from '@/components/world/domains/managingWorldPlazaHerbariumDiscoveryStore';
import { listingWorldPlazaTreesInTileBounds } from '@/components/world/domains/listingWorldPlazaTreesInTileBounds';
import { resolvingWorldFlowerSpeciesAtTileIndex } from '../../../shared/worldFlowerRarity';
import type { RefObject } from 'react';
import { useEffect } from 'react';

export type UsingWorldPlazaRecordingHerbariumSightingsOptions = {
  isEnabled: boolean;
  storageOwnerId: string | null;
  playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint | null>;
};

/**
 * Tracks flower and tree sightings while the local player moves near flora.
 */
export function usingWorldPlazaRecordingHerbariumSightings({
  isEnabled,
  storageOwnerId,
  playerPositionRef,
}: UsingWorldPlazaRecordingHerbariumSightingsOptions): void {
  useEffect(() => {
    initializingWorldPlazaHerbariumDiscoveryStore(storageOwnerId);
  }, [storageOwnerId]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const sightRadiusGrid = DEFINING_WORLD_PLAZA_HERBARIUM_SIGHT_RADIUS_GRID;
    const sightRadiusSquared = sightRadiusGrid * sightRadiusGrid;

    const recordingNearbyFloraSightings = (): void => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      const centerTileX = Math.floor(playerPosition.x);
      const centerTileY = Math.floor(playerPosition.y);

      for (
        let offsetY = -sightRadiusGrid;
        offsetY <= sightRadiusGrid;
        offsetY++
      ) {
        for (
          let offsetX = -sightRadiusGrid;
          offsetX <= sightRadiusGrid;
          offsetX++
        ) {
          if (offsetX * offsetX + offsetY * offsetY > sightRadiusSquared) {
            continue;
          }

          const tileX = centerTileX + offsetX;
          const tileY = centerTileY + offsetY;

          if (!checkingWorldPlazaFlowerDecorationAtTileIndex(tileX, tileY)) {
            continue;
          }

          recordingWorldPlazaHerbariumFlowerSighted(
            resolvingWorldFlowerSpeciesAtTileIndex(tileX, tileY)
          );
        }
      }

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

    recordingNearbyFloraSightings();

    const intervalId = window.setInterval(
      recordingNearbyFloraSightings,
      DEFINING_WORLD_PLAZA_HERBARIUM_DISCOVERY_POLL_INTERVAL_MS
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isEnabled, playerPositionRef]);
}
