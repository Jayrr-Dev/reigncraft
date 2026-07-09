'use client';

/**
 * React subscription to the plaza auto-jump preference store.
 *
 * @module components/world/hooks/usingWorldPlazaMobileAutoJumpEnabled
 */

import { DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_DEFAULT_ENABLED_ON_MOBILE } from '@/components/world/domains/definingWorldPlazaMobileAutoJumpConstants';
import {
  gettingWorldPlazaMobileAutoJumpPreference,
  initializingWorldPlazaMobileAutoJumpStoreFromStorage,
  settingWorldPlazaMobileAutoJumpEnabled,
  subscribingWorldPlazaMobileAutoJumpEnabled,
} from '@/components/world/domains/managingWorldPlazaMobileAutoJumpStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCallback, useLayoutEffect, useSyncExternalStore } from 'react';

export type UsingWorldPlazaMobileAutoJumpEnabledResult = {
  /** True when auto-jump is active for the current viewport. */
  isMobileAutoJumpEnabled: boolean;
  /** Enables or disables auto-jump on every viewport. */
  settingMobileAutoJumpEnabled: (isEnabled: boolean) => void;
};

/**
 * Subscribes to the auto-jump preference store.
 *
 * Unset preference defaults on for mobile and off for desktop.
 */
export function usingWorldPlazaMobileAutoJumpEnabled(): UsingWorldPlazaMobileAutoJumpEnabledResult {
  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    initializingWorldPlazaMobileAutoJumpStoreFromStorage();
  }, []);

  const preference = useSyncExternalStore(
    subscribingWorldPlazaMobileAutoJumpEnabled,
    gettingWorldPlazaMobileAutoJumpPreference,
    () => null
  );

  const isMobileAutoJumpEnabled =
    preference !== null
      ? preference
      : Boolean(isMobile) &&
        DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_DEFAULT_ENABLED_ON_MOBILE;

  const settingMobileAutoJumpEnabled = useCallback(
    (isEnabled: boolean): void => {
      settingWorldPlazaMobileAutoJumpEnabled(isEnabled);
    },
    []
  );

  return {
    isMobileAutoJumpEnabled,
    settingMobileAutoJumpEnabled,
  };
}
