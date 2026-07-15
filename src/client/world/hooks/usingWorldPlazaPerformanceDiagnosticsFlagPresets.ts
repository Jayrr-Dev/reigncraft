'use client';

import {
  deletingWorldPlazaPerformanceDiagnosticsFlagPreset,
  gettingWorldPlazaPerformanceDiagnosticsFlagPresetRevision,
  initializingWorldPlazaPerformanceDiagnosticsFlagPresetStoreFromStorage,
  listingWorldPlazaPerformanceDiagnosticsFlagPresets,
  savingWorldPlazaPerformanceDiagnosticsFlagPreset,
  subscribingWorldPlazaPerformanceDiagnosticsFlagPresets,
} from '@/components/world/domains/managingWorldPlazaPerformanceDiagnosticsFlagPresetStore';
import { useLayoutEffect, useSyncExternalStore } from 'react';

/**
 * Subscribes React components to saved perf FLAGS presets.
 */
export function usingWorldPlazaPerformanceDiagnosticsFlagPresets(): {
  readonly presets: ReturnType<
    typeof listingWorldPlazaPerformanceDiagnosticsFlagPresets
  >;
  readonly revision: number;
  readonly savingPreset: typeof savingWorldPlazaPerformanceDiagnosticsFlagPreset;
  readonly deletingPreset: typeof deletingWorldPlazaPerformanceDiagnosticsFlagPreset;
} {
  useLayoutEffect(() => {
    initializingWorldPlazaPerformanceDiagnosticsFlagPresetStoreFromStorage();
  }, []);

  const revision = useSyncExternalStore(
    subscribingWorldPlazaPerformanceDiagnosticsFlagPresets,
    gettingWorldPlazaPerformanceDiagnosticsFlagPresetRevision,
    () => 0
  );
  const presets = useSyncExternalStore(
    subscribingWorldPlazaPerformanceDiagnosticsFlagPresets,
    listingWorldPlazaPerformanceDiagnosticsFlagPresets,
    () => []
  );

  return {
    presets,
    revision,
    savingPreset: savingWorldPlazaPerformanceDiagnosticsFlagPreset,
    deletingPreset: deletingWorldPlazaPerformanceDiagnosticsFlagPreset,
  };
}
