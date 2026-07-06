'use client';

import {
  gettingWorldPlazaMasterVolume,
  initializingWorldPlazaMasterVolumeStoreFromStorage,
  settingWorldPlazaMasterVolume,
  subscribingWorldPlazaMasterVolume,
} from '@/components/world/domains/managingWorldPlazaMasterVolumeStore';
import { useCallback, useLayoutEffect, useSyncExternalStore } from 'react';

export type UsingWorldPlazaMasterVolumeResult = {
  /** Current master volume from 0 to 1. */
  masterVolume: number;
  /** Updates master volume (0–1). */
  settingMasterVolume: (volume: number) => void;
};

/**
 * Subscribes to the plaza master volume store.
 */
export function usingWorldPlazaMasterVolume(): UsingWorldPlazaMasterVolumeResult {
  useLayoutEffect(() => {
    initializingWorldPlazaMasterVolumeStoreFromStorage();
  }, []);

  const masterVolume = useSyncExternalStore(
    subscribingWorldPlazaMasterVolume,
    gettingWorldPlazaMasterVolume,
    () => gettingWorldPlazaMasterVolume()
  );

  const settingMasterVolume = useCallback((volume: number): void => {
    settingWorldPlazaMasterVolume(volume);
  }, []);

  return {
    masterVolume,
    settingMasterVolume,
  };
}
