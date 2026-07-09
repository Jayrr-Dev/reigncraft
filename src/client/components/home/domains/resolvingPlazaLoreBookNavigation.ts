/**
 * Pure navigation helpers over the declarative lore book chapters.
 *
 * @module components/home/domains/resolvingPlazaLoreBookNavigation
 */

import {
  DEFINING_PLAZA_LORE_BOOK_CHAPTERS,
  type PlazaLoreBookChapter,
  type PlazaLoreBookEntry,
} from '@/components/home/domains/definingPlazaLoreBookConstants';

/** One entry paired with its owning chapter and folio (page) number. */
export type PlazaLoreBookPage = {
  chapter: PlazaLoreBookChapter;
  entry: PlazaLoreBookEntry;
  /** 1-based page number across the whole book, in reading order. */
  folioNumber: number;
};

/** Flattens chapters into reading-order pages with folio numbers. */
export function listingPlazaLoreBookPages(
  chapters: readonly PlazaLoreBookChapter[] = DEFINING_PLAZA_LORE_BOOK_CHAPTERS
): readonly PlazaLoreBookPage[] {
  return chapters.flatMap((chapter, chapterIndex) =>
    chapter.entries.map((entry, entryIndex) => ({
      chapter,
      entry,
      folioNumber:
        chapters
          .slice(0, chapterIndex)
          .reduce((total, previous) => total + previous.entries.length, 0) +
        entryIndex +
        1,
    }))
  );
}

/** Finds the page holding the given entry id, or null when unknown. */
export function resolvingPlazaLoreBookPageByEntryId(
  entryId: string,
  chapters: readonly PlazaLoreBookChapter[] = DEFINING_PLAZA_LORE_BOOK_CHAPTERS
): PlazaLoreBookPage | null {
  return (
    listingPlazaLoreBookPages(chapters).find(
      (page) => page.entry.id === entryId
    ) ?? null
  );
}

/**
 * Resolves the neighbouring page in reading order, crossing chapter
 * boundaries. Returns null at the ends of the book or for unknown ids.
 */
export function resolvingPlazaLoreBookAdjacentPage(
  entryId: string,
  direction: 'previous' | 'next',
  chapters: readonly PlazaLoreBookChapter[] = DEFINING_PLAZA_LORE_BOOK_CHAPTERS
): PlazaLoreBookPage | null {
  const pages = listingPlazaLoreBookPages(chapters);
  const currentIndex = pages.findIndex((page) => page.entry.id === entryId);

  if (currentIndex === -1) {
    return null;
  }

  const adjacentIndex =
    direction === 'next' ? currentIndex + 1 : currentIndex - 1;

  return pages[adjacentIndex] ?? null;
}

/** First entry id of the given chapter, or null for empty/unknown chapters. */
export function resolvingPlazaLoreBookChapterFirstEntryId(
  chapterId: string,
  chapters: readonly PlazaLoreBookChapter[] = DEFINING_PLAZA_LORE_BOOK_CHAPTERS
): string | null {
  const chapter = chapters.find((candidate) => candidate.id === chapterId);

  return chapter?.entries[0]?.id ?? null;
}
