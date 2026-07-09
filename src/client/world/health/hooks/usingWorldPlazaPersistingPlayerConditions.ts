'use client';

import { savingPlazaSinglePlayerSaveSlotData } from '@/components/home/repositories/callingPlazaSinglePlayerSavesDevvitApi';
import { advancingWorldPlazaEntityHealthDiseaseTick } from '@/components/world/health/domains/applyingWorldPlazaEntityDisease';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import {
  DEFINING_WORLD_PLAZA_PLAYER_CONDITIONS_CLOUD_SAVE_MIN_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_PLAYER_CONDITIONS_POLL_INTERVAL_MS,
} from '@/components/world/health/domains/definingWorldPlazaPlayerConditionsConstants';
import { resolvingWorldPlazaEntityDiseaseWorldEpochMs } from '@/components/world/health/domains/resolvingWorldPlazaEntityDiseaseWorldEpochMs';
import { serializingWorldPlazaPlayerConditionsFromHealthState } from '@/components/world/health/domains/serializingWorldPlazaPlayerConditions';
import {
  readingWorldPlazaPlayerConditionsFromStorage,
  writingWorldPlazaPlayerConditionsToStorage,
} from '@/components/world/health/domains/writingWorldPlazaPlayerConditionsToStorage';
import { useEffect, useRef } from 'react';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

export type UsingWorldPlazaPersistingPlayerConditionsParams = {
  isEnabled: boolean;
  localPersistenceOwnerId: string | null;
  redditUserId?: string | null;
  singlePlayerSaveSlotIndex?: PlazaSaveSlotIndex | null;
  healthStateRef: React.RefObject<DefiningWorldPlazaEntityHealthState>;
  onHydrated?: () => void;
};

function serializingWorldPlazaPlayerConditionsSnapshot(
  healthStateRef: React.RefObject<DefiningWorldPlazaEntityHealthState>
): string {
  const worldEpochMs = resolvingWorldPlazaEntityDiseaseWorldEpochMs();
  const playerConditions = serializingWorldPlazaPlayerConditionsFromHealthState(
    healthStateRef.current,
    worldEpochMs
  );

  return JSON.stringify(playerConditions);
}

/**
 * Hydrates and persists incubating/symptomatic diseases across sessions.
 */
export function usingWorldPlazaPersistingPlayerConditions({
  isEnabled,
  localPersistenceOwnerId,
  redditUserId,
  singlePlayerSaveSlotIndex,
  healthStateRef,
  onHydrated,
}: UsingWorldPlazaPersistingPlayerConditionsParams): void {
  const lastSnapshotRef = useRef<string | null>(null);
  const lastCloudSaveAtMsRef = useRef(0);
  const hasHydratedRef = useRef(false);

  useEffect(() => {
    if (!isEnabled || !localPersistenceOwnerId) {
      hasHydratedRef.current = false;
      lastSnapshotRef.current = null;
      return;
    }

    const worldEpochMs = resolvingWorldPlazaEntityDiseaseWorldEpochMs();
    const restoredPlayerConditions =
      readingWorldPlazaPlayerConditionsFromStorage(
        localPersistenceOwnerId,
        worldEpochMs
      );

    healthStateRef.current = {
      ...healthStateRef.current,
      diseaseEffects: restoredPlayerConditions.diseaseEffects,
      immuneSystemFactor: restoredPlayerConditions.immuneSystemFactor,
      diseaseImmunityIds: restoredPlayerConditions.diseaseImmunityIds,
    };

    if (restoredPlayerConditions.diseaseEffects.length > 0) {
      // Grant effects (bleed/poison/potential damage) must stamp simulation
      // time (`performance.now()`), not wall clock, or HUD countdowns explode.
      healthStateRef.current = advancingWorldPlazaEntityHealthDiseaseTick(
        healthStateRef.current,
        worldEpochMs,
        Math.random,
        performance.now()
      );
    }

    lastSnapshotRef.current =
      serializingWorldPlazaPlayerConditionsSnapshot(healthStateRef);
    hasHydratedRef.current = true;
    onHydrated?.();
  }, [healthStateRef, isEnabled, localPersistenceOwnerId, onHydrated]);

  useEffect(() => {
    if (!isEnabled || !localPersistenceOwnerId || !hasHydratedRef.current) {
      return;
    }

    const persistingPlayerConditions = (): void => {
      const nextSnapshot =
        serializingWorldPlazaPlayerConditionsSnapshot(healthStateRef);

      if (nextSnapshot === lastSnapshotRef.current) {
        return;
      }

      lastSnapshotRef.current = nextSnapshot;
      const worldEpochMs = resolvingWorldPlazaEntityDiseaseWorldEpochMs();
      const playerConditions =
        serializingWorldPlazaPlayerConditionsFromHealthState(
          healthStateRef.current,
          worldEpochMs
        );

      writingWorldPlazaPlayerConditionsToStorage(
        localPersistenceOwnerId,
        playerConditions
      );

      if (
        redditUserId &&
        singlePlayerSaveSlotIndex &&
        worldEpochMs - lastCloudSaveAtMsRef.current >=
          DEFINING_WORLD_PLAZA_PLAYER_CONDITIONS_CLOUD_SAVE_MIN_INTERVAL_MS
      ) {
        lastCloudSaveAtMsRef.current = worldEpochMs;
        void savingPlazaSinglePlayerSaveSlotData(singlePlayerSaveSlotIndex, {
          playerConditions,
        });
      }
    };

    const intervalId = window.setInterval(
      persistingPlayerConditions,
      DEFINING_WORLD_PLAZA_PLAYER_CONDITIONS_POLL_INTERVAL_MS
    );

    return () => {
      window.clearInterval(intervalId);
      persistingPlayerConditions();
    };
  }, [
    healthStateRef,
    isEnabled,
    localPersistenceOwnerId,
    redditUserId,
    singlePlayerSaveSlotIndex,
  ]);
}
