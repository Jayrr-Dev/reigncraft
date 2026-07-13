'use client';

import { deletingWorldBuildingDevvitSessionBlocks } from '@/components/world/building/repositories/callingWorldBuildingDevvitApi';
import { WORLD_BUILDING_DEVVIT_SESSION_BLOCKS_API_PATH } from '../../../../shared/worldBuildingDevvit';
import { useEffect, useRef } from 'react';

/**
 * Deletes session-scoped builds when the player leaves the plaza session.
 *
 * @module components/world/building/hooks/usingWorldPlazaSessionBuildingCleanup
 */

/**
 * Best-effort cleanup for session blocks on tab close and scene unmount.
 *
 * @param isEnabled - Whether the plaza world session is active.
 * @param onlineUserId - Authenticated Reddit user id.
 */
export function usingWorldPlazaSessionBuildingCleanup(
  isEnabled: boolean,
  onlineUserId: string | null,
): void {
  const onlineUserIdRef = useRef(onlineUserId);
  onlineUserIdRef.current = onlineUserId;

  useEffect(() => {
    if (!isEnabled || !onlineUserId) {
      return;
    }

    const deletingSessionBlocksOnExit = (): void => {
      if (!onlineUserIdRef.current) {
        return;
      }

      void deletingWorldBuildingDevvitSessionBlocks(
        WORLD_BUILDING_DEVVIT_SESSION_BLOCKS_API_PATH,
      ).catch(() => {
        // Best-effort cleanup when the tab closes.
      });
    };

    window.addEventListener('pagehide', deletingSessionBlocksOnExit);

    return () => {
      window.removeEventListener('pagehide', deletingSessionBlocksOnExit);
      deletingSessionBlocksOnExit();
    };
  }, [isEnabled, onlineUserId]);
}
