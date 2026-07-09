import { DEFINING_PLAZA_LORE_BOOK_CHAPTERS } from '@/components/home/domains/definingPlazaLoreBookConstants';
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

  it('keeps entry ids unique across the whole book', () => {
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

  it('walks next and previous across chapter boundaries', () => {
    const pages = listingPlazaLoreBookPages();
    const lastOfFirstChapter =
      DEFINING_PLAZA_LORE_BOOK_CHAPTERS[0]!.entries.at(-1)!;
    const firstOfSecondChapter =
      DEFINING_PLAZA_LORE_BOOK_CHAPTERS[1]!.entries[0]!;

    expect(
      resolvingPlazaLoreBookAdjacentPage(lastOfFirstChapter.id, 'next')?.entry
        .id
    ).toBe(firstOfSecondChapter.id);
    expect(
      resolvingPlazaLoreBookAdjacentPage(firstOfSecondChapter.id, 'previous')
        ?.entry.id
    ).toBe(lastOfFirstChapter.id);
    expect(
      resolvingPlazaLoreBookAdjacentPage(pages[0]!.entry.id, 'previous')
    ).toBeNull();
    expect(
      resolvingPlazaLoreBookAdjacentPage(pages.at(-1)!.entry.id, 'next')
    ).toBeNull();
  });

  it('resolves the first entry of a chapter for bookmark jumps', () => {
    expect(resolvingPlazaLoreBookChapterFirstEntryId('torn-pages')).toBe(
      'the-far-shore'
    );
    expect(resolvingPlazaLoreBookChapterFirstEntryId('unknown')).toBeNull();
  });
});
