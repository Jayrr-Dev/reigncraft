/**
 * Bridges HUD controls to every plaza audio hook that needs a user-gesture unlock.
 *
 * @module components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture
 */

const unlockingWorldPlazaAudioPlaybackHandlers = new Set<() => void>();

/**
 * Registers an audio unlock handler from a plaza star-audio hook.
 */
export function registeringWorldPlazaBiomeMusicUserGestureUnlock(
  unlockPlayback: () => void
): () => void {
  unlockingWorldPlazaAudioPlaybackHandlers.add(unlockPlayback);

  return () => {
    unlockingWorldPlazaAudioPlaybackHandlers.delete(unlockPlayback);
  };
}

/**
 * Unlocks or retries every registered audio hook from an explicit user gesture.
 */
export function unlockingWorldPlazaBiomeMusicFromUserGesture(): void {
  for (const unlockPlayback of unlockingWorldPlazaAudioPlaybackHandlers) {
    unlockPlayback();
  }
}
