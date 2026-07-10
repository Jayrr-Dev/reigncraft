'use client';

import {
  gettingWorldPlazaSfxVolume,
  initializingWorldPlazaSfxVolumeStoreFromStorage,
  settingWorldPlazaSfxVolume,
  subscribingWorldPlazaSfxVolume,
} from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import { useCallback, useLayoutEffect, useSyncExternalStore } from 'react';

export type UsingWorldPlazaSfxVolumeResult = {
  /** Current SFX volume from 0 to 1. */
  sfxVolume: number;
  /** Updates SFX volume (0–1). */
  settingSfxVolume: (volume: number) => void;
};

/**
 * Subscribes to the plaza SFX volume store.
 */
export function usingWorldPlazaSfxVolume(): UsingWorldPlazaSfxVolumeResult {
  useLayoutEffect(() => {
    initializingWorldPlazaSfxVolumeStoreFromStorage();
  }, []);

  const sfxVolume = useSyncExternalStore(
    subscribingWorldPlazaSfxVolume,
    gettingWorldPlazaSfxVolume,
    () => gettingWorldPlazaSfxVolume()
  );

  const settingSfxVolume = useCallback((volume: number): void => {
    settingWorldPlazaSfxVolume(volume);
  }, []);

  return {
    sfxVolume,
    settingSfxVolume,
  };
}
