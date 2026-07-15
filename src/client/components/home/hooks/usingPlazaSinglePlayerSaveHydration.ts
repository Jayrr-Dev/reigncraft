'use client';

import { hydratingPlazaSinglePlayerSaveSlotFromRemote } from '@/components/home/domains/hydratingPlazaSinglePlayerSaveSlotFromRemote';
import { initializingWorldPlazaWorldSeedStore } from '@/components/world/domains/managingWorldPlazaWorldSeedStore';
import { useEffect, useState } from 'react';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

/** Params for {@link usingPlazaSinglePlayerSaveHydration}. */
export type UsingPlazaSinglePlayerSaveHydrationParams = {
  /** Reddit user id for remote saves, or null when offline-only. */
  redditUserId: string | null;
  /** Active save slot (1–3), or null when not in single-player. */
  saveSlotIndex: PlazaSaveSlotIndex | null;
  /** Scoped localStorage owner id for the active slot. */
  localPersistenceOwnerId: string | null;
};

/**
 * Activates the world generation seed before the plaza scene mounts.
 */
function ensuringPlazaSessionWorldSeedReady(
  saveSlotIndex: PlazaSaveSlotIndex | null,
  localPersistenceOwnerId: string | null
): void {
  initializingWorldPlazaWorldSeedStore(localPersistenceOwnerId, {
    cloudSaveSlotIndex: saveSlotIndex,
    useFixedLegacySeed: saveSlotIndex === null,
  });
}

/**
 * Hydrates local save storage from Devvit Redis before a single-player session starts.
 */
export function usingPlazaSinglePlayerSaveHydration({
  redditUserId,
  saveSlotIndex,
  localPersistenceOwnerId,
}: UsingPlazaSinglePlayerSaveHydrationParams): boolean {
  const [isHydrating, setIsHydrating] = useState(
    redditUserId !== null &&
      saveSlotIndex !== null &&
      localPersistenceOwnerId !== null
  );

  useEffect(() => {
    if (
      redditUserId === null ||
      saveSlotIndex === null ||
      localPersistenceOwnerId === null
    ) {
      ensuringPlazaSessionWorldSeedReady(
        saveSlotIndex,
        localPersistenceOwnerId
      );
      setIsHydrating(false);
      return;
    }

    let isCancelled = false;

    const hydratingSaveSlot = async (): Promise<void> => {
      try {
        await hydratingPlazaSinglePlayerSaveSlotFromRemote(
          saveSlotIndex,
          localPersistenceOwnerId
        );
      } catch {
        // Fall back to local cache when remote hydration fails.
      } finally {
        if (!isCancelled) {
          ensuringPlazaSessionWorldSeedReady(
            saveSlotIndex,
            localPersistenceOwnerId
          );
          setIsHydrating(false);
        }
      }
    };

    void hydratingSaveSlot();

    return () => {
      isCancelled = true;
    };
  }, [redditUserId, saveSlotIndex, localPersistenceOwnerId]);

  return isHydrating;
}
