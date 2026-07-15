'use client';

import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_DEFAULT_VISIBLE } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsUiConstants';
import {
  checkingWorldPlazaPerformanceFpsReadoutVisible,
  initializingWorldPlazaPerformanceFpsReadoutVisibleStoreFromStorage,
  settingWorldPlazaPerformanceFpsReadoutVisible,
  subscribingWorldPlazaPerformanceFpsReadoutVisible,
} from '@/components/world/domains/managingWorldPlazaPerformanceFpsReadoutVisibleStore';
import { useCallback, useLayoutEffect, useSyncExternalStore } from 'react';

/** Result from {@link usingWorldPlazaPerformanceFpsReadoutVisibleState}. */
export type UsingWorldPlazaPerformanceFpsReadoutVisibleStateResult = {
  /** True when the corner FPS counter is visible. */
  isFpsReadoutVisible: boolean;
  /** Enables or disables the corner FPS counter. */
  settingFpsReadoutVisible: (isVisible: boolean) => void;
};

/**
 * Runtime toggle for the plaza corner FPS readout (Settings → Toggles).
 */
export function usingWorldPlazaPerformanceFpsReadoutVisibleState(): UsingWorldPlazaPerformanceFpsReadoutVisibleStateResult {
  useLayoutEffect(() => {
    initializingWorldPlazaPerformanceFpsReadoutVisibleStoreFromStorage();
  }, []);

  const isFpsReadoutVisible = useSyncExternalStore(
    subscribingWorldPlazaPerformanceFpsReadoutVisible,
    checkingWorldPlazaPerformanceFpsReadoutVisible,
    () =>
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_DEFAULT_VISIBLE
  );

  const settingFpsReadoutVisible = useCallback((isVisible: boolean): void => {
    settingWorldPlazaPerformanceFpsReadoutVisible(isVisible);
  }, []);

  return {
    isFpsReadoutVisible,
    settingFpsReadoutVisible,
  };
}
