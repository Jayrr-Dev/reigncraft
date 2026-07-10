'use client';

import {
  gettingWorldPlazaAmbienceVolume,
  initializingWorldPlazaAmbienceVolumeStoreFromStorage,
  settingWorldPlazaAmbienceVolume,
  subscribingWorldPlazaAmbienceVolume,
} from '@/components/world/domains/managingWorldPlazaAmbienceVolumeStore';
import { useCallback, useLayoutEffect, useSyncExternalStore } from 'react';

export type UsingWorldPlazaAmbienceVolumeResult = {
  /** Current ambience volume from 0 to 1. */
  ambienceVolume: number;
  /** Updates ambience volume (0–1). */
  settingAmbienceVolume: (volume: number) => void;
};

/**
 * Subscribes to the plaza ambience volume store.
 */
export function usingWorldPlazaAmbienceVolume(): UsingWorldPlazaAmbienceVolumeResult {
  useLayoutEffect(() => {
    initializingWorldPlazaAmbienceVolumeStoreFromStorage();
  }, []);

  const ambienceVolume = useSyncExternalStore(
    subscribingWorldPlazaAmbienceVolume,
    gettingWorldPlazaAmbienceVolume,
    () => gettingWorldPlazaAmbienceVolume()
  );

  const settingAmbienceVolume = useCallback((volume: number): void => {
    settingWorldPlazaAmbienceVolume(volume);
  }, []);

  return {
    ambienceVolume,
    settingAmbienceVolume,
  };
}
