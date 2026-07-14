/**
 * Reads the bonded companion roster from localStorage.
 *
 * @module components/world/wildlife/pets/domains/readingWildlifePetRosterFromStorage
 */

import { resolvingWildlifePetRosterStorageKey } from '@/components/world/wildlife/pets/domains/definingWildlifePetRosterConstants';
import type { DefiningWildlifePetRoster } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';
import {
  creatingEmptyWildlifePetRoster,
  parsingWildlifePetRoster,
} from '@/components/world/wildlife/pets/domains/serializingWildlifePetRoster';

/**
 * Reads the pet roster from localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function readingWildlifePetRosterFromStorage(
  storageOwnerId: string | null
): DefiningWildlifePetRoster {
  if (typeof window === 'undefined') {
    return creatingEmptyWildlifePetRoster();
  }

  try {
    const rawValue = window.localStorage.getItem(
      resolvingWildlifePetRosterStorageKey(storageOwnerId)
    );

    if (!rawValue) {
      return creatingEmptyWildlifePetRoster();
    }

    const { roster } = parsingWildlifePetRoster(JSON.parse(rawValue));

    return roster;
  } catch {
    return creatingEmptyWildlifePetRoster();
  }
}
