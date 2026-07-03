"use client";

import { useCallback, useState } from "react";

/** Result from {@link usingWorldPlazaFeaturesDebugVisibleState}. */
export interface UsingWorldPlazaFeaturesDebugVisibleStateResult {
  /** True when the Features panel is open. */
  isFeaturesDebugVisible: boolean;
  /** Flips Features panel visibility. */
  togglingFeaturesDebugVisible: () => void;
}

/**
 * Runtime toggle for the plaza Features debug panel.
 */
export function usingWorldPlazaFeaturesDebugVisibleState(): UsingWorldPlazaFeaturesDebugVisibleStateResult {
  const [isFeaturesDebugVisible, setIsFeaturesDebugVisible] = useState(false);

  const togglingFeaturesDebugVisible = useCallback((): void => {
    setIsFeaturesDebugVisible((isVisible) => !isVisible);
  }, []);

  return {
    isFeaturesDebugVisible,
    togglingFeaturesDebugVisible,
  };
}
