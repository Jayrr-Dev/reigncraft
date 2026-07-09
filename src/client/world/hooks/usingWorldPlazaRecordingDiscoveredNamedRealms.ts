'use client';

import { DEFINING_WORLD_PLAZA_DISCOVERED_NAMED_REALMS_POLL_INTERVAL_MS } from '@/components/world/domains/definingWorldPlazaNamedRealmConstants';
import { formattingWorldPlazaNamedRealmWelcomeMessage } from '@/components/world/domains/definingWorldPlazaWorldNotificationsConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  gettingWorldPlazaDiscoveredNamedRealmsSnapshot,
  initializingWorldPlazaDiscoveredNamedRealmsStore,
  recordingWorldPlazaDiscoveredNamedRealm,
} from '@/components/world/domains/managingWorldPlazaDiscoveredNamedRealmsStore';
import { enqueueingWorldPlazaWorldNotification } from '@/components/world/domains/managingWorldPlazaWorldNotificationsStore';
import { resolvingWorldPlazaNamedRealmAtWorldPoint } from '@/components/world/domains/resolvingWorldPlazaNamedRealmAtTileIndex';
import type { RefObject } from 'react';
import { useEffect } from 'react';

export type UsingWorldPlazaRecordingDiscoveredNamedRealmsOptions = {
  isEnabled: boolean;
  storageOwnerId: string | null;
  playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint | null>;
};

/**
 * Tracks first entry into each named realm and queues a worldNotification.
 *
 * First-ever discovery (spawn) uses "Welcome to {realm}". Later realm
 * discoveries show the realm title alone.
 */
export function usingWorldPlazaRecordingDiscoveredNamedRealms({
  isEnabled,
  storageOwnerId,
  playerPositionRef,
}: UsingWorldPlazaRecordingDiscoveredNamedRealmsOptions): void {
  useEffect(() => {
    initializingWorldPlazaDiscoveredNamedRealmsStore(storageOwnerId);
  }, [storageOwnerId]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const recordingCurrentNamedRealm = (): void => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      const realm = resolvingWorldPlazaNamedRealmAtWorldPoint(playerPosition);
      const isFirstSpawnWelcome =
        gettingWorldPlazaDiscoveredNamedRealmsSnapshot().length === 0;
      const didDiscover = recordingWorldPlazaDiscoveredNamedRealm(realm.realmId);

      if (!didDiscover) {
        return;
      }

      if (isFirstSpawnWelcome) {
        enqueueingWorldPlazaWorldNotification(
          'named-realm-discovery',
          formattingWorldPlazaNamedRealmWelcomeMessage(realm.displayName),
          { insertAtFront: true }
        );
        return;
      }

      enqueueingWorldPlazaWorldNotification(
        'named-realm-discovery',
        realm.displayName
      );
    };

    recordingCurrentNamedRealm();

    const intervalId = window.setInterval(
      recordingCurrentNamedRealm,
      DEFINING_WORLD_PLAZA_DISCOVERED_NAMED_REALMS_POLL_INTERVAL_MS
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isEnabled, playerPositionRef, storageOwnerId]);
}
