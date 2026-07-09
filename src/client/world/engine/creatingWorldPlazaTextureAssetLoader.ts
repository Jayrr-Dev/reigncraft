/**
 * Generic peek/preload texture asset loader factory.
 *
 * @module components/world/engine/creatingWorldPlazaTextureAssetLoader
 */

/** One registered texture asset with a deduped preload promise. */
export type DefiningWorldPlazaTextureAssetLoader<T> = {
  readonly id: string;
  peek: () => T | null;
  preload: () => Promise<T>;
  isReady: () => boolean;
};

/**
 * Creates a module-style texture loader with peek/preload caching.
 *
 * @param options - Stable asset id and async load function.
 */
export function creatingWorldPlazaTextureAssetLoader<T>(options: {
  readonly id: string;
  readonly load: () => Promise<T>;
}): DefiningWorldPlazaTextureAssetLoader<T> {
  let cachedValue: T | null = null;
  let preloadPromise: Promise<T> | null = null;

  return {
    id: options.id,
    peek: () => cachedValue,
    isReady: () => cachedValue !== null,
    preload: async () => {
      if (cachedValue !== null) {
        return cachedValue;
      }

      if (preloadPromise) {
        return preloadPromise;
      }

      preloadPromise = options
        .load()
        .then((loadedValue) => {
          cachedValue = loadedValue;
          return loadedValue;
        })
        .catch((error) => {
          // Clear so a later preload can retry after a transient failure.
          preloadPromise = null;
          throw error;
        });

      return preloadPromise;
    },
  };
}
