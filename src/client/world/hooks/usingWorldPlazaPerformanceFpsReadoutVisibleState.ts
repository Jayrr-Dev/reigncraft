'use client';

import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_DEFAULT_VISIBLE,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_VISIBLE_STORAGE_KEY,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsUiConstants';
import { useCallback, useEffect, useState } from 'react';

/** Result from {@link usingWorldPlazaPerformanceFpsReadoutVisibleState}. */
export type UsingWorldPlazaPerformanceFpsReadoutVisibleStateResult = {
  /** True when the corner FPS counter is visible. */
  isFpsReadoutVisible: boolean;
  /** Flips corner FPS counter visibility. */
  togglingFpsReadoutVisible: () => void;
};

/**
 * Reads the persisted FPS readout flag from session storage.
 */
function readingWorldPlazaPerformanceFpsReadoutVisibleFromStorage(): boolean {
  if (typeof window === 'undefined') {
    return DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_DEFAULT_VISIBLE;
  }

  const storedValue = window.sessionStorage.getItem(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_VISIBLE_STORAGE_KEY
  );

  if (storedValue === null) {
    return DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_DEFAULT_VISIBLE;
  }

  return storedValue === 'true';
}

/**
 * Persists the FPS readout flag to session storage.
 *
 * @param isVisible - True when the corner FPS counter should stay on.
 */
function writingWorldPlazaPerformanceFpsReadoutVisibleToStorage(
  isVisible: boolean
): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_VISIBLE_STORAGE_KEY,
    String(isVisible)
  );
}

/**
 * Runtime toggle for the plaza corner FPS readout.
 */
export function usingWorldPlazaPerformanceFpsReadoutVisibleState(
  isFeatureAvailable: boolean
): UsingWorldPlazaPerformanceFpsReadoutVisibleStateResult {
  const [isFpsReadoutVisible, setIsFpsReadoutVisible] = useState<boolean>(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_DEFAULT_VISIBLE
  );

  useEffect(() => {
    if (!isFeatureAvailable) {
      setIsFpsReadoutVisible(false);
      return;
    }

    setIsFpsReadoutVisible(
      readingWorldPlazaPerformanceFpsReadoutVisibleFromStorage()
    );
  }, [isFeatureAvailable]);

  const togglingFpsReadoutVisible = useCallback((): void => {
    setIsFpsReadoutVisible((isVisible) => {
      const nextIsVisible = !isVisible;
      writingWorldPlazaPerformanceFpsReadoutVisibleToStorage(nextIsVisible);
      return nextIsVisible;
    });
  }, []);

  return {
    isFpsReadoutVisible: isFeatureAvailable && isFpsReadoutVisible,
    togglingFpsReadoutVisible,
  };
}
