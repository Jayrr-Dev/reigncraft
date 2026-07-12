'use client';

import { savingPlazaSinglePlayerSaveSlotData } from '@/components/home/repositories/callingPlazaSinglePlayerSavesDevvitApi';
import { advancingWorldPlazaEntityHealthDiseaseTick } from '@/components/world/health/domains/applyingWorldPlazaEntityDisease';
import { computingWorldPlazaEntityHealthEffectiveMax } from '@/components/world/health/domains/computingWorldPlazaEntityHealthEffectiveMax';
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
import type { DefiningWorldPlazaHungerState } from '@/components/world/hunger/domains/definingWorldPlazaHungerTypes';
import { useEffect, useRef } from 'react';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

export type UsingWorldPlazaPersistingPlayerConditionsParams = {
  isEnabled: boolean;
  localPersistenceOwnerId: string | null;
  redditUserId?: string | null;
  singlePlayerSaveSlotIndex?: PlazaSaveSlotIndex | null;
  healthStateRef: React.RefObject<DefiningWorldPlazaEntityHealthState>;
  hungerStateRef: React.RefObject<DefiningWorldPlazaHungerState>;
  onHydrated?: () => void;
};

function serializingWorldPlazaPlayerConditionsSnapshot(
  healthStateRef: React.RefObject<DefiningWorldPlazaEntityHealthState>,
  hungerStateRef: React.RefObject<DefiningWorldPlazaHungerState>
): string {
  const worldEpochMs = resolvingWorldPlazaEntityDiseaseWorldEpochMs();
  const playerConditions = serializingWorldPlazaPlayerConditionsFromHealthState(
    {
      state: healthStateRef.current,
      worldEpochMs,
      hungerRatio: hungerStateRef.current.hungerRatio,
    }
  );

  return JSON.stringify(playerConditions);
}

/**
 * Hydrates and persists diseases, HP, and hunger across sessions.
 */
export function usingWorldPlazaPersistingPlayerConditions({
  isEnabled,
  localPersistenceOwnerId,
  redditUserId,
  singlePlayerSaveSlotIndex,
  healthStateRef,
  hungerStateRef,
  onHydrated,
}: UsingWorldPlazaPersistingPlayerConditionsParams): void {
  const lastSnapshotRef = useRef<string | null>(null);
  const lastCloudSaveAtMsRef = useRef(0);
  const hasHydratedRef = useRef(false);
  const onHydratedRef = useRef(onHydrated);
  onHydratedRef.current = onHydrated;

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

    if (restoredPlayerConditions.currentHealth !== null) {
      const effectiveMaxHealth = computingWorldPlazaEntityHealthEffectiveMax(
        healthStateRef.current,
        performance.now()
      );
      const currentHealth = Math.min(
        effectiveMaxHealth,
        Math.max(0, restoredPlayerConditions.currentHealth)
      );

      healthStateRef.current = {
        ...healthStateRef.current,
        currentHealth,
        isDead: currentHealth <= 0,
      };
    }

    if (restoredPlayerConditions.hungerRatio !== null) {
      hungerStateRef.current = {
        ...hungerStateRef.current,
        hungerRatio: restoredPlayerConditions.hungerRatio,
        lastStarvationTickAtMs: null,
      };
    }

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

    lastSnapshotRef.current = serializingWorldPlazaPlayerConditionsSnapshot(
      healthStateRef,
      hungerStateRef
    );
    hasHydratedRef.current = true;
    onHydratedRef.current?.();
  }, [healthStateRef, hungerStateRef, isEnabled, localPersistenceOwnerId]);

  useEffect(() => {
    if (!isEnabled || !localPersistenceOwnerId || !hasHydratedRef.current) {
      return;
    }

    const persistingPlayerConditions = (): void => {
      const nextSnapshot = serializingWorldPlazaPlayerConditionsSnapshot(
        healthStateRef,
        hungerStateRef
      );

      if (nextSnapshot === lastSnapshotRef.current) {
        return;
      }

      lastSnapshotRef.current = nextSnapshot;
      const worldEpochMs = resolvingWorldPlazaEntityDiseaseWorldEpochMs();
      const playerConditions =
        serializingWorldPlazaPlayerConditionsFromHealthState({
          state: healthStateRef.current,
          worldEpochMs,
          hungerRatio: hungerStateRef.current.hungerRatio,
        });

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

    const handlingPageHide = (): void => {
      persistingPlayerConditions();
    };

    const handlingVisibilityChange = (): void => {
      if (document.visibilityState === 'hidden') {
        persistingPlayerConditions();
      }
    };

    const intervalId = window.setInterval(
      persistingPlayerConditions,
      DEFINING_WORLD_PLAZA_PLAYER_CONDITIONS_POLL_INTERVAL_MS
    );

    window.addEventListener('pagehide', handlingPageHide);
    document.addEventListener('visibilitychange', handlingVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('pagehide', handlingPageHide);
      document.removeEventListener(
        'visibilitychange',
        handlingVisibilityChange
      );
      persistingPlayerConditions();
    };
  }, [
    healthStateRef,
    hungerStateRef,
    isEnabled,
    localPersistenceOwnerId,
    redditUserId,
    singlePlayerSaveSlotIndex,
  ]);
}
