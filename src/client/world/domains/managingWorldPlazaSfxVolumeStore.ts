/**
 * Module-level store for plaza SFX volume.
 *
 * @module components/world/domains/managingWorldPlazaSfxVolumeStore
 */

import {
  DEFINING_WORLD_PLAZA_SFX_VOLUME_DEFAULT,
  DEFINING_WORLD_PLAZA_SFX_VOLUME_STORAGE_KEY,
} from '@/components/world/domains/definingWorldPlazaSfxVolumeConstants';

/** Mutable SFX volume state shared across plaza components. */
const managingWorldPlazaSfxVolumeState: {
  volume: number;
} = {
  volume: DEFINING_WORLD_PLAZA_SFX_VOLUME_DEFAULT,
};

/** React subscribers notified when SFX volume changes. */
const managingWorldPlazaSfxVolumeSubscribers = new Set<() => void>();

function clampingWorldPlazaSfxVolume(volume: number): number {
  if (!Number.isFinite(volume)) {
    return DEFINING_WORLD_PLAZA_SFX_VOLUME_DEFAULT;
  }

  return Math.min(1, Math.max(0, volume));
}

function readingWorldPlazaSfxVolumeFromStorage(): number {
  if (typeof window === 'undefined') {
    return DEFINING_WORLD_PLAZA_SFX_VOLUME_DEFAULT;
  }

  const storedValue = window.localStorage.getItem(
    DEFINING_WORLD_PLAZA_SFX_VOLUME_STORAGE_KEY
  );

  if (storedValue === null) {
    return DEFINING_WORLD_PLAZA_SFX_VOLUME_DEFAULT;
  }

  return clampingWorldPlazaSfxVolume(Number.parseFloat(storedValue));
}

function writingWorldPlazaSfxVolumeToStorage(volume: number): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    DEFINING_WORLD_PLAZA_SFX_VOLUME_STORAGE_KEY,
    String(volume)
  );
}

/** Hydrates SFX volume from localStorage once on the client. */
export function initializingWorldPlazaSfxVolumeStoreFromStorage(): void {
  const storedVolume = readingWorldPlazaSfxVolumeFromStorage();

  if (managingWorldPlazaSfxVolumeState.volume === storedVolume) {
    return;
  }

  managingWorldPlazaSfxVolumeState.volume = storedVolume;
  notifyingWorldPlazaSfxVolumeSubscribers();
}

/** Returns the current SFX volume (0–1). */
export function gettingWorldPlazaSfxVolume(): number {
  return managingWorldPlazaSfxVolumeState.volume;
}

/** Sets SFX volume and notifies subscribers. */
export function settingWorldPlazaSfxVolume(volume: number): void {
  const clampedVolume = clampingWorldPlazaSfxVolume(volume);

  if (managingWorldPlazaSfxVolumeState.volume === clampedVolume) {
    return;
  }

  managingWorldPlazaSfxVolumeState.volume = clampedVolume;
  writingWorldPlazaSfxVolumeToStorage(clampedVolume);
  notifyingWorldPlazaSfxVolumeSubscribers();
}

/** Subscribes to SFX volume changes. */
export function subscribingWorldPlazaSfxVolume(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaSfxVolumeSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaSfxVolumeSubscribers.delete(onStoreChange);
  };
}

function notifyingWorldPlazaSfxVolumeSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaSfxVolumeSubscribers) {
    onStoreChange();
  }
}
