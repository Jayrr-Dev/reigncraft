/**
 * Module-level store for plaza ambience volume.
 *
 * @module components/world/domains/managingWorldPlazaAmbienceVolumeStore
 */

import {
  DEFINING_WORLD_PLAZA_AMBIENCE_ENABLED,
  DEFINING_WORLD_PLAZA_AMBIENCE_VOLUME_DEFAULT,
  DEFINING_WORLD_PLAZA_AMBIENCE_VOLUME_STORAGE_KEY,
} from '@/components/world/domains/definingWorldPlazaAmbienceVolumeConstants';

/** Mutable ambience volume state shared across plaza components. */
const managingWorldPlazaAmbienceVolumeState: {
  volume: number;
} = {
  volume: DEFINING_WORLD_PLAZA_AMBIENCE_VOLUME_DEFAULT,
};

/** React subscribers notified when ambience volume changes. */
const managingWorldPlazaAmbienceVolumeSubscribers = new Set<() => void>();

function clampingWorldPlazaAmbienceVolume(volume: number): number {
  if (!Number.isFinite(volume)) {
    return DEFINING_WORLD_PLAZA_AMBIENCE_VOLUME_DEFAULT;
  }

  return Math.min(1, Math.max(0, volume));
}

function readingWorldPlazaAmbienceVolumeFromStorage(): number {
  if (typeof window === 'undefined') {
    return DEFINING_WORLD_PLAZA_AMBIENCE_VOLUME_DEFAULT;
  }

  const storedValue = window.localStorage.getItem(
    DEFINING_WORLD_PLAZA_AMBIENCE_VOLUME_STORAGE_KEY
  );

  if (storedValue === null) {
    return DEFINING_WORLD_PLAZA_AMBIENCE_VOLUME_DEFAULT;
  }

  return clampingWorldPlazaAmbienceVolume(Number.parseFloat(storedValue));
}

function writingWorldPlazaAmbienceVolumeToStorage(volume: number): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    DEFINING_WORLD_PLAZA_AMBIENCE_VOLUME_STORAGE_KEY,
    String(volume)
  );
}

/** Hydrates ambience volume from localStorage once on the client. */
export function initializingWorldPlazaAmbienceVolumeStoreFromStorage(): void {
  const storedVolume = readingWorldPlazaAmbienceVolumeFromStorage();

  if (managingWorldPlazaAmbienceVolumeState.volume === storedVolume) {
    return;
  }

  managingWorldPlazaAmbienceVolumeState.volume = storedVolume;
  notifyingWorldPlazaAmbienceVolumeSubscribers();
}

/** Returns the current ambience volume (0–1). */
export function gettingWorldPlazaAmbienceVolume(): number {
  if (!DEFINING_WORLD_PLAZA_AMBIENCE_ENABLED) {
    return 0;
  }

  return managingWorldPlazaAmbienceVolumeState.volume;
}

/** Sets ambience volume and notifies subscribers. */
export function settingWorldPlazaAmbienceVolume(volume: number): void {
  const clampedVolume = clampingWorldPlazaAmbienceVolume(volume);

  if (managingWorldPlazaAmbienceVolumeState.volume === clampedVolume) {
    return;
  }

  managingWorldPlazaAmbienceVolumeState.volume = clampedVolume;
  writingWorldPlazaAmbienceVolumeToStorage(clampedVolume);
  notifyingWorldPlazaAmbienceVolumeSubscribers();
}

/** Subscribes to ambience volume changes. */
export function subscribingWorldPlazaAmbienceVolume(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaAmbienceVolumeSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaAmbienceVolumeSubscribers.delete(onStoreChange);
  };
}

function notifyingWorldPlazaAmbienceVolumeSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaAmbienceVolumeSubscribers) {
    onStoreChange();
  }
}
