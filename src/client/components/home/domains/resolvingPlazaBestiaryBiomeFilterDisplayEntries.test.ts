import { resolvingPlazaBestiaryBiomeFilterDisplayEntries } from '@/components/home/domains/resolvingPlazaBestiaryBiomeFilterDisplayEntries';
import { describe, expect, it } from 'vitest';

describe('resolvingPlazaBestiaryBiomeFilterDisplayEntries', () => {
  it('keeps All and explored biome labels, masks the rest as ???', () => {
    const entries = resolvingPlazaBestiaryBiomeFilterDisplayEntries(
      [
        { id: 'all', label: 'All' },
        { id: 'forest', label: 'Forest' },
        { id: 'rocky', label: 'Rocky' },
      ],
      new Set(['forest'])
    );

    expect(entries).toEqual([
      { id: 'all', label: 'All', isExplored: true },
      { id: 'forest', label: 'Forest', isExplored: true },
      { id: 'rocky', label: '???', isExplored: false },
    ]);
  });
});
