/**
 * Session-scoped store for the single-player "This a dev load" QA world.
 *
 * When enabled: compact all-biome grid, frozen wildlife AI, no aggro.
 * Dev panel / wildlife spawner stay available via existing dev mode flags.
 *
 * @module components/world/domains/managingWorldPlazaDevQaLoadStore
 */

/** Mutable QA load state shared across plaza systems. */
const managingWorldPlazaDevQaLoadState: {
  isEnabled: boolean;
  revision: number;
} = {
  isEnabled: false,
  revision: 0,
};

/** React subscribers notified when QA load toggles. */
const managingWorldPlazaDevQaLoadSubscribers = new Set<() => void>();

/**
 * Clears procedural terrain caches without creating a module load cycle.
 */
function invalidatingWorldPlazaProceduralGenerationCachesDeferred(): void {
  void import(
    '@/components/world/domains/invalidatingWorldPlazaProceduralGenerationCaches'
  ).then((invalidatingModule) => {
    invalidatingModule.invalidatingWorldPlazaProceduralGenerationCaches();
  });
}

function notifyingWorldPlazaDevQaLoadSubscribers(): void {
  for (const subscriber of managingWorldPlazaDevQaLoadSubscribers) {
    subscriber();
  }
}

/**
 * Returns true when the compact QA world override is active.
 */
export function checkingWorldPlazaDevQaLoadEnabled(): boolean {
  return managingWorldPlazaDevQaLoadState.isEnabled;
}

/**
 * Returns a monotonic revision bumped whenever QA load toggles.
 */
export function readingWorldPlazaDevQaLoadRevision(): number {
  return managingWorldPlazaDevQaLoadState.revision;
}

/**
 * Enables the QA world for the current session and invalidates terrain caches.
 */
export function enablingWorldPlazaDevQaLoad(): void {
  if (managingWorldPlazaDevQaLoadState.isEnabled) {
    return;
  }

  managingWorldPlazaDevQaLoadState.isEnabled = true;
  managingWorldPlazaDevQaLoadState.revision += 1;
  invalidatingWorldPlazaProceduralGenerationCachesDeferred();
  notifyingWorldPlazaDevQaLoadSubscribers();
}

/**
 * Disables the QA world (e.g. when returning to the home screen).
 */
export function disablingWorldPlazaDevQaLoad(): void {
  if (!managingWorldPlazaDevQaLoadState.isEnabled) {
    return;
  }

  managingWorldPlazaDevQaLoadState.isEnabled = false;
  managingWorldPlazaDevQaLoadState.revision += 1;
  invalidatingWorldPlazaProceduralGenerationCachesDeferred();
  notifyingWorldPlazaDevQaLoadSubscribers();
}

/**
 * Subscribes to QA load enable/disable changes.
 *
 * @param subscriber - Callback invoked on each toggle.
 * @returns Unsubscribe function.
 */
export function subscribingWorldPlazaDevQaLoad(
  subscriber: () => void
): () => void {
  managingWorldPlazaDevQaLoadSubscribers.add(subscriber);

  return () => {
    managingWorldPlazaDevQaLoadSubscribers.delete(subscriber);
  };
}
