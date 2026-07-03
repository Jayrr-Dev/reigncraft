"use client";

import {
  checkingWorldPlazaIslandModeFeatureEnabled,
  gettingWorldPlazaIslandModeFeatureRevision,
  initializingWorldPlazaIslandModeFeatureStoreFromStorage,
  settingWorldPlazaIslandModeFeatureEnabled,
  subscribingWorldPlazaIslandModeFeatureEnabled,
} from "@/components/world/domains/managingWorldPlazaIslandModeFeatureStore";
import { useCallback, useLayoutEffect, useSyncExternalStore } from "react";
export interface UsingWorldPlazaIslandModeFeatureEnabledStateResult {
  /** True when the island world layout override is active. */
  isIslandModeEnabled: boolean;
  /** Bumps whenever island mode toggles so terrain can rebuild. */
  islandModeRevision: number;
  /** Enables or disables island mode. */
  settingIslandModeEnabled: (isEnabled: boolean) => void;
}

/**
 * Subscribes to the island world feature toggle store.
 */
export function usingWorldPlazaIslandModeFeatureEnabledState(): UsingWorldPlazaIslandModeFeatureEnabledStateResult {
  useLayoutEffect(() => {
    initializingWorldPlazaIslandModeFeatureStoreFromStorage();
  }, []);

  const isIslandModeEnabled = useSyncExternalStore(
    subscribingWorldPlazaIslandModeFeatureEnabled,
    checkingWorldPlazaIslandModeFeatureEnabled,
    () => false,
  );
  const islandModeRevision = useSyncExternalStore(
    subscribingWorldPlazaIslandModeFeatureEnabled,
    gettingWorldPlazaIslandModeFeatureRevision,
    () => 0,
  );

  const settingIslandModeEnabled = useCallback((isEnabled: boolean): void => {
    settingWorldPlazaIslandModeFeatureEnabled(isEnabled);
  }, []);

  return {
    isIslandModeEnabled,
    islandModeRevision,
    settingIslandModeEnabled,
  };
}
