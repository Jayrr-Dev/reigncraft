import { describe, expect, it } from 'vitest';

import { resolvingPlazaBookSfxUrl } from '@/components/home/domains/resolvingPlazaBookSfxUrl';

describe('resolvingPlazaBookSfxUrl', () => {
  it('builds browser-safe public URLs for book UI clips', () => {
    expect(resolvingPlazaBookSfxUrl('book_open')).toBe(
      '/inventory/sfx/400-sounds-items/book-open.ogg'
    );
    expect(resolvingPlazaBookSfxUrl('book_close')).toBe(
      '/inventory/sfx/400-sounds-items/book-close.ogg'
    );
    expect(resolvingPlazaBookSfxUrl('page_turn')).toBe(
      '/inventory/sfx/400-sounds-items/page-turn.ogg'
    );
  });
});
