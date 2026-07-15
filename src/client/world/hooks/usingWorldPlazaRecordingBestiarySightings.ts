'use client';

import {
  DEFINING_WORLD_PLAZA_BESTIARY_DISCOVERY_POLL_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_BESTIARY_SIGHT_RADIUS_GRID,
} from '@/components/world/domains/definingWorldPlazaBestiaryDiscoveryConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  gettingWorldPlazaBestiarySightedSpeciesSnapshot,
  initializingWorldPlazaBestiaryDiscoveryStore,
  recordingWorldPlazaBestiarySpeciesSighted,
} from '@/components/world/domains/managingWorldPlazaBestiaryDiscoveryStore';
import { checkingWildlifePointWithinRadiusGrid } from '@/components/world/wildlife/domains/checkingWildlifePointWithinRadiusGrid';
import {
  listingWildlifeInstances,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import type { RefObject } from 'react';
import { useEffect } from 'react';
import type { PlazaSaveSlotIndex } from '../../../shared/plazaGameSession';

export type UsingWorldPlazaRecordingBestiarySightingsOptions = {
  isEnabled: boolean;
  storageOwnerId: string | null;
  cloudSaveSlotIndex?: PlazaSaveSlotIndex | null;
  playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint | null>;
  wildlifeStoreRef: RefObject<ManagingWildlifeInstanceStore>;
  /** Fired when a new wildlife species is sighted (trap recipe unlocks, etc.). */
  readonly onWildlifeSpeciesSighted?: () => void;
};

/**
 * Tracks wildlife sightings while the local player moves near live animals.
 */
export function usingWorldPlazaRecordingBestiarySightings({
  isEnabled,
  storageOwnerId,
  cloudSaveSlotIndex = null,
  playerPositionRef,
  wildlifeStoreRef,
  onWildlifeSpeciesSighted,
}: UsingWorldPlazaRecordingBestiarySightingsOptions): void {
  useEffect(() => {
    initializingWorldPlazaBestiaryDiscoveryStore(storageOwnerId, {
      cloudSaveSlotIndex,
    });
  }, [cloudSaveSlotIndex, storageOwnerId]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const recordingNearbyWildlifeSightings = (): void => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      const sightedCountBefore =
        gettingWorldPlazaBestiarySightedSpeciesSnapshot().length;

      for (const instance of listingWildlifeInstances(
        wildlifeStoreRef.current
      )) {
        if (instance.isDead) {
          continue;
        }

        if (
          !checkingWildlifePointWithinRadiusGrid(
            instance.position,
            playerPosition,
            DEFINING_WORLD_PLAZA_BESTIARY_SIGHT_RADIUS_GRID
          )
        ) {
          continue;
        }

        recordingWorldPlazaBestiarySpeciesSighted(instance.speciesId);
      }

      if (
        gettingWorldPlazaBestiarySightedSpeciesSnapshot().length >
        sightedCountBefore
      ) {
        onWildlifeSpeciesSighted?.();
      }
    };

    recordingNearbyWildlifeSightings();

    const intervalId = window.setInterval(
      recordingNearbyWildlifeSightings,
      DEFINING_WORLD_PLAZA_BESTIARY_DISCOVERY_POLL_INTERVAL_MS
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    isEnabled,
    onWildlifeSpeciesSighted,
    playerPositionRef,
    wildlifeStoreRef,
  ]);
}
