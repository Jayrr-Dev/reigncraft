/**
 * Shared registry for declarative animation playback entries that opt out of
 * per-sprite `useTick` and advance from one parent ticker instead.
 *
 * Wildlife mounts dozens of animated sprites; one shared advance pass avoids
 * N Pixi tick callbacks per frame.
 *
 * @module components/world/animation/domains/managingWorldPlazaDeclarativeAnimationPlaybackRegistry
 */

export type ManagingWorldPlazaDeclarativeAnimationPlaybackEntry = {
  readonly advancePlayback: (deltaMs: number, nowMs: number) => void;
};

const managingWorldPlazaDeclarativeAnimationPlaybackEntries = new Set<ManagingWorldPlazaDeclarativeAnimationPlaybackEntry>();

/**
 * Registers one shared-tick playback entry. Returns an unsubscribe callback.
 */
export function registeringWorldPlazaDeclarativeAnimationPlaybackEntry(
  entry: ManagingWorldPlazaDeclarativeAnimationPlaybackEntry
): () => void {
  managingWorldPlazaDeclarativeAnimationPlaybackEntries.add(entry);

  return () => {
    managingWorldPlazaDeclarativeAnimationPlaybackEntries.delete(entry);
  };
}

/**
 * Advances every shared-tick playback entry once.
 */
export function advancingAllWorldPlazaDeclarativeAnimationPlayback(
  deltaMs: number,
  nowMs: number
): void {
  for (const entry of managingWorldPlazaDeclarativeAnimationPlaybackEntries) {
    entry.advancePlayback(deltaMs, nowMs);
  }
}
