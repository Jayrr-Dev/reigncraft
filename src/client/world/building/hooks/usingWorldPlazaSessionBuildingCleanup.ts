'use client';

import { deletingWorldBuildingDevvitSessionBlocks } from '@/components/world/building/repositories/callingWorldBuildingDevvitApi';
import { useEffect, useRef } from 'react';
import { WORLD_BUILDING_DEVVIT_SESSION_BLOCKS_API_PATH } from '../../../../shared/worldBuildingDevvit';

/**
 * Deletes session-scoped builds when the player leaves the plaza session.
 *
 * @module components/world/building/hooks/usingWorldPlazaSessionBuildingCleanup
 */

function deletingSessionBlocksBestEffort(): void {
  void deletingWorldBuildingDevvitSessionBlocks(
    WORLD_BUILDING_DEVVIT_SESSION_BLOCKS_API_PATH
  ).catch(() => {
    // Best-effort cleanup when the tab closes or the plaza session ends.
  });
}

/**
 * Best-effort cleanup for session blocks on tab close and real session exit.
 *
 * Do not delete on React effect cleanup while the session is still enabled:
 * Strict Mode remounts and scene remounts would wipe a just-placed unclaimed
 * campfire. Leave signals are `pagehide` and `isEnabled` flipping to false.
 *
 * @param isEnabled - Whether the plaza world session is active.
 * @param onlineUserId - Authenticated Reddit user id.
 */
export function usingWorldPlazaSessionBuildingCleanup(
  isEnabled: boolean,
  onlineUserId: string | null
): void {
  const onlineUserIdRef = useRef(onlineUserId);
  onlineUserIdRef.current = onlineUserId;
  const wasSessionActiveRef = useRef(false);

  useEffect(() => {
    const wasSessionActive = wasSessionActiveRef.current;
    const isSessionActive = isEnabled && onlineUserId !== null;
    wasSessionActiveRef.current = isSessionActive;

    if (wasSessionActive && !isSessionActive) {
      deletingSessionBlocksBestEffort();
    }
  }, [isEnabled, onlineUserId]);

  useEffect(() => {
    if (!isEnabled || !onlineUserId) {
      return;
    }

    const deletingSessionBlocksOnExit = (): void => {
      if (!onlineUserIdRef.current) {
        return;
      }

      deletingSessionBlocksBestEffort();
    };

    window.addEventListener('pagehide', deletingSessionBlocksOnExit);

    return () => {
      window.removeEventListener('pagehide', deletingSessionBlocksOnExit);
    };
  }, [isEnabled, onlineUserId]);
}
