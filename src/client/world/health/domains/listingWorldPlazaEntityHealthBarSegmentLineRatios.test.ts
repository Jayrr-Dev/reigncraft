import {
  computingWorldPlazaEntityHealthBarSegmentCount,
  listingWorldPlazaEntityHealthBarSegmentLineRatios,
} from '@/components/world/health/domains/listingWorldPlazaEntityHealthBarSegmentLineRatios';
import { describe, expect, it } from 'vitest';

describe('listingWorldPlazaEntityHealthBarSegmentLineRatios', () => {
  it('places nine dividers on a 1000 HP bar with 100 HP segments', () => {
    expect(
      listingWorldPlazaEntityHealthBarSegmentLineRatios(1000, 100)
    ).toEqual([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
  });

  it('places one divider on a 200 HP bar with 100 HP segments', () => {
    expect(listingWorldPlazaEntityHealthBarSegmentLineRatios(200, 100)).toEqual(
      [0.5]
    );
  });

  it('returns no dividers when max health fits in one segment', () => {
    expect(listingWorldPlazaEntityHealthBarSegmentLineRatios(100, 100)).toEqual(
      []
    );
  });
});

describe('computingWorldPlazaEntityHealthBarSegmentCount', () => {
  it('returns ten segments for 1000 HP with 100 HP chunks', () => {
    expect(computingWorldPlazaEntityHealthBarSegmentCount(1000, 100)).toBe(10);
  });

  it('returns one segment when max health fits in one chunk', () => {
    expect(computingWorldPlazaEntityHealthBarSegmentCount(100, 100)).toBe(1);
  });
});
