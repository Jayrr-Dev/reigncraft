import { describe, expect, it } from 'vitest';

import { resolvingPlazaBookSfxUrl } from '@/components/home/domains/resolvingPlazaBookSfxUrl';

describe('resolvingPlazaBookSfxUrl', () => {
  it('builds browser-safe public URLs for book UI clips', () => {
    expect(resolvingPlazaBookSfxUrl('book_open')).toBe(
      '/sfx/400-sounds-items/book-open.wav'
    );
    expect(resolvingPlazaBookSfxUrl('book_close')).toBe(
      '/sfx/400-sounds-items/book-close.wav'
    );
    expect(resolvingPlazaBookSfxUrl('page_turn')).toBe(
      '/sfx/400-sounds-items/page-turn.wav'
    );
  });
});
