import { DEFINING_PLAZA_LORE_BOOK_ILLUSTRATIONS_BY_ENTRY_ID } from '@/components/home/domains/definingPlazaLoreBookIllustrationConstants';
import { resolvingPlazaLoreBookIllustration } from '@/components/home/domains/resolvingPlazaLoreBookIllustration';
import { describe, expect, it } from 'vitest';

describe('resolvingPlazaLoreBookIllustration', () => {
  it('returns the registered illustration for known entries', () => {
    expect(resolvingPlazaLoreBookIllustration('corpus')).toEqual(
      DEFINING_PLAZA_LORE_BOOK_ILLUSTRATIONS_BY_ENTRY_ID.corpus
    );
    expect(resolvingPlazaLoreBookIllustration('the-cucco')?.id).toBe('cucco');
  });

  it('returns null for entries without an illustration', () => {
    expect(resolvingPlazaLoreBookIllustration('the-succession')).toBeNull();
    expect(resolvingPlazaLoreBookIllustration('not-a-real-entry')).toBeNull();
  });
});
