'use client';

/**
 * Roster pets for the open companions panel, refreshed from live wildlife.
 *
 * @module components/world/wildlife/pets/hooks/usingWildlifePetRosterPanelLivePets
 */

import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { DEFINING_WILDLIFE_PET_ROSTER_PANEL_LIVE_REFRESH_INTERVAL_MS } from '@/components/world/wildlife/pets/domains/definingWildlifePetRosterPanelConstants';
import type { DefiningWildlifePetPersistedRecord } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';
import {
  readingWildlifePetRosterSnapshot,
  subscribingWildlifePetRoster,
} from '@/components/world/wildlife/pets/domains/managingWildlifePetRosterStore';
import { checkingWildlifePetRosterRecordIsDeceased } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetRosterPanelRows';
import { resolvingWildlifePetRosterPetsWithLiveVitalsFromStore } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetRosterPetsWithLiveVitals';
import { findingWildlifeInstanceByPetId } from '@/components/world/wildlife/pets/domains/spawningWildlifeActivePetNearOwner';
import { syncingWildlifePetDeathToRoster } from '@/components/world/wildlife/pets/domains/syncingWildlifePetBondToRoster';
import type { RefObject } from 'react';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';

export type UsingWildlifePetRosterPanelLivePetsParams = {
  isOpen: boolean;
  wildlifeStoreRef: RefObject<ManagingWildlifeInstanceStore>;
};

/**
 * Subscribes to the persisted roster and, while the panel is open, overlays
 * live HP / death from the wildlife store. Write-through marks roster death
 * as soon as the live instance is fatal.
 */
export function usingWildlifePetRosterPanelLivePets({
  isOpen,
  wildlifeStoreRef,
}: UsingWildlifePetRosterPanelLivePetsParams): readonly DefiningWildlifePetPersistedRecord[] {
  const rosterSnapshot = useSyncExternalStore(
    subscribingWildlifePetRoster,
    readingWildlifePetRosterSnapshot
  );
  const [liveRefreshToken, setLiveRefreshToken] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const refreshingLivePets = (): void => {
      const nowMs = Date.now();
      const store = wildlifeStoreRef.current;
      const pets = readingWildlifePetRosterSnapshot().pets;

      for (const record of pets) {
        if (checkingWildlifePetRosterRecordIsDeceased(record)) {
          continue;
        }

        const instance = findingWildlifeInstanceByPetId(store, record.petId);

        if (
          instance &&
          (instance.isDead || instance.healthState.currentHealth <= 0)
        ) {
          syncingWildlifePetDeathToRoster(instance, nowMs);
        }
      }

      setLiveRefreshToken((token) => token + 1);
    };

    refreshingLivePets();
    const intervalId = window.setInterval(
      refreshingLivePets,
      DEFINING_WILDLIFE_PET_ROSTER_PANEL_LIVE_REFRESH_INTERVAL_MS
    );

    return () => window.clearInterval(intervalId);
  }, [isOpen, wildlifeStoreRef]);

  return useMemo(
    () =>
      resolvingWildlifePetRosterPetsWithLiveVitalsFromStore(
        rosterSnapshot.pets,
        wildlifeStoreRef.current
      ),
    [liveRefreshToken, rosterSnapshot.pets, wildlifeStoreRef]
  );
}
