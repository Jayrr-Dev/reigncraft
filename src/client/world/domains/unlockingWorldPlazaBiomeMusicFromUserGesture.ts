/**
 * Bridges HUD controls to every plaza audio hook that needs a user-gesture unlock.
 *
 * @module components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture
 */

const unlockingWorldPlazaAudioPlaybackHandlers = new Set<() => void>();

let areWorldPlazaAudioUnlockListenersAttached = false;

/**
 * star-audio attaches one-shot unlock listeners per instance. If the player
 * interacts before a hook mounts, that instance never hears the gesture. Keep
 * persistent capture listeners so the first click, tap, or movement key unlocks
 * every registered plaza audio hook.
 */
function ensuringWorldPlazaAudioUnlockListenersAttached(): void {
  if (
    areWorldPlazaAudioUnlockListenersAttached ||
    typeof window === 'undefined'
  ) {
    return;
  }

  areWorldPlazaAudioUnlockListenersAttached = true;

  const handlingUserGesture = (event: Event): void => {
    if (event instanceof KeyboardEvent && event.repeat) {
      return;
    }

    unlockingWorldPlazaBiomeMusicFromUserGesture();
  };

  const listenerOptions: AddEventListenerOptions = { capture: true };

  window.addEventListener('pointerdown', handlingUserGesture, listenerOptions);
  window.addEventListener('keydown', handlingUserGesture, listenerOptions);
}

/**
 * Registers an audio unlock handler from a plaza star-audio hook.
 */
export function registeringWorldPlazaBiomeMusicUserGestureUnlock(
  unlockPlayback: () => void
): () => void {
  unlockingWorldPlazaAudioPlaybackHandlers.add(unlockPlayback);
  ensuringWorldPlazaAudioUnlockListenersAttached();

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
