import { checkingPlazaHerbariumEntryMatchesCategoryFilter } from '@/components/home/domains/definingPlazaHerbariumCategoryFilter';
import { describe, expect, it } from 'vitest';

describe('checkingPlazaHerbariumEntryMatchesCategoryFilter', () => {
  it('puts clovers and tea leaves under Leaves', () => {
    expect(
      checkingPlazaHerbariumEntryMatchesCategoryFilter(
        { kind: 'clover' },
        'leaves'
      )
    ).toBe(true);
    expect(
      checkingPlazaHerbariumEntryMatchesCategoryFilter(
        { kind: 'berry', berryLootKind: 'nettle' },
        'leaves'
      )
    ).toBe(true);
    expect(
      checkingPlazaHerbariumEntryMatchesCategoryFilter(
        { kind: 'berry', berryLootKind: 'red_berry' },
        'leaves'
      )
    ).toBe(false);
  });

  it('keeps fruit berries under Berries only', () => {
    expect(
      checkingPlazaHerbariumEntryMatchesCategoryFilter(
        { kind: 'berry', berryLootKind: 'red_berry' },
        'berry'
      )
    ).toBe(true);
    expect(
      checkingPlazaHerbariumEntryMatchesCategoryFilter(
        { kind: 'berry', berryLootKind: 'tea_leaves' },
        'berry'
      )
    ).toBe(false);
  });
});
