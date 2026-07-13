'use client';

/**
 * React subscription to the hide-actions (click-only labels) preference store.
 *
 * @module components/world/interaction/hooks/usingWorldPlazaHideActionsEnabled
 */

import { DEFINING_WORLD_PLAZA_HIDE_ACTIONS_DEFAULT_ENABLED } from '@/components/world/interaction/domains/definingWorldPlazaHideActionsPreferenceConstants';
import {
  checkingWorldPlazaHideActionsEnabled,
  initializingWorldPlazaHideActionsStoreFromStorage,
  settingWorldPlazaHideActionsEnabled,
  subscribingWorldPlazaHideActionsEnabled,
} from '@/components/world/interaction/domains/managingWorldPlazaHideActionsPreferenceStore';
import { useCallback, useLayoutEffect, useSyncExternalStore } from 'react';

export type UsingWorldPlazaHideActionsEnabledResult = {
  /** True when proximity action labels are hidden (click to show). */
  isHideActionsEnabled: boolean;
  /** Enables or disables hide-actions. */
  settingHideActionsEnabled: (isEnabled: boolean) => void;
};

/**
 * Subscribes to the hide-actions preference store.
 */
export function usingWorldPlazaHideActionsEnabled(): UsingWorldPlazaHideActionsEnabledResult {
  useLayoutEffect(() => {
    initializingWorldPlazaHideActionsStoreFromStorage();
  }, []);

  const isHideActionsEnabled = useSyncExternalStore(
    subscribingWorldPlazaHideActionsEnabled,
    checkingWorldPlazaHideActionsEnabled,
    () => DEFINING_WORLD_PLAZA_HIDE_ACTIONS_DEFAULT_ENABLED
  );

  const settingHideActionsEnabled = useCallback((isEnabled: boolean): void => {
    settingWorldPlazaHideActionsEnabled(isEnabled);
  }, []);

  return {
    isHideActionsEnabled,
    settingHideActionsEnabled,
  };
}
