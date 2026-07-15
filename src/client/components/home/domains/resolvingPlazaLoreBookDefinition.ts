/**
 * Resolves lore book volumes and their chapter subsets from declarative data.
 *
 * @module components/home/domains/resolvingPlazaLoreBookDefinition
 */

import {
  DEFINING_PLAZA_LORE_BOOKS,
  DEFINING_PLAZA_LORE_BOOK_CHAPTERS,
  type PlazaLoreBookChapter,
  type PlazaLoreBookDefinition,
} from '@/components/home/domains/definingPlazaLoreBookConstants';

/** A book definition with chapters already resolved in reading order. */
export type PlazaLoreBookResolved = PlazaLoreBookDefinition & {
  chapters: readonly PlazaLoreBookChapter[];
};

/** Resolves chapter ids on a book definition into chapter records. */
export function resolvingPlazaLoreBookChapters(
  book: PlazaLoreBookDefinition
): readonly PlazaLoreBookChapter[] {
  return book.chapterIds.flatMap((chapterId) => {
    const chapter = DEFINING_PLAZA_LORE_BOOK_CHAPTERS.find(
      (candidate) => candidate.id === chapterId
    );

    return chapter ? [chapter] : [];
  });
}

/** Finds a book by id and attaches its resolved chapters, or null. */
export function resolvingPlazaLoreBookById(
  bookId: string
): PlazaLoreBookResolved | null {
  const book = DEFINING_PLAZA_LORE_BOOKS.find(
    (candidate) => candidate.id === bookId
  );

  if (!book) {
    return null;
  }

  return {
    ...book,
    chapters: resolvingPlazaLoreBookChapters(book),
  };
}

/** Lists every volume with chapters resolved, in shelf order. */
export function listingPlazaLoreBooks(): readonly PlazaLoreBookResolved[] {
  return DEFINING_PLAZA_LORE_BOOKS.map((book) => ({
    ...book,
    chapters: resolvingPlazaLoreBookChapters(book),
  }));
}
