/**
 * Persists the bonded companion roster to localStorage.
 *
 * @module components/world/wildlife/pets/domains/writingWildlifePetRosterToStorage
 */

import { resolvingWildlifePetRosterStorageKey } from '@/components/world/wildlife/pets/domains/definingWildlifePetRosterConstants';
import type { DefiningWildlifePetRoster } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';
import { serializingWildlifePetRoster } from '@/components/world/wildlife/pets/domains/serializingWildlifePetRoster';

/**
 * Writes the pet roster to localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 * @param roster - Pet roster to persist.
 */
export function writingWildlifePetRosterToStorage(
  storageOwnerId: string | null,
  roster: DefiningWildlifePetRoster
): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    resolvingWildlifePetRosterStorageKey(storageOwnerId),
    JSON.stringify(serializingWildlifePetRoster(roster))
  );
}
