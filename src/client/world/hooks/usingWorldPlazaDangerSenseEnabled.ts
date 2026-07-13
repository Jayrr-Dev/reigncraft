'use client';

/**
 * React subscription to the danger-sense HUD visibility preference store.
 *
 * @module components/world/hooks/usingWorldPlazaDangerSenseEnabled
 */

import {
  DEFINING_WORLD_PLAZA_DANGER_SENSE_DEFAULT_ENABLED,
} from '@/components/world/domains/definingWorldPlazaDangerSenseHudConstants';
import {
  checkingWorldPlazaDangerSenseEnabled,
  initializingWorldPlazaDangerSenseStoreFromStorage,
  settingWorldPlazaDangerSenseEnabled,
  subscribingWorldPlazaDangerSenseEnabled,
} from '@/components/world/domains/managingWorldPlazaDangerSensePreferenceStore';
import { useCallback, useLayoutEffect, useSyncExternalStore } from 'react';

export type UsingWorldPlazaDangerSenseEnabledResult = {
  /** True when the danger-sense rim vignette is shown. */
  isDangerSenseEnabled: boolean;
  /** Enables or disables danger-sense. */
  settingDangerSenseEnabled: (isEnabled: boolean) => void;
};

/**
 * Subscribes to the danger-sense preference store.
 */
export function usingWorldPlazaDangerSenseEnabled(): UsingWorldPlazaDangerSenseEnabledResult {
  useLayoutEffect(() => {
    initializingWorldPlazaDangerSenseStoreFromStorage();
  }, []);

  const isDangerSenseEnabled = useSyncExternalStore(
    subscribingWorldPlazaDangerSenseEnabled,
    checkingWorldPlazaDangerSenseEnabled,
    () => DEFINING_WORLD_PLAZA_DANGER_SENSE_DEFAULT_ENABLED
  );

  const settingDangerSenseEnabled = useCallback((isEnabled: boolean): void => {
    settingWorldPlazaDangerSenseEnabled(isEnabled);
  }, []);

  return {
    isDangerSenseEnabled,
    settingDangerSenseEnabled,
  };
}
