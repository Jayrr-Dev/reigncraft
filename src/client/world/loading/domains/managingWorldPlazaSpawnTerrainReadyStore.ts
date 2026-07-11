/**
 * Tracks whether the first spawn-viewport heavy terrain sync has finished.
 *
 * Asset boot can finish before Pixi mounts; the boot gate keeps the loading
 * overlay up until this flips true so players do not see empty chunk pop-in.
 * Resets when the terrain sync shell unmounts (exit to home / remount).
 *
 * @module components/world/loading/domains/managingWorldPlazaSpawnTerrainReadyStore
 */

const managingWorldPlazaSpawnTerrainReadySubscribers = new Set<() => void>();

let managingWorldPlazaSpawnTerrainReady = false;

function publishingWorldPlazaSpawnTerrainReady(nextReady: boolean): void {
  if (managingWorldPlazaSpawnTerrainReady === nextReady) {
    return;
  }

  managingWorldPlazaSpawnTerrainReady = nextReady;
  managingWorldPlazaSpawnTerrainReadySubscribers.forEach((notify) => notify());
}

/** Subscribes to spawn-terrain ready changes; returns unsubscribe. */
export function subscribingWorldPlazaSpawnTerrainReady(
  onChange: () => void
): () => void {
  managingWorldPlazaSpawnTerrainReadySubscribers.add(onChange);

  return () => {
    managingWorldPlazaSpawnTerrainReadySubscribers.delete(onChange);
  };
}

/** Current spawn-terrain ready flag (stable between changes). */
export function peekingWorldPlazaSpawnTerrainReady(): boolean {
  return managingWorldPlazaSpawnTerrainReady;
}

/** Marks the first spawn-viewport heavy terrain sync as complete. */
export function markingWorldPlazaSpawnTerrainReady(): void {
  publishingWorldPlazaSpawnTerrainReady(true);
}

/** Clears ready so the next world mount waits for terrain again. */
export function resettingWorldPlazaSpawnTerrainReady(): void {
  publishingWorldPlazaSpawnTerrainReady(false);
}
