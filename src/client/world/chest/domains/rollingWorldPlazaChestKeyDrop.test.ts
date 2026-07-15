import { rollingWorldPlazaChestKeyDrop } from '@/components/world/chest/domains/rollingWorldPlazaChestKeyDrop';
import { describe, expect, it } from 'vitest';

describe('rollingWorldPlazaChestKeyDrop', () => {
  it('returns false when the source is not active', () => {
    expect(
      rollingWorldPlazaChestKeyDrop(new Set(['shrub']), 'wildlife', 0)
    ).toBe(false);
  });

  it('returns true at chance boundary when the source is active', () => {
    expect(
      rollingWorldPlazaChestKeyDrop(new Set(['wildlife']), 'wildlife', 0, 0.03)
    ).toBe(true);
    expect(
      rollingWorldPlazaChestKeyDrop(
        new Set(['wildlife']),
        'wildlife',
        0.03,
        0.03
      )
    ).toBe(false);
  });
});
