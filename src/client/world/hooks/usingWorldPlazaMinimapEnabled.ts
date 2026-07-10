'use client';

/**
 * React subscription to the plaza minimap visibility preference store.
 *
 * @module components/world/hooks/usingWorldPlazaMinimapEnabled
 */

import { usingWorldPlazaPerformanceProfile } from '@/components/world/components/providingWorldPlazaPerformanceProfile';
import {
  DEFINING_WORLD_PLAZA_MINIMAP_DEFAULT_ENABLED_ON_DESKTOP,
  DEFINING_WORLD_PLAZA_MINIMAP_DEFAULT_ENABLED_ON_MOBILE,
} from '@/components/world/domains/definingWorldPlazaMinimapPreferenceConstants';
import {
  gettingWorldPlazaMinimapPreference,
  initializingWorldPlazaMinimapPreferenceStoreFromStorage,
  settingWorldPlazaMinimapEnabled,
  subscribingWorldPlazaMinimapEnabled,
} from '@/components/world/domains/managingWorldPlazaMinimapPreferenceStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCallback, useLayoutEffect, useSyncExternalStore } from 'react';

export type UsingWorldPlazaMinimapEnabledResult = {
  /** True when the player wants the minimap visible on this viewport. */
  isMinimapPreferenceEnabled: boolean;
  /** Enables or disables the minimap on every viewport. */
  settingMinimapEnabled: (isEnabled: boolean) => void;
};

/**
 * Subscribes to the minimap preference store.
 *
 * Unset preference defaults off on mobile and on for desktop.
 */
export function usingWorldPlazaMinimapEnabled(): UsingWorldPlazaMinimapEnabledResult {
  const isMobile = useIsMobile();
  const performanceProfile = usingWorldPlazaPerformanceProfile();

  useLayoutEffect(() => {
    initializingWorldPlazaMinimapPreferenceStoreFromStorage();
  }, []);

  const preference = useSyncExternalStore(
    subscribingWorldPlazaMinimapEnabled,
    gettingWorldPlazaMinimapPreference,
    () => null
  );

  const isMinimapPreferenceEnabled =
    preference !== null
      ? preference
      : performanceProfile.isMinimapEnabled &&
        (isMobile
          ? DEFINING_WORLD_PLAZA_MINIMAP_DEFAULT_ENABLED_ON_MOBILE
          : DEFINING_WORLD_PLAZA_MINIMAP_DEFAULT_ENABLED_ON_DESKTOP);

  const settingMinimapEnabled = useCallback((isEnabled: boolean): void => {
    settingWorldPlazaMinimapEnabled(isEnabled);
  }, []);

  return {
    isMinimapPreferenceEnabled,
    settingMinimapEnabled,
  };
}
