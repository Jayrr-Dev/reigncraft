'use client';

/**
 * Boots the bonded companion roster store, spawns the active pet near the
 * owner, mirrors to the multiplayer roster API when signed in online, and
 * periodically syncs the live instance's vitals back to the roster.
 *
 * @module components/world/wildlife/pets/hooks/usingWildlifeActivePetSpawn
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  gettingWildlifeInstance,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { checkingWildlifePetRosterRecordIsLivingActive } from '@/components/world/wildlife/pets/domains/checkingWildlifePetRosterDeployable';
import {
  initializingWildlifePetRosterStore,
  readingWildlifePetRosterSnapshot,
  replacingWildlifePetRosterFromSnapshot,
  settingWildlifePetRosterMultiplayerMirrorEnabled,
  subscribingWildlifePetRoster,
} from '@/components/world/wildlife/pets/domains/managingWildlifePetRosterStore';
import {
  formattingWildlifePetInstanceId,
  spawningWildlifeActivePetNearOwner,
} from '@/components/world/wildlife/pets/domains/spawningWildlifeActivePetNearOwner';
import { syncingWildlifePetInstanceVitalsToRoster } from '@/components/world/wildlife/pets/domains/syncingWildlifePetBondToRoster';
import { fetchingPlazaPetsMultiplayerRoster } from '@/components/world/wildlife/pets/repositories/callingPlazaPetsDevvitApi';
import type { RefObject } from 'react';
import { useEffect, useMemo, useSyncExternalStore } from 'react';
import type { PlazaSaveSlotIndex } from '../../../../../shared/plazaGameSession';

/** Interval for re-checking the active pet spawn (idempotent). */
const USING_WILDLIFE_ACTIVE_PET_SPAWN_CHECK_INTERVAL_MS = 2_000;

/** Interval for mirroring the active pet's vitals back to the roster. */
const USING_WILDLIFE_ACTIVE_PET_VITALS_SYNC_INTERVAL_MS = 5_000;

export type UsingWildlifeActivePetSpawnParams = {
  isEnabled: boolean;
  /** Local guest/single-player persistence owner id, or null. */
  storageOwnerId: string | null;
  /** Signed-in Reddit user id in an online room; mirrors via the plaza pets API. */
  onlineUserId: string | null;
  wildlifeStoreRef: RefObject<ManagingWildlifeInstanceStore>;
  playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint | null>;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
  cloudSaveSlotIndex?: PlazaSaveSlotIndex | null;
};

export type UsingWildlifeActivePetSpawnResult = {
  /** Live wildlife instance id of the roster's active pet, or null when none. */
  activePetInstanceId: string | null;
};

/**
 * Initializes the pet roster store for the current owner, keeps the active
 * companion spawned near the owner, and periodically syncs vitals + the
 * multiplayer mirror.
 */
export function usingWildlifeActivePetSpawn({
  isEnabled,
  storageOwnerId,
  onlineUserId,
  wildlifeStoreRef,
  playerPositionRef,
  resolveSpecies,
  cloudSaveSlotIndex = null,
}: UsingWildlifeActivePetSpawnParams): UsingWildlifeActivePetSpawnResult {
  const rosterSnapshot = useSyncExternalStore(
    subscribingWildlifePetRoster,
    readingWildlifePetRosterSnapshot
  );
  const isMultiplayerOnline = onlineUserId !== null;
  const ownerUserId = onlineUserId ?? storageOwnerId;

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    initializingWildlifePetRosterStore(storageOwnerId, { cloudSaveSlotIndex });
  }, [cloudSaveSlotIndex, isEnabled, storageOwnerId]);

  useEffect(() => {
    if (!isEnabled || !isMultiplayerOnline) {
      settingWildlifePetRosterMultiplayerMirrorEnabled(false);
      return;
    }

    let cancelled = false;

    void fetchingPlazaPetsMultiplayerRoster()
      .then((remoteRoster) => {
        if (cancelled || !remoteRoster) {
          return;
        }

        replacingWildlifePetRosterFromSnapshot(remoteRoster);
      })
      .catch(() => {
        // Best-effort hydrate; localStorage remains the session cache.
      })
      .finally(() => {
        if (!cancelled) {
          settingWildlifePetRosterMultiplayerMirrorEnabled(true);
        }
      });

    return () => {
      cancelled = true;
      settingWildlifePetRosterMultiplayerMirrorEnabled(false);
    };
  }, [isEnabled, isMultiplayerOnline]);

  const activeLivingRecords = useMemo(
    () =>
      rosterSnapshot.pets.filter(checkingWildlifePetRosterRecordIsLivingActive),
    [rosterSnapshot.pets]
  );
  const activePetInstanceId =
    activeLivingRecords.length > 0
      ? formattingWildlifePetInstanceId(
          rosterSnapshot.activePetId &&
            activeLivingRecords.some(
              (pet) => pet.petId === rosterSnapshot.activePetId
            )
            ? rosterSnapshot.activePetId
            : activeLivingRecords[0]!.petId
        )
      : null;

  useEffect(() => {
    if (!isEnabled || !ownerUserId || activeLivingRecords.length === 0) {
      return;
    }

    const spawningIfMissing = (): void => {
      const ownerPosition = playerPositionRef.current;

      if (!ownerPosition) {
        return;
      }

      for (const record of activeLivingRecords) {
        spawningWildlifeActivePetNearOwner({
          store: wildlifeStoreRef.current,
          ownerUserId,
          ownerPosition,
          record,
          resolveSpecies,
          nowMs: Date.now(),
        });
      }
    };

    spawningIfMissing();
    const intervalId = window.setInterval(
      spawningIfMissing,
      USING_WILDLIFE_ACTIVE_PET_SPAWN_CHECK_INTERVAL_MS
    );

    return () => window.clearInterval(intervalId);
  }, [
    activeLivingRecords,
    isEnabled,
    ownerUserId,
    playerPositionRef,
    resolveSpecies,
    wildlifeStoreRef,
  ]);

  useEffect(() => {
    if (!isEnabled || activeLivingRecords.length === 0) {
      return;
    }

    const syncingVitals = (): void => {
      for (const record of activeLivingRecords) {
        const instance = gettingWildlifeInstance(
          wildlifeStoreRef.current,
          formattingWildlifePetInstanceId(record.petId)
        );

        if (!instance) {
          continue;
        }

        syncingWildlifePetInstanceVitalsToRoster(instance, Date.now());
      }
    };

    const intervalId = window.setInterval(
      syncingVitals,
      USING_WILDLIFE_ACTIVE_PET_VITALS_SYNC_INTERVAL_MS
    );

    return () => window.clearInterval(intervalId);
  }, [activeLivingRecords, isEnabled, wildlifeStoreRef]);

  return { activePetInstanceId };
}
