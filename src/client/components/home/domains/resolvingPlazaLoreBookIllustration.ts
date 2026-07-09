/**
 * Resolves which illustration (if any) belongs on a lore book entry.
 *
 * @module components/home/domains/resolvingPlazaLoreBookIllustration
 */

import {
  DEFINING_PLAZA_LORE_BOOK_ILLUSTRATIONS_BY_ENTRY_ID,
  type PlazaLoreBookIllustrationDefinition,
} from '@/components/home/domains/definingPlazaLoreBookIllustrationConstants';

/**
 * Looks up the illustration definition for a lore book entry id.
 */
export function resolvingPlazaLoreBookIllustration(
  entryId: string
): PlazaLoreBookIllustrationDefinition | null {
  return DEFINING_PLAZA_LORE_BOOK_ILLUSTRATIONS_BY_ENTRY_ID[entryId] ?? null;
}
