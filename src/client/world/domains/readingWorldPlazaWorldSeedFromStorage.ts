/**
 * Reads the persisted plaza world generation seed from localStorage.
 *
 * @module components/world/domains/readingWorldPlazaWorldSeedFromStorage
 */

import { resolvingWorldPlazaWorldSeedStorageKey } from '@/components/world/domains/definingWorldPlazaWorldSeedConstants';

/**
 * Reads the world generation seed for one session owner.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 * @returns Seed number, or null when unset / invalid.
 */
export function readingWorldPlazaWorldSeedFromStorage(
  storageOwnerId: string | null
): number | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = localStorage.getItem(
      resolvingWorldPlazaWorldSeedStorageKey(storageOwnerId)
    );

    if (rawValue === null) {
      return null;
    }

    const parsedValue = Number(rawValue);

    if (!Number.isFinite(parsedValue)) {
      return null;
    }

    return parsedValue | 0;
  } catch {
    return null;
  }
}
