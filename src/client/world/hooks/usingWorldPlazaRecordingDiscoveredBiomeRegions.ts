'use client';

import { DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import { DEFINING_WORLD_PLAZA_DISCOVERED_BIOME_REGIONS_POLL_INTERVAL_MS } from '@/components/world/domains/definingWorldPlazaDiscoveredBiomeRegionsConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  initializingWorldPlazaDiscoveredBiomeRegionsStore,
  recordingWorldPlazaDiscoveredBiomeRegion,
} from '@/components/world/domains/managingWorldPlazaDiscoveredBiomeRegionsStore';
import { enqueueingWorldPlazaWorldNotification } from '@/components/world/domains/managingWorldPlazaWorldNotificationsStore';
import {
  formattingWorldPlazaBiomeRegionDiscoveryKey,
  resolvingWorldPlazaBiomeRegionDisplayName,
} from '@/components/world/domains/resolvingWorldPlazaBiomeRegionDisplayName';
import { resolvingWorldPlazaBiomeAtWorldPoint } from '@/components/world/domains/resolvingWorldPlazaBiomeAtWorldPoint';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import type { RefObject } from 'react';
import { useEffect } from 'react';

export type UsingWorldPlazaRecordingDiscoveredBiomeRegionsOptions = {
  isEnabled: boolean;
  storageOwnerId: string | null;
  playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint | null>;
};

/**
 * Tracks first entry into each biome region cell and queues a worldNotification
 * with that region's permanent unique name.
 */
export function usingWorldPlazaRecordingDiscoveredBiomeRegions({
  isEnabled,
  storageOwnerId,
  playerPositionRef,
}: UsingWorldPlazaRecordingDiscoveredBiomeRegionsOptions): void {
  useEffect(() => {
    initializingWorldPlazaDiscoveredBiomeRegionsStore(storageOwnerId);
  }, [storageOwnerId]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const recordingCurrentBiomeRegion = (): void => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      const { tileX, tileY } =
        resolvingWorldPlazaIsometricTileIndexAtGridPoint(playerPosition);
      const regionX = Math.floor(
        tileX / DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE
      );
      const regionY = Math.floor(
        tileY / DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE
      );
      const regionKey = formattingWorldPlazaBiomeRegionDiscoveryKey(
        regionX,
        regionY
      );
      const didDiscover = recordingWorldPlazaDiscoveredBiomeRegion(regionKey);

      if (!didDiscover) {
        return;
      }

      const biome = resolvingWorldPlazaBiomeAtWorldPoint(playerPosition);
      const regionDisplayName = resolvingWorldPlazaBiomeRegionDisplayName({
        regionX,
        regionY,
        biomeKind: biome.kind,
      });

      enqueueingWorldPlazaWorldNotification(
        'biome-region-discovery',
        regionDisplayName
      );
    };

    recordingCurrentBiomeRegion();

    const intervalId = window.setInterval(
      recordingCurrentBiomeRegion,
      DEFINING_WORLD_PLAZA_DISCOVERED_BIOME_REGIONS_POLL_INTERVAL_MS
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isEnabled, playerPositionRef, storageOwnerId]);
}
