import { describe, expect, it } from 'vitest';
import {
  checkingPlazaHerbariumEntryMatchesCategoryFilter,
} from '@/components/home/domains/definingPlazaHerbariumCategoryFilter';

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
        { kind: 'berry', berryLootKind: 'tea_leaves' },
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
