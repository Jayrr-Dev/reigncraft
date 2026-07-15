import {
  DEFINING_PLAZA_LORE_BOOKS,
  DEFINING_PLAZA_LORE_BOOK_CHAPTERS,
} from '@/components/home/domains/definingPlazaLoreBookConstants';
import {
  listingPlazaLoreBooks,
  resolvingPlazaLoreBookById,
  resolvingPlazaLoreBookChapters,
} from '@/components/home/domains/resolvingPlazaLoreBookDefinition';
import { describe, expect, it } from 'vitest';

describe('resolvingPlazaLoreBookDefinition', () => {
  it('covers every chapter across the bound volumes exactly once', () => {
    const chapterIdsFromBooks = DEFINING_PLAZA_LORE_BOOKS.flatMap(
      (book) => book.chapterIds
    );
    const uniqueChapterIds = new Set(chapterIdsFromBooks);
    const allChapterIds = DEFINING_PLAZA_LORE_BOOK_CHAPTERS.map(
      (chapter) => chapter.id
    );

    expect(uniqueChapterIds.size).toBe(chapterIdsFromBooks.length);
    expect([...uniqueChapterIds].sort()).toEqual([...allChapterIds].sort());
  });

  it('resolves a volume with its chapters in reading order', () => {
    const book = resolvingPlazaLoreBookById('book-iii-climb');

    expect(book?.volumeLabel).toBe('Book III');
    expect(book?.title).toBe('Of Climb and Core');
    expect(book?.chapters.map((chapter) => chapter.id)).toEqual([
      'the-ladder',
      'spritcore',
    ]);
    expect(resolvingPlazaLoreBookById('not-a-real-book')).toBeNull();
  });

  it('lists shelf volumes with non-empty chapter sets', () => {
    const books = listingPlazaLoreBooks();

    expect(books).toHaveLength(DEFINING_PLAZA_LORE_BOOKS.length);
    for (const book of books) {
      expect(book.chapters.length).toBeGreaterThan(0);
      expect(resolvingPlazaLoreBookChapters(book)).toEqual(book.chapters);
    }
  });
});
