/**
 * Persists the plaza world generation seed to localStorage.
 *
 * @module components/world/domains/writingWorldPlazaWorldSeedToStorage
 */

import { resolvingWorldPlazaWorldSeedStorageKey } from '@/components/world/domains/definingWorldPlazaWorldSeedConstants';

/**
 * Writes the world generation seed for one session owner.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 * @param worldSeed - Seed to persist.
 */
export function writingWorldPlazaWorldSeedToStorage(
  storageOwnerId: string | null,
  worldSeed: number
): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(
    resolvingWorldPlazaWorldSeedStorageKey(storageOwnerId),
    String(worldSeed | 0)
  );
}
