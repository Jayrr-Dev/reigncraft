/**
 * Bridges HUD controls to biome music unlock without coupling components to the hook.
 *
 * @module components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture
 */

let unlockingWorldPlazaBiomeMusicPlayback: (() => void) | null = null;

/**
 * Registers the active biome music unlock handler from {@link usingWorldPlazaBiomeMusic}.
 */
export function registeringWorldPlazaBiomeMusicUserGestureUnlock(
  unlockPlayback: () => void
): () => void {
  unlockingWorldPlazaBiomeMusicPlayback = unlockPlayback;

  return () => {
    if (unlockingWorldPlazaBiomeMusicPlayback === unlockPlayback) {
      unlockingWorldPlazaBiomeMusicPlayback = null;
    }
  };
}

/**
 * Unlocks or retries biome music from an explicit user gesture (slider, tap, key).
 */
export function unlockingWorldPlazaBiomeMusicFromUserGesture(): void {
  unlockingWorldPlazaBiomeMusicPlayback?.();
}
