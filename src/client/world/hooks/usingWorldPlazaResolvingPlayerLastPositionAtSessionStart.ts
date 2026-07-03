"use client";

import { applyingWorldPlazaPlayerWorldPointFromLastPosition } from "@/components/world/domains/applyingWorldPlazaPlayerWorldPointFromLastPosition";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { writingWorldPlazaLastPositionToStorage } from "@/components/world/domains/writingWorldPlazaLastPositionToStorage";
import { usingWorldPlazaLastPositionQuery } from "@/components/world/hooks/usingWorldPlazaLastPositionQuery";
import { useLayoutEffect, useState } from "react";

/**
 * Restores the authenticated user's saved plaza position before the scene mounts.
 *
 * @module components/world/hooks/usingWorldPlazaResolvingPlayerLastPositionAtSessionStart
 */

/** Params for {@link usingWorldPlazaResolvingPlayerLastPositionAtSessionStart}. */
export interface UsingWorldPlazaResolvingPlayerLastPositionAtSessionStartParams {
  /** Auth user id, or null for guest sessions. */
  onlineUserId: string | null;
  /** Live local avatar position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
}

/**
 * Loads the remote last position and applies it before the plaza canvas renders.
 *
 * @param params - Auth identity and live avatar ref.
 * @returns True while the remote last position is still loading for auth users.
 */
export function usingWorldPlazaResolvingPlayerLastPositionAtSessionStart({
  onlineUserId,
  playerPositionRef,
}: UsingWorldPlazaResolvingPlayerLastPositionAtSessionStartParams): boolean {
  const { remoteLastPosition, isLoadingRemoteLastPosition } =
    usingWorldPlazaLastPositionQuery(onlineUserId);
  const [isResolvingLastPosition, setIsResolvingLastPosition] = useState(
    onlineUserId !== null,
  );

  useLayoutEffect(() => {
    if (onlineUserId === null) {
      setIsResolvingLastPosition(false);
      return;
    }

    if (isLoadingRemoteLastPosition) {
      setIsResolvingLastPosition(true);
      return;
    }

    if (remoteLastPosition) {
      applyingWorldPlazaPlayerWorldPointFromLastPosition(
        playerPositionRef,
        remoteLastPosition,
      );
      writingWorldPlazaLastPositionToStorage(remoteLastPosition, onlineUserId);
    }

    setIsResolvingLastPosition(false);
  }, [
    isLoadingRemoteLastPosition,
    onlineUserId,
    playerPositionRef,
    remoteLastPosition,
  ]);

  return isResolvingLastPosition;
}
