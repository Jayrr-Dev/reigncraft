"use client";

/**
 * Local state for which plaza friend is currently being tracked.
 *
 * @module components/world/hooks/usingWorldPlazaFriendTrackingState
 */

import { useCallback, useState } from "react";

/** Result from {@link usingWorldPlazaFriendTrackingState}. */
export interface UsingWorldPlazaFriendTrackingStateResult {
  /** Auth user id of the friend being tracked, or null when idle. */
  trackedFriendUserId: string | null;
  /** Shows the direction arrow for one friend; toggles off when the same id is passed again. */
  togglingFriendTracking: (friendUserId: string) => void;
  /** Clears any active friend tracking. */
  clearingFriendTracking: () => void;
}

/**
 * Tracks which friend's direction arrow is shown in the plaza.
 */
export function usingWorldPlazaFriendTrackingState(): UsingWorldPlazaFriendTrackingStateResult {
  const [trackedFriendUserId, setTrackedFriendUserId] = useState<string | null>(
    null,
  );

  const togglingFriendTracking = useCallback((friendUserId: string): void => {
    setTrackedFriendUserId((currentTrackedFriendUserId) =>
      currentTrackedFriendUserId === friendUserId ? null : friendUserId,
    );
  }, []);

  const clearingFriendTracking = useCallback((): void => {
    setTrackedFriendUserId(null);
  }, []);

  return {
    trackedFriendUserId,
    togglingFriendTracking,
    clearingFriendTracking,
  };
}
