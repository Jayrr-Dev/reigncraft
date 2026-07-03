"use client";

import { useCallback, useState } from "react";

/** Result from {@link usingWorldPlazaSavedCoordsTrackingVisibleState}. */
export interface UsingWorldPlazaSavedCoordsTrackingVisibleStateResult {
  /** Saved coordinate id currently tracked by the direction arrow. */
  trackedSavedCoordsId: string | null;
  /** Toggles tracking for one saved coordinate row. */
  togglingSavedCoordsTracking: (savedCoordsId: string) => void;
  /** Clears the active saved-coordinate track target. */
  clearingSavedCoordsTracking: () => void;
}

/**
 * Runtime selection for which saved coordinate the direction arrow follows.
 */
export function usingWorldPlazaSavedCoordsTrackingVisibleState(): UsingWorldPlazaSavedCoordsTrackingVisibleStateResult {
  const [trackedSavedCoordsId, setTrackedSavedCoordsId] = useState<string | null>(
    null,
  );

  const togglingSavedCoordsTracking = useCallback((savedCoordsId: string): void => {
    setTrackedSavedCoordsId((currentTrackedSavedCoordsId) =>
      currentTrackedSavedCoordsId === savedCoordsId ? null : savedCoordsId,
    );
  }, []);

  const clearingSavedCoordsTracking = useCallback((): void => {
    setTrackedSavedCoordsId(null);
  }, []);

  return {
    trackedSavedCoordsId,
    togglingSavedCoordsTracking,
    clearingSavedCoordsTracking,
  };
}
