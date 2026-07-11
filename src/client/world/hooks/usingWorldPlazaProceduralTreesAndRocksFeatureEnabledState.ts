'use client';

import {
  checkingWorldPlazaProceduralTreesAndRocksFeatureEnabled,
  gettingWorldPlazaProceduralTreesAndRocksFeatureRevision,
  initializingWorldPlazaProceduralTreesAndRocksFeatureStoreFromStorage,
  settingWorldPlazaProceduralTreesAndRocksFeatureEnabled,
  subscribingWorldPlazaProceduralTreesAndRocksFeatureEnabled,
} from '@/components/world/domains/managingWorldPlazaProceduralTreesAndRocksFeatureStore';
import { useCallback, useLayoutEffect, useSyncExternalStore } from 'react';

export type UsingWorldPlazaProceduralTreesAndRocksFeatureEnabledStateResult = {
  /** True when procedural trees and rocks spawn and render. */
  isProceduralTreesAndRocksEnabled: boolean;
  /** Bumps whenever the toggle flips so terrain can rebuild. */
  proceduralTreesAndRocksRevision: number;
  /** Enables or disables procedural trees and rocks. */
  settingProceduralTreesAndRocksEnabled: (isEnabled: boolean) => void;
};

/**
 * Subscribes to the procedural trees and rocks feature toggle store.
 */
export function usingWorldPlazaProceduralTreesAndRocksFeatureEnabledState(): UsingWorldPlazaProceduralTreesAndRocksFeatureEnabledStateResult {
  useLayoutEffect(() => {
    initializingWorldPlazaProceduralTreesAndRocksFeatureStoreFromStorage();
  }, []);

  const isProceduralTreesAndRocksEnabled = useSyncExternalStore(
    subscribingWorldPlazaProceduralTreesAndRocksFeatureEnabled,
    checkingWorldPlazaProceduralTreesAndRocksFeatureEnabled,
    () => false
  );
  const proceduralTreesAndRocksRevision = useSyncExternalStore(
    subscribingWorldPlazaProceduralTreesAndRocksFeatureEnabled,
    gettingWorldPlazaProceduralTreesAndRocksFeatureRevision,
    () => 0
  );

  const settingProceduralTreesAndRocksEnabled = useCallback(
    (isEnabled: boolean): void => {
      settingWorldPlazaProceduralTreesAndRocksFeatureEnabled(isEnabled);
    },
    []
  );

  return {
    isProceduralTreesAndRocksEnabled,
    proceduralTreesAndRocksRevision,
    settingProceduralTreesAndRocksEnabled,
  };
}
