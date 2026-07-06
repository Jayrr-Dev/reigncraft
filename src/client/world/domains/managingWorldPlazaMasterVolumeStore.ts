/**
 * Module-level store for plaza master volume.
 *
 * @module components/world/domains/managingWorldPlazaMasterVolumeStore
 */

import {
  DEFINING_WORLD_PLAZA_MASTER_VOLUME_DEFAULT,
  DEFINING_WORLD_PLAZA_MASTER_VOLUME_STORAGE_KEY,
} from '@/components/world/domains/definingWorldPlazaMasterVolumeConstants';

/** Mutable master volume state shared across plaza components. */
const managingWorldPlazaMasterVolumeState: {
  volume: number;
} = {
  volume: DEFINING_WORLD_PLAZA_MASTER_VOLUME_DEFAULT,
};

/** React subscribers notified when master volume changes. */
const managingWorldPlazaMasterVolumeSubscribers = new Set<() => void>();

/**
 * Clamps a raw volume value to the 0–1 range.
 *
 * @param volume - Unclamped volume
 */
function clampingWorldPlazaMasterVolume(volume: number): number {
  if (!Number.isFinite(volume)) {
    return DEFINING_WORLD_PLAZA_MASTER_VOLUME_DEFAULT;
  }

  return Math.min(1, Math.max(0, volume));
}

/**
 * Reads the persisted master volume from localStorage.
 */
function readingWorldPlazaMasterVolumeFromStorage(): number {
  if (typeof window === 'undefined') {
    return DEFINING_WORLD_PLAZA_MASTER_VOLUME_DEFAULT;
  }

  const storedValue = window.localStorage.getItem(
    DEFINING_WORLD_PLAZA_MASTER_VOLUME_STORAGE_KEY
  );

  if (storedValue === null) {
    return DEFINING_WORLD_PLAZA_MASTER_VOLUME_DEFAULT;
  }

  return clampingWorldPlazaMasterVolume(Number.parseFloat(storedValue));
}

/**
 * Persists master volume to localStorage.
 *
 * @param volume - Clamped master volume
 */
function writingWorldPlazaMasterVolumeToStorage(volume: number): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    DEFINING_WORLD_PLAZA_MASTER_VOLUME_STORAGE_KEY,
    String(volume)
  );
}

/**
 * Hydrates master volume from localStorage once on the client.
 */
export function initializingWorldPlazaMasterVolumeStoreFromStorage(): void {
  const storedVolume = readingWorldPlazaMasterVolumeFromStorage();

  if (managingWorldPlazaMasterVolumeState.volume === storedVolume) {
    return;
  }

  managingWorldPlazaMasterVolumeState.volume = storedVolume;
  notifyingWorldPlazaMasterVolumeSubscribers();
}

/**
 * Returns the current master volume (0–1).
 */
export function gettingWorldPlazaMasterVolume(): number {
  return managingWorldPlazaMasterVolumeState.volume;
}

/**
 * Sets master volume and notifies subscribers.
 *
 * @param volume - Desired master volume (0–1)
 */
export function settingWorldPlazaMasterVolume(volume: number): void {
  const clampedVolume = clampingWorldPlazaMasterVolume(volume);

  if (managingWorldPlazaMasterVolumeState.volume === clampedVolume) {
    return;
  }

  managingWorldPlazaMasterVolumeState.volume = clampedVolume;
  writingWorldPlazaMasterVolumeToStorage(clampedVolume);
  notifyingWorldPlazaMasterVolumeSubscribers();
}

/**
 * Subscribes to master volume changes.
 *
 * @param onStoreChange - Callback invoked when volume changes
 */
export function subscribingWorldPlazaMasterVolume(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaMasterVolumeSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaMasterVolumeSubscribers.delete(onStoreChange);
  };
}

/**
 * Notifies React subscribers that master volume changed.
 */
function notifyingWorldPlazaMasterVolumeSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaMasterVolumeSubscribers) {
    onStoreChange();
  }
}
