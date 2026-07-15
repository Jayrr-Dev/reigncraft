/**
 * Reads unlocked lore book ids from localStorage.
 *
 * @module components/world/domains/readingWorldPlazaLoreBookDiscoveryFromStorage
 */

import { DEFINING_PLAZA_LORE_BOOKS } from '@/components/home/domains/definingPlazaLoreBookConstants';
import { resolvingWorldPlazaLoreBookDiscoveryStorageKey } from '@/components/world/domains/definingWorldPlazaLoreBookDiscoveryConstants';

const DEFINING_PLAZA_LORE_BOOK_ID_SET = new Set(
  DEFINING_PLAZA_LORE_BOOKS.map((book) => book.id)
);

/**
 * Reads unlocked Corpus volume ids from localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function readingWorldPlazaLoreBookDiscoveryFromStorage(
  storageOwnerId: string | null
): ReadonlySet<string> {
  if (typeof window === 'undefined') {
    return new Set();
  }

  try {
    const rawValue = localStorage.getItem(
      resolvingWorldPlazaLoreBookDiscoveryStorageKey(storageOwnerId)
    );

    if (!rawValue) {
      return new Set();
    }

    const parsedValue = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return new Set();
    }

    return new Set(
      parsedValue.filter(
        (bookId): bookId is string =>
          typeof bookId === 'string' &&
          DEFINING_PLAZA_LORE_BOOK_ID_SET.has(bookId)
      )
    );
  } catch {
    return new Set();
  }
}
