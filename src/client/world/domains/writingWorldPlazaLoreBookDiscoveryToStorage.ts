/**
 * Persists unlocked lore book ids to localStorage.
 *
 * @module components/world/domains/writingWorldPlazaLoreBookDiscoveryToStorage
 */

import { resolvingWorldPlazaLoreBookDiscoveryStorageKey } from '@/components/world/domains/definingWorldPlazaLoreBookDiscoveryConstants';

/**
 * Writes unlocked Corpus volume ids to localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 * @param unlockedBookIds - Volume ids the player has unlocked.
 */
export function writingWorldPlazaLoreBookDiscoveryToStorage(
  storageOwnerId: string | null,
  unlockedBookIds: ReadonlySet<string>
): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(
    resolvingWorldPlazaLoreBookDiscoveryStorageKey(storageOwnerId),
    JSON.stringify([...unlockedBookIds].sort())
  );
}
