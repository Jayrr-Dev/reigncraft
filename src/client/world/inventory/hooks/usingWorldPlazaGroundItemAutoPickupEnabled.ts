'use client';

/**
 * React subscription to the ground-item auto-pickup preference store.
 *
 * @module components/world/inventory/hooks/usingWorldPlazaGroundItemAutoPickupEnabled
 */

import { DEFINING_WORLD_PLAZA_GROUND_ITEM_AUTO_PICKUP_DEFAULT_ENABLED } from '@/components/world/inventory/domains/definingWorldPlazaGroundItemAutoPickupPreferenceConstants';
import {
  checkingWorldPlazaGroundItemAutoPickupEnabled,
  initializingWorldPlazaGroundItemAutoPickupStoreFromStorage,
  settingWorldPlazaGroundItemAutoPickupEnabled,
  subscribingWorldPlazaGroundItemAutoPickupEnabled,
} from '@/components/world/inventory/domains/managingWorldPlazaGroundItemAutoPickupPreferenceStore';
import { useCallback, useLayoutEffect, useSyncExternalStore } from 'react';

export type UsingWorldPlazaGroundItemAutoPickupEnabledResult = {
  /** True when walk-over auto-pickup is enabled. */
  isGroundItemAutoPickupEnabled: boolean;
  /** Enables or disables walk-over auto-pickup. */
  settingGroundItemAutoPickupEnabled: (isEnabled: boolean) => void;
};

/**
 * Subscribes to the ground-item auto-pickup preference store.
 */
export function usingWorldPlazaGroundItemAutoPickupEnabled(): UsingWorldPlazaGroundItemAutoPickupEnabledResult {
  useLayoutEffect(() => {
    initializingWorldPlazaGroundItemAutoPickupStoreFromStorage();
  }, []);

  const isGroundItemAutoPickupEnabled = useSyncExternalStore(
    subscribingWorldPlazaGroundItemAutoPickupEnabled,
    checkingWorldPlazaGroundItemAutoPickupEnabled,
    () => DEFINING_WORLD_PLAZA_GROUND_ITEM_AUTO_PICKUP_DEFAULT_ENABLED
  );

  const settingGroundItemAutoPickupEnabled = useCallback(
    (isEnabled: boolean): void => {
      settingWorldPlazaGroundItemAutoPickupEnabled(isEnabled);
    },
    []
  );

  return {
    isGroundItemAutoPickupEnabled,
    settingGroundItemAutoPickupEnabled,
  };
}
