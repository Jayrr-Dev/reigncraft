'use client';

import { hydratingPlazaSinglePlayerSaveSlotFromRemote } from '@/components/home/domains/hydratingPlazaSinglePlayerSaveSlotFromRemote';
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
