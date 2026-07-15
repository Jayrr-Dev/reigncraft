import { DEFINING_PLAZA_LORE_BOOK_CHAPTERS } from '@/components/home/domains/definingPlazaLoreBookConstants';
import { resolvingPlazaLoreBookById } from '@/components/home/domains/resolvingPlazaLoreBookDefinition';
import {
  listingPlazaLoreBookPages,
  resolvingPlazaLoreBookAdjacentPage,
  resolvingPlazaLoreBookChapterFirstEntryId,
  resolvingPlazaLoreBookPageByEntryId,
} from '@/components/home/domains/resolvingPlazaLoreBookNavigation';
import { describe, expect, it } from 'vitest';

describe('plaza lore book navigation', () => {
  it('flattens every chapter entry into sequential folio numbers', () => {
    const pages = listingPlazaLoreBookPages();
    const expectedCount = DEFINING_PLAZA_LORE_BOOK_CHAPTERS.reduce(
      (total, chapter) => total + chapter.entries.length,
      0
    );

    expect(pages).toHaveLength(expectedCount);
    expect(pages.map((page) => page.folioNumber)).toEqual(
      pages.map((_, index) => index + 1)
    );
  });

  it('keeps entry ids unique across the whole corpus', () => {
    const pages = listingPlazaLoreBookPages();
    const uniqueIds = new Set(pages.map((page) => page.entry.id));

    expect(uniqueIds.size).toBe(pages.length);
  });

  it('resolves a page by entry id together with its owning chapter', () => {
    const page = resolvingPlazaLoreBookPageByEntryId('the-cucco');

    expect(page?.entry.title).toBe('The Cucco');
    expect(page?.chapter.id).toBe('beasts-and-birds');
    expect(resolvingPlazaLoreBookPageByEntryId('not-a-real-entry')).toBeNull();
  });

  it('walks next and previous across chapter boundaries within a volume', () => {
    const roadBook = resolvingPlazaLoreBookById('book-iv-road');
    expect(roadBook).not.toBeNull();
    const chapters = roadBook!.chapters;
    const pages = listingPlazaLoreBookPages(chapters);
    const lastOfFirstChapter = chapters[0]!.entries.at(-1)!;
    const firstOfSecondChapter = chapters[1]!.entries[0]!;

    expect(
      resolvingPlazaLoreBookAdjacentPage(
        lastOfFirstChapter.id,
        'next',
        chapters
      )?.entry.id
    ).toBe(firstOfSecondChapter.id);
    expect(
      resolvingPlazaLoreBookAdjacentPage(
        firstOfSecondChapter.id,
        'previous',
        chapters
      )?.entry.id
    ).toBe(lastOfFirstChapter.id);
    expect(
      resolvingPlazaLoreBookAdjacentPage(
        pages[0]!.entry.id,
        'previous',
        chapters
      )
    ).toBeNull();
    expect(
      resolvingPlazaLoreBookAdjacentPage(
        pages.at(-1)!.entry.id,
        'next',
        chapters
      )
    ).toBeNull();
  });

  it('resolves the first entry of a chapter for bookmark jumps', () => {
    expect(resolvingPlazaLoreBookChapterFirstEntryId('torn-pages')).toBe(
      'the-far-shore'
    );
    expect(resolvingPlazaLoreBookChapterFirstEntryId('unknown')).toBeNull();
  });
});
